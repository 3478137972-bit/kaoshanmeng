"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        // 检查客户端会话
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        // 检查 cookies
        const cookies = document.cookie.split(';').map(c => c.trim())
        const supabaseCookies = cookies.filter(c => c.startsWith('sb-'))

        // 调用服务端 API 检查
        const apiResponse = await fetch('/api/debug-auth')
        const apiData = await apiResponse.json()

        setDebugInfo({
          client: {
            session: session ? {
              expiresAt: session.expires_at,
              hasAccessToken: !!session.access_token,
              hasRefreshToken: !!session.refresh_token,
            } : null,
            sessionError: sessionError?.message || null,
            user: user ? {
              id: user.id,
              email: user.email,
            } : null,
            userError: userError?.message || null,
          },
          cookies: {
            total: cookies.length,
            supabaseCookies: supabaseCookies.length,
            list: supabaseCookies,
          },
          server: apiData,
        })
      } catch (error) {
        setDebugInfo({
          error: error instanceof Error ? error.message : '未知错误'
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">认证诊断</h1>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">认证诊断</h1>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-3">客户端状态</h2>
            <pre className="bg-muted p-4 rounded overflow-auto text-sm">
              {JSON.stringify(debugInfo?.client, null, 2)}
            </pre>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-3">Cookies 状态</h2>
            <pre className="bg-muted p-4 rounded overflow-auto text-sm">
              {JSON.stringify(debugInfo?.cookies, null, 2)}
            </pre>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-3">服务端状态</h2>
            <pre className="bg-muted p-4 rounded overflow-auto text-sm">
              {JSON.stringify(debugInfo?.server, null, 2)}
            </pre>
          </div>

          {debugInfo?.error && (
            <div className="bg-destructive/10 border border-destructive p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3 text-destructive">错误</h2>
              <p className="text-destructive">{debugInfo.error}</p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">操作</h2>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              刷新页面
            </button>
            <button
              onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
            >
              退出登录
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 inline-block"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
