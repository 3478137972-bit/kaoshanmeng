"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Label } from "@/components/ui/label"

export interface KnowledgeField {
  id: string
  title: string
  content: string
}

interface StructuredEditorProps {
  value: KnowledgeField[]
  onChange: (fields: KnowledgeField[]) => void
  placeholder?: string
}

export function StructuredEditor({
  value,
  onChange,
  placeholder = "输入内容...",
}: StructuredEditorProps) {
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

  return (
    <div className="space-y-4">
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
              className="border border-border rounded-lg p-4 bg-card space-y-3"
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
                <RichTextEditor
                  value={field.content}
                  onChange={(newValue) =>
                    handleFieldChange(field.id, "content", newValue)
                  }
                  placeholder={placeholder}
                  editorClassName="min-h-[200px]"
                />
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
  )
}
