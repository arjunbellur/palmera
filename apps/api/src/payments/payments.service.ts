import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { StripeService } from './services/stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async createPaymentIntent(bookingId: string, amount: number, currency = 'usd') {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, listing: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Create Stripe payment intent
    const paymentIntent = await this.stripeService.createPaymentIntent({
      amount: amount * 100, // Convert to cents
      currency,
      metadata: {
        bookingId,
        userId: booking.userId,
        listingId: booking.experienceId,
      },
    });

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        provider: 'stripe',
        method: 'CARD',
        amount: amount * 100,
        currency: currency.toUpperCase(),
        status: 'INITIATED',
        reference: paymentIntent.id,
        providerId: paymentIntent.id,
        metadata: {
          clientSecret: paymentIntent.client_secret,
        },
      },
    });

    return {
      paymentId: payment.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  }

  async confirmPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await this.stripeService.retrievePaymentIntent(payment.providerId!);

    let status = 'PENDING';
    if (paymentIntent.status === 'succeeded') {
      status = 'CONFIRMED';
    } else if (paymentIntent.status === 'payment_failed') {
      status = 'FAILED';
    }

    // Update payment status
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        raw: paymentIntent,
      },
    });

    // Update booking status if payment succeeded
    if (status === 'CONFIRMED') {
    await this.prisma.booking.update({
      where: { id: payment.bookingId },
        data: { status: 'confirmed' },
      });
    }

    return updatedPayment;
  }

  async createGroupPaymentIntent(bookingId: string, contributions: Array<{ userId: string; amount: number }>) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { group: true, listing: true },
    });

    if (!booking || !booking.group) {
      throw new BadRequestException('Group booking not found');
    }

    const totalAmount = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);

    // Create payment intents for each contributor
    const paymentIntents = await Promise.all(
      contributions.map(async (contrib) => {
        const user = await this.prisma.user.findUnique({ where: { id: contrib.userId } });
        if (!user) throw new NotFoundException(`User ${contrib.userId} not found`);

        const paymentIntent = await this.stripeService.createPaymentIntent({
          amount: contrib.amount * 100, // Convert to cents
          currency: 'usd',
          metadata: {
            bookingId,
            userId: contrib.userId,
            groupId: booking.groupId!,
            contributionAmount: contrib.amount.toString(),
          },
        });

        // Create contribution record
        await this.prisma.orderContribution.create({
          data: {
            bookingId,
            userId: contrib.userId,
            amount: contrib.amount * 100,
            status: 'PENDING',
            paymentIntentId: paymentIntent.id,
          },
        });

        return {
          userId: contrib.userId,
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          amount: contrib.amount,
        };
      })
    );

    return {
      bookingId,
      groupId: booking.groupId,
      totalAmount,
      contributions: paymentIntents,
    };
  }

  async confirmGroupPayment(bookingId: string) {
    const contributions = await this.prisma.orderContribution.findMany({
      where: { bookingId },
      include: { user: true },
    });

    if (contributions.length === 0) {
      throw new NotFoundException('No contributions found for this booking');
    }

    // Check all payment intents
    const updatedContributions = await Promise.all(
      contributions.map(async (contrib) => {
        if (!contrib.paymentIntentId) return contrib;

        const paymentIntent = await this.stripeService.retrievePaymentIntent(contrib.paymentIntentId);
        
        let status: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' = 'PENDING';
        if (paymentIntent.status === 'succeeded') {
          status = 'CAPTURED';
        } else if (paymentIntent.status === 'payment_failed') {
          status = 'FAILED';
        }

        return await this.prisma.orderContribution.update({
          where: { id: contrib.id },
          data: { status },
        });
      })
    );

    // Check if all contributions are captured
    const allCaptured = updatedContributions.every(contrib => contrib.status === 'CAPTURED');
    const anyFailed = updatedContributions.some(contrib => contrib.status === 'FAILED');

    if (allCaptured) {
      // Update booking status
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'confirmed' },
      });
    } else if (anyFailed) {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'cancelled' },
      });
    }

    return {
      bookingId,
      contributions: updatedContributions,
      allCaptured,
      anyFailed,
    };
  }

  async getPaymentHistory(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: {
        booking: { userId },
      },
      include: {
        booking: {
          include: { listing: { select: { title: true, city: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return payments;
  }

  async refundPayment(paymentId: string, amount?: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || !payment.providerId) {
      throw new NotFoundException('Payment not found');
    }

    // Create refund in Stripe
    const refund = await this.stripeService.createRefund({
      paymentIntent: payment.providerId,
      amount: amount ? amount * 100 : undefined, // Convert to cents or full refund
    });

    // Create refund record
    const refundRecord = await this.prisma.refund.create({
      data: {
        paymentId,
        amount: refund.amount,
        reason: 'Customer request',
        status: 'COMPLETED',
        providerRefundId: refund.id,
      },
    });

    return refundRecord;
  }

  // Webhook handler for Stripe
  async handleStripeWebhook(event: any) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(paymentIntent: any) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerId: paymentIntent.id },
    });

    if (payment) {
    await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'CONFIRMED' },
      });

      // Update booking status
      await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'confirmed' },
      });
    }

    // Handle group contribution if applicable
    const contribution = await this.prisma.orderContribution.findFirst({
      where: { paymentIntentId: paymentIntent.id },
    });

    if (contribution) {
      await this.prisma.orderContribution.update({
        where: { id: contribution.id },
        data: { status: 'CAPTURED' },
      });
    }
  }

  private async handlePaymentFailed(paymentIntent: any) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerId: paymentIntent.id },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
    }

    // Handle group contribution if applicable
    const contribution = await this.prisma.orderContribution.findFirst({
      where: { paymentIntentId: paymentIntent.id },
    });

    if (contribution) {
      await this.prisma.orderContribution.update({
        where: { id: contribution.id },
        data: { status: 'FAILED' },
      });
    }
  }
}