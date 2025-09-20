import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewQuery,
} from '@palmera/shared';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  create(@Body() createReviewDto: CreateReviewRequest, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with filters' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  findAll(@Query() query: ReviewQuery) {
    return this.reviewsService.findAll(query);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user reviews' })
  @ApiResponse({ status: 200, description: 'User reviews retrieved successfully' })
  getMyReviews(@Query() query: ReviewQuery, @Request() req) {
    return this.reviewsService.getUserReviews(query, req.user.id);
  }

  @Get('listing/:listingId')
  @ApiOperation({ summary: 'Get reviews for a listing' })
  @ApiResponse({ status: 200, description: 'Listing reviews retrieved successfully' })
  getListingReviews(@Param('listingId') listingId: string, @Query() query: ReviewQuery) {
    return this.reviewsService.getListingReviews(listingId, query);
  }

  @Get('listing/:listingId/summary')
  @ApiOperation({ summary: 'Get review summary for a listing' })
  @ApiResponse({ status: 200, description: 'Review summary retrieved successfully' })
  getListingReviewSummary(@Param('listingId') listingId: string) {
    return this.reviewsService.getListingReviewSummary(listingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewRequest, @Request() req) {
    return this.reviewsService.update(id, updateReviewDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.reviewsService.remove(id, req.user.id);
  }

  @Post(':id/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report review' })
  @ApiResponse({ status: 200, description: 'Review reported successfully' })
  report(@Param('id') id: string, @Body() body: { reason: string }, @Request() req) {
    return this.reviewsService.report(id, body.reason, req.user.id);
  }
}
