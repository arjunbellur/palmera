# Folder Structure Guide

This document explains the organization of the Palmera codebase.

## 📁 Root Level

```
palmera/
├── apps/           # All applications
├── packages/       # Shared packages/libraries
├── shared/         # Shared utilities and types
├── config/         # Configuration files
├── docs/           # Documentation
├── tools/          # Build tools and utilities
├── e2e/           # End-to-end tests
└── node_modules/   # Dependencies
```

## 🏗️ Apps Directory (`apps/`)

Contains all applications in the monorepo:

### `apps/api/`
Backend API built with NestJS
- `src/` - Source code (controllers, services, modules)
- `prisma/` - Database schema and migrations
- `test/` - Test files
- `dist/` - Compiled output

### `apps/web-admin/`
Admin dashboard built with Next.js
- `src/` - Source code (pages, components, hooks)
- `out/` - Static export output
- `public/` - Static assets

### `apps/web-provider/`
Provider dashboard built with Next.js
- `src/` - Source code (pages, components, hooks)
- `out/` - Static export output
- `public/` - Static assets

### `apps/web-unified/`
Unified dashboard (admin + provider) built with Next.js
- `src/` - Source code with role-based routing
- `src/app/` - Next.js App Router structure
- `src/components/` - Shared and role-specific components

### `apps/mobile/`
Mobile app built with React Native/Expo
- `src/` - Source code (screens, components, navigation)
- `assets/` - Images and static assets
- `ios/` - iOS-specific files
- `android/` - Android-specific files

## 📦 Packages Directory (`packages/`)

Shared libraries used across applications:

### `packages/schemas/`
TypeScript schemas and validation
- Shared data models
- API request/response types
- Database models

### `packages/sdk/`
API client SDK
- HTTP client for API communication
- Type-safe API methods
- Authentication handling

### `packages/ui/`
Shared UI components
- Reusable React components
- Design system components
- Styling utilities

### `packages/i18n/`
Internationalization
- Translation files
- Language utilities
- Locale management

### `packages/tokens/`
Design tokens
- Color palettes
- Typography scales
- Spacing systems

## 🔧 Config Directory (`config/`)

Configuration files for different environments:

### `config/deployment/`
Production deployment configurations
- `render.yaml` - Render deployment config
- `vercel-web-admin.json` - Vercel admin app config
- `vercel-web-provider.json` - Vercel provider app config
- `env.production.template` - Production environment template

### `config/development/`
Development configuration files
- Local environment settings
- Development tool configurations

## 📚 Docs Directory (`docs/`)

Documentation organized by topic:

### `docs/architecture/`
System architecture and design decisions
- `FOLDER_STRUCTURE.md` - This file
- API design patterns
- Database schema documentation

### `docs/deployment/`
Deployment guides and procedures
- Platform-specific deployment instructions
- Environment setup guides
- CI/CD configuration

### `docs/development/`
Development guides and best practices
- Getting started guides
- Coding standards
- Contributing guidelines

## 🛠️ Tools Directory (`tools/`)

Build tools and utilities:

### `tools/scripts/`
Build and development scripts
- `dev.sh` - Start all development servers
- `build.sh` - Build all applications
- `render-build.sh` - Render-specific build script
- `verify-deployment.sh` - Deployment verification

### `tools/utilities/`
Helper scripts and tools
- Database utilities
- Code generation tools
- Maintenance scripts

## 🔄 Shared Directory (`shared/`)

Shared utilities and types:
- Common business logic
- Shared type definitions
- Utility functions
- Constants and enums

## 🧪 E2E Directory (`e2e/`)

End-to-end testing:
- `tests/` - Test files
- `playwright.config.ts` - Playwright configuration
- `package.json` - E2E test dependencies

## 📋 File Naming Conventions

### Applications
- Use kebab-case: `web-admin`, `web-provider`
- Keep names descriptive and consistent

### Packages
- Use kebab-case: `@palmera/schemas`
- Prefix with `@palmera/` for scoped packages

### Configuration Files
- Use descriptive names: `render.yaml`, `vercel-web-admin.json`
- Include environment or purpose in filename

### Documentation
- Use UPPERCASE for important docs: `README.md`, `FOLDER_STRUCTURE.md`
- Use kebab-case for other docs: `deployment-guide.md`

## 🎯 Benefits of This Structure

1. **Clear Separation**: Each type of file has its place
2. **Scalable**: Easy to add new apps or packages
3. **Maintainable**: Related files are grouped together
4. **Discoverable**: Intuitive folder names and structure
5. **Tool-Friendly**: Build tools can easily find what they need
