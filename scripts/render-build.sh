#!/bin/bash
set -e

echo "🚀 Building Palmera API for Render (Free Tier Optimized)..."

# Install production dependencies first
echo "📦 Installing production dependencies..."
pnpm install -w --prod --prefer-offline

# Install dev dependencies for schemas package (needed for tsup)
echo "🔧 Installing build tools for schemas package..."
cd packages/schemas
pnpm install --include=dev

# Build schemas package (required by API)
echo "🔧 Building schemas package..."
pnpm build

# Install dev dependencies for API (needed for NestJS build)
echo "🔧 Installing build tools for API..."
cd ../../apps/api
pnpm install --include=dev

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
pnpm db:generate

# Run database migrations (if needed)
if [ "$NODE_ENV" = "production" ]; then
    echo "🔄 Running database migrations..."
    pnpm prisma migrate deploy --skip-generate
fi

# Build API
echo "🏗️  Building API..."
NODE_OPTIONS="--max-old-space-size=512" pnpm build

echo "✅ Build completed successfully!"
echo "📁 API built in: apps/api/dist"
echo "⚡ Free tier optimizations applied"
