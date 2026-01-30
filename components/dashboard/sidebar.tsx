"use client"

import { Mountain, Compass, Lightbulb, ShoppingCart, Package } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const departments = [
  {
    id: "strategy",
    label: "战略与顶层设计",
    icon: Compass,
    items: ["定位诊断师", "商业操盘手", "IP人设定位"],
  },
  {
    id: "content",
    label: "内容与增长部门",
    icon: Lightbulb,
    items: ["爆款选题策划", "吸睛文案生成器", "流量分析"],
  },
  {
    id: "sales",
    label: "销售与变现部门",
    icon: ShoppingCart,
    items: ["私信成交高手", "话术生成师"],
  },
  {
    id: "delivery",
    label: "交付与产品部门",
    icon: Package,
    items: ["MVP验证助手", "商业闭环诊断"],
  },
]

interface SidebarProps {
  activeItem: string
  onItemClick: (item: string) => void
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
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
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/avatar.png" alt="用户头像" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              盟
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">VIP · 盟主</span>
            </div>
            <Badge
              variant="secondary"
              className="mt-1 text-xs bg-primary/10 text-primary border-0"
            >
              靠山实战营
            </Badge>
          </div>
        </div>
      </div>
    </aside>
  )
}
