# 阿里云服务器部署指南（完整版）

## 📋 概述

本文档提供两种部署方法，优先使用方法一（GitHub 推送），如果网络不通则使用方法二（本地上传）。

**服务器信息**：
- IP：106.14.115.73
- 用户：root
- 项目路径：/home/admin/kaoshanmeng
- 域名：https://kaoshanmeng.cn
- GitHub 仓库：https://github.com/3478137972-bit/kaoshanmeng

---

## 🚀 方法一：GitHub 推送（推荐，优先使用）

### 优点
- ✅ 有版本控制，可以回滚
- ✅ 团队协作方便
- ✅ 有完整的提交历史
- ✅ 可以自动化部署

### 缺点
- ❌ 国内访问 GitHub 网络不稳定
- ❌ 可能需要多次重试

---

### 完整流程

#### 第一步：在本地提交并推送到 GitHub

```bash
# 1. 查看修改的文件
cd d:\KaoShanMeng
git status

# 2. 添加修改的文件
git add .

# 3. 提交更改
git commit -m "描述你的修改内容"

# 4. 推送到 GitHub
git push origin master
```

#### 第二步：在服务器上拉取更新

```bash
# 1. SSH 登录到服务器
ssh root@106.14.115.73

# 2. 进入项目目录
cd /home/admin/kaoshanmeng

# 3. 拉取最新代码
git pull origin master

# 4. 根据修改类型选择部署方式
```

#### 第三步：部署更新

**情况A：只修改了代码文件（最快，5-10秒）**
```bash
docker compose restart
```

**情况B：修改了依赖或配置（2-3分钟）**
```bash
docker compose build
docker compose up -d
```

**情况C：需要完全重新构建（5-8分钟）**
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

#### 第四步：验证部署

```bash
# 查看容器状态
docker compose ps

# 查看日志
docker compose logs --tail=20

# 访问网站
# https://kaoshanmeng.cn
```

---

### 如果 git pull 失败

如果遇到网络错误（如 "Empty reply from server"），尝试以下方法：

#### 方法1：增加超时时间后重试

```bash
git config --global http.postBuffer 524288000
git config --global http.timeout 600
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999

# 重试
git pull origin master
```

#### 方法2：使用 fetch + merge

```bash
git fetch origin master
git merge origin/master
```

#### 方法3：强制重置到远程版本

```bash
git fetch origin master
git reset --hard origin/master
```

#### 如果所有方法都失败

**切换到方法二：本地上传**

---

## 📦 方法二：本地上传 + 重新构建（备用方案）

### 优点
- ✅ 不依赖 GitHub 网络
- ✅ 上传速度快
- ✅ 可以选择性上传文件

### 缺点
- ❌ 没有版本控制
- ❌ 需要手动管理文件
- ❌ 容易遗漏文件

---

### 完整流程

#### 第一步：在本地查看修改的文件

```bash
cd d:\KaoShanMeng
git status
```

记录所有修改的文件路径。

#### 第二步：使用 SCP 上传文件

**上传单个文件**：
```bash
scp "d:\KaoShanMeng\文件路径" root@106.14.115.73:/home/admin/kaoshanmeng/文件路径
```

**示例**：
```bash
# 上传 app/page.tsx
scp "d:\KaoShanMeng\app\page.tsx" root@106.14.115.73:/home/admin/kaoshanmeng/app/page.tsx

# 上传 components/Header.tsx
scp "d:\KaoShanMeng\components\Header.tsx" root@106.14.115.73:/home/admin/kaoshanmeng/components/Header.tsx
```

**上传整个目录**：
```bash
scp -r "d:\KaoShanMeng\目录名" root@106.14.115.73:/home/admin/kaoshanmeng/
```

**示例**：
```bash
# 上传 app 目录
scp -r "d:\KaoShanMeng\app" root@106.14.115.73:/home/admin/kaoshanmeng/

# 上传 components 目录
scp -r "d:\KaoShanMeng\components" root@106.14.115.73:/home/admin/kaoshanmeng/
```

**首次连接提示**：
- 如果提示 "Are you sure you want to continue connecting"
- 切换到英文输入法
- 输入 `yes` 并按回车
- 输入 root 密码

#### 第三步：在服务器上重新构建

⚠️ **重要**：使用本地上传后，必须重新构建，不能只重启！

