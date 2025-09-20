#!/bin/bash

# Palmera Production Database Migration Script
# This script safely migrates the production database

set -e

echo "🚀 Starting Palmera production database migration..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set your production database URL before running this script"
    exit 1
fi

# Check if we're in production mode
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to 'production'"
    echo "Current NODE_ENV: $NODE_ENV"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Migration cancelled"
        exit 1
    fi
fi

echo "📋 Pre-migration checks..."

# Test database connection
echo "🔌 Testing database connection..."
npx prisma db pull --schema=./prisma/schema.prisma > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Create backup (if backup tool is available)
echo "💾 Creating database backup..."
timestamp=$(date +"%Y%m%d_%H%M%S")
backup_file="backup_${timestamp}.sql"

# Try to create backup using pg_dump if available
if command -v pg_dump &> /dev/null; then
    echo "Creating backup: $backup_file"
    pg_dump "$DATABASE_URL" > "$backup_file"
    if [ $? -eq 0 ]; then
        echo "✅ Backup created successfully: $backup_file"
    else
        echo "⚠️  Backup creation failed, but continuing with migration"
    fi
else
    echo "⚠️  pg_dump not available, skipping backup"
    echo "Consider creating a manual backup before proceeding"
    read -p "Continue without backup? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Migration cancelled"
        exit 1
    fi
fi

# Run Prisma migration
echo "🔄 Running Prisma migration..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

if [ $? -eq 0 ]; then
    echo "✅ Database migration completed successfully"
else
    echo "❌ Database migration failed"
    echo "If you have a backup, you can restore it using:"
    echo "psql \$DATABASE_URL < $backup_file"
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Prisma client generation failed"
    exit 1
fi

# Run database seeding (optional)
if [ "$SKIP_SEEDING" != "true" ]; then
    echo "🌱 Running database seeding..."
    npx tsx prisma/seed.ts
    
    if [ $? -eq 0 ]; then
        echo "✅ Database seeding completed successfully"
    else
        echo "⚠️  Database seeding failed, but migration was successful"
    fi
else
    echo "⏭️  Skipping database seeding (SKIP_SEEDING=true)"
fi

# Verify migration
echo "🔍 Verifying migration..."
npx prisma db pull --schema=./prisma/schema.prisma > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Migration verification successful"
else
    echo "❌ Migration verification failed"
    exit 1
fi

echo ""
echo "🎉 Production database migration completed successfully!"
echo ""
echo "📊 Next steps:"
echo "  1. Verify your application is working correctly"
echo "  2. Test critical user flows"
echo "  3. Monitor application logs for any issues"
echo "  4. Keep the backup file ($backup_file) for at least 30 days"
echo ""
echo "🔗 Useful commands:"
echo "  - View database: npx prisma studio"
echo "  - Check migration status: npx prisma migrate status"
echo "  - Reset database (DANGER): npx prisma migrate reset"
echo ""
