# 靠山实战营 - 项目结构文档

## 📋 项目概述

这是一个基于 Next.js 的 AI 助手平台，为用户提供多个专业领域的 AI 员工服务。项目集成了 Google OAuth 登录、访问令牌验证、对话历史管理等功能。

**项目名称**: 靠山实战营 (KaoShanMeng)
**技术栈**: Next.js 16 + React 19 + TypeScript + Supabase + Tailwind CSS
**部署平台**: Vercel (推荐)

---

## 🛠️ 技术栈

### 前端框架
- **Next.js**: 16.0.10 (App Router)
- **React**: 19.2.0
- **TypeScript**: 最新版本
- **Tailwind CSS**: 4.1.9

### UI 组件库
- **Radix UI**: 无障碍组件库
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-scroll-area`
  - `@radix-ui/react-toast`
  - 等等

### 后端服务
- **Supabase**:
  - PostgreSQL 数据库
  - 认证服务 (Auth)
  - 行级安全策略 (RLS)
- **Google Gemini API**: AI 对话生成

### 认证
- **Google OAuth 2.0**: 用户登录
- **Supabase Auth**: 会话管理
- **自定义令牌验证**: 访问控制

---

## 📁 目录结构

```
d:\KaoShanMeng\
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── check-token/          # 检查令牌验证状态
│   │   │   └── route.ts
│   │   └── verify-token/         # 验证访问令牌
│   │       └── route.ts
│   ├── auth/                     # 认证相关路由
│   │   └── callback/             # OAuth 回调处理
│   │       └── route.ts
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页面（Dashboard）
│
├── components/                   # React 组件
│   ├── auth/                     # 认证相关组件
│   │   ├── auth-dialog.tsx       # 登录对话框
│   │   └── token-dialog.tsx      # 令牌输入对话框
│   ├── dashboard/                # Dashboard 组件
│   │   ├── chat-console.tsx      # 聊天控制台（核心组件）
│   │   ├── conversation-history.tsx  # 对话历史
│   │   ├── editor.tsx            # 内容编辑器
│   │   └── sidebar.tsx           # 侧边栏导航
│   ├── ui/                       # UI 基础组件
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── scroll-area.tsx
│   │   ├── textarea.tsx
│   │   └── toast.tsx
│   └── theme-provider.tsx        # 主题提供者
│
├── lib/                          # 工具库
│   ├── conversation.ts           # 对话管理逻辑
│   ├── gemini.ts                 # Gemini API 集成
│   ├── markdown-utils.ts         # Markdown 处理
│   ├── supabase.ts               # Supabase 客户端
│   ├── system-prompts.ts         # AI 系统提示词
│   └── utils.ts                  # 通用工具函数
│
├── hooks/                        # React Hooks
│   └── use-toast.ts              # Toast 通知 Hook
│
├── middleware.ts                 # Next.js 中间件（登录守卫）
├── supabase-schema.sql           # 数据库 Schema
├── .env.local                    # 环境变量（本地）
├── package.json                  # 项目依赖
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.ts            # Tailwind 配置
└── next.config.ts                # Next.js 配置
```

---

## 🔑 核心功能模块

### 1. 认证系统

#### Google OAuth 登录
- **文件**: `components/auth/auth-dialog.tsx`
- **流程**:
  1. 用户点击登录按钮
  2. 调用 `supabase.auth.signInWithOAuth({ provider: 'google' })`
  3. 重定向到 Google 授权页面
  4. 授权后回调到 `/auth/callback`
  5. 交换授权码获取会话
  6. 重定向到应用首页

#### 访问令牌验证
- **文件**: `components/auth/token-dialog.tsx`
- **功能**:
  - 登录后需要输入访问令牌才能使用 AI 功能
  - 令牌存储在环境变量中
  - 验证状态存储在数据库 `user_profiles` 表
  - 支持定期重新验证（默认 30 天）

#### 路由守卫
- **文件**: `middleware.ts`
- **功能**:
  - 拦截所有请求
  - 检查用户登录状态
  - 未登录用户重定向到首页

### 2. AI 对话系统

#### 聊天控制台
- **文件**: `components/dashboard/chat-console.tsx`
- **功能**:
  - 多轮对话管理
  - 消息折叠/展开
  - 上下文优化（保留最近 15 轮对话）
  - 实时流式响应
  - 对话历史保存

#### AI 员工配置
- **文件**: `lib/system-prompts.ts`
- **员工列表**:
  - **战略部门**: 定位诊断师、商业操盘手、IP人设定位师、用户画像分析师、IP账号定位师、IP传记采访师
  - **内容与增长部门**: 平台与流量模式选择、爆款选题策划师、吸睛文案生成器、朋友圈操盘手、每周复盘教练、个人品牌顾问
  - **运营与变现部门**: 私域运营顾问、社群运营顾问、直播运营顾问、成交话术设计师、产品定价顾问、商业模式顾问

### 3. 对话历史管理

#### 数据持久化
- **文件**: `lib/conversation.ts`
- **功能**:
  - 创建对话
  - 保存消息
  - 加载历史对话
  - 删除对话
  - 自动生成对话标题

### 4. 内容编辑器

#### Markdown 编辑器
- **文件**: `components/dashboard/editor.tsx`
- **功能**:
  - 实时预览 AI 生成的内容
  - Markdown 渲染
  - 复制到剪贴板

---

## 🗄️ 数据库结构

### 表结构

#### 1. user_profiles（用户配置表）
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  token_verified BOOLEAN DEFAULT FALSE,
  token_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**字段说明**:
- `id`: 用户 ID（外键关联 auth.users）
- `token_verified`: 令牌是否已验证
- `token_verified_at`: 令牌验证时间
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### 2. conversations（对话表）
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**字段说明**:
- `id`: 对话 ID
- `user_id`: 用户 ID
- `agent_name`: AI 员工名称
- `title`: 对话标题
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### 3. messages（消息表）
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('ai', 'user')),
  content TEXT NOT NULL,
  is_card BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**字段说明**:
- `id`: 消息 ID
- `conversation_id`: 对话 ID
- `role`: 消息角色（ai 或 user）
- `content`: 消息内容
- `is_card`: 是否为卡片消息（引导消息）
- `created_at`: 创建时间

### 行级安全策略 (RLS)

所有表都启用了 RLS，确保用户只能访问自己的数据：

- **user_profiles**: 用户只能查看/更新自己的配置
- **conversations**: 用户只能访问自己的对话
- **messages**: 用户只能访问自己对话中的消息

### 触发器

1. **自动更新 updated_at**: 当记录更新时自动更新时间戳
2. **自动创建用户配置**: 新用户注册时自动创建 user_profiles 记录

---

## 🌐 API 路由

### 认证相关

#### POST /api/verify-token
验证访问令牌

**请求体**:
```json
{
  "token": "your-access-token"
}
```

**响应**:
```json
{
  "success": true,
  "message": "访问令牌验证成功"
}
```

#### GET /api/check-token
检查令牌验证状态

**响应**:
```json
{
  "verified": true,
  "verifiedAt": "2026-02-03T10:00:00Z"
}
```

或

```json
{
  "verified": false,
  "expired": true
}
```

### OAuth 回调

#### GET /auth/callback
处理 Google OAuth 回调

**查询参数**:
- `code`: 授权码

**功能**:
1. 交换授权码获取会话
2. 设置 Cookie
3. 重定向到应用首页

---

## ⚙️ 环境变量配置

### .env.local

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth 配置
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# 访问令牌配置
ACCESS_TOKEN=your-secret-access-token-here
TOKEN_VALIDITY_DAYS=365
```

