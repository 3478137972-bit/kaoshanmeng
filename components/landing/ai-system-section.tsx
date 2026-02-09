'use client'

import { Brain, Lightbulb, Target, Rocket } from 'lucide-react'

interface AIEmployee {
  name: string
  description: string
}

interface Department {
  id: string
  name: string
  icon: any
  color: string
  employees: AIEmployee[]
}

const departments: Department[] = [
  {
    id: 'strategy',
    name: '战略部门',
    icon: Brain,
    color: 'orange',
    employees: [
      { name: '定位诊断师', description: '挖掘个人价值，设计商业方向' },
      { name: '商业操盘手', description: '将资源转化为可执行的商业蓝图' },
      { name: 'IP人设定位师', description: '打造独特的个人IP定位' },
      { name: '用户画像分析师', description: '精准分析目标用户画像' },
      { name: 'IP账号定位师', description: '账号定位与内容策略规划' }
    ]
  },
  {
    id: 'content',
    name: '内容与增长部门',
    icon: Lightbulb,
    color: 'blue',
    employees: [
      { name: '平台与流量模式选择', description: '选择最适合的平台和流量模式' },
      { name: '爆款选题策划师', description: '生成高传播力的选题方向' },
      { name: '吸睛文案生成器', description: '创作吸引眼球的文案内容' },
      { name: '朋友圈操盘手', description: '朋友圈内容策划与成交转化' },
      { name: '每周复盘教练', description: '系统化复盘，持续优化策略' },
      { name: '个人品牌顾问', description: '打造有影响力的个人品牌' }
    ]
  },
  {
    id: 'sales',
    name: '销售部门',
    icon: Target,
    color: 'green',
    employees: [
      { name: '私信成交高手', description: '微信私信成交话术与策略' },
      { name: '产品定价策略顾问', description: '科学定价，提升产品价值感' },
      { name: '话术生成师', description: '生成高转化的成交话术' },
      { name: '实时顾问（私域成交）', description: '实时指导私域成交流程' },
      { name: '对话分析师', description: '分析对话，优化沟通策略' },
      { name: '朋友圈写手', description: '撰写高转化的朋友圈文案' }
    ]
  },
  {
    id: 'delivery',
    name: '交付部门',
    icon: Rocket,
    color: 'purple',
    employees: [
      { name: '个人技能产品化策划师', description: '将技能转化为可交付产品' },
      { name: 'MVP验证助手', description: '快速验证最小可行产品' },
      { name: '商业闭环诊断师', description: '诊断商业模式，优化闭环' }
    ]
  }
]

export function AISystemSection() {
  return (
    <section id="ai-system" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            靠山盟 AI 内容引导系统
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            21 个专业 AI 员工，覆盖战略、内容、销售、交付四大部门
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {departments.map((department) => {
            const Icon = department.icon
            const iconBgClass =
              department.color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
              department.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
              department.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
              'bg-gradient-to-br from-purple-500 to-purple-600'

            return (
              <div
                key={department.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-14 h-14 ${iconBgClass} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{department.name}</h3>
                </div>

                <div className="space-y-4">
                  {department.employees.map((employee, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg hover:from-orange-100 hover:to-orange-50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2 h-2 mt-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform"></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{employee.name}</h4>
                          <p className="text-sm text-gray-600">{employee.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
