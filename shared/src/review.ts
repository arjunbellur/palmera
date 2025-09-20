import { z } from 'zod';
import { PaginationSchema } from './common';

// Review
export const ReviewSchema = z.object({
  id: z.string().cuid(),
  customerId: z.string().cuid(),
  listingId: z.string().cuid(),
  bookingId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  customer: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    avatar: z.string().url().optional(),
  }).optional(),
  listing: z.object({
    id: z.string().cuid(),
    title: z.string(),
    category: z.string(),
  }).optional(),
});

// Create review
export const CreateReviewSchema = z.object({
  listingId: z.string().cuid(),
  bookingId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

// Update review
export const UpdateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(500).optional(),
});

// Review filters
export const ReviewFiltersSchema = z.object({
  listingId: z.string().cuid().optional(),
  customerId: z.string().cuid().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isVerified: z.boolean().optional(),
  minRating: z.number().int().min(1).max(5).optional(),
  maxRating: z.number().int().min(1).max(5).optional(),
});

// Review query
export const ReviewQuerySchema = PaginationSchema.extend({
  filters: ReviewFiltersSchema.optional(),
});

// Review summary
export const ReviewSummarySchema = z.object({
  averageRating: z.number().min(0).max(5),
  totalReviews: z.number().int().positive(),
  ratingDistribution: z.object({
    5: z.number().int().min(0),
    4: z.number().int().min(0),
    3: z.number().int().min(0),
    2: z.number().int().min(0),
    1: z.number().int().min(0),
  }),
  recentReviews: z.array(ReviewSchema).max(5),
});

export type Review = z.infer<typeof ReviewSchema>;
export type CreateReviewRequest = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewRequest = z.infer<typeof UpdateReviewSchema>;
export type ReviewFilters = z.infer<typeof ReviewFiltersSchema>;
export type ReviewQuery = z.infer<typeof ReviewQuerySchema>;
export type ReviewSummary = z.infer<typeof ReviewSummarySchema>;
