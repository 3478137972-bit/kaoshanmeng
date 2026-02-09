# 腾讯云域名配置完整指南

## 📋 概述

本文档详细说明如何在腾讯云上为靠山盟项目配置自定义域名，包括域名购买、备案、解析、SSL 证书配置等完整流程。

**配置后效果：**
- 使用域名访问：`https://yourdomain.com`
- 自动 HTTPS 加密
- 专业的访问体验

---

## 🎯 一、域名准备

### 1.1 域名购买

**在腾讯云购买域名：**

1. 登录 [腾讯云域名注册](https://dnspod.cloud.tencent.com/)
2. 搜索想要的域名（如：`kaoshanmeng.com`）
3. 选择合适的后缀：
   - `.com` - 最常用，国际通用（推荐）
   - `.cn` - 中国域名，需要实名认证
   - `.net` - 网络服务常用
   - `.top` / `.xyz` - 价格便宜

4. 加入购物车并完成支付

**价格参考（2026年）：**
- `.com` 首年：55-65元
- `.cn` 首年：29-39元
- `.top` 首年：8-15元

### 1.2 域名实名认证（必须）

**步骤：**
1. 进入 [域名管理控制台](https://console.cloud.tencent.com/domain)
2. 找到购买的域名 → 点击"实名认证"
3. 提交以下信息：
   - 个人：身份证正反面照片
   - 企业：营业执照 + 法人身份证
4. 等待审核（通常 1-3 个工作日）

**注意：** 未完成实名认证的域名无法解析！

### 1.3 域名备案（国内服务器必须）

**为什么需要备案：**
- 使用国内服务器（腾讯云/阿里云等）必须备案
- 未备案域名无法绑定到国内服务器
- 备案后才能使用 80/443 端口

**备案流程：**

1. **准备材料：**
   - 个人备案：身份证、手机号、邮箱
   - 企业备案：营业执照、法人身份证、公章

2. **提交备案申请：**
   - 登录 [腾讯云备案系统](https://console.cloud.tencent.com/beian)
   - 选择"首次备案"
   - 填写主体信息（个人/企业信息）
   - 填写网站信息：
     - 网站名称：靠山盟社区（不能包含敏感词）
     - 网站内容：社交网络
     - 服务类型：Web 应用

3. **上传核验资料：**
   - 上传身份证/营业执照照片
   - 进行人脸识别验证
   - 签署《网站备案信息真实性核验单》

4. **等待审核：**
   - 腾讯云初审：1-2 个工作日
   - 管局审核：7-20 个工作日
   - 备案成功后会收到短信和邮件通知

**备案期间注意事项：**
- ⚠️ 备案期间域名不能访问
- ⚠️ 保持手机畅通，可能会接到核验电话
- ⚠️ 备案信息必须真实准确

**快速备案技巧：**
- 使用腾讯云小程序提交，更快捷
- 提前准备好所有材料
- 网站名称避免使用：博客、论坛、社区等敏感词
- 建议使用：XX信息展示平台、XX技术交流平台

---

## 🌐 二、域名解析配置

### 2.1 添加 DNS 解析记录

**步骤：**

1. 登录 [DNSPod 控制台](https://console.dnspod.cn/)（腾讯云域名默认使用 DNSPod）
2. 找到你的域名 → 点击"解析"
3. 添加以下记录：

**记录配置：**

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | @ | 你的服务器IP | 600 |
| A | www | 你的服务器IP | 600 |

**配置说明：**
- `@` 表示根域名（如：`kaoshanmeng.com`）
- `www` 表示 www 子域名（如：`www.kaoshanmeng.com`）
- TTL 600 表示 10 分钟缓存

**示例：**
```
记录类型：A
主机记录：@
记录值：123.456.789.100
TTL：600
```

### 2.2 验证域名解析

**等待解析生效（通常 5-10 分钟）：**

```bash
# 在本地电脑测试
ping yourdomain.com

# 查看 DNS 解析
nslookup yourdomain.com

# 应该返回你的服务器 IP
```

**如果解析不生效：**
- 等待更长时间（最多 24 小时）
- 检查 DNS 记录是否正确
- 清除本地 DNS 缓存：
  ```bash
  # Windows
  ipconfig /flushdns

  # Mac/Linux
  sudo dscacheutil -flushcache
  ```

---

## 🔒 三、SSL 证书配置（HTTPS）

### 3.1 申请免费 SSL 证书

**腾讯云提供免费 SSL 证书（推荐）：**

1. 登录 [SSL 证书控制台](https://console.cloud.tencent.com/ssl)
2. 点击"申请免费证书"
3. 填写域名信息：
   - 证书类型：DV（域名验证型）
   - 域名：`yourdomain.com`
   - 申请数量：1 个
4. 选择验证方式：
   - **DNS 验证**（推荐）：自动验证，最快
   - 文件验证：需要上传文件到服务器
5. 点击"提交申请"

**DNS 自动验证：**
- 如果域名在腾讯云，会自动添加验证记录
- 等待 5-10 分钟即可完成验证
- 证书签发后可以下载

### 3.2 使用 Let's Encrypt（自动续期）

**推荐使用 Certbot 自动管理证书：**

```bash
# 1. 安装 Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# 2. 申请证书（自动配置 Nginx）
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 3. 按提示输入邮箱
# 4. 同意服务条款
# 5. 选择是否重定向 HTTP 到 HTTPS（推荐选择 2）

# 6. 测试自动续期
sudo certbot renew --dry-run
```

**证书自动续期：**
```bash
# Certbot 会自动创建续期任务
# 查看续期任务
sudo systemctl list-timers | grep certbot

# 手动续期
sudo certbot renew
```

---

## 🔧 四、Nginx 反向代理配置

### 4.1 安装 Nginx

```bash
# 安装 Nginx
sudo apt update
sudo apt install nginx -y

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx
```

### 4.2 配置 Nginx（HTTP + HTTPS）

**创建配置文件：**

```bash
sudo nano /etc/nginx/sites-available/kaoshanmeng
```

**配置内容：**

```nginx
# HTTP 服务器（重定向到 HTTPS）
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # 重定向到 HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 服务器
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 证书配置（Certbot 会自动填写）
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 反向代理到 Docker 容器
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        # WebSocket 支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # 代理头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 缓存配置
        proxy_cache_bypass $http_upgrade;

        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态资源缓存
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # 日志配置
    access_log /var/log/nginx/kaoshanmeng_access.log;
    error_log /var/log/nginx/kaoshanmeng_error.log;
}
```

**启用配置：**

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/kaoshanmeng /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 4.3 验证 Nginx 配置

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 测试访问
curl -I http://yourdomain.com
curl -I https://yourdomain.com
```

---

## ⚙️ 五、应用配置更新

### 5.1 更新环境变量

**编辑 .env.local 文件：**

```bash
cd ~/kaoshanmeng
nano .env.local
```

**更新为域名：**

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥

# ⭐ 更新为你的域名
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# 访问控制（可选）
GATE_PASSWORD=your-secure-password
```

### 5.2 更新 Dockerfile（如果硬编码了环境变量）

**编辑 Dockerfile：**

```bash
nano Dockerfile
```

**找到环境变量部分并更新：**

```dockerfile
# ⭐ 更新为你的域名
ENV NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 5.3 重新构建和部署

```bash
# 停止容器
docker compose down

# 重新构建（使用新的环境变量）
docker compose build --no-cache

# 启动容器
docker compose up -d

# 查看日志
docker compose logs -f
```

---

## 🗄️ 六、Supabase 配置更新

### 6.1 更新 Site URL

**步骤：**

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Authentication** → **URL Configuration**
4. 更新以下配置：

**Site URL：**
```
https://yourdomain.com
```

**Redirect URLs（添加以下 URL）：**
```
https://yourdomain.com/**
https://yourdomain.com/auth/callback
https://yourdomain.com/auth/confirm
```

### 6.2 更新邮件模板（可选）

**如果启用了邮箱验证：**

1. 进入 **Authentication** → **Email Templates**
2. 更新 **Confirm signup** 模板
3. 确保链接使用新域名：
   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
   ```

### 6.3 测试认证流程

```bash
# 1. 访问注册页面
https://yourdomain.com/register

# 2. 注册新用户
# 3. 检查邮箱验证链接是否正确
# 4. 测试登录功能
```

---

## ✅ 七、部署验证清单

### 7.1 域名和 DNS 验证

- [ ] 域名已购买并实名认证
- [ ] 域名已完成备案（国内服务器）
- [ ] DNS 解析已配置（A 记录）
- [ ] 域名可以 ping 通
- [ ] nslookup 返回正确 IP

### 7.2 SSL 证书验证

- [ ] SSL 证书已申请
- [ ] 证书已安装到 Nginx
- [ ] HTTPS 可以正常访问
- [ ] HTTP 自动重定向到 HTTPS
- [ ] 浏览器显示安全锁图标

### 7.3 应用配置验证

- [ ] .env.local 已更新为域名
- [ ] Docker 容器已重新构建
- [ ] 应用可以通过域名访问
- [ ] 静态资源加载正常
- [ ] API 请求正常

### 7.4 Supabase 配置验证

- [ ] Site URL 已更新为域名
- [ ] Redirect URLs 已添加
- [ ] 注册功能正常
- [ ] 登录功能正常
- [ ] 邮箱验证链接正确（如果启用）

---

## 🔍 八、常见问题排查

### 8.1 域名无法访问

**可能原因：**
1. DNS 解析未生效（等待 10 分钟到 24 小时）
2. 防火墙未开放 80/443 端口
3. Nginx 未启动
4. 域名未备案（国内服务器）

**排查步骤：**

```bash
# 1. 检查 DNS 解析
nslookup yourdomain.com

# 2. 检查防火墙
sudo ufw status

# 3. 检查 Nginx 状态
sudo systemctl status nginx

# 4. 检查端口监听
sudo netstat -tlnp | grep -E '80|443'

# 5. 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 8.2 SSL 证书错误

**问题现象：**
- 浏览器提示"不安全"
- 证书过期
- 证书域名不匹配

**解决方案：**

```bash
# 1. 检查证书状态
sudo certbot certificates

# 2. 重新申请证书
sudo certbot --nginx -d yourdomain.com --force-renewal

# 3. 检查 Nginx 配置
sudo nginx -t

# 4. 重启 Nginx
sudo systemctl restart nginx
```

### 8.3 502 Bad Gateway

**可能原因：**
- Docker 容器未启动
- 端口配置错误
- 应用启动失败

**排查步骤：**

```bash
# 1. 检查容器状态
docker compose ps

# 2. 查看容器日志
docker compose logs -f

# 3. 检查端口映射
docker compose ps

# 4. 测试本地访问
curl http://localhost:3000

# 5. 重启容器
docker compose restart
```

### 8.4 邮箱验证链接错误

**问题：** 邮件中的链接仍然是旧的 IP 地址

**解决方案：**

1. 确认 Supabase Site URL 已更新
2. 确认 .env.local 中的 `NEXT_PUBLIC_APP_URL` 已更新
3. 重新构建 Docker 镜像
4. 清除浏览器缓存
5. 重新注册测试

---

## 📊 九、性能优化建议

### 9.1 启用 Gzip 压缩

**编辑 Nginx 配置：**

```nginx
# 在 http 块中添加
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript
           application/json application/javascript application/xml+rss
           application/rss+xml font/truetype font/opentype
           application/vnd.ms-fontobject image/svg+xml;
```

### 9.2 配置 CDN 加速（可选）

**腾讯云 CDN：**

1. 登录 [CDN 控制台](https://console.cloud.tencent.com/cdn)
2. 添加域名
3. 配置源站：你的服务器 IP
4. 配置 HTTPS 证书
5. 更新 DNS 解析为 CDN 提供的 CNAME

### 9.3 启用 HTTP/2

**Nginx 配置已包含：**
```nginx
listen 443 ssl http2;
```

**验证 HTTP/2：**
```bash
curl -I --http2 https://yourdomain.com
```

---

## 🔄 十、域名更换流程

**如果需要更换域名：**

1. **购买新域名并完成备案**
2. **配置 DNS 解析**
3. **申请 SSL 证书**
4. **更新 Nginx 配置**
5. **更新应用环境变量**
6. **更新 Supabase 配置**
7. **重新构建部署**

**详细步骤参考：** [DOMAIN_CHANGE_GUIDE.md](DOMAIN_CHANGE_GUIDE.md)

---

## 📝 十一、维护建议

### 11.1 定期检查

```bash
# 每周检查一次
# 1. SSL 证书有效期
sudo certbot certificates

# 2. 域名解析状态
nslookup yourdomain.com

# 3. Nginx 日志
sudo tail -100 /var/log/nginx/error.log

# 4. 应用状态
docker compose ps
```

### 11.2 监控脚本

```bash
# 创建监控脚本
nano ~/monitor-domain.sh
```

**脚本内容：**

```bash
#!/bin/bash

echo "=== 域名和服务监控 ==="
echo ""

# 1. 检查域名解析
echo "1. 域名解析："
nslookup yourdomain.com | grep Address

# 2. 检查 SSL 证书
echo ""
echo "2. SSL 证书状态："
sudo certbot certificates | grep -E "Certificate Name|Expiry Date"

# 3. 检查 Nginx 状态
echo ""
echo "3. Nginx 状态："
sudo systemctl status nginx | grep Active

# 4. 检查应用状态
echo ""
echo "4. 应用容器状态："
docker compose ps

# 5. 测试 HTTPS 访问
echo ""
echo "5. HTTPS 访问测试："
curl -I -s https://yourdomain.com | head -1

echo ""
echo "=== 监控完成 ==="
```

**使用方法：**
```bash
chmod +x ~/monitor-domain.sh
./monitor-domain.sh
```

---

## 🎓 十二、最佳实践

### 12.1 域名选择建议

- ✅ 选择 `.com` 域名（最通用）
- ✅ 域名简短易记
- ✅ 避免使用数字和连字符
- ✅ 提前检查域名是否被墙

### 12.2 安全建议

- ✅ 始终使用 HTTPS
- ✅ 定期更新 SSL 证书
- ✅ 配置安全响应头
- ✅ 启用 HSTS
- ✅ 定期备份配置

### 12.3 SEO 优化

- ✅ 配置 www 重定向
- ✅ 启用 HTTP/2
- ✅ 配置 robots.txt
- ✅ 添加 sitemap.xml

---

## 📚 相关文档

- [国内服务器部署完整指南](DEPLOYMENT_CHINA.md)
- [更换域名操作指南](DOMAIN_CHANGE_GUIDE.md)
- [Nginx 配置优化](NGINX_OPTIMIZATION.md)
- [SSL 证书管理](SSL_CERTIFICATE_GUIDE.md)

---

## 🆘 获取帮助

**遇到问题时：**

1. 检查域名备案状态
2. 验证 DNS 解析
3. 查看 Nginx 错误日志
4. 检查防火墙配置
5. 测试本地访问

**常用诊断命令：**

```bash
# 完整诊断
nslookup yourdomain.com
ping yourdomain.com
curl -I https://yourdomain.com
sudo nginx -t
sudo systemctl status nginx
docker compose ps
docker compose logs --tail=50
```

---

**最后更新：** 2026-02-08
**适用版本：** v1.0+
**维护者：** 靠山盟团队
