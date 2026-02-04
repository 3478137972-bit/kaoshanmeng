import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('OAuth 回调:', {
    hasCode: !!code,
    url: requestUrl.toString()
  })

  // 将 code 作为 hash 参数传递给前端，让客户端处理
  const redirectUrl = new URL('/', requestUrl.origin)
  if (code) {
    redirectUrl.hash = `access_token=${code}`
  }

  return NextResponse.redirect(redirectUrl)
}

