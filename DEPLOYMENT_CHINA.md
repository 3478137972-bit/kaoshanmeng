# 国内服务器部署完整指南

## 📋 概述

本文档记录了将考山盟项目部署到国内服务器（腾讯云/阿里云等）的完整流程，包含所有关键配置和常见问题的解决方案。

**部署环境：**
- 服务器：腾讯云轻量应用服务器
- 操作系统：Ubuntu 20.04+
- 容器化：Docker + Docker Compose
- 数据库：Supabase（云端）

---

## 🚀 快速部署（推荐）

### 方法一：使用一键部署脚本

```bash
# 1. 克隆项目
git clone https://github.com/your-repo/kaoshanmeng.git
cd kaoshanmeng

# 2. 配置环境变量（重要！）
nano .env.local
# 填入以下内容：
# NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase密钥
# NEXT_PUBLIC_APP_URL=http://你的服务器IP:3000

# 3. 运行一键部署脚本
chmod +x deploy-tencent.sh
sudo ./deploy-tencent.sh
```

### 方法二：手动部署（推荐用于理解流程）

详见下文的分步指南。

---

## 🔧 一、环境准备

### 1.1 服务器配置要求

**最低配置：**
- CPU: 1核
- 内存: 2GB（1GB 需配置 swap）
- 磁盘: 20GB
- 带宽: 1Mbps

**推荐配置：**
- CPU: 2核
- 内存: 4GB
- 磁盘: 40GB
- 带宽: 3Mbps

### 1.2 安装 Docker 和 Docker Compose

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo apt install docker-compose-plugin -y

# 验证安装
docker --version
docker compose version
```

### 1.3 配置 Docker 镜像加速（国内必须）

```bash
# 创建 Docker 配置目录
sudo mkdir -p /etc/docker

# 配置腾讯云镜像加速
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
EOF

# 重启 Docker
sudo systemctl daemon-reload
sudo systemctl restart docker

# 验证配置
docker info | grep -A 5 "Registry Mirrors"
```

### 1.4 配置防火墙

**腾讯云控制台配置：**
1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/lighthouse/instance)
2. 选择实例 → 防火墙
3. 添加规则：
   - TCP 22 (SSH)
   - TCP 80 (HTTP)
   - TCP 443 (HTTPS)
   - TCP 3000 (应用端口，可选)

**服务器防火墙配置：**
```bash
# 如果使用 ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

---

## 📦 二、项目配置

### 2.1 克隆项目

```bash
# 克隆项目到服务器
cd ~
git clone https://github.com/your-repo/kaoshanmeng.git
cd kaoshanmeng
```

### 2.2 配置环境变量（关键步骤）

#### 方法一：使用 .env.local 文件（推荐）

```bash
# 创建 .env.local 文件
nano .env.local
```

**填入以下内容：**
```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥

# 应用配置
NEXT_PUBLIC_APP_URL=http://你的服务器IP:3000

# 访问控制（可选）
GATE_PASSWORD=your-secure-password
```

**获取 Supabase 配置：**
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目 → Settings → API
3. 复制 `Project URL` 和 `anon public` 密钥

#### 方法二：在 Dockerfile 中硬编码（快速但不灵活）

**编辑 Dockerfile：**
```bash
nano Dockerfile
```

**找到构建阶段，直接设置环境变量：**
```dockerfile
# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量以启用 standalone 模式
ENV DOCKER_BUILD=true

# ⭐ 直接设置环境变量（Next.js 构建时需要）
ENV NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
ENV NEXT_PUBLIC_APP_URL=http://你的服务器IP:3000

# 构建应用
RUN pnpm build
```

**优点：**
- ✅ 配置简单，直接写在 Dockerfile 中
- ✅ 构建时就确定了环境变量
- ✅ 不需要额外的 .env.local 文件

**缺点：**
- ❌ 更换服务器地址需要重新构建镜像
- ❌ 敏感信息暴露在 Dockerfile 中
- ❌ 不适合多环境部署

**推荐使用场景：**
- 单一服务器部署
- 快速测试和原型开发
- 不需要频繁更换配置

#### 方法三：使用 docker-compose.yml 传递（灵活推荐）

