# 更换域名后的操作指南

## 📋 概述

当你的应用从一个域名/IP 地址迁移到另一个域名时（例如从 `http://124.220.74.191:3000` 迁移到 `https://yourdomain.com`），需要更新多个配置以确保应用正常运行。

本文档记录了在国内服务器上更换域名后需要执行的所有操作。

---

## 🔧 一、Supabase 配置更新

### 1.1 更新 Site URL

**路径：** Authentication → URL Configuration → Site URL

**操作：**
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Authentication** → **URL Configuration**
4. 将 **Site URL** 更新为新域名

**示例：**
```
旧值: http://124.220.74.191:3000
新值: https://yourdomain.com
```

**重要性：** ⭐⭐⭐⭐⭐
- 影响邮箱验证链接
- 影响密码重置链接
- 影响 OAuth 回调

### 1.2 更新 Redirect URLs

**路径：** Authentication → URL Configuration → Redirect URLs

**操作：**
1. 添加新域名的回调地址
2. 保留旧域名的地址（可选，用于过渡期）

**需要添加的 URL：**
```
https://yourdomain.com/auth/callback
https://yourdomain.com
https://yourdomain.com/**
```

**示例配置：**
```
✅ https://yourdomain.com/auth/callback
✅ https://yourdomain.com/**
⚠️ http://124.220.74.191:3000/**  (可选，过渡期保留)
```

### 1.3 更新 OAuth 提供商配置（如果使用）

**Google OAuth：**
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 进入你的项目 → APIs & Services → Credentials
3. 编辑 OAuth 2.0 客户端 ID
4. 在 **Authorized redirect URIs** 中添加：
   ```
   https://yourdomain.com/auth/callback
   https://tdvjpfuuzkwhmtogwavj.supabase.co/auth/v1/callback
   ```

---

## 🐳 二、Docker 配置更新

### 2.1 更新 Dockerfile 环境变量

**文件：** `Dockerfile`

**需要修改的行：**
```dockerfile
# 旧配置
ENV NEXT_PUBLIC_APP_URL=http://124.220.74.191:3000

# 新配置
ENV NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2.2 更新 docker-compose.yml

**文件：** `docker-compose.yml`

**需要修改的部分：**
```yaml
services:
  kaoshanmeng-app:
    build:
      args:
        - NEXT_PUBLIC_APP_URL=https://yourdomain.com
    environment:
      - NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2.3 更新 .env.local 文件

**文件：** `.env.local`

**需要修改的变量：**
```bash
# 旧配置
NEXT_PUBLIC_APP_URL=http://124.220.74.191:3000

# 新配置
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🔄 三、重新部署应用

### 3.1 停止当前容器

```bash
cd /path/to/kaoshanmeng
docker compose down
```

### 3.2 重新构建镜像

```bash
# 清除旧镜像缓存
docker compose build --no-cache

# 或者使用快速构建
docker compose build
```

### 3.3 启动新容器

```bash
docker compose up -d
```

### 3.4 验证部署

```bash
# 查看容器状态
docker compose ps

# 查看日志
docker compose logs -f

# 测试访问
curl -I https://yourdomain.com
```

---

## 🌐 四、Nginx 配置（如果使用）

### 4.1 配置 SSL 证书

**使用 Let's Encrypt：**
```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com
```

### 4.2 配置反向代理

**文件：** `/etc/nginx/sites-available/kaoshanmeng`

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # 反向代理到 Docker 容器
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4.3 重启 Nginx

```bash
# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 🗄️ 五、数据库配置更新

### 5.1 更新用户配置表（如果有）

如果你的应用在数据库中存储了域名相关的配置，需要更新：

```sql
-- 示例：更新应用配置表
UPDATE app_config
SET value = 'https://yourdomain.com'
WHERE key = 'app_url';

-- 示例：更新用户通知中的链接
UPDATE notifications
SET content = REPLACE(content, 'http://124.220.74.191:3000', 'https://yourdomain.com')
WHERE content LIKE '%124.220.74.191%';
```

### 5.2 清理旧的会话数据（可选）

