import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 配置 runtime
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 创建 Supabase 客户端
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { verified: false, error: '未登录' },
        { status: 401 }
      )
    }

    // 查询用户配置
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('token_verified, token_verified_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('查询用户配置失败:', profileError)
      return NextResponse.json({
        verified: false,
        error: '查询失败',
      })
    }

    // 检查令牌是否已验证
    if (!profile || !profile.token_verified) {
      return NextResponse.json({
        verified: false,
      })
    }

    // 检查令牌是否过期（根据配置的有效期）
    const validityDays = parseInt(process.env.TOKEN_VALIDITY_DAYS || '30')
    const verifiedAt = new Date(profile.token_verified_at)
    const now = new Date()
    const daysSinceVerification = Math.floor(
      (now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceVerification > validityDays) {
      // 令牌已过期，重置验证状态
      await supabase
        .from('user_profiles')
        .update({ token_verified: false, token_verified_at: null })
        .eq('id', user.id)

      return NextResponse.json({
        verified: false,
        expired: true,
      })
    }

    return NextResponse.json({
      verified: true,
      verifiedAt: profile.token_verified_at,
    })
  } catch (error) {
    console.error('检查令牌状态错误:', error)
    return NextResponse.json(
      { verified: false, error: '服务器错误' },
      { status: 500 }
    )
  }
}
