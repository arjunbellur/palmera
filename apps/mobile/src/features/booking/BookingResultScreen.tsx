import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { palmeraTheme } from '@palmera/ui';
import { BookingClient } from '@palmera/sdk';
import { CheckCircleIcon, XCircleIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/solid';

export function BookingResultScreen() {
  const { bookingId, status, paymentMethod } = useLocalSearchParams<{ 
    bookingId: string;
    status: string;
    paymentMethod: string;
  }>();

  const bookingClient = new BookingClient();

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingClient.get(bookingId!),
    enabled: !!bookingId,
  });

  const isSuccess = status === 'confirmed';
  const isFailure = status === 'failed' || status === 'cancelled';

  useEffect(() => {
    if (isSuccess) {
      // TODO: Send push notification for successful booking
      console.log('Booking confirmed, sending push notification');
    }
  }, [isSuccess]);

  const handleViewBooking = () => {
    router.push(`/booking/${bookingId}`);
  };

  const handleBookAgain = () => {
    router.push('/(tabs)');
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Would you like to contact our support team?',
      [
        {
          text: 'Email Support',
          onPress: () => {
            // TODO: Open email client
            console.log('Opening email client');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Status Icon */}
        <View style={styles.iconContainer}>
          {isSuccess ? (
            <CheckCircleIcon size={80} color={palmeraTheme.colors.success} />
          ) : (
            <XCircleIcon size={80} color={palmeraTheme.colors.error} />
          )}
        </View>

        {/* Status Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.title}>
            {isSuccess ? 'Booking Confirmed!' : 'Booking Failed'}
          </Text>
          <Text style={styles.subtitle}>
            {isSuccess 
              ? 'Your experience has been successfully booked. You will receive a confirmation email shortly.'
              : 'We encountered an issue processing your booking. Please try again or contact support.'
            }
          </Text>
        </View>

        {/* Booking Details */}
        {booking && (
          <View style={styles.bookingDetails}>
            <Text style={styles.detailsTitle}>Booking Details</Text>
            
            <View style={styles.detailRow}>
              <CalendarIcon size={20} color={palmeraTheme.colors.textMuted} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MapPinIcon size={20} color={palmeraTheme.colors.textMuted} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{booking.listing.city}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <Text style={styles.detailValue}>
                  {paymentMethod === 'card' ? 'Credit/Debit Card' : 'Orange Money'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Total Amount</Text>
                <Text style={styles.detailValue}>{booking.totalAmount} XOF</Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {isSuccess ? (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleViewBooking}
              >
                <Text style={styles.primaryButtonText}>View Booking</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleBookAgain}
              >
                <Text style={styles.secondaryButtonText}>Book Another Experience</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleBookAgain}
              >
                <Text style={styles.primaryButtonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleContactSupport}
              >
                <Text style={styles.secondaryButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Additional Info */}
        {isSuccess && (
          <View style={styles.additionalInfo}>
            <Text style={styles.infoTitle}>What's Next?</Text>
            <Text style={styles.infoText}>
              • You'll receive a confirmation email with all the details{'\n'}
              • The provider will contact you 24 hours before your experience{'\n'}
              • You can manage your booking in the "My Bookings" section
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: palmeraTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bookingDetails: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  detailsTitle: {
    fontSize: 18,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: palmeraTheme.colors.text,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: palmeraTheme.colors.primary,
    paddingVertical: 16,
    borderRadius: palmeraTheme.borderRadius.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.background,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: palmeraTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
  },
  additionalInfo: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: palmeraTheme.colors.textSecondary,
    lineHeight: 20,
  },
});
