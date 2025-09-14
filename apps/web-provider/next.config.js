/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@palmera/schemas', '@palmera/sdk'],
  images: {
    domains: ['images.unsplash.com', 'localhost'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3001',
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
