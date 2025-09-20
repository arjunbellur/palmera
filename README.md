# Palmera Platform

A premium experiences platform with admin, provider, and customer interfaces.

## 🏗️ Project Structure

```
palmera/
├── apps/                    # Applications
│   ├── api/                # Backend API (NestJS)
│   ├── mobile/             # Mobile app (React Native/Expo)
│   ├── web-admin/          # Admin dashboard (Next.js)
│   ├── web-provider/       # Provider dashboard (Next.js)
│   └── web-unified/        # Unified dashboard (Next.js)
├── packages/               # Shared packages
│   ├── i18n/              # Internationalization
│   ├── schemas/           # Shared schemas
│   ├── sdk/               # SDK for API communication
│   ├── tokens/            # Design tokens
│   └── ui/                # UI components
├── shared/                 # Shared utilities
├── config/                 # Configuration files
│   ├── deployment/        # Deployment configs
│   └── development/       # Development configs
├── docs/                   # Documentation
│   ├── architecture/      # Architecture docs
│   ├── deployment/        # Deployment guides
│   └── development/       # Development guides
├── tools/                  # Tools and utilities
│   ├── scripts/           # Build and dev scripts
│   └── utilities/         # Helper scripts
└── e2e/                   # End-to-end tests
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x+
- pnpm
- PostgreSQL

### Development
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm run dev

# Start specific app
pnpm run dev:web-unified
```

### Database
```bash
# Generate Prisma client
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Seed database
pnpm run db:seed
```

## 📱 Applications

### API (`apps/api`)
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma
- **Port**: 3002
- **Features**: Authentication, Bookings, Payments, Users

### Web Admin (`apps/web-admin`)
- **Framework**: Next.js
- **Port**: 3004
- **Features**: User management, Analytics, Platform oversight

### Web Provider (`apps/web-provider`)
- **Framework**: Next.js
- **Port**: 3001
- **Features**: Listing management, Booking management, Earnings

### Web Unified (`apps/web-unified`)
- **Framework**: Next.js
- **Port**: 3000
- **Features**: Role-based dashboard (Admin + Provider)

### Mobile (`apps/mobile`)
- **Framework**: React Native/Expo
- **Features**: Customer booking, Experience discovery

## 🔧 Packages

- **@palmera/schemas**: Shared TypeScript schemas
- **@palmera/sdk**: API client SDK
- **@palmera/ui**: Shared UI components
- **@palmera/i18n**: Internationalization
- **@palmera/tokens**: Design tokens

## 🚀 Deployment

### API (Render)
- Configuration: `config/deployment/render.yaml`
- Build: `tools/scripts/render-build.sh`

### Web Apps (Vercel)
- Admin: `config/deployment/vercel-web-admin.json`
- Provider: `config/deployment/vercel-web-provider.json`

## 📚 Documentation

- **Architecture**: `docs/architecture/`
- **Deployment**: `docs/deployment/`
- **Development**: `docs/development/`

## 🛠️ Tools

- **Scripts**: `tools/scripts/` - Build and development scripts
- **Utilities**: `tools/utilities/` - Helper scripts and tools

## 🧪 Testing

```bash
# Run tests
pnpm test

# E2E tests
cd e2e && pnpm test
```

## 📦 Build

```bash
# Build all apps
pnpm run build

# Build specific app
cd apps/api && pnpm build
```

## 🔍 Scripts

- `pnpm run dev` - Start all development servers
- `pnpm run build` - Build all applications
- `pnpm run db:generate` - Generate Prisma client
- `pnpm run db:migrate` - Run database migrations
- `pnpm run lint` - Lint all code
- `pnpm run format` - Format all code
