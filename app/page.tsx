"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ChatConsole } from "@/components/dashboard/chat-console"
import { Editor } from "@/components/dashboard/editor"

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState("吸睛文案生成器")

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <ChatConsole activeAgent={activeItem} />
      <Editor />
    </div>
  )
}
