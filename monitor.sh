#!/bin/bash

echo "=== 系统监控 ==="
echo ""

echo "1. 容器状态："
docker compose ps

echo ""
echo "2. 系统资源："
echo "内存使用："
free -h
echo ""
echo "磁盘使用："
df -h

echo ""
echo "3. Docker 资源使用："
docker stats --no-stream

echo ""
echo "4. 最近日志："
docker compose logs --tail=20
