import { AxiosInstance } from 'axios';
import {
  UserProfile,
  UpdateUserProfileRequest,
  ProviderProfile,
  CreateProviderRequest,
  UpdateProviderRequest,
  KycSubmissionRequest,
  MembershipUpgradeRequest,
} from '@palmera/schemas';
import { createApiError } from '../utils/errors';

export class UserClient {
  constructor(private http: AxiosInstance) {}

  async getProfile(): Promise<UserProfile> {
    try {
      const response = await this.http.get('/users/profile');
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async updateProfile(data: UpdateUserProfileRequest): Promise<UserProfile> {
    try {
      const response = await this.http.patch('/users/profile', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getProviderProfile(): Promise<ProviderProfile> {
    try {
      const response = await this.http.get('/users/provider');
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async createProviderProfile(data: CreateProviderRequest): Promise<ProviderProfile> {
    try {
      const response = await this.http.post('/users/provider', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async updateProviderProfile(data: UpdateProviderRequest): Promise<ProviderProfile> {
    try {
      const response = await this.http.patch('/users/provider', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async submitKycDocuments(data: KycSubmissionRequest): Promise<void> {
    try {
      await this.http.post('/users/kyc', data);
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getKycStatus(): Promise<{ status: string; documents: any[] }> {
    try {
      const response = await this.http.get('/users/kyc');
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async upgradeMembership(data: MembershipUpgradeRequest): Promise<{ paymentIntentId: string }> {
    try {
      const response = await this.http.post('/users/membership/upgrade', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getMembershipBenefits(): Promise<any> {
    try {
      const response = await this.http.get('/users/membership/benefits');
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async uploadAvatar(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await this.http.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await this.http.delete('/users/account');
    } catch (error: any) {
      throw createApiError(error);
    }
  }
}
