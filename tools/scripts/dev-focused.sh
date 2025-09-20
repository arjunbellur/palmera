#!/bin/bash
set -e

# Focused development - only start what you need
TARGET=${1:-"full"}

echo "🚀 Starting Palmera Development - Mode: $TARGET"

case $TARGET in
  "admin")
    echo "🏢 Admin-focused development..."
    pnpm --filter @palmera/tokens --filter @palmera/schemas --filter @palmera/ui --filter @palmera/sdk run dev &
    sleep 3
    pnpm --filter @palmera/web-admin run dev &
    pnpm --filter @palmera/api run dev &
    ;;
  "provider")
    echo "🏪 Provider-focused development..."
    pnpm --filter @palmera/tokens --filter @palmera/schemas --filter @palmera/ui --filter @palmera/sdk run dev &
    sleep 3  
    pnpm --filter @palmera/web-provider run dev &
    pnpm --filter @palmera/api run dev &
    ;;
  "mobile")
    echo "📱 Mobile-focused development..."
    pnpm --filter @palmera/tokens --filter @palmera/schemas --filter @palmera/ui --filter @palmera/sdk run dev &
    sleep 3
    pnpm --filter @palmera/mobile run dev &
    pnpm --filter @palmera/api run dev &
    ;;
  "full")
    echo "🌍 Full stack development..."
    ./scripts/start-dev.sh
    ;;
esac

echo "✅ Development servers started!"
echo "Press Ctrl+C to stop all services"

# Keep script running
wait
