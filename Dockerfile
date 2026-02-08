# 使用阿里云镜像加速（国内服务器优化）
FROM node:20-alpine AS base

# 设置 pnpm 环境
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 设置国内镜像源（加速依赖安装）
RUN npm config set registry https://registry.npmmirror.com

# 依赖安装阶段
FROM base AS deps
WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（使用国内镜像）
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

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
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdmpwZnV1emt3aG10b2d3YXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NDU2MTksImV4cCI6MjA4NTQyMTYxOX0.shNsCrZYaWeGasP6mC0q1CplC2pXaKv-lTL8Eb9rtj8
ENV NEXT_PUBLIC_APP_URL=http://124.220.74.191:3000

# 构建应用
# 注意：NEXT_PUBLIC_* 环境变量会被嵌入到客户端代码中
RUN pnpm build

# 生产运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 设置文件权限
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
