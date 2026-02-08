#!/bin/bash

echo "=== 诊断注册验证问题 ==="
echo ""

echo "1. 检查 Docker 容器中的环境变量："
echo "-----------------------------------"
docker compose exec kaoshanmeng-app env | grep NEXT_PUBLIC

echo ""
echo "2. 检查容器运行时间（判断是否重新构建）："
echo "-----------------------------------"
docker compose ps

echo ""
echo "3. 测试前端页面加载："
echo "-----------------------------------"
curl -s http://localhost:3000 | grep -o "NEXT_PUBLIC_[^\"]*" | head -5

echo ""
echo "4. 检查 window.location.origin："
echo "-----------------------------------"
echo "请在浏览器控制台（F12 → Console）中运行："
echo "console.log('Origin:', window.location.origin)"
echo ""

echo "=== 诊断完成 ==="
echo ""
echo "请提供以下信息："
echo "1. 你是通过什么 URL 访问应用的？"
echo "   - http://124.220.74.191:3000"
echo "   - http://localhost:3000"
echo "   - 其他？"
echo ""
echo "2. 修改 Supabase 配置后，是否重新构建了 Docker 容器？"
echo "   docker compose down"
echo "   docker compose up -d --build"
