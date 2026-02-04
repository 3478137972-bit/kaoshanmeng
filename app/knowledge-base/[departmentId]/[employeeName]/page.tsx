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
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// 部门数据映射
const departmentsData = {
  strategy: {
    employees: [
      "定位诊断师",
      "商业操盘手",
      "IP人设定位师",
      "用户画像分析师",
      "IP账号定位师",
      "IP传记采访师",
    ],
  },
  content: {
    employees: [
      "平台与流量模式选择",
      "爆款选题策划师",
      "吸睛文案生成器",
      "朋友圈操盘手",
      "每周复盘教练",
      "个人品牌顾问",
    ],
  },
  sales: {
    employees: [
      "私信成交高手",
      "产品定价策略顾问",
      "话术生成师",
      "实时顾问（私域成交）",
      "对话分析师",
      "朋友圈写手",
    ],
  },
  delivery: {
    employees: [
      "个人技能产品化策划师",
      "MVP验证助手",
      "商业闭环诊断师",
    ],
  },
}

export default function EmployeeKnowledgeBasePage() {
  const params = useParams()
  const router = useRouter()
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

  // 处理侧边栏员工点击，导航到对应的知识库页面
  const handleEmployeeClick = (employeeName: string) => {
    // 查找员工所属的部门
    const foundDept = Object.entries(departmentsData).find(([_, dept]) =>
      dept.employees.includes(employeeName)
    )

    if (foundDept) {
      const [deptId] = foundDept
      router.push(`/knowledge-base/${deptId}/${employeeName}`)
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
        <Sidebar activeItem={employeeName} onItemClick={handleEmployeeClick} />
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

