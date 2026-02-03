"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ChatConsole } from "@/components/dashboard/chat-console"
import { Editor } from "@/components/dashboard/editor"
import { TokenDialog } from "@/components/auth/token-dialog"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState("定位诊断师")
  const [editorContent, setEditorContent] = useState("")
  const [tokenVerified, setTokenVerified] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [isCheckingToken, setIsCheckingToken] = useState(true)
  const { toast } = useToast()

  // 检查令牌验证状态
  useEffect(() => {
    checkTokenStatus()
  }, [])

  const checkTokenStatus = async () => {
    try {
      const response = await fetch("/api/check-token")
      const data = await response.json()

      if (data.verified) {
        setTokenVerified(true)
      } else {
        setTokenVerified(false)
        if (data.expired) {
          toast({
            title: "访问权限已过期",
            description: "请重新输入访问令牌以继续使用",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("检查令牌状态失败:", error)
    } finally {
      setIsCheckingToken(false)
    }
  }

  const handleTokenSuccess = () => {
    setTokenVerified(true)
    toast({
      title: "验证成功",
      description: "您已获得访问权限",
    })
  }

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
      <TokenDialog
        open={showTokenDialog}
        onOpenChange={setShowTokenDialog}
        onSuccess={handleTokenSuccess}
      />
    </div>
  )
}
