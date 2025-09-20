import { AxiosInstance } from 'axios';
import { createApiError } from '../utils/errors';

export interface SignedUrlRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
  purpose: 'avatar' | 'listing' | 'kyc';
}

export interface SignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  expiresIn: number;
}

export class FilesClient {
  constructor(private http: AxiosInstance) {}

  async getSignedUrl(request: SignedUrlRequest): Promise<SignedUrlResponse> {
    try {
      const response = await this.http.post('/files/signed-url', request);
      return response.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getDownloadUrl(fileKey: string): Promise<{ downloadUrl: string }> {
    try {
      const response = await this.http.get(`/files/download/${fileKey}`);
      return response.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      await this.http.delete(`/files/${fileKey}`);
    } catch (error: any) {
      throw createApiError(error);
    }
  }
}
