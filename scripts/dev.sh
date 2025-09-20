#!/bin/bash
set -e

echo "🚀 Starting Palmera Development Environment..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
cd apps/api && pnpm db:generate && cd ../..

# Build shared package
echo "🔧 Building shared package..."
cd shared && pnpm build && cd ..

# Start all development servers concurrently
echo "🎯 Starting all development servers..."
echo "📱 Mobile: http://localhost:8081"
echo "🌐 Web: http://localhost:3000" 
echo "⚡ API: http://localhost:3002"
echo ""

# Use concurrently to run all dev servers
npx concurrently \
  --names "API,WEB,MOBILE" \
  --prefix-colors "blue,green,yellow" \
  "cd apps/api && pnpm dev" \
  "cd apps/web-admin && pnpm dev" \
  "cd apps/mobile && pnpm start"
