# Vercel Migration Guide for Palmera

## 🎯 **Why Migrate to Vercel?**

Based on analysis vs your current Cloudflare setup:

### **Current Pain Points with Cloudflare:**
- ❌ Complex build scripts required
- ❌ Manual environment variable management  
- ❌ Build timeout issues (Metro bundler problems)
- ❌ Non-interactive mode conflicts
- ❌ Custom dependency chain management

### **Vercel Benefits for Palmera:**
- ✅ Zero-config Next.js deployment
- ✅ Automatic monorepo detection
- ✅ Native Server Actions support
- ✅ Built-in preview deployments
- ✅ Simplified environment management

## 🚀 **Migration Plan**

### **Phase 1: Setup (30 minutes)**

#### **1. Create Vercel Account**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

#### **2. Configure Projects**
```bash
# From project root
vercel

# Configure for monorepo:
# - Set root directory to: apps/web-provider
# - Build command: pnpm build:web-provider  
# - Output directory: out
```

#### **3. Environment Variables**
Copy from Cloudflare to Vercel dashboard:
```env
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret
DATABASE_URL=your-database-url
# ... other variables
```

### **Phase 2: Project Configuration**

#### **Update vercel.json**
```json
{
  "projects": [
    {
      "name": "palmera-web-provider",
      "source": "apps/web-provider",
      "framework": "nextjs",
      "buildCommand": "cd ../.. && pnpm build:web-provider",
      "outputDirectory": "out"
    },
    {
      "name": "palmera-web-admin", 
      "source": "apps/web-admin",
      "framework": "nextjs",
      "buildCommand": "cd ../.. && pnpm build:web-admin",
      "outputDirectory": "out"
    }
  ]
}
```

#### **Update package.json scripts**
```json
{
  "scripts": {
    "build:web-provider": "pnpm --filter @palmera/tokens run build && pnpm --filter @palmera/schemas run build && pnpm --filter @palmera/i18n run build && pnpm --filter @palmera/ui run build && pnpm --filter @palmera/sdk run build && pnpm --filter @palmera/web-provider run build",
    "build:web-admin": "pnpm --filter @palmera/tokens run build && pnpm --filter @palmera/schemas run build && pnpm --filter @palmera/i18n run build && pnpm --filter @palmera/ui run build && pnpm --filter @palmera/sdk run build && pnpm --filter @palmera/web-admin run build",
    "vercel:build": "pnpm install && pnpm build"
  }
}
```

### **Phase 3: Server Actions Migration (Optional)**

#### **Current API Route Pattern:**
```typescript
// apps/web-admin/src/app/api/users/route.ts
export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

// Component usage
const response = await fetch('/api/users');
const users = await response.json();
```

#### **Recommended Server Actions Pattern:**
```typescript
// apps/web-admin/src/lib/actions/users.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function getUsers() {
  return await prisma.user.findMany();
}

// Component usage
import { getUsers } from '@/lib/actions/users';
const users = await getUsers();
```

## 📋 **Migration Checklist**

### **Pre-Migration**
- [ ] Backup current Cloudflare settings
- [ ] Document environment variables
- [ ] Test local builds work with pnpm
- [ ] Ensure all packages build successfully

### **Migration Day**
- [ ] Create Vercel account and team
- [ ] Import GitHub repository
- [ ] Configure build settings for both apps
- [ ] Set environment variables
- [ ] Test deployment
- [ ] Update DNS (when ready)

### **Post-Migration**
- [ ] Monitor performance metrics
- [ ] Set up team access
- [ ] Configure preview deployments
- [ ] Remove Cloudflare build scripts
- [ ] Update documentation

## 🔧 **Troubleshooting**

### **Common Issues & Solutions**

#### **Build Errors**
```bash
# If monorepo dependencies fail
# Ensure root package.json has correct build order
pnpm build:web-provider --verbose
```

#### **Environment Variables**
```bash
# Test locally first
vercel env pull .env.local
pnpm dev
```

#### **Domain Setup**
```bash
# Add custom domain
vercel domains add yourdomain.com
# Configure DNS
vercel dns
```

## 📊 **Performance Comparison**

### **Expected Improvements**
- ⚡ **Build Time**: 5-10 minutes → 2-3 minutes
- ⚡ **Deployment**: Manual → Automatic on push
- ⚡ **Developer Experience**: Complex → Simple
- ⚡ **Error Handling**: Manual debugging → Built-in logs

### **Monitoring**
Vercel provides built-in:
- Core Web Vitals tracking
- Function execution logs
- Real User Monitoring
- Performance insights

## 🌍 **Geographic Considerations**

### **For African Users**
While Cloudflare has better global coverage:
- Vercel's edge network still covers major African cities
- Performance difference likely minimal for your use case
- Developer productivity gains outweigh minor latency differences

### **Future Optimization**
If African performance becomes critical:
- Use Vercel's Edge Config for static data
- Implement CDN for static assets
- Consider hybrid approach (Vercel + Cloudflare CDN)

## 💰 **Cost Analysis**

### **Free Tier Comparison**
| Resource | Vercel Free | Cloudflare Free | Palmera Usage |
|----------|-------------|-----------------|---------------|
| Bandwidth | 100GB/month | Unlimited | Low-Medium |
| Function Executions | 100GB-hrs | 100K/day | Medium |
| Build Minutes | 6000/month | Unlimited | Low |
| Team Members | 1 | Unlimited | Small team |

**Recommendation**: Start with Vercel free tier, upgrade if needed.

## 🔄 **Rollback Plan**

If Vercel doesn't work out:
1. Keep Cloudflare configuration files
2. Maintain both setups temporarily
3. DNS switch for quick rollback
4. Document lessons learned

## 🎯 **Success Metrics**

Track these improvements:
- [ ] Build time reduction (target: 50% faster)
- [ ] Deployment frequency increase
- [ ] Developer satisfaction improvement
- [ ] Reduced deployment-related issues
- [ ] Faster time-to-market for features

---

## 🚀 **Next Steps**

1. **This Week**: Set up Vercel account and test deployment
2. **Next Week**: Migrate web-provider app
3. **Following Week**: Migrate web-admin app
4. **Month 1**: Monitor performance and optimize

The migration should significantly improve your development workflow while maintaining excellent performance for users!
