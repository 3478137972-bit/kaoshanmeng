# 靠山实战营 AI 助手平台 - Docker 部署指南（国内服务器优化）

> 🎯 **本指南专为国内服务器优化，特别适用于腾讯云轻量服务器**

## 🌟 腾讯云轻量服务器特别说明

### 推荐配置
- **最低配置**: 2核2GB（可运行，但构建时可能较慢）
- **推荐配置**: 2核4GB 或更高（构建和运行都流畅）
- **存储**: 至少 20GB 系统盘
- **带宽**: 3Mbps 以上

### 腾讯云特定优化
1. **镜像加速**: 优先使用腾讯云镜像源（已在配置中）
2. **安全组配置**: 需要开放 80、443 端口（见下文）
3. **内存优化**: 针对低配置服务器的特殊配置（见下文）

## 📋 前置要求

### 服务器要求
- **操作系统**: Linux (推荐 Ubuntu 20.04+ 或 CentOS 7+)
- **内存**: 至少 2GB RAM
- **存储**: 至少 10GB 可用空间
- **网络**: 需要能访问外网（用于拉取镜像和访问 Supabase）

### 软件要求
- Docker 20.10+
- Docker Compose 2.0+
- Git

## 🚀 快速部署

### 1. 安装 Docker 和 Docker Compose

#### Ubuntu/Debian
```bash
# 更新包索引
sudo apt-get update

# 安装依赖
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 添加 Docker 官方 GPG 密钥（使用阿里云镜像）
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 设置稳定版仓库（阿里云镜像）
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### CentOS/RHEL
```bash
# 安装依赖
sudo yum install -y yum-utils

# 添加 Docker 仓库（阿里云镜像）
sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 安装 Docker Engine
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. 配置 Docker 镜像加速（国内服务器必须）

为了加快镜像拉取速度，配置腾讯云镜像加速器：

```bash
# 创建 Docker 配置目录
sudo mkdir -p /etc/docker

# 配置镜像加速器（腾讯云轻量服务器优化）
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

# 重启 Docker
sudo systemctl daemon-reload
sudo systemctl restart docker

# 验证配置
docker info | grep -A 5 "Registry Mirrors"
```

### 2.1 配置腾讯云安全组（重要）

在腾讯云控制台配置安全组规则：

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/lighthouse/instance)
2. 选择你的轻量服务器实例
3. 点击「防火墙」标签
4. 添加以下规则：

| 应用类型 | 协议 | 端口 | 来源 | 说明 |
|---------|------|------|------|------|
| 自定义 | TCP | 22 | 0.0.0.0/0 | SSH 登录 |
| 自定义 | TCP | 80 | 0.0.0.0/0 | HTTP 访问 |
| 自定义 | TCP | 443 | 0.0.0.0/0 | HTTPS 访问 |

**注意**: 如果只是测试，也可以临时开放 3000 端口直接访问应用。

### 3. 克隆项目到服务器

```bash
# 克隆项目
git clone <你的仓库地址> kaoshanmeng
cd kaoshanmeng

# 或者如果已经克隆，拉取最新代码
git pull origin master
```

### 4. 配置环境变量

```bash
# 复制环境变量模板（如果有的话）
# cp .env.example .env.local

# 编辑环境变量文件
nano .env.local
```

确保 `.env.local` 包含以下配置：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key

# Google OAuth 配置
GOOGLE_CLIENT_ID=你的_client_id
GOOGLE_CLIENT_SECRET=你的_client_secret

# 访问令牌配置
ACCESS_TOKEN=你的_access_token
TOKEN_VALIDITY_DAYS=30

# 密码访问控制
GATE_PASSWORD=你的_gate_password
```

### 5. 构建和启动应用

#### 标准部署（2GB+ 内存）
```bash
# 构建 Docker 镜像
docker compose build

# 启动应用（后台运行）
docker compose up -d

# 查看日志
docker compose logs -f

# 查看运行状态
docker compose ps
```

#### 低配置服务器优化（1-2GB 内存）

如果你的轻量服务器内存较小，构建时可能会遇到内存不足的问题。使用以下优化方案：

```bash
# 1. 临时增加 swap 空间（构建时使用）
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 2. 验证 swap 已启用
free -h

# 3. 构建镜像（限制并发构建进程）
docker compose build

# 4. 启动应用
docker compose up -d

# 5. 构建完成后可以选择关闭 swap（可选）
# sudo swapoff /swapfile
# sudo rm /swapfile
```

**提示**: 如果构建过程中仍然内存不足，可以考虑：
- 在本地构建镜像后推送到 Docker Hub，服务器直接拉取
- 升级服务器配置到 2核4GB

### 6. 验证部署

```bash
# 检查容器状态
docker compose ps

# 查看应用日志
docker compose logs kaoshanmeng-app

# 测试应用是否正常运行
curl http://localhost:3000
```

## 🔧 常用命令

### 应用管理
```bash
# 启动应用
docker compose up -d

