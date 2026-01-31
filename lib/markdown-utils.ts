/**
 * 将 Markdown 文本转换为 HTML
 * 支持基本的 Markdown 格式
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return ""

  let html = markdown

  // 处理标题（### 标题）
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>")
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>")
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>")

  // 处理加粗（**文本** 或 __文本__）
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>")

  // 处理斜体（*文本* 或 _文本_）
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")
  html = html.replace(/_(.+?)_/g, "<em>$1</em>")

  // 处理分隔线（--- 或 ***）
  html = html.replace(/^---$/gm, "<hr>")
  html = html.replace(/^\*\*\*$/gm, "<hr>")

  // 处理无序列表
  html = html.replace(/^[\-\*] (.+)$/gm, "<li>$1</li>")
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)

  // 处理有序列表
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>")

  // 处理段落（双换行分隔）
  const paragraphs = html.split("\n\n")
  html = paragraphs
    .map((para) => {
      para = para.trim()
      if (!para) return ""
      // 如果已经是 HTML 标签，不再包裹 <p>
      if (
        para.startsWith("<h") ||
        para.startsWith("<ul") ||
        para.startsWith("<ol") ||
        para.startsWith("<hr") ||
        para.startsWith("<li")
      ) {
        return para
      }
      // 将单个换行转换为 <br>
      para = para.replace(/\n/g, "<br>")
      return `<p>${para}</p>`
    })
    .filter((p) => p)
    .join("\n")

  return html
}

/**
 * 清理 Markdown 标记，返回纯文本
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return ""

  let text = markdown

  // 移除标题标记
  text = text.replace(/^#{1,6}\s+/gm, "")

  // 移除加粗和斜体标记
  text = text.replace(/\*\*(.+?)\*\*/g, "$1")
  text = text.replace(/__(.+?)__/g, "$1")
  text = text.replace(/\*(.+?)\*/g, "$1")
  text = text.replace(/_(.+?)_/g, "$1")

  // 移除分隔线
  text = text.replace(/^---$/gm, "")
  text = text.replace(/^\*\*\*$/gm, "")

  // 移除列表标记
  text = text.replace(/^[\-\*]\s+/gm, "")
  text = text.replace(/^\d+\.\s+/gm, "")

  return text
}
