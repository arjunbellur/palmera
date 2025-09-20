import { z } from 'zod';
import { PaymentStatusSchema, PaymentMethodSchema, AmountSchema, CurrencySchema } from './common';

// Payment
export const PaymentSchema = z.object({
  id: z.string().cuid(),
  bookingId: z.string().cuid(),
  amount: AmountSchema,
  currency: CurrencySchema.default('XOF'),
  status: PaymentStatusSchema,
  method: PaymentMethodSchema,
  provider: z.enum(['stripe', 'flutterwave', 'paystack', 'orange_money']),
  providerId: z.string().optional(),
  providerData: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Payment intent
export const PaymentIntentSchema = z.object({
  id: z.string(),
  amount: AmountSchema,
  currency: CurrencySchema,
  method: PaymentMethodSchema,
  provider: z.enum(['stripe', 'flutterwave', 'paystack', 'orange_money']),
  clientSecret: z.string().optional(),
  paymentUrl: z.string().url().optional(),
  expiresAt: z.date(),
});

// Create payment intent
export const CreatePaymentIntentSchema = z.object({
  bookingId: z.string().cuid(),
  amount: AmountSchema,
  currency: CurrencySchema.default('XOF'),
  method: PaymentMethodSchema,
  provider: z.enum(['stripe', 'flutterwave', 'paystack', 'orange_money']),
  returnUrl: z.string().url().optional(),
});

// Payment confirmation
export const PaymentConfirmationSchema = z.object({
  paymentIntentId: z.string(),
  providerId: z.string(),
  transactionId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// Refund
export const RefundSchema = z.object({
  id: z.string().cuid(),
  paymentId: z.string().cuid(),
  amount: AmountSchema,
  reason: z.string().max(200),
  status: PaymentStatusSchema,
  providerRefundId: z.string().optional(),
  createdAt: z.date(),
});

// Create refund
export const CreateRefundSchema = z.object({
  paymentId: z.string().cuid(),
  amount: AmountSchema.optional(), // If not provided, refund full amount
  reason: z.string().max(200),
});

// Payment webhook
export const PaymentWebhookSchema = z.object({
  provider: z.enum(['stripe', 'flutterwave', 'paystack', 'orange_money']),
  event: z.string(),
  data: z.record(z.any()),
  signature: z.string().optional(),
});

// Mobile money payment
export const MobileMoneyPaymentSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  amount: AmountSchema,
  currency: CurrencySchema.default('XOF'),
  provider: z.enum(['flutterwave', 'paystack', 'orange_money']),
  network: z.enum(['MTN', 'ORANGE', 'FREE', 'EXPRESSO']).optional(),
});

// Card payment
export const CardPaymentSchema = z.object({
  amount: AmountSchema,
  currency: CurrencySchema.default('XOF'),
  provider: z.enum(['stripe']),
  saveCard: z.boolean().default(false),
});

// Orange Money specific schemas
export const OrangeMoneyInstructionsSchema = z.object({
  reference: z.string(),
  instructions: z.object({
    ussd: z.string(),
    app: z.string(),
    web: z.string(),
  }),
  note: z.string(),
});

export const OrangeMoneyStatusSchema = z.object({
  reference: z.string(),
  status: z.enum(['pending', 'success', 'failed']),
  amount: z.number().optional(),
  currency: z.string().optional(),
  timestamp: z.date(),
});

export const PaymentProvidersSchema = z.object({
  country: z.string(),
  providers: z.array(z.object({
    provider: z.enum(['stripe', 'flutterwave', 'paystack', 'orange_money']),
    methods: z.array(z.string()),
    currencies: z.array(z.string()),
    isDefault: z.boolean(),
  })),
});

export const PaymentMethodsSchema = z.object({
  provider: z.enum(['stripe', 'flutterwave', 'paystack', 'orange_money']),
  methods: z.array(z.string()),
  currencies: z.array(z.string()),
});

export type Payment = z.infer<typeof PaymentSchema>;
export type PaymentIntent = z.infer<typeof PaymentIntentSchema>;
export type CreatePaymentIntentRequest = z.infer<typeof CreatePaymentIntentSchema>;
export type PaymentConfirmation = z.infer<typeof PaymentConfirmationSchema>;
export type Refund = z.infer<typeof RefundSchema>;
export type CreateRefundRequest = z.infer<typeof CreateRefundSchema>;
export type PaymentWebhook = z.infer<typeof PaymentWebhookSchema>;
export type MobileMoneyPayment = z.infer<typeof MobileMoneyPaymentSchema>;
export type CardPayment = z.infer<typeof CardPaymentSchema>;
export type OrangeMoneyInstructions = z.infer<typeof OrangeMoneyInstructionsSchema>;
export type OrangeMoneyStatus = z.infer<typeof OrangeMoneyStatusSchema>;
export type PaymentProviders = z.infer<typeof PaymentProvidersSchema>;
export type PaymentMethods = z.infer<typeof PaymentMethodsSchema>;
