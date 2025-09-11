import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { FilesService } from '../files.service';
import { BadRequestException } from '@nestjs/common';

describe('FilesService', () => {
  let service: FilesService;
  let configService: ConfigService;
  let prismaService: PrismaService;

    const mockConfigService = {
      get: jest.fn(),
      internalConfig: {},
      isCacheEnabled: false,
      cache: new Map(),
      _changes$: {} as any,
      getOrThrow: jest.fn(),
      getOptional: jest.fn(),
      getOptionalOrThrow: jest.fn(),
      getPath: jest.fn(),
      getPathOrThrow: jest.fn(),
      getPathOptional: jest.fn(),
      getPathOptionalOrThrow: jest.fn(),
      getPathArray: jest.fn(),
      getPathArrayOrThrow: jest.fn(),
      getPathArrayOptional: jest.fn(),
      getPathArrayOptionalOrThrow: jest.fn(),
      getPathObject: jest.fn(),
      getPathObjectOrThrow: jest.fn(),
      getPathObjectOptional: jest.fn(),
      getPathObjectOptionalOrThrow: jest.fn(),
      getPathString: jest.fn(),
      getPathStringOrThrow: jest.fn(),
      getPathStringOptional: jest.fn(),
      getPathStringOptionalOrThrow: jest.fn(),
      getPathNumber: jest.fn(),
      getPathNumberOrThrow: jest.fn(),
      getPathNumberOptional: jest.fn(),
      getPathNumberOptionalOrThrow: jest.fn(),
      getPathBoolean: jest.fn(),
      getPathBooleanOrThrow: jest.fn(),
      getPathBooleanOptional: jest.fn(),
      getPathBooleanOptionalOrThrow: jest.fn(),
      getPathDate: jest.fn(),
      getPathDateOrThrow: jest.fn(),
      getPathDateOptional: jest.fn(),
      getPathDateOptionalOrThrow: jest.fn(),
      getPathArrayString: jest.fn(),
      getPathArrayStringOrThrow: jest.fn(),
      getPathArrayStringOptional: jest.fn(),
      getPathArrayStringOptionalOrThrow: jest.fn(),
      getPathArrayNumber: jest.fn(),
      getPathArrayNumberOrThrow: jest.fn(),
      getPathArrayNumberOptional: jest.fn(),
      getPathArrayNumberOptionalOrThrow: jest.fn(),
      getPathArrayBoolean: jest.fn(),
      getPathArrayBooleanOrThrow: jest.fn(),
      getPathArrayBooleanOptional: jest.fn(),
      getPathArrayBooleanOptionalOrThrow: jest.fn(),
      getPathArrayDate: jest.fn(),
      getPathArrayDateOrThrow: jest.fn(),
      getPathArrayDateOptional: jest.fn(),
      getPathArrayDateOptionalOrThrow: jest.fn(),
    } as any;

  const mockPrismaService = {
    chatMessage: {
      create: jest.fn(),
    },
    onModuleInit: jest.fn(),
    onModuleDestroy: jest.fn(),
    $on: jest.fn(),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(),
    $executeRaw: jest.fn(),
    $executeRawUnsafe: jest.fn(),
    $queryRaw: jest.fn(),
    $queryRawUnsafe: jest.fn(),
    $runCommandRaw: jest.fn(),
    $metrics: jest.fn(),
    $extends: jest.fn(),
    $use: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSignedUploadUrl', () => {
    beforeEach(() => {
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'S3_BUCKET_NAME':
            return 'test-bucket';
          case 'S3_REGION':
            return 'us-east-1';
          case 'STORAGE_PROVIDER':
            return 's3';
          default:
            return undefined;
        }
      });
    });

    it('should generate signed URL for valid file request', async () => {
      // Arrange
      const request = {
        fileName: 'test-image.jpg',
        contentType: 'image/jpeg',
        fileSize: 1024 * 1024, // 1MB
        purpose: 'avatar' as const,
      };
      const userId = 'user-123';

      // Act
      const result = await service.getSignedUploadUrl(request, userId);

      // Assert
      expect(result).toHaveProperty('uploadUrl');
      expect(result).toHaveProperty('fileUrl');
      expect(result).toHaveProperty('expiresIn');
      expect(result.expiresIn).toBe(3600);
      expect(result.uploadUrl).toContain('test-bucket');
      expect(result.fileUrl).toContain('test-bucket');
    });

    it('should throw error for file size exceeding limit', async () => {
      // Arrange
      const request = {
        fileName: 'large-image.jpg',
        contentType: 'image/jpeg',
        fileSize: 10 * 1024 * 1024, // 10MB (exceeds avatar limit)
        purpose: 'avatar' as const,
      };
      const userId = 'user-123';

      // Act & Assert
      await expect(service.getSignedUploadUrl(request, userId)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw error for invalid content type', async () => {
      // Arrange
      const request = {
        fileName: 'document.pdf',
        contentType: 'application/pdf',
        fileSize: 1024 * 1024,
        purpose: 'avatar' as const,
      };
      const userId = 'user-123';

      // Act & Assert
      await expect(service.getSignedUploadUrl(request, userId)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should generate different file keys for different purposes', async () => {
      // Arrange
      const avatarRequest = {
        fileName: 'avatar.jpg',
        contentType: 'image/jpeg',
        fileSize: 1024 * 1024,
        purpose: 'avatar' as const,
      };
      const listingRequest = {
        fileName: 'listing.jpg',
        contentType: 'image/jpeg',
        fileSize: 1024 * 1024,
        purpose: 'listing' as const,
      };
      const userId = 'user-123';

      // Act
      const avatarResult = await service.getSignedUploadUrl(avatarRequest, userId);
      const listingResult = await service.getSignedUploadUrl(listingRequest, userId);

      // Assert
      expect(avatarResult.uploadUrl).toContain('avatar/');
      expect(listingResult.uploadUrl).toContain('listing/');
    });
  });

  describe('getSignedDownloadUrl', () => {
    beforeEach(() => {
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'S3_BUCKET_NAME':
            return 'test-bucket';
          case 'S3_REGION':
            return 'us-east-1';
          case 'STORAGE_PROVIDER':
            return 's3';
          default:
            return undefined;
        }
      });
    });

    it('should generate download URL for valid file', async () => {
      // Arrange
      const fileKey = 'avatar/user-123/1234567890_avatar.jpg';
      const userId = 'user-123';

      // Act
      const result = await service.getSignedDownloadUrl(fileKey, userId);

      // Assert
      expect(result).toContain('test-bucket');
      expect(result).toContain(fileKey);
    });

    it('should throw error for access denied', async () => {
      // Arrange
      const fileKey = 'avatar/other-user/1234567890_avatar.jpg';
      const userId = 'user-123';

      // Mock verifyFileAccess to return false
      jest.spyOn(service as any, 'verifyFileAccess').mockResolvedValue(false);

      // Act & Assert
      await expect(service.getSignedDownloadUrl(fileKey, userId)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('deleteFile', () => {
    beforeEach(() => {
      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'S3_BUCKET_NAME':
            return 'test-bucket';
          case 'S3_REGION':
            return 'us-east-1';
          case 'STORAGE_PROVIDER':
            return 's3';
          default:
            return undefined;
        }
      });
    });

    it('should delete file successfully', async () => {
      // Arrange
      const fileKey = 'avatar/user-123/1234567890_avatar.jpg';
      const userId = 'user-123';

      // Mock verifyFileAccess to return true
      jest.spyOn(service as any, 'verifyFileAccess').mockResolvedValue(true);

      // Act
      await service.deleteFile(fileKey, userId);

      // Assert
      expect(service as any).toHaveProperty('verifyFileAccess');
    });

    it('should throw error for access denied', async () => {
      // Arrange
      const fileKey = 'avatar/other-user/1234567890_avatar.jpg';
      const userId = 'user-123';

      // Mock verifyFileAccess to return false
      jest.spyOn(service as any, 'verifyFileAccess').mockResolvedValue(false);

      // Act & Assert
      await expect(service.deleteFile(fileKey, userId)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('validateFileRequest', () => {
    it('should validate file size limits correctly', () => {
      const service = new FilesService(mockConfigService, mockPrismaService);

      // Test avatar size limit (5MB)
      expect(() => {
        (service as any).validateFileRequest({
          fileName: 'test.jpg',
          contentType: 'image/jpeg',
          fileSize: 5 * 1024 * 1024 + 1, // Just over 5MB
          purpose: 'avatar',
        });
      }).toThrow('File size exceeds maximum allowed size for avatar');

      // Test listing size limit (10MB)
      expect(() => {
        (service as any).validateFileRequest({
          fileName: 'test.jpg',
          contentType: 'image/jpeg',
          fileSize: 10 * 1024 * 1024 + 1, // Just over 10MB
          purpose: 'listing',
        });
      }).toThrow('File size exceeds maximum allowed size for listing');
    });

    it('should validate content types correctly', () => {
      const service = new FilesService(mockConfigService, mockPrismaService);

      // Test invalid content type for avatar
      expect(() => {
        (service as any).validateFileRequest({
          fileName: 'test.pdf',
          contentType: 'application/pdf',
          fileSize: 1024 * 1024,
          purpose: 'avatar',
        });
      }).toThrow('File type not allowed for avatar');

      // Test valid content type for avatar
      expect(() => {
        (service as any).validateFileRequest({
          fileName: 'test.jpg',
          contentType: 'image/jpeg',
          fileSize: 1024 * 1024,
          purpose: 'avatar',
        });
      }).not.toThrow();
    });
  });

  describe('generateFileKey', () => {
    it('should generate consistent file keys', () => {
      const service = new FilesService(mockConfigService, mockPrismaService);

      const key1 = (service as any).generateFileKey('avatar', 'user-123', 'test.jpg');
      const key2 = (service as any).generateFileKey('avatar', 'user-123', 'test.jpg');

      // Keys should be different due to timestamp
      expect(key1).not.toBe(key2);
      expect(key1).toContain('avatar/user-123/');
      expect(key2).toContain('avatar/user-123/');
    });

    it('should sanitize file names', () => {
      const service = new FilesService(mockConfigService, mockPrismaService);

      const key = (service as any).generateFileKey('avatar', 'user-123', 'test file with spaces & symbols!.jpg');

      expect(key).toContain('test_file_with_spaces___symbols_.jpg');
    });
  });
});
