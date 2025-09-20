import { z } from 'zod';

// Common enums
export const UserRoleSchema = z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN', 'CONCIERGE']);
export const CategorySchema = z.enum(['VILLA', 'JETSKI', 'QUAD', 'NIGHTLIFE', 'CAR', 'TOUR', 'SPORT']);
export const BookingStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED']);
export const PaymentStatusSchema = z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED']);
export const PaymentMethodSchema = z.enum(['CARD', 'MOBILE_MONEY', 'BANK_TRANSFER']);
export const MembershipTierSchema = z.enum(['STANDARD', 'GOLD']);

// Common types
export const IdSchema = z.string().cuid();
export const EmailSchema = z.string().email();
export const PhoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/);
export const CurrencySchema = z.string().length(3);
export const AmountSchema = z.number().int().positive(); // Amount in cents

// Pagination
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Date range
export const DateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
});

// Location
export const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
});

// File upload
export const FileUploadSchema = z.object({
  filename: z.string(),
  mimetype: z.string(),
  size: z.number().positive(),
  url: z.string().url(),
});

// API Response wrapper
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

// Error response
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  details: z.record(z.any()).optional(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type MembershipTier = z.infer<typeof MembershipTierSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
