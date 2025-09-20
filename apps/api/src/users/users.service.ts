import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  UpdateUserProfileRequest,
  CreateProviderRequest,
  UpdateProviderRequest,
  KycSubmissionRequest,
  MembershipUpgradeRequest,
} from '@palmera/shared';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        isActive: true,
        membershipTier: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(updateProfileDto: UpdateUserProfileRequest, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateProfileDto,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        isActive: true,
        membershipTier: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getProviderProfile(userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            kycStatus: true,
          },
        },
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return provider;
  }

  async createProviderProfile(createProviderDto: CreateProviderRequest, userId: string) {
    // Check if user is already a provider
    const existingProvider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (existingProvider) {
      throw new BadRequestException('User is already a provider');
    }

    // Update user role to provider
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'PROVIDER' },
    });

    // Create provider profile
    const provider = await this.prisma.provider.create({
      data: {
        ...createProviderDto,
        user: {
          connect: { id: userId }
        }
      } as any,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            kycStatus: true,
          },
        },
      },
    });

    return provider;
  }

  async updateProviderProfile(updateProviderDto: UpdateProviderRequest, userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.prisma.provider.update({
      where: { userId },
      data: updateProviderDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            kycStatus: true,
          },
        },
      },
    });
  }

  async submitKycDocuments(kycSubmissionDto: KycSubmissionRequest, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user with KYC documents and status
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        kycDocuments: kycSubmissionDto,
        kycStatus: 'PENDING',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        kycStatus: true,
        kycDocuments: true,
      },
    });
  }

  async getKycStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        kycStatus: true,
        kycDocuments: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: user.kycStatus,
      documents: user.kycDocuments || [],
    };
  }

  async upgradeMembership(membershipUpgradeDto: MembershipUpgradeRequest, userId: string) {
    const { tier, paymentMethod } = membershipUpgradeDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.membershipTier === tier) {
      throw new BadRequestException('User already has this membership tier');
    }

    // In a real implementation, you would create a payment intent for the membership upgrade
    // For now, we'll just return a mock payment intent ID
    const paymentIntentId = `membership_${userId}_${Date.now()}`;

    return {
      paymentIntentId,
      tier,
      amount: tier === 'GOLD' ? 50000 : 0, // 50,000 XOF for Gold membership
      currency: 'XOF',
    };
  }

  async getMembershipBenefits(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        membershipTier: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const benefits = {
      STANDARD: {
        name: 'Standard',
        features: [
          'Basic booking access',
          'Standard customer support',
          'Standard commission rates',
        ],
        commissionDiscount: 0,
        earlyBookingWindow: 0,
        conciergePriority: false,
      },
      GOLD: {
        name: 'Gold',
        features: [
          'Early booking access (24h advance)',
          'Priority concierge support',
          '5% commission discount',
          'Exclusive experiences',
          'Priority customer support',
        ],
        commissionDiscount: 0.05,
        earlyBookingWindow: 24,
        conciergePriority: true,
      },
    };

    return benefits[user.membershipTier];
  }

  async uploadAvatar(file: any, userId: string) {
    // In a real implementation, you would upload the file to S3 or similar storage
    // For now, we'll just return a mock URL
    const avatarUrl = `https://palmera-uploads.s3.amazonaws.com/avatars/${userId}_${Date.now()}.jpg`;

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    return { url: avatarUrl };
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has any active bookings
    const activeBookings = await this.prisma.booking.findMany({
      where: {
        userId: userId,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (activeBookings.length > 0) {
      throw new BadRequestException('Cannot delete account with active bookings');
    }

    // Soft delete by deactivating the user
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return { message: 'Account deleted successfully' };
  }
}
