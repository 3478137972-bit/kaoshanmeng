"use client"

import { Copy, Download, Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Editor() {
  return (
    <div className="flex-1 flex flex-col h-full bg-muted/50">
      {/* Header */}
      <header className="px-6 py-3 bg-card border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">交付文档库</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">当前任务.doc</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <Check className="w-3 h-3 text-green-600" />
            已自动保存
          </Badge>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="w-4 h-4" />
              <span className="sr-only">复制</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="w-4 h-4" />
              <span className="sr-only">导出</span>
            </Button>
          </div>
        </div>
      </header>

      {/* A4 Paper Container */}
      <ScrollArea className="flex-1 p-8">
        <div className="max-w-[680px] mx-auto">
          <article className="bg-card rounded-lg shadow-lg border border-border p-10 min-h-[800px]">
            {/* Document Content */}
            <div className="prose prose-neutral max-w-none">
              <h1 className="text-2xl font-bold text-foreground mb-6 text-balance">
                入职第一周，我差点崩溃（附SOP）
              </h1>

              <p className="text-muted-foreground text-sm mb-6">
                作者：靠山盟 AI · 生成时间：2024年1月
              </p>

              <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">
                一、开篇：焦虑的第一周
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                还记得入职第一天吗？电脑不会开、系统不会用、同事的名字记不住、领导交代的任务一个都没听懂……
              </p>
              <p className="text-foreground leading-relaxed mb-4">
                那种感觉，就像被扔进了一个完全陌生的世界，所有人都在快速运转，只有你在原地发呆。
              </p>

              <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">
                二、问题拆解：为什么会崩溃？
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                经过复盘，我发现新人焦虑的核心原因有三个：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
                <li>信息过载：一天接收的信息量超过了处理能力</li>
                <li>预期错位：以为自己应该立刻上手，实际需要适应期</li>
                <li>缺乏系统：没有一套清晰的工作流程可以依赖</li>
              </ul>

              <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">
                三、解决方案：我的职场效率SOP
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                后来我总结了一套方法，分享给所有职场新人：
              </p>

              <div className="bg-accent/50 rounded-lg p-4 mb-4 border border-primary/20">
                <p className="text-sm font-medium text-primary mb-2">📋 每日SOP清单</p>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-foreground">
                  <li>早上到公司先花10分钟规划今日任务</li>
                  <li>用番茄工作法处理重要任务</li>
                  <li>下班前15分钟复盘当日工作</li>
                  <li>记录问题，第二天请教前辈</li>
                </ol>
              </div>

              <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">
                四、总结
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                职场新人的焦虑是正常的，关键是要有一套系统来应对。希望这份SOP能帮到你，记得点赞收藏！
              </p>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  #职场效率 #新人入职 #工作SOP #职场干货 #效率提升
                </p>
              </div>
            </div>
          </article>
        </div>
      </ScrollArea>
    </div>
  )
}
