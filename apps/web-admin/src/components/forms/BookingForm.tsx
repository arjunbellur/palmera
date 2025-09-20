import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, FormTextField, FormSelect, FormCheckbox, Card } from '@palmera/ui';

const bookingSchema = z.object({
  experienceId: z.string().min(1, 'Please select an experience'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  participants: z.number().min(1, 'At least 1 participant required').max(20, 'Maximum 20 participants'),
  specialRequests: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const experiences = [
  { value: 'beach-tour', label: 'Beach Adventure Tour' },
  { value: 'cultural-walk', label: 'Cultural Walking Tour' },
  { value: 'cooking-class', label: 'Traditional Cooking Class' },
  { value: 'wildlife-safari', label: 'Wildlife Safari' },
];

const timeSlots = [
  { value: '09:00', label: '9:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '18:00', label: '6:00 PM' },
];

export const BookingForm: React.FC = () => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      participants: 1,
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    console.log('Booking data:', data);
    // Handle form submission
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-midnight-900 mb-6">Book Your Experience</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSelect
          name="experienceId"
          label="Experience"
          options={experiences}
          placeholder="Select an experience"
          error={errors.experienceId?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormTextField
            name="date"
            label="Date"
            type="date"
            error={errors.date?.message}
          />
          
          <FormSelect
            name="time"
            label="Time"
            options={timeSlots}
            placeholder="Select time"
            error={errors.time?.message}
          />
        </div>

        <FormTextField
          name="participants"
          label="Number of Participants"
          type="number"
          min={1}
          max={20}
          error={errors.participants?.message}
        />

        <FormTextField
          name="specialRequests"
          label="Special Requests"
          type="textarea"
          placeholder="Any special requirements or requests..."
          error={errors.specialRequests?.message}
        />

        <FormCheckbox
          name="agreeToTerms"
          label="I agree to the terms and conditions"
          error={errors.agreeToTerms?.message}
        />

        <Button
          onPress={isSubmitting ? undefined : () => handleSubmit(onSubmit)()}
          style={{ width: '100%', opacity: isSubmitting ? 0.6 : 1 }}
        >
          {isSubmitting ? 'Booking...' : 'Book Experience'}
        </Button>
      </form>
    </Card>
  );
};
