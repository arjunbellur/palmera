import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly provider: string;

  constructor(private configService: ConfigService) {
    this.fromEmail = this.configService.get<string>('EMAIL_FROM', 'noreply@palmera.app');
    this.provider = this.configService.get<string>('EMAIL_PROVIDER', 'resend');
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const emailData = {
        to: options.to,
        from: options.from || this.fromEmail,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      switch (this.provider) {
        case 'resend':
          await this.sendViaResend(emailData);
          break;
        case 'postmark':
          await this.sendViaPostmark(emailData);
          break;
        case 'ses':
          await this.sendViaSES(emailData);
          break;
        default:
          this.logger.warn(`Email provider ${this.provider} not configured, using console fallback`);
          this.logToConsole(emailData);
      }

      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }

  async sendMagicLink(email: string, token: string, firstName?: string): Promise<void> {
    const magicLinkUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/verify-magic-link?token=${token}`;
    
    const template = this.getMagicLinkTemplate(magicLinkUrl, firstName);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendPasswordReset(email: string, token: string, firstName?: string): Promise<void> {
    const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/password-reset?token=${token}`;
    
    const template = this.getPasswordResetTemplate(resetUrl, firstName);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendBookingConfirmation(email: string, booking: any, firstName?: string): Promise<void> {
    const template = this.getBookingConfirmationTemplate(booking, firstName);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendBookingCancellation(email: string, booking: any, firstName?: string): Promise<void> {
    const template = this.getBookingCancellationTemplate(booking, firstName);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendPayoutNotification(email: string, payout: any, firstName?: string): Promise<void> {
    const template = this.getPayoutNotificationTemplate(payout, firstName);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  private async sendViaResend(emailData: any): Promise<void> {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }
  }

  private async sendViaPostmark(emailData: any): Promise<void> {
    const postmarkApiKey = this.configService.get<string>('POSTMARK_API_KEY');
    if (!postmarkApiKey) {
      throw new Error('POSTMARK_API_KEY not configured');
    }

    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': postmarkApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Postmark API error: ${error}`);
    }
  }

  private async sendViaSES(emailData: any): Promise<void> {
    // TODO: Implement AWS SES integration
    this.logger.warn('AWS SES integration not implemented yet');
    this.logToConsole(emailData);
  }

  private logToConsole(emailData: any): void {
    this.logger.log('=== EMAIL (Console Fallback) ===');
    this.logger.log(`To: ${emailData.to}`);
    this.logger.log(`From: ${emailData.from}`);
    this.logger.log(`Subject: ${emailData.subject}`);
    this.logger.log(`Text: ${emailData.text}`);
    this.logger.log('===============================');
  }

  private getMagicLinkTemplate(magicLinkUrl: string, firstName?: string): EmailTemplate {
    const greeting = firstName ? `Hi ${firstName}` : 'Hello';
    
    return {
      subject: 'Your Palmera Magic Link',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Magic Link</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1C5E3C; font-size: 32px; margin: 0;">🌴 Palmera</h1>
            <p style="color: #666; font-size: 16px; margin: 5px 0 0 0;">Premium experiences for Africa</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #1C5E3C; margin-top: 0;">${greeting}!</h2>
            <p>Click the button below to sign in to your Palmera account:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLinkUrl}" 
                 style="background: #1C5E3C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Sign In to Palmera
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
              ${magicLinkUrl}
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        ${greeting}!
        
        Click the link below to sign in to your Palmera account:
        
        ${magicLinkUrl}
        
        This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.
        
        Best regards,
        The Palmera Team
      `,
    };
  }

  private getPasswordResetTemplate(resetUrl: string, firstName?: string): EmailTemplate {
    const greeting = firstName ? `Hi ${firstName}` : 'Hello';
    
    return {
      subject: 'Reset your Palmera password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1C5E3C; font-size: 32px; margin: 0;">🌴 Palmera</h1>
            <p style="color: #666; font-size: 16px; margin: 5px 0 0 0;">Premium experiences for Africa</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #1C5E3C; margin-top: 0;">${greeting}!</h2>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #1C5E3C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
              ${resetUrl}
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        ${greeting}!
        
        We received a request to reset your password. Click the link below to set a new password:
        
        ${resetUrl}
        
        This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
        
        Best regards,
        The Palmera Team
      `,
    };
  }

  private getBookingConfirmationTemplate(booking: any, firstName?: string): EmailTemplate {
    const greeting = firstName ? `Hi ${firstName}` : 'Hello';
    
    return {
      subject: `Booking Confirmed - ${booking.listing.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1C5E3C; font-size: 32px; margin: 0;">🌴 Palmera</h1>
            <p style="color: #666; font-size: 16px; margin: 5px 0 0 0;">Premium experiences for Africa</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #1C5E3C; margin-top: 0;">${greeting}!</h2>
            <p>Your booking has been confirmed! Here are the details:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1C5E3C;">${booking.listing.title}</h3>
              <p><strong>Date:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> ${booking.guests}</p>
              <p><strong>Total:</strong> ${booking.totalAmount} XOF</p>
            </div>
            
            <p>We're excited to provide you with an amazing experience!</p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Questions? Contact us at support@palmera.app</p>
          </div>
        </body>
        </html>
      `,
      text: `
        ${greeting}!
        
        Your booking has been confirmed! Here are the details:
        
        Experience: ${booking.listing.title}
        Date: ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}
        Guests: ${booking.guests}
        Total: ${booking.totalAmount} XOF
        
        We're excited to provide you with an amazing experience!
        
        Questions? Contact us at support@palmera.app
        
        Best regards,
        The Palmera Team
      `,
    };
  }

  private getBookingCancellationTemplate(booking: any, firstName?: string): EmailTemplate {
    const greeting = firstName ? `Hi ${firstName}` : 'Hello';
    
    return {
      subject: `Booking Cancelled - ${booking.listing.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Cancelled</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1C5E3C; font-size: 32px; margin: 0;">🌴 Palmera</h1>
            <p style="color: #666; font-size: 16px; margin: 5px 0 0 0;">Premium experiences for Africa</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #1C5E3C; margin-top: 0;">${greeting}!</h2>
            <p>Your booking has been cancelled. Here are the details:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1C5E3C;">${booking.listing.title}</h3>
              <p><strong>Date:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> ${booking.guests}</p>
              <p><strong>Refund:</strong> ${booking.refundAmount || 0} XOF</p>
            </div>
            
            <p>We hope to see you again soon for another amazing experience!</p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Questions? Contact us at support@palmera.app</p>
          </div>
        </body>
        </html>
      `,
      text: `
        ${greeting}!
        
        Your booking has been cancelled. Here are the details:
        
        Experience: ${booking.listing.title}
        Date: ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}
        Guests: ${booking.guests}
        Refund: ${booking.refundAmount || 0} XOF
        
        We hope to see you again soon for another amazing experience!
        
        Questions? Contact us at support@palmera.app
        
        Best regards,
        The Palmera Team
      `,
    };
  }

  private getPayoutNotificationTemplate(payout: any, firstName?: string): EmailTemplate {
    const greeting = firstName ? `Hi ${firstName}` : 'Hello';
    
    return {
      subject: 'Payout Processed - Palmera',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payout Processed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1C5E3C; font-size: 32px; margin: 0;">🌴 Palmera</h1>
            <p style="color: #666; font-size: 16px; margin: 5px 0 0 0;">Premium experiences for Africa</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #1C5E3C; margin-top: 0;">${greeting}!</h2>
            <p>Your payout has been processed successfully!</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Amount:</strong> ${payout.amount} XOF</p>
              <p><strong>Reference:</strong> ${payout.reference}</p>
              <p><strong>Date:</strong> ${new Date(payout.processedAt).toLocaleDateString()}</p>
            </div>
            
            <p>Thank you for being a valued Palmera provider!</p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Questions? Contact us at support@palmera.app</p>
          </div>
        </body>
        </html>
      `,
      text: `
        ${greeting}!
        
        Your payout has been processed successfully!
        
        Amount: ${payout.amount} XOF
        Reference: ${payout.reference}
        Date: ${new Date(payout.processedAt).toLocaleDateString()}
        
        Thank you for being a valued Palmera provider!
        
        Questions? Contact us at support@palmera.app
        
        Best regards,
        The Palmera Team
      `,
    };
  }
}
