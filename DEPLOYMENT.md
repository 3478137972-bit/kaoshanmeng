# Vercel 部署指南

## 部署前检查清单

### ✅ 必须完成
- [ ] 修复所有 TypeScript 类型错误
- [ ] 配置必要的环境变量
- [ ] 测试本地构建: `pnpm build`
- [ ] 确认 .gitignore 正确配置

### 🔧 推荐完成
- [ ] 启用图片优化（移除 next.config.mjs 中的 unoptimized: true）
- [ ] 审查并修复 ESLint 警告: `pnpm lint`
- [ ] 测试生产构建: `pnpm start`

## 部署步骤

### 1. 通过 Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

### 2. 通过 Vercel Dashboard 部署

1. 访问 https://vercel.com/new
2. 导入你的 Git 仓库
3. Vercel 会自动检测 Next.js 项目
4. 配置环境变量（如果需要）
5. 点击 "Deploy"

### 3. 配置环境变量

在 Vercel Dashboard 中:
1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加所需的环境变量
4. 重新部署

## 性能优化建议

1. **图片优化**: 启用 Next.js 图片优化
2. **静态生成**: 尽可能使用 ISR 或 SSG
3. **代码分割**: Next.js 自动处理，但注意动态导入
4. **字体优化**: 使用 next/font 优化字体加载

## 监控和分析

- Vercel Analytics 已集成（@vercel/analytics）
- 访问 Vercel Dashboard 查看实时分析数据
- 监控构建日志和运行时错误

## 常见问题

### 构建失败
- 检查 TypeScript 错误
- 确认所有依赖都在 package.json 中
- 查看 Vercel 构建日志

### 运行时错误
- 检查环境变量配置
- 查看 Vercel Functions 日志
- 确认 API 路由正确配置

## 安全建议

- ✅ 已配置安全响应头（vercel.json）
- ✅ 环境变量已通过 .gitignore 保护
- 建议启用 Vercel 的 DDoS 保护
- 建议配置 CSP（Content Security Policy）
