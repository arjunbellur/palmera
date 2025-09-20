import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateListingRequest,
  UpdateListingRequest,
  ListingQuery,
  CheckAvailabilityRequest,
} from '@palmera/shared';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(createListingDto: CreateListingRequest, userId: string) {
    // Get provider for user
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new ForbiddenException('User is not a provider');
    }

    return this.prisma.listing.create({
      data: {
        ...createListingDto,
        provider: {
          connect: { id: provider.id }
        }
      } as any,
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            isVerified: true,
          },
        },
      },
    });
  }

  async findAll(query: ListingQuery) {
    const { page = 1, limit = 20, filters = {} } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (filters.city) {
      where.city = filters.city;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.pricing = {};
      if (filters.minPrice) {
        where.pricing.basePrice = { gte: filters.minPrice };
      }
      if (filters.maxPrice) {
        where.pricing.basePrice = { ...where.pricing.basePrice, lte: filters.maxPrice };
      }
    }

    if (filters.capacity) {
      where.capacity = { gte: filters.capacity };
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        include: {
          provider: {
            select: {
              id: true,
              businessName: true,
              isVerified: true,
            },
          },
        },
        orderBy: filters.isFeatured ? { createdAt: 'desc' } : { createdAt: 'desc' },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      data: listings,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            isVerified: true,
            description: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async update(id: string, updateListingDto: UpdateListingRequest, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { provider: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.provider.userId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    return this.prisma.listing.update({
      where: { id },
      data: updateListingDto,
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            isVerified: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { provider: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.provider.userId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.prisma.listing.delete({
      where: { id },
    });

    return { message: 'Listing deleted successfully' };
  }

  async getFeatured(city?: string) {
    const where: any = {
      isActive: true,
      isFeatured: true,
    };

    if (city) {
      where.city = city;
    }

    return this.prisma.listing.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async search(query: string, filters: any) {
    const where: any = {
      isActive: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (filters.city) {
      where.city = filters.city;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    return this.prisma.listing.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCategories() {
    // Return enum values from schema
    return ['VILLA', 'JETSKI', 'QUAD', 'NIGHTLIFE', 'CAR', 'TOUR', 'SPORT'];
  }

  async getCities() {
    // Get unique cities from listings
    const cities = await this.prisma.listing.findMany({
      select: { city: true },
      distinct: ['city'],
      where: { isActive: true },
    });

    return cities.map(c => c.city);
  }

  async checkAvailability(checkAvailabilityDto: CheckAvailabilityRequest) {
    const { listingId, startDate, endDate, guests } = checkAvailabilityDto;

    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Check capacity
    if (listing.capacity && guests > listing.capacity) {
      return [{
        date: startDate,
        available: false,
        reason: 'Exceeds maximum capacity',
      }];
    }

    // Check for existing bookings
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        experienceId: listingId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (existingBookings.length > 0) {
      return [{
        date: startDate,
        available: false,
        reason: 'Already booked for this period',
      }];
    }

    return [{
      date: startDate,
      available: true,
      price: (listing.pricing as any).basePrice,
    }];
  }
}
