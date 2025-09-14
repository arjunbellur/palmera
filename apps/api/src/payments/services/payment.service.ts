import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaymentProvider } from '../interfaces/payment-provider.interface';
import { FlutterwaveAdapter } from '../adapters/flutterwave.adapter';
import { PaymentProviderType, PaymentMethod } from '../interfaces/payment-provider.interface';

interface CreatePaymentDto {
  bookingId: string;
  provider: PaymentProviderType;
  method: PaymentMethod;
  amount: number;
  currency?: string;
  customer: {
    email: string;
    phone?: string;
    name?: string;
  };
  metadata?: Record<string, any>;
}

interface PaymentResult {
  id: string;
  reference: string;
  status: string;
  redirectUrl?: string;
  qrCode?: string;
  instructions?: string;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly providers = new Map<string, PaymentProvider>();

  constructor(
    private prisma: PrismaService,
    private flutterwaveAdapter: FlutterwaveAdapter,
  ) {
    this.registerProvider(PaymentProviderType.FLUTTERWAVE, this.flutterwaveAdapter);
  }

  private registerProvider(name: string, provider: PaymentProvider): void {
    this.providers.set(name, provider);
    this.logger.log(`Registered payment provider: ${name}`);
  }

  async createPayment(dto: CreatePaymentDto): Promise<PaymentResult> {
    // Verify booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if booking is in correct state for payment
    if (booking.status !== 'draft' && booking.status !== 'pending_payment') {
      throw new BadRequestException('Booking is not in a valid state for payment');
    }

    // Generate unique reference
    const reference = `palmera_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get payment provider
    const provider = this.providers.get(dto.provider);
    if (!provider) {
      throw new BadRequestException(`Payment provider ${dto.provider} not supported`);
    }

    try {
      // Initiate payment with provider
      const paymentResponse = await provider.initiatePayment({
        amount: dto.amount,
        currency: dto.currency || 'XOF',
        reference,
        customer: dto.customer,
        metadata: {
          ...dto.metadata,
          method: dto.method,
          bookingId: dto.bookingId,
        },
      });

      if (!paymentResponse.success) {
        throw new BadRequestException(paymentResponse.error || 'Payment initiation failed');
      }

      // Create payment record in database
      const payment = await this.prisma.payment.create({
        data: {
          bookingId: dto.bookingId,
          provider: dto.provider,
          method: dto.method,
          amount: dto.amount,
          currency: dto.currency || 'XOF',
          status: 'INITIATED',
          reference: paymentResponse.reference,
          raw: {
            providerReference: paymentResponse.providerReference,
            response: paymentResponse,
          },
        },
      });

      // Update booking status
      await this.prisma.booking.update({
        where: { id: dto.bookingId },
        data: { status: 'pending_payment' },
      });

      this.logger.log(`Payment created successfully: ${payment.id}`);

      return {
        id: payment.id,
        reference: payment.reference,
        status: payment.status,
        redirectUrl: paymentResponse.redirectUrl,
        qrCode: paymentResponse.qrCode,
        instructions: paymentResponse.instructions,
      };
    } catch (error) {
      this.logger.error(`Payment creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async verifyPayment(reference: string): Promise<PaymentResult> {
    const payment = await this.prisma.payment.findUnique({
      where: { reference },
      include: { refunds: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Get payment provider
    const provider = this.providers.get(payment.provider);
    if (!provider) {
      throw new BadRequestException(`Payment provider ${payment.provider} not supported`);
    }

    try {
      // Verify payment with provider
      const verification = await provider.verifyPayment(reference);

      if (!verification.success) {
        throw new BadRequestException(verification.error || 'Payment verification failed');
      }

      // Update payment status
      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: verification.status,
          raw: {
            ...(payment.raw as any),
            verification,
            lastVerified: new Date().toISOString(),
          },
        },
      });

      // Update booking status if payment is confirmed
      if (verification.status === 'CONFIRMED') {
        await this.prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: 'confirmed' },
        });
      }

      this.logger.log(`Payment verified successfully: ${payment.id}`);

      return {
        id: payment.id,
        reference: payment.reference,
        status: updatedPayment.status,
      };
    } catch (error) {
      this.logger.error(`Payment verification failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getPaymentById(id: string): Promise<any> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { refunds: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPaymentByReference(reference: string): Promise<any> {
    const payment = await this.prisma.payment.findUnique({
      where: { reference },
      include: { refunds: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<any> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'CONFIRMED') {
      throw new BadRequestException('Only confirmed payments can be refunded');
    }

    // Get payment provider
    const provider = this.providers.get(payment.provider);
    if (!provider) {
      throw new BadRequestException(`Payment provider ${payment.provider} not supported`);
    }

    try {
      // Process refund with provider
      const refundResult = await provider.refundPayment(paymentId, amount);

      if (!refundResult.success) {
        throw new BadRequestException(refundResult.error || 'Refund failed');
      }

      // Create refund record
      const refund = await this.prisma.refund.create({
        data: {
          paymentId,
          amount: amount || payment.amount,
          reason: reason || 'Customer request',
          status: 'PENDING',
          providerRefundId: refundResult.refundId,
        },
      });

      // Update payment status if full refund
      if (!amount || amount >= payment.amount) {
        await this.prisma.payment.update({
          where: { id: paymentId },
          data: { status: 'REFUNDED' },
        });
      }

      this.logger.log(`Refund created successfully: ${refund.id}`);

      return refund;
    } catch (error) {
      this.logger.error(`Refund failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  getSupportedProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getSupportedMethods(): string[] {
    return Object.values(PaymentMethod);
  }
}
