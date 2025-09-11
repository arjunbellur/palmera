import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { palmeraTheme } from '@palmera/ui';
import { ListingClient, ReviewClient } from '@palmera/sdk';
import { 
  StarIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UserGroupIcon,
  HeartIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const { width } = Dimensions.get('window');

export function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const listingClient = new ListingClient();
  const reviewClient = new ReviewClient();

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingClient.get(id!),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', 'listing', id],
    queryFn: () => reviewClient.getListingReviews(id!),
    enabled: !!id,
  });

  const { data: reviewSummary } = useQuery({
    queryKey: ['reviews', 'summary', id],
    queryFn: () => reviewClient.getListingReviewSummary(id!),
    enabled: !!id,
  });

  const handleBookNow = () => {
    if (!listing) return;
    router.push(`/booking/start?listingId=${listing.id}`);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    Alert.alert('Share', 'Share functionality coming soon!');
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement favorite functionality
  };

  if (isLoading || !listing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
        >
          {listing.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.listingImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {/* Image indicators */}
        {listing.images.length > 1 && (
          <View style={styles.imageIndicators}>
            {listing.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
            {isFavorited ? (
              <HeartSolidIcon size={24} color={palmeraTheme.colors.error} />
            ) : (
              <HeartIcon size={24} color={palmeraTheme.colors.background} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <ShareIcon size={24} color={palmeraTheme.colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title and rating */}
        <View style={styles.header}>
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.ratingContainer}>
            <StarIcon size={16} color={palmeraTheme.colors.accent} />
            <Text style={styles.rating}>
              {reviewSummary?.averageRating || 0}
            </Text>
            <Text style={styles.reviewCount}>
              ({reviewSummary?.totalReviews || 0} reviews)
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <MapPinIcon size={16} color={palmeraTheme.colors.textMuted} />
          <Text style={styles.location}>{listing.city}</Text>
        </View>

        {/* Category badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{listing.category}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this experience</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsList}>
            {listing.capacity && (
              <View style={styles.detailItem}>
                <UserGroupIcon size={20} color={palmeraTheme.colors.textMuted} />
                <Text style={styles.detailText}>
                  Up to {listing.capacity} guests
                </Text>
              </View>
            )}
            {listing.duration && (
              <View style={styles.detailItem}>
                <CalendarIcon size={20} color={palmeraTheme.colors.textMuted} />
                <Text style={styles.detailText}>
                  {listing.duration} minutes
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>
                    {review.customer.firstName} {review.customer.lastName}
                  </Text>
                  <View style={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        size={12}
                        color={
                          i < review.rating
                            ? palmeraTheme.colors.accent
                            : palmeraTheme.colors.border
                        }
                      />
                    ))}
                  </View>
                </View>
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Bottom booking bar */}
      <View style={styles.bookingBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>From</Text>
          <Text style={styles.price}>
            {listing.pricing.basePrice} XOF
          </Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  listingImage: {
    width,
    height: 300,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: palmeraTheme.colors.background,
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
  },
  reviewCount: {
    fontSize: 16,
    color: palmeraTheme.colors.textMuted,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  location: {
    fontSize: 16,
    color: palmeraTheme.colors.textMuted,
  },
  categoryBadge: {
    backgroundColor: palmeraTheme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: palmeraTheme.borderRadius.md,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 14,
    color: palmeraTheme.colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: palmeraTheme.colors.text,
    lineHeight: 24,
  },
  detailsList: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: palmeraTheme.colors.text,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: palmeraTheme.colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: palmeraTheme.colors.text,
    lineHeight: 20,
  },
  bookingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: palmeraTheme.colors.background,
    borderTopWidth: 1,
    borderTopColor: palmeraTheme.colors.border,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
  },
  price: {
    fontSize: 24,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
  },
  bookButton: {
    backgroundColor: palmeraTheme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: palmeraTheme.borderRadius.lg,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.background,
  },
});
