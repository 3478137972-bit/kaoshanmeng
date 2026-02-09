'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ShowcaseItem {
  id: number
  question: string
  answer: string
  image: string
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: 1,
    question: '可以帮我做个短视频账号内容定位吗？',
    answer: '当然可以！这是你的账户定位：\n\n账号定位五要素结构表\n\n要素：定义说明、包含内容\n价值：账号提供给用户的实用利益和故事属性...',
    image: '/placeholder-1.png'
  },
  {
    id: 2,
    question: '我有了账号定位可以给我做一下账号运营的内容线部署吗？',
    answer: '以下是你的账号内容线部署框架。',
    image: '/placeholder-2.png'
  },
  {
    id: 3,
    question: 'AI 智能内容生成',
    answer: '基于先进的 AI 技术，快速生成高质量内容，提升创作效率，让创意无限延伸。',
    image: '/placeholder-3.png'
  }
]

export function CarouselShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    // 重置动画状态
    setShowAnswer(false)
    // 延迟显示回答，创建动画效果
    const timer = setTimeout(() => {
      setShowAnswer(true)
    }, 600)

    return () => clearTimeout(timer)
  }, [currentIndex])

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
      <div className="h-[500px] flex flex-col space-y-4">
        {/* Question Box */}
        <div className="transition-all duration-500 opacity-100 translate-y-0">
          <div className="bg-orange-50 rounded-2xl p-6 shadow-md flex items-start space-x-3">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-orange-700 text-lg">👤</span>
            </div>
            {/* Question Text */}
            <div className="flex-1">
              <p className="text-gray-900 font-medium text-lg">{currentItem.question}</p>
            </div>
          </div>
        </div>

        {/* Answer Box */}
        <div className={`flex-1 transition-all duration-700 ${showAnswer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{currentItem.answer}</p>
            </div>

            {/* Placeholder Image */}
            <div className="w-full h-32 mt-4 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center">
              <span className="text-orange-300 text-sm">图片占位符</span>
            </div>
          </div>
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
