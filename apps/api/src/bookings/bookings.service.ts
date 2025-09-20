import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  BookingQuery,
} from '@palmera/shared';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingRequest, userId: string) {
    const { listingId, startDate, endDate, guests, specialRequests } = createBookingDto;

    // Verify listing exists and is active
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId, isActive: true },
      include: { provider: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found or inactive');
    }

    // Check capacity
    if (listing.capacity && guests > listing.capacity) {
      throw new BadRequestException('Number of guests exceeds listing capacity');
    }

    // Check availability
    const conflictingBookings = await this.prisma.booking.findMany({
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

    if (conflictingBookings.length > 0) {
      throw new BadRequestException('Listing is not available for the selected dates');
    }

    // Calculate pricing
    const pricing = listing.pricing as any;
    let totalAmount = pricing.basePrice;

    // Apply multipliers based on pricing rules
    if (pricing.weekendMultiplier && this.isWeekend(startDate)) {
      totalAmount *= pricing.weekendMultiplier;
    }

    if (pricing.peakSeasonMultiplier && this.isPeakSeason(startDate)) {
      totalAmount *= pricing.peakSeasonMultiplier;
    }

    // Calculate commission (15-25% based on category)
    const commissionRate = this.getCommissionRate(listing.category);
    const commission = Math.round(totalAmount * commissionRate);

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        userId: userId,
        providerId: listing.providerId,
        experienceId: listingId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guests,
        total: Math.round(totalAmount),
        specialRequests,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        provider: {
          select: {
            id: true,
            businessName: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            category: true,
            city: true,
            images: true,
          },
        },
      },
    });

    return booking;
  }

  async findAll(query: BookingQuery, user: any) {
    const { page = 1, limit = 20, filters = {} } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply role-based filtering
    if (user.role === 'CUSTOMER') {
      where.customerId = user.id;
    } else if (user.role === 'PROVIDER') {
      where.providerId = user.id;
    }

    // Apply filters
    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate) {
      where.startDate = { gte: new Date(filters.startDate) };
    }

    if (filters.endDate) {
      where.endDate = { lte: new Date(filters.endDate) };
    }

    if (filters.city) {
      where.listing = { city: filters.city };
    }

    if (filters.category) {
      where.listing = { ...where.listing, category: filters.category };
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          provider: {
            select: {
              id: true,
              businessName: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              category: true,
              city: true,
              images: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      total,
      page,
      limit,
    };
  }

  async getUserBookings(query: BookingQuery, userId: string) {
    return this.findAll({ ...query, filters: { ...query.filters, customerId: userId } }, { role: 'CUSTOMER', id: userId });
  }

  async getProviderBookings(query: BookingQuery, userId: string) {
    // Get provider ID for user
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new ForbiddenException('User is not a provider');
    }

    return this.findAll({ ...query, filters: { ...query.filters, providerId: provider.id } }, { role: 'PROVIDER', id: userId });
  }

  async findOne(id: string, user: any) {
    const where: any = { id };

    // Apply role-based access
    if (user.role === 'CUSTOMER') {
      where.customerId = user.id;
    } else if (user.role === 'PROVIDER') {
      where.providerId = user.id;
    }

    const booking = await this.prisma.booking.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        provider: {
          select: {
            id: true,
            businessName: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            category: true,
            city: true,
            images: true,
            pricing: true,
          },
        },
        payments: true,
        reviews: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateStatus(id: string, updateStatusDto: UpdateBookingStatusRequest, user: any) {
    const booking = await this.findOne(id, user);

    // Only providers and admins can update status
    if (user.role !== 'PROVIDER' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only providers can update booking status');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
      },
    });
  }

  async confirm(id: string, user: any) {
    const booking = await this.findOne(id, user);

    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CONFIRMED' },
    });
  }

  async cancel(id: string, reason: string, user: any) {
    const booking = await this.findOne(id, user);

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel completed booking');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { 
        status: 'CANCELLED',
        specialRequests: reason,
      },
    });
  }

  async hold(id: string, durationMinutes: number, user: any) {
    const booking = await this.findOne(id, user);

    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Only pending bookings can be held');
    }

    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    return {
      bookingId: id,
      expiresAt,
      durationMinutes,
    };
  }

  async release(id: string, user: any) {
    const booking = await this.findOne(id, user);

    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Only pending bookings can be released');
    }

    // In a real implementation, you would remove the hold
    return { message: 'Booking hold released' };
  }

  private isWeekend(date: Date): boolean {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  private isPeakSeason(date: Date): boolean {
    const month = new Date(date).getMonth();
    // Define peak season months (e.g., December-February for Senegal)
    return month === 11 || month === 0 || month === 1; // Dec, Jan, Feb
  }

  private getCommissionRate(category: string): number {
    const rates: Record<string, number> = {
      VILLA: 0.20,
      JETSKI: 0.15,
      QUAD: 0.15,
      NIGHTLIFE: 0.25,
      CAR: 0.15,
      TOUR: 0.15,
      SPORT: 0.15,
    };
    return rates[category] || 0.15;
  }
}
