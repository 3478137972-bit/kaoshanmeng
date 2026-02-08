# 腾讯云轻量服务器快速部署指南

## 🚀 一键部署（推荐）

```bash
# 1. 克隆项目
git clone <你的仓库地址> kaoshanmeng
cd kaoshanmeng

# 2. 配置环境变量
nano .env.local
# 复制你的环境变量配置

# 3. 运行一键部署脚本
chmod +x deploy-tencent.sh
sudo ./deploy-tencent.sh
```

脚本会自动完成：
- ✅ 安装 Docker 和 Docker Compose
- ✅ 配置腾讯云镜像加速
- ✅ 检测内存并自动创建 swap（如需要）
- ✅ 构建和启动应用

## 📖 详细文档

- **完整部署指南**: [DEPLOYMENT_DOCKER.md](DEPLOYMENT_DOCKER.md)
- **Vercel 部署**: [DEPLOYMENT.md](DEPLOYMENT.md)

## ⚙️ 腾讯云安全组配置

在腾讯云控制台配置防火墙规则：

1. 登录 [腾讯云轻量应用服务器控制台](https://console.cloud.tencent.com/lighthouse/instance)
2. 选择实例 → 防火墙
3. 添加规则：
   - TCP 22 (SSH)
   - TCP 80 (HTTP)
   - TCP 443 (HTTPS)
   - TCP 3000 (临时测试用，可选)

## 🔍 验证部署

```bash
# 查看容器状态
docker compose ps

# 查看日志
docker compose logs -f

# 测试访问
curl http://localhost:3000
```

## 🌐 访问应用

- **本地测试**: `http://localhost:3000`
- **外网访问**: `http://你的服务器IP:3000`
- **域名访问**: 配置 Nginx 反向代理（见详细文档）

## 📊 常用命令

```bash
# 启动应用
docker compose up -d

# 停止应用
docker compose down

# 重启应用
docker compose restart

# 查看日志
docker compose logs -f

# 更新部署
git pull origin master
docker compose up -d --build
```

## ⚠️ 注意事项

1. **内存要求**: 推荐 2GB+ 内存，1GB 内存需要配置 swap
2. **安全组**: 必须在腾讯云控制台开放相应端口
3. **环境变量**: 确保 `.env.local` 配置正确
4. **SSL 证书**: 生产环境建议配置 HTTPS

## 🆘 遇到问题？

查看 [故障排查章节](DEPLOYMENT_DOCKER.md#-故障排查)，包含：
- 无法访问应用
- 构建内存不足
- 磁盘空间不足
- 容器无法启动

## 📞 获取帮助

- 查看详细文档: [DEPLOYMENT_DOCKER.md](DEPLOYMENT_DOCKER.md)
- 检查应用日志: `docker compose logs -f`
- 检查系统资源: `free -h` 和 `df -h`
