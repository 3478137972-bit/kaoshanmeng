// Gemini 3 Pro API 调用函数

export interface GeminiMessage {
  role: "user" | "model"
  parts: Array<{
    text: string
  }>
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      role: string
      parts: Array<{
        text: string
      }>
    }
    finishReason: string
  }>
  usageMetadata?: {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
  }
}

// 上下文配置
export interface ContextConfig {
  maxHistoryMessages?: number  // 最大历史消息数量（轮次），默认 20
  includeSysPrompt?: boolean    // 是否包含系统提示词，默认 true
}

/**
 * 调用 Gemini 3 Pro API（支持上下文优化）
 * @param messages 对话历史消息数组（不包含系统提示词）
 * @param systemPrompt 系统提示词（可选）
 * @param apiKey Gemini API Key
 * @param config 上下文配置（可选）
 * @returns AI 的回复内容
 */
export async function callGeminiAPI(
  messages: GeminiMessage[],
  systemPrompt: string | null,
  apiKey: string,
  config?: ContextConfig
): Promise<string> {
  try {
    const MODEL_NAME = "gemini-3-pro-preview"
    const BASE_URL = "https://fuckcode.lingfei666.site/v1beta"
    const url = `${BASE_URL}/models/${MODEL_NAME}:generateContent`

    // 应用配置默认值
    const maxHistoryMessages = config?.maxHistoryMessages ?? 20
    const includeSysPrompt = config?.includeSysPrompt ?? true

    // 限制历史消息数量（优化 token 使用）
    // 保留最近的 N 轮对话（每轮包含用户消息和 AI 回复）
    let optimizedMessages = messages
    if (messages.length > maxHistoryMessages * 2) {
      // 保留最近的消息
      optimizedMessages = messages.slice(-maxHistoryMessages * 2)
      console.log(`上下文优化: 保留最近 ${maxHistoryMessages} 轮对话，共 ${optimizedMessages.length} 条消息`)
    }

    // 构建请求体
    const requestBody: any = {
      contents: optimizedMessages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }

    // 如果有系统提示词且配置允许，添加到请求体中
    if (systemPrompt && includeSysPrompt) {
      requestBody.systemInstruction = {
        role: "user",
        parts: [
          {
            text: systemPrompt,
          },
        ],
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}\n${errorText}`)
    }

    const data: GeminiResponse = await response.json()

    // 提取回复内容
    if (data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content.parts[0].text

      // 打印 token 使用情况
      if (data.usageMetadata) {
        console.log("Token 使用:", {
          输入: data.usageMetadata.promptTokenCount,
          输出: data.usageMetadata.candidatesTokenCount,
          总计: data.usageMetadata.totalTokenCount,
        })
      }

      return content
    } else {
      throw new Error("未获取到有效回复")
    }
  } catch (error) {
    console.error("Gemini API 调用错误:", error)
    throw error
  }
}
