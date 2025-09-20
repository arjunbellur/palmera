import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewQuery,
} from '@palmera/shared';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewRequest, userId: string) {
    const { listingId, bookingId, rating, comment } = createReviewDto;

    // Verify booking exists and belongs to user
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: userId,
        experienceId: listingId,
        status: 'COMPLETED',
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found or not completed');
    }

    // Check if review already exists
    const existingReview = await this.prisma.review.findUnique({
      where: {
        customerId_bookingId: {
          customerId: userId,
          bookingId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('Review already exists for this booking');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        customerId: userId,
        listingId: listingId,
        bookingId,
        rating,
        comment,
        isVerified: true, // Verified since it's from a completed booking
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
    });

    return review;
  }

  async findAll(query: ReviewQuery) {
    const { page = 1, limit = 20, filters = {} } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.listingId) {
      where.listingId = filters.listingId;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.rating) {
      where.rating = filters.rating;
    }

    if (filters.minRating) {
      where.rating = { gte: filters.minRating };
    }

    if (filters.maxRating) {
      where.rating = { ...where.rating, lte: filters.maxRating };
    }

    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      total,
      page,
      limit,
    };
  }

  async getUserReviews(query: ReviewQuery, userId: string) {
    return this.findAll({ ...query, filters: { ...query.filters, customerId: userId } });
  }

  async getListingReviews(listingId: string, query: ReviewQuery) {
    return this.findAll({ ...query, filters: { ...query.filters, listingId } });
  }

  async getListingReviewSummary(listingId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { listingId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recentReviews: [],
      };
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    const ratingDistribution = reviews.reduce((dist, review) => {
      dist[review.rating as keyof typeof dist]++;
      return dist;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    const recentReviews = await this.prisma.review.findMany({
      where: { listingId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution,
      recentReviews,
    };
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewRequest, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.customerId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.customerId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return { message: 'Review deleted successfully' };
  }

  async report(id: string, reason: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // In a real implementation, you would create a report record
    console.log(`Review ${id} reported by user ${userId} for reason: ${reason}`);

    return { message: 'Review reported successfully' };
  }
}
