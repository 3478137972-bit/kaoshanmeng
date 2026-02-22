'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-orange-500 transition-colors">
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
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-orange-500 transition-colors">
                  用户服务协议
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 hover:text-orange-500 transition-colors">
                  退款政策
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                邮箱：992122851@qq.com
              </li>
              <li className="text-gray-400">
                网站：https://kaoshanmeng.cn
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-orange-500 transition-colors">
                  常见问题
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p className="mb-2">© 2026 靠山盟 版权所有</p>
          <p className="mb-2">主办单位：周恩山</p>
          <p className="mb-2">
            <a
              href="https://beian.miit.gov.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition-colors"
            >
              京ICP备2026009026号-1
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}