import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { palmeraTheme } from '@palmera/ui';
import { ListingClient } from '@palmera/sdk';
import { CalendarIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';

export function BookingReviewScreen() {
  const { bookingData } = useLocalSearchParams<{ bookingData: string }>();
  const parsedBookingData = JSON.parse(bookingData || '{}');

  const listingClient = new ListingClient();

  const { data: listing } = useQuery({
    queryKey: ['listing', parsedBookingData.listingId],
    queryFn: () => listingClient.get(parsedBookingData.listingId),
    enabled: !!parsedBookingData.listingId,
  });

  const handleContinueToPayment = () => {
    router.push({
      pathname: '/booking/payment',
      params: { bookingData },
    });
  };

  const handleEditBooking = () => {
    router.back();
  };

  if (!listing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const serviceFee = Math.round(parsedBookingData.totalAmount * 0.1);
  const totalAmount = parsedBookingData.totalAmount + serviceFee;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Review your booking</Text>
          <Text style={styles.subtitle}>
            Please review your booking details before proceeding to payment
          </Text>
        </View>

        {/* Listing summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <View style={styles.listingCard}>
            <Text style={styles.listingTitle}>{listing.title}</Text>
            <View style={styles.listingLocation}>
              <MapPinIcon size={16} color={palmeraTheme.colors.textMuted} />
              <Text style={styles.listingLocationText}>{listing.city}</Text>
            </View>
          </View>
        </View>

        {/* Booking details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <CalendarIcon size={20} color={palmeraTheme.colors.textMuted} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Dates</Text>
                <Text style={styles.detailValue}>
                  {new Date(parsedBookingData.startDate).toLocaleDateString()} - {new Date(parsedBookingData.endDate).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <UserGroupIcon size={20} color={palmeraTheme.colors.textMuted} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Guests</Text>
                <Text style={styles.detailValue}>
                  {parsedBookingData.guests} guest{parsedBookingData.guests > 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {parsedBookingData.specialRequests && (
              <View style={styles.detailRow}>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Special Requests</Text>
                  <Text style={styles.detailValue}>
                    {parsedBookingData.specialRequests}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Price breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                {listing.pricing.basePrice} XOF × {parsedBookingData.guests} guest{parsedBookingData.guests > 1 ? 's' : ''}
              </Text>
              <Text style={styles.priceValue}>
                {parsedBookingData.totalAmount} XOF
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service fee</Text>
              <Text style={styles.priceValue}>
                {serviceFee} XOF
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {totalAmount} XOF
              </Text>
            </View>
          </View>
        </View>

        {/* Cancellation policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cancellation Policy</Text>
          <View style={styles.policyCard}>
            <Text style={styles.policyText}>
              • Free cancellation up to 24 hours before check-in
            </Text>
            <Text style={styles.policyText}>
              • 50% refund for cancellations within 24 hours
            </Text>
            <Text style={styles.policyText}>
              • No refund for no-shows
            </Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditBooking}
        >
          <Text style={styles.editButtonText}>Edit Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueToPayment}
        >
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: palmeraTheme.colors.textSecondary,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 12,
  },
  listingCard: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  listingTitle: {
    fontSize: 18,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  listingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listingLocationText: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
  },
  detailsCard: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: palmeraTheme.colors.text,
  },
  priceCard: {
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
  policyCard: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  policyText: {
    fontSize: 14,
    color: palmeraTheme.colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: palmeraTheme.colors.background,
    borderTopWidth: 1,
    borderTopColor: palmeraTheme.colors.border,
    gap: 12,
  },
  editButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: palmeraTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
  },
  continueButton: {
    flex: 2,
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
