import { AxiosInstance } from 'axios';
import {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewQuery,
  ReviewSummary,
} from '@palmera/schemas';
import { createApiError } from '../utils/errors';

export class ReviewClient {
  constructor(private http: AxiosInstance) {}

  async getReviews(query?: ReviewQuery): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    try {
      const response = await this.http.get('/reviews', { params: query });
      return response.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getReview(id: string): Promise<Review> {
    try {
      const response = await this.http.get(`/reviews/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async createReview(data: CreateReviewRequest): Promise<Review> {
    try {
      const response = await this.http.post('/reviews', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async updateReview(id: string, data: UpdateReviewRequest): Promise<Review> {
    try {
      const response = await this.http.patch(`/reviews/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      await this.http.delete(`/reviews/${id}`);
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getListingReviews(listingId: string, query?: ReviewQuery): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    try {
      const response = await this.http.get(`/listings/${listingId}/reviews`, { params: query });
      return response.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getListingReviewSummary(listingId: string): Promise<ReviewSummary> {
    try {
      const response = await this.http.get(`/listings/${listingId}/reviews/summary`);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getMyReviews(query?: ReviewQuery): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    try {
      const response = await this.http.get('/reviews/my', { params: query });
      return response.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async reportReview(id: string, reason: string): Promise<void> {
    try {
      await this.http.post(`/reviews/${id}/report`, { reason });
    } catch (error: any) {
      throw createApiError(error);
    }
  }
}
