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
