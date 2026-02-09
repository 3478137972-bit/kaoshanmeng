#!/bin/bash

echo "=== 靠山盟认证问题诊断脚本 ==="
echo ""

echo "1. 检查 Docker 容器状态..."
docker compose ps

echo ""
echo "2. 检查应用日志（最近 50 行）..."
docker compose logs --tail=50 kaoshanmeng-app

echo ""
echo "3. 检查环境变量配置..."
docker compose exec kaoshanmeng-app env | grep NEXT_PUBLIC

echo ""
echo "4. 测试 Supabase 连接..."
curl -I https://tdvjpfuuzkwhmtogwavj.supabase.co

echo ""
echo "5. 检查应用健康状态..."
curl -s http://localhost:3000/api/health || echo "健康检查端点不可用"

echo ""
echo "=== 诊断完成 ==="
