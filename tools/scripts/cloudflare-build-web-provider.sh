#!/bin/bash
set -e

echo "🚀 Starting Cloudflare build for web-provider..."

# Ensure we're in the right directory
cd "$(dirname "$0")/.."

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install --frozen-lockfile
fi

# Build packages in dependency order
echo "🔧 Building packages..."
pnpm --filter @palmera/tokens run build
pnpm --filter @palmera/schemas run build
pnpm --filter @palmera/i18n run build
pnpm --filter @palmera/ui run build
pnpm --filter @palmera/sdk run build

# Build web-provider
echo "🌐 Building web-provider..."
pnpm --filter @palmera/web-provider run build

echo "✅ Build completed successfully!"
echo "📁 Output directory: apps/web-provider/out"
