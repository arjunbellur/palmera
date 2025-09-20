# Palmera Unified App Migration Guide

This document outlines the migration from separate web-admin and web-provider apps to a unified Next.js application with role-based access control.

## Overview

The unified app (`apps/web-unified`) consolidates both admin and provider functionality into a single Next.js application, providing:

- **Simplified Deployment**: Single app to deploy instead of two
- **Shared Components**: Common UI components and utilities
- **Role-based Routing**: Automatic redirection based on user roles
- **Unified Authentication**: Single login flow for all user types
- **Consistent UX**: Shared design system and user experience

## Architecture Changes

### Before (Separate Apps)
```
apps/
├── web-admin/          # Port 3004
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── package.json
└── web-provider/       # Port 3001
    ├── src/
    │   ├── app/
    │   └── components/
    └── package.json
```

### After (Unified App)
```
apps/
└── web-unified/        # Port 3000
    ├── src/
    │   ├── app/
    │   │   ├── admin/          # Admin routes
    │   │   ├── provider/       # Provider routes
    │   │   └── auth/           # Authentication routes
    │   ├── components/
    │   │   ├── admin/          # Admin components
    │   │   ├── provider/       # Provider components
    │   │   └── shared/         # Shared components
    │   ├── lib/auth/           # Authentication logic
    │   └── middleware.ts       # Route protection
    └── package.json
```

## Key Features

### Role-based Authentication
- **ADMIN**: Full platform management access
- **PROVIDER**: Listing and booking management
- **CONCIERGE**: Limited admin access for customer support

### Route Protection
- Middleware automatically redirects users based on their role
- Unauthenticated users are redirected to login
- Role-based access control for all protected routes

### Unified Navigation
- Admin users see admin navigation menu
- Provider users see provider navigation menu
- Automatic layout switching based on user role

## Migration Steps

### 1. Update Environment Variables
```bash
# Update your .env files
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_APP_NAME=Palmera Unified Dashboard
```

### 2. Update Deployment Configurations
- Use `deployment/vercel-web-unified.json` for Vercel
- Update Cloudflare Pages to deploy from `apps/web-unified/out/`
- Update any CI/CD pipelines to build the unified app

### 3. Update Development Scripts
```bash
# New development commands
pnpm run dev:web-unified        # Start unified app
pnpm run build:web-unified      # Build unified app
```

### 4. Update DNS/Domain Configuration
- Point your main domain to the unified app
- Remove separate admin/provider subdomains if using them
- Update any redirects to point to role-appropriate routes

## Route Mapping

### Admin Routes
| Old Route | New Route | Notes |
|-----------|-----------|-------|
| `/` (admin) | `/admin/dashboard` | Admin dashboard |
| `/users` | `/admin/users` | User management |
| `/bookings` | `/admin/bookings` | Booking management |
| `/payments` | `/admin/payments` | Payment oversight |
| `/providers` | `/admin/providers` | Provider management |
| `/analytics` | `/admin/analytics` | Platform analytics |
| `/settings` | `/admin/settings` | System settings |

### Provider Routes
| Old Route | New Route | Notes |
|-----------|-----------|-------|
| `/` (provider) | `/provider/dashboard` | Provider dashboard |
| `/listings` | `/provider/listings` | Listing management |
| `/bookings` | `/provider/bookings` | Provider bookings |
| `/earnings` | `/provider/earnings` | Earnings tracking |
| `/profile` | `/provider/profile` | Profile management |
| `/onboarding` | `/provider/onboarding` | Onboarding flow |

### Authentication Routes
| Old Route | New Route | Notes |
|-----------|-----------|-------|
| `/auth/login` (both) | `/auth/login` | Unified login |
| `/auth/register` (both) | `/auth/register` | Unified registration |

## Component Migration

### Shared Components
Components that were duplicated between apps are now shared:
- `Layout.tsx` - Unified layout with role-based rendering
- `AdminLayout.tsx` - Admin-specific layout
- `ProviderLayout.tsx` - Provider-specific layout

### Role-specific Components
- Admin components moved to `components/admin/`
- Provider components moved to `components/provider/`
- Shared utilities moved to `lib/`

## Testing

### Manual Testing Checklist
- [ ] Login with admin credentials → redirects to `/admin/dashboard`
- [ ] Login with provider credentials → redirects to `/provider/dashboard`
- [ ] Unauthenticated access → redirects to `/auth/login`
- [ ] Role-based route protection works correctly
- [ ] Navigation menus show appropriate items for each role
- [ ] Logout functionality works correctly

### Automated Testing
```bash
# Run the unified app test page
http://localhost:3000/test
```

## Deployment

### Vercel
```bash
pnpm run build:web-unified
# Deploy using vercel-web-unified.json config
```

### Cloudflare Pages
```bash
pnpm run build:web-unified
# Deploy the apps/web-unified/out/ directory
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:web-unified
EXPOSE 3000
CMD ["npm", "start"]
```

## Rollback Plan

If issues arise, you can quickly rollback by:
1. Reverting DNS to point to old apps
2. Restarting the old web-admin and web-provider apps
3. Using the existing deployment configurations

## Benefits

### Development
- **Single codebase** to maintain
- **Shared components** reduce duplication
- **Unified authentication** flow
- **Consistent UX** across all user types

### Operations
- **Single deployment** instead of two
- **Reduced infrastructure** costs
- **Simplified monitoring** and logging
- **Easier maintenance** and updates

### User Experience
- **Single login** for all user types
- **Seamless role switching** (if user has multiple roles)
- **Consistent design** and navigation
- **Better mobile experience**

## Next Steps

1. **Test thoroughly** in staging environment
2. **Update documentation** and user guides
3. **Train support team** on new unified interface
4. **Monitor performance** and user adoption
5. **Plan deprecation** of old separate apps

## Support

For issues or questions about the unified app:
- Check the test page at `/test` for debugging
- Review the README in `apps/web-unified/README.md`
- Check the authentication flow in `src/lib/auth/`
- Verify route protection in `src/middleware.ts`
