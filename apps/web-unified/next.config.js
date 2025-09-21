/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore during builds due to ESLint config issue
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'Palmera Unified Dashboard',
  },
  // Disable middleware for static export
  skipMiddlewareUrlNormalize: true,
};

module.exports = nextConfig;
