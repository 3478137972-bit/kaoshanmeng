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
  const [maxDocumentWidth, setMaxDocumentWidth] = useState(1200) // 最大文档宽度
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  const dragSideRef = useRef<'left' | 'right'>('right') // 记录拖动的是哪一侧
  const containerRef = useRef<HTMLDivElement>(null)

  // 当 AI 生成新内容时，更新编辑器
  useEffect(() => {
    if (content) {
      // 将 Markdown 转换为 HTML
      const htmlContent = markdownToHtml(content)
      setEditorContent(htmlContent)
    }
  }, [content])

  // 监听容器宽度变化，自动调整文档最大宽度
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width
        // 设置最大宽度为容器宽度减去边距（左右各50px）
        const newMaxWidth = Math.max(400, containerWidth - 100)
        setMaxDocumentWidth(newMaxWidth)

        // 如果当前文档宽度超过新的最大宽度，调整它
        setDocumentWidth((prev) => Math.min(prev, newMaxWidth))
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // 处理拖动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = e.clientX - startXRef.current
      let newWidth: number

      // 根据拖动的是哪一侧来计算新宽度
      if (dragSideRef.current === 'left') {
        // 左侧拖动：往左（外）拖变大，往右（里）拖变小
        newWidth = startWidthRef.current - deltaX * 2
      } else {
        // 右侧拖动：往右（外）拖变大，往左（里）拖变小
        newWidth = startWidthRef.current + deltaX * 2
      }

      // 限制宽度范围
      newWidth = Math.max(400, Math.min(maxDocumentWidth, newWidth))
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
  }, [maxDocumentWidth])

  const handleMouseDown = (e: React.MouseEvent, side: 'left' | 'right') => {
    isDraggingRef.current = true
    startXRef.current = e.clientX
    startWidthRef.current = documentWidth
    dragSideRef.current = side
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
      <div className="flex-1 overflow-hidden" ref={containerRef}>
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
                onMouseDown={(e) => handleMouseDown(e, 'left')}
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-primary/70 rounded-full" />
              </div>

              {/* 右侧拖动手柄 */}
              <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => handleMouseDown(e, 'right')}
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
