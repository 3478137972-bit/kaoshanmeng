# Docker 环境变量配置问题解决方案

## 问题描述

在 Docker 部署时，Next.js 应用无法正确读取 Supabase 环境变量，导致应用使用占位符 URL (`placeholder.supabase.co`) 而不是实际的 Supabase 配置。

### 错误表现

浏览器控制台显示以下错误：
```
POST https://placeholder.supabase.co/auth/v1/token?grant_type=password net::ERR_NAME_NOT_RESOLVED
TypeError: Failed to fetch
```

## 问题根本原因

Next.js 的 `NEXT_PUBLIC_*` 环境变量在**构建时**被嵌入到客户端代码中，而不是在运行时读取。如果构建时这些环境变量为空或未正确传递，Next.js 会使用代码中的默认值（占位符）。

### 尝试过的方法（未成功）

1. **使用 `.env.local` 文件** - 该文件只在运行时加载，构建时不会读取
2. **使用 `docker-compose.yml` 的 `build.args`** - 需要配合 `.env` 文件，但 Docker Compose 的环境变量传递机制不够可靠
3. **使用 `export` 导出环境变量** - `sudo` 命令会丢失环境变量

## 最终解决方案

**直接在 Dockerfile 中硬编码环境变量值**，确保构建时一定会使用正确的配置。

### 修改 Dockerfile

在 `Dockerfile` 的构建阶段（builder stage）中，直接设置环境变量：

```dockerfile
# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量以启用 standalone 模式
ENV DOCKER_BUILD=true

# 直接设置环境变量（Next.js 构建时需要）
ENV NEXT_PUBLIC_SUPABASE_URL=https://tdvjpfuuzkwhmtogwavj.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ENV NEXT_PUBLIC_APP_URL=http://your-server-ip:3000

# 构建应用
RUN pnpm build
```

### 部署步骤

1. **修改 Dockerfile**，添加环境变量配置
2. **提交并推送代码**到 Git 仓库
3. **在服务器上拉取最新代码**：
   ```bash
   git pull origin master
   ```
4. **停止容器并删除旧镜像**：
   ```bash
   sudo docker compose down
   sudo docker rmi kaoshanmeng-kaoshanmeng-app
   ```
5. **强制重新构建（不使用缓存）**：
   ```bash
   sudo docker compose build --no-cache
   ```
6. **启动容器**：
   ```bash
   sudo docker compose up -d
   ```
7. **查看日志确认启动成功**：
   ```bash
   sudo docker compose logs -f
   ```

## 注意事项

### 安全性考虑

- ⚠️ **不要将包含敏感信息的 Dockerfile 提交到公开仓库**
- 对于公开项目，建议使用 CI/CD 环境变量或 secrets 管理
- `NEXT_PUBLIC_*` 变量会被嵌入到客户端代码中，不应包含敏感信息
- 敏感的服务端密钥（如 `SUPABASE_SERVICE_ROLE_KEY`）应该只在 `.env.local` 中配置，不要放在 Dockerfile 中

### 环境变量文件说明

项目中有两个环境变量文件，作用不同：

1. **`.env`** - Docker Compose 用于构建时的变量替换（如果使用 ARG 方式）
2. **`.env.local`** - 运行时环境变量，包含服务端密钥

### 多环境部署

如果需要支持多个部署环境（开发、测试、生产），可以：

1. 创建多个 Dockerfile（如 `Dockerfile.dev`, `Dockerfile.prod`）
2. 或者使用 ARG + 构建时传参的方式
3. 或者使用 CI/CD 工具在构建时动态替换环境变量

## 验证方法

部署完成后，访问应用并打开浏览器开发者工具（F12），检查：

1. **控制台（Console）** - 不应再有 `placeholder.supabase.co` 的错误
2. **网络（Network）** - Supabase 请求应该指向正确的 URL
3. **应用功能** - 登录、数据库操作等功能应该正常工作

## 相关文件

- `Dockerfile` - Docker 镜像构建配置
- `docker-compose.yml` - Docker Compose 服务配置
- `.env.local` - 运行时环境变量（不提交到 Git）
- `lib/supabase-client.ts` - Supabase 客户端配置

## 参考资料

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Docker Build Arguments](https://docs.docker.com/engine/reference/builder/#arg)
- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)
