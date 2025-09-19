#!/bin/bash
set -e

echo "🚀 Building Palmera API for Render (Free Tier Optimized)..."

# Temporarily override NODE_ENV to install dev dependencies
echo "📦 Installing dependencies (forcing dev dependencies installation)..."
NODE_ENV=development pnpm install -w --ignore-scripts --no-optional

# Build schemas package (required by API)
echo "🔧 Building schemas package..."
pnpm --filter @palmera/schemas run build

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
cd apps/api
pnpm db:generate

# Run database migrations (if needed)
echo "🔄 Running database migrations..."
pnpm prisma migrate deploy --skip-generate

# Build API
echo "🏗️  Building API..."
NODE_OPTIONS="--max-old-space-size=512" pnpm build

echo "✅ Build completed successfully!"
echo "📁 API built in: apps/api/dist"
echo "⚡ Free tier optimizations applied"