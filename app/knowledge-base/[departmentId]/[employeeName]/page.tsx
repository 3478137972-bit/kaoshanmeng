"use client"

import { useState, useEffect } from "react"
import { Loader2, ArrowLeft, Save, Check } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { LoginPage } from "@/components/auth/login-page"
import { PasswordGate } from "@/components/auth/password-gate"
import { supabase } from "@/lib/supabase"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function EmployeeKnowledgeBasePage() {
  const params = useParams()
  const departmentId = params.departmentId as string
  const employeeName = decodeURIComponent(params.employeeName as string)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      loadKnowledgeBase()
    }
  }, [isLoggedIn, employeeName])

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

  const loadKnowledgeBase = async () => {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      const { data, error } = await supabase
        .from('knowledge_bases')
        .select('*')
        .eq('user_id', user.id)
        .eq('employee_name', employeeName)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error("加载知识库失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载知识库内容",
          variant: "destructive",
        })
        return
      }

      if (data) {
        setContent(data.content || "")
        setLastSaved(new Date(data.updated_at))
      }
    } catch (error) {
      console.error("加载知识库失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveKnowledgeBase = async () => {
    try {
      setIsSaving(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "保存失败",
          description: "请先登录",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from('knowledge_bases')
        .upsert({
          user_id: user.id,
          employee_name: employeeName,
          department_id: departmentId,
          content: content,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,employee_name'
        })

      if (error) {
        console.error("保存知识库失败:", error)
        toast({
          title: "保存失败",
          description: error.message || "无法保存知识库内容",
          variant: "destructive",
        })
        return
      }

      setLastSaved(new Date())
      toast({
        title: "保存成功",
        description: "知识库内容已保存",
      })
    } catch (error) {
      console.error("保存知识库失败:", error)
      toast({
        title: "保存失败",
        description: "发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

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

  if (!isLoggedIn) {
    return <LoginPage />
  }

  return (
    <PasswordGate
      title="访问验证"
      description="请输入密码以访问靠山实战营"
    >
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar activeItem="" onItemClick={() => {}} />
        <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
          {/* Header */}
          <header className="px-6 py-4 bg-card border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={`/knowledge-base/${departmentId}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{employeeName}</h1>
                  <p className="text-sm text-muted-foreground">
                    {lastSaved
                      ? `最后保存: ${lastSaved.toLocaleString('zh-CN')}`
                      : "尚未保存"}
                  </p>
                </div>
              </div>
              <Button
                onClick={saveKnowledgeBase}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存
                  </>
                )}
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">正在加载知识库...</p>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder={`在这里输入 ${employeeName} 的知识库内容...`}
                  editorClassName="min-h-[600px] max-h-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PasswordGate>
  )
}

