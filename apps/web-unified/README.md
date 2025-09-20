# Palmera Unified Dashboard

A unified Next.js application that combines admin and provider functionality with role-based access control.

## Features

- **Role-based Authentication**: Supports ADMIN, PROVIDER, and CONCIERGE roles
- **Unified Interface**: Single app serving different user types
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Built with React Query for data fetching
- **Secure Routing**: Middleware-based route protection

## User Roles

### Admin Role (`ADMIN`)
- Access to admin dashboard at `/admin/dashboard`
- User management (`/admin/users`)
- Booking management (`/admin/bookings`)
- Payment oversight (`/admin/payments`)
- Provider management (`/admin/providers`)
- Analytics (`/admin/analytics`)
- System settings (`/admin/settings`)

### Provider Role (`PROVIDER`)
- Access to provider dashboard at `/provider/dashboard`
- Listing management (`/provider/listings`)
- Booking management (`/provider/bookings`)
- Earnings tracking (`/provider/earnings`)
- Profile management (`/provider/profile`)
- Onboarding flow (`/provider/onboarding`)

### Concierge Role (`CONCIERGE`)
- Access to admin dashboard (limited features)
- Booking management capabilities
- Customer support tools

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- pnpm package manager

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Build shared packages:
```bash
pnpm run build:packages
```

3. Start development server:
```bash
pnpm run dev:web-unified
```

The app will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_APP_NAME=Palmera Unified Dashboard
```

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin-specific routes
│   ├── provider/          # Provider-specific routes
│   ├── auth/              # Authentication routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── provider/          # Provider components
│   └── shared/            # Shared components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   └── auth/              # Authentication logic
└── middleware.ts          # Route protection middleware
```

## Authentication Flow

1. User visits the app
2. Middleware checks authentication status
3. Unauthenticated users are redirected to `/auth/login`
4. After login, users are redirected to role-appropriate dashboard
5. All routes are protected based on user roles

## Deployment

### Vercel
```bash
pnpm run build:web-unified
```

### Cloudflare Pages
```bash
pnpm run build:web-unified
# Deploy the `out/` directory
```

## Development

### Adding New Routes

1. Add route configuration in `src/lib/auth/types.ts`
2. Create the page component
3. Update navigation in layout components if needed

### Adding New Components

- Admin components go in `src/components/admin/`
- Provider components go in `src/components/provider/`
- Shared components go in `src/components/shared/`

## API Integration

The app integrates with the Palmera API using:
- Shared SDK from `@palmera/sdk`
- Type-safe schemas from `@palmera/schemas`
- UI components from `@palmera/ui`

## Security

- JWT-based authentication
- Role-based route protection
- Secure cookie handling
- CSRF protection via middleware