**编辑 docker-compose.yml：**
```yaml
version: '3.8'

services:
  kaoshanmeng-app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        # 构建时传递环境变量
        - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
        - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
        - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    container_name: kaoshanmeng-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    environment:
      - NODE_ENV=production
```

**然后在 Dockerfile 中接收参数：**
```dockerfile
# 构建阶段
FROM base AS builder
WORKDIR /app

# 接收构建参数
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL

# 设置为环境变量
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# 构建应用
RUN pnpm build
```

**优点：**
- ✅ 灵活，可以通过 .env.local 文件管理
- ✅ 适合多环境部署
- ✅ 敏感信息不暴露在 Dockerfile 中

---

## 🏗️ 三、构建和部署

### 3.1 构建 Docker 镜像

```bash
# 方法一：使用 docker-compose（推荐）
docker compose build

# 方法二：清除缓存重新构建
docker compose build --no-cache

# 方法三：直接使用 docker build
docker build -t kaoshanmeng:latest .
```

**构建过程说明：**
1. 安装依赖（使用国内镜像加速）
2. 构建 Next.js 应用（环境变量会被嵌入）
3. 创建生产运行镜像

**预计时间：**
- 首次构建：5-10 分钟
- 后续构建：2-5 分钟（有缓存）

### 3.2 启动应用

```bash
# 启动容器
docker compose up -d

# 查看容器状态
docker compose ps

# 查看日志
docker compose logs -f
```

### 3.3 验证部署

```bash
# 1. 检查容器是否运行
docker compose ps
# 应该看到 kaoshanmeng-app 状态为 Up

# 2. 检查应用日志
docker compose logs --tail=50

# 3. 测试本地访问
curl http://localhost:3000

# 4. 测试外网访问
curl http://你的服务器IP:3000
```

---

## 🔍 四、Supabase 配置（重要）

### 4.1 配置 Site URL

**为什么需要配置：**
- 邮箱验证链接会使用这个 URL
- 密码重置链接会使用这个 URL
- OAuth 回调会使用这个 URL

**配置步骤：**
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目 → Authentication → URL Configuration
3. 设置 **Site URL**：
   ```
   http://你的服务器IP:3000
   ```
   或（如果有域名）：
   ```
   https://yourdomain.com
   ```

### 4.2 配置 Redirect URLs

**添加以下 URL：**
```
http://你的服务器IP:3000/auth/callback
http://你的服务器IP:3000/**
```

**如果使用域名：**
```
https://yourdomain.com/auth/callback
https://yourdomain.com/**
```

### 4.3 配置邮箱验证（可选）

**测试环境建议关闭：**
1. Authentication → Settings → Email Auth
2. 关闭 "Enable email confirmations"
3. 用户注册后可以直接登录

**生产环境建议开启：**
1. 保持 "Enable email confirmations" 开启
2. 确保 Site URL 配置正确
3. 测试邮箱验证流程

### 4.4 执行数据库迁移

**如果使用访问令牌系统：**
1. 进入 Supabase Dashboard → SQL Editor
2. 执行 `supabase-schema.sql`
3. 执行 `supabase-migration-add-access-token.sql`

---

## 🎯 五、快速部署脚本

### 5.1 创建一键部署脚本

```bash
# 创建脚本文件
nano quick-deploy.sh
```

