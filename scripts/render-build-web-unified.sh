#!/bin/bash
set -e

echo "🚀 Building Palmera Unified Web App for Render (Free Tier Optimized)..."

# Clean up any corrupted node_modules to avoid optional dependency issues
echo "🧹 Cleaning up node_modules to ensure fresh install..."
rm -rf node_modules/.pnpm
rm -rf packages/*/node_modules
rm -rf apps/*/node_modules

# Temporarily override NODE_ENV to install dev dependencies
echo "📦 Installing dependencies (forcing dev dependencies installation)..."
NODE_ENV=development pnpm install -w --no-optional=false --frozen-lockfile=false

# Build shared packages first (required by web app)
echo "🔧 Building shared packages..."
pnpm run build:packages

# Build the unified web app
echo "🌐 Building unified web app..."
cd apps/web-unified

# Install dependencies specifically for the web app
echo "📦 Installing web app dependencies..."
pnpm install

# Build the Next.js app
echo "🏗️  Building Next.js app..."
NODE_OPTIONS="--max-old-space-size=512" pnpm build

echo "✅ Unified web app build completed successfully!"
echo "📁 Web app built in: apps/web-unified/.next"
echo "⚡ Free tier optimizations applied"
