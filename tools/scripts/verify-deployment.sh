#!/bin/bash
set -e

echo "🔍 PALMERA DEPLOYMENT VERIFICATION"
echo "=================================="

# Test builds
echo ""
echo "📦 Testing Admin Build..."
if pnpm build:web-admin > /dev/null 2>&1; then
    echo "✅ Admin build: SUCCESS"
    if [ -d "apps/web-admin/out" ]; then
        echo "✅ Admin output directory: EXISTS"
        echo "   📁 Files: $(ls apps/web-admin/out | wc -l | xargs) files generated"
    else
        echo "❌ Admin output directory: MISSING"
    fi
else
    echo "❌ Admin build: FAILED"
fi

echo ""
echo "📦 Testing Provider Build..."
if pnpm build:web-provider > /dev/null 2>&1; then
    echo "✅ Provider build: SUCCESS"
    if [ -d "apps/web-provider/out" ]; then
        echo "✅ Provider output directory: EXISTS"
        echo "   📁 Files: $(ls apps/web-provider/out | wc -l | xargs) files generated"
    else
        echo "❌ Provider output directory: MISSING"
    fi
else
    echo "❌ Provider build: FAILED"
fi

echo ""
echo "✅ Verification complete!"
