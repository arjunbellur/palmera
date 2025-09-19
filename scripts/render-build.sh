#!/bin/bash
set -e

echo "🚀 Building Palmera API for Render (Free Tier Optimized)..."

# Skip problematic optional dependencies and install with npm
echo "📦 Installing dependencies (avoiding native compilation)..."
npm install --production=false --ignore-scripts --no-optional

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
cd apps/api
npx prisma generate

# Run database migrations (if needed)
if [ "$NODE_ENV" = "production" ]; then
    echo "🔄 Running database migrations..."
    npx prisma migrate deploy --skip-generate
fi

# Build API directly
echo "🏗️  Building API..."
NODE_OPTIONS="--max-old-space-size=512" npx nest build

echo "✅ Build completed successfully!"
echo "📁 API built in: apps/api/dist"
echo "⚡ Free tier optimizations applied"
