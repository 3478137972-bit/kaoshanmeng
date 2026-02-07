// 知识库 API 函数

import { supabase } from "./supabase"

// 类型定义
export interface KnowledgeField {
  id: string
  title: string
  content: string
}

export interface StructuredKnowledgeBase {
  version: "2.0"
  type: "structured"
  fields: KnowledgeField[]
}

/**
 * 检测内容格式
 * @param content 内容字符串
 * @returns 'structured' | 'html'
 */
function detectContentFormat(content: string): 'structured' | 'html' {
  try {
    const parsed = JSON.parse(content)
    if (parsed.version === '2.0' && parsed.type === 'structured') {
      return 'structured'
    }
  } catch {
    // 不是 JSON，是旧的 HTML 格式
  }
  return 'html'
}

/**
 * 将结构化字段转换为纯文本
 * @param fields 字段数组
 * @returns 纯文本内容
 */
export function structuredToPlainText(fields: KnowledgeField[]): string {
  if (!fields || fields.length === 0) return ""

  return fields
    .map((field, index) => {
      // 将 HTML 内容转换为纯文本
      const plainContent = htmlToPlainText(field.content)
      // 使用用户自定义的标题，如果没有则使用默认标题
      const title = field.title || `字段 ${index + 1}`
      return `${title}:\n${plainContent}`
    })
    .join('\n\n')
}

/**
 * 获取指定员工的知识库内容（自动转换为纯文本）
 * @param employeeName 员工名称
 * @returns 知识库内容 (纯文本格式) 或 null
 */
export async function getKnowledgeBaseContent(employeeName: string): Promise<string | null> {
  try {
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.warn("未登录,无法获取知识库内容")
      return null
    }

    // 查询知识库内容
    const { data, error } = await supabase
      .from("knowledge_bases")
      .select("content")
      .eq("user_id", user.id)
      .eq("employee_name", employeeName)
      .maybeSingle()

    if (error) {
      console.error("获取知识库内容失败:", error)
      return null
    }

    if (!data?.content) {
      return null
    }

    // 检测格式并转换为纯文本
    const format = detectContentFormat(data.content)

    if (format === 'structured') {
      // 新格式：结构化字段
      try {
        const parsed: StructuredKnowledgeBase = JSON.parse(data.content)
        return structuredToPlainText(parsed.fields)
      } catch (error) {
        console.error("解析结构化知识库失败:", error)
        return null
      }
    } else {
      // 旧格式：HTML
      return htmlToPlainText(data.content)
    }
  } catch (error) {
    console.error("获取知识库内容异常:", error)
    return null
  }
}

/**
 * 将 HTML 内容转换为纯文本
 * @param html HTML 内容
 * @returns 纯文本内容
 */
export function htmlToPlainText(html: string): string {
  if (!html) return ""

  // 移除 HTML 标签
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")

  // 解码 HTML 实体
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')

  // 移除多余的空行
  text = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join("\n")

  return text.trim()
}
