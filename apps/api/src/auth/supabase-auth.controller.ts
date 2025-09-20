import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthService } from './supabase-auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { AuthResponse } from '@palmera/schemas';

@ApiTags('Supabase Authentication')
@Controller('auth/supabase')
export class SupabaseAuthController {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up with email and password via Supabase' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async signUp(
    @Body() signUpDto: { email: string; password: string; metadata?: any },
  ) {
    const { data } = await this.supabaseAuthService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.metadata,
    );

    return {
      message: 'User registered successfully. Please check your email for verification.',
      user: data.user,
    };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password via Supabase' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async signIn(@Body() signInDto: { email: string; password: string }) {
    const { data } = await this.supabaseAuthService.signIn(
      signInDto.email,
      signInDto.password,
    );

    return {
      message: 'Login successful',
      user: data.user,
      session: data.session,
    };
  }

  @Post('magic-link')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send magic link via Supabase' })
  @ApiResponse({ status: 200, description: 'Magic link sent successfully' })
  async sendMagicLink(@Body() magicLinkDto: { email: string }) {
    await this.supabaseAuthService.sendMagicLink(magicLinkDto.email);
    
    return {
      message: 'Magic link sent to your email',
    };
  }

  @Post('verify-magic-link')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify magic link token' })
  @ApiResponse({ status: 200, description: 'Magic link verified successfully' })
  async verifyMagicLink(@Body() verifyDto: { token: string }) {
    const { data } = await this.supabaseAuthService.verifyMagicLink(verifyDto.token);

    return {
      message: 'Magic link verified successfully',
      user: data.user,
      session: data.session,
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password reset email via Supabase' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async resetPassword(@Body() resetDto: { email: string }) {
    await this.supabaseAuthService.resetPassword(resetDto.email);
    
    return {
      message: 'Password reset email sent',
    };
  }

  @Post('update-password')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user password via Supabase' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  async updatePassword(
    @Request() req,
    @Body() updateDto: { newPassword: string },
  ) {
    await this.supabaseAuthService.updatePassword(
      req.headers.authorization,
      updateDto.newPassword,
    );

    return {
      message: 'Password updated successfully',
    };
  }

  @Post('signout')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign out user via Supabase' })
  @ApiResponse({ status: 200, description: 'Sign out successful' })
  async signOut(@Request() req) {
    await this.supabaseAuthService.signOut(req.headers.authorization);
    
    return {
      message: 'Signed out successfully',
    };
  }

  @Get('profile')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile (Supabase authenticated)' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getProfile(@Request() req) {
    return req.user;
  }
}
