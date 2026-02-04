"use client"

import { useRef, useEffect, useState } from "react"
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, Undo, Redo, RemoveFormatting } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  editorClassName?: string // 编辑区域的自定义样式
}

// 将 HTML 转换为带内联样式的格式（适合微信公众号）
const convertToInlineStyles = (html: string): string => {
  // 检查是否在浏览器环境中
  if (typeof document === "undefined") {
    return html
  }

  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html

  // 处理段落
  tempDiv.querySelectorAll("p").forEach((el) => {
    el.setAttribute("style", "margin: 0.5em 0; line-height: 1.6;")
  })

  // 处理标题
  tempDiv.querySelectorAll("h1").forEach((el) => {
    el.setAttribute("style", "font-size: 2em; font-weight: bold; margin: 0.67em 0;")
  })
  tempDiv.querySelectorAll("h2").forEach((el) => {
    el.setAttribute("style", "font-size: 1.5em; font-weight: bold; margin: 0.75em 0;")
  })
  tempDiv.querySelectorAll("h3").forEach((el) => {
    el.setAttribute("style", "font-size: 1.17em; font-weight: bold; margin: 0.83em 0;")
  })

  // 处理加粗
  tempDiv.querySelectorAll("b, strong").forEach((el) => {
    el.setAttribute("style", "font-weight: bold;")
  })

  // 处理斜体
  tempDiv.querySelectorAll("i, em").forEach((el) => {
    el.setAttribute("style", "font-style: italic;")
  })

  // 处理下划线
  tempDiv.querySelectorAll("u").forEach((el) => {
    el.setAttribute("style", "text-decoration: underline;")
  })

  // 处理列表
  tempDiv.querySelectorAll("ul").forEach((el) => {
    el.setAttribute("style", "list-style-type: disc; margin: 1em 0; padding-left: 2em;")
  })
  tempDiv.querySelectorAll("ol").forEach((el) => {
    el.setAttribute("style", "list-style-type: decimal; margin: 1em 0; padding-left: 2em;")
  })
  tempDiv.querySelectorAll("li").forEach((el) => {
    el.setAttribute("style", "margin: 0.5em 0;")
  })

  return tempDiv.innerHTML
}

export function RichTextEditor({
  value,
  onChange,
  onKeyDown,
  placeholder = "输入内容...",
  disabled = false,
  className,
  editorClassName,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // 初始化编辑器内容
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  // 执行格式化命令
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  // 处理输入变化
  const handleInput = () => {
    if (editorRef.current) {
      let html = editorRef.current.innerHTML
      // 转换为内联样式
      html = convertToInlineStyles(html)
      onChange(html)
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  // 工具栏按钮配置
  const toolbarButtons = [
    { icon: Undo, command: "undo", title: "撤销 (Ctrl+Z)", divider: false },
    { icon: Redo, command: "redo", title: "重做 (Ctrl+Y)", divider: true },
    { icon: Bold, command: "bold", title: "加粗 (Ctrl+B)", divider: false },
    { icon: Italic, command: "italic", title: "斜体 (Ctrl+I)", divider: false },
    { icon: Underline, command: "underline", title: "下划线 (Ctrl+U)", divider: true },
    { icon: Heading1, command: "formatBlock", value: "h1", title: "一级标题", divider: false },
    { icon: Heading2, command: "formatBlock", value: "h2", title: "二级标题", divider: false },
    { icon: Heading3, command: "formatBlock", value: "h3", title: "三级标题", divider: false },
    { icon: RemoveFormatting, command: "formatBlock", value: "p", title: "正文/清除格式", divider: true },
    { icon: ListOrdered, command: "insertOrderedList", title: "有序列表", divider: false },
    { icon: List, command: "insertUnorderedList", title: "无序列表", divider: false },
  ]

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* 工具栏 */}
      <div className="flex items-center gap-1 p-2 bg-muted border-b">
        {toolbarButtons.map((button, index) => (
          <div key={index} className="flex items-center">
            <button
              type="button"
              onClick={() => execCommand(button.command, button.value)}
              disabled={disabled}
              className="p-1.5 hover:bg-background rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={button.title}
            >
              <button.icon className="w-4 h-4 text-muted-foreground" />
            </button>
            {button.divider && (
              <div className="w-px h-4 bg-border mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* 编辑区域 */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "min-h-[80px] max-h-[200px] overflow-y-auto p-3",
            "focus:outline-none",
            "prose prose-sm max-w-none",
            "overflow-x-hidden", // 隐藏横向溢出
            "word-wrap-break-word", // 在单词边界换行
            "[&_*]:max-w-full [&_*]:overflow-wrap-break-word", // 所有子元素限制宽度并换行
            "[&_p]:my-2 [&_p]:leading-relaxed",
            "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-2",
            "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-2",
            "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-1",
            "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2",
            "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2",
            "[&_li]:my-1",
            "[&_strong]:font-bold",
            "[&_em]:italic",
            "[&_u]:underline",
            "[&_br]:block",
            disabled && "opacity-50 cursor-not-allowed",
            editorClassName
          )}
          style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
          suppressContentEditableWarning
        />
        {/* 占位符 */}
        {!isFocused && !value && (
          <div className="absolute top-3 left-3 text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}
