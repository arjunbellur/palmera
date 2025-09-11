import { z } from 'zod';
import { CategorySchema, LocationSchema, PaginationSchema } from './common';

// Pricing structure
export const PricingSchema = z.object({
  basePrice: z.number().int().positive(), // Price in cents
  currency: z.string().length(3).default('XOF'),
  minimumNights: z.number().int().positive().optional(),
  minimumDuration: z.number().int().positive().optional(), // Duration in minutes
  weekendMultiplier: z.number().positive().optional(),
  peakSeasonMultiplier: z.number().positive().optional(),
  groupDiscount: z.number().min(0).max(1).optional(), // Discount as decimal (0.1 = 10%)
  seasonalPricing: z.record(z.number().int().positive()).optional(),
});

// Listing
export const ListingSchema = z.object({
  id: z.string().cuid(),
  providerId: z.string().cuid(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  category: CategorySchema,
  city: z.string().min(1).max(50),
  address: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  images: z.array(z.string().url()).min(1).max(10),
  pricing: PricingSchema,
  capacity: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(), // Duration in minutes
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  provider: z.object({
    id: z.string().cuid(),
    businessName: z.string(),
    isVerified: z.boolean(),
  }).optional(),
});

// Create listing
export const CreateListingSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  category: CategorySchema,
  city: z.string().min(1).max(50),
  address: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  images: z.array(z.string().url()).min(1).max(10),
  pricing: PricingSchema,
  capacity: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
});

// Update listing
export const UpdateListingSchema = CreateListingSchema.partial().extend({
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// Listing filters
export const ListingFiltersSchema = z.object({
  city: z.string().optional(),
  category: CategorySchema.optional(),
  minPrice: z.number().int().positive().optional(),
  maxPrice: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
  location: LocationSchema.optional(),
  radius: z.number().positive().optional(), // Radius in kilometers
});

// Listing query
export const ListingQuerySchema = PaginationSchema.extend({
  filters: ListingFiltersSchema.optional(),
});

// Listing availability
export const AvailabilitySchema = z.object({
  date: z.date(),
  available: z.boolean(),
  price: z.number().int().positive().optional(),
  reason: z.string().optional(),
});

export const CheckAvailabilitySchema = z.object({
  listingId: z.string().cuid(),
  startDate: z.date(),
  endDate: z.date(),
  guests: z.number().int().positive().default(1),
});

export type Listing = z.infer<typeof ListingSchema>;
export type Pricing = z.infer<typeof PricingSchema>;
export type CreateListingRequest = z.infer<typeof CreateListingSchema>;
export type UpdateListingRequest = z.infer<typeof UpdateListingSchema>;
export type ListingFilters = z.infer<typeof ListingFiltersSchema>;
export type ListingQuery = z.infer<typeof ListingQuerySchema>;
export type Availability = z.infer<typeof AvailabilitySchema>;
export type CheckAvailabilityRequest = z.infer<typeof CheckAvailabilitySchema>;
