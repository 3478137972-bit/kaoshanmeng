"use client"

import { useState, useEffect } from "react"
import { Compass, Lightbulb, ShoppingCart, Package, Loader2, ArrowLeft } from "lucide-react"
import { EmployeeCard } from "@/components/knowledge-base/employee-card"
import { Sidebar } from "@/components/dashboard/sidebar"
import { LoginPage } from "@/components/auth/login-page"
import { PasswordGate } from "@/components/auth/password-gate"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"

const departmentsData = {
  strategy: {
    label: "战略部门",
    icon: Compass,
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
    label: "内容与增长部门",
    icon: Lightbulb,
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
    label: "销售部门",
    icon: ShoppingCart,
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
    label: "交付部门",
    icon: Package,
    employees: [
      "个人技能产品化策划师",
      "MVP验证助手",
      "商业闭环诊断师",
    ],
  },
}

export default function DepartmentKnowledgeBasePage() {
  const params = useParams()
  const router = useRouter()
  const departmentId = params.departmentId as string
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const department = departmentsData[departmentId as keyof typeof departmentsData]

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

  if (!department) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">部门不存在</p>
          <Link href="/knowledge-base">
            <Button className="mt-4">返回知识库</Button>
          </Link>
        </div>
      </div>
    )
  }

  const DepartmentIcon = department.icon

  return (
    <PasswordGate
      title="访问验证"
      description="请输入密码以访问靠山实战营"
    >
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar activeItem="" onItemClick={handleEmployeeClick} />
        <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
          {/* Header */}
          <header className="px-6 py-4 bg-card border-b border-border shrink-0">
            <div className="flex items-center gap-4 mb-2">
              <Link href="/knowledge-base">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DepartmentIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{department.label}</h1>
                <p className="text-sm text-muted-foreground">
                  {department.employees.length} 个知识库
                </p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {department.employees.map((employee) => (
                  <EmployeeCard
                    key={employee}
                    name={employee}
                    departmentId={departmentId}
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

