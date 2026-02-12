#!/bin/bash

# 阿里云服务器部署脚本
# 使用方法: ./deploy-to-aliyun.sh "提交信息"

set -e

echo "=========================================="
echo "  部署到阿里云服务器"
echo "=========================================="
echo ""

# 检查是否提供了提交信息
if [ -z "$1" ]; then
    echo "❌ 请提供提交信息"
    echo "   使用方法: ./deploy-to-aliyun.sh \"你的提交信息\""
    exit 1
fi

COMMIT_MESSAGE="$1"
SERVER_IP="106.14.115.73"
SERVER_USER="admin"
PROJECT_DIR="~/kaoshanmeng"

echo "📝 提交信息: $COMMIT_MESSAGE"
echo ""

# 1. 本地提交并推送
echo "1️⃣ 提交本地更改..."
git add .
git commit -m "$COMMIT_MESSAGE" || echo "没有新的更改需要提交"
git push origin master

echo ""
echo "2️⃣ 连接到阿里云服务器并部署..."

# 2. 在服务器上拉取并部署
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd ~/kaoshanmeng

echo "📥 拉取最新代码..."
git pull origin master

echo "🔨 重新构建并部署..."
docker compose down
docker compose build --no-cache
docker compose up -d

echo ""
echo "✅ 部署完成！"
echo ""
echo "📊 容器状态:"
docker compose ps

echo ""
echo "📝 查看日志:"
echo "   docker compose logs -f"
ENDSSH

echo ""
echo "=========================================="
echo "  ✅ 部署成功！"
echo "=========================================="
echo ""
echo "🌐 访问网站: http://kaoshanmeng.cn"
echo ""