```sql
-- 清理旧的会话，强制用户重新登录
-- 注意：这会登出所有用户
DELETE FROM auth.sessions
WHERE created_at < NOW() - INTERVAL '1 day';
```

---

## 🔐 六、DNS 配置

### 6.1 添加 A 记录

在你的域名服务商（如阿里云、腾讯云）配置 DNS：

```
类型: A
主机记录: @
记录值: 124.220.74.191
TTL: 600
```

### 6.2 添加 CNAME 记录（可选）

```
类型: CNAME
主机记录: www
记录值: yourdomain.com
TTL: 600
```

### 6.3 验证 DNS 解析

```bash
# 检查 DNS 解析
nslookup yourdomain.com

# 或使用 dig
dig yourdomain.com
```

---

## ✅ 七、验证清单

完成以上配置后，请逐项验证：

### 7.1 基础功能验证

- [ ] 访问新域名可以正常打开应用
- [ ] HTTPS 证书有效（浏览器地址栏显示锁图标）
- [ ] 登录功能正常
- [ ] 注册功能正常

### 7.2 邮箱功能验证

- [ ] 注册新账号，检查验证邮件中的链接
- [ ] 验证邮件中的链接指向新域名
- [ ] 点击验证链接可以正常跳转
- [ ] 密码重置邮件中的链接正确

### 7.3 OAuth 功能验证（如果使用）

- [ ] Google 登录可以正常跳转
- [ ] OAuth 回调可以正常返回
- [ ] 登录后可以正常使用

### 7.4 API 功能验证

- [ ] API 请求可以正常响应
- [ ] WebSocket 连接正常（如果使用）
- [ ] 文件上传/下载功能正常

---

## 🚨 八、常见问题

### 8.1 邮箱验证链接还是指向旧域名

**原因：** Supabase Site URL 没有更新或没有保存

**解决：**
1. 确认 Supabase Site URL 已更新
2. 点击 "Save changes" 按钮
3. 等待 5-10 分钟让配置生效
4. 使用新邮箱重新注册测试

### 8.2 HTTPS 证书错误

**原因：** SSL 证书配置不正确

**解决：**
```bash
# 重新获取证书
sudo certbot --nginx -d yourdomain.com --force-renewal

# 检查证书状态
sudo certbot certificates
```

### 8.3 OAuth 登录失败

**原因：** OAuth 提供商的回调 URL 没有更新

**解决：**
1. 在 Google Cloud Console 中更新回调 URL
2. 在 Supabase Dashboard 中更新 Redirect URLs
3. 清除浏览器缓存后重试

### 8.4 Docker 容器无法启动

**原因：** 环境变量配置错误

**解决：**
```bash
# 查看容器日志
docker compose logs -f

# 检查环境变量
docker compose exec kaoshanmeng-app env | grep NEXT_PUBLIC

# 重新构建
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

## 📝 九、回滚方案

如果新域名出现问题，需要回滚到旧配置：

### 9.1 快速回滚步骤

1. **恢复 Supabase 配置**
   - Site URL 改回旧值
   - Redirect URLs 保留旧值

2. **恢复 Docker 配置**
   ```bash
   # 修改 Dockerfile 和 .env.local
   # 将 NEXT_PUBLIC_APP_URL 改回旧值

   # 重新部署
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```

3. **验证回滚**
   - 访问旧域名/IP
   - 测试登录和注册功能

---

## 📚 十、相关文档

- [Supabase 配置修复指南](FIX_SITE_URL.md)
- [邮箱验证问题解决](FIX_EMAIL_TEMPLATE.md)
- [Docker 部署指南](DEPLOYMENT_DOCKER.md)
- [腾讯云部署记录](DEPLOYMENT_TENCENT.md)

---

## 📞 获取帮助

如果遇到问题：
1. 查看 Docker 日志：`docker compose logs -f`
2. 查看 Nginx 日志：`sudo tail -f /var/log/nginx/error.log`
3. 检查 Supabase Dashboard 中的日志
4. 参考相关文档进行故障排查

---

**最后更新：** 2026-02-08
**适用版本：** v1.0+
