# Cloudflare Pages Setup Guide

This guide explains how to properly configure Cloudflare Pages for the Palmera monorepo.

## Project Configuration

### Web Provider Dashboard
- **Framework preset**: `Next.js`
- **Build command**: `pnpm build:web-provider`
- **Build output directory**: `apps/web-provider/out`
- **Root directory**: `/` (empty - use repository root)
- **Node.js version**: `18` (uses .nvmrc file)

### Web Admin Dashboard  
- **Framework preset**: `Next.js`
- **Build command**: `pnpm build:web-admin`
- **Build output directory**: `apps/web-admin/out`
- **Root directory**: `/` (empty - use repository root)
- **Node.js version**: `18` (uses .nvmrc file)

## CRITICAL: Cloudflare Pages Settings

**REMOVE any custom install commands** - Use only:
- **Build command**: `pnpm build:web-provider` (or `pnpm build:web-admin`)
- **Install command**: Leave EMPTY (let Cloudflare use default `pnpm install`)

Alternative build commands (if the above fails):
- **Build command**: `./scripts/cloudflare-build-web-provider.sh` (or `./scripts/cloudflare-build-web-admin.sh`)

The build is failing because of the custom `--no-frozen-lockfile` install command.

## Environment Variables

Set these in your Cloudflare Pages project:

```
NODE_VERSION=18.20.4
NODE_OPTIONS=--max-old-space-size=4096
PNPM_VERSION=9.0.0
```

For production builds, also add:
```
NEXTAUTH_URL=https://your-domain.pages.dev
NEXTAUTH_SECRET=your-secret-here
```

## Build Process

The custom build commands handle the monorepo dependencies:

1. `pnpm build:web-provider` builds:
   - @palmera/tokens
   - @palmera/schemas  
   - @palmera/i18n
   - @palmera/ui
   - @palmera/sdk
   - @palmera/web-provider

2. `pnpm build:web-admin` builds:
   - @palmera/tokens
   - @palmera/schemas
   - @palmera/i18n
   - @palmera/ui
   - @palmera/sdk
   - @palmera/web-admin

## Troubleshooting

### Most Common Cloudflare Issues:

1. **"Build exceeded the time limit"**
   - Fix: Add `NODE_OPTIONS=--max-old-space-size=4096` environment variable
   - Alternative: Use the optimized build scripts: `./scripts/cloudflare-build-web-provider.sh`

2. **"pnpm command not found"**
   - Fix: Ensure `PNPM_VERSION=9.0.0` is set in environment variables
   - Fix: Verify `packageManager: "pnpm@9.0.0"` exists in root package.json

3. **"Module not found: @palmera/..."**
   - Fix: Ensure build command builds dependencies first (use `pnpm build:web-provider`)
   - Check: All packages have `"file:../../packages/..."` paths in package.json

### Legacy Issues:

1. **"can't cd to apps/web-provider"**
   - Fix: Use `pnpm build:web-provider` instead of `cd apps/web-provider && npm run build`

2. **"Invalid package manager specification"**
   - Fix: Ensure `packageManager: "pnpm@9.0.0"` in root package.json

3. **"Module not found" errors**
   - Fix: Use the custom build scripts that build dependencies first

4. **Node.js version issues**
   - Fix: Set Node.js version to 18 in Cloudflare Pages settings

## Manual Steps

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Navigate to Settings → Builds & deployments  
4. Update the build configuration with the values above
5. Trigger a new deployment

## Verification

After deployment, check that:
- Build uses pnpm (not npm)
- All packages build successfully
- Static files are generated in the correct output directory
- Deployment completes without errors
