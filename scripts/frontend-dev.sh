#!/bin/bash
set -e

# Ultimate frontend development experience
ACTION=${1:-"help"}
TARGET=${2:-"admin"}

print_banner() {
    echo "🚀 ================================="
    echo "🎨   PALMERA FRONTEND DEV SUITE   "
    echo "🚀 ================================="
}

show_help() {
    echo ""
    echo "Usage: ./scripts/frontend-dev.sh <action> [target]"
    echo ""
    echo "Actions:"
    echo "  start     - Start development with hot reload"
    echo "  build     - Build for production" 
    echo "  test      - Run tests with watch mode"
    echo "  lint      - Lint and fix code"
    echo "  clean     - Clean build artifacts"
    echo "  deploy    - Build and prepare for deployment"
    echo ""
    echo "Targets:"
    echo "  admin     - Web Admin Dashboard"
    echo "  provider  - Web Provider Portal" 
    echo "  mobile    - Mobile App"
    echo "  all       - All applications"
    echo ""
    echo "Examples:"
    echo "  ./scripts/frontend-dev.sh start admin     # Start admin dev"
    echo "  ./scripts/frontend-dev.sh build provider  # Build provider"
    echo "  ./scripts/frontend-dev.sh test all        # Test everything"
    echo ""
}

case $ACTION in
  "start")
    print_banner
    echo "🔥 Starting rapid development for: $TARGET"
    ./scripts/dev-watch.sh $TARGET
    ;;
    
  "build")
    print_banner
    echo "🏗️  Building optimized version of: $TARGET"
    ./scripts/build-optimized.sh $TARGET
    ;;
    
  "test")
    print_banner
    echo "🧪 Running tests for: $TARGET"
    if [ "$TARGET" = "all" ]; then
      pnpm test
    else
      pnpm --filter @palmera/web-$TARGET run test --watch
    fi
    ;;
    
  "lint")
    print_banner
    echo "🔍 Linting and fixing code for: $TARGET"
    if [ "$TARGET" = "all" ]; then
      pnpm lint:fix
    else
      pnpm --filter @palmera/web-$TARGET run lint --fix
    fi
    ;;
    
  "clean")
    print_banner
    echo "🧹 Cleaning build artifacts..."
    pnpm clean
    echo "✅ Clean completed!"
    ;;
    
  "deploy")
    print_banner
    echo "🚀 Preparing deployment for: $TARGET"
    echo "🧹 Cleaning previous builds..."
    pnpm clean
    echo "🏗️  Building optimized version..."
    ./scripts/build-optimized.sh $TARGET
    echo "🔍 Running final checks..."
    pnpm --filter @palmera/web-$TARGET run type-check
    echo "✅ Ready for deployment!"
    ;;
    
  "help"|*)
    print_banner
    show_help
    ;;
esac
