import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './services/payment.service';
import { PaymentResult } from './services/payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WebhookVerificationService } from './webhooks/webhook-verification.service';
// Remove the old interface imports since we're using the adapter pattern now

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly webhookVerificationService: WebhookVerificationService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async createPayment(
    @Body() body: {
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
    },
    @Request() req,
  ): Promise<PaymentResult> {
    return this.paymentService.createPayment(body);
  }

  @Get('verify/:reference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify payment' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  async verifyPayment(@Param('reference') reference: string): Promise<PaymentResult> {
    return this.paymentService.verifyPayment(reference);
  }

  @Get('payment/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  async getPayment(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @Get('reference/:reference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by reference' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  async getPaymentByReference(@Param('reference') reference: string) {
    return this.paymentService.getPaymentByReference(reference);
  }

  @Post('refund/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create refund' })
  @ApiResponse({ status: 201, description: 'Refund created successfully' })
  async createRefund(
    @Param('paymentId') paymentId: string,
    @Body() body: { amount?: number; reason?: string },
  ) {
    return this.paymentService.refundPayment(paymentId, body.amount, body.reason);
  }


  @Post('webhooks/flutterwave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Flutterwave webhook handler' })
  async flutterwaveWebhook(@Body() body: any, @Headers() headers: any) {
    const signature = headers['verif-hash'];
    if (!signature) {
      throw new UnauthorizedException('Missing Flutterwave signature');
    }

    const isValid = this.webhookVerificationService.verifyWebhook('flutterwave', body, signature);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Flutterwave webhook signature');
    }

    // Handle Flutterwave webhook
    return { status: 'success', message: 'Webhook processed' };
  }


  @Get('providers')
  @ApiOperation({ summary: 'Get supported payment providers' })
  @ApiResponse({ status: 200, description: 'Payment providers retrieved successfully' })
  async getSupportedProviders() {
    return {
      providers: this.paymentService.getSupportedProviders(),
      methods: this.paymentService.getSupportedMethods(),
    };
  }

}
