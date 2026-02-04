import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 获取当前用户
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 允许访问的公开路径
  const publicPaths = ['/auth/callback', '/', '/api', '/knowledge-base']
  const isPublicPath = publicPaths.some(path => {
    if (path === '/') {
      return req.nextUrl.pathname === '/'
    }
    return req.nextUrl.pathname.startsWith(path)
  })

  // 如果是公开路径，直接放行
  if (isPublicPath) {
    return res
  }

  // 如果未登录，重定向到登录页（首页）
  if (!session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     * - public 文件夹中的文件
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
