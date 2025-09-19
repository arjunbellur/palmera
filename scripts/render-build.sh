#!/bin/bash
set -e

echo "🚀 Building Palmera API for Render (Free Tier Optimized)..."

# Install dependencies including dev dependencies for build tools
echo "📦 Installing dependencies (including dev dependencies for build)..."
pnpm install -w --include=dev --prefer-offline

# Build only essential shared packages
echo "🔧 Building shared packages..."
pnpm --filter @palmera/schemas run build

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
cd apps/api
pnpm db:generate

# Run database migrations (if needed)
if [ "$NODE_ENV" = "production" ]; then
    echo "🔄 Running database migrations..."
    pnpm prisma migrate deploy --skip-generate
fi

# Build API with optimization
echo "🏗️  Building API..."
NODE_OPTIONS="--max-old-space-size=512" pnpm build

echo "✅ Build completed successfully!"
echo "📁 API built in: apps/api/dist"
echo "⚡ Free tier optimizations applied"
