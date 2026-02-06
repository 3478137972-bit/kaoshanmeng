// 知识库 API 函数

import { supabase } from "./supabase"

/**
 * 获取指定员工的知识库内容
 * @param employeeName 员工名称
 * @returns 知识库内容 (HTML 格式) 或 null
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

    return data?.content || null
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
