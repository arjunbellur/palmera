import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { SupabaseAuthController } from './supabase-auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthService } from './supabase-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SupabaseJwtStrategy } from './strategies/supabase-jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PassportModule,
    EmailModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const authProvider = configService.get<string>('AUTH_PROVIDER', 'jwt');
        
        // Only register JWT module if using JWT auth
        if (authProvider === 'jwt') {
          return {
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
            },
          };
        }
        
        return {}; // Empty config for Supabase auth
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, SupabaseAuthController],
  providers: [
    AuthService,
    SupabaseAuthService,
    JwtStrategy,
    SupabaseJwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService, SupabaseAuthService],
})
export class AuthModule {}
