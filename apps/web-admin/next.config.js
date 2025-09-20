/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  transpilePackages: ['@palmera/schemas', '@palmera/sdk', '@palmera/ui', '@palmera/tokens', '@palmera/i18n'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'localhost'],
    unoptimized: true, // Required for static export
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3004',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  webpack: (config, { isServer }) => {
    // Exclude React Native from web builds
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native': false,
      'react-native-web': false,
    };
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'react-native': false,
      'react-native-web': false,
    };

    return config;
  },
}

module.exports = nextConfig
