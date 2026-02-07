"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Trash2, GripHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export interface KnowledgeField {
  id: string
  title: string
  content: string
  height?: number // 自定义高度（像素）
}

interface StructuredEditorProps {
  value: KnowledgeField[]
  onChange: (fields: KnowledgeField[]) => void
  placeholder?: string
  showToc?: boolean
  onFieldClick?: (id: string) => void
}

export function StructuredEditor({
  value,
  onChange,
  placeholder = "输入内容...",
  showToc = true,
  onFieldClick,
}: StructuredEditorProps) {
  const fieldRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [resizingField, setResizingField] = useState<string | null>(null)
  const [startY, setStartY] = useState(0)
  const [startHeight, setStartHeight] = useState(0)

  // 暴露 scrollToField 方法给父组件
  useEffect(() => {
    if (onFieldClick) {
      // 父组件可以通过 onFieldClick 触发滚动
    }
  }, [onFieldClick])

  // 开始调整大小
  const handleResizeStart = (fieldId: string, e: React.MouseEvent) => {
    e.preventDefault()
    const field = value.find(f => f.id === fieldId)
    if (field) {
      setResizingField(fieldId)
      setStartY(e.clientY)
      setStartHeight(field.height || 500) // 默认高度 500px
    }
  }

  // 调整大小中
  useEffect(() => {
    if (!resizingField) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY
      const newHeight = Math.max(200, Math.min(1000, startHeight + deltaY)) // 限制在 200-1000px 之间

      onChange(
        value.map((field) =>
          field.id === resizingField ? { ...field, height: newHeight } : field
        )
      )
    }

    const handleMouseUp = () => {
      setResizingField(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizingField, startY, startHeight, value, onChange])
  const handleAddField = () => {
    const newField: KnowledgeField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: "",
      content: "",
    }
    onChange([...value, newField])
  }

  const handleRemoveField = (id: string) => {
    onChange(value.filter((field) => field.id !== id))
  }

  const handleFieldChange = (
    id: string,
    key: "title" | "content",
    newValue: string
  ) => {
    onChange(
      value.map((field) =>
        field.id === id ? { ...field, [key]: newValue } : field
      )
    )
  }

  const scrollToField = (id: string) => {
    const element = fieldRefs.current[id]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // 暴露 scrollToField 给父组件
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).scrollToKnowledgeField = scrollToField
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).scrollToKnowledgeField
      }
    }
  }, [])

  return (
    <div className={showToc ? "flex gap-6 h-full" : "space-y-4"}>
      {/* 左侧目录 */}
      {showToc && value.length > 0 && (
        <div className="w-64 shrink-0">
          <div className="sticky top-0">
            <h3 className="text-sm font-semibold mb-3 text-foreground">目录</h3>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-1">
                {value.map((field, index) => (
                  <button
                    key={field.id}
                    onClick={() => scrollToField(field.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-ring"
                    )}
                  >
                    <div className="truncate">
                      {field.title || `字段 ${index + 1}`}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* 右侧内容区 */}
      <div className={showToc ? "flex-1 space-y-4" : "space-y-4"}>
        {value.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">
              还没有字段，点击下方按钮添加第一个字段
            </p>
            <Button onClick={handleAddField} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              添加新字段
            </Button>
          </div>
        ) : (
          <>
            {value.map((field, index) => (
              <div
                key={field.id}
                id={`field-${field.id}`}
                ref={(el) => (fieldRefs.current[field.id] = el)}
                className="border border-border rounded-lg p-4 bg-card space-y-3 scroll-mt-4 relative"
              >
                <div className="flex items-center justify-between gap-3">
                  <Input
                    value={field.title}
                    onChange={(e) =>
                      handleFieldChange(field.id, "title", e.target.value)
                    }
                    placeholder={`字段 ${index + 1}`}
                    className="flex-1 font-medium"
                  />
                  <Button
                    onClick={() => handleRemoveField(field.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`content-${field.id}`}>内容</Label>
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: `${field.height || 500}px`,
                      minHeight: '200px'
                    }}
                  >
                    <RichTextEditor
                      value={field.content}
                      onChange={(newValue) =>
                        handleFieldChange(field.id, "content", newValue)
                      }
                      placeholder={placeholder}
                      editorClassName="min-h-[200px] overflow-y-auto h-full"
                    />
                  </div>
                </div>

                {/* 拖拽调整大小手柄 */}
                <div
                  className="flex items-center justify-center py-2 cursor-ns-resize hover:bg-accent/50 transition-colors rounded-md -mx-4 -mb-4 mt-2"
                  onMouseDown={(e) => handleResizeStart(field.id, e)}
                  title="拖拽调整高度"
                >
                  <GripHorizontal className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))}

            <Button onClick={handleAddField} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              添加新字段
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
