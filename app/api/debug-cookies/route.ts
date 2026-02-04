import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 获取所有 cookies
    const allCookies = request.cookies.getAll()

    // 查找 Supabase cookies
    const supabaseCookies = allCookies.filter(cookie =>
      cookie.name.includes('sb-') || cookie.name.includes('supabase')
    )

    // 获取请求头
    const cookieHeader = request.headers.get('cookie')

    return NextResponse.json({
      success: true,
      debug: {
        totalCookies: allCookies.length,
        allCookieNames: allCookies.map(c => c.name),
        supabaseCookies: supabaseCookies.map(c => ({
          name: c.name,
          valueLength: c.value?.length || 0,
          hasValue: !!c.value,
          valuePreview: c.value?.substring(0, 50) + '...'
        })),
        cookieHeader: cookieHeader ? {
          exists: true,
          length: cookieHeader.length,
          preview: cookieHeader.substring(0, 200) + '...'
        } : {
          exists: false
        },
        requestInfo: {
          url: request.url,
          method: request.method,
          headers: Object.fromEntries(request.headers.entries())
        }
      }
    })
  } catch (error) {
    console.error('Cookie 诊断错误:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}
