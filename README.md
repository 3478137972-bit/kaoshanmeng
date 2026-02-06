# 靠山实战营 AI 助手平台

一个基于 Next.js 的 AI 助手平台，提供多个专业领域的 AI 员工服务。

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn
- Supabase 账号
- Google Cloud Console 账号（用于 OAuth）

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd KaoShanMeng
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**

创建 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth 配置
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# 访问令牌配置
ACCESS_TOKEN=your-secret-token
TOKEN_VALIDITY_DAYS=30
```

4. **初始化数据库**

在 Supabase 控制台的 SQL Editor 中执行 `supabase-schema.sql` 文件。

5. **启动开发服务器**
```bash
npm run dev
```

6. **访问应用**

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📖 功能特性

- ✅ Google OAuth 登录
- ✅ 访问令牌验证系统
- ✅ 多个 AI 员工（定位诊断师、商业操盘手等）
- ✅ 对话历史管理
- ✅ Markdown 内容编辑器
- ✅ 响应式设计
- ✅ 暗色模式支持

## 🔐 访问控制

本项目实现了三层安全机制：

1. **路由层**: 强制登录（Middleware）
2. **功能层**: 令牌验证（Token Verification）
3. **数据层**: 行级安全策略（RLS）

### 使用流程

1. 用户访问网站 → 要求登录
2. Google OAuth 登录成功
3. 输入访问令牌解锁功能
4. 开始使用 AI 助手

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── auth/              # 认证路由
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── auth/             # 认证组件
│   ├── dashboard/        # Dashboard 组件
│   └── ui/               # UI 基础组件
├── lib/                  # 工具库
├── middleware.ts         # 路由守卫
└── supabase-schema.sql   # 数据库 Schema
```

详细的项目结构说明请查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🛠️ 技术栈

- **前端**: Next.js 16 + React 19 + TypeScript
- **样式**: Tailwind CSS 4
- **UI 组件**: Radix UI
- **后端**: Supabase (PostgreSQL + Auth)
- **AI**: Google Gemini API
- **部署**: Vercel

## 📝 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 🔧 配置说明

### Supabase 配置

1. 创建 Supabase 项目
2. 获取项目 URL 和 API Keys
3. 在 SQL Editor 中执行数据库 Schema
4. 配置 Google OAuth Provider

### Google OAuth 配置

1. 在 Google Cloud Console 创建项目
2. 启用 Google+ API
3. 创建 OAuth 2.0 客户端 ID
4. 添加授权回调 URL：
   - 开发环境: `http://localhost:3000/auth/callback`
   - 生产环境: `https://your-domain.com/auth/callback`

### 访问令牌配置

在 `.env.local` 中设置 `ACCESS_TOKEN`，建议使用强随机字符串：

```bash
# 生成随机令牌（示例）
openssl rand -base64 32
```

## 📚 文档

- [项目结构详细说明](./PROJECT_STRUCTURE.md)
- [变更日志](./CHANGELOG.md) - 项目修改历史记录
- [AI 员工配置说明](./AGENTS.md)
- [部署指南](./DEPLOYMENT.md)
- [知识库数据库设置](./KNOWLEDGE_BASE_DB_SETUP.md)
- [密码保护功能说明](./PASSWORD_GATE_README.md)
- [添加新员工指南](./docs/ADD_NEW_AGENT.md)
- [员工引导标准](./docs/AGENT_GUIDE_STANDARDS.md)
- [Supabase 设置指南](./docs/SUPABASE_SETUP.md)

## 🐛 问题排查

### 登录失败

- 检查 Google OAuth 配置
- 确认回调 URL 正确
- 查看浏览器控制台错误信息

### 令牌验证失败

- 确认 `.env.local` 中的 `ACCESS_TOKEN` 正确
- 检查数据库中 `user_profiles` 表是否存在
- 查看 API 路由日志

### 数据库连接失败

- 验证 Supabase URL 和 Keys
- 检查网络连接
- 确认 RLS 策略已正确配置

## 🤝 贡献指南

本项目为私有项目，暂不接受外部贡献。

## 📄 许可证

本项目为私有项目，未经授权不得使用或分发。

---

**维护者**: 靠山实战营团队
**最后更新**: 2026-02-06
