import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 配置 runtime
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    // 验证令牌是否为空
    if (!token) {
      return NextResponse.json(
        { error: '请输入访问令牌' },
        { status: 400 }
      )
    }

    // 创建 Supabase 客户端（使用 service role key，可以绕过 RLS）
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 直接通过令牌查找用户
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('access_token', token)
      .single()

    if (profileError || !profile) {
      console.error('令牌无效或不存在:', profileError)
      return NextResponse.json(
        { error: '访问令牌无效' },
        { status: 403 }
      )
    }

    // 更新用户配置，标记令牌已验证
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        token_verified: true,
        token_verified_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    if (updateError) {
      console.error('更新用户配置失败:', updateError)
      return NextResponse.json(
        { error: '验证失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '访问令牌验证成功',
    })
  } catch (error) {
    console.error('令牌验证错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
