import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
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

    // 先尝试获取会话
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('获取会话失败:', sessionError)
      return NextResponse.json(
        { error: '未登录或会话已过期', details: sessionError.message },
        { status: 401 }
      )
    }

    if (!session) {
      console.error('会话不存在，可能是 cookie 未正确传递')
      return NextResponse.json(
        { error: '未登录或会话已过期，请重新登录' },
        { status: 401 }
      )
    }

    // 从会话中获取用户信息
    const user = session.user

    if (!user) {
      console.error('会话中没有用户信息')
      return NextResponse.json(
        { error: '用户信息获取失败' },
        { status: 401 }
      )
    }

    // 查询用户的专属令牌
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('access_token')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('查询用户令牌失败:', profileError)
      return NextResponse.json(
        { error: '用户信息获取失败' },
        { status: 500 }
      )
    }

    // 验证用户提交的令牌是否与数据库中的令牌匹配
    if (token !== profile.access_token) {
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
      .eq('id', user.id)

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
