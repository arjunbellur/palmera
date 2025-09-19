#!/bin/bash
set -e

# Intelligent watch mode for rapid development
TARGET=${1:-"admin"}

echo "👀 Starting watch mode for: $TARGET"
echo "🔥 Hot reload enabled - changes will rebuild automatically"

# Create a .cache directory for build artifacts
mkdir -p .cache/builds

case $TARGET in
  "admin")
    echo "🏢 Watching Admin Dashboard + Dependencies..."
    # Watch shared packages and rebuild only when changed
    pnpm --filter @palmera/tokens --filter @palmera/schemas --filter @palmera/ui --filter @palmera/sdk run dev &
    
    # Watch admin app
    pnpm --filter @palmera/web-admin run dev &
    
    # Watch API
    pnpm --filter @palmera/api run dev &
    ;;
    
  "provider") 
    echo "🏪 Watching Provider Portal + Dependencies..."
    pnpm --filter @palmera/tokens --filter @palmera/schemas --filter @palmera/ui --filter @palmera/sdk run dev &
    
    pnpm --filter @palmera/web-provider run dev &
    pnpm --filter @palmera/api run dev &
    ;;
    
  "mobile")
    echo "📱 Watching Mobile App + Dependencies..."
    pnpm --filter @palmera/tokens --filter @palmera/schemas --filter @palmera/ui --filter @palmera/sdk run dev &
    
    pnpm --filter @palmera/mobile run dev &
    pnpm --filter @palmera/api run dev &
    ;;
    
  "packages")
    echo "📦 Watching Shared Packages Only..."
    pnpm --filter @palmera/tokens --filter @palmera/schemas --filter @palmera/i18n --filter @palmera/ui --filter @palmera/sdk run dev &
    ;;
esac

echo ""
echo "🚀 Development servers started!"
echo "📝 Logs will appear below..."
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Keep script running and handle cleanup
trap 'echo "🛑 Stopping all services..."; jobs -p | xargs -r kill; exit' INT TERM

wait
