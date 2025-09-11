import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { palmeraTheme } from '@palmera/ui';
import { ListingClient } from '@palmera/sdk';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { SearchBar } from '@/components/home/SearchBar';

export function HomeScreen() {
  const listingClient = new ListingClient();

  const { data: featuredListings } = useQuery({
    queryKey: ['listings', 'featured'],
    queryFn: () => listingClient.getFeatured(),
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning</Text>
        <Text style={styles.location}>📍 Dakar, Senegal</Text>
      </View>

      <SearchBar />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <CategoriesGrid />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Experiences</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FeaturedListings listings={featuredListings} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Near You</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FeaturedListings listings={featuredListings} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: palmeraTheme.colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
  },
  seeAll: {
    fontSize: 16,
    color: palmeraTheme.colors.accent,
    fontWeight: '600',
  },
});