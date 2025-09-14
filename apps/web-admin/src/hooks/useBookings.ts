import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

// Zod schemas for API validation
const BookingSchema = z.object({
  id: z.string(),
  experienceId: z.string(),
  userId: z.string(),
  date: z.string(),
  time: z.string(),
  participants: z.number(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  totalPrice: z.number(),
  specialRequests: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const CreateBookingSchema = z.object({
  experienceId: z.string(),
  date: z.string(),
  time: z.string(),
  participants: z.number(),
  specialRequests: z.string().optional(),
});

export type Booking = z.infer<typeof BookingSchema>;
export type CreateBookingData = z.infer<typeof CreateBookingSchema>;

// API functions
const fetchBookings = async (): Promise<Booking[]> => {
  const response = await fetch('/api/bookings');
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  const data = await response.json();
  return z.array(BookingSchema).parse(data);
};

const createBooking = async (data: CreateBookingData): Promise<Booking> => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create booking');
  }
  const result = await response.json();
  return BookingSchema.parse(result);
};

const updateBookingStatus = async ({ id, status }: { id: string; status: Booking['status'] }): Promise<Booking> => {
  const response = await fetch(`/api/bookings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update booking');
  }
  const result = await response.json();
  return BookingSchema.parse(result);
};

// React Query hooks
export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