```bash
# 1. SSH 登录到服务器
ssh root@106.14.115.73

# 2. 进入项目目录
cd /home/admin/kaoshanmeng

# 3. 停止容器
docker compose down

# 4. 重新构建（使用 --no-cache 确保使用最新文件）
docker compose build --no-cache

# 5. 启动容器
docker compose up -d

# 6. 查看日志
docker compose logs -f
```

#### 第四步：验证部署

```bash
# 查看容器状态
docker compose ps

# 访问网站
# https://kaoshanmeng.cn
```

---

## 🎯 部署决策流程图

```
开始部署
    │
    ├─→ 尝试方法一：GitHub 推送
    │       │
    │       ├─→ git push 成功？
    │       │       │
    │       │       ├─→ 是 → git pull 成功？
    │       │       │           │
    │       │       │           ├─→ 是 → 部署成功 ✅
    │       │       │           │
    │       │       │           └─→ 否 → 尝试增加超时重试
    │       │       │                       │
    │       │       │                       ├─→ 成功 → 部署成功 ✅
    │       │       │                       │
    │       │       │                       └─→ 失败 → 使用方法二
    │       │       │
    │       │       └─→ 否 → 检查网络或 Token
    │       │
    │       └─→ 多次失败 → 使用方法二
    │
    └─→ 方法二：本地上传
            │
            ├─→ SCP 上传文件
            │
            ├─→ 重新构建容器
            │
            └─→ 部署成功 ✅
```

---

## 📝 快速命令参考

### 方法一：GitHub 推送

| 步骤 | 命令 |
|------|------|
| 本地提交 | `git add . && git commit -m "消息" && git push origin master` |
| 服务器拉取 | `ssh root@106.14.115.73 "cd /home/admin/kaoshanmeng && git pull origin master"` |
| 快速重启 | `ssh root@106.14.115.73 "cd /home/admin/kaoshanmeng && docker compose restart"` |
| 重新构建 | `ssh root@106.14.115.73 "cd /home/admin/kaoshanmeng && docker compose build && docker compose up -d"` |

### 方法二：本地上传

| 步骤 | 命令 |
|------|------|
| 上传文件 | `scp "本地路径" root@106.14.115.73:/home/admin/kaoshanmeng/服务器路径` |
| 上传目录 | `scp -r "本地目录" root@106.14.115.73:/home/admin/kaoshanmeng/` |
| 重新构建 | `ssh root@106.14.115.73 "cd /home/admin/kaoshanmeng && docker compose down && docker compose build --no-cache && docker compose up -d"` |

### 一键部署命令

**方法一（GitHub）**：
```bash
# 本地推送 + 服务器拉取 + 重启
git add . && git commit -m "更新" && git push origin master && ssh root@106.14.115.73 "cd /home/admin/kaoshanmeng && git pull origin master && docker compose restart"
```

**方法二（本地上传）**：
```bash
# 上传后重新构建
scp -r "d:\KaoShanMeng\app" root@106.14.115.73:/home/admin/kaoshanmeng/ && ssh root@106.14.115.73 "cd /home/admin/kaoshanmeng && docker compose down && docker compose build --no-cache && docker compose up -d"
```

---

## 🔧 故障排查

### 问题1：git pull 失败 - "Empty reply from server"

**原因**：GitHub 网络连接问题

**解决方案**：
1. 增加超时时间后重试
2. 使用 fetch + merge
3. 如果多次失败，切换到方法二

### 问题2：SCP 上传失败 - "Permission denied"

**原因**：密码错误或权限问题

**解决方案**：
1. 确认使用 root 用户
2. 检查密码是否正确
3. 确认服务器路径正确

### 问题3：容器没有运行

**症状**：`docker compose ps` 没有显示容器

**解决方案**：
```bash
# 启动容器
docker compose up -d

# 查看错误日志
docker compose logs -f
```

### 问题4：网站没有更新

**可能原因**：
1. 使用了 `restart` 而不是 `build`
2. Docker 使用了旧缓存
3. 浏览器缓存

**解决方案**：
```bash
# 完全重新构建
docker compose down
docker compose build --no-cache
docker compose up -d

# 清除浏览器缓存
# Ctrl + Shift + Delete 或使用无痕模式
```

### 问题5：构建失败

