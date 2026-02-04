import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('OAuth 回调:', {
    hasCode: !!code,
    url: requestUrl.toString()
  })

  if (code) {
    // 将 code 作为 URL 参数传递给前端
    const redirectUrl = new URL('/', requestUrl.origin)
    redirectUrl.searchParams.set('code', code)
    return NextResponse.redirect(redirectUrl)
  }

  // 如果没有 code，直接重定向到首页
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
