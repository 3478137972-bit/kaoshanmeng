'use client'

import { Sparkles, Users, Video, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: '我们相信',
    description: '靠山盟是一款山歌学员专属一人公司AIP军团产品，覆盖战略、内容、销售、交付四大部门。可以帮助你进行商业定位、内容创作、用户分析、销售话术生成、产品策划等全方位的创作和业务支持。',
    color: 'orange'
  },
  {
    icon: Users,
    title: '与靠山盟一起创作',
    description: '21 个专业 AI 员工，覆盖战略、内容、销售、交付四大部门，为你提供全方位的创作支持和业务协助。',
    color: 'blue'
  },
  {
    icon: Video,
    title: '带来您的生命体验',
    description: '结合你的个人经历和独特视角，让 AI 帮助你将生命体验转化为有价值的内容，创作出真正打动人心的作品。',
    color: 'green'
  },
  {
    icon: TrendingUp,
    title: '我们的使命',
    description: '让每一位创作者都能轻松产出高质量内容，用 AI 赋能创意，让创作变得更简单、更高效、更有趣。',
    color: 'purple'
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            认识靠山盟
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            靠山盟不只是工具，更是创作搭子
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-white to-orange-50 border border-orange-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