### 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥 | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 客户端密钥 | ✅ |
| `ACCESS_TOKEN` | 访问令牌（自定义） | ✅ |
| `TOKEN_VALIDITY_DAYS` | 令牌有效期（天） | ✅ |

---

## 🔐 访问控制系统

### 三层安全机制

#### 1. 路由层（Middleware）
- **文件**: `middleware.ts`
- **功能**: 强制要求用户登录才能访问应用
- **实现**: 检查 Supabase 会话，未登录重定向到首页

#### 2. 功能层（Token Verification）
- **文件**: `app/page.tsx`, `components/dashboard/chat-console.tsx`
- **功能**: 登录后需要验证令牌才能使用 AI 功能
- **实现**:
  - 页面加载时检查令牌状态
  - 未验证显示黄色提示框
  - 禁用输入框和发送按钮

#### 3. 数据层（RLS）
- **文件**: `supabase-schema.sql`
- **功能**: 数据库级别的访问控制
- **实现**: PostgreSQL 行级安全策略

### 访问流程

```
用户访问 → Middleware 检查登录 → 未登录 → 重定向到首页
                ↓
            已登录
                ↓
        检查令牌验证状态 → 未验证 → 显示提示，禁用功能
                ↓
            已验证
                ↓
        检查令牌是否过期 → 已过期 → 重置状态，要求重新验证
                ↓
            未过期
                ↓
            正常使用
```

---

## 🚀 部署说明

### 本地开发

1. **安装依赖**:
```bash
npm install
```

2. **配置环境变量**:
   - 复制 `.env.local.example` 为 `.env.local`
   - 填写所有必需的环境变量

3. **初始化数据库**:
   - 登录 Supabase 控制台
   - 在 SQL Editor 中执行 `supabase-schema.sql`

4. **启动开发服务器**:
```bash
npm run dev
```

5. **访问应用**:
   - 打开浏览器访问 `http://localhost:3000`

### 生产部署（Vercel）

1. **推送代码到 GitHub**

2. **连接 Vercel**:
   - 登录 Vercel
   - 导入 GitHub 仓库
   - 选择 Next.js 框架

3. **配置环境变量**:
   - 在 Vercel 项目设置中添加所有环境变量
   - 注意：不要提交 `.env.local` 到 Git

4. **部署**:
   - Vercel 会自动构建和部署
   - 每次推送到主分支都会自动部署

### 数据库迁移

如果需要更新数据库结构：

1. 在 `supabase-schema.sql` 中添加迁移 SQL
2. 在 Supabase 控制台执行新的 SQL
3. 更新相关的 TypeScript 类型定义

---

## 📝 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

### 组件规范

- 使用函数组件和 Hooks
- 组件文件使用 kebab-case 命名
- 导出组件使用 PascalCase

### 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

---

## 🐛 常见问题

### 1. 登录后无法使用功能

**原因**: 未验证访问令牌
**解决**: 点击黄色提示框中的"输入访问令牌"按钮，输入正确的令牌

### 2. 令牌验证失败

**原因**: 环境变量中的 `ACCESS_TOKEN` 配置错误
**解决**: 检查 `.env.local` 文件，确保令牌正确

### 3. 数据库连接失败

**原因**: Supabase 配置错误
**解决**: 检查 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. OAuth 回调失败

**原因**: Google OAuth 配置错误或回调 URL 不匹配
**解决**:
- 检查 Google Cloud Console 中的回调 URL 配置
- 确保包含 `http://localhost:3000/auth/callback`（开发环境）
- 确保包含 `https://your-domain.com/auth/callback`（生产环境）

---

## 📚 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Radix UI 文档](https://www.radix-ui.com/docs)
- [Google Gemini API 文档](https://ai.google.dev/docs)

---

## 📄 许可证

本项目为私有项目，未经授权不得使用或分发。

---

**最后更新**: 2026-02-06
**维护者**: 靠山实战营团队
