#!/bin/bash

# Fix build errors script for Palmera monorepo
set -e

echo "🔧 Fixing build errors..."

# Fix remaining PAYSTACK references
echo "Fixing PAYSTACK references..."
find apps/api/src -name "*.ts" -exec sed -i "s/case 'PAYSTACK':/case 'paystack':/g" {} \;

# Fix Review model field names
echo "Fixing Review model field names..."
find apps/api/src -name "*.ts" -exec sed -i 's/listingId: listingId,/experienceId: listingId,/g' {} \;

# Fix Booking model field names in reviews
echo "Fixing Booking model field names in reviews..."
find apps/api/src -name "*.ts" -exec sed -i 's/where: { listingId: listingId,/where: { experienceId: listingId,/g' {} \;

# Fix unique constraint field names
echo "Fixing unique constraint field names..."
find apps/api/src -name "*.ts" -exec sed -i "s/customerId_bookingId: { userId: userId,/customerId_bookingId: { customerId: userId,/g" {} \;

echo "✅ Build errors fixed!"
