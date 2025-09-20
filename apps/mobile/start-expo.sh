#!/bin/bash

# Palmera Mobile App - Expo Start Script
echo "🌴 Starting Palmera Mobile App with Expo..."

# Navigate to mobile app directory
cd "$(dirname "$0")"

# Kill any existing Expo processes
echo "🧹 Cleaning up existing Expo processes..."
pkill -f "expo start" 2>/dev/null || true
pkill -f "Metro Bundler" 2>/dev/null || true

# Clear Expo cache and start with pnpm
echo "🗑️  Clearing Expo cache and starting with pnpm..."
pnpm expo start --clear --port 8081

echo "✅ Expo server started on http://localhost:8081"
echo "📱 Scan the QR code with Expo Go app on your phone"
echo "🌐 Or open http://localhost:8081 in your browser"
