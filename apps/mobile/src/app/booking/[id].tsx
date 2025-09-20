import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';

export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.subtitle}>Booking ID: {id}</Text>
      <Text style={styles.description}>
        This is a placeholder for the booking detail screen.
        It will show the booking information, status, and actions.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: palmeraTheme.colors.textSecondary,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
    lineHeight: 20,
  },
});
