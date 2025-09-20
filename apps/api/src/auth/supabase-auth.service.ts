import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuthResponse } from '@palmera/schemas';

@Injectable()
export class SupabaseAuthService {
  private supabase: SupabaseClient;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key are required');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // We'll handle sessions in our API
      },
    });
  }

  /**
   * Verify Supabase JWT token and get user
   */
  async verifyToken(authHeader: string): Promise<User> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const token = authHeader.substring(7);
    
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid token');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }

  /**
   * Get or create user in our database from Supabase user
   */
  async syncUser(supabaseUser: User) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: supabaseUser.email! },
    });

    if (existingUser) {
      // Update existing user with latest Supabase data
      return await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          email: supabaseUser.email,
          firstName: supabaseUser.user_metadata?.first_name || existingUser.firstName,
          lastName: supabaseUser.user_metadata?.last_name || existingUser.lastName,
          avatar: supabaseUser.user_metadata?.avatar_url || existingUser.avatar,
          // Don't update passwordHash since Supabase handles auth
          updatedAt: new Date(),
        },
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
    } else {
      // Create new user from Supabase data
      return await this.prisma.user.create({
        data: {
          email: supabaseUser.email!,
          firstName: supabaseUser.user_metadata?.first_name || '',
          lastName: supabaseUser.user_metadata?.last_name || '',
          avatar: supabaseUser.user_metadata?.avatar_url || null,
          role: 'CUSTOMER', // Default role
          // No passwordHash - Supabase handles authentication
        },
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
  }

  /**
   * Sign up user with Supabase (for API endpoints)
   */
  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  /**
   * Sign in user with Supabase (for API endpoints)
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return data;
  }

  /**
   * Send magic link via Supabase
   */
  async sendMagicLink(email: string, redirectTo?: string) {
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo || `${this.configService.get('FRONTEND_URL')}/auth/callback`,
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Verify magic link token
   */
  async verifyMagicLink(token: string, type: 'email' | 'sms' = 'email') {
    const { data, error } = await this.supabase.auth.verifyOtp({
      token_hash: token,
      type,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return data;
  }

  /**
   * Sign out user
   */
  async signOut(accessToken: string) {
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Reset password via Supabase
   */
  async resetPassword(email: string, redirectTo?: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${this.configService.get('FRONTEND_URL')}/auth/reset-password`,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update user password via Supabase
   */
  async updatePassword(accessToken: string, newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }
  }
}
