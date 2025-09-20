import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthClient } from './clients/auth';
import { ListingClient } from './clients/listing';
import { BookingClient } from './clients/booking';
import { PaymentClient } from './clients/payment';
import { ReviewClient } from './clients/review';
import { UserClient } from './clients/user';
import { FilesClient } from './clients/files';

export interface PalmeraSDKConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class PalmeraSDK {
  private http: AxiosInstance;
  public auth: AuthClient;
  public listings: ListingClient;
  public bookings: BookingClient;
  public payments: PaymentClient;
  public reviews: ReviewClient;
  public users: UserClient;
  public files: FilesClient;

  constructor(config: PalmeraSDKConfig) {
    this.http = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Add API key if provided
    if (config.apiKey) {
      this.http.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
    }

    // Add request interceptor for auth token
    this.http.interceptors.request.use((config) => {
      const token = this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
        }
        return Promise.reject(error);
      }
    );

    // Initialize clients
    this.auth = new AuthClient(this.http);
    this.listings = new ListingClient(this.http);
    this.bookings = new BookingClient(this.http);
    this.payments = new PaymentClient(this.http);
    this.reviews = new ReviewClient(this.http);
    this.users = new UserClient(this.http);
    this.files = new FilesClient(this.http);
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('palmera_token');
    }
    return null;
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('palmera_token');
    }
  }

  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('palmera_token', token);
    }
  }

  public removeAuthToken(): void {
    this.clearAuthToken();
  }

  public getHttpClient(): AxiosInstance {
    return this.http;
  }
}
