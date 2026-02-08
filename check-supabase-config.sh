#!/bin/bash

echo "=== 检查 Supabase 配置 ==="
echo ""

echo "1. 当前 Docker 容器中的环境变量："
docker compose exec kaoshanmeng-app env | grep NEXT_PUBLIC

echo ""
echo "2. 测试前端页面是否正常加载："
curl -s http://localhost:3000 | head -n 20

echo ""
echo "3. 检查浏览器控制台错误："
echo "请在浏览器中打开开发者工具（F12），切换到 Console 标签"
echo "然后尝试点击'立即注册'，查看是否有 JavaScript 错误"

echo ""
echo "=== 配置检查完成 ==="
echo ""
echo "请确认以下 Supabase 后台设置："
echo "1. Authentication > URL Configuration > Site URL 应该是："
echo "   http://124.220.74.191:3000"
echo ""
echo "2. Authentication > URL Configuration > Redirect URLs 应该包含："
echo "   http://124.220.74.191:3000/auth/callback"
echo "   http://124.220.74.191:3000"
echo ""
echo "3. Authentication > Settings > Email Auth："
echo "   - 如果想要用户注册后直接登录，关闭 'Enable email confirmations'"
echo "   - 如果想要邮箱验证，确保 'Enable email confirmations' 开启"
