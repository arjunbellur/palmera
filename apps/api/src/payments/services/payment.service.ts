import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaymentAdapter } from '../interfaces/payment-adapter.interface';
import { FlutterwaveAdapter } from '../adapters/flutterwave.adapter';

interface CreatePaymentDto {
  bookingId: string;
  provider: string;
  method: string;
  amount: number;
  currency?: string;
  customer: {
    email: string;
    phone?: string;
    name?: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResult {
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
  private readonly providers = new Map<string, PaymentAdapter>();

  constructor(
    private prisma: PrismaService,
    private flutterwaveAdapter: FlutterwaveAdapter,
  ) {
    this.registerProvider('flutterwave', this.flutterwaveAdapter);
  }

  private registerProvider(name: string, provider: PaymentAdapter): void {
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
      // Create payment intent with provider
      const paymentIntent = await provider.createIntent({
        amount: dto.amount,
        currency: dto.currency || 'XOF',
        customer: dto.customer,
        meta: {
          ...dto.metadata,
          method: dto.method,
          bookingId: dto.bookingId,
        },
      });

      // Create payment record in database
      const payment = await this.prisma.payment.create({
        data: {
          bookingId: dto.bookingId,
          provider: dto.provider as any,
          method: dto.method as any,
          amount: dto.amount,
          currency: dto.currency || 'XOF',
          status: 'INITIATED',
          reference: paymentIntent.reference,
          raw: {
            intent: paymentIntent as any,
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
        redirectUrl: paymentIntent.checkoutUrl,
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

    // For now, just return the payment as-is
    // In a real implementation, you would verify with the provider
    this.logger.log(`Payment verification requested for: ${payment.id}`);

    return {
      id: payment.id,
      reference: payment.reference,
      status: payment.status,
    };
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
      const refundResult = await provider.refund(payment.reference, amount);

      // Create refund record
      const refund = await this.prisma.refund.create({
        data: {
          paymentId,
          amount: amount || payment.amount,
          reason: reason || 'Customer request',
          status: refundResult.status === 'success' ? 'COMPLETED' : 'PENDING',
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
    return ['card', 'mobilemoney'];
  }
}
