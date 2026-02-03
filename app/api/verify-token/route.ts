import { createClient } from '@supabase/supabase-js'
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

    // 获取所有 cookies 并构建 cookie 字符串
    const allCookies = cookieStore.getAll()
    const cookieString = allCookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Cookie: cookieString,
          },
        },
      }
    )

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: '未登录或会话已过期' },
        { status: 401 }
      )
    }

    // 验证令牌
    const validToken = process.env.ACCESS_TOKEN
    if (token !== validToken) {
      return NextResponse.json(
        { error: '访问令牌无效' },
        { status: 403 }
      )
    }

    // 更新用户配置，标记令牌已验证
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        token_verified: true,
        token_verified_at: new Date().toISOString(),
      })

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
