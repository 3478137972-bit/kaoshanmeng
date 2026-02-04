"use client"

import { useState, useEffect } from "react"
import { Mountain, Compass, Lightbulb, ShoppingCart, Package, LogOut, BookOpen } from "lucide-react"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { AuthDialog } from "@/components/auth/auth-dialog"
import type { User } from "@supabase/supabase-js"

const departments = [
  {
    id: "strategy",
    label: "战略部门",
    icon: Compass,
    items: [
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
    items: [
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
    items: [
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
    items: [
      "个人技能产品化策划师",
      "MVP验证助手",
      "商业闭环诊断师",
    ],
  },
]

interface SidebarProps {
  activeItem: string
  onItemClick: (item: string) => void
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  useEffect(() => {
    // 获取当前用户
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <aside className="w-[260px] shrink-0 bg-card border-r border-border flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Mountain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">靠山盟</h1>
            <p className="text-xs text-muted-foreground">AI 智能交付系统</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {/* 个人知识库 */}
        <Link
          href="/knowledge-base"
          className="block mb-3 py-2.5 px-3 hover:bg-muted rounded-lg text-sm font-medium cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span>个人知识库</span>
          </div>
        </Link>

        <Accordion
          type="single"
          collapsible
          defaultValue="content"
          className="space-y-1"
        >
          {departments.map((dept) => (
            <AccordionItem
              key={dept.id}
              value={dept.id}
              className="border-none"
            >
              <AccordionTrigger className="py-2.5 px-3 hover:no-underline hover:bg-muted rounded-lg text-sm font-medium">
                <div className="flex items-center gap-2.5">
                  <dept.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{dept.label}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-1">
                <div className="ml-6 space-y-0.5">
                  {dept.items.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => onItemClick(item)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        activeItem === item
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.user_metadata?.avatar_url} alt="用户头像" />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user.user_metadata?.name?.[0] || user.email?.[0] || "盟"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {user.user_metadata?.name || user.email?.split("@")[0] || "盟主"}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="mt-1 text-xs bg-primary/10 text-primary border-0"
                >
                  靠山实战营
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => setShowAuthDialog(true)}
          >
            登录
          </Button>
        )}
      </div>

      {/* Auth Dialog */}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </aside>
  )
}