**解决方案**：
```bash
# 查看详细错误
docker compose logs --tail=100

# 检查环境变量
cat .env.local

# 检查磁盘空间
df -h

# 清理 Docker 缓存
docker system prune -a
```

---

## 📌 重要注意事项

### 1. 使用方法二后必须重新构建

❌ **错误做法**：
```bash
# 上传文件后只重启
scp ... && docker compose restart  # 不会生效！
```

✅ **正确做法**：
```bash
# 上传文件后重新构建
scp ... && docker compose down && docker compose build --no-cache && docker compose up -d
```

### 2. 文件路径必须正确

- ✅ 使用双引号：`"d:\KaoShanMeng\app\page.tsx"`
- ❌ 不要省略引号：`d:\KaoShanMeng\app\page.tsx`

### 3. 目录上传需要 -r 参数

- ✅ `scp -r "目录" root@...`
- ❌ `scp "目录" root@...`（会失败）

### 4. 环境变量文件不要上传

- ⚠️ 不要上传 `.env.local`（包含敏感信息）
- ⚠️ 服务器上的环境变量文件不要删除

### 5. 定期提交到 GitHub

即使使用方法二部署，也要定期提交到 GitHub：
```bash
git add .
git commit -m "更新"
git push origin master
```

这样可以保留版本历史。

---

## 🎓 最佳实践

### 1. 优先使用方法一

- 每次部署先尝试 GitHub 推送
- 只有在网络问题时才使用方法二
- 定期检查 GitHub 网络是否恢复

### 2. 使用 VS Code Remote SSH

更方便的开发方式：
1. 安装 VS Code Remote SSH 扩展
2. 连接到服务器：`ssh root@106.14.115.73`
3. 直接在 VS Code 中编辑服务器文件
4. 保存后执行 `docker compose restart`

### 3. 创建部署脚本

**deploy.bat**（Windows）：
```batch
@echo off
echo ========================================
echo   部署到阿里云服务器
echo ========================================
echo.

echo 方法一：尝试 GitHub 推送...
git add .
git commit -m "更新"
git push origin master

if %errorlevel% neq 0 (
    echo.
    echo ❌ GitHub 推送失败，切换到方法二...
    echo.

    echo 上传文件...
    scp -r "d:\KaoShanMeng\app" root@106.14.115.73:/home/admin/kaoshanmeng/

    echo 重新构建...
    ssh root@106.14.115.73 "cd /home/admin/kaoshanmeng && docker compose down && docker compose build --no-cache && docker compose up -d"
) else (
    echo.
    echo ✅ GitHub 推送成功，在服务器上拉取...
    echo.

    ssh root@106.14.115.73 "cd /home/admin/kaoshanmeng && git pull origin master && docker compose restart"
)

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 访问网站: https://kaoshanmeng.cn
pause
```

### 4. 定期备份

```bash
# 在服务器上定期备份
ssh root@106.14.115.73 "cd /home/admin && tar -czf kaoshanmeng-backup-$(date +%Y%m%d).tar.gz kaoshanmeng/"
```

### 5. 监控容器状态

```bash
# 每天检查一次
ssh root@106.14.115.73 "cd /home/admin/kaoshanmeng && docker compose ps && docker compose logs --tail=10"
```

---

## 📊 两种方法对比

| 特性 | 方法一：GitHub 推送 | 方法二：本地上传 |
|------|-------------------|----------------|
| **速度** | 取决于网络 | 快速稳定 |
| **可靠性** | 网络不稳定 | 非常可靠 |
| **版本控制** | ✅ 有 | ❌ 无 |
| **团队协作** | ✅ 方便 | ❌ 不便 |
| **回滚** | ✅ 容易 | ❌ 困难 |
| **操作复杂度** | 简单 | 中等 |
| **适用场景** | 日常开发 | 网络问题时 |

---

## 📚 相关文档

- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Git 文档](https://git-scm.com/doc)
- [SCP 命令详解](https://linux.die.net/man/1/scp)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

---

## 🆘 获取帮助

如果遇到问题：
1. 查看 Docker 日志：`docker compose logs -f`
2. 查看 Nginx 日志：`sudo tail -f /var/log/nginx/error.log`
3. 检查容器状态：`docker compose ps`
4. 检查磁盘空间：`df -h`
5. 检查网络连接：`ping github.com`

---

**最后更新**：2026-02-12
**适用版本**：Docker Compose v2+
**维护者**：靠山盟团队
