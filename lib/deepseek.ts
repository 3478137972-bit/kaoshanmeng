// DeepSeek API 调用函数

export interface DeepSeekMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      role: string
      content: string
    }
  }>
}

/**
 * 调用 DeepSeek API
 * @param messages 对话历史消息数组
 * @param apiKey DeepSeek API Key
 * @returns AI 的回复内容
 */
export async function callDeepSeekAPI(
  messages: DeepSeekMessage[],
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`)
    }

    const data: DeepSeekResponse = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("DeepSeek API 调用错误:", error)
    throw error
  }
}
