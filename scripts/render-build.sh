#!/bin/bash
set -e

echo "🚀 Building Palmera API for Render (Free Tier Optimized)..."

# Clean up any corrupted node_modules to avoid optional dependency issues
echo "🧹 Cleaning up node_modules to ensure fresh install..."
rm -rf node_modules/.pnpm
rm -rf packages/*/node_modules
rm -rf apps/*/node_modules

# Temporarily override NODE_ENV to install dev dependencies
# Remove --ignore-scripts and add --no-optional=false to ensure optional dependencies are installed
echo "📦 Installing dependencies (forcing dev dependencies installation)..."
NODE_ENV=development pnpm install -w --no-optional=false --frozen-lockfile=false

# Explicitly install the missing Rollup dependency for Linux x64
echo "🔧 Ensuring Rollup Linux x64 dependency is available..."
pnpm add @rollup/rollup-linux-x64-gnu@4.50.1 --save-optional --workspace-root || echo "⚠️  Optional dependency install failed, continuing..."

# Build schemas package (required by API)
echo "🔧 Building schemas package..."
if ! pnpm --filter @palmera/schemas run build; then
  echo "⚠️  tsup build failed, trying fallback build method..."
  cd packages/schemas
  pnpm run build:fallback
  cd ../..
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
cd apps/api
pnpm db:generate

# Run database migrations (if needed)
echo "🔄 Running database migrations..."
pnpm prisma migrate deploy

# Build API
echo "🏗️  Building API..."
NODE_OPTIONS="--max-old-space-size=512" pnpm build

echo "✅ Build completed successfully!"
echo "📁 API built in: apps/api/dist"
echo "⚡ Free tier optimizations applied"