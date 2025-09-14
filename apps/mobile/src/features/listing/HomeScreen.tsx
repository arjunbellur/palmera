import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { palmeraTheme } from '@palmera/ui';
import { useAuth } from '@/contexts/AuthContext';
import { FeaturedListings } from '@/components/home/FeaturedListings';

export function HomeScreen() {
  const { user, logout } = useAuth();

  const { data: featuredListings } = useQuery({
    queryKey: ['listings', 'featured'],
    queryFn: async () => [
      {
        id: '1',
        title: 'Traditional Senegalese Cooking Class',
        description: 'Learn to cook authentic Senegalese dishes with local chefs.',
        price: 25000,
        currency: 'XOF',
        rating: 4.8,
        reviewCount: 127,
        city: 'Dakar',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'],
        category: 'Food & Drink',
      },
      {
        id: '2',
        title: 'Goree Island Historical Tour',
        description: 'Explore the rich history of Goree Island, a UNESCO World Heritage site.',
        price: 15000,
        currency: 'XOF',
        rating: 4.9,
        reviewCount: 89,
        city: 'Goree Island',
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
        category: 'History & Culture',
      },
    ],
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning, {user?.name || 'User'}! 🌴</Text>
            <Text style={styles.location}>📍 {user?.location || 'Dakar, Senegal'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={logout}>
              <Text style={styles.headerButtonText}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search experiences...</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Experiences</Text>
          <FeaturedListings listings={featuredListings} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🍽️</Text>
              <Text style={styles.actionTitle}>Food & Drink</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🏛️</Text>
              <Text style={styles.actionTitle}>Culture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { backgroundColor: palmeraTheme.colors.primary, paddingHorizontal: 20, paddingTop: 50, paddingBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  location: { fontSize: 16, color: '#e0f2fe' },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 20, padding: 12 },
  headerButtonText: { color: '#ffffff', fontSize: 18 },
  searchBar: { backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  searchIcon: { fontSize: 18, color: '#9ca3af', marginRight: 12 },
  searchPlaceholder: { flex: 1, color: '#6b7280', fontSize: 16 },
  searchButton: { backgroundColor: palmeraTheme.colors.accent, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  searchButtonText: { color: '#ffffff', fontWeight: '600' },
  content: { padding: 20 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: palmeraTheme.colors.text, marginBottom: 16 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, alignItems: 'center', width: '47%', borderWidth: 1, borderColor: '#e2e8f0' },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: '600', color: palmeraTheme.colors.text, textAlign: 'center' },
});
