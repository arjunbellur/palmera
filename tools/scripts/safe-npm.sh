#!/bin/bash

# Safe npm wrapper script to prevent hanging
# Usage: ./scripts/safe-npm.sh install
# Usage: ./scripts/safe-npm.sh run build

# Kill any hanging processes first
pkill -f npm || true
pkill -f node || true

# Set npm configuration for stability
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
npm config set fetch-retries 3
npm config set maxsockets 1
npm config set timeout 300000

# Run npm command with timeout (using gtimeout if available, otherwise direct)
echo "Running: npm $@"
if command -v gtimeout >/dev/null 2>&1; then
    gtimeout 600 npm "$@" --maxsockets 1 --progress=false
    if [ $? -eq 124 ]; then
        echo "Command timed out. Trying with reduced options..."
        gtimeout 900 npm "$@" --maxsockets 1 --progress=false --no-audit --no-fund
    fi
else
    # Fallback without timeout on macOS
    npm "$@" --maxsockets 1 --progress=false
fi
