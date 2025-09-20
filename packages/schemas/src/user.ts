import { z } from 'zod';
import { UserRoleSchema, MembershipTierSchema, EmailSchema, PhoneSchema } from './common';

// User profile
export const UserProfileSchema = z.object({
  id: z.string().cuid(),
  email: EmailSchema,
  phone: PhoneSchema.optional(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: UserRoleSchema,
  avatar: z.string().url().optional(),
  isActive: z.boolean(),
  membershipTier: MembershipTierSchema.optional(),
  kycStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Update user profile
export const UpdateUserProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: PhoneSchema.optional(),
  avatar: z.string().url().optional(),
});

// Provider profile
export const ProviderProfileSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  businessName: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  website: z.string().url().optional(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: UserProfileSchema,
});

// Create provider
export const CreateProviderSchema = z.object({
  businessName: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  website: z.string().url().optional(),
});

// Update provider
export const UpdateProviderSchema = z.object({
  businessName: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  website: z.string().url().optional(),
});

// KYC documents
export const KycDocumentSchema = z.object({
  type: z.enum(['PASSPORT', 'ID_CARD', 'BUSINESS_LICENSE', 'TAX_CERTIFICATE']),
  url: z.string().url(),
  filename: z.string(),
  uploadedAt: z.date(),
});

export const KycSubmissionSchema = z.object({
  documents: z.array(KycDocumentSchema).min(1),
  additionalInfo: z.string().max(1000).optional(),
});

// Membership
export const MembershipUpgradeSchema = z.object({
  tier: MembershipTierSchema,
  paymentMethod: z.enum(['CARD', 'MOBILE_MONEY']),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UpdateUserProfileRequest = z.infer<typeof UpdateUserProfileSchema>;
export type ProviderProfile = z.infer<typeof ProviderProfileSchema>;
export type CreateProviderRequest = z.infer<typeof CreateProviderSchema>;
export type UpdateProviderRequest = z.infer<typeof UpdateProviderSchema>;
export type KycDocument = z.infer<typeof KycDocumentSchema>;
export type KycSubmissionRequest = z.infer<typeof KycSubmissionSchema>;
export type MembershipUpgradeRequest = z.infer<typeof MembershipUpgradeSchema>;
