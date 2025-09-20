import { z } from 'zod';

// Group Role Enum
export const GroupRoleSchema = z.enum(['OWNER', 'PAYER', 'MEMBER']);
export type GroupRole = z.infer<typeof GroupRoleSchema>;

// Invite Status Enum
export const InviteStatusSchema = z.enum(['INVITED', 'ACCEPTED', 'DECLINED']);
export type InviteStatus = z.infer<typeof InviteStatusSchema>;

// Contribution Status Enum
export const ContributionStatusSchema = z.enum(['PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED']);
export type ContributionStatus = z.infer<typeof ContributionStatusSchema>;

// Create Group Request
export const CreateGroupRequestSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
});
export type CreateGroupRequest = z.infer<typeof CreateGroupRequestSchema>;

// Update Group Request
export const UpdateGroupRequestSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
});
export type UpdateGroupRequest = z.infer<typeof UpdateGroupRequestSchema>;

// Invite Member Request
export const InviteMemberRequestSchema = z.object({
  email: z.string().email(),
  role: GroupRoleSchema.default('MEMBER'),
});
export type InviteMemberRequest = z.infer<typeof InviteMemberRequestSchema>;

// Respond to Invite Request
export const RespondToInviteRequestSchema = z.object({
  accept: z.boolean(),
});
export type RespondToInviteRequest = z.infer<typeof RespondToInviteRequestSchema>;

// Send Message Request
export const SendMessageRequestSchema = z.object({
  message: z.string().min(1).max(1000),
});
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;

// Group Chat Message
export const GroupChatMessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  message: z.string(),
  timestamp: z.date(),
});
export type GroupChatMessage = z.infer<typeof GroupChatMessageSchema>;

// Group Member
export const GroupMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  role: GroupRoleSchema,
  status: InviteStatusSchema,
  invitedAt: z.date(),
  joinedAt: z.date().nullable(),
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
  }),
});
export type GroupMember = z.infer<typeof GroupMemberSchema>;

// Group
export const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  ownerId: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  owner: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
  }),
  members: z.array(GroupMemberSchema),
  chatThread: z.array(GroupChatMessageSchema).nullable(),
  preferences: z.record(z.any()).nullable(),
  _count: z.object({
    bookings: z.number(),
  }).optional(),
});
export type Group = z.infer<typeof GroupSchema>;

// Order Contribution
export const OrderContributionSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  userId: z.string(),
  amount: z.number(),
  status: ContributionStatusSchema,
  paymentIntentId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});
export type OrderContribution = z.infer<typeof OrderContributionSchema>;

// Group Payment Request
export const GroupPaymentRequestSchema = z.object({
  bookingId: z.string(),
  contributions: z.array(z.object({
    userId: z.string(),
    amount: z.number(),
  })),
});
export type GroupPaymentRequest = z.infer<typeof GroupPaymentRequestSchema>;

// Group Payment Response
export const GroupPaymentResponseSchema = z.object({
  bookingId: z.string(),
  groupId: z.string(),
  totalAmount: z.number(),
  contributions: z.array(z.object({
    userId: z.string(),
    paymentIntentId: z.string(),
    clientSecret: z.string(),
    amount: z.number(),
  })),
});
export type GroupPaymentResponse = z.infer<typeof GroupPaymentResponseSchema>;
