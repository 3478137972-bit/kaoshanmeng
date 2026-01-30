"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ChatConsole } from "@/components/dashboard/chat-console"
import { Editor } from "@/components/dashboard/editor"

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState("定位诊断师")
  const [editorContent, setEditorContent] = useState("")

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <ChatConsole
        activeAgent={activeItem}
        onContentGenerated={setEditorContent}
      />
      <Editor content={editorContent} />
    </div>
  )
}
