"use client"

import { useState, useEffect } from "react"
import { History, Trash2, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/lib/supabase"
import {
  getConversationsByAgent,
  deleteConversation,
  updateConversationTitle,
} from "@/lib/conversation"
import { useToast } from "@/hooks/use-toast"

interface ConversationHistoryProps {
  agentName: string
  currentConversationId: string | null
  onSelectConversation: (conversationId: string) => void
  onRefresh: () => void
}

export function ConversationHistory({
  agentName,
  currentConversationId,
  onSelectConversation,
  onRefresh,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // 加载对话列表
  const loadConversations = async () => {
    const data = await getConversationsByAgent(agentName)
    setConversations(data)
  }

  useEffect(() => {
    if (isOpen) {
      loadConversations()
    }
  }, [isOpen, agentName])

  // 删除对话
  const handleDelete = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm("确定要删除这条对话记录吗？")) {
      return
    }

    const success = await deleteConversation(conversationId)

    if (success) {
      toast({
        title: "删除成功",
        description: "对话记录已删除",
      })
      loadConversations()
      onRefresh()
    } else {
      toast({
        title: "删除失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 开始编辑标题
  const startEdit = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(conversation.id)
    setEditTitle(conversation.title)
  }

  // 保存标题
  const saveTitle = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!editTitle.trim()) {
      toast({
        title: "标题不能为空",
        variant: "destructive",
      })
      return
    }

    const success = await updateConversationTitle(conversationId, editTitle.trim())

    if (success) {
      toast({
        title: "更新成功",
        description: "对话标题已更新",
      })
      loadConversations()
      setEditingId(null)
    } else {
      toast({
        title: "更新失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 取消编辑
  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(null)
    setEditTitle("")
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return "今天"
    } else if (days === 1) {
      return "昨天"
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString("zh-CN", {
        month: "numeric",
        day: "numeric",
      })
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="历史记录"
        >
          <History className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-2 py-1.5 text-sm font-semibold">历史对话</div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {conversations.length === 0 ? (
            <div className="px-2 py-8 text-center text-sm text-muted-foreground">
              暂无历史记录
            </div>
          ) : (
            conversations.map((conversation) => (
              <DropdownMenuItem
                key={conversation.id}
                className={cn(
                  "flex items-center gap-2 px-2 py-2 cursor-pointer",
                  currentConversationId === conversation.id && "bg-accent"
                )}
                onSelect={() => onSelectConversation(conversation.id)}
              >
                <div className="flex-1 min-w-0">
                  {editingId === conversation.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-7 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveTitle(conversation.id, e as any)
                          } else if (e.key === "Escape") {
                            cancelEdit(e as any)
                          }
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={(e) => saveTitle(conversation.id, e)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={cancelEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm font-medium truncate">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(conversation.updated_at)}
                      </div>
                    </>
                  )}
                </div>
                {editingId !== conversation.id && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => startEdit(conversation, e)}
                      title="编辑标题"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={(e) => handleDelete(conversation.id, e)}
                      title="删除"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
