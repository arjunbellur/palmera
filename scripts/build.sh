#!/bin/bash

# Build script for Palmera monorepo
set -e

echo "🚀 Starting Palmera build process..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm@9.0.0
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd apps/api
pnpm db:generate
cd ../..

# Type check
echo "🔍 Running type check..."
pnpm type-check

# Lint
echo "🧹 Running linter..."
pnpm lint

# Build packages
echo "🏗️ Building packages..."
pnpm build

echo "✅ Build completed successfully!"
