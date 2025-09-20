import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palmeraTheme } from '../../theme/palmeraTheme';

export function MyBookingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: palmeraTheme.colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: palmeraTheme.colors.textSecondary },
});