**脚本内容：**
```bash
#!/bin/bash

echo "=== 考山盟国内服务器快速部署脚本 ==="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}请使用 sudo 运行此脚本${NC}"
  exit 1
fi

# 1. 检查并安装 Docker
echo -e "${GREEN}[1/6] 检查 Docker 安装...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Docker 未安装，正在安装..."
    curl -fsSL https://get.docker.com | bash
    systemctl start docker
    systemctl enable docker
else
    echo "Docker 已安装"
fi

# 2. 配置 Docker 镜像加速
echo -e "${GREEN}[2/6] 配置 Docker 镜像加速...${NC}"
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
EOF
systemctl daemon-reload
systemctl restart docker

# 3. 检查环境变量配置
echo -e "${GREEN}[3/6] 检查环境变量配置...${NC}"
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}警告：.env.local 文件不存在${NC}"
    echo "请创建 .env.local 文件并配置以下变量："
    echo "  NEXT_PUBLIC_SUPABASE_URL"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  NEXT_PUBLIC_APP_URL"
    echo ""
    read -p "是否继续？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 4. 检查内存并配置 swap
echo -e "${GREEN}[4/6] 检查系统内存...${NC}"
TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
if [ $TOTAL_MEM -lt 2048 ]; then
    echo "内存不足 2GB，配置 swap..."
    if [ ! -f /swapfile ]; then
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
        echo "Swap 配置完成"
    else
        echo "Swap 已存在"
    fi
else
    echo "内存充足，无需配置 swap"
fi

# 5. 构建 Docker 镜像
echo -e "${GREEN}[5/6] 构建 Docker 镜像...${NC}"
docker compose build

# 6. 启动应用
echo -e "${GREEN}[6/6] 启动应用...${NC}"
docker compose up -d

# 验证部署
echo ""
echo -e "${GREEN}=== 部署完成 ===${NC}"
echo ""
echo "容器状态："
docker compose ps
echo ""
echo "查看日志："
echo "  docker compose logs -f"
echo ""
echo "访问应用："
echo "  http://$(curl -s ifconfig.me):3000"
echo ""
```

**使用方法：**
```bash
chmod +x quick-deploy.sh
sudo ./quick-deploy.sh
```

### 5.2 创建更新部署脚本

```bash
# 创建更新脚本
nano update-deploy.sh
```

**脚本内容：**
```bash
#!/bin/bash

echo "=== 更新部署 ==="

# 1. 拉取最新代码
echo "[1/4] 拉取最新代码..."
git pull origin master

# 2. 停止容器
echo "[2/4] 停止容器..."
docker compose down

# 3. 重新构建
echo "[3/4] 重新构建镜像..."
docker compose build --no-cache

# 4. 启动容器
echo "[4/4] 启动容器..."
docker compose up -d

echo ""
echo "=== 更新完成 ==="
docker compose ps
```

**使用方法：**
```bash
chmod +x update-deploy.sh
./update-deploy.sh
```

---

## 🔧 六、常见问题和解决方案

### 6.1 邮箱验证链接指向 0.0.0.0:3000

**问题原因：**
- Supabase Site URL 配置不正确
- 或者 Dockerfile 中的 `NEXT_PUBLIC_APP_URL` 设置错误

**解决方案：**
1. 检查 Supabase Dashboard → Authentication → URL Configuration
2. 确保 Site URL 设置为：`http://你的服务器IP:3000`
3. 检查 Dockerfile 中的环境变量配置
4. 重新构建并部署：
   ```bash
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```

**详细文档：** [FIX_SITE_URL.md](FIX_SITE_URL.md)

### 6.2 访问令牌验证失败（403 错误）

**问题原因：**
- 数据库中没有 `user_profiles` 表
- 或者用户的访问令牌未生成

**解决方案：**
1. 在 Supabase SQL Editor 中执行数据库迁移
2. 或者临时跳过令牌验证：
   ```sql
   UPDATE user_profiles
   SET token_verified = true,
       token_verified_at = NOW();
   ```

**详细文档：** [FIX_TOKEN_VERIFICATION.md](FIX_TOKEN_VERIFICATION.md)

### 6.3 Docker 构建内存不足

**问题现象：**
```
Killed
The command '/bin/sh -c pnpm build' returned a non-zero code: 137
```

**解决方案：**
```bash
# 配置 2GB swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永久生效
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 验证
free -h
```

### 6.4 Docker 镜像拉取失败

**问题原因：**
- 国内网络访问 Docker Hub 受限

**解决方案：**
```bash
# 配置镜像加速
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 6.5 端口被占用

**问题现象：**
```
Error: bind: address already in use
```

**解决方案：**
```bash
# 查看占用 3000 端口的进程
sudo lsof -i :3000

# 杀死进程
sudo kill -9 <PID>

# 或者修改 docker-compose.yml 使用其他端口
ports:
  - "8080:3000"  # 使用 8080 端口
```

### 6.6 容器启动后立即退出

**诊断步骤：**
```bash
# 查看容器日志
docker compose logs

# 查看容器状态
docker compose ps -a

