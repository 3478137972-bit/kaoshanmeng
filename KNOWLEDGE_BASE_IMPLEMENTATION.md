# 个人知识库功能实现文档

## 功能概述

个人知识库功能允许用户为每个 AI 员工创建独立的知识库内容。当用户打开"个人知识库"开关时，AI 将使用知识库内容替换默认的系统提示词进行回复。

## 实现路径

### 1. 数据库结构

**表名**: `knowledge_bases`

**字段**:
- `id` (UUID): 主键
- `user_id` (UUID): 用户 ID，关联到 auth.users
- `employee_name` (TEXT): 员工名称（如"定位诊断师"）
- `department_id` (TEXT): 部门 ID（如"strategy"）
- `content` (TEXT): 知识库内容（HTML 格式）
- `created_at` (TIMESTAMP): 创建时间
- `updated_at` (TIMESTAMP): 更新时间

**索引**:
- `idx_knowledge_bases_user_id`: 用户 ID 索引
- `idx_knowledge_bases_department`: 部门 ID 索引

**唯一约束**: `(user_id, employee_name)`

**RLS 策略**: 用户只能访问自己的知识库

详见: [KNOWLEDGE_BASE_DB_SETUP.md](KNOWLEDGE_BASE_DB_SETUP.md)

---

## 2. 核心文件和功能

### 2.1 知识库 API 函数

**文件**: `lib/knowledge-base.ts`

**核心函数**:

#### `getKnowledgeBaseContent(employeeName: string): Promise<string | null>`
- **功能**: 获取指定员工的知识库内容
- **参数**: `employeeName` - 员工名称
- **返回**: HTML 格式的知识库内容，或 null
- **逻辑**:
  1. 获取当前登录用户
  2. 从 Supabase 查询 `knowledge_bases` 表
  3. 条件: `user_id` = 当前用户 AND `employee_name` = 指定员工
  4. 返回 `content` 字段

```typescript
export async function getKnowledgeBaseContent(employeeName: string): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

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
```

#### `htmlToPlainText(html: string): string`
- **功能**: 将 HTML 内容转换为纯文本
- **参数**: `html` - HTML 格式的内容
- **返回**: 纯文本内容
- **转换规则**:
  1. `<br>`, `</p>`, `</div>`, `</li>` → `\n`
  2. 移除所有 HTML 标签
  3. 解码 HTML 实体（`&nbsp;`, `&amp;`, `&lt;`, `&gt;`, `&quot;`）
  4. 移除多余空行

```typescript
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
```

---

### 2.2 聊天控制台集成

**文件**: `components/dashboard/chat-console.tsx`

**关键位置**: 第 22 行 (导入) 和第 507-521 行 (使用)

#### 导入知识库函数
```typescript
import { getKnowledgeBaseContent, htmlToPlainText } from "@/lib/knowledge-base"
```

#### 在发送消息时调用知识库

**位置**: `handleSendMessage` 函数内部（第 507-521 行）

**逻辑**:
1. 首先获取默认的系统提示词
2. 检查 `useKnowledgeBase` 开关状态
3. 如果开关**打开**:
   - 调用 `getKnowledgeBaseContent(activeAgent)` 获取知识库内容
   - 如果获取成功，将 HTML 转换为纯文本
   - 用知识库内容替换 `systemPrompt`
   - 输出日志
4. 如果开关**关闭**: 使用默认系统提示词

```typescript
// 获取系统提示词（如果该员工有配置）
let systemPrompt = systemPrompts[activeAgent] || null

// 如果个人知识库开关打开,则使用知识库内容
if (useKnowledgeBase) {
  const knowledgeContent = await getKnowledgeBaseContent(activeAgent)
  if (knowledgeContent) {
    // 将 HTML 内容转换为纯文本
    const plainTextContent = htmlToPlainText(knowledgeContent)

    // 使用知识库内容替换系统提示词
    systemPrompt = plainTextContent

    console.log("使用个人知识库内容作为系统提示词")
  } else {
    console.warn(`未找到${activeAgent}的知识库内容,使用默认系统提示词`)
  }
}
```

**变量说明**:
- `activeAgent`: 当前选中的员工名称（如"定位诊断师"）
- `useKnowledgeBase`: 个人知识库开关状态（布尔值）
- `systemPrompt`: 传递给 AI 的系统提示词

---

### 2.3 AI API 调用

**文件**: `lib/gemini.ts`

**关键函数**: `callGeminiAPI`

**参数**:
- `messages`: 对话历史消息数组
- `systemPrompt`: 系统提示词（可以是默认提示词或知识库内容）
- `apiKey`: API 密钥
- `config`: 上下文配置

**系统提示词处理** (第 74-83 行):
```typescript
// 如果有系统提示词且配置允许，添加到请求体中
if (systemPrompt && includeSysPrompt) {
  requestBody.systemInstruction = {
    parts: [
      {
        text: systemPrompt,
      },
    ],
  }
}
```

**说明**: Gemini API 已经支持动态 `systemPrompt`，无需修改此文件。

---

## 3. 数据流程图

```
用户发送消息
    ↓
handleSendMessage 函数
    ↓
检查 useKnowledgeBase 开关
    ↓
┌─────────────────┬─────────────────┐
│   开关打开       │   开关关闭       │
↓                 ↓
getKnowledgeBase  使用默认系统提示词
Content(员工名)    (systemPrompts)
    ↓                 │
htmlToPlainText      │
    ↓                 │
systemPrompt = 纯文本  │
    └─────────────────┘
            ↓
    callGeminiAPI(messages, systemPrompt, ...)
            ↓
        AI 回复
```

---

## 4. 员工与知识库映射关系

### 部门结构

