#!/bin/bash
set -e

echo "🔍 PALMERA UNIFIED APP DEPLOYMENT VERIFICATION"
echo "=============================================="

# Test unified build
echo ""
echo "📦 Testing Unified Web App Build..."
if pnpm build:web-unified > /dev/null 2>&1; then
    echo "✅ Unified web app build: SUCCESS"
    if [ -d "apps/web-unified/out" ]; then
        echo "✅ Unified web app output directory: EXISTS"
        echo "   📁 Files: $(ls apps/web-unified/out | wc -l | xargs) files generated"
    else
        echo "❌ Unified web app output directory: MISSING"
    fi
else
    echo "❌ Unified web app build: FAILED"
fi

echo ""
echo "🔧 VERCEL PROJECT CONFIGURATION NEEDED:"
echo "======================================="
echo ""
echo "🌐 UNIFIED WEB APP PROJECT (palmera-web-unified):"
echo "   Root Directory: apps/web-unified"
echo "   Build Command: pnpm build"
echo "   Output Directory: .next"
echo "   Install Command: pnpm install"
echo "   Framework: Next.js"
echo ""
echo "🔑 ENVIRONMENT VARIABLES NEEDED:"
echo "   NEXT_PUBLIC_API_URL=https://your-api-url.onrender.com"
echo "   NEXT_PUBLIC_APP_NAME=Palmera Unified Dashboard"
echo "   NODE_ENV=production"
echo ""
echo "📋 DEPLOYMENT STEPS:"
echo "   1. Create new Vercel project: palmera-web-unified"
echo "   2. Set root directory to: apps/web-unified"
echo "   3. Configure environment variables above"
echo "   4. Deploy and test role-based routing"
echo "   5. Update DNS to point to new unified app"
echo "   6. Decommission old separate web-admin and web-provider projects"
echo ""
echo "✅ Verification complete!"
