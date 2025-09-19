#!/bin/bash
set -e

echo "Building dependencies for web-admin..."

# Build dependencies in order
pnpm --filter @palmera/tokens run build
pnpm --filter @palmera/schemas run build  
pnpm --filter @palmera/i18n run build
pnpm --filter @palmera/ui run build
pnpm --filter @palmera/sdk run build

# Build web-admin
pnpm --filter @palmera/web-admin run build

echo "Web-admin build complete!"
