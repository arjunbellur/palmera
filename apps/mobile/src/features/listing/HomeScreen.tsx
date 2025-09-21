import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palmeraTheme } from '../../theme/palmeraTheme';
import { useAuth } from '../../contexts/AuthContext';
import { FeaturedListings } from '../../components/home/FeaturedListings';

export function HomeScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

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
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      contentInsetAdjustmentBehavior="never"
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.userName}>{user?.name || 'User'}! 🌴</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={logout}>
              <View style={styles.profileAvatar} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchIcon} />
            <Text style={styles.searchText}>Where to?</Text>
          </View>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Explore by category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {[
            { name: 'Food & Drink', icon: '🍽️', color: palmeraTheme.colors.info },
            { name: 'Adventure', icon: '🏄‍♂️', color: palmeraTheme.colors.primary },
            { name: 'Culture', icon: '🎭', color: palmeraTheme.colors.accent },
            { name: 'Nature', icon: '🌿', color: palmeraTheme.colors.success },
            { name: 'Wellness', icon: '🧘‍♀️', color: palmeraTheme.colors.warning },
          ].map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Text style={styles.categoryIconText}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Experiences */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured experiences</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <FeaturedListings listings={featuredListings} />
      </View>

      {/* Popular Destinations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular destinations</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.destinationsGrid}>
          {[
            { name: 'Dakar', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300' },
            { name: 'Saly', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300' },
            { name: 'Goree Island', image: 'https://images.unsplash.com/photo-1570129477490-b7d1f1c1f1f1?w=300' },
            { name: 'Saint-Louis', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba38b9a?w=300' },
          ].map((destination, index) => (
            <TouchableOpacity key={index} style={styles.destinationCard}>
              <View style={styles.destinationImageContainer}>
                <View style={styles.destinationPlaceholder} />
              </View>
              <Text style={styles.destinationName}>{destination.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: palmeraTheme.colors.background 
  },
  header: { 
    backgroundColor: palmeraTheme.colors.background, 
    paddingHorizontal: palmeraTheme.spacing[4], 
    paddingBottom: palmeraTheme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: palmeraTheme.colors.border,
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: palmeraTheme.spacing[2] 
  },
  greeting: { 
    fontSize: 16, 
    color: palmeraTheme.colors.textSecondary,
    fontWeight: '400',
  },
  userName: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: palmeraTheme.colors.text,
    marginTop: 2,
  },
  headerActions: { 
    flexDirection: 'row', 
    gap: palmeraTheme.spacing[3] 
  },
  headerButton: { 
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palmeraTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palmeraTheme.colors.error,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palmeraTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palmeraTheme.colors.primary,
  },
  searchContainer: {
    marginBottom: palmeraTheme.spacing[2],
  },
  searchBar: { 
    backgroundColor: palmeraTheme.colors.surface,
    borderRadius: palmeraTheme.borderRadius.xl, 
    paddingHorizontal: palmeraTheme.spacing[4], 
    paddingVertical: palmeraTheme.spacing[3], 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: palmeraTheme.spacing[3],
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  searchIcon: { 
    width: 16,
    height: 16,
    backgroundColor: palmeraTheme.colors.textMuted,
    borderRadius: 8,
  },
  searchText: { 
    flex: 1, 
    fontSize: 16, 
    color: palmeraTheme.colors.textSecondary,
    fontWeight: '400',
  },
  categoriesSection: {
    paddingHorizontal: palmeraTheme.spacing[4],
    paddingVertical: palmeraTheme.spacing[5],
  },
  categoriesScroll: {
    marginTop: palmeraTheme.spacing[4],
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: palmeraTheme.spacing[4],
    width: 80,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: palmeraTheme.spacing[2],
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: palmeraTheme.colors.text,
    textAlign: 'center',
  },
  section: { 
    paddingHorizontal: palmeraTheme.spacing[4],
    marginBottom: palmeraTheme.spacing[6] 
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: palmeraTheme.spacing[4],
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: palmeraTheme.colors.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: palmeraTheme.colors.primary,
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: '48%',
    marginBottom: palmeraTheme.spacing[4],
  },
  destinationImageContainer: {
    aspectRatio: 1.2,
    borderRadius: palmeraTheme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: palmeraTheme.spacing[2],
  },
  destinationPlaceholder: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.surface,
    borderRadius: palmeraTheme.borderRadius.lg,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
  },
});
