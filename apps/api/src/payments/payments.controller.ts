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
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WebhookVerificationService } from './webhooks/webhook-verification.service';
import {
  CreatePaymentIntentRequest,
  PaymentConfirmation,
  CreateRefundRequest,
  MobileMoneyPayment,
  CardPayment,
} from '@palmera/schemas';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly webhookVerificationService: WebhookVerificationService,
  ) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created successfully' })
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentRequest,
    @Request() req,
  ) {
    return this.paymentsService.createPaymentIntent(createPaymentIntentDto, req.user.id);
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm payment' })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  async confirmPayment(
    @Body() paymentConfirmationDto: PaymentConfirmation,
    @Request() req,
  ) {
    return this.paymentsService.confirmPayment(paymentConfirmationDto, req.user.id);
  }

  @Post('mobile-money')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process mobile money payment' })
  @ApiResponse({ status: 201, description: 'Mobile money payment initiated' })
  async processMobileMoneyPayment(
    @Body() mobileMoneyDto: MobileMoneyPayment,
    @Request() req,
  ) {
    return this.paymentsService.processMobileMoneyPayment(mobileMoneyDto, req.user.id);
  }

  @Post('card')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process card payment' })
  @ApiResponse({ status: 201, description: 'Card payment processed' })
  async processCardPayment(
    @Body() cardPaymentDto: CardPayment,
    @Request() req,
  ) {
    return this.paymentsService.processCardPayment(cardPaymentDto, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  async getPayment(@Param('id') id: string, @Request() req) {
    return this.paymentsService.getPayment(id, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async getPayments(@Request() req, @Param('bookingId') bookingId?: string) {
    return this.paymentsService.getPayments(req.user.id, bookingId);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create refund' })
  @ApiResponse({ status: 201, description: 'Refund created successfully' })
  async createRefund(
    @Body() createRefundDto: CreateRefundRequest,
    @Request() req,
  ) {
    return this.paymentsService.createRefund(createRefundDto, req.user.id);
  }

  @Get('refunds')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get refunds' })
  @ApiResponse({ status: 200, description: 'Refunds retrieved successfully' })
  async getRefunds(@Request() req, @Param('paymentId') paymentId?: string) {
    return this.paymentsService.getRefunds(req.user.id, paymentId);
  }


  @Post('webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async stripeWebhook(@Body() body: any, @Headers() headers: any) {
    const signature = headers['stripe-signature'];
    if (!signature) {
      throw new UnauthorizedException('Missing Stripe signature');
    }

    const isValid = this.webhookVerificationService.verifyWebhook('stripe', body, signature);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Stripe webhook signature');
    }

    return this.paymentsService.handleStripeWebhook(body, headers);
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

    return this.paymentsService.handleFlutterwaveWebhook(body, headers);
  }

  @Post('webhooks/paystack')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paystack webhook handler' })
  async paystackWebhook(@Body() body: any, @Headers() headers: any) {
    const signature = headers['x-paystack-signature'];
    if (!signature) {
      throw new UnauthorizedException('Missing Paystack signature');
    }

    const isValid = this.webhookVerificationService.verifyWebhook('paystack', body, signature);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Paystack webhook signature');
    }

    return this.paymentsService.handlePaystackWebhook(body, headers);
  }

  @Post('webhooks/orange-money')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Orange Money webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleOrangeMoneyWebhook(@Body() body: any, @Headers() headers: any) {
    const signature = headers['x-orange-signature'];
    if (!signature) {
      throw new UnauthorizedException('Missing Orange Money signature');
    }

    const isValid = this.webhookVerificationService.verifyWebhook('orange_money', body, signature);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Orange Money webhook signature');
    }

    return this.paymentsService.handleOrangeMoneyWebhook(body, headers);
  }

  @Get('providers/:country')
  @ApiOperation({ summary: 'Get available payment providers for country' })
  @ApiResponse({ status: 200, description: 'Payment providers retrieved successfully' })
  async getPaymentProviders(@Param('country') country: string) {
    return this.paymentsService.getPaymentProviders(country);
  }

  @Get('methods/:provider')
  @ApiOperation({ summary: 'Get supported payment methods for provider' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully' })
  async getPaymentMethods(@Param('provider') provider: string) {
    return this.paymentsService.getPaymentMethods(provider);
  }

  @Post('orange-money/instructions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Orange Money payment instructions' })
  @ApiResponse({ status: 200, description: 'Payment instructions retrieved successfully' })
  async getOrangeMoneyInstructions(@Body() body: { reference: string }) {
    return this.paymentsService.getOrangeMoneyInstructions(body.reference);
  }

  @Get('orange-money/status/:reference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check Orange Money payment status' })
  @ApiResponse({ status: 200, description: 'Payment status retrieved successfully' })
  async checkOrangeMoneyStatus(@Param('reference') reference: string) {
    return this.paymentsService.checkOrangeMoneyStatus(reference);
  }
}
