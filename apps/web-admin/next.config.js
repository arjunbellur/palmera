/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@palmera/ui', '@palmera/schemas', '@palmera/sdk'],
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'localhost'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
}

module.exports = nextConfig
