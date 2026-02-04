"use client"

import { useState, useEffect } from "react"
import { Compass, Lightbulb, ShoppingCart, Package, Loader2, ArrowLeft } from "lucide-react"
import { DepartmentCard } from "@/components/knowledge-base/department-card"
import { Sidebar } from "@/components/dashboard/sidebar"
import { LoginPage } from "@/components/auth/login-page"
import { PasswordGate } from "@/components/auth/password-gate"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const departments = [
  {
    id: "strategy",
    label: "战略部门",
    icon: Compass,
    employeeCount: 6,
    employees: [
      "定位诊断师",
      "商业操盘手",
      "IP人设定位师",
      "用户画像分析师",
      "IP账号定位师",
      "IP传记采访师",
    ],
  },
  {
    id: "content",
    label: "内容与增长部门",
    icon: Lightbulb,
    employeeCount: 6,
    employees: [
      "平台与流量模式选择",
      "爆款选题策划师",
      "吸睛文案生成器",
      "朋友圈操盘手",
      "每周复盘教练",
      "个人品牌顾问",
    ],
  },
  {
    id: "sales",
    label: "销售部门",
    icon: ShoppingCart,
    employeeCount: 6,
    employees: [
      "私信成交高手",
      "产品定价策略顾问",
      "话术生成师",
      "实时顾问（私域成交）",
      "对话分析师",
      "朋友圈写手",
    ],
  },
  {
    id: "delivery",
    label: "交付部门",
    icon: Package,
    employeeCount: 3,
    employees: [
      "个人技能产品化策划师",
      "MVP验证助手",
      "商业闭环诊断师",
    ],
  },
]

export default function KnowledgeBasePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log('=== 知识库页面加载 ===')
    console.log('当前 URL:', window.location.href)
    console.log('sessionStorage password_verified:', sessionStorage.getItem('password_verified'))
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    console.log('开始检查认证状态...')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('用户认证状态:', !!user)
      setIsLoggedIn(!!user)
    } catch (error) {
      console.error("检查认证状态失败:", error)
      setIsLoggedIn(false)
    } finally {
      setIsCheckingAuth(false)
      console.log('认证检查完成')
    }
  }

  // 处理侧边栏员工点击，跳转到主页面对话界面
  const handleEmployeeClick = (employeeName: string) => {
    // 跳转到主页面，并通过 URL 参数传递员工名称
    router.push(`/?employee=${encodeURIComponent(employeeName)}`)
  }

  if (isCheckingAuth) {
    console.log('渲染：正在检查认证状态...')
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
    console.log('渲染：未登录，显示登录页面')
    return <LoginPage />
  }

  console.log('渲染：已登录，显示知识库内容（通过 PasswordGate）')
  return (
    <PasswordGate
      title="访问验证"
      description="请输入密码以访问靠山实战营"
    >
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar activeItem="" onItemClick={handleEmployeeClick} />
        <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
          {/* Header */}
          <header className="px-6 py-4 bg-card border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回主页
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">个人知识库</h1>
                <p className="text-sm text-muted-foreground">管理您的21个AI员工知识库</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.map((dept) => (
                  <DepartmentCard
                    key={dept.id}
                    id={dept.id}
                    label={dept.label}
                    icon={dept.icon}
                    employeeCount={dept.employeeCount}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PasswordGate>
  )
}

