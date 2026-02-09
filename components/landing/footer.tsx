'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">靠</span>
              </div>
              <span className="text-xl font-bold">靠山盟</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI 智能交付系统，让创作变得更简单
            </p>
            <p className="text-sm text-gray-500">
              © 2024 靠山盟. 保留所有权利。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/landing" className="text-gray-400 hover:text-orange-500 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                  开始使用
                </Link>
              </li>
              <li>
                <Link href="/knowledge-base" className="text-gray-400 hover:text-orange-500 transition-colors">
                  知识库
                </Link>
              </li>
              <li>
                <Link href="/billing" className="text-gray-400 hover:text-orange-500 transition-colors">
                  计费
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">支持</h3>
            <ul className="space-y-2">
              <li>
                <a href="#faq" className="text-gray-400 hover:text-orange-500 transition-colors">
                  常见问题
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  使用文档
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  联系我们
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>基于"亲爱的安先生"四年白媒体教学经验打造</p>
        </div>
      </div>
    </footer>
  )
}