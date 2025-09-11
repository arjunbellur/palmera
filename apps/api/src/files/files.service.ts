import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';

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

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly bucketName: string;
  private readonly region: string;
  private readonly provider: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME', 'palmera-uploads');
    this.region = this.configService.get<string>('S3_REGION', 'us-east-1');
    this.provider = this.configService.get<string>('STORAGE_PROVIDER', 's3');
  }

  async getSignedUploadUrl(request: SignedUrlRequest, userId: string): Promise<SignedUrlResponse> {
    this.validateFileRequest(request);

    const fileKey = this.generateFileKey(request.purpose, userId, request.fileName);
    const expiresIn = 3600; // 1 hour

    try {
      let uploadUrl: string;
      let fileUrl: string;

      switch (this.provider) {
        case 's3':
          const s3Result = await this.generateS3SignedUrl(fileKey, request.contentType, expiresIn);
          uploadUrl = s3Result.uploadUrl;
          fileUrl = s3Result.fileUrl;
          break;
        case 'r2':
          const r2Result = await this.generateR2SignedUrl(fileKey, request.contentType, expiresIn);
          uploadUrl = r2Result.uploadUrl;
          fileUrl = r2Result.fileUrl;
          break;
        default:
          throw new BadRequestException(`Storage provider ${this.provider} not supported`);
      }

      // Log file upload request
      await this.logFileUpload(userId, fileKey, request);

      return {
        uploadUrl,
        fileUrl,
        expiresIn,
      };
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw new BadRequestException('Failed to generate upload URL');
    }
  }

  async getSignedDownloadUrl(fileKey: string, userId: string): Promise<string> {
    // Verify user has access to this file
    const hasAccess = await this.verifyFileAccess(fileKey, userId);
    if (!hasAccess) {
      throw new BadRequestException('Access denied to this file');
    }

    const expiresIn = 3600; // 1 hour

    try {
      switch (this.provider) {
        case 's3':
          return await this.generateS3DownloadUrl(fileKey, expiresIn);
        case 'r2':
          return await this.generateR2DownloadUrl(fileKey, expiresIn);
        default:
          throw new BadRequestException(`Storage provider ${this.provider} not supported`);
      }
    } catch (error) {
      this.logger.error(`Failed to generate download URL: ${error.message}`);
      throw new BadRequestException('Failed to generate download URL');
    }
  }

  async deleteFile(fileKey: string, userId: string): Promise<void> {
    // Verify user has access to this file
    const hasAccess = await this.verifyFileAccess(fileKey, userId);
    if (!hasAccess) {
      throw new BadRequestException('Access denied to this file');
    }

    try {
      switch (this.provider) {
        case 's3':
          await this.deleteS3File(fileKey);
          break;
        case 'r2':
          await this.deleteR2File(fileKey);
          break;
        default:
          throw new BadRequestException(`Storage provider ${this.provider} not supported`);
      }

      // Remove file record from database
      await this.removeFileRecord(fileKey);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new BadRequestException('Failed to delete file');
    }
  }

  private validateFileRequest(request: SignedUrlRequest): void {
    const maxSizes = {
      avatar: 5 * 1024 * 1024, // 5MB
      listing: 10 * 1024 * 1024, // 10MB
      kyc: 10 * 1024 * 1024, // 10MB
    };

    const allowedTypes = {
      avatar: ['image/jpeg', 'image/png', 'image/webp'],
      listing: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      kyc: ['image/jpeg', 'image/png', 'application/pdf'],
    };

    if (request.fileSize > maxSizes[request.purpose]) {
      throw new BadRequestException(`File size exceeds maximum allowed size for ${request.purpose}`);
    }

    if (!allowedTypes[request.purpose].includes(request.contentType)) {
      throw new BadRequestException(`File type not allowed for ${request.purpose}`);
    }
  }

  private generateFileKey(purpose: string, userId: string, fileName: string): string {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${purpose}/${userId}/${timestamp}_${sanitizedFileName}`;
  }

  private async generateS3SignedUrl(fileKey: string, contentType: string, expiresIn: number): Promise<{ uploadUrl: string; fileUrl: string }> {
    // TODO: Implement AWS S3 signed URL generation
    // This would use AWS SDK to generate presigned URLs
    this.logger.warn('AWS S3 integration not implemented yet');
    
    // Mock implementation for development
    const uploadUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}?upload=true`;
    const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;
    
    return { uploadUrl, fileUrl };
  }

  private async generateR2SignedUrl(fileKey: string, contentType: string, expiresIn: number): Promise<{ uploadUrl: string; fileUrl: string }> {
    // TODO: Implement Cloudflare R2 signed URL generation
    this.logger.warn('Cloudflare R2 integration not implemented yet');
    
    // Mock implementation for development
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${this.bucketName}/objects/${fileKey}?upload=true`;
    const fileUrl = `https://${this.bucketName}.${accountId}.r2.cloudflarestorage.com/${fileKey}`;
    
    return { uploadUrl, fileUrl };
  }

  private async generateS3DownloadUrl(fileKey: string, expiresIn: number): Promise<string> {
    // TODO: Implement AWS S3 download URL generation
    this.logger.warn('AWS S3 download URL generation not implemented yet');
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;
  }

  private async generateR2DownloadUrl(fileKey: string, expiresIn: number): Promise<string> {
    // TODO: Implement Cloudflare R2 download URL generation
    this.logger.warn('Cloudflare R2 download URL generation not implemented yet');
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    return `https://${this.bucketName}.${accountId}.r2.cloudflarestorage.com/${fileKey}`;
  }

  private async deleteS3File(fileKey: string): Promise<void> {
    // TODO: Implement AWS S3 file deletion
    this.logger.warn('AWS S3 file deletion not implemented yet');
  }

  private async deleteR2File(fileKey: string): Promise<void> {
    // TODO: Implement Cloudflare R2 file deletion
    this.logger.warn('Cloudflare R2 file deletion not implemented yet');
  }

  private async logFileUpload(userId: string, fileKey: string, request: SignedUrlRequest): Promise<void> {
    // TODO: Implement file upload logging to database
    this.logger.log(`File upload logged: ${fileKey} by user ${userId}`);
  }

  private async verifyFileAccess(fileKey: string, userId: string): Promise<boolean> {
    // TODO: Implement file access verification
    // This should check if the user owns the file or has permission to access it
    return true; // Mock implementation
  }

  private async removeFileRecord(fileKey: string): Promise<void> {
    // TODO: Implement file record removal from database
    this.logger.log(`File record removed: ${fileKey}`);
  }
}
