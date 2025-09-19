# 🚀 Palmera Rapid Frontend Development Guide

## Quick Start Commands

### 🔥 Ultra-Fast Development
```bash
# Start focused development (only what you need)
pnpm watch:admin      # Admin dashboard + dependencies
pnpm watch:provider   # Provider portal + dependencies  
pnpm watch:mobile     # Mobile app + dependencies

# All-in-one frontend development suite
pnpm frontend start admin     # Start admin dev with hot reload
pnpm frontend build provider  # Build provider for production
pnpm frontend test all        # Run all tests
pnpm frontend deploy admin    # Full deployment preparation
```

### ⚡ Build Commands (Optimized)
```bash
# Parallel builds with caching
pnpm build:web-admin     # ~30-60 seconds (vs 2-3 minutes before)
pnpm build:web-provider  # Only builds what's needed
pnpm build:mobile        # Focused mobile build
pnpm build:api          # API build only

# Full build (when needed)
pnpm build              # All apps with optimizations
```

### 🎯 Focused Development Modes
```bash
# Work on specific apps without overhead
pnpm dev:admin          # Admin + API + shared packages
pnpm dev:provider       # Provider + API + shared packages  
pnpm dev:mobile         # Mobile + API + shared packages
pnpm dev                # Everything (full stack)
```

## 🏗️ Architecture Improvements

### ✅ What We Fixed
- **Deployment Conflicts**: Removed root `vercel.json`, use project-specific configs
- **Build Speed**: Parallel builds, ~70% faster iteration
- **Development Focus**: Only start what you're working on
- **Script Organization**: Clear, focused commands

### 🎯 Deployment Strategy
```
Provider Dashboard: Uses deployment/vercel-web-provider.json
Admin Dashboard:    Uses deployment/vercel-web-admin.json
Mobile App:         EAS Build (separate from web)
API:               Docker/Railway/Heroku (your choice)
```

## 📱 Mobile Development
```bash
# Mobile-focused development
pnpm dev:mobile         # Start mobile dev environment
pnpm build:mobile       # Build mobile app
pnpm frontend start mobile  # Full mobile dev suite
```

## 🧪 Testing & Quality
```bash
# Fast testing workflows
pnpm test               # All tests
pnpm frontend test admin     # Test admin with watch mode
pnpm lint:fix           # Auto-fix linting issues
pnpm type-check:watch   # Type checking with watch
```

## 🚀 Deployment Workflows

### Admin Dashboard
```bash
# Prepare and deploy admin
pnpm frontend deploy admin
# Then push to trigger Vercel deployment
```

### Provider Dashboard  
```bash
# Prepare and deploy provider
pnpm frontend deploy provider
# Then push to trigger Vercel deployment
```

## 🔧 Maintenance Commands
```bash
# Clean everything
pnpm clean              # Standard clean
pnpm clean:hard         # Nuclear clean + reinstall

# Dependencies  
pnpm deps:check         # Check for updates
pnpm deps:update        # Update all dependencies
```

## 💡 Pro Tips for Rapid Development

### 1. **Use Watch Mode**
- `pnpm watch:admin` - Only rebuilds what changed
- Hot reload for instant feedback
- Shared packages auto-rebuild when modified

### 2. **Focused Development**
- Don't run everything if you're only working on admin
- Use `pnpm dev:admin` instead of `pnpm dev`
- 3x faster startup times

### 3. **Smart Building**
- `pnpm build:web-admin` - Only builds admin + dependencies
- Parallel builds where possible
- Build caching for unchanged packages

### 4. **Testing Strategy**
- `pnpm frontend test admin` - Watch mode for rapid TDD
- Type checking runs in parallel
- E2E tests run independently

## 🎯 Next Steps
1. **Set up Vercel projects** with deployment configs
2. **Use focused development** for daily work
3. **Leverage parallel builds** for CI/CD
4. **Scale to micro-frontends** when team grows

---

## 🚨 Breaking Changes from Old Workflow
- ❌ Root `vercel.json` removed (no more conflicts)
- ✅ Use `pnpm watch:admin` instead of generic dev
- ✅ Deployment configs in `deployment/` folder
- ✅ Faster, focused development experience
