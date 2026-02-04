import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

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
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
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
      console.log('OAuth 登录成功:', data.user?.email)
    }

    return response
  }

  // 如果没有 code，直接重定向
  return NextResponse.redirect(redirectUrl)
}

