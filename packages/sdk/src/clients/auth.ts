import { AxiosInstance } from 'axios';
import {
  LoginRequest,
  RegisterRequest,
  MagicLinkLoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
} from '@palmera/schemas';
import { createApiError } from '../utils/errors';

export class AuthClient {
  constructor(private http: AxiosInstance) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.http.post('/auth/login', credentials);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.http.post('/auth/register', userData);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async requestMagicLink(email: string): Promise<void> {
    try {
      await this.http.post('/auth/magic-link', { email });
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async verifyMagicLink(token: string): Promise<AuthResponse> {
    try {
      const response = await this.http.post('/auth/verify-magic-link', { token });
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await this.http.post('/auth/forgot-password', { email });
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await this.http.post('/auth/reset-password', data);
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await this.http.post('/auth/refresh', { refreshToken });
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.http.post('/auth/logout');
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getProfile(): Promise<any> {
    try {
      const response = await this.http.get('/auth/profile');
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }
}
