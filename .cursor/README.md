# Palmera Best Practices Configuration

This directory contains Cursor best practices configuration files for the Palmera platform. Each file defines coding standards and guidelines for specific technologies and domains used in the project.

## Best Practices Files

### Core Technologies
- **react-native-best-practices.mdc** - React Native and Expo development guidelines
- **react-navigation-best-practices.mdc** - Navigation patterns with Expo Router
- **tanstack-query-best-practices.mdc** - Data fetching and caching with TanStack Query
- **zustand-best-practices.mdc** - State management with Zustand
- **nextjs-best-practices.mdc** - Next.js web application development
- **tailwindcss-best-practices.mdc** - Styling with Tailwind CSS
- **nestjs-best-practices.mdc** - Backend API development with NestJS
- **prisma-best-practices.mdc** - Database modeling and management
- **typescript-best-practices.mdc** - TypeScript coding standards

### Security & Workflow
- **security-best-practices.mdc** - Application security guidelines
- **dev-workflow-best-practices.mdc** - Development workflow and tooling

### Palmera-Specific
- **palmera-design-system.mdc** - Design system and branding guidelines
- **payment-integration-best-practices.mdc** - Payment processing and integration
- **monorepo-best-practices.mdc** - Monorepo management and organization

## Usage

These files are automatically loaded by Cursor to provide context-aware suggestions and enforce coding standards across the Palmera platform. The glob patterns are configured to target specific directories and file types relevant to each technology stack.

## Project Structure

The best practices are organized to match the Palmera monorepo structure:

```
palmera/
├── apps/
│   ├── api/           # NestJS backend API
│   ├── web-admin/     # Next.js admin console
│   ├── web-provider/  # Next.js provider dashboard
│   └── mobile/        # React Native Expo app
├── packages/
│   ├── ui/            # Shared UI components
│   ├── schemas/       # Zod validation schemas
│   ├── sdk/           # API client SDK
│   └── i18n/          # Internationalization
└── .cursor/           # Best practices configuration
```

## Contributing

When adding new best practices or modifying existing ones:

1. Ensure glob patterns match the project structure
2. Include Palmera-specific guidelines where applicable
3. Maintain consistency with existing patterns
4. Update this README when adding new files
