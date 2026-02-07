"use client"

import { useState, useEffect, useRef } from "react"
import { FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { markdownToHtml } from "@/lib/markdown-utils"

interface EditorProps {
  content: string
}

export function Editor({ content }: EditorProps) {
  const [editorContent, setEditorContent] = useState("")
  const [documentWidth, setDocumentWidth] = useState(680) // 文档宽度
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  // 当 AI 生成新内容时，更新编辑器
  useEffect(() => {
    if (content) {
      // 将 Markdown 转换为 HTML
      const htmlContent = markdownToHtml(content)
      setEditorContent(htmlContent)
    }
  }, [content])

  // 处理拖动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = e.clientX - startXRef.current
      const newWidth = Math.max(400, Math.min(1200, startWidthRef.current + deltaX * 2))
      setDocumentWidth(newWidth)
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    startXRef.current = e.clientX
    startWidthRef.current = documentWidth
    document.body.style.cursor = "ew-resize"
    document.body.style.userSelect = "none"
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/50 overflow-hidden">
      {/* Header */}
      <header className="h-[72px] px-5 bg-card border-b border-border flex items-center justify-between shrink-0">
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
            <div className="mx-auto relative group" style={{ width: `${documentWidth}px` }}>
              <article className="bg-card rounded-lg shadow-lg border border-border p-10 min-h-[800px] relative">
                {/* Document Content */}
                <RichTextEditor
                  value={editorContent}
                  onChange={setEditorContent}
                  placeholder="在这里输入或编辑内容，AI 生成的内容也会显示在这里。编辑完成后可以复制到微信公众号..."
                  className="border-0"
                  editorClassName="min-h-[600px] max-h-none"
                />
              </article>

              {/* 左侧拖动手柄 */}
              <div
                className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={handleMouseDown}
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-primary/70 rounded-full" />
              </div>

              {/* 右侧拖动手柄 */}
              <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={handleMouseDown}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-primary/70 rounded-full" />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
