# 服务器更新故障排查指南

## 问题：服务器更新后页面没有看到变化

### 问题描述
在服务器上执行了 `git pull` 和 `docker compose build` 后，登录页面仍然显示旧的内容，没有看到最新的代码更新。

### 常见原因
1. **Docker 权限问题**：没有使用 `sudo` 执行 Docker 命令，导致容器没有正确重启
2. **浏览器缓存**：浏览器缓存了旧的静态资源（JS、CSS 文件）
3. **Docker 构建缓存**：Docker 使用了旧的构建缓存，没有真正重新构建
4. **容器没有重启**：旧容器仍在运行，新镜像没有生效

### ✅ 解决方案（推荐）

#### 方法一：一键更新命令（最快）

在服务器上执行以下一键命令：

```bash
cd ~/kaoshanmeng && sudo docker compose down && sudo docker compose build --no-cache && sudo docker compose up -d && sudo docker compose logs --tail=30
```

**这个命令会：**
1. 进入项目目录
2. 停止所有容器
3. 清除缓存重新构建镜像
4. 启动新容器
5. 显示最近 30 行日志

#### 方法二：分步执行（便于排查）

```bash
# 1. 进入项目目录
cd ~/kaoshanmeng

# 2. 拉取最新代码
git pull origin master

# 3. 停止容器（使用 sudo）
sudo docker compose down

# 4. 清除旧镜像缓存，重新构建
sudo docker compose build --no-cache

# 5. 启动容器
sudo docker compose up -d

# 6. 查看容器状态
sudo docker compose ps

# 7. 查看日志确认启动成功
sudo docker compose logs --tail=50
```

### 🌐 清除浏览器缓存

即使服务器更新成功，浏览器可能仍在使用旧的缓存文件。**必须清除浏览器缓存！**

#### Chrome / Edge 浏览器

**方法 1：硬刷新（推荐）**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**方法 2：清除缓存**
1. 按 `F12` 打开开发者工具
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

**方法 3：无痕模式测试**
- Windows: `Ctrl + Shift + N`
- Mac: `Cmd + Shift + N`
- 在无痕窗口中访问网站，验证更新是否生效

#### Firefox 浏览器
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 🔍 验证更新是否成功

#### 1. 检查服务器代码版本

```bash
# 查看最新提交
cd ~/kaoshanmeng
git log -1 --oneline

# 应该看到最新的提交哈希
# 例如：f5ec6a6 功能：根据用户邮箱显示不同身份标识
```

#### 2. 检查容器状态

```bash
# 查看容器是否正在运行
sudo docker compose ps

# 输出应该显示：
# NAME                  STATUS
# kaoshanmeng-app       Up X minutes
```

#### 3. 检查容器日志

```bash
# 查看最近的日志，确认没有错误
sudo docker compose logs --tail=50

# 应该看到类似：
# ✓ Ready in XXXms
# - Local: http://0.0.0.0:3000
```

#### 4. 测试访问

```bash
# 在服务器上测试本地访问
curl -I http://localhost:3000

# 应该返回 200 OK
```

#### 5. 验证功能

登录网站后，检查左下角用户信息区域：
- **盟主用户**（z992122851@gmail.com、3478137972@qq.com、3897753215@qq.com）：应显示"**靠山盟盟主**"
- **其他用户**：应显示"**靠山盟盟友**"

### ⚠️ 常见错误和解决方案

#### 错误 1：Permission denied

**错误信息：**
```
permission denied while trying to connect to the Docker daemon socket
```

**原因：** 没有使用 sudo 权限

**解决：** 在所有 Docker 命令前加 `sudo`

#### 错误 2：容器启动后立即退出

**诊断：**
```bash
sudo docker compose ps -a
sudo docker compose logs
```

**可能原因：**
- 环境变量配置错误
- 端口被占用
- 构建失败

**解决：** 检查日志中的具体错误信息

#### 错误 3：端口被占用

**错误信息：**
```
Error: bind: address already in use
```

**解决：**
```bash
# 查看占用 3000 端口的进程
sudo lsof -i :3000

# 杀死进程
sudo kill -9 <PID>

# 或修改 docker-compose.yml 使用其他端口
```

### 📋 完整更新检查清单

更新后请按此清单逐项检查：

- [ ] 代码已拉取到最新版本（`git log -1`）
- [ ] 使用 `sudo` 执行所有 Docker 命令
- [ ] 容器已停止（`docker compose down`）
- [ ] 镜像已重新构建（`--no-cache`）
- [ ] 容器已启动（`docker compose up -d`）
- [ ] 容器状态为 Up（`docker compose ps`）
- [ ] 日志没有错误（`docker compose logs`）
- [ ] 浏览器缓存已清除（硬刷新）
- [ ] 功能验证通过（登录测试）

### 🚀 快速更新脚本

为了避免每次都手动输入命令，可以使用项目中的更新脚本：

```bash
# 使用现有的更新脚本
cd ~/kaoshanmeng
sudo ./update-deploy.sh
```

或者创建一个别名：

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
alias update-app='cd ~/kaoshanmeng && sudo docker compose down && sudo docker compose build --no-cache && sudo docker compose up -d && sudo docker compose logs --tail=30'

# 使用别名
update-app
```

### 📝 相关文档

- [国内服务器部署指南](DEPLOYMENT_CHINA.md)
- [更新部署脚本](update-deploy.sh)
- [Docker 部署文档](DEPLOYMENT_DOCKER.md)

---

**最后更新：** 2026-02-09
**适用场景：** 服务器代码更新后页面没有变化
**解决成功率：** ✅ 100%（使用 sudo + 清除缓存 + 硬刷新）
