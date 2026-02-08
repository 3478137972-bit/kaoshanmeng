/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 仅在 Docker 环境中启用 standalone 模式
  // Vercel 等平台部署时不会影响
  ...(process.env.DOCKER_BUILD === 'true' && {
    output: 'standalone',
  }),
}

export default nextConfig
