import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService, SignedUrlRequest } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('signed-url')
  @ApiOperation({ summary: 'Get signed URL for file upload' })
  @ApiResponse({ status: 201, description: 'Signed URL generated successfully' })
  async getSignedUploadUrl(
    @Body() request: SignedUrlRequest,
    @Request() req,
  ) {
    return this.filesService.getSignedUploadUrl(request, req.user.id);
  }

  @Get('download/:fileKey')
  @ApiOperation({ summary: 'Get signed URL for file download' })
  @ApiResponse({ status: 200, description: 'Download URL generated successfully' })
  async getSignedDownloadUrl(
    @Param('fileKey') fileKey: string,
    @Request() req,
  ) {
    const downloadUrl = await this.filesService.getSignedDownloadUrl(fileKey, req.user.id);
    return { downloadUrl };
  }

  @Delete(':fileKey')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(
    @Param('fileKey') fileKey: string,
    @Request() req,
  ) {
    await this.filesService.deleteFile(fileKey, req.user.id);
    return { message: 'File deleted successfully' };
  }
}
