#!/bin/bash
set -e

echo "🚀 Building Palmera for Production..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Build shared package first
echo "🔧 Building shared package..."
cd shared && pnpm build && cd ..

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
cd apps/api && pnpm db:generate && cd ../..

# Build API
echo "🏗️ Building API..."
cd apps/api && pnpm build && cd ../..

# Build web apps
echo "🌐 Building web applications..."
cd apps/web-admin && pnpm build && cd ../..
cd apps/web-provider && pnpm build && cd ../..

# Build mobile app (for web)
echo "📱 Building mobile app for web..."
cd apps/mobile && pnpm build && cd ../..

echo "✅ Build completed successfully!"
echo "📁 Built applications:"
echo "  - API: apps/api/dist"
echo "  - Web Admin: apps/web-admin/out"
echo "  - Web Provider: apps/web-provider/out"
echo "  - Mobile: apps/mobile/dist"