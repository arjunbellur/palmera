import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  BookingQuery,
} from '@palmera/shared';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  create(@Body() createBookingDto: CreateBookingRequest, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings with filters' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  findAll(@Query() query: BookingQuery, @Request() req) {
    return this.bookingsService.findAll(query, req.user);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({ status: 200, description: 'User bookings retrieved successfully' })
  getMyBookings(@Query() query: BookingQuery, @Request() req) {
    return this.bookingsService.getUserBookings(query, req.user.id);
  }

  @Get('provider')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider bookings' })
  @ApiResponse({ status: 200, description: 'Provider bookings retrieved successfully' })
  getProviderBookings(@Query() query: BookingQuery, @Request() req) {
    return this.bookingsService.getProviderBookings(query, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findOne(id, req.user);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Booking status updated successfully' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusRequest,
    @Request() req,
  ) {
    return this.bookingsService.updateStatus(id, updateStatusDto, req.user);
  }

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm booking' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
  confirm(@Param('id') id: string, @Request() req) {
    return this.bookingsService.confirm(id, req.user);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  cancel(@Param('id') id: string, @Body() body: { reason: string }, @Request() req) {
    return this.bookingsService.cancel(id, body.reason, req.user);
  }

  @Post(':id/hold')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hold booking for payment' })
  @ApiResponse({ status: 200, description: 'Booking held successfully' })
  hold(@Param('id') id: string, @Body() body: { durationMinutes: number }, @Request() req) {
    return this.bookingsService.hold(id, body.durationMinutes, req.user);
  }

  @Post(':id/release')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Release booking hold' })
  @ApiResponse({ status: 200, description: 'Booking hold released successfully' })
  release(@Param('id') id: string, @Request() req) {
    return this.bookingsService.release(id, req.user);
  }
}
