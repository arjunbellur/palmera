import { AxiosInstance } from 'axios';
import {
  Booking,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  BookingQuery,
  BookingConfirmation,
  BookingCancellation,
} from '@palmera/schemas';
import { createApiError } from '../utils/errors';

export class BookingClient {
  constructor(private http: AxiosInstance) {}

  async getBookings(query?: BookingQuery): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    try {
      const response = await this.http.get('/bookings', { params: query });
      return response.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getBooking(id: string): Promise<Booking> {
    try {
      const response = await this.http.get(`/bookings/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await this.http.post('/bookings', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async updateBookingStatus(id: string, data: UpdateBookingStatusRequest): Promise<Booking> {
    try {
      const response = await this.http.patch(`/bookings/${id}/status`, data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async confirmBooking(id: string): Promise<BookingConfirmation> {
    try {
      const response = await this.http.post(`/bookings/${id}/confirm`);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async cancelBooking(id: string, reason: string): Promise<BookingCancellation> {
    try {
      const response = await this.http.post(`/bookings/${id}/cancel`, { reason });
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async holdBooking(id: string, durationMinutes: number = 10): Promise<{ expiresAt: string }> {
    try {
      const response = await this.http.post(`/bookings/${id}/hold`, { durationMinutes });
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async releaseBooking(id: string): Promise<void> {
    try {
      await this.http.post(`/bookings/${id}/release`);
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getMyBookings(query?: BookingQuery): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    try {
      const response = await this.http.get('/bookings/my', { params: query });
      return response.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getProviderBookings(query?: BookingQuery): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    try {
      const response = await this.http.get('/bookings/provider', { params: query });
      return response.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }
}
