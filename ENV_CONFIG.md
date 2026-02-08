# 环境变量配置说明

## 📝 最终环境变量配置

以下是生产环境（服务器部署）所需的环境变量配置：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_supabase_service_role_key

# Google OAuth 配置
GOOGLE_CLIENT_ID=你的_google_client_id
GOOGLE_CLIENT_SECRET=你的_google_client_secret

# 令牌有效期配置（天数）
TOKEN_VALIDITY_DAYS=365
```

## 🔄 配置变更历史

### 已废弃的环境变量

以下环境变量已不再使用：

1. **ACCESS_TOKEN** - 已改用数据库存储（user_profiles 表的 access_token 字段）
2. **GATE_PASSWORD** - 密码访问控制功能已废弃，统一使用令牌系统

### 当前使用的环境变量

| 变量名 | 用途 | 是否必需 |
|--------|------|---------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase 项目 URL | ✅ 必需 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase 匿名密钥 | ✅ 必需 |
| SUPABASE_SERVICE_ROLE_KEY | Supabase 服务角色密钥 | ✅ 必需 |
| GOOGLE_CLIENT_ID | Google OAuth 客户端 ID | ✅ 必需 |
| GOOGLE_CLIENT_SECRET | Google OAuth 客户端密钥 | ✅ 必需 |
| TOKEN_VALIDITY_DAYS | 令牌有效期（天数） | ⚠️ 可选（默认 365） |

## 🔐 安全注意事项

1. **不要提交到 Git**: `.env.local` 文件已在 `.gitignore` 中，确保不会被提交
2. **服务器权限**: 在服务器上设置正确的文件权限
   ```bash
   chmod 600 .env.local
   ```
3. **定期更新密钥**: 建议定期轮换 OAuth 密钥和 Supabase 密钥

## 📍 部署位置

- **本地开发**: `d:\KaoShanMeng\.env.local`
- **服务器部署**: `/root/kaoshanmeng/.env.local` (或你的项目路径)

## 🔗 相关文档

- [Docker 部署指南](DEPLOYMENT_DOCKER.md)
- [腾讯云快速开始](DEPLOYMENT_TENCENT.md)
- [Vercel 部署指南](DEPLOYMENT.md)
