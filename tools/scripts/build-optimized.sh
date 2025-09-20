#!/bin/bash
set -e

# Optimized build with caching and parallel execution
TARGET_APP=${1:-"all"}

echo "🚀 Building Palmera - Target: $TARGET_APP"

# Build shared packages in parallel where possible
echo "📦 Building shared packages..."
pnpm --filter @palmera/tokens --filter @palmera/schemas run build &
SHARED_PID1=$!

wait $SHARED_PID1

pnpm --filter @palmera/i18n --filter @palmera/ui --filter @palmera/sdk run build &
SHARED_PID2=$!

wait $SHARED_PID2

# Build target applications
case $TARGET_APP in
  "web-admin")
    echo "🏢 Building Web Admin..."
    pnpm --filter @palmera/web-admin run build
    ;;
  "web-provider") 
    echo "🏪 Building Web Provider..."
    pnpm --filter @palmera/web-provider run build
    ;;
  "mobile")
    echo "📱 Building Mobile..."
    pnpm --filter @palmera/mobile run build
    ;;
  "api")
    echo "🔌 Building API..."
    pnpm --filter @palmera/api run build
    ;;
  "all")
    echo "🌍 Building all applications..."
    pnpm --filter @palmera/web-admin --filter @palmera/web-provider --filter @palmera/api --filter @palmera/mobile run build
    ;;
esac

echo "✅ Build completed successfully!"
