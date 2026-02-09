'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: '靠山盟是什么？',
    answer: '靠山盟是一款山歌学员专属一人公司AIP军团产品，覆盖战略、内容、销售、交付四大部门。可以帮助你进行商业定位、内容创作、用户分析、销售话术生成、产品策划等全方位的创作和业务支持。'
  },
  {
    question: '靠山盟能帮我做什么？',
    answer: '靠山盟提供 21 个专业 AI 员工，覆盖战略、内容、销售、交付四大部门。可以帮助你进行商业定位、内容创作、用户分析、销售话术生成、产品策划等全方位的创作和业务支持。'
  },
  {
    question: '如何开始使用靠山盟？',
    answer: '只需注册账号并登录，即可开始使用。你可以选择任意一个 AI 员工开始对话，它们会根据你的需求提供专业的建议和方案。'
  },
  {
    question: '靠山盟与其他AI工具有什么不同？',
    answer: '靠山盟专注于内容创作和个人商业领域，基于真实的教学经验和课程数据训练，提供更加专业和实用的建议。我们不是通用的 AI 工具，而是专为创作者打造的智能搭子。'
  },
  {
    question: '使用靠山盟需要付费吗？',
    answer: '靠山盟采用积分制计费模式，基于 AI 使用量进行扣费。新用户注册即可获得初始积分，后续可以根据需要充值。具体计费规则请查看计费页面。'
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            常见问题
          </h2>
          <p className="text-lg text-gray-600">
            我们收集了一些关于靠山盟的常见问题，帮助您更好地了解我们的服务
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-orange-100 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-orange-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-orange-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pt-2">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">还有其他问题？</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
          >
            联系我们
          </a>
        </div>
      </div>
    </section>
  )
}