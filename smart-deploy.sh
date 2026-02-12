#!/bin/bash

# 智能部署脚本 - 只在必要时重新构建
# 使用方法: ./smart-deploy.sh

set -e

echo "=========================================="
echo "  智能部署到阿里云"
echo "=========================================="
echo ""

cd /home/admin/kaoshanmeng

# 1. 拉取最新代码
echo "📥 拉取最新代码..."
git fetch origin master

# 2. 检查是否有更新
if git diff --quiet HEAD origin/master; then
    echo "✅ 代码已是最新，无需更新"
    exit 0
fi

echo "🔄 发现新的更新，开始部署..."
git pull origin master

# 3. 检查是否需要重新构建
# 如果 package.json 或 Dockerfile 有变化，才重新构建
if git diff HEAD@{1} HEAD --name-only | grep -E "package.json|Dockerfile|pnpm-lock.yaml"; then
    echo "📦 检测到依赖变化，重新构建..."
    docker compose build
else
    echo "⚡ 只有代码变化，快速重启..."
    docker compose restart
    exit 0
fi

# 4. 重启容器
echo "🚀 重启容器..."
docker compose up -d

echo ""
echo "✅ 部署完成！"
docker compose ps
