"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

interface EmployeeCardProps {
  name: string
  departmentId: string
  className?: string
}

export function EmployeeCard({
  name,
  departmentId,
  className,
}: EmployeeCardProps) {
  return (
    <Link href={`/knowledge-base/${departmentId}/${encodeURIComponent(name)}`}>
      <Card
        className={cn(
          "hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/50",
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">
                {name}
              </h4>
              <p className="text-xs text-muted-foreground">
                点击编辑知识库
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
