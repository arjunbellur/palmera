#!/bin/bash

# Build script for unified web app
set -e

echo "🚀 Building Palmera Unified Web App..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build packages
echo "🔨 Building packages..."
pnpm run build:packages

# Build unified web app
echo "🌐 Building unified web app..."
cd apps/web-unified
pnpm run build

echo "✅ Unified web app build completed!"
echo "📁 Build output: apps/web-unified/out/"
echo "🚀 Ready for deployment!"
