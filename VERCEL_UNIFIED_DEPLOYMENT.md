# Vercel Deployment Guide for Unified Palmera App

This guide covers deploying the unified Palmera application to Vercel, replacing the separate web-admin and web-provider deployments.

## Current Setup

- **API**: Deployed on Render (unchanged)
- **Web Apps**: Currently deployed as separate Vercel projects
  - `palmera-web-admin` (admin dashboard)
  - `palmera-web-provider` (provider dashboard)

## New Unified Setup

- **API**: Deployed on Render (unchanged)
- **Web App**: Single unified Vercel project
  - `palmera-web-unified` (handles both admin and provider with role-based routing)

## Migration Steps

### 1. Create New Vercel Project

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy the unified app
cd apps/web-unified
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository
4. Configure the project:
   - **Project Name**: `palmera-web-unified`
   - **Root Directory**: `apps/web-unified`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `pnpm install`

### 2. Environment Variables

Set these environment variables in your Vercel project:

#### Required Variables
```
NEXT_PUBLIC_API_URL=https://your-api-url.onrender.com
NEXT_PUBLIC_APP_NAME=Palmera Unified Dashboard
NODE_ENV=production
```

#### Optional Variables
```
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
```

### 3. Update Build Configuration

The unified app uses the existing Vercel configuration in `deployment/vercel-web-unified.json`:

```json
{
  "version": 2,
  "name": "palmera-web-unified",
  "builds": [
    {
      "src": "apps/web-unified/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "apps/web-unified/$1"
    },
    {
      "src": "/provider/(.*)",
      "dest": "apps/web-unified/$1"
    },
    {
      "src": "/auth/(.*)",
      "dest": "apps/web-unified/$1"
    },
    {
      "src": "/(.*)",
      "dest": "apps/web-unified/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@palmera-api-url",
    "NEXT_PUBLIC_APP_NAME": "Palmera Unified Dashboard"
  }
}
```

### 4. Domain Configuration

#### Option A: Use Vercel's Default Domain
- The app will be available at `palmera-web-unified.vercel.app`
- Update your API's CORS settings to include this domain

#### Option B: Custom Domain
1. Add your custom domain in Vercel Dashboard
2. Update DNS records as instructed
3. Update API CORS settings to include your custom domain

### 5. API Integration

Update your Render API to allow the new Vercel domain:

```javascript
// In your API CORS configuration
const allowedOrigins = [
  'https://palmera-web-unified.vercel.app',
  'https://your-custom-domain.com',
  // Remove old domains:
  // 'https://palmera-web-admin.vercel.app',
  // 'https://palmera-web-provider.vercel.app'
];
```

## Testing the Deployment

### 1. Health Check
Visit the deployed URL to ensure the app loads:
```
https://palmera-web-unified.vercel.app/
```

### 2. Authentication Test
Test the authentication flow:
```
https://palmera-web-unified.vercel.app/test
```

### 3. Role-based Routing
Test different user roles:
- **Admin users**: Should access `/admin/dashboard`
- **Provider users**: Should access `/provider/dashboard`
- **Unauthenticated users**: Should redirect to `/auth/login`

## Migration Strategy

### Phase 1: Deploy and Test
1. Deploy the unified app to a new Vercel project
2. Test thoroughly with different user roles
3. Verify all functionality works correctly

### Phase 2: Update DNS/Domains
1. Update your main domain to point to the unified app
2. Set up redirects from old domains if needed:
   ```
   admin.yourdomain.com → yourdomain.com/admin/dashboard
   provider.yourdomain.com → yourdomain.com/provider/dashboard
   ```

### Phase 3: Decommission Old Apps
1. Once confirmed working, delete the old Vercel projects:
   - `palmera-web-admin`
   - `palmera-web-provider`
2. Update any documentation or links

## Rollback Plan

If issues arise:
1. **Keep old Vercel projects running** during initial deployment
2. **Switch DNS back** to old projects if needed
3. **Debug issues** in the new unified app
4. **Use Vercel's rollback feature** if needed

## Build Optimization

### Vercel Build Settings
- **Node.js Version**: 20.x (recommended)
- **Build Command**: `pnpm build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `pnpm install`

### Performance Optimizations
1. **Static Generation**: App uses `output: 'export'` for static hosting
2. **Image Optimization**: Use Next.js Image component
3. **Bundle Analysis**: Monitor bundle sizes in Vercel dashboard
4. **Edge Functions**: Consider using for API routes if needed

## Monitoring

### Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Monitor Core Web Vitals
- Track user interactions and page views

### Error Tracking
- Set up Sentry for error tracking
- Monitor authentication failures
- Track role-based access issues

## Cost Considerations

### Vercel Pricing
- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for commercial use
- **Bandwidth**: Included in plans

### Optimization Tips
1. Use static exports to reduce serverless function usage
2. Implement efficient caching strategies
3. Optimize images and assets
4. Use Vercel's CDN for global distribution

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel Dashboard
# Common fixes:
# 1. Ensure all dependencies are in package.json
# 2. Check for TypeScript compilation errors
# 3. Verify environment variables are set
```

#### Authentication Issues
```bash
# Verify NEXT_PUBLIC_API_URL is correctly set
# Check API CORS settings include Vercel domain
# Ensure JWT_SECRET is properly configured in API
```

#### Route Access Issues
```bash
# Check middleware.ts configuration
# Verify user roles in database
# Test with different user accounts
```

### Debugging Steps
1. Check Vercel build logs for errors
2. Verify environment variables are set correctly
3. Test API connectivity from the deployed app
4. Check browser console for client-side errors
5. Use the test page (`/test`) for debugging

## Next Steps

After successful deployment:
1. **Update documentation** with new URLs
2. **Notify users** of the unified interface
3. **Monitor performance** and user adoption
4. **Optimize** based on usage patterns
5. **Plan deprecation** of old separate apps

## Support

For deployment issues:
- Check Vercel build logs
- Verify environment variables
- Test locally with production-like setup
- Review the unified app README for troubleshooting
- Use Vercel's support for platform-specific issues
