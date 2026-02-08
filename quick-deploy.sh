#!/bin/bash

echo "=== 考山盟国内服务器快速部署脚本 ==="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}请使用 sudo 运行此脚本${NC}"
  exit 1
fi

# 1. 检查并安装 Docker
echo -e "${GREEN}[1/6] 检查 Docker 安装...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Docker 未安装，正在安装..."
    curl -fsSL https://get.docker.com | bash
    systemctl start docker
    systemctl enable docker
else
    echo "Docker 已安装"
fi

# 2. 配置 Docker 镜像加速
echo -e "${GREEN}[2/6] 配置 Docker 镜像加速...${NC}"
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
EOF
systemctl daemon-reload
systemctl restart docker

# 3. 检查环境变量配置
echo -e "${GREEN}[3/6] 检查环境变量配置...${NC}"
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}警告：.env.local 文件不存在${NC}"
    echo "请创建 .env.local 文件并配置以下变量："
    echo "  NEXT_PUBLIC_SUPABASE_URL"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  NEXT_PUBLIC_APP_URL"
    echo ""
    read -p "是否继续？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 4. 检查内存并配置 swap
echo -e "${GREEN}[4/6] 检查系统内存...${NC}"
TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
if [ $TOTAL_MEM -lt 2048 ]; then
    echo "内存不足 2GB，配置 swap..."
    if [ ! -f /swapfile ]; then
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
        echo "Swap 配置完成"
    else
        echo "Swap 已存在"
    fi
else
    echo "内存充足，无需配置 swap"
fi

# 5. 构建 Docker 镜像
echo -e "${GREEN}[5/6] 构建 Docker 镜像...${NC}"
docker compose build

# 6. 启动应用
echo -e "${GREEN}[6/6] 启动应用...${NC}"
docker compose up -d

# 验证部署
echo ""
echo -e "${GREEN}=== 部署完成 ===${NC}"
echo ""
echo "容器状态："
docker compose ps
echo ""
echo "查看日志："
echo "  docker compose logs -f"
echo ""
echo "访问应用："
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "你的服务器IP")
echo "  http://${SERVER_IP}:3000"
echo ""
