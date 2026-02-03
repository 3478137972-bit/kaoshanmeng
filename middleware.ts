import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // 获取当前用户
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 允许访问的公开路径
  const publicPaths = ['/auth/callback']
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path))

  // 如果是公开路径，直接放行
  if (isPublicPath) {
    return res
  }

  // 如果未登录，重定向到登录页（实际上是主页，会显示登录对话框）
  if (!session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.searchParams.set('login', 'required')
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
