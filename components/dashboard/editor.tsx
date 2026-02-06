"use client"

import { useState, useEffect } from "react"
import { FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { markdownToHtml } from "@/lib/markdown-utils"

interface EditorProps {
  content: string
}

export function Editor({ content }: EditorProps) {
  const [editorContent, setEditorContent] = useState("")

  // 当 AI 生成新内容时，更新编辑器
  useEffect(() => {
    if (content) {
      // 将 Markdown 转换为 HTML
      const htmlContent = markdownToHtml(content)
      setEditorContent(htmlContent)
    }
  }, [content])

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/50 overflow-hidden">
      {/* Header */}
      <header className="p-5 bg-card border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">交付文档库</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">当前任务.doc</span>
        </div>
      </header>

      {/* A4 Paper Container */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-8">
            <div className="max-w-[680px] mx-auto">
              <article className="bg-card rounded-lg shadow-lg border border-border p-10 min-h-[800px]">
                {/* Document Content */}
                <RichTextEditor
                  value={editorContent}
                  onChange={setEditorContent}
                  placeholder="在这里输入或编辑内容，AI 生成的内容也会显示在这里。编辑完成后可以复制到微信公众号..."
                  className="border-0"
                  editorClassName="min-h-[600px] max-h-none"
                />
              </article>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
