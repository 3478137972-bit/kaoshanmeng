"use client"

import { useState } from "react"
import { Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "ai" | "user"
  content: string
  isCard?: boolean
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content: "盟主你好，我是你的文案生成器。请告诉我你的产品主题和目标人群。",
    isCard: true,
  },
  {
    id: "2",
    role: "user",
    content: "帮我写一篇关于职场效率的小红书笔记，要带点焦虑感。",
  },
  {
    id: "3",
    role: "ai",
    content: "收到，正在为你生成痛点前置的文案...",
  },
]

interface ChatConsoleProps {
  activeAgent: string
}

export function ChatConsole({ activeAgent }: ChatConsoleProps) {
  const [messages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  return (
    <div className="w-[420px] shrink-0 bg-muted flex flex-col h-full border-r border-border">
      {/* Header */}
      <header className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {activeAgent}
            </h2>
          </div>
          <Badge variant="secondary" className="text-xs gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            靠山团队 · 在线
          </Badge>
        </div>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  message.role === "ai"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.role === "ai" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "max-w-[280px] rounded-xl px-4 py-3",
                  message.role === "ai"
                    ? "bg-card border border-border"
                    : "bg-primary text-primary-foreground",
                  message.isCard && "border-primary/20 border-2"
                )}
              >
                {message.isCard && (
                  <div className="flex items-center gap-1.5 mb-2 text-xs text-primary font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                    SOP 引导
                  </div>
                )}
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    message.role === "ai"
                      ? "text-foreground"
                      : "text-primary-foreground"
                  )}
                >
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="给员工下达指令..."
            className="min-h-[80px] resize-none bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div className="flex justify-end mt-3">
          <Button className="gap-2">
            <Send className="w-4 h-4" />
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}
