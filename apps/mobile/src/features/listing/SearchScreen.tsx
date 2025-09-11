import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { palmeraTheme } from '@palmera/ui';
import { ListingClient } from '@palmera/sdk';
import { MagnifyingGlassIcon, FunnelIcon, MapPinIcon } from '@heroicons/react/24/outline';

export function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const listingClient = new ListingClient();

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['listings', 'search', searchQuery, filters],
    queryFn: () => listingClient.search(searchQuery, filters),
    enabled: searchQuery.length > 0 || Object.values(filters).some(Boolean),
  });

  const { data: cities } = useQuery({
    queryKey: ['listings', 'cities'],
    queryFn: () => listingClient.getCities(),
  });

  const { data: categories } = useQuery({
    queryKey: ['listings', 'categories'],
    queryFn: () => listingClient.getCategories(),
  });

  const handleListingPress = (id: string) => {
    router.push(`/listing/${id}`);
  };

  const renderListing = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => handleListingPress(item.id)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.listingImage} />
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.listingLocation}>
          <MapPinIcon size={12} color={palmeraTheme.colors.textMuted} />
          <Text style={styles.listingLocationText}>{item.city}</Text>
        </View>
        <Text style={styles.listingPrice}>
          {item.pricing.basePrice} XOF
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <MagnifyingGlassIcon size={20} color={palmeraTheme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search experiences..."
            placeholderTextColor={palmeraTheme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <FunnelIcon size={20} color={palmeraTheme.colors.accent} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filters</Text>
          {/* TODO: Implement filter UI */}
        </View>
      )}

      <FlatList
        data={listings}
        renderItem={renderListing}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery || Object.values(filters).some(Boolean)
                ? 'No experiences found'
                : 'Start searching for amazing experiences'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: palmeraTheme.colors.text,
  },
  filterButton: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: palmeraTheme.colors.border,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listingCard: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: palmeraTheme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  listingImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  listingContent: {
    padding: 16,
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
    marginBottom: 8,
    gap: 4,
  },
  listingLocationText: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
  },
  listingPrice: {
    fontSize: 18,
    color: palmeraTheme.colors.accent,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: palmeraTheme.colors.textSecondary,
    textAlign: 'center',
  },
});