**战略部门** (strategy)
- 定位诊断师
- 商业操盘手
- IP人设定位师
- 用户画像分析师
- IP账号定位师
- IP传记采访师

**内容与增长部门** (content)
- 平台与流量模式选择
- 爆款选题策划师
- 吸睛文案生成器
- 朋友圈操盘手
- 每周复盘教练
- 个人品牌顾问

**销售部门** (sales)
- 私信成交高手
- 产品定价策略顾问
- 话术生成师
- 实时顾问（私域成交）
- 对话分析师
- 朋友圈写手

**交付部门** (delivery)
- 个人技能产品化策划师
- MVP验证助手
- 商业闭环诊断师

### 映射逻辑

1. **每个员工一个知识库**: 通过 `employee_name` 字段唯一标识
2. **用户隔离**: 通过 `user_id` 字段确保数据安全
3. **自动匹配**:
   - 当用户选择"定位诊断师"聊天时
   - 如果开关打开，自动加载该用户的"定位诊断师"知识库
   - 其他员工同理

---

## 5. 批量实现指南

### 当前已实现

✅ **定位诊断师**（战略部门）
- 知识库编辑页面: `/knowledge-base/strategy/定位诊断师`
- 开关集成: 已完成
- API 调用: 已完成

### 其他 20 个员工实现步骤

**好消息**: 其他员工**无需额外开发**！

#### 为什么？

1. **知识库 API** (`lib/knowledge-base.ts`) 是通用的
   - `getKnowledgeBaseContent(employeeName)` 接受任意员工名称
   - 自动根据员工名称查询对应知识库

2. **聊天控制台集成** (`chat-console.tsx`) 是通用的
   - `activeAgent` 会自动切换为当前员工名称
   - 知识库调用逻辑适用于所有员工

3. **知识库编辑页面** 是动态路由
   - 路径: `/knowledge-base/[departmentId]/[employeeName]`
   - 适用于所有部门和员工

#### 用户使用流程

1. 进入知识库页面: `/knowledge-base`
2. 选择部门（如"内容与增长部门"）
3. 选择员工（如"爆款选题策划师"）
4. 编辑并保存知识库内容
5. 返回主页面，打开"个人知识库"开关
6. 开始使用该员工的知识库进行对话

---

## 6. 关键代码位置速查表

| 功能 | 文件路径 | 行数 | 说明 |
|------|---------|------|------|
| 知识库 API | `lib/knowledge-base.ts` | 全文 | 获取和转换知识库内容 |
| 导入知识库函数 | `components/dashboard/chat-console.tsx` | 22 | import 语句 |
| 知识库开关逻辑 | `components/dashboard/chat-console.tsx` | 507-521 | handleSendMessage 函数内 |
| AI API 调用 | `lib/gemini.ts` | 74-83 | systemPrompt 处理 |
| 默认系统提示词 | `lib/system-prompts.ts` | 全文 | 21 个员工的默认提示词 |
| 知识库编辑页面 | `app/knowledge-base/[departmentId]/[employeeName]/page.tsx` | 全文 | 动态路由 |
| 数据库 Schema | `KNOWLEDGE_BASE_DB_SETUP.md` | 全文 | SQL 建表脚本 |

---

## 7. 测试清单

### 功能测试

- [x] 创建知识库内容并保存
- [x] 打开知识库开关
- [x] 发送消息，验证 AI 使用知识库内容回复
- [x] 关闭知识库开关
- [x] 发送消息，验证 AI 使用默认提示词回复
- [x] 切换不同员工，验证知识库独立性
- [x] 长文本粘贴和换行功能

### 数据测试

- [x] 用户 A 无法访问用户 B 的知识库（RLS 策略）
- [x] 同一员工不同用户的知识库互不干扰
- [x] HTML 内容正确转换为纯文本

---

## 8. 调试技巧

### 控制台日志

在 `chat-console.tsx` 中已添加日志:
- ✅ "使用个人知识库内容作为系统提示词"
- ⚠️ "未找到${activeAgent}的知识库内容,使用默认系统提示词"

### 验证知识库内容

1. 打开浏览器开发者工具 (F12)
2. 进入 Console 标签页
3. 发送消息后查看日志
4. 如果显示"使用个人知识库内容"，说明调用成功

### 数据库查询

直接在 Supabase 控制台查询:
```sql
SELECT * FROM knowledge_bases
WHERE user_id = 'your-user-id'
AND employee_name = '定位诊断师';
```

---

## 9. 常见问题

### Q1: 为什么 AI 还是使用默认提示词？

**原因**:
1. 知识库开关未打开
2. 该员工还没有知识库内容
3. 用户未登录

**解决**:
- 检查开关状态
- 确认知识库已保存
- 确认用户已登录

### Q2: 知识库内容没有换行？

**解决**: 已修复（见提交 `d93c6a3`）
- 使用 `whitespace-pre-wrap` CSS
- 添加粘贴事件处理器
- 将 `\n` 转换为 `<br>`

### Q3: 如何批量导入知识库？

**方案**:
1. 准备 JSON 格式数据
2. 使用 Supabase 客户端批量插入
3. 或通过 SQL 直接导入

---

## 10. 未来优化方向

### 功能增强
- [ ] 知识库版本管理
- [ ] 知识库模板功能
- [ ] 知识库导出/导入
- [ ] 知识库分享功能
- [ ] Markdown 支持

### 性能优化
- [ ] 知识库内容缓存
- [ ] 懒加载知识库内容
- [ ] 压缩 HTML 内容

### 用户体验
- [ ] 知识库内容预览
- [ ] 知识库字数统计
- [ ] 知识库搜索功能

---

## 更新日志

### 2024-02-06
- ✅ 创建知识库 API 函数
- ✅ 集成到聊天控制台
- ✅ 修复长文本换行问题
- ✅ 完成文档编写
