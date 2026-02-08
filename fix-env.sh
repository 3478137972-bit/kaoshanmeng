#!/bin/bash
# 环境变量修复脚本 - 腾讯云轻量服务器

echo "=========================================="
echo "  环境变量配置修复"
echo "=========================================="
echo ""

# 进入项目目录
cd /root/kaoshanmeng || { echo "❌ 项目目录不存在"; exit 1; }
echo "✅ 已进入项目目录: $(pwd)"
echo ""

# 创建环境变量文件
echo "📝 创建环境变量文件..."
cat > .env.local << 'EOF'
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_supabase_service_role_key

# Google OAuth 配置
GOOGLE_CLIENT_ID=你的_google_client_id
GOOGLE_CLIENT_SECRET=你的_google_client_secret

# 令牌有效期配置（天数）
TOKEN_VALIDITY_DAYS=365
EOF

echo "✅ 环境变量文件已创建"
echo ""

# 验证文件内容
echo "📄 文件内容:"
cat .env.local
echo ""

# 停止并删除旧容器
echo "🛑 停止并删除旧容器..."
docker compose down
echo ""

# 重新启动容器
echo "🚀 重新启动容器..."
docker compose up -d
echo ""

# 等待容器启动
echo "⏳ 等待容器启动（10秒）..."
sleep 10
echo ""

# 查看容器状态
echo "📊 容器状态:"
docker compose ps
echo ""

# 查看最新日志
echo "📝 查看最新日志（最后30行）:"
docker compose logs --tail=30
echo ""

echo "=========================================="
echo "  ✅ 配置完成！"
echo "=========================================="
echo ""
echo "🌐 请在浏览器访问: http://124.220.74.191:3000"
echo ""
