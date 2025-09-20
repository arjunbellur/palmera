import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import {
  LoginRequest,
  RegisterRequest,
  MagicLinkLoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  JwtPayload,
} from '@palmera/shared';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterRequest): Promise<AuthResponse> {
    const { email, password, firstName, lastName, phone, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        role,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        membershipTier: user.membershipTier,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && user.passwordHash && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<AuthResponse> {
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        membershipTier: user.membershipTier,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async sendMagicLink(magicLinkDto: MagicLinkLoginRequest): Promise<void> {
    const { email } = magicLinkDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate magic link token
    const token = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' }
    );

    // Send email with magic link
    await this.emailService.sendMagicLink(email, token, user.firstName);
  }

  async verifyMagicLink(token: string): Promise<AuthResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordRequest): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token
    const token = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      { expiresIn: '1h' }
    );

    // Send email with reset link
    await this.emailService.sendPasswordReset(email, token, user.firstName);
  }

  async resetPassword(resetPasswordDto: ResetPasswordRequest): Promise<void> {
    const { token, password } = resetPasswordDto;

    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      const passwordHash = await bcrypt.hash(password, 10);
      
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash },
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        membershipTier: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async logout(userId: string): Promise<void> {
    // TODO: Implement token blacklisting
    console.log(`User ${userId} logged out`);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }
}
