import { AxiosInstance } from 'axios';
import {
  Listing,
  CreateListingRequest,
  UpdateListingRequest,
  ListingQuery,
  CheckAvailabilityRequest,
  Availability,
} from '@palmera/schemas';
import { createApiError } from '../utils/errors';

export class ListingClient {
  constructor(private http: AxiosInstance) {}

  async getListings(query?: ListingQuery): Promise<{ data: Listing[]; total: number; page: number; limit: number }> {
    try {
      const response = await this.http.get('/listings', { params: query });
      return response.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getListing(id: string): Promise<Listing> {
    try {
      const response = await this.http.get(`/listings/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async createListing(data: CreateListingRequest): Promise<Listing> {
    try {
      const response = await this.http.post('/listings', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async updateListing(id: string, data: UpdateListingRequest): Promise<Listing> {
    try {
      const response = await this.http.patch(`/listings/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async deleteListing(id: string): Promise<void> {
    try {
      await this.http.delete(`/listings/${id}`);
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async checkAvailability(data: CheckAvailabilityRequest): Promise<Availability[]> {
    try {
      const response = await this.http.post('/listings/availability', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getFeaturedListings(city?: string): Promise<Listing[]> {
    try {
      const response = await this.http.get('/listings/featured', {
        params: city ? { city } : undefined,
      });
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async searchListings(query: string, filters?: any): Promise<Listing[]> {
    try {
      const response = await this.http.get('/listings/search', {
        params: { q: query, ...filters },
      });
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await this.http.get('/listings/categories');
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getCities(): Promise<string[]> {
    try {
      const response = await this.http.get('/listings/cities');
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }
}
