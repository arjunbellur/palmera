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

# Build unified web app
echo "🌐 Building unified web application..."
cd apps/web-unified && pnpm build && cd ../..

# Build mobile app (for web)
echo "📱 Building mobile app for web..."
cd apps/mobile && pnpm build && cd ../..

echo "✅ Build completed successfully!"
echo "📁 Built applications:"
echo "  - API: apps/api/dist"
echo "  - Unified Web App: apps/web-unified/out"
echo "  - Mobile: apps/mobile/dist"