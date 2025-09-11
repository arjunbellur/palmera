# Palmera - Experience Marketplace

A comprehensive platform for booking unique experiences in Senegal, built with modern web technologies.

## 🏗️ Architecture

This is a monorepo containing:

- **API** (`apps/api`) - NestJS backend with Prisma ORM
- **Mobile App** (`apps/mobile`) - React Native with Expo
- **Web Admin** (`apps/web-admin`) - Next.js admin dashboard
- **Web Provider** (`apps/web-provider`) - Next.js provider portal
- **Shared Packages** (`packages/`) - Schemas, SDK, UI components, i18n

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+
- PostgreSQL database
- Redis (for caching and sessions)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd palmera
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.production.template .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start development servers:
```bash
npm run dev
```

This will start:
- API server on http://localhost:3000
- Web Admin on http://localhost:3000
- Web Provider on http://localhost:3001
- Mobile app (scan QR code with Expo Go)

## 📱 Mobile App

The mobile app is built with React Native and Expo, featuring:

- **Authentication** - Magic link login
- **Experience Discovery** - Browse and search experiences
- **Booking Flow** - Complete booking and payment process
- **Account Management** - Profile, bookings, membership
- **Real-time Features** - Push notifications, chat

### Running the Mobile App

```bash
cd apps/mobile
npm start
```

## 🌐 Web Applications

### Admin Dashboard

Access the admin dashboard at http://localhost:3000 to:

- Manage users and providers
- Verify KYC documents
- Monitor bookings and payments
- View analytics and reports

### Provider Portal

Access the provider portal at http://localhost:3001 to:

- Manage listings and availability
- Process bookings
- View earnings and payouts
- Update business profile

## 🔧 Development

### Available Scripts

- `npm run build` - Build all applications
- `npm run dev` - Start development servers
- `npm run test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:integration` - Run integration tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Lint all code
- `npm run type-check` - Type check all TypeScript
- `npm run format` - Format code with Prettier

### Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests** - Jest for individual components and services
- **Integration Tests** - API endpoint testing
- **E2E Tests** - Playwright for complete user flows

Run tests:
```bash
npm run test
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**:
   - Copy `env.production.template` to `.env.production`
   - Configure all required environment variables
   - Set up production database and Redis

2. **Database Migration**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Build Applications**:
   ```bash
   npm run build
   ```

4. **Deploy**:
   - API: Deploy to Fly.io/Render/AWS
   - Web Apps: Deploy to Vercel
   - Mobile: Build with EAS and submit to app stores

### CI/CD

GitHub Actions workflows are configured for:

- Automated testing on pull requests
- Deployment to staging and production
- Mobile app builds with EAS

## 📊 Monitoring

Production monitoring includes:

- **Sentry** - Error tracking and performance monitoring
- **OpenTelemetry** - Distributed tracing and metrics
- **Health Checks** - API health monitoring endpoints

## 🔐 Security

Security features include:

- JWT-based authentication
- Role-based access control
- Input validation with Zod
- Secure file uploads with signed URLs
- Webhook signature verification
- Rate limiting and CORS protection

## 🌍 Internationalization

The platform supports multiple languages:

- English (EN)
- French (FR)

Language files are located in `packages/i18n/src/locales/`.

## 📚 API Documentation

API documentation is available at `/api/docs` when running the development server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

Built with ❤️ for the Senegal experience marketplace.