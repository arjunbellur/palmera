import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Card } from '@palmera/ui';
import { palmeraTheme } from '@palmera/ui';

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
  const methods = useForm<BookingFormData>({
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Your Experience</Text>
      </View>
      
      <FormProvider {...methods}>
        <View style={styles.form}>
          {/* Experience Selection */}
          <View style={styles.field}>
            <Text style={styles.label}>Experience</Text>
            {/* Add native picker component here */}
          </View>

          {/* Date and Time */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Date</Text>
              {/* Add date picker here */}
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Time</Text>
              {/* Add time picker here */}
            </View>
          </View>

          {/* Participants */}
          <View style={styles.field}>
            <Text style={styles.label}>Number of Participants</Text>
            {/* Add number input here */}
          </View>

          {/* Special Requests */}
          <View style={styles.field}>
            <Text style={styles.label}>Special Requests</Text>
            {/* Add text input here */}
          </View>

          {/* Terms Agreement */}
          <View style={styles.field}>
            {/* Add checkbox here */}
            <Text style={styles.label}>I agree to the terms and conditions</Text>
          </View>

          <Button
            onPress={methods.handleSubmit(onSubmit)}
            disabled={methods.formState.isSubmitting}
            style={styles.submitButton}
          >
            <Text style={styles.submitText}>
              {methods.formState.isSubmitting ? 'Booking...' : 'Book Experience'}
            </Text>
          </Button>
        </View>
      </FormProvider>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.background,
  },
  header: {
    padding: palmeraTheme.spacing[6],
    backgroundColor: palmeraTheme.colors.primary,
  },
  title: {
    fontSize: palmeraTheme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: palmeraTheme.colors.ivory[50],
    textAlign: 'center',
  },
  form: {
    padding: palmeraTheme.spacing[6],
  },
  field: {
    marginBottom: palmeraTheme.spacing[4],
  },
  row: {
    flexDirection: 'row',
    gap: palmeraTheme.spacing[4],
  },
  halfField: {
    flex: 1,
  },
  label: {
    fontSize: palmeraTheme.typography.fontSize.base,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: palmeraTheme.spacing[2],
  },
  submitButton: {
    backgroundColor: palmeraTheme.colors.secondary,
    padding: palmeraTheme.spacing[4],
    borderRadius: palmeraTheme.borderRadius.lg,
    marginTop: palmeraTheme.spacing[6],
  },
  submitText: {
    color: palmeraTheme.colors.ivory[50],
    fontSize: palmeraTheme.typography.fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
});
