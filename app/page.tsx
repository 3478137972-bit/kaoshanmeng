"use client"

import { useState, useEffect, Suspense } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ChatConsole } from "@/components/dashboard/chat-console"
import { Editor } from "@/components/dashboard/editor"
import { LoginPage } from "@/components/auth/login-page"
import { PasswordGate } from "@/components/auth/password-gate"
import { ResizableDivider } from "@/components/ui/resizable-divider"
import { supabase } from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

// 将使用 useSearchParams 的逻辑提取到单独的组件中
function DashboardContent() {
  const searchParams = useSearchParams()
  const employeeFromUrl = searchParams.get('employee')

  const [activeItem, setActiveItem] = useState(employeeFromUrl || "定位诊断师")
  const [editorContent, setEditorContent] = useState("")
  const [chatWidth, setChatWidth] = useState(600) // 聊天控制台宽度
  const [isChatCollapsed, setIsChatCollapsed] = useState(false) // 聊天控制台折叠状态

  // 当 URL 参数变化时，更新选中的员工
  useEffect(() => {
    if (employeeFromUrl) {
      setActiveItem(decodeURIComponent(employeeFromUrl))
    }
  }, [employeeFromUrl])

  // 处理分隔条拖动
  const handleResize = (deltaX: number) => {
    setChatWidth((prev) => {
      // 限制最小和最大宽度
      const minWidth = 500 // 增加最小宽度以确保文本不被压缩
      const maxWidth = 800
      const newWidth = Math.max(minWidth, Math.min(maxWidth, prev + deltaX))
      return newWidth
    })
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <div
        style={{ width: isChatCollapsed ? '48px' : `${chatWidth}px` }}
        className="shrink-0 transition-all duration-300"
      >
        <ChatConsole
          activeAgent={activeItem}
          onContentGenerated={setEditorContent}
          tokenVerified={true}
          onRequestToken={() => {}}
          isCollapsed={isChatCollapsed}
          onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)}
        />
      </div>
      {!isChatCollapsed && <ResizableDivider onResize={handleResize} />}
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

  // 已登录 - 显示主界面（需要令牌验证）
  return (
    <PasswordGate
      title="访问令牌验证"
      description="请输入您的专属访问令牌"
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