# 进入容器调试
docker compose run kaoshanmeng-app sh
```

---

## 📊 七、性能优化

### 7.1 启用 Nginx 反向代理

**安装 Nginx：**
```bash
sudo apt install nginx -y
```

**配置文件：** `/etc/nginx/sites-available/kaoshanmeng`
```nginx
server {
    listen 80;
    server_name 你的服务器IP或域名;

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

**启用配置：**
```bash
sudo ln -s /etc/nginx/sites-available/kaoshanmeng /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7.2 配置 SSL 证书（推荐）

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

### 7.3 Docker 资源限制

**编辑 docker-compose.yml：**
```yaml
services:
  kaoshanmeng-app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---

## 📝 八、维护和监控

### 8.1 日常维护命令

```bash
# 查看容器状态
docker compose ps

# 查看实时日志
docker compose logs -f

# 查看最近 100 行日志
docker compose logs --tail=100

# 重启应用
docker compose restart

# 查看资源使用
docker stats

# 清理未使用的镜像
docker system prune -a
```

### 8.2 备份和恢复

**备份 Docker 镜像：**
```bash
# 导出镜像
docker save kaoshanmeng:latest | gzip > kaoshanmeng-backup.tar.gz

# 导入镜像
docker load < kaoshanmeng-backup.tar.gz
```

**备份配置文件：**
```bash
# 备份环境变量和配置
tar -czf config-backup.tar.gz .env.local docker-compose.yml Dockerfile
```

### 8.3 监控脚本

```bash
# 创建监控脚本
nano monitor.sh
```

**脚本内容：**
```bash
#!/bin/bash

echo "=== 系统监控 ==="
echo ""

echo "1. 容器状态："
docker compose ps

echo ""
echo "2. 系统资源："
free -h
df -h

echo ""
echo "3. Docker 资源使用："
docker stats --no-stream

echo ""
echo "4. 最近日志："
docker compose logs --tail=20
```

---

## 🎓 九、最佳实践

### 9.1 环境变量管理

**推荐方式：**
1. 使用 `.env.local` 文件管理敏感信息
2. 在 Dockerfile 中使用 ARG 接收构建参数
3. 通过 docker-compose.yml 传递环境变量

**不推荐：**
- ❌ 在 Dockerfile 中硬编码敏感信息
- ❌ 将 `.env.local` 提交到 git

### 9.2 安全建议

1. **定期更新系统和 Docker：**
   ```bash
   sudo apt update && sudo apt upgrade -y
   docker compose pull
   ```

2. **使用非 root 用户运行容器：**
   - Dockerfile 中已配置 `USER nextjs`

3. **配置防火墙：**
   - 只开放必要的端口
   - 使用 HTTPS

4. **定期备份：**
   - 备份环境变量配置
   - 备份 Supabase 数据库

### 9.3 部署检查清单

部署前检查：
- [ ] 服务器配置满足要求
- [ ] Docker 和 Docker Compose 已安装
- [ ] 镜像加速已配置
- [ ] 防火墙端口已开放
- [ ] .env.local 文件已配置
- [ ] Supabase 项目已创建

部署后验证：
- [ ] 容器正常运行
- [ ] 应用可以访问
- [ ] 登录功能正常
- [ ] 注册功能正常
- [ ] 邮箱验证正常（如果启用）
- [ ] API 请求正常

---

## 📚 十、相关文档

- [更换域名操作指南](DOMAIN_CHANGE_GUIDE.md)
- [Supabase 配置修复](FIX_SITE_URL.md)
- [邮箱验证问题](FIX_EMAIL_TEMPLATE.md)
- [访问令牌验证](FIX_TOKEN_VERIFICATION.md)
- [腾讯云快速部署](DEPLOYMENT_TENCENT.md)
- [Docker 部署详细文档](DEPLOYMENT_DOCKER.md)

---

## 🆘 获取帮助

**遇到问题时：**
1. 查看容器日志：`docker compose logs -f`
2. 检查系统资源：`free -h` 和 `df -h`
3. 参考相关文档中的故障排查章节
4. 查看 Supabase Dashboard 中的日志

**常用诊断命令：**
```bash
# 完整诊断
docker compose ps
docker compose logs --tail=100
docker stats --no-stream
free -h
df -h
curl -I http://localhost:3000
```

---

**最后更新：** 2026-02-08
**适用版本：** v1.0+
**维护者：** 考山盟团队
