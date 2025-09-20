import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { SupabaseAuthService } from '../supabase-auth.service';

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy, 'supabase-jwt') {
  constructor(private supabaseAuthService: SupabaseAuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    try {
      // Verify token with Supabase
      const supabaseUser = await this.supabaseAuthService.verifyToken(authHeader);
      
      // Sync user with our database
      const user = await this.supabaseAuthService.syncUser(supabaseUser);
      
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
