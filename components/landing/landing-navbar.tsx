'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function LandingNavbar() {
  const [activeSection, setActiveSection] = useState('')

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="靠山盟"
                width={120}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                activeSection === 'features' ? 'text-orange-600' : 'text-gray-700'
              }`}
            >
              功能
            </button>
            <button
              onClick={() => scrollToSection('ai-system')}
              className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                activeSection === 'ai-system' ? 'text-orange-600' : 'text-gray-700'
              }`}
            >
              智能体
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                activeSection === 'faq' ? 'text-orange-600' : 'text-gray-700'
              }`}
            >
              常见问题
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
            >
              立即使用
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg"
            >
              立即使用
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
