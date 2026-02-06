"use client"

import { useEffect, useRef } from "react"

interface ResizableDividerProps {
  onResize: (deltaX: number) => void
}

export function ResizableDivider({ onResize }: ResizableDividerProps) {
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = e.clientX - startXRef.current
      startXRef.current = e.clientX
      onResize(deltaX)
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
  }, [onResize])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    startXRef.current = e.clientX
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }

  return (
    <div
      className="w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors relative group"
      onMouseDown={handleMouseDown}
    >
      {/* 扩大可点击区域 */}
      <div className="absolute inset-y-0 -left-1 -right-1 w-3" />

      {/* 悬停指示器 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-12 bg-primary/70 rounded-full" />
      </div>
    </div>
  )
}
