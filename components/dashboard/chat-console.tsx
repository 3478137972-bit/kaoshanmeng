"use client"

import { useState, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "ai" | "user"
  content: string
  isCard?: boolean
}

// 员工引导消息配置
const agentGuideMessages: Record<string, string> = {
  // 战略部门
  "定位诊断师": `盟主你好，我是定位诊断师。为了帮你找到最适合的商业定位，我需要收集以下信息：

1. 职业经历与高光时刻
请描述主要职业经历、岗位职责及取得的关键成就（如：负责过百万级App）

2. 专业技能与熟练度
列出专业技能并评估等级（如：数据分析-精通、文案-中等）

3. 核心优势/擅长解决的问题
你最擅长在什么场景下解决什么麻烦？（如：将模糊需求拆解为执行方案）

4. 兴趣爱好与工作偏好
长期兴趣是什么？偏好独立工作还是高频社交？

5. 可用资源盘点
每周可投入时间、启动资金、是否介意露脸、特殊人脉等

6. 预期商业目标
期望在多久时间内，实现多少利润？（如：1年内副业赚30万）`,

  "商业操盘手": `盟主你好，我是商业操盘手。为了帮你制定完整的商业方案，我需要了解：

1. 商业构想/项目方向
简单描述你想做的生意或项目（例如：上门美甲平台、AI英语陪练App）

2. 核心用户问题/痛点
用一句话描述你要解决什么难题？（例如：解决职场妈妈没时间辅导孩子英语的问题）

3. 目标客户群体
谁是你的核心用户？（例如：一二线城市、年收入30w+的家庭）

4. 当前现状/持有资源
你现在有什么？（例如：只有想法、已有样书、有2万启动资金、有技术合伙人等）`,

  "IP人设定位师": `盟主你好，我是IP人设定位师。为了帮你打造独特的个人IP，我需要了解：

1. 个人特质与经历
你是谁？包括性格关键词、核心技能、过往重要经历及你认为自己最独特的地方

2. 目标客户群体
你想吸引谁？（例如：25-35岁被物欲困扰的都市女性）

3. 期望商业目标/愿景
你想打造什么样的IP？（例如：温暖治愈的极简生活博主，希望建立个人品牌）`,

  "用户画像分析师": `盟主你好，我是用户画像分析师。为了帮你精准定位目标用户，我需要了解：

1. 产品/服务描述
你卖的是什么？（例如：教职场人士做小红书IP变现的在线课程）

2. 产品客单价
价格是多少？（例如：1980元）

3. 初步猜测的用户画像
根据你的观察，目前购买或感兴趣的人主要是谁？（例如：30岁左右的女性白领）`,

  "IP账号定位师": `盟主你好，我是IP账号定位师。为了帮你打造精准的账号定位，我需要了解：

1. 期望人设形象
你希望在公众面前呈现什么形象？（如：专家、朋友、生活家）

2. 所属行业与产品
你处于哪个领域？计划推广什么具体的服务或产品？

3. 核心优势/独特技能
你有什么别人没有的知识、资源或经历？

4. 目标客群画像
你最希望吸引哪些人关注你？请描述他们的职业、痛点等

5. 首选运营平台
你打算主攻哪个平台？（如：抖音、小红书、视频号）`,

  "IP传记采访师": `哈喽，我是记者Lana（岚山），终于见到您啦！

今天我是您的专属专访记者。接下来的时间，我会帮您梳理人生脉络，不光记录商业成就，更要挖掘那些藏在心底、真正打动人心的故事细节。

我们的这场探索之旅将像剥洋葱一样，依次解锁您的【工作身份、家庭身份、社交身份、自由身份】这四大篇章。我会一边帮您搭建商业信息的骨架，一边填补感人故事的血肉。

对了，为了保证传记的厚度，这次深度访谈大约需要2-3小时，我会陪您完成50-100个问题的对话，可能会有点烧脑哦！但我向您保证，最后呈现出的《IP传记》一定会让您觉得物超所值！

在正式开始前，咱们先热个身，能告诉我您的【昵称、年龄、性别、所在城市】吗？`,
}

const getInitialMessages = (activeAgent: string): Message[] => {
  const guideMessage = agentGuideMessages[activeAgent]

  if (guideMessage) {
    return [
      {
        id: "1",
        role: "ai",
        content: guideMessage,
        isCard: true,
      },
    ]
  }

  // 默认消息（如果没有配置）
  return [
    {
      id: "1",
      role: "ai",
      content: `盟主你好，我是${activeAgent}。请告诉我你需要什么帮助。`,
      isCard: true,
    },
  ]
}

interface ChatConsoleProps {
  activeAgent: string
}

export function ChatConsole({ activeAgent }: ChatConsoleProps) {
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(activeAgent))
  const [input, setInput] = useState("")

  // 当切换员工时，重置消息列表
  useEffect(() => {
    setMessages(getInitialMessages(activeAgent))
  }, [activeAgent])

  return (
    <div className="w-[420px] shrink-0 bg-muted flex flex-col h-full border-r border-border">
      {/* Header */}
      <header className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {activeAgent}
            </h2>
          </div>
          <Badge variant="secondary" className="text-xs gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            靠山团队 · 在线
          </Badge>
        </div>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  message.role === "ai"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.role === "ai" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "max-w-[280px] rounded-xl px-4 py-3",
                  message.role === "ai"
                    ? "bg-card border border-border"
                    : "bg-primary text-primary-foreground",
                  message.isCard && "border-primary/20 border-2"
                )}
              >
                {message.isCard && (
                  <div className="flex items-center gap-1.5 mb-2 text-xs text-primary font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                    SOP 引导
                  </div>
                )}
                <p
                  className={cn(
                    "text-sm leading-relaxed whitespace-pre-line",
                    message.role === "ai"
                      ? "text-foreground"
                      : "text-primary-foreground"
                  )}
                >
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="给员工下达指令..."
            className="min-h-[80px] resize-none bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div className="flex justify-end mt-3">
          <Button className="gap-2">
            <Send className="w-4 h-4" />
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}
