import { z } from 'zod';
import { EmailSchema } from './common';

// Login schemas
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8),
});

export const MagicLinkLoginSchema = z.object({
  email: EmailSchema,
  redirectUrl: z.string().url().optional(),
});

// Register schemas
export const RegisterSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/).optional(),
  role: z.enum(['CUSTOMER', 'PROVIDER']).default('CUSTOMER'),
});

// Password reset
export const ForgotPasswordSchema = z.object({
  email: EmailSchema,
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

// JWT payload
export const JwtPayloadSchema = z.object({
  sub: z.string(), // user id
  email: z.string().email(),
  role: z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN', 'CONCIERGE']),
  iat: z.number(),
  exp: z.number(),
});

// Auth response
export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN', 'CONCIERGE']),
    avatar: z.string().url().optional(),
    membershipTier: z.enum(['STANDARD', 'GOLD']).optional(),
  }),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
export type MagicLinkLoginRequest = z.infer<typeof MagicLinkLoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
