#!/bin/bash

# Fast startup script for Palmera development
echo "🚀 Starting Palmera Development Environment..."

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "expo\|next\|turbo" 2>/dev/null || true

# Start API server
echo "🔧 Starting API server..."
cd apps/api && npm run dev &
API_PID=$!

# Wait for API to start
sleep 3

# Start Provider Dashboard
echo "🏢 Starting Provider Dashboard..."
cd ../web-provider && npm run dev &
PROVIDER_PID=$!

# Start Admin Dashboard  
echo "👑 Starting Admin Dashboard..."
cd ../web-admin && npm run dev &
ADMIN_PID=$!

# Start Mobile App (using the working standalone version)
echo "📱 Starting Mobile App..."
cd /tmp/palmera-test && ./node_modules/.bin/expo start --ios &
MOBILE_PID=$!

echo "✅ All services started!"
echo "📊 Provider Dashboard: http://localhost:3001/dashboard"
echo "👑 Admin Dashboard: http://localhost:3004"
echo "📱 Mobile App: Running in iOS Simulator"
echo "🔧 API Server: http://localhost:3003"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    kill $API_PID $PROVIDER_PID $ADMIN_PID $MOBILE_PID 2>/dev/null || true
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for all processes
wait
