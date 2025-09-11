# 🚀 Palmera MVP Production Setup Guide

This guide provides step-by-step instructions for deploying the Palmera MVP to production.

## 📋 Prerequisites

- [ ] Production server (AWS EC2, DigitalOcean, etc.)
- [ ] Domain names configured
- [ ] SSL certificates
- [ ] Database (PostgreSQL)
- [ ] Redis instance (optional)
- [ ] Payment provider accounts
- [ ] Email service account
- [ ] File storage (S3/R2)
- [ ] Monitoring accounts (Sentry, Honeycomb)

## 🔧 1. Environment Configuration

### 1.1 Copy Environment Template
```bash
cp env.production.template .env.production
```

### 1.2 Configure Environment Variables
Edit `.env.production` with your production values:

```bash
# Application
NODE_ENV=production
PORT=3002
FRONTEND_URL=https://admin.palmera.app
MOBILE_APP_URL=https://palmera.app

# Database
DATABASE_URL=postgresql://username:password@host:5432/palmera_production
DIRECT_URL=postgresql://username:password@host:5432/palmera_production

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here

# Email (choose one provider)
EMAIL_PROVIDER=resend
EMAIL_FROM=noreply@palmera.app
RESEND_API_KEY=re_your_resend_api_key_here

# Payment Providers
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_your_flutterwave_secret_key_here
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key_here
ORANGE_MONEY_CLIENT_SECRET=your_orange_money_client_secret_here

# File Storage
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=palmera-production-uploads
S3_ACCESS_KEY_ID=your_s3_access_key_here
S3_SECRET_ACCESS_KEY=your_s3_secret_access_key_here

# Monitoring
SENTRY_DSN=https://your_sentry_dsn_here@sentry.io/project_id
```

### 1.3 Validate Configuration
```bash
cd apps/api
npm run validate:env
```

## 🗄️ 2. Database Setup

### 2.1 Create Production Database
```sql
CREATE DATABASE palmera_production;
CREATE USER palmera_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE palmera_production TO palmera_user;
```

### 2.2 Run Database Migration
```bash
cd apps/api
./scripts/migrate-production.sh
```

### 2.3 Verify Migration
```bash
npx prisma migrate status
npx prisma db pull
```

## 🔌 3. Provider Configuration

### 3.1 Payment Providers

#### Stripe
1. Create Stripe account and get live keys
2. Configure webhook endpoint: `https://api.palmera.app/payments/webhooks/stripe`
3. Enable required events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.dispute.created`

#### Flutterwave
1. Create Flutterwave account
2. Configure webhook URL: `https://api.palmera.app/payments/webhooks/flutterwave`
3. Enable webhook events

#### Paystack
1. Create Paystack account
2. Configure webhook URL: `https://api.palmera.app/payments/webhooks/paystack`
3. Enable webhook events

#### Orange Money
1. Contact Orange Money for API access
2. Configure webhook URL: `https://api.palmera.app/payments/webhooks/orange-money`

### 3.2 Email Service

#### Resend (Recommended)
1. Create Resend account
2. Verify domain: `palmera.app`
3. Get API key from dashboard

#### Alternative: Postmark
1. Create Postmark account
2. Verify sending domain
3. Get server API token

### 3.3 File Storage

#### AWS S3
1. Create S3 bucket: `palmera-production-uploads`
2. Configure CORS policy
3. Create IAM user with S3 permissions
4. Set bucket policy for public read access

#### Alternative: Cloudflare R2
1. Create R2 bucket
2. Configure public access
3. Get API credentials

## 🧪 4. Testing

### 4.1 Run Unit Tests
```bash
cd apps/api
npm run test:unit
```

### 4.2 Run Integration Tests
```bash
cd apps/api
npm run test:integration
```

### 4.3 Run E2E Tests
```bash
cd e2e
npm install
npx playwright install
npm run test
```

### 4.4 Test Payment Flows
1. Use test cards for Stripe
2. Test Orange Money with sandbox
3. Verify webhook delivery

## 🚀 5. Deployment

### 5.1 API Deployment

