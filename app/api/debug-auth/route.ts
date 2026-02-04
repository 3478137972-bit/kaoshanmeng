import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()

    // 查找 Supabase 相关的 cookies
    const supabaseCookies = allCookies.filter(cookie =>
      cookie.name.startsWith('sb-')
    )

    // 创建 Supabase 客户端
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

    // 尝试获取用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    return NextResponse.json({
      success: true,
      debug: {
        totalCookies: allCookies.length,
        supabaseCookies: supabaseCookies.map(c => ({
          name: c.name,
          valueLength: c.value?.length || 0,
          hasValue: !!c.value
        })),
        user: user ? {
          id: user.id,
          email: user.email,
        } : null,
        userError: userError?.message || null,
        session: session ? {
          expiresAt: session.expires_at,
          hasAccessToken: !!session.access_token,
          hasRefreshToken: !!session.refresh_token,
        } : null,
        sessionError: sessionError?.message || null,
      }
    })
  } catch (error) {
    console.error('调试错误:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}
