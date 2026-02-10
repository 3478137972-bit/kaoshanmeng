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
  moments: '你是一位社交媒体文案专家，擅长创作适合朋友圈的简短、有吸引力的内容。请将用户输入的文本改写为适合朋友圈发布的格式，使用表情符号、分段和简洁的语言。',
  xiaohongshu: '你是一位小红书内容创作专家，擅长创作吸引人的标题和内容。请将用户输入的文本改写为适合小红书的格式，使用表情符号、话题标签和吸引人的排版。'
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
