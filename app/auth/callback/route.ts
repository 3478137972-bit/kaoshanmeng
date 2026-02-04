import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('OAuth 回调开始:', {
    hasCode: !!code,
    url: requestUrl.toString(),
    cookies: request.cookies.getAll().map(c => c.name)
  })

  // 创建 redirect URL
  const redirectUrl = new URL(process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin)

  if (code) {
    // 创建 response 对象
    const response = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookies = request.cookies.getAll()
            console.log('getAll 被调用，返回 cookies:', cookies.length)
            return cookies
          },
          setAll(cookiesToSet) {
            console.log('setAll 被调用，设置 cookies:', cookiesToSet.length)
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log('设置 cookie:', {
                name,
                valueLength: value?.length || 0,
                options
              })
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('OAuth 回调错误:', error)
      // 即使出错也重定向，避免用户卡在回调页面
    } else {
      console.log('OAuth 登录成功:', {
        email: data.user?.email,
        userId: data.user?.id,
        hasSession: !!data.session,
        hasAccessToken: !!data.session?.access_token
      })
    }

    // 检查 response 中设置的 cookies
    console.log('Response cookies:', response.cookies.getAll().map(c => c.name))

    return response
  }

  // 如果没有 code，直接重定向
  return NextResponse.redirect(redirectUrl)
}

