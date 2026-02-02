"use client"

import { useState, useEffect } from "react"
import { Send, Bot, User, Loader2, ChevronDown, ChevronUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { callGeminiAPI, type GeminiMessage, type ContextConfig } from "@/lib/gemini"
import { systemPrompts } from "@/lib/system-prompts"
import { useToast } from "@/hooks/use-toast"
import { ConversationHistory } from "./conversation-history"
import {
  createConversation,
  saveMessage,
  getMessagesByConversation,
  generateConversationTitle,
} from "@/lib/conversation"
import { supabase } from "@/lib/supabase"
import { markdownToHtml } from "@/lib/markdown-utils"

interface Message {
  id: string
  role: "ai" | "user"
  content: string
  isCard?: boolean
  isCollapsed?: boolean  // 消息是否折叠
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

  // 内容与增长部门
  "平台与流量模式选择": `盟主你好，我是平台与流量模式选择顾问。为了帮你找到最适合的平台和流量策略，我需要了解：

1. 产品与服务信息
你卖什么？客单价是多少？是实物还是服务？

2. 目标用户画像
用户的年龄、性别、消费能力及核心痛点是什么？

3. 商业变现目标
月收入目标是多少？核心目的是什么？（如引流、直接变现、IP等）

4. 内容创作能力
你最擅长的形式是什么？（图文/视频/直播）更新频率如何？

5. 团队与预算
团队人数有多少？每月投入预算是多少？

6. 当前业务现状
当前主阵地在哪里？全网粉丝数多少？遇到的核心瓶颈是什么？`,

  "爆款选题策划师": `盟主你好，我是爆款选题策划师。为了帮你策划出高流量的选题，我需要了解：

1. 核心领域/赛道
你的内容方向是什么？（例如：健身减脂、职场技能、美妆护肤等）

2. 目标用户画像
详细描述用户特征（例如：25-35岁一线城市职场女性，工作忙但在意身材）

3. 当前选题痛点
你觉得现在写内容最大的困难是什么？（这能帮我更精准地为你挖掘选题）`,

  "吸睛文案生成器": `盟主你好，我是吸睛文案生成器。为了帮你创作出吸引眼球的文案，我需要了解：

1. 本期选题
你想写什么？（例如：一款助眠香薰灯）

2. 核心价值/卖点
这东西最能解决什么问题？（例如：15分钟快速入睡，味道自然）

3. 目标阅读人群
给谁看？（例如：失眠的年轻上班族）`,

  "朋友圈操盘手": `盟主你好，我是朋友圈操盘手。为了帮你打造高转化的朋友圈，我需要了解：

1. 你的身份/人设
例如：私域运营顾问、减脂教练

2. 你的解决方案
你的一句话核心交付是什么？（例如：30天陪跑计划帮客户减重10斤）

3. 你的成交产品
具体卖什么？价格多少？适合谁？（例如：1999元的训练营，适合大体重人群）`,

  "每周复盘教练": `盟主你好，我是每周复盘教练。为了帮你做深度复盘，我需要收集以下信息：

【板块一：数据层】

1. 内容数据
发布数量、表现最好/最差的数据

2. 流量与转化
新增粉丝数、来源、咨询数、成交单数

3. 收入与时间
本周总收入、总工作时长及分配

【板块二：事件层】

4. 关键事件
本周最有代表性的2-3件事（成功的或失败的）

【板块三：感受层】

5. 情绪感受
本周最开心、最焦虑的时刻及反复出现的情绪`,

  "个人品牌顾问": `盟主你好，我是个人品牌顾问。为了帮你打造清晰的个人品牌定位，我需要了解：

1. 未来目标（1-3年）
你想通过个人品牌实现什么？（收入/影响力/生活方式）

2. 当前职业状态
主业/副业是什么？从业多久？

3. 核心优势/资产
你有什么擅长的技能、独特的经历或资源？

4. 目标受众
你想服务哪一类人？

5. 当前核心挑战
目前最大的困惑或阻碍是什么？`,

  // 销售部门
  "私信成交高手": `盟主你好，我是私信成交高手。为了帮你制定高效的私信成交话术，我需要了解：

【标准输入格式】

1. 产品信息
- 产品名称：
- 核心功能/价值：
- 主要优势/卖点：
- 价格区间：

2. 目标客户
- 客户画像（年龄、职业、收入等）：
- 核心痛点/需求：
- 常见异议/顾虑：

3. 当前场景
请选择你当前所处的场景：
□ 新加好友破冰
□ 朋友圈互动后转化
□ 客户主动咨询
□ 客户提出价格异议
□ 老客户唤醒
□ 活动后跟进

请按照以上格式提供信息，我将为你生成从破冰到成交的全套私信话术方案。`,

  "产品定价策略顾问": `盟主你好，我是产品定价策略顾问。为了帮你制定科学的定价策略，我需要了解：

【标准输入格式】

1. 产品信息
- 产品名称/类型：
- 核心价值主张：（这个产品为客户解决什么核心问题？）
- 主要功能/特点：
- 成本结构：（固定成本、可变成本、营销费用等）
- 当前定价（如有）：

2. 客户画像
- 目标客户群体：（年龄、职业、收入水平等）
- 购买力评估：（高/中/低）
- 价格敏感度：（对价格敏感/不敏感）
- 核心痛点：（客户最迫切需要解决的问题）
- 客户获得的价值：（使用产品后能获得什么具体收益？）

3. 市场参考
- 主要竞品及其价格：（列出2-3个主要竞品）
- 竞品的优劣势：
- 您的差异化优势：
- 市场定位：（高端/中端/低端）
- 市场阶段：（新市场/成熟市场）

请按照以上格式提供信息，我将为你生成完整的定价策略和价格测试计划。`,

  "话术生成师": `盟主你好，我是话术生成师。为了帮你生成一套完整的私域成交话术库，我需要了解：

【业务信息清单】

1. 我的产品/服务
- 产品名称：
- 核心内容/功能：
- 价格：
- 核心价值主张：（一句话总结能帮用户解决什么核心问题）

2. 我的成功案例
- 案例1（结果导向型）：用户背景 + 遇到的痛点 + 使用产品后获得的结果
- 案例2（过程体验型）：用户背景 + 遇到的顾虑 + 使用过程中的感受和变化

3. 用户的常见异议
- 异议1（例如：价格太贵了）：
- 异议2（例如：我担心没效果）：
- 异议3（例如：我需要和家人商量）：
- 异议4-6（请补充）：

请按照以上格式提供信息，我将为你生成包含6大模块的完整话术库：
✅ 破冰话术库（6大场景）
✅ 精准挖需话术库（SPIN模型）
✅ 价值呈现话术库（FAB法则）
✅ 异议处理话术库
✅ 丝滑成交话术库
✅ 长效跟进话术库（Day 1/2/3/7/14/30）`,

  "实时顾问（私域成交）": `盟主你好，我是你的私域成交实时顾问。为了更好地指导你的成交对话，我需要先建立你的知识库：

【知识库信息】

1. 我的产品/服务
- 一句话定位：我们的产品是为 [目标客群] 解决 [核心痛点] 的 [产品/服务]
- 核心价值点（Top 3）：
  ① [价值1]
  ② [价值2]
  ③ [价值3]
- 价格体系：[例如：标准版99元，专业版299元，豪华版999元]
- 产品形态：[例如：线上课程、实体商品、咨询服务等]

2. 我的成功案例
- 案例A（效果导向型）：客户 [昵称]，通过使用我们的产品，从 [使用前状态] 变成了 [使用后结果]
- 案例B（信任背书型）：客户 [昵称]，他/她本身是 [某领域专家/KOL]，也对我们的产品 [给予高度评价]

3. 常见异议清单
- 价格类：[例如："太贵了"、"能不能便宜点？"]
- 效果类：[例如："真的有用吗？"、"多久能看到效果？"]
- 信任类：[例如："你们是正规的吗？"、"我怎么相信你？"]
- 时间类：[例如："我没时间用/学"、"我再考虑考虑"]

4. 客户当下的聊天内容
请提供当前的对话记录或客户发来的消息

填写完以上信息后，我将为你提供：
✅ 用户心理洞察
✅ 当前销售阶段判断
✅ 3个不同策略的回复方案（共情探询/价值锚定/引导行动）
✅ "避坑"提醒`,

  "对话分析师": `盟主你好，我是对话分析师。为了帮你分析成交对话的优劣，我需要收集：

1. 你的产品档案
产品名称、价值、用户、价格是什么？

2. 成交对话记录
请提供 3-5 份成功的聊天记录

3. 未成交对话记录
请提供 3-5 份流失/失败的聊天记录`,

  "朋友圈写手": `盟主你好，我是朋友圈写手。为了帮你创作高转化的朋友圈内容，我需要了解：

1. 产品/服务
名称及客单价是多少？

2. 核心卖点
3个最具吸引力的点是什么？

3. 目标用户
谁会买单？

4. 我的人设
你想在朋友圈展示的形象是什么？

5. 沟通风格
你希望呈现什么风格？（例如：真诚、幽默、专业等）`,

  // 交付部门
  "个人技能产品化策划师": `盟主你好，我是个人技能产品化策划师。为了帮你把技能转化为可售卖的产品，我需要了解：

1. 你的技能与经验
你最擅长什么专业技能或方法论？做这件事多久了？有没有可量化的成果或具体案例？

2. 目标客户画像
他们是谁？目前最痛苦的问题是什么？现在用什么方式解决？愿意花多少钱解决？

3. 你的期望目标
更看重快速变现还是品牌打造？每周能投入多少小时？是否接受一对一服务？`,

  "MVP验证助手": `盟主你好，我是MVP验证助手。为了帮你快速验证产品创意，我需要了解：

1. 产品创意核心
一句话说明：你想给谁用？解决什么问题？大概打算怎么解决？

2. 你的初步假设
你认为谁最需要？他们痛点在哪？为什么你的方案有效？他们愿意付多少钱？

3. 现有可用资源
你每天/周能投入多少时间？有多少预算？是单人还是团队？有什么现成的流量或技术能力？`,

  "商业闭环诊断师": `盟主你好，我是商业闭环诊断师。为了帮你诊断商业模式的完整性，我需要了解：

1. 真实的客户流转流程
请按顺序描述：客户从哪里看到你，到最后成交，中间经历了哪些实际步骤？

2. 关键环节的数据表现
请提供真实数据：比如流量大小、转化率、客单价等（不知道的填"估算"或"不清楚"）

3. 七大要素现状自查
针对流量入口、信任建立、需求激活、产品交付、价值兑现、口碑传播、复购/转介绍，目前哪一环最薄弱？`,
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
  onContentGenerated: (content: string) => void
}

export function ChatConsole({ activeAgent, onContentGenerated }: ChatConsoleProps) {
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(activeAgent))
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast()

  // Gemini API Key
  const GEMINI_API_KEY = "sk-WvavYE7RPkgZv3Po9nDHh7iNAalGg33EX92P1mI0gDhL9Uge"

  // 上下文优化配置
  const contextConfig: ContextConfig = {
    maxHistoryMessages: 15,  // 保留最近 15 轮对话（30 条消息）
    includeSysPrompt: true,  // 始终包含系统提示词
  }

  // 检查登录状态
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 当切换员工时，重置消息列表
  useEffect(() => {
    setMessages(getInitialMessages(activeAgent))
  }, [activeAgent])

  // 发送消息处理函数
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    // 添加用户消息到界面
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // 获取系统提示词（如果该员工有配置）
      const systemPrompt = systemPrompts[activeAgent] || null

      // 构建 Gemini API 消息数组
      const apiMessages: GeminiMessage[] = []

      // 添加历史对话（排除引导消息）
      messages
        .filter((msg) => !msg.isCard)
        .forEach((msg) => {
          apiMessages.push({
            role: msg.role === "ai" ? "model" : "user",
            parts: [
              {
                text: msg.content,
              },
            ],
          })
        })

      // 添加当前用户消息
      apiMessages.push({
        role: "user",
        parts: [
          {
            text: userMessage.content,
          },
        ],
      })

      // 调用 Gemini API（使用上下文优化配置）
      const aiResponse = await callGeminiAPI(
        apiMessages,
        systemPrompt,
        GEMINI_API_KEY,
        contextConfig
      )

      // 添加 AI 回复到界面
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse,
      }

      setMessages((prev) => [...prev, aiMessage])

      // 将 AI 回复传递给编辑器
      onContentGenerated(aiResponse)

      // 如果用户已登录，保存消息到数据库
      if (isLoggedIn) {
        try {
          // 如果是新对话（没有 conversationId），创建新对话
          let convId = currentConversationId
          if (!convId) {
            // 使用首条用户消息生成标题
            const title = generateConversationTitle(userMessage.content)
            const conversation = await createConversation(activeAgent, title)
            if (conversation) {
              convId = conversation.id
              setCurrentConversationId(convId)
            }
          }

          // 保存用户消息和 AI 回复
          if (convId) {
            await saveMessage(convId, "user", userMessage.content, false)
            await saveMessage(convId, "ai", aiResponse, false)
          }
        } catch (error) {
          console.error("保存消息失败:", error)
          // 不影响用户体验，静默失败
        }
      }

      toast({
        title: "回复成功",
        description: "AI 已生成回复内容",
      })
    } catch (error) {
      console.error("发送消息失败:", error)
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "请检查网络连接或 API 配置",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 切换消息折叠状态
  const toggleMessageCollapse = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isCollapsed: !msg.isCollapsed } : msg
      )
    )
  }

  // 新建对话
  const handleNewChat = () => {
    setMessages(getInitialMessages(activeAgent))
    setInput("")
    setCurrentConversationId(null)
    toast({
      title: "新对话已创建",
      description: "已清空历史消息，开始新的对话",
    })
  }

  // 加载历史对话
  const handleLoadConversation = async (conversationId: string) => {
    try {
      const loadedMessages = await getMessagesByConversation(conversationId)

      // 转换消息格式
      const formattedMessages: Message[] = [
        ...getInitialMessages(activeAgent), // 保留引导消息
        ...loadedMessages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          isCard: msg.is_card,
        })),
      ]

      setMessages(formattedMessages)
      setCurrentConversationId(conversationId)

      toast({
        title: "加载成功",
        description: "历史对话已加载",
      })
    } catch (error) {
      console.error("加载对话失败:", error)
      toast({
        title: "加载失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 处理回车发送
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="w-[600px] shrink-0 bg-muted flex flex-col h-full border-r border-border">
      {/* Header */}
      <header className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              {activeAgent}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {/* 历史记录按钮 */}
            {isLoggedIn && (
              <ConversationHistory
                agentName={activeAgent}
                currentConversationId={currentConversationId}
                onSelectConversation={handleLoadConversation}
                onRefresh={() => setCurrentConversationId(null)}
              />
            )}
            {/* 新建对话按钮 */}
            <button
              onClick={handleNewChat}
              className="p-2 hover:bg-muted rounded-lg transition-colors group"
              title="新建对话"
            >
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 space-y-4">
          {messages.map((message) => {
            // 判断消息是否过长（超过 200 字符）
            const isLongMessage = message.content.length > 200
            const shouldShowToggle = isLongMessage || message.isCard
            const displayContent = message.isCollapsed && isLongMessage
              ? message.content.slice(0, 200) + "..."
              : message.content

            return (
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
                  "max-w-[420px] rounded-xl px-4 py-3 relative",
                  message.role === "ai"
                    ? "bg-card border border-border"
                    : "bg-primary text-primary-foreground",
                  message.isCard && "border-primary/20 border-2"
                )}
              >
                {message.isCard && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                      SOP 引导
                    </div>
                    {shouldShowToggle && (
                      <button
                        onClick={() => toggleMessageCollapse(message.id)}
                        className="p-0.5 hover:bg-muted rounded transition-colors"
                        title={message.isCollapsed ? "展开" : "收起"}
                      >
                        {message.isCollapsed ? (
                          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                    )}
                  </div>
                )}
                <div
                  className={cn(
                    "text-sm leading-relaxed prose prose-sm max-w-none",
                    "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:my-2",
                    "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:my-2",
                    "[&_h3]:text-base [&_h3]:font-bold [&_h3]:my-1",
                    "[&_p]:my-1 [&_p]:leading-relaxed",
                    "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
                    "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
                    "[&_li]:my-0.5",
                    "[&_strong]:font-bold",
                    "[&_em]:italic",
                    "[&_hr]:my-2 [&_hr]:border-border",
                    message.role === "ai"
                      ? "text-foreground"
                      : "text-primary-foreground"
                  )}
                  dangerouslySetInnerHTML={{
                    __html: message.role === "ai" ? markdownToHtml(displayContent) : displayContent
                  }}
                />
                {!message.isCard && shouldShowToggle && (
                  <button
                    onClick={() => toggleMessageCollapse(message.id)}
                    className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    {message.isCollapsed ? (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        展开
                      </>
                    ) : (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        收起
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="给员工下达指令..."
            className="min-h-[80px] max-h-[200px] resize-none overflow-y-auto bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end mt-3">
          <Button
            className="gap-2"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                发送
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
