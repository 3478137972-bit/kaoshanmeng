import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('OAuth 回调开始:', {
    hasCode: !!code,
    url: requestUrl.toString(),
  })

  if (code) {
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
            console.log('setAll 被调用，设置 cookies:', cookiesToSet.length)
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                console.log('设置 cookie:', {
                  name,
                  valueLength: value?.length || 0,
                  hasOptions: !!options
                })
                cookieStore.set(name, value, options || {})
              })
            } catch (error) {
              console.error('设置 cookie 失败:', error)
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('OAuth 回调错误:', error)
    } else {
      console.log('OAuth 登录成功:', {
        email: data.user?.email,
        userId: data.user?.id,
        hasSession: !!data.session,
        hasAccessToken: !!data.session?.access_token
      })
    }
  }

  // 登录成功后重定向到配置的应用URL或当前域名首页
  const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin
  return NextResponse.redirect(redirectUrl)
}

