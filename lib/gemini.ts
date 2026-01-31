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

/**
 * 调用 Gemini 3 Pro API
 * @param messages 对话历史消息数组（不包含系统提示词）
 * @param systemPrompt 系统提示词（可选）
 * @param apiKey Gemini API Key
 * @returns AI 的回复内容
 */
export async function callGeminiAPI(
  messages: GeminiMessage[],
  systemPrompt: string | null,
  apiKey: string
): Promise<string> {
  try {
    const MODEL_NAME = "gemini-3-pro-preview"
    const BASE_URL = "https://fuckcode.lingfei666.site/v1beta"
    const url = `${BASE_URL}/models/${MODEL_NAME}:generateContent`

    // 构建请求体
    const requestBody: any = {
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }

    // 如果有系统提示词，添加到请求体中
    if (systemPrompt) {
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

      // 打印 token 使用情况（可选）
      if (data.usageMetadata) {
        console.log("Token 使用:", data.usageMetadata)
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
