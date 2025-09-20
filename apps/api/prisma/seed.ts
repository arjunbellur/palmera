import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create system configuration
  await prisma.systemConfig.upsert({
    where: { key: 'app_version' },
    update: {},
    create: {
      key: 'app_version',
      value: '1.0.0',
      description: 'Current application version',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'maintenance_mode' },
    update: {},
    create: {
      key: 'maintenance_mode',
      value: 'false',
      description: 'Maintenance mode flag',
    },
  });

  // Create Senegal cities
  const cities = [
    'Dakar',
    'Thiès',
    'Kaolack',
    'Ziguinchor',
    'Saint-Louis',
    'Diourbel',
    'Tambacounda',
    'Mbour',
    'Rufisque',
    'Kolda',
    'Fatick',
    'Kédougou',
    'Matam',
    'Kaffrine',
    'Sédhiou',
    'Podor',
    'Bakel',
    'Kédougou',
    'Kolda',
    'Sédhiou',
  ];

  console.log('🏙️ Creating cities...');
  for (const city of cities) {
    await prisma.systemConfig.upsert({
      where: { key: `city_${city.toLowerCase()}` },
    update: {},
    create: {
        key: `city_${city.toLowerCase()}`,
        value: city,
        description: `Available city: ${city}`,
    },
  });
  }

  // Create experience categories
  const categories = [
    {
      name: 'ACCOMMODATION',
      displayName: 'Accommodation',
      description: 'Hotels, villas, and unique stays',
      icon: '🏨',
    },
    {
      name: 'ADVENTURE',
      displayName: 'Adventure',
      description: 'Outdoor activities and extreme sports',
      icon: '🏔️',
    },
    {
      name: 'CULTURE',
      displayName: 'Culture & Heritage',
      description: 'Museums, historical sites, and cultural experiences',
      icon: '🏛️',
    },
    {
      name: 'FOOD',
      displayName: 'Food & Dining',
      description: 'Culinary experiences and local cuisine',
      icon: '🍽️',
    },
    {
      name: 'WELLNESS',
      displayName: 'Wellness & Spa',
      description: 'Relaxation and wellness treatments',
      icon: '🧘',
    },
    {
      name: 'NIGHTLIFE',
      displayName: 'Nightlife',
      description: 'Bars, clubs, and evening entertainment',
      icon: '🍸',
    },
    {
      name: 'SHOPPING',
      displayName: 'Shopping',
      description: 'Markets, boutiques, and local crafts',
      icon: '🛍️',
    },
    {
      name: 'NATURE',
      displayName: 'Nature & Wildlife',
      description: 'Parks, reserves, and wildlife experiences',
      icon: '🌿',
    },
    {
      name: 'WATER_SPORTS',
      displayName: 'Water Sports',
      description: 'Beach activities and water adventures',
      icon: '🏄',
    },
    {
      name: 'TRANSPORT',
      displayName: 'Transportation',
      description: 'Private transfers and guided tours',
      icon: '🚗',
    },
  ];

  console.log('📂 Creating categories...');
  for (const category of categories) {
    await prisma.systemConfig.upsert({
      where: { key: `category_${category.name.toLowerCase()}` },
      update: {},
      create: {
        key: `category_${category.name.toLowerCase()}`,
        value: JSON.stringify({
          name: category.name,
          displayName: category.displayName,
          description: category.description,
          icon: category.icon,
        }),
        description: `Experience category: ${category.displayName}`,
      },
    });
  }

  // Create default admin user
  console.log('👤 Creating default admin user...');
  const adminEmail = 'admin@palmera.app';
  const adminPassword = 'Admin123!'; // In production, this should be set via environment variable

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        membershipTier: 'GOLD',
        isActive: true,
        emailVerified: true,
      },
    });

    console.log(`✅ Admin user created: ${adminEmail}`);
    console.log(`🔑 Default password: ${adminPassword}`);
    console.log('⚠️  Please change the admin password after first login!');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Create sample provider for testing
  console.log('🏢 Creating sample provider...');
  const providerEmail = 'provider@palmera.app';
  const providerPassword = 'Provider123!';

  const existingProvider = await prisma.user.findUnique({
    where: { email: providerEmail },
  });

  if (!existingProvider) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(providerPassword, 10);

    const provider = await prisma.user.create({
      data: {
        email: providerEmail,
        passwordHash: hashedPassword,
        firstName: 'Sample',
        lastName: 'Provider',
        role: 'PROVIDER',
        membershipTier: 'GOLD',
        isActive: true,
        emailVerified: true,
      },
    });

    // Create provider profile
    await prisma.provider.create({
      data: {
        userId: provider.id,
        businessName: 'Dakar Luxury Experiences',
        businessType: 'TOURISM',
        description: 'Premium experiences in Dakar and surrounding areas',
        website: 'https://dakarluxury.com',
        isVerified: true,
      },
    });

    console.log(`✅ Sample provider created: ${providerEmail}`);
    console.log(`🔑 Default password: ${providerPassword}`);
  } else {
    console.log('ℹ️  Sample provider already exists');
  }

  // Create sample categories for listings
  console.log('📋 Creating sample listing categories...');
  const sampleCategories = [
    'Luxury Beach Villa',
    'Cultural Heritage Tour',
    'Traditional Cooking Class',
    'Desert Safari Adventure',
    'Artisan Workshop',
    'Sunset Boat Cruise',
    'Historical City Walk',
    'Local Market Experience',
    'Traditional Music Performance',
    'Wellness Retreat',
  ];

  for (const category of sampleCategories) {
    await prisma.systemConfig.upsert({
      where: { key: `listing_category_${category.toLowerCase().replace(/\s+/g, '_')}` },
      update: {},
      create: {
        key: `listing_category_${category.toLowerCase().replace(/\s+/g, '_')}`,
        value: category,
        description: `Sample listing category: ${category}`,
      },
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - ${cities.length} cities added`);
  console.log(`  - ${categories.length} experience categories added`);
  console.log(`  - ${sampleCategories.length} sample listing categories added`);
  console.log('  - Default admin user created');
  console.log('  - Sample provider created');
  console.log('\n🚀 Your Palmera database is ready for production!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });