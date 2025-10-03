import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { palmeraTheme } from '@palmera/ui';
import { BookingClient } from '@palmera/sdk';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

export function MyBookingsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const bookingClient = new BookingClient();

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['bookings', 'my', selectedFilter],
    queryFn: () => bookingClient.getMyBookings({ status: selectedFilter === 'all' ? undefined : selectedFilter }),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return palmeraTheme.colors.success;
      case 'PENDING':
        return palmeraTheme.colors.warning;
      case 'CANCELLED':
        return palmeraTheme.colors.error;
      case 'COMPLETED':
        return palmeraTheme.colors.textMuted;
      default:
        return palmeraTheme.colors.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmed';
      case 'PENDING':
        return 'Pending';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  const handleBookingPress = (bookingId: string) => {
    router.push(`/booking/${bookingId}`);
  };

  const renderBooking = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => handleBookingPress(item.id)}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingTitle} numberOfLines={2}>
          {item.listing.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <CalendarIcon size={16} color={palmeraTheme.colors.textMuted} />
          <Text style={styles.detailText}>
            {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MapPinIcon size={16} color={palmeraTheme.colors.textMuted} />
          <Text style={styles.detailText}>{item.listing.city}</Text>
        </View>

        <View style={styles.detailRow}>
          <ClockIcon size={16} color={palmeraTheme.colors.textMuted} />
          <Text style={styles.detailText}>
            {item.guests} guest{item.guests > 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.bookingFooter}>
        <Text style={styles.bookingPrice}>{item.totalAmount} XOF</Text>
        <Text style={styles.bookingDate}>
          Booked {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No bookings found</Text>
      <Text style={styles.emptyStateText}>
        {selectedFilter === 'all' 
          ? "You haven't made any bookings yet. Start exploring amazing experiences!"
          : `No ${selectedFilter} bookings found.`
        }
      </Text>
      {selectedFilter === 'all' && (
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.exploreButtonText}>Explore Experiences</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.activeFilterTabText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'upcoming' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('upcoming')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'upcoming' && styles.activeFilterTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'past' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('past')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'past' && styles.activeFilterTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.background,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: palmeraTheme.colors.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: palmeraTheme.borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeFilterTab: {
    backgroundColor: palmeraTheme.colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: palmeraTheme.colors.textMuted,
  },
  activeFilterTabText: {
    color: palmeraTheme.colors.background,
  },
  listContainer: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: palmeraTheme.borderRadius.md,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: palmeraTheme.colors.text,
    marginLeft: 8,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: palmeraTheme.colors.border,
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palmeraTheme.colors.accent,
  },
  bookingDate: {
    fontSize: 12,
    color: palmeraTheme.colors.textMuted,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: palmeraTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: palmeraTheme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: palmeraTheme.borderRadius.lg,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.background,
  },
});
