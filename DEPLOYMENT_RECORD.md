# 腾讯云轻量服务器部署记录

## 📅 部署信息

- **部署日期**: 2026-02-08
- **服务器**: 腾讯云轻量服务器
- **服务器IP**: 124.220.74.191
- **应用端口**: 3000
- **部署方式**: Docker + Docker Compose
- **状态**: ✅ 部署成功

## 🎯 部署结果

- **访问地址**: http://124.220.74.191:3000
- **应用状态**: 正常运行
- **启动时间**: Ready in 121ms
- **容器状态**: 健康运行

## 🔧 部署过程

### 1. 环境准备

#### 安装 Docker
```bash
# 使用阿里云镜像源安装 Docker
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

#### 配置 Docker 镜像加速
```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 2. 克隆项目

```bash
git clone https://github.com/3478137972-bit/kaoshanmeng.git
cd kaoshanmeng
```

### 3. 配置环境变量

创建 `.env.local` 文件：

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

### 4. 配置腾讯云安全组

在腾讯云控制台配置防火墙规则：
- TCP 22 (SSH)
- TCP 80 (HTTP)
- TCP 443 (HTTPS)
- TCP 3000 (应用端口)

### 5. 构建和启动

```bash
# 构建镜像
docker compose build

# 启动容器
docker compose up -d

# 查看日志
docker compose logs -f
```

## 🐛 遇到的问题和解决方案

### 问题 1: pnpm-lock.yaml 不同步

**症状**:
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile"
```

**原因**: package.json 与 pnpm-lock.yaml 不匹配

**解决方案**:
```bash
# 本地更新 lockfile
pnpm install
git add pnpm-lock.yaml
git commit -m "更新 pnpm-lock.yaml"
git push origin master
```

### 问题 2: 环境变量未加载

**症状**:
```
Error: Your project's URL and Key are required to create a Supabase client!
```

**原因**: docker-compose.yml 中的 `environment` 部分使用了 `${VARIABLE}` 语法，导致从宿主机环境变量读取而不是从 `.env.local` 文件读取

**解决方案**:
修改 `docker-compose.yml`，删除 `environment` 部分的变量引用，只保留 `env_file` 配置：

```yaml
services:
  kaoshanmeng-app:
    env_file:
      - .env.local
    environment:
      - NODE_ENV=production
```

### 问题 3: Supabase URL 配置

**症状**: OAuth 登录可能失败

**原因**: Supabase 的 Site URL 和 Redirect URLs 只配置了 Vercel 域名

**解决方案**:
在 Supabase 控制台添加服务器 URL：
1. 进入 Authentication → URL Configuration
2. 在 Redirect URLs 中添加：`http://124.220.74.191:3000/**`

## 📁 关键文件

### Dockerfile
- 使用 Node.js 20 Alpine 镜像
- 配置国内 npm 镜像加速
- 多阶段构建优化镜像大小
- 启用 Next.js standalone 模式

### docker-compose.yml
- 配置端口映射 3000:3000
- 使用 .env.local 加载环境变量
- 设置资源限制（1 CPU, 512M 内存）
- 配置健康检查

### .env.local
- Supabase 配置
- Google OAuth 配置
- 令牌有效期配置

## 🔄 常用维护命令

### 查看状态
```bash
docker compose ps
docker compose logs -f
```

### 重启应用
```bash
docker compose restart
```

### 更新部署
```bash
git pull origin master
docker compose up -d --build
```

### 停止应用
```bash
docker compose down
```

## 📊 性能优化

### 已实施的优化
1. **Docker 镜像加速**: 使用腾讯云镜像源
2. **npm 镜像加速**: 使用 npmmirror.com
3. **资源限制**: 限制 CPU 和内存使用
4. **日志管理**: 限制日志文件大小
5. **多阶段构建**: 减小最终镜像体积

### 建议的优化
1. 配置 Nginx 反向代理
2. 配置 SSL 证书（Let's Encrypt）
3. 配置 CDN 加速静态资源
4. 设置自动备份脚本

## 🔐 安全建议

1. **定期更新**: 定期更新系统包和 Docker 镜像
2. **备份环境变量**: 定期备份 .env.local 文件
3. **监控日志**: 定期检查应用日志
4. **限制端口暴露**: 生产环境建议使用 Nginx 反向代理，不直接暴露 3000 端口

## 📞 故障排查

### 应用无法访问
1. 检查容器状态：`docker compose ps`
2. 查看日志：`docker compose logs -f`
3. 检查端口：`netstat -tulpn | grep 3000`
4. 检查安全组：确保 3000 端口已开放

### 环境变量问题
1. 验证文件存在：`cat .env.local`
2. 检查文件权限：`ls -la .env.local`
3. 重启容器：`docker compose restart`

### 内存不足
1. 查看内存使用：`free -h`
2. 查看容器资源：`docker stats`
3. 添加 swap 空间或升级服务器配置

## 🎓 经验总结

1. **环境变量配置**: Docker Compose 的 `environment` 和 `env_file` 不要混用，优先使用 `env_file`
2. **国内部署优化**: 必须配置镜像加速，否则构建速度极慢
3. **资源限制**: 轻量服务器建议设置资源限制，防止 OOM
4. **安全组配置**: 腾讯云必须在控制台配置防火墙规则
5. **lockfile 同步**: 确保 pnpm-lock.yaml 与 package.json 同步

## 📚 相关文档

- [Docker 部署指南](DEPLOYMENT_DOCKER.md)
- [腾讯云快速开始](DEPLOYMENT_TENCENT.md)
- [环境变量配置说明](ENV_CONFIG.md)
- [Vercel 部署指南](DEPLOYMENT.md)

## ✅ 部署检查清单

- [x] Docker 和 Docker Compose 已安装
- [x] Docker 镜像加速已配置
- [x] 项目已克隆到服务器
- [x] .env.local 文件已配置
- [x] 腾讯云安全组已开放端口
- [x] 容器已成功构建和启动
- [x] 应用可以正常访问
- [x] Supabase URL 配置已更新
- [x] 环境变量正确加载
- [x] 应用日志无错误

## 🎉 部署成功

应用已成功部署到腾讯云轻量服务器，可以通过 http://124.220.74.191:3000 访问。

---

**部署完成时间**: 2026-02-08
**部署人员**: 用户 + Claude Sonnet 4.5
**总耗时**: 约 2 小时（包含问题排查）