# 停止应用
docker compose down

# 重启应用
docker compose restart

# 查看日志
docker compose logs -f

# 查看实时日志（最后100行）
docker compose logs --tail=100 -f
```

### 更新部署
```bash
# 拉取最新代码
git pull origin master

# 重新构建并启动
docker compose up -d --build

# 清理旧镜像
docker image prune -f
```

### 数据备份
```bash
# 导出容器日志
docker compose logs > logs_$(date +%Y%m%d).txt

# 备份环境变量
cp .env.local .env.local.backup
```

## 🌐 配置反向代理（Nginx）

如果需要通过域名访问，配置 Nginx 反向代理：

### 安装 Nginx
```bash
# Ubuntu/Debian
sudo apt-get install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

### 配置 Nginx
```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/kaoshanmeng
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name 你的域名.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/kaoshanmeng /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 配置 SSL（可选但推荐）

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书并自动配置
sudo certbot --nginx -d 你的域名.com

# 测试自动续期
sudo certbot renew --dry-run
```

## 🔒 安全建议

### 1. 配置防火墙
```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. 限制 Docker 端口暴露
默认配置中，应用只在 localhost:3000 运行，通过 Nginx 反向代理访问，不直接暴露到公网。

### 3. 定期更新
```bash
# 更新系统包
sudo apt-get update && sudo apt-get upgrade -y

# 更新 Docker 镜像
docker compose pull
docker compose up -d
```

## 🐛 故障排查

### 腾讯云轻量服务器常见问题

#### 1. 无法访问应用（外网访问不了）
**原因**: 安全组未开放端口

**解决方案**:
```bash
# 检查应用是否正常运行
curl http://localhost:3000

# 如果本地可以访问，但外网不行，检查腾讯云安全组配置
# 确保已开放 80、443 端口（或 3000 端口用于测试）
```

在腾讯云控制台 → 轻量应用服务器 → 防火墙 → 添加规则

#### 2. 构建时内存不足 (OOM)
**症状**: 构建过程中容器被 killed

**解决方案**:
```bash
# 查看内存使用
free -h

# 添加 swap 空间（见上文"低配置服务器优化"章节）
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 重新构建
docker compose build
```

#### 3. 磁盘空间不足
**症状**: No space left on device

**解决方案**:
```bash
# 查看磁盘使用
df -h

# 清理 Docker 未使用的资源
docker system prune -a --volumes

# 查看 Docker 占用空间
docker system df
```

### 容器无法启动
```bash
# 查看详细日志
docker compose logs kaoshanmeng-app

# 检查端口占用
sudo netstat -tulpn | grep 3000

# 检查 Docker 服务状态
sudo systemctl status docker
```

### 构建失败
```bash
# 清理 Docker 缓存
docker system prune -a

# 重新构建（不使用缓存）
docker compose build --no-cache
```

### 应用无法访问 Supabase
- 检查服务器是否能访问外网
- 验证环境变量配置是否正确
- 检查 Supabase 项目状态

### 内存不足
```bash
# 查看内存使用
free -h

# 查看 Docker 资源使用
docker stats

# 限制容器内存（修改 docker-compose.yml）
# 添加: mem_limit: 1g
```

## 📊 监控和日志

### 查看资源使用
```bash
# 实时监控
docker stats kaoshanmeng-app

# 查看磁盘使用
docker system df
```

### 日志管理
```bash
# 查看最近的日志
docker compose logs --tail=100

# 持续查看日志
docker compose logs -f

# 导出日志到文件
docker compose logs > app.log
```

## 🔄 CI/CD 集成（可选）

如果需要自动化部署，可以配置 GitHub Actions 或 GitLab CI。

### GitHub Actions 示例

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Server

on:
  push:
    branches: [ master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/kaoshanmeng
            git pull origin master
            docker compose up -d --build
```

## 📝 注意事项

1. **环境变量安全**: 确保 `.env.local` 文件权限正确，不要提交到 Git
2. **定期备份**: 定期备份环境变量和重要数据
3. **监控日志**: 定期检查应用日志，及时发现问题
4. **资源监控**: 监控服务器资源使用情况
5. **更新维护**: 定期更新依赖和系统包

## 🆚 与 Vercel 部署的区别

| 特性 | Docker 部署 | Vercel 部署 |
|------|------------|-------------|
| 部署方式 | 自托管服务器 | Serverless |
| 成本 | 服务器成本 | 按使用量计费 |
| 控制权 | 完全控制 | 平台限制 |
| 扩展性 | 手动扩展 | 自动扩展 |
| 维护 | 需要自行维护 | 平台维护 |
| 国内访问 | 取决于服务器位置 | 可能较慢 |

## 📞 获取帮助

如果遇到问题：
1. 查看应用日志: `docker compose logs -f`
2. 检查 Docker 状态: `docker compose ps`
3. 查看系统资源: `docker stats`
4. 参考 Next.js 官方文档
5. 检查 Supabase 连接状态

