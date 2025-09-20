import { AxiosError } from 'axios';

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function createApiError(error: AxiosError): ApiError {
  const response = error.response;
  
  if (response) {
    const data = response.data as any;
    return new ApiError(
      data?.message || data?.error || 'An error occurred',
      response.status,
      data?.code,
      data?.details
    );
  }

  if (error.request) {
    return new ApiError('Network error - please check your connection', 0);
  }

  return new ApiError(error.message || 'An unexpected error occurred', 0);
}
