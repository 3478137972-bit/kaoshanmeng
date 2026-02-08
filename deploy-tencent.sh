#!/bin/bash

# 靠山实战营 AI 助手平台 - 腾讯云轻量服务器一键部署脚本
# 使用方法: chmod +x deploy-tencent.sh && ./deploy-tencent.sh

set -e

echo "=========================================="
echo "  靠山实战营 AI 助手平台 - 一键部署"
echo "  适用于: 腾讯云轻量服务器"
echo "=========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 sudo 运行此脚本"
    echo "   sudo ./deploy-tencent.sh"
    exit 1
fi

# 1. 检查系统信息
echo "📋 检查系统信息..."
echo "操作系统: $(lsb_release -d | cut -f2)"
echo "内存: $(free -h | awk '/^Mem:/ {print $2}')"
echo "磁盘: $(df -h / | awk 'NR==2 {print $4}') 可用"
echo ""

# 2. 安装 Docker
if ! command -v docker &> /dev/null; then
    echo "📦 安装 Docker..."

    # 更新包索引
    apt-get update

    # 安装依赖
    apt-get install -y ca-certificates curl gnupg lsb-release

    # 添加 Docker GPG 密钥（使用阿里云镜像）
    curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # 设置稳定版仓库
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    # 安装 Docker Engine
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # 启动 Docker
    systemctl start docker
    systemctl enable docker

    echo "✅ Docker 安装完成"
else
    echo "✅ Docker 已安装"
fi

# 3. 配置 Docker 镜像加速
echo "🚀 配置 Docker 镜像加速（腾讯云）..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
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

systemctl daemon-reload
systemctl restart docker
echo "✅ 镜像加速配置完成"

# 4. 检查内存，如果小于 2GB 则创建 swap
TOTAL_MEM=$(free -m | awk '/^Mem:/ {print $2}')
if [ "$TOTAL_MEM" -lt 2048 ]; then
    echo "⚠️  检测到内存小于 2GB，创建 swap 空间..."

    if [ ! -f /swapfile ]; then
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile

        # 永久启用 swap
        echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab

        echo "✅ Swap 空间创建完成"
    else
        echo "✅ Swap 已存在"
    fi
fi

# 5. 检查环境变量文件
if [ ! -f .env.local ]; then
    echo ""
    echo "❌ 未找到 .env.local 文件"
    echo "请先创建 .env.local 文件并配置环境变量"
    echo ""
    echo "示例:"
    echo "  cp .env.example .env.local"
    echo "  nano .env.local"
    echo ""
    exit 1
fi

# 6. 构建和启动应用
echo ""
echo "🔨 构建 Docker 镜像..."
docker compose build

echo ""
echo "🚀 启动应用..."
docker compose up -d

echo ""
echo "=========================================="
echo "  ✅ 部署完成！"
echo "=========================================="
echo ""
echo "📊 应用状态:"
docker compose ps
echo ""
echo "📝 查看日志:"
echo "  docker compose logs -f"
echo ""
echo "🌐 访问应用:"
echo "  本地: http://localhost:3000"
echo "  外网: http://你的服务器IP:3000"
echo ""
echo "⚠️  提醒:"
echo "  1. 确保腾讯云安全组已开放 3000 端口（或配置 Nginx）"
echo "  2. 建议配置 Nginx 反向代理和 SSL 证书"
echo "  3. 详细文档: DEPLOYMENT_DOCKER.md"
echo ""
