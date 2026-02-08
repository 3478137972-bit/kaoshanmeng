# 变更日志 (Changelog)

项目的所有重要变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

---

## [未发布]

### 新增
- 待添加的新功能

### 修改
- 待修改的现有功能

### 修复
- **登录状态过期问题**: 修复了客户端和服务端会话不同步导致的登录状态过期问题
  - **问题描述**:
    - 客户端组件使用了错误的 Supabase 客户端（`createClient`）
    - 导致客户端认为已登录，但服务端 API 返回 401 未授权错误
    - 用户看到令牌验证页面，但输入令牌后提示"未登录或会话已过期"
  - **根本原因**:
    - 客户端使用 `@/lib/supabase`（使用 `createClient`），不会正确处理浏览器会话
    - 服务端使用 `createServerClient` 从 cookies 读取会话
    - 两者会话存储机制不一致，导致会话不同步
  - **解决方案**:
    - 将所有客户端组件和库文件的导入从 `@/lib/supabase` 改为 `@/lib/supabase-client`
    - 使用 `createBrowserClient` 正确处理浏览器端的会话存储和 cookies
    - 确保客户端和服务端会话保持同步
  - **影响文件** (14个):
    - 页面组件: [app/page.tsx](app/page.tsx), [app/billing/page.tsx](app/billing/page.tsx), [app/debug/page.tsx](app/debug/page.tsx)
    - 知识库页面: [app/knowledge-base/page.tsx](app/knowledge-base/page.tsx), [app/knowledge-base/[departmentId]/page.tsx](app/knowledge-base/[departmentId]/page.tsx), [app/knowledge-base/[departmentId]/[employeeName]/page.tsx](app/knowledge-base/[departmentId]/[employeeName]/page.tsx)
    - 认证组件: [components/auth/login-page.tsx](components/auth/login-page.tsx), [components/auth/auth-dialog.tsx](components/auth/auth-dialog.tsx), [components/auth/token-verification-page.tsx](components/auth/token-verification-page.tsx)
    - 仪表板组件: [components/dashboard/chat-console.tsx](components/dashboard/chat-console.tsx), [components/dashboard/sidebar.tsx](components/dashboard/sidebar.tsx)
    - 库文件: [lib/conversation.ts](lib/conversation.ts), [lib/knowledge-base.ts](lib/knowledge-base.ts), [lib/billing.ts](lib/billing.ts)
  - **技术要点**:
    - `createBrowserClient`: 用于客户端组件，自动处理浏览器端的会话存储和 cookies
    - `createServerClient`: 用于服务端组件和 API 路由，从 cookies 读取会话
    - 两者配合使用可确保 Next.js App Router 中的会话同步
  - **影响**: 修复后用户登录状态将正确保持，不会再出现"会话已过期"的错误提示
  - 提交: `19d33c6`

---

## [2026-02-07]

### 新增
- **对话框折叠功能**: 添加了聊天控制台折叠/展开功能
  - 在"定位诊断师"标题左侧添加折叠按钮
  - 折叠时对话框宽度缩小至48px，只显示折叠按钮
  - 展开时恢复正常布局（600px宽度）
  - 右侧编辑器自动填充剩余空间
  - 添加平滑的过渡动画（300ms）
  - 修改文件: [app/page.tsx](app/page.tsx), [components/dashboard/chat-console.tsx](components/dashboard/chat-console.tsx)
  - **影响**: 用户可以根据需要隐藏对话框，获得更大的编辑空间

- **文本编辑器可调整大小功能**: 文档框支持拖动调整宽度
  - 在文档框左右两侧添加拖动手柄
  - 鼠标悬停时显示蓝色竖条指示器
  - 拖动可调整文档框宽度（400-1200px）
  - 修改文件: [components/dashboard/editor.tsx](components/dashboard/editor.tsx)
  - **影响**: 用户可以自定义文档框宽度，适应不同的编辑需求

### 修改
- **响应式布局优化**: 文本编辑器自动适应容器宽度变化
  - 使用ResizeObserver监听容器宽度变化
  - 文档框最大宽度自动调整为容器宽度减去100px边距
  - 文档框始终与边框保持50px距离
  - 当对话框宽度改变时，文档框自动调整最大宽度
  - 修改文件: [components/dashboard/editor.tsx](components/dashboard/editor.tsx)
  - **影响**: 提供更好的响应式体验，文档框自动适应可用空间

- **拖动逻辑改进**: 优化文档框拖动体验
  - 区分左侧和右侧拖动手柄
  - 左侧拖动：往左（外）拖变大，往右（里）拖变小
  - 右侧拖动：往右（外）拖变大，往左（里）拖变小
  - 拖动方向更加直观和符合用户预期
  - 修改文件: [components/dashboard/editor.tsx](components/dashboard/editor.tsx)
  - **影响**: 拖动操作更加自然和易用

- **对话框最小宽度调整**: 增加对话框最小宽度限制
  - 将最小宽度从400px增加到500px
  - 确保对话框内的文本不会被过度压缩
  - 修改文件: [app/page.tsx](app/page.tsx)
  - **影响**: 改善对话框内容的可读性

---

## [2026-02-06]

