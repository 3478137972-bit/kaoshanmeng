#!/bin/bash

echo "=== 重新部署靠山盟应用 ==="
echo ""

echo "1. 停止当前容器..."
docker compose down

echo ""
echo "2. 拉取最新代码（如果需要）..."
# git pull origin master

echo ""
echo "3. 重新构建 Docker 镜像..."
docker compose build --no-cache

echo ""
echo "4. 启动应用..."
docker compose up -d

echo ""
echo "5. 查看容器状态..."
docker compose ps

echo ""
echo "6. 查看应用日志..."
docker compose logs --tail=50 -f

echo ""
echo "=== 部署完成 ==="
