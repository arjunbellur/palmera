import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { FeaturedListings } from '../../components/home/FeaturedListings';

export function HomeScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeContext();

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
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      contentInsetAdjustmentBehavior="never"
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name || 'Robert'}👋</Text>
            <Text style={styles.subtitle}>Let's find various events around you!</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationIcon} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchIcon} />
            <Text style={styles.searchText}>Search</Text>
          </View>
        </View>
      </View>

      {/* Popular Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventsScroll}>
          {featuredListings?.map((listing, index) => (
            <TouchableOpacity key={listing.id} style={styles.eventCard}>
              <View style={styles.eventImageContainer}>
                <View style={styles.eventImage} />
                <TouchableOpacity style={styles.favoriteButton}>
                  <View style={styles.heartIcon} />
                </TouchableOpacity>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventCategory}>Music</Text>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {listing.title}
                  </Text>
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDate}>
                      <View style={styles.calendarIcon} />
                      <Text style={styles.eventDateText}>Dec 18 - 08:00 PM</Text>
                    </View>
                    <Text style={styles.eventPrice}>${(listing.price / 100).toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trending Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Categories</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {[
            { name: 'Music', icon: '🎵' },
            { name: 'Football', icon: '⚽' },
            { name: 'Visual Art', icon: '🎨' },
            { name: 'Food', icon: '🍴' },
            { name: 'Movies', icon: '🎬' },
          ].map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Top Artists */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Artists</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistsScroll}>
          {[
            { name: 'Wade Warren', color: ['#FFD700', '#FF6B35'] },
            { name: 'Courtney Henry', color: ['#8B5CF6', '#3B82F6'] },
          ].map((artist, index) => (
            <TouchableOpacity key={index} style={styles.artistCard}>
              <View style={[styles.artistImage, { backgroundColor: artist.color[0] }]} />
              <TouchableOpacity style={styles.artistFavoriteButton}>
                <View style={styles.heartIcon} />
              </TouchableOpacity>
              <Text style={styles.artistName}>{artist.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Destinations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular destinations</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>See all</Text>
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
  },
  header: { 
    backgroundColor: '#000000', 
    paddingHorizontal: palmeraTheme.spacing[4], 
    paddingBottom: palmeraTheme.spacing[4],
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: palmeraTheme.spacing[4] 
  },
  greeting: { 
    fontSize: 24, 
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: { 
    fontSize: 16, 
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: 24,
    maxWidth: '80%',
  },
  notificationButton: { 
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  searchContainer: {
    marginBottom: palmeraTheme.spacing[2],
  },
  searchBar: { 
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 25, 
    paddingHorizontal: palmeraTheme.spacing[4], 
    paddingVertical: palmeraTheme.spacing[3], 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: palmeraTheme.spacing[3],
  },
  searchIcon: { 
    width: 18,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 9,
  },
  searchText: { 
    flex: 1, 
    fontSize: 16, 
    color: 'rgba(255, 255, 255, 0.6)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    marginBottom: palmeraTheme.spacing[4],
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  eventsScroll: {
    marginTop: palmeraTheme.spacing[2],
  },
  eventCard: {
    width: 320,
    marginRight: palmeraTheme.spacing[4],
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventImageContainer: {
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    position: 'relative',
    justifyContent: 'flex-end',
    padding: palmeraTheme.spacing[4],
  },
  eventImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E3A8A', // Blue gradient placeholder
    borderRadius: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  eventInfo: {
    position: 'relative',
    zIndex: 2,
  },
  eventCategory: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: palmeraTheme.spacing[2],
    lineHeight: 22,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    width: 14,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
    marginRight: 6,
  },
  eventDateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
  eventPrice: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  artistsScroll: {
    marginTop: palmeraTheme.spacing[2],
  },
  artistCard: {
    width: 140,
    marginRight: palmeraTheme.spacing[4],
    alignItems: 'center',
  },
  artistImage: {
    width: 140,
    height: 100,
    borderRadius: 16,
    marginBottom: palmeraTheme.spacing[2],
    position: 'relative',
  },
  artistFavoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
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
