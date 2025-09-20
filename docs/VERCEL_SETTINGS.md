# 🔧 Vercel Project Settings - Copy & Paste Guide

## 🏪 Provider Dashboard (palmera)
**URL:** https://vercel.com/arjunbellurs-projects/palmera

### Build & Development Settings:
```
Build Command: pnpm build:web-provider
Output Directory: apps/web-provider/out
Install Command: pnpm install
Root Directory: (leave empty)
Framework Preset: Other
```

### Environment Variables:
```
NEXTAUTH_URL=https://palmera-[your-vercel-id].vercel.app
NEXTAUTH_SECRET=GKmqefXW6dApheflsoio1ei9vQNFKxMm1i3s2lvnMGY=
NEXT_PUBLIC_API_URL=https://your-api-backend-url
```

---

## 🏢 Admin Dashboard (palmera-web-admin)  
**URL:** https://vercel.com/arjunbellurs-projects/palmera-web-admin

### Build & Development Settings:
```
Build Command: pnpm build:web-admin
Output Directory: apps/web-admin/out
Install Command: pnpm install
Root Directory: (leave empty)
Framework Preset: Other
```

### Environment Variables:
```
NEXTAUTH_URL=https://palmera-web-admin-[your-vercel-id].vercel.app
NEXTAUTH_SECRET=GKmqefXW6dApheflsoio1ei9vQNFKxMm1i3s2lvnMGY=
NEXT_PUBLIC_API_URL=https://your-api-backend-url
```

---

## ✅ After Updating Settings:

1. **Save the settings** in Vercel dashboard
2. **Trigger a new deployment** (push a commit or manual redeploy)
3. **Check build logs** - should see "Building Web Provider..." or "Building Web Admin..."
4. **Verify output** - should find files in correct output directory

## 🚨 Common Mistakes to Avoid:

❌ **Don't use:** `pnpm run build` (builds everything)  
✅ **Use:** `pnpm build:web-provider` or `pnpm build:web-admin`

❌ **Don't set output to:** `public` or `out`  
✅ **Set output to:** `apps/web-provider/out` or `apps/web-admin/out`

❌ **Don't set framework to:** Next.js  
✅ **Set framework to:** Other
