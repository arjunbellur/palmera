# Render Deployment Guide for Unified Palmera App

This guide covers deploying the unified Palmera application to Render, replacing the previous separate web-admin and web-provider deployments.

## Overview

The unified deployment includes:
- **palmera-api**: Backend API service (existing)
- **palmera-web-unified**: New unified frontend app (replaces web-admin and web-provider)

## Prerequisites

- Render account with Blueprint access
- Database already set up (palmera-db)
- API service already deployed

## Deployment Steps

### 1. Update Render Blueprint

The `render.yaml` file has been updated to include the unified web app:

```yaml
services:
  - type: web
    name: palmera-api
    # ... existing API configuration

  - type: web
    name: palmera-web-unified
    env: node
    region: oregon
    plan: starter
    buildCommand: ./scripts/render-build-web-unified.sh
    startCommand: cd apps/web-unified && pnpm start
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: NEXT_PUBLIC_API_URL
        fromService:
          type: web
          name: palmera-api
          property: host
      - key: NEXT_PUBLIC_APP_NAME
        value: Palmera Unified Dashboard
```

### 2. Deploy to Render

#### Option A: Blueprint Deployment (Recommended)
1. Push the updated `render.yaml` to your repository
2. Go to Render Dashboard
3. Create new Blueprint from repository
4. Select your repository and branch
5. Render will automatically detect and deploy both services

#### Option B: Manual Service Creation
1. Go to Render Dashboard
2. Create new Web Service
3. Connect your repository
4. Configure the service:
   - **Name**: `palmera-web-unified`
   - **Environment**: `Node`
   - **Region**: `Oregon`
   - **Plan**: `Starter`
   - **Build Command**: `./scripts/render-build-web-unified.sh`
   - **Start Command**: `cd apps/web-unified && pnpm start`
   - **Health Check Path**: `/`

### 3. Environment Variables

The unified web app requires these environment variables:

#### Required Variables
- `NODE_ENV`: `production`
- `PORT`: `3000` (auto-set by Render)
- `NEXT_PUBLIC_API_URL`: Automatically set to API service URL
- `NEXT_PUBLIC_APP_NAME`: `Palmera Unified Dashboard`

#### Optional Variables (if needed)
- `NEXT_PUBLIC_ANALYTICS_ID`: Analytics tracking ID
- `NEXT_PUBLIC_SENTRY_DSN`: Error tracking
- `NEXT_PUBLIC_POSTHOG_KEY`: Product analytics

### 4. Build Process

The build script (`render-build-web-unified.sh`) handles:
1. Clean installation of dependencies
2. Building shared packages
3. Building the unified Next.js app
4. Free tier optimizations

### 5. Health Checks

- **Health Check Path**: `/`
- The app will respond with the login page or redirect to appropriate dashboard
- Render monitors this endpoint for service health

## Migration from Separate Apps

### If you had separate web-admin and web-provider services:

1. **Deploy the new unified service first**
2. **Test thoroughly** using the provided test endpoints
3. **Update DNS/domain** to point to the new unified service
4. **Decommission old services** once confirmed working

### Domain Configuration

If you were using separate subdomains:
- `admin.yourdomain.com` → `yourdomain.com/admin/dashboard`
- `provider.yourdomain.com` → `yourdomain.com/provider/dashboard`

## Testing the Deployment

### 1. Health Check
Visit the root URL to ensure the service is running:
```
https://palmera-web-unified.onrender.com/
```

### 2. Authentication Test
Visit the test page to verify authentication:
```
https://palmera-web-unified.onrender.com/test
```

### 3. Role-based Access
Test different user roles:
- Admin users should access `/admin/dashboard`
- Provider users should access `/provider/dashboard`
- Unauthenticated users should redirect to `/auth/login`

## Monitoring and Logs

### Render Dashboard
- Monitor service health in Render Dashboard
- Check build logs for any deployment issues
- Monitor resource usage (CPU, Memory, Bandwidth)

### Application Logs
- Access logs via Render Dashboard
- Logs include authentication attempts, route access, and errors
- Use for debugging role-based access issues

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs for specific errors
# Common fixes:
# 1. Ensure all dependencies are properly installed
# 2. Check for TypeScript compilation errors
# 3. Verify package.json scripts
```

#### Authentication Issues
```bash
# Verify API service is running and accessible
# Check NEXT_PUBLIC_API_URL is correctly set
# Ensure JWT_SECRET is properly configured in API
```

#### Route Access Issues
```bash
# Check middleware.ts configuration
# Verify user roles in database
# Test with different user accounts
```

### Performance Optimization

For better performance on Render's free tier:
1. **Enable static exports** (already configured in next.config.js)
2. **Optimize images** using Next.js Image component
3. **Use CDN** for static assets
4. **Implement caching** for API responses

## Security Considerations

1. **HTTPS**: Automatically enabled by Render
2. **Environment Variables**: Securely managed by Render
3. **API Communication**: Internal service-to-service communication
4. **Authentication**: JWT-based with secure cookie handling

## Cost Implications

### Render Free Tier Limits
- **Bandwidth**: 100GB/month
- **Build Time**: 90 minutes/month
- **Sleep**: Services sleep after 15 minutes of inactivity

### Optimization Tips
1. Use static exports to reduce server load
2. Implement efficient caching strategies
3. Optimize bundle sizes
4. Use CDN for static assets

## Rollback Plan

If issues arise:
1. **Keep old services running** during initial deployment
2. **Use Render's rollback feature** to previous deployment
3. **Switch DNS back** to old services if needed
4. **Debug issues** in staging environment

## Next Steps

After successful deployment:
1. **Update documentation** with new URLs
2. **Notify users** of the unified interface
3. **Monitor performance** and user adoption
4. **Plan deprecation** of old separate services
5. **Optimize** based on usage patterns

## Support

For deployment issues:
- Check Render build logs
- Verify environment variables
- Test locally with production-like setup
- Review the unified app README for troubleshooting
