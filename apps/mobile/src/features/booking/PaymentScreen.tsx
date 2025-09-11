import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { palmeraTheme } from '@palmera/ui';
import { PaymentClient } from '@palmera/sdk';
import { CreditCardIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

export function PaymentScreen() {
  const { bookingData } = useLocalSearchParams<{ bookingData: string }>();
  const parsedBookingData = JSON.parse(bookingData || '{}');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'orange_money'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentClient = new PaymentClient();

  const { data: paymentProviders } = useQuery({
    queryKey: ['payment-providers', 'SN'],
    queryFn: () => paymentClient.getPaymentProviders('SN'),
  });

  const createPaymentIntentMutation = useMutation({
    mutationFn: (data: any) => paymentClient.createPaymentIntent(data),
    onSuccess: (result) => {
      if (selectedMethod === 'card') {
        handleCardPayment(result);
      } else {
        handleOrangeMoneyPayment(result);
      }
    },
    onError: (error) => {
      Alert.alert('Payment Error', 'Failed to create payment intent. Please try again.');
      setIsProcessing(false);
    },
  });

  const handleCardPayment = async (paymentIntent: any) => {
    try {
      // TODO: Integrate with Stripe SDK for React Native
      // For now, simulate card payment
      Alert.alert(
        'Card Payment',
        'Card payment integration coming soon. This would redirect to Stripe checkout.',
        [
          {
            text: 'Simulate Success',
            onPress: () => router.push({
              pathname: '/booking/result',
              params: { 
                bookingId: paymentIntent.bookingId,
                status: 'confirmed',
                paymentMethod: 'card'
              },
            }),
          },
          {
            text: 'Cancel',
            onPress: () => setIsProcessing(false),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Payment Error', 'Card payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleOrangeMoneyPayment = async (paymentIntent: any) => {
    try {
      // TODO: Integrate with Orange Money SDK
      // For now, simulate Orange Money payment
      Alert.alert(
        'Orange Money Payment',
        'Orange Money payment integration coming soon. This would redirect to Orange Money checkout.',
        [
          {
            text: 'Simulate Success',
            onPress: () => router.push({
              pathname: '/booking/result',
              params: { 
                bookingId: paymentIntent.bookingId,
                status: 'confirmed',
                paymentMethod: 'orange_money'
              },
            }),
          },
          {
            text: 'Cancel',
            onPress: () => setIsProcessing(false),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Payment Error', 'Orange Money payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    const paymentData = {
      bookingId: parsedBookingData.bookingId,
      amount: parsedBookingData.totalAmount,
      currency: 'XOF',
      method: selectedMethod === 'card' ? 'CARD' : 'MOBILE_MONEY',
      provider: selectedMethod === 'card' ? 'stripe' : 'orange_money',
    };

    createPaymentIntentMutation.mutate(paymentData);
  };

  const serviceFee = Math.round(parsedBookingData.totalAmount * 0.1);
  const totalAmount = parsedBookingData.totalAmount + serviceFee;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Payment</Text>
          <Text style={styles.subtitle}>
            Choose your preferred payment method
          </Text>
        </View>

        {/* Payment methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedMethod === 'card' && styles.selectedPaymentMethod,
            ]}
            onPress={() => setSelectedMethod('card')}
          >
            <View style={styles.paymentMethodContent}>
              <CreditCardIcon size={24} color={palmeraTheme.colors.primary} />
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodTitle}>Credit/Debit Card</Text>
                <Text style={styles.paymentMethodDescription}>
                  Visa, Mastercard, American Express
                </Text>
              </View>
            </View>
            <View style={[
              styles.radioButton,
              selectedMethod === 'card' && styles.radioButtonSelected,
            ]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedMethod === 'orange_money' && styles.selectedPaymentMethod,
            ]}
            onPress={() => setSelectedMethod('orange_money')}
          >
            <View style={styles.paymentMethodContent}>
              <DevicePhoneMobileIcon size={24} color="#FF6600" />
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodTitle}>Orange Money</Text>
                <Text style={styles.paymentMethodDescription}>
                  Pay with your Orange Money account
                </Text>
              </View>
            </View>
            <View style={[
              styles.radioButton,
              selectedMethod === 'orange_money' && styles.radioButtonSelected,
            ]} />
          </TouchableOpacity>
        </View>

        {/* Price summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Experience</Text>
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

        {/* Security notice */}
        <View style={styles.section}>
          <View style={styles.securityNotice}>
            <Text style={styles.securityTitle}>🔒 Secure Payment</Text>
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure. We never store your card details.
            </Text>
          </View>
        </View>
      </View>

      {/* Payment button */}
      <View style={styles.paymentButton}>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={palmeraTheme.colors.background} />
          ) : (
            <Text style={styles.payButtonText}>
              Pay {totalAmount} XOF
            </Text>
          )}
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
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    borderRadius: palmeraTheme.borderRadius.lg,
    marginBottom: 12,
    backgroundColor: palmeraTheme.colors.background,
  },
  selectedPaymentMethod: {
    borderColor: palmeraTheme.colors.primary,
    backgroundColor: palmeraTheme.colors.primary + '10',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: palmeraTheme.colors.border,
  },
  radioButtonSelected: {
    borderColor: palmeraTheme.colors.primary,
    backgroundColor: palmeraTheme.colors.primary,
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
  securityNotice: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 4,
  },
  securityText: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
    lineHeight: 20,
  },
  paymentButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: palmeraTheme.colors.background,
    borderTopWidth: 1,
    borderTopColor: palmeraTheme.colors.border,
  },
  payButton: {
    backgroundColor: palmeraTheme.colors.primary,
    paddingVertical: 16,
    borderRadius: palmeraTheme.borderRadius.lg,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.background,
  },
});
