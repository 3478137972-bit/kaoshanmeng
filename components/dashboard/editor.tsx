"use client"

import { useState, useEffect } from "react"
import { Copy, Download, Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useToast } from "@/hooks/use-toast"

interface EditorProps {
  content: string
}

export function Editor({ content }: EditorProps) {
  const [editorContent, setEditorContent] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  // 当 AI 生成新内容时，更新编辑器
  useEffect(() => {
    if (content) {
      setEditorContent(content)
    }
  }, [content])

  // 复制到剪贴板
  const handleCopy = async () => {
    try {
      // 创建一个临时 div 来处理 HTML 内容
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = editorContent

      // 复制 HTML 格式到剪贴板
      const blob = new Blob([editorContent], { type: "text/html" })
      const clipboardItem = new ClipboardItem({ "text/html": blob })
      await navigator.clipboard.write([clipboardItem])

      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)

      toast({
        title: "复制成功",
        description: "内容已复制到剪贴板，可以直接粘贴到微信公众号",
      })
    } catch (error) {
      console.error("复制失败:", error)
      toast({
        title: "复制失败",
        description: "请手动选择内容进行复制",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/50 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-3 bg-card border-b border-border flex items-center justify-between shrink-0">
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
              disabled={!editorContent}
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
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
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-8">
            <div className="max-w-[680px] mx-auto">
              <article className="bg-card rounded-lg shadow-lg border border-border p-10 min-h-[800px]">
                {/* Document Content */}
                {editorContent ? (
                  <RichTextEditor
                    value={editorContent}
                    onChange={setEditorContent}
                    placeholder="AI 生成的内容将显示在这里，您可以编辑后复制到微信公众号..."
                    className="border-0"
                    editorClassName="min-h-[600px] max-h-none"
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-20">
                    <p className="text-lg">等待 AI 生成内容...</p>
                    <p className="text-sm mt-2">请在左侧对话框与 AI 员工互动</p>
                  </div>
                )}
              </article>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
