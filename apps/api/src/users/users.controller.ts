import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  UpdateUserProfileRequest,
  CreateProviderRequest,
  UpdateProviderRequest,
  KycSubmissionRequest,
  MembershipUpgradeRequest,
} from '@palmera/shared';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  updateProfile(@Body() updateProfileDto: UpdateUserProfileRequest, @Request() req) {
    return this.usersService.updateProfile(updateProfileDto, req.user.id);
  }

  @Get('provider')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider profile' })
  @ApiResponse({ status: 200, description: 'Provider profile retrieved successfully' })
  getProviderProfile(@Request() req) {
    return this.usersService.getProviderProfile(req.user.id);
  }

  @Post('provider')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create provider profile' })
  @ApiResponse({ status: 201, description: 'Provider profile created successfully' })
  createProviderProfile(@Body() createProviderDto: CreateProviderRequest, @Request() req) {
    return this.usersService.createProviderProfile(createProviderDto, req.user.id);
  }

  @Patch('provider')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update provider profile' })
  @ApiResponse({ status: 200, description: 'Provider profile updated successfully' })
  updateProviderProfile(@Body() updateProviderDto: UpdateProviderRequest, @Request() req) {
    return this.usersService.updateProviderProfile(updateProviderDto, req.user.id);
  }

  @Post('kyc')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit KYC documents' })
  @ApiResponse({ status: 201, description: 'KYC documents submitted successfully' })
  submitKycDocuments(@Body() kycSubmissionDto: KycSubmissionRequest, @Request() req) {
    return this.usersService.submitKycDocuments(kycSubmissionDto, req.user.id);
  }

  @Get('kyc')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get KYC status' })
  @ApiResponse({ status: 200, description: 'KYC status retrieved successfully' })
  getKycStatus(@Request() req) {
    return this.usersService.getKycStatus(req.user.id);
  }

  @Post('membership/upgrade')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade membership' })
  @ApiResponse({ status: 201, description: 'Membership upgrade initiated' })
  upgradeMembership(@Body() membershipUpgradeDto: MembershipUpgradeRequest, @Request() req) {
    return this.usersService.upgradeMembership(membershipUpgradeDto, req.user.id);
  }

  @Get('membership/benefits')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get membership benefits' })
  @ApiResponse({ status: 200, description: 'Membership benefits retrieved successfully' })
  getMembershipBenefits(@Request() req) {
    return this.usersService.getMembershipBenefits(req.user.id);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload avatar' })
  @ApiResponse({ status: 201, description: 'Avatar uploaded successfully' })
  uploadAvatar(@Body() body: { file: any }, @Request() req) {
    return this.usersService.uploadAvatar(body.file, req.user.id);
  }

  @Delete('account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  deleteAccount(@Request() req) {
    return this.usersService.deleteAccount(req.user.id);
  }
}
