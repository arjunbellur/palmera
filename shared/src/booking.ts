import { z } from 'zod';
import { BookingStatusSchema, PaginationSchema } from './common';

// Booking
export const BookingSchema = z.object({
  id: z.string().cuid(),
  customerId: z.string().cuid(),
  providerId: z.string().cuid(),
  listingId: z.string().cuid(),
  status: BookingStatusSchema,
  startDate: z.date(),
  endDate: z.date(),
  guests: z.number().int().positive().default(1),
  totalAmount: z.number().int().positive(), // Amount in cents
  commission: z.number().int().positive(), // Commission amount in cents
  specialRequests: z.string().max(500).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  customer: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
  }).optional(),
  provider: z.object({
    id: z.string().cuid(),
    businessName: z.string(),
  }).optional(),
  listing: z.object({
    id: z.string().cuid(),
    title: z.string(),
    category: z.string(),
    city: z.string(),
    images: z.array(z.string().url()),
  }).optional(),
});

// Create booking
export const CreateBookingSchema = z.object({
  listingId: z.string().cuid(),
  startDate: z.date(),
  endDate: z.date(),
  guests: z.number().int().positive().default(1),
  specialRequests: z.string().max(500).optional(),
});

// Update booking status
export const UpdateBookingStatusSchema = z.object({
  status: BookingStatusSchema,
  reason: z.string().max(200).optional(),
});

// Booking filters
export const BookingFiltersSchema = z.object({
  status: BookingStatusSchema.optional(),
  customerId: z.string().cuid().optional(),
  providerId: z.string().cuid().optional(),
  listingId: z.string().cuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
});

// Booking query
export const BookingQuerySchema = PaginationSchema.extend({
  filters: BookingFiltersSchema.optional(),
});

// Booking confirmation
export const BookingConfirmationSchema = z.object({
  bookingId: z.string().cuid(),
  paymentIntentId: z.string().optional(),
  confirmationCode: z.string(),
});

// Booking cancellation
export const BookingCancellationSchema = z.object({
  bookingId: z.string().cuid(),
  reason: z.string().max(200),
  refundAmount: z.number().int().positive().optional(),
});

// Booking hold (for payment processing)
export const BookingHoldSchema = z.object({
  bookingId: z.string().cuid(),
  expiresAt: z.date(),
  paymentIntentId: z.string(),
});

export type Booking = z.infer<typeof BookingSchema>;
export type CreateBookingRequest = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingStatusRequest = z.infer<typeof UpdateBookingStatusSchema>;
export type BookingFilters = z.infer<typeof BookingFiltersSchema>;
export type BookingQuery = z.infer<typeof BookingQuerySchema>;
export type BookingConfirmation = z.infer<typeof BookingConfirmationSchema>;
export type BookingCancellation = z.infer<typeof BookingCancellationSchema>;
export type BookingHold = z.infer<typeof BookingHoldSchema>;
