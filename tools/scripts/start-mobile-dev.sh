#!/bin/bash
set -e

echo "🚀 Starting Palmera Mobile Development Environment..."

# Navigate to mobile app directory
cd "$(dirname "$0")/../apps/mobile"

# Kill any existing processes on common ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:8081,8082,8083 2>/dev/null | xargs kill -9 2>/dev/null || true

# Wait a moment for cleanup
sleep 2

# Start Expo development server
echo "📱 Starting Expo development server..."
pnpm start &
EXPO_PID=$!

# Wait for Expo to start
echo "⏳ Waiting for Expo to initialize..."
sleep 10

# Check if Expo is running
if curl -s http://localhost:8081 > /dev/null; then
    echo "✅ Expo development server is running at http://localhost:8081"
    
    # Open development tools and iOS Simulator
    echo "🌐 Opening Expo development tools..."
    open http://localhost:8081
    
    echo "📱 Opening iOS Simulator..."
    open -a Simulator
    
    echo ""
    echo "🎉 Mobile development environment ready!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Wait for iOS Simulator to load"
    echo "2. Install 'Expo Go' from the App Store (in simulator)"
    echo "3. Open Expo Go and scan the QR code from the browser"
    echo "4. Or use the browser interface to run on simulator"
    echo ""
    echo "🛑 To stop: Press Ctrl+C or run 'pkill -f expo'"
    
    # Keep the script running
    wait $EXPO_PID
else
    echo "❌ Failed to start Expo development server"
    kill $EXPO_PID 2>/dev/null || true
    exit 1
fi