#### Option A: Docker (Recommended)
```bash
# Build and run with Docker
docker build -t palmera-api ./apps/api
docker run -d \
  --name palmera-api \
  --restart unless-stopped \
  -p 3002:3002 \
  --env-file .env.production \
  palmera-api
```

#### Option B: Direct Node.js
```bash
cd apps/api
npm ci --production
npm run build
npm run start:prod
```

### 5.2 Web Apps Deployment

#### Admin Panel (Vercel)
```bash
cd apps/web-admin
vercel --prod
```

#### Provider Portal (Vercel)
```bash
cd apps/web-provider
vercel --prod
```

### 5.3 Mobile App Deployment

#### iOS
```bash
cd apps/mobile
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

#### Android
```bash
cd apps/mobile
eas build --platform android --profile production
eas submit --platform android --profile production
```

## 📊 6. Monitoring Setup

### 6.1 Sentry Configuration
1. Create Sentry project
2. Get DSN from project settings
3. Configure release tracking
4. Set up alerts for errors

### 6.2 OpenTelemetry Setup
1. Create Honeycomb account
2. Get API key
3. Configure OTLP endpoint
4. Set up dashboards

### 6.3 Health Checks
- API Health: `https://api.palmera.app/health`
- Readiness: `https://api.palmera.app/health/ready`
- Liveness: `https://api.palmera.app/health/live`

## 🔒 7. Security Checklist

- [ ] SSL certificates installed
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Webhook signatures verified
- [ ] File uploads validated
- [ ] Admin access secured
- [ ] Monitoring alerts configured

## 🧪 8. Production Testing

### 8.1 Smoke Tests
```bash
# Test API health
curl https://api.palmera.app/health

# Test admin login
curl -X POST https://api.palmera.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@palmera.app","password":"Admin123!"}'

# Test file upload
curl -X POST https://api.palmera.app/files/signed-url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.jpg","contentType":"image/jpeg","fileSize":1024,"purpose":"avatar"}'
```

### 8.2 End-to-End Testing
1. Complete booking flow
2. Test payment processing
3. Verify email delivery
4. Test file uploads
5. Check admin functions

## 📈 9. Performance Optimization

### 9.1 Database Optimization
```sql
-- Create indexes for common queries
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_category ON listings(category);
```

### 9.2 Caching Setup
```bash
# Install Redis
sudo apt-get install redis-server

# Configure Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### 9.3 CDN Configuration
1. Set up Cloudflare or AWS CloudFront
2. Configure caching rules
3. Enable image optimization

## 🚨 10. Incident Response

### 10.1 Monitoring Alerts
- API response time > 2s
- Error rate > 5%
- Database connection failures
- Payment processing failures
- Email delivery failures

### 10.2 Rollback Procedures
```bash
# Rollback API deployment
docker stop palmera-api
docker run -d --name palmera-api --restart unless-stopped \
  -p 3002:3002 --env-file .env.production \
  palmera-api:previous-version

# Rollback database (if needed)
psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
```

## 📞 11. Support Contacts

- **Technical Issues**: tech@palmera.app
- **Payment Issues**: payments@palmera.app
- **Emergency**: +221 33 XXX XX XX

## ✅ 12. Go-Live Checklist

- [ ] All environment variables configured
- [ ] Database migrated and seeded
- [ ] Payment providers configured and tested
- [ ] Email service working
- [ ] File storage configured
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Health checks passing
- [ ] Smoke tests passing
- [ ] E2E tests passing
- [ ] Admin access verified
- [ ] Mobile app deployed
- [ ] Web apps deployed
- [ ] DNS configured
- [ ] Backup procedures tested
- [ ] Incident response plan ready

## 🎉 13. Launch

Once all checklist items are complete:

1. **Announce Launch**: Notify stakeholders
2. **Monitor Closely**: Watch metrics for first 24 hours
3. **User Feedback**: Collect and address issues
4. **Performance Review**: Analyze metrics after 1 week
5. **Iterate**: Plan next improvements

---

**🎊 Congratulations! Your Palmera MVP is now live in production!**

For ongoing maintenance and updates, refer to the [Maintenance Guide](MAINTENANCE.md).
