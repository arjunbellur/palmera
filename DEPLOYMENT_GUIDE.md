# 🚀 Palmera Dashboard Deployment Guide

## Cloudflare Pages Setup

### 1. Provider Dashboard Deployment

**Repository**: `arjunbellur/palmera`
**Build Command**: `cd apps/web-provider && npm run build`
**Build Output Directory**: `apps/web-provider/out`
**Root Directory**: `apps/web-provider`

**Environment Variables**:
```
NEXTAUTH_URL=https://palmera-provider.pages.dev
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_NAME=Palmera Provider
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2. Admin Dashboard Deployment

**Repository**: `arjunbellur/palmera`
**Build Command**: `cd apps/web-admin && npm run build`
**Build Output Directory**: `apps/web-admin/out`
**Root Directory**: `apps/web-admin`

**Environment Variables**:
```
NEXTAUTH_URL=https://palmera-admin.pages.dev
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_NAME=Palmera Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Setup Steps

### Step 1: Create Cloudflare Account
1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Sign up/Login with your GitHub account
3. Connect your GitHub repository

### Step 2: Deploy Provider Dashboard
1. Click "Create a project"
2. Connect to GitHub repository: `arjunbellur/palmera`
3. Configure build settings:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `cd apps/web-provider && npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `apps/web-provider`
4. Add environment variables (see above)
5. Deploy!

### Step 3: Deploy Admin Dashboard
1. Repeat Step 2 with these settings:
   - **Build command**: `cd apps/web-admin && npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `apps/web-admin`
2. Add environment variables (see above)
3. Deploy!

## Expected URLs
- **Provider Dashboard**: `https://palmera-provider.pages.dev`
- **Admin Dashboard**: `https://palmera-admin.pages.dev`

## Benefits
✅ **Automatic Deployments**: Every push to main triggers deployment
✅ **Preview Deployments**: Every PR gets its own preview URL
✅ **Global CDN**: Fast loading worldwide
✅ **Free Hosting**: No cost for development
✅ **Custom Domains**: Easy to add your own domains later

## Alternative: Vercel Setup

If you prefer Vercel:

### Provider Dashboard
1. Go to [Vercel](https://vercel.com/)
2. Import project from GitHub
3. Configure:
   - **Root Directory**: `apps/web-provider`
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`

### Admin Dashboard
1. Repeat with:
   - **Root Directory**: `apps/web-admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`

## Environment Variables for Production

Make sure to set these in your deployment platform:

### Required
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXT_PUBLIC_API_URL`: Your API endpoint URL

### Optional
- `NEXT_PUBLIC_APP_NAME`: App display name
- `NEXT_PUBLIC_APP_VERSION`: Version number
