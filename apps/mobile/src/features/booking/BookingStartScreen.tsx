import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { palmeraTheme } from '@palmera/ui';
import { ListingClient } from '@palmera/sdk';
import { CalendarIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import DateTimePicker from '@react-native-community/datetimepicker';

const bookingSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  guests: z.number().min(1, 'At least 1 guest required'),
  specialRequests: z.string().optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type BookingForm = z.infer<typeof bookingSchema>;

export function BookingStartScreen() {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const listingClient = new ListingClient();

  const { data: listing } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => listingClient.get(listingId!),
    enabled: !!listingId,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      guests: 1,
    },
  });

  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedGuests = watch('guests');

  const calculateTotal = () => {
    if (!listing) return 0;
    const days = Math.ceil((watchedEndDate.getTime() - watchedStartDate.getTime()) / (1000 * 60 * 60 * 24));
    return listing.pricing.basePrice * days * watchedGuests;
  };

  const onSubmit = (data: BookingForm) => {
    if (!listing) return;
    
    const bookingData = {
      ...data,
      listingId: listing.id,
      totalAmount: calculateTotal(),
    };
    
    router.push({
      pathname: '/booking/review',
      params: { bookingData: JSON.stringify(bookingData) },
    });
  };

  if (!listing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Listing summary */}
        <View style={styles.listingSummary}>
          <Text style={styles.listingTitle}>{listing.title}</Text>
          <Text style={styles.listingLocation}>{listing.city}</Text>
        </View>

        {/* Date selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Dates</Text>
          
          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>Check-in</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <CalendarIcon size={20} color={palmeraTheme.colors.textMuted} />
                <Text style={styles.dateText}>
                  {watchedStartDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>Check-out</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <CalendarIcon size={20} color={palmeraTheme.colors.textMuted} />
                <Text style={styles.dateText}>
                  {watchedEndDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {errors.startDate && (
            <Text style={styles.errorText}>{errors.startDate.message}</Text>
          )}
          {errors.endDate && (
            <Text style={styles.errorText}>{errors.endDate.message}</Text>
          )}
        </View>

        {/* Guest selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Guests</Text>
          <View style={styles.guestSelector}>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => setValue('guests', Math.max(1, watchedGuests - 1))}
            >
              <Text style={styles.guestButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.guestCount}>
              <UserGroupIcon size={20} color={palmeraTheme.colors.textMuted} />
              <Text style={styles.guestCountText}>{watchedGuests} guest{watchedGuests > 1 ? 's' : ''}</Text>
            </View>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => setValue('guests', Math.min(listing.capacity || 10, watchedGuests + 1))}
            >
              <Text style={styles.guestButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          {errors.guests && (
            <Text style={styles.errorText}>{errors.guests.message}</Text>
          )}
        </View>

        {/* Special requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Requests (Optional)</Text>
          <Controller
            control={control}
            name="specialRequests"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Any special requests or notes..."
                  placeholderTextColor={palmeraTheme.colors.textMuted}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={4}
                />
              </View>
            )}
          />
        </View>

        {/* Price breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                {listing.pricing.basePrice} XOF × {watchedGuests} guest{watchedGuests > 1 ? 's' : ''}
              </Text>
              <Text style={styles.priceValue}>
                {listing.pricing.basePrice * watchedGuests} XOF
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service fee</Text>
              <Text style={styles.priceValue}>
                {Math.round(calculateTotal() * 0.1)} XOF
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {calculateTotal() + Math.round(calculateTotal() * 0.1)} XOF
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Continue button */}
      <View style={styles.continueButton}>
        <TouchableOpacity
          style={styles.continueButtonInner}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>

      {/* Date pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={watchedStartDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setValue('startDate', selectedDate);
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={watchedEndDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setValue('endDate', selectedDate);
            }
          }}
          minimumDate={watchedStartDate}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  listingSummary: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: palmeraTheme.colors.border,
  },
  listingTitle: {
    fontSize: 20,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 16,
    color: palmeraTheme.colors.textMuted,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    borderRadius: palmeraTheme.borderRadius.lg,
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    color: palmeraTheme.colors.text,
  },
  guestSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    borderRadius: palmeraTheme.borderRadius.lg,
  },
  guestButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palmeraTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palmeraTheme.colors.background,
  },
  guestCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestCountText: {
    fontSize: 16,
    color: palmeraTheme.colors.text,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    borderRadius: palmeraTheme.borderRadius.lg,
  },
  textArea: {
    padding: 16,
    fontSize: 16,
    color: palmeraTheme.colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  priceBreakdown: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: palmeraTheme.colors.text,
  },
  priceValue: {
    fontSize: 16,
    color: palmeraTheme.colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: palmeraTheme.colors.border,
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palmeraTheme.colors.accent,
  },
  errorText: {
    fontSize: 14,
    color: palmeraTheme.colors.error,
    marginTop: 4,
  },
  continueButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: palmeraTheme.colors.background,
    borderTopWidth: 1,
    borderTopColor: palmeraTheme.colors.border,
  },
  continueButtonInner: {
    backgroundColor: palmeraTheme.colors.primary,
    paddingVertical: 16,
    borderRadius: palmeraTheme.borderRadius.lg,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.background,
  },
});