### 修改
- **UI 统一**: 统一了主页面三个区域的顶部栏目高度
  - 修改 [chat-console.tsx](components/dashboard/chat-console.tsx#L660): 将顶部 padding 从 `p-4` 改为 `p-5`
  - 修改 [editor.tsx](components/dashboard/editor.tsx#L28): 将顶部 padding 从 `px-6 py-3` 改为 `p-5`
  - 保持 [sidebar.tsx](components/dashboard/sidebar.tsx#L114) 的 `p-5` 不变
  - **影响**: 提升了界面视觉一致性,三个区域的顶部现在高度完全对齐

### 文档
- 新增 `CHANGELOG.md` 文件用于记录项目变更历史
- 完善了项目文档结构,方便后续查询和维护

---

## [2026-02-04]

### 新增
- **个人知识库功能**: 添加了完整的知识库管理系统
  - 创建了知识库数据库表结构 (见 `KNOWLEDGE_BASE_DB_SETUP.md`)
  - 实现了部门-员工层级的知识库导航
  - 添加了文档上传、编辑、删除功能
  - 支持富文本编辑器进行内容编辑

### 修改
- 修复了 `useSearchParams` 导致的构建错误
  - 将使用 `useSearchParams` 的逻辑提取到单独的客户端组件中
  - 使用 `Suspense` 包裹组件以支持动态渲染

### 文档
- 新增 `KNOWLEDGE_BASE_DB_SETUP.md` 文档,详细说明知识库数据库设置
- 新增 `PASSWORD_GATE_README.md` 文档,说明密码保护功能

---

## [2026-02-03]

### 新增
- **项目文档完善**:
  - 创建 `PROJECT_STRUCTURE.md` - 详细的项目结构文档
  - 创建 `README.md` - 项目快速入门指南
  - 添加了完整的技术栈说明
  - 添加了 API 路由文档
  - 添加了数据库结构说明

### 修改
- 优化了 AI 对话系统的上下文管理
  - 实现消息历史限制(保留最近 15 轮对话)
  - 添加了上下文优化配置选项

---

## [2026-02-02]

### 新增
- **密码保护功能**:
  - 添加 `PasswordGate` 组件实现二次访问验证
  - 为主页面添加了密码保护层
  - 密码验证状态本地存储

### 修复
- 修复了知识库页面侧边栏导航逻辑
- 优化了文本编辑器的换行功能

---

## [2026-02-01]

### 新增
- **AI 员工系统优化**:
  - 为每个 AI 员工添加了专业的引导消息(SOP 引导)
  - 实现了消息折叠/展开功能
  - 添加了"隐藏引导消息"开关

### 修改
- 优化了聊天控制台的消息显示逻辑
- 改进了 Markdown 渲染效果

---

## [2026-01-31]

### 新增
- **对话历史功能**:
  - 创建了对话历史管理组件 `ConversationHistory`
  - 实现了对话保存、加载、删除功能
  - 添加了对话标题自动生成逻辑

### 修改
- 优化了聊天控制台的输入体验
- 添加了"新建对话"按钮

---

## [2026-01-30]

### 新增
- **访问令牌系统**:
  - 实现了自定义访问令牌验证机制
  - 添加了令牌过期检查功能
  - 创建了 `TokenDialog` 组件用于令牌输入

### 文档
- 创建 `AGENTS.md` - AI 员工配置说明文档
- 创建 `DEPLOYMENT.md` - 部署指南文档

---

## [2026-01-29]

### 新增
- **Google OAuth 登录**:
  - 集成 Supabase Auth
  - 实现 Google OAuth 2.0 登录流程
  - 添加登录对话框组件 `AuthDialog`
  - 添加路由���卫中间件 `middleware.ts`

---

## [2026-01-28]

### 新增
- **AI 对话核心功能**:
  - 集成 Google Gemini API
  - 实现聊天控制台组件 `ChatConsole`
  - 添加侧边栏导航组件 `Sidebar`
  - 添加内容编辑器组件 `Editor`

---

## [2026-01-27]

### 新增
- **项目初始化**:
  - 创建 Next.js 16 项目
  - 配置 Tailwind CSS 4
  - 安装 Radix UI 组件库
  - 配置 TypeScript
  - 创建基础项目结构

### 文档
- 初始化 Git 仓库
- 创建 `.gitignore` 文件
- 创建基础的 `package.json` 配置

---

## 图例说明

- **新增**: 新功能或新文件
- **修改**: 现有功能的改进或变更
- **修复**: Bug 修复
- **文档**: 仅文档相关的变更
- **性能**: 性能优化
- **重构**: 代码重构,不影响功能
- **测试**: 测试相关的变更
- **依赖**: 依赖项的更新

---

## 贡献指南

在提交变更时,请按照以下格式更新此文件:

1. 在 `[未发布]` 部分添加你的变更
2. 按照类型(新增/修改/修复等)分类
3. 提供清晰的变更描述
4. 如果适用,添加相关文件的链接

示例:
```markdown
### 新增
- **功能名称**: 功能描述
  - 详细说明 1
  - 详细说明 2
  - **影响**: 对用户或系统的影响
```

---

**维护者**: 靠山实战营团队
**最后更新**: 2026-02-07
