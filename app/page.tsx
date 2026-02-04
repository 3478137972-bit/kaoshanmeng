"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ChatConsole } from "@/components/dashboard/chat-console"
import { Editor } from "@/components/dashboard/editor"
import { TokenVerificationPage } from "@/components/auth/token-verification-page"
import { LoginPage } from "@/components/auth/login-page"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState("定位诊断师")
  const [editorContent, setEditorContent] = useState("")
  const [tokenVerified, setTokenVerified] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const { toast } = useToast()

  // 检查登录和令牌验证状态
  useEffect(() => {
    // 处理 OAuth 回调
    const handleOAuthCallback = async () => {
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        const code = hash.split('=')[1]
        if (code) {
          try {
            // 在客户端交换 code 为 session
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (error) {
              console.error('交换 session 失败:', error)
              toast({
                title: "登录失败",
                description: error.message,
                variant: "destructive",
              })
            } else {
              // 清除 hash
              window.location.hash = ''
              toast({
                title: "登录成功",
                description: "正在加载...",
              })
            }
          } catch (error) {
            console.error('处理 OAuth 回调失败:', error)
          }
        }
      }
    }

    handleOAuthCallback().then(() => {
      checkAuthStatus()
    })
  }, [])

  const checkAuthStatus = async () => {
    try {
      // 1. 检查是否登录
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsLoggedIn(false)
        setIsCheckingAuth(false)
        return
      }

      setIsLoggedIn(true)

      // 2. 检查令牌验证状态
      const response = await fetch("/api/check-token")
      const data = await response.json()

      if (data.verified) {
        setTokenVerified(true)
      } else {
        setTokenVerified(false)
        // 自动显示令牌输入对话框
        setShowTokenDialog(true)
        if (data.expired) {
          toast({
            title: "访问权限已过期",
            description: "请重新输入访问令牌以继续使用",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("检查认证状态失败:", error)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleTokenSuccess = () => {
    setTokenVerified(true)
    setShowTokenDialog(false)
    toast({
      title: "验证成功",
      description: "您已获得访问权限",
    })
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

  // 已登录但未验证令牌 - 显示令牌验证页面
  if (isLoggedIn && !tokenVerified) {
    return <TokenVerificationPage onSuccess={handleTokenSuccess} />
  }

  // 已登录且已验证令牌 - 显示主界面
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <ChatConsole
        activeAgent={activeItem}
        onContentGenerated={setEditorContent}
        tokenVerified={tokenVerified}
        onRequestToken={() => setShowTokenDialog(true)}
      />
      <Editor content={editorContent} />
    </div>
  )
}

