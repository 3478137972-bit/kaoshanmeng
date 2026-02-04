"use client"

import { useState, useEffect, Suspense } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ChatConsole } from "@/components/dashboard/chat-console"
import { Editor } from "@/components/dashboard/editor"
import { LoginPage } from "@/components/auth/login-page"
import { PasswordGate } from "@/components/auth/password-gate"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

// 将使用 useSearchParams 的逻辑提取到单独的组件中
function DashboardContent() {
  const searchParams = useSearchParams()
  const employeeFromUrl = searchParams.get('employee')

  const [activeItem, setActiveItem] = useState(employeeFromUrl || "定位诊断师")
  const [editorContent, setEditorContent] = useState("")

  // 当 URL 参数变化时，更新选中的员工
  useEffect(() => {
    if (employeeFromUrl) {
      setActiveItem(decodeURIComponent(employeeFromUrl))
    }
  }, [employeeFromUrl])

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <ChatConsole
        activeAgent={activeItem}
        onContentGenerated={setEditorContent}
        tokenVerified={true}
        onRequestToken={() => {}}
      />
      <Editor content={editorContent} />
    </div>
  )
}

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 检查登录状态
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    } catch (error) {
      console.error("检查认证状态失败:", error)
      setIsLoggedIn(false)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  // 加载中状态
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">正在检查认证状态...</p>
        </div>
      </div>
    )
  }

  // 未登录状态 - 显示登录页面
  if (!isLoggedIn) {
    return <LoginPage />
  }

  // 已登录 - 显示主界面（需要密码验证）
  return (
    <PasswordGate
      title="访问验证"
      description="请输入密码以访问靠山实战营"
    >
      <Suspense fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </PasswordGate>
  )
}

