import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  city: string;
  images: string[];
  category: string;
}

interface FeaturedListingsProps {
  listings?: Listing[];
}

export function FeaturedListings({ listings = [] }: FeaturedListingsProps) {
  const handleListingPress = (listingId: string) => {
    router.push(`/listing/${listingId}`);
  };

  const renderListing = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => handleListingPress(item.id)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.listingImage} />
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.listingDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.listingLocation}>
          <Text style={{ fontSize: 12, marginRight: 4 }}>📍</Text>
          <Text style={styles.listingCity}>{item.city}</Text>
        </View>
        <View style={styles.listingFooter}>
          <View style={styles.ratingContainer}>
            <Text style={{ fontSize: 12, marginRight: 4 }}>⭐</Text>
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount})</Text>
          </View>
          <Text style={styles.price}>
            {item.currency} {item.price.toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (listings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No featured listings available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        renderItem={renderListing}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
  },
  list: {
    paddingRight: 20,
  },
  listingCard: {
    width: 280,
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    marginRight: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    overflow: 'hidden',
  },
  listingImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  listingContent: {
    padding: 16,
  },
  listingTitle: {
    fontSize: 16,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 4,
  },
  listingDescription: {
    fontSize: 14,
    color: palmeraTheme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  listingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  listingCity: {
    fontSize: 12,
    color: palmeraTheme.colors.textMuted,
    marginLeft: 4,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: palmeraTheme.colors.textMuted,
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palmeraTheme.colors.accent,
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: palmeraTheme.colors.textMuted,
  },
});