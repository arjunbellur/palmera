# Vercel Migration Summary for Unified App

## Current Setup
- **API**: Render (unchanged)
- **Web Apps**: 2 separate Vercel projects
  - `palmera-web-admin` (admin dashboard)
  - `palmera-web-provider` (provider dashboard)

## New Setup
- **API**: Render (unchanged)
- **Web App**: 1 unified Vercel project
  - `palmera-web-unified` (handles both admin and provider with role-based routing)

## Quick Migration Steps

### 1. Create New Vercel Project
```bash
# Option A: CLI
cd apps/web-unified
vercel --prod

# Option B: Dashboard
# Go to vercel.com → New Project → Import repo
# Set Root Directory: apps/web-unified
# Framework: Next.js
```

### 2. Configure Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
NEXT_PUBLIC_APP_NAME=Palmera Unified Dashboard
NODE_ENV=production
```

### 3. Test the Deployment
- Visit the deployed URL
- Test `/test` page for authentication
- Test role-based routing with different user types

### 4. Update DNS/Domains
- Point your main domain to the unified app
- Set up redirects if needed:
  - `admin.yourdomain.com` → `yourdomain.com/admin/dashboard`
  - `provider.yourdomain.com` → `yourdomain.com/provider/dashboard`

### 5. Decommission Old Projects
- Delete `palmera-web-admin` Vercel project
- Delete `palmera-web-provider` Vercel project
- Update any documentation or links

## Benefits of Migration

### Cost Savings
- **Before**: 2 Vercel projects (2x hosting costs)
- **After**: 1 Vercel project (50% cost reduction)

### Simplified Management
- Single deployment instead of two
- Unified authentication flow
- Consistent user experience
- Easier maintenance and updates

### Better User Experience
- Single login for all user types
- Seamless role-based navigation
- Consistent design and functionality

## Rollback Plan
If issues arise:
1. Keep old Vercel projects running during initial deployment
2. Switch DNS back to old projects if needed
3. Debug issues in the new unified app
4. Use Vercel's rollback feature if needed

## Files Updated
- ✅ `render.yaml` - Reverted (API only)
- ✅ `deployment/vercel-web-unified.json` - New unified config
- ✅ `scripts/build.sh` - Updated to build unified app
- ✅ `scripts/verify-deployment.sh` - Updated for unified app
- ✅ `VERCEL_UNIFIED_DEPLOYMENT.md` - Complete deployment guide

## Next Steps
1. Deploy unified app to Vercel
2. Test thoroughly with different user roles
3. Update DNS to point to unified app
4. Decommission old separate projects
5. Update documentation and user guides
