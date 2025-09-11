import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email.service';

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send email via Resend when provider is resend', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'EMAIL_PROVIDER':
            return 'resend';
          case 'EMAIL_FROM':
            return 'noreply@palmera.app';
          case 'RESEND_API_KEY':
            return 'test-api-key';
          default:
            return undefined;
        }
      });

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'test-email-id' }),
      });
      global.fetch = mockFetch;

      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test HTML</p>',
        text: 'Test Text',
      };

      // Act
      await service.sendEmail(emailOptions);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'test@example.com',
          from: 'noreply@palmera.app',
          subject: 'Test Email',
          html: '<p>Test HTML</p>',
          text: 'Test Text',
        }),
      });
    });

    it('should send email via Postmark when provider is postmark', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'EMAIL_PROVIDER':
            return 'postmark';
          case 'EMAIL_FROM':
            return 'noreply@palmera.app';
          case 'POSTMARK_API_KEY':
            return 'test-postmark-key';
          default:
            return undefined;
        }
      });

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ MessageID: 'test-message-id' }),
      });
      global.fetch = mockFetch;

      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test HTML</p>',
        text: 'Test Text',
      };

      // Act
      await service.sendEmail(emailOptions);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': 'test-postmark-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'test@example.com',
          from: 'noreply@palmera.app',
          subject: 'Test Email',
          html: '<p>Test HTML</p>',
          text: 'Test Text',
        }),
      });
    });

    it('should fallback to console logging when provider is not configured', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'EMAIL_PROVIDER':
            return 'unknown';
          case 'EMAIL_FROM':
            return 'noreply@palmera.app';
          default:
            return undefined;
        }
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test HTML</p>',
        text: 'Test Text',
      };

      // Act
      await service.sendEmail(emailOptions);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Email provider unknown not configured, using console fallback')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('=== EMAIL (Console Fallback) ===')
      );

      consoleSpy.mockRestore();
    });

    it('should throw error when email sending fails', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'EMAIL_PROVIDER':
            return 'resend';
          case 'EMAIL_FROM':
            return 'noreply@palmera.app';
          case 'RESEND_API_KEY':
            return 'test-api-key';
          default:
            return undefined;
        }
      });

      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('API Error'),
      });
      global.fetch = mockFetch;

      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test HTML</p>',
        text: 'Test Text',
      };

      // Act & Assert
      await expect(service.sendEmail(emailOptions)).rejects.toThrow('Failed to send email');
    });
  });

  describe('sendMagicLink', () => {
    it('should send magic link email with correct template', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'EMAIL_PROVIDER':
            return 'resend';
          case 'EMAIL_FROM':
            return 'noreply@palmera.app';
          case 'RESEND_API_KEY':
            return 'test-api-key';
          case 'FRONTEND_URL':
            return 'https://palmera.app';
          default:
            return undefined;
        }
      });

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'test-email-id' }),
      });
      global.fetch = mockFetch;

      // Act
      await service.sendMagicLink('test@example.com', 'test-token', 'John');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"subject":"Your Palmera Magic Link"'),
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.html).toContain('Hi John');
      expect(callBody.html).toContain('https://palmera.app/auth/verify-magic-link?token=test-token');
    });
  });

  describe('sendPasswordReset', () => {
    it('should send password reset email with correct template', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'EMAIL_PROVIDER':
            return 'resend';
          case 'EMAIL_FROM':
            return 'noreply@palmera.app';
          case 'RESEND_API_KEY':
            return 'test-api-key';
          case 'FRONTEND_URL':
            return 'https://palmera.app';
          default:
            return undefined;
        }
      });

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'test-email-id' }),
      });
      global.fetch = mockFetch;

      // Act
      await service.sendPasswordReset('test@example.com', 'test-token', 'John');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"subject":"Reset your Palmera password"'),
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.html).toContain('Hi John');
      expect(callBody.html).toContain('https://palmera.app/auth/password-reset?token=test-token');
    });
  });

  describe('sendBookingConfirmation', () => {
    it('should send booking confirmation email with correct template', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'EMAIL_PROVIDER':
            return 'resend';
          case 'EMAIL_FROM':
            return 'noreply@palmera.app';
          case 'RESEND_API_KEY':
            return 'test-api-key';
          default:
            return undefined;
        }
      });

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'test-email-id' }),
      });
      global.fetch = mockFetch;

      const mockBooking = {
        id: 'booking-123',
        listing: {
          title: 'Luxury Beach Villa',
        },
        startDate: '2024-02-01',
        endDate: '2024-02-03',
        guests: 2,
        totalAmount: 150000,
      };

      // Act
      await service.sendBookingConfirmation('test@example.com', mockBooking, 'John');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"subject":"Booking Confirmed - Luxury Beach Villa"'),
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.html).toContain('Hi John');
      expect(callBody.html).toContain('Luxury Beach Villa');
      expect(callBody.html).toContain('150000 XOF');
    });
  });
});
