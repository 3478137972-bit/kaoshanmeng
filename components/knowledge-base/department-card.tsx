"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DepartmentCardProps {
  id: string
  label: string
  icon: LucideIcon
  employeeCount: number
  className?: string
}

export function DepartmentCard({
  id,
  label,
  icon: Icon,
  employeeCount,
  className,
}: DepartmentCardProps) {
  return (
    <Link href={`/knowledge-base/${id}`}>
      <Card
        className={cn(
          "hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary/50",
          className
        )}
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {employeeCount} 个知识库
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
