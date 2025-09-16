import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { StripeService } from './services/stripe.service';
import { FlutterwaveService } from './services/flutterwave.service';
import { PaystackService } from './services/paystack.service';
import { PaymentRegistryImpl, PaymentProvider } from './registry';
import { OrangeMoneyAdapter } from './adapters/orange-money.adapter';
import {
  CreatePaymentIntentRequest,
  PaymentConfirmation,
  CreateRefundRequest,
  MobileMoneyPayment,
  CardPayment,
  PaymentIntent,
  Payment,
  Refund,
} from '@palmera/schemas';
import * as crypto from 'crypto';
import { Buffer } from 'buffer';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private stripeService: StripeService,
    private flutterwaveService: FlutterwaveService,
    private paystackService: PaystackService,
    @Inject('PaymentRegistry') private paymentRegistry: PaymentRegistryImpl,
    private orangeMoneyAdapter: OrangeMoneyAdapter,
  ) {}

  async createPaymentIntent(
    createPaymentIntentDto: CreatePaymentIntentRequest,
    userId: string,
  ): Promise<PaymentIntent> {
    const { bookingId, amount, currency, method, provider } = createPaymentIntentDto;

    // Verify booking exists and belongs to user
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: userId,
        status: 'PENDING',
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found or not available for payment');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        amount,
        currency,
        method,
        provider: provider as any,
        status: 'PENDING',
      },
    });

    let paymentIntent: PaymentIntent;

    // Use the new registry to get the appropriate adapter
    try {
      const adapter = this.paymentRegistry.getAdapter(provider as PaymentProvider);
      
      // Get customer info for payment
      const customer = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, phone: true, firstName: true, lastName: true },
      });

      const intent = await adapter.createIntent({
        amount,
        currency,
        meta: { paymentId: payment.id, bookingId },
        customer: {
          email: customer?.email,
          phone: customer?.phone,
          name: customer ? `${customer.firstName} ${customer.lastName}` : undefined,
        },
      });

      paymentIntent = {
        id: intent.reference,
        amount: intent.amount,
        currency: intent.currency,
        method,
        provider,
        clientSecret: intent.checkoutUrl,
        expiresAt: intent.expiresAt,
      };
    } catch (error) {
      // Fallback to legacy services for backward compatibility
      switch (provider) {
        case 'stripe':
          paymentIntent = await this.stripeService.createPaymentIntent({
            amount,
            currency,
            metadata: { paymentId: payment.id, bookingId },
          });
          break;
        case 'flutterwave':
          paymentIntent = await this.flutterwaveService.createPaymentIntent({
            amount,
            currency,
            metadata: { paymentId: payment.id, bookingId },
          });
          break;
        case 'paystack':
          paymentIntent = await this.paystackService.createPaymentIntent({
            amount,
            currency,
            metadata: { paymentId: payment.id, bookingId },
          });
          break;
        default:
          throw new BadRequestException('Unsupported payment provider');
      }
    }

    // Update payment with provider ID
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { providerId: paymentIntent.id },
    });

    return paymentIntent;
  }

  async confirmPayment(
    paymentConfirmationDto: PaymentConfirmation,
    userId: string,
  ): Promise<Payment> {
    const { paymentIntentId, providerId, transactionId, metadata } = paymentConfirmationDto;

    // Find payment record
    const payment = await this.prisma.payment.findFirst({
      where: {
        providerId: paymentIntentId,
        booking: { userId: userId },
      },
      include: { booking: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify payment with provider
    let isVerified = false;
    switch (payment.provider) {
      case 'stripe':
        isVerified = await this.stripeService.verifyPayment(paymentIntentId);
        break;
      case 'flutterwave':
        isVerified = await this.flutterwaveService.verifyPayment(paymentIntentId);
        break;
      case 'paystack':
        isVerified = await this.paystackService.verifyPayment(paymentIntentId);
        break;
    }

    if (!isVerified) {
      throw new BadRequestException('Payment verification failed');
    }

    // Update payment status
    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        metadata: metadata,
      },
    });

    // Update booking status
    await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CONFIRMED' },
    });

    return updatedPayment as any;
  }

  async processMobileMoneyPayment(
    mobileMoneyDto: MobileMoneyPayment,
    userId: string,
  ): Promise<PaymentIntent> {
    const { phone, amount, currency, provider, network } = mobileMoneyDto;

    let paymentIntent: PaymentIntent;

    switch (provider) {
      case 'flutterwave':
        paymentIntent = await this.flutterwaveService.processMobileMoney({
          phone,
          amount,
          currency,
          network,
        });
        break;
      case 'paystack':
        paymentIntent = await this.paystackService.processMobileMoney({
          phone,
          amount,
          currency,
          network,
        });
        break;
      default:
        throw new BadRequestException('Mobile money not supported for this provider');
    }

    return paymentIntent;
  }

  async processCardPayment(
    cardPaymentDto: CardPayment,
    userId: string,
  ): Promise<PaymentIntent> {
    const { amount, currency, provider, saveCard } = cardPaymentDto;

    if (provider !== 'stripe') {
      throw new BadRequestException('Card payments only supported via Stripe');
    }

    return this.stripeService.createPaymentIntent({
      amount,
      currency,
      saveCard,
    });
  }

  async getPayment(id: string, userId: string): Promise<Payment> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id,
        booking: { userId: userId },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment as any;
  }

  async getPayments(userId: string, bookingId?: string): Promise<Payment[]> {
    const where: any = {
      booking: { customerId: userId },
    };

    if (bookingId) {
      where.bookingId = bookingId;
    }

    return this.prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    }) as any;
  }

  async createRefund(
    createRefundDto: CreateRefundRequest,
    userId: string,
  ): Promise<Refund> {
    const { paymentId, amount, reason } = createRefundDto;

    const payment = await this.prisma.payment.findFirst({
      where: {
        id: paymentId,
        booking: { userId: userId },
        status: 'COMPLETED',
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found or not eligible for refund');
    }

    const refundAmount = amount || payment.amount;

    // Process refund with provider
    let providerRefundId: string;
    switch (payment.provider) {
      case 'stripe':
        providerRefundId = await this.stripeService.createRefund(
          payment.providerId!,
          refundAmount,
        );
        break;
      case 'flutterwave':
        providerRefundId = await this.flutterwaveService.createRefund(
          payment.providerId!,
          refundAmount,
        );
        break;
      case 'paystack':
        providerRefundId = await this.paystackService.createRefund(
          payment.providerId!,
          refundAmount,
        );
        break;
      default:
        throw new BadRequestException('Refund not supported for this provider');
    }

    // Create refund record
    const refund = await this.prisma.refund.create({
      data: {
        paymentId,
        amount: refundAmount,
        reason,
        status: 'COMPLETED',
        providerRefundId,
      },
    });

    // Update payment status
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' },
    });

    return refund;
  }

  async getRefunds(userId: string, paymentId?: string): Promise<Refund[]> {
    const where: any = {
      payment: { booking: { customerId: userId } },
    };

    if (paymentId) {
      where.paymentId = paymentId;
    }

    return this.prisma.refund.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }


  async handleStripeWebhook(body: any, headers: any): Promise<void> {
    return this.stripeService.handleWebhook(body, headers);
  }

  async handleFlutterwaveWebhook(body: any, headers: any): Promise<void> {
    return this.flutterwaveService.handleWebhook(body, headers);
  }

  async handlePaystackWebhook(body: any, headers: any): Promise<void> {
    return this.paystackService.handleWebhook(body, headers);
  }

  async handleOrangeMoneyWebhook(body: any, headers: any): Promise<void> {
    try {
      const event = this.orangeMoneyAdapter.verifyWebhook(Buffer.from(JSON.stringify(body)), headers);
      
      // Process the verified event
      await this.processPaymentEvent(event);
    } catch (error) {
      console.error('Orange Money webhook error:', error);
      throw error;
    }
  }

  async getPaymentProviders(country: string) {
    const availableProviders = this.paymentRegistry.getAvailableMethods(country);
    
    return {
      country,
      providers: availableProviders.map(provider => ({
        provider: provider.provider,
        methods: provider.methods,
        currencies: provider.currencies,
        isDefault: provider.provider === this.paymentRegistry.getProviderForCountry(country),
      })),
    };
  }

  async getPaymentMethods(provider: string) {
    const adapter = this.paymentRegistry.getAdapter(provider as PaymentProvider);
    
    return {
      provider,
      methods: adapter.getSupportedMethods(),
      currencies: adapter.getSupportedCurrencies(),
    };
  }

  async getOrangeMoneyInstructions(reference: string) {
    const instructions = this.orangeMoneyAdapter.getPaymentInstructions(reference);
    
    return {
      reference,
      instructions: {
        ussd: instructions.ussd,
        app: instructions.app,
        web: instructions.web,
      },
      note: 'Complete payment using any of the methods above. Your booking will be confirmed automatically once payment is received.',
    };
  }

  async checkOrangeMoneyStatus(reference: string) {
    const status = await this.orangeMoneyAdapter.checkPaymentStatus(reference);
    
    return {
      reference,
      status: status.status,
      amount: status.amount,
      currency: status.currency,
      timestamp: new Date(),
    };
  }

  private async processPaymentEvent(event: any): Promise<void> {
    // Find the payment record
    const payment = await this.prisma.payment.findFirst({
      where: { 
        providerId: event.reference,
        provider: event.provider,
      },
      include: { booking: true },
    });

    if (!payment) {
      console.error(`Payment not found for reference: ${event.reference}`);
      return;
    }

    // Update payment status based on event type
    let status = payment.status;
    switch (event.type) {
      case 'payment.success':
        status = 'COMPLETED';
        break;
      case 'payment.failed':
        status = 'FAILED';
        break;
      case 'payment.pending':
        status = 'PENDING';
        break;
      case 'refund.success':
        status = 'REFUNDED';
        break;
      case 'refund.failed':
        // Keep current status
        break;
    }

    // Update payment record
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { 
        status,
        metadata: {
          ...(payment.metadata as any || {}),
          lastWebhookEvent: event,
        },
      },
    });

    // Update booking status if payment is completed
    if (status === 'COMPLETED' && payment.booking) {
      await this.prisma.booking.update({
        where: { id: payment.booking.id },
        data: { status: 'CONFIRMED' },
      });
    }

    // Log the event
    console.log(`Processed ${event.type} event for payment ${event.reference}`);
  }
}
