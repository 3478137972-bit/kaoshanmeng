'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ShowcaseItem {
  id: number
  title: string
  description: string
  image: string
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: 1,
    title: '可以帮我做个短视频账号内容定位吗？',
    description: '当然可以！这是你的账户定位：\n\n账号定位五要素结构表\n\n要素：定义说明、包含内容\n价值：账号提供给用户的实用利益和故事属性...',
    image: '/placeholder-1.png'
  },
  {
    id: 2,
    title: 'AI 智能内容生成',
    description: '基于先进的 AI 技术，快速生成高质量内容，提升创作效率，让创意无限延伸。',
    image: '/placeholder-2.png'
  },
  {
    id: 3,
    title: '多场景应用支持',
    description: '支持短视频、文案、营销等多种场景，满足不同创作需求，一站式解决方案。',
    image: '/placeholder-3.png'
  }
]

export function CarouselShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseItems.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseItems.length)
  }

  const currentItem = showcaseItems[currentIndex]

  return (
    <div className="relative">
      {/* Carousel Content */}
      <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 shadow-lg min-h-[400px]">
        <div className="mb-6">
          <div className="inline-block px-4 py-2 bg-orange-100 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-orange-900">{currentItem.title}</h3>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <p className="text-gray-700 whitespace-pre-line">{currentItem.description}</p>
          </div>
        </div>

        {/* Placeholder Image */}
        <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center">
          <span className="text-orange-300 text-sm">图片占位符</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center mt-6 space-x-4">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all hover:bg-orange-50"
          aria-label="上一个"
        >
          <ChevronLeft className="w-5 h-5 text-orange-600" />
        </button>

        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {showcaseItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-orange-600 w-8' : 'bg-orange-200'
              }`}
              aria-label={`跳转到第 ${index + 1} 项`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all hover:bg-orange-50"
          aria-label="下一个"
        >
          <ChevronRight className="w-5 h-5 text-orange-600" />
        </button>
      </div>
    </div>
  )
}
