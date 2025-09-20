# 🚀 Palmera API Deployment on Render

## 📋 **Quick Setup Checklist**

### **Step 1: Prepare Repository**
- ✅ `render.yaml` configuration created
- ✅ Build script `scripts/render-build.sh` ready
- ✅ Environment variables template ready

### **Step 2: Create Render Account & Service**

1. **Sign up at [render.com](https://render.com)**
2. **Connect your GitHub repository**
3. **Create new Blueprint** (use `render.yaml`)

### **Step 3: Database Setup**

Render will automatically create:
- ✅ **PostgreSQL 15 database** (`palmera-db`)
- ✅ **Connection string** (auto-injected as `DATABASE_URL`)
- ✅ **Database user** (`palmera_user`)

### **Step 4: Environment Variables**

Set these in Render Dashboard:

#### **🔑 Required Variables**
```bash
# Authentication
JWT_SECRET=your-super-secure-jwt-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here

# Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS (your frontend URLs)
CORS_ORIGINS=https://your-admin.vercel.app,https://your-provider.vercel.app
```

#### **📧 Optional Variables**
```bash
# Email service
EMAIL_SERVICE_API_KEY=your-email-api-key
EMAIL_FROM=noreply@yourdomain.com

# File uploads (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=palmera-uploads

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

## 🎯 **Deployment Process**

### **Automatic Deployment**
1. **Push to main branch** → Render auto-deploys
2. **Build process** (~3-5 minutes):
   - Install dependencies
   - Build shared packages
   - Generate Prisma client
   - Run migrations
   - Build NestJS API
3. **Health check** on `/health` endpoint
4. **Service goes live** 🎉

### **Manual Deployment**
```bash
# Trigger manual deploy in Render dashboard
# Or push an empty commit
git commit --allow-empty -m "trigger deployment"
git push
```

## 🔧 **Configuration Details**

### **Service Configuration**
```yaml
# From render.yaml
- type: web
  name: palmera-api
  env: node
  region: oregon          # Low latency
  plan: starter          # $7/month
  buildCommand: ./scripts/render-build.sh
  startCommand: cd apps/api && pnpm start:prod
  healthCheckPath: /health
```

### **Database Configuration**
```yaml
# PostgreSQL database
- name: palmera-db
  databaseName: palmera
  user: palmera_user
  region: oregon
  plan: starter          # $7/month
  postgresMajorVersion: 15
```

## 📊 **Monitoring & Health**

### **Health Check**
- **Endpoint**: `https://your-api.onrender.com/health`
- **Interval**: Every 30 seconds
- **Timeout**: 10 seconds

### **Logs & Monitoring**
```bash
# View logs in Render dashboard
# Or use Render CLI
render logs --service palmera-api --tail
```

### **Performance**
- **Startup time**: ~30-60 seconds
- **Cold start**: ~10 seconds (after inactivity)
- **Memory**: 512MB (starter plan)
- **CPU**: Shared

## 🚀 **Scaling Options**

### **Starter Plan** ($7/month)
- ✅ Perfect for development/small production
- 512MB RAM, shared CPU
- Sleeps after 15 minutes inactivity

### **Standard Plan** ($25/month)  
- ✅ Production ready
- 2GB RAM, dedicated CPU
- No sleeping, always available

### **Pro Plan** ($85/month)
- ✅ High traffic applications
- 8GB RAM, 4 dedicated CPUs
- Advanced monitoring

## 🔗 **Integration with Frontend**

### **Update Frontend Environment Variables**

#### **Admin Dashboard** (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://palmera-api-xyz.onrender.com
```

#### **Provider Dashboard** (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://palmera-api-xyz.onrender.com
```

#### **Mobile App** (Expo)
```bash
# In app.json or .env
EXPO_PUBLIC_API_URL=https://palmera-api-xyz.onrender.com
```

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Build Fails**
```bash
# Check build logs in Render dashboard
# Common fixes:
1. Ensure pnpm is available (it is by default)
2. Check package.json scripts
3. Verify Prisma schema path
```

#### **Database Connection Issues**
```bash
# Check DATABASE_URL is injected
# Verify migrations ran successfully
# Check PostgreSQL service status
```

#### **Health Check Fails**
```bash
# Ensure /health endpoint exists in your API
# Check if app is binding to correct PORT
# Verify NODE_ENV=production
```

## 📈 **Production Checklist**

### **Before Going Live**
- [ ] **Environment variables** all set
- [ ] **Database migrations** tested
- [ ] **Health endpoint** working
- [ ] **CORS origins** configured for your domains
- [ ] **Stripe webhooks** configured (if using payments)
- [ ] **Error monitoring** (Sentry) set up
- [ ] **Backup strategy** planned

### **After Deployment**
- [ ] **Frontend apps** updated with API URL
- [ ] **DNS records** updated (if using custom domain)
- [ ] **SSL certificate** verified
- [ ] **Performance monitoring** enabled
- [ ] **Log aggregation** configured

## 💰 **Cost Estimation**

### **Development/MVP**
- **API**: Starter ($7/month)
- **Database**: Starter ($7/month)  
- **Total**: ~$14/month

### **Production**
- **API**: Standard ($25/month)
- **Database**: Standard ($15/month)
- **Total**: ~$40/month

### **Scale**
- **API**: Pro ($85/month)
- **Database**: Pro ($65/month)
- **Total**: ~$150/month

---

## 🎉 **Ready to Deploy!**

Your API is configured and ready for Render deployment. The setup includes:

✅ **Optimized build process**  
✅ **Database auto-setup**  
✅ **Environment configuration**  
✅ **Health monitoring**  
✅ **Auto-scaling ready**  

**Next step**: Create your Render account and follow the deployment steps above!
