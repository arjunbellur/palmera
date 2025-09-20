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
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateListingRequest,
  UpdateListingRequest,
  ListingQuery,
  CheckAvailabilityRequest,
} from '@palmera/shared';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new listing' })
  @ApiResponse({ status: 201, description: 'Listing created successfully' })
  create(@Body() createListingDto: CreateListingRequest, @Request() req) {
    return this.listingsService.create(createListingDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all listings with filters' })
  @ApiResponse({ status: 200, description: 'Listings retrieved successfully' })
  findAll(@Query() query: ListingQuery) {
    return this.listingsService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured listings' })
  @ApiResponse({ status: 200, description: 'Featured listings retrieved successfully' })
  getFeatured(@Query('city') city?: string) {
    return this.listingsService.getFeatured(city);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search listings' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  search(@Query('q') query: string, @Query() filters: any) {
    return this.listingsService.search(query, filters);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  getCategories() {
    return this.listingsService.getCategories();
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, description: 'Cities retrieved successfully' })
  getCities() {
    return this.listingsService.getCities();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID' })
  @ApiResponse({ status: 200, description: 'Listing retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update listing' })
  @ApiResponse({ status: 200, description: 'Listing updated successfully' })
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingRequest, @Request() req) {
    return this.listingsService.update(id, updateListingDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete listing' })
  @ApiResponse({ status: 200, description: 'Listing deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.listingsService.remove(id, req.user.id);
  }

  @Post('availability')
  @ApiOperation({ summary: 'Check listing availability' })
  @ApiResponse({ status: 200, description: 'Availability checked successfully' })
  checkAvailability(@Body() checkAvailabilityDto: CheckAvailabilityRequest) {
    return this.listingsService.checkAvailability(checkAvailabilityDto);
  }
}
