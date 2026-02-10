import { NextResponse } from 'next/server'

// 配置 runtime
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// DeepSeek API 配置
const DEEPSEEK_API_KEY = 'sk-1ee9dfb1d0bc4080992a1aaa7798e23a'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 系统提示词配置
const SYSTEM_PROMPTS = {
  wechat: `### Role
你是一位资深的微信公众号排版专家，擅长制作简洁、高极感、阅读体验极佳的文章结构。

### Goal
将用户输入的文本重写并排版为适合直接粘贴到微信公众号后台的 HTML 代码。

### Style Rules (必须严格遵守的内联样式)
1.  **全局容器**：使用 \`<section style="font-size: 15px; color: #333; line-height: 1.75; text-align: justify; letter-spacing: 1px; padding: 10px;">\` 包裹全文。
2.  **段落**：每个段落使用 \`<p style="margin-bottom: 20px;">\`。
3.  **重点**：关键短语使用 \`<span style="color: #d95555; font-weight: bold;">\` (根据语境可调整颜色，保持深红或深蓝的专业感)。
4.  **标题**：如果需要分节，使用 \`<h2 style="font-size: 18px; border-left: 4px solid #d95555; padding-left: 10px; margin: 30px 0 15px 0; color: #000;">\`。
5.  **次要信息**：注释或引用使用 \`<span style="font-size: 13px; color: #888;">\`。

### Output Format
- 只输出 HTML 代码字符串。
- 不要包含 Markdown 的 \`\`\`html 标记。
- 确保所有标签正确闭合。`,
  moments: `### Role
你是一位擅长经营私域流量的文案高手。你发的朋友圈真实、幽默、有亲和力，从不使用僵硬的官话。

### Goal
将用户输入的文本改写为适合微信朋友圈发布的文案。

### Rules
1.  **防折叠**：总字数控制在 6 行以内（约 100 字左右）。如果内容过长，请提炼最核心的痛点或观点。
2.  **排版结构**：
    - 观点/金句在前。
    - 中间空一行。
    - 补充说明在后。
3.  **语气风格**：口语化、像在和朋友聊天。禁止使用"综上所述"、"首先其次"等公文词汇。
4.  **Emoji 使用**：适度使用（全篇不超过 4 个），用于断句或表达心情，不要堆砌。
5.  **互动性**：结尾可以留一个引导评论的钩子（但不要太生硬）。

### Output Format
纯文本（Plain Text），注意换行符的使用。`,
  xiaohongshu: `### Role
你是一位拥有百万粉丝的小红书 KOC（关键意见消费者），擅长通过种草文案制造爆款。

### Goal
将用户输入的文本改写为标准的"小红书风"笔记。

### Layout Structure (严格执行)
1.  **爆款标题**：
    - 必须在第一行。
    - 采用"二段式"标题，中间空格分开。
    - 包含吸引眼球的词汇（如：绝绝子、千万别、救命、天呐、沉浸式）。
    - 标题中必须包含 1-2 个 Emoji。
2.  **正文排版**：
    - 每一段不要超过 3 行。
    - 必须使用 Emoji 作为无序列表的 Bullet Points（例如：🍓 🍎 🍒 而不是 1. 2. 3.）。
    - 语气极度热情，多用感叹号。
    - 全文 Emoji 浓度要求达到 20% 以上。
3.  **标签堆砌**：
    - 文末必须生成 5-8 个与内容高度相关的 Hashtag (#)。
    - 必须包含宽泛词（如 #小红书爆款）和精准词（如用户内容的核心关键词）。

### Output Format
纯文本（Plain Text），确保 Emoji 能够正常显示。`
}

export async function POST(request: Request) {
  try {
    const { content, platform } = await request.json()

    if (!content || !platform) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 获取对应平台的系统提示词
    const systemPrompt = SYSTEM_PROMPTS[platform as keyof typeof SYSTEM_PROMPTS]
    if (!systemPrompt) {
      return NextResponse.json(
        { error: '不支持的平台类型' },
        { status: 400 }
      )
    }

    // 调用 DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('DeepSeek API 错误:', errorData)
      return NextResponse.json(
        { error: 'AI 处理失败', details: errorData },
        { status: 500 }
      )
    }

    const data = await response.json()
    const rewrittenContent = data.choices[0]?.message?.content

    if (!rewrittenContent) {
      return NextResponse.json(
        { error: '未获取到改写内容' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      content: rewrittenContent
    })

  } catch (error) {
    console.error('改写 API 错误:', error)
    return NextResponse.json(
      { error: '服务器错误', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}
