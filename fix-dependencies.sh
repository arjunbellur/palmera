#!/bin/bash

echo "Fixing corrupted dependencies and hanging issues..."

# Kill any hanging npm processes
echo "Killing any hanging npm processes..."
pkill -f npm || true
pkill -f node || true

# Remove all node_modules and lock files
echo "Removing corrupted node_modules..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf apps/*/node_modules
rm -rf apps/*/package-lock.json
rm -rf packages/*/node_modules
rm -rf packages/*/package-lock.json

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Set npm configuration to prevent hanging
echo "Configuring npm to prevent hanging..."
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
npm config set fetch-retries 3
npm config set maxsockets 1
npm config set timeout 300000

# Reinstall dependencies with timeout protection
echo "Installing fresh dependencies..."
timeout 600 npm install --no-optional --prefer-offline --maxsockets 1 --progress=false

if [ $? -eq 124 ]; then
    echo "Installation timed out. Trying with reduced concurrency..."
    timeout 900 npm install --no-optional --prefer-offline --maxsockets 1 --progress=false --no-audit --no-fund
fi

echo "Dependencies fixed!"
