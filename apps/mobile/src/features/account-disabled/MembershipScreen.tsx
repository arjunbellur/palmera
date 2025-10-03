import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { palmeraTheme } from '@palmera/ui';
import { UserClient } from '@palmera/sdk';
import { 
  StarIcon, 
  CheckIcon, 
  GiftIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';

export function MembershipScreen() {
  const [selectedTier, setSelectedTier] = useState<'STANDARD' | 'GOLD'>('GOLD');
  
  const userClient = new UserClient();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userClient.getProfile({}),
  });

  const upgradeMembershipMutation = useMutation({
    mutationFn: (tier: 'GOLD') => userClient.upgradeMembership({ tier, paymentMethod: 'CARD' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      Alert.alert('Success', 'Membership upgraded successfully!');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to upgrade membership. Please try again.');
    },
  });

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Gold',
      'Upgrade to Gold membership for exclusive benefits and priority support?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Upgrade',
          onPress: () => upgradeMembershipMutation.mutate('GOLD'),
        },
      ]
    );
  };

  const currentTier = profile?.membershipTier || 'STANDARD';
  const isGold = currentTier === 'GOLD';

  const standardBenefits = [
    'Access to all experiences',
    'Standard customer support',
    'Basic booking management',
    'Email notifications',
  ];

  const goldBenefits = [
    'Everything in Standard',
    'Priority customer support',
    'Exclusive experiences',
    'Early access to new listings',
    '10% discount on all bookings',
    'Free cancellation up to 48 hours',
    'Concierge service',
    'VIP event invitations',
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Current Membership Status */}
        <View style={styles.currentStatus}>
          <View style={styles.statusHeader}>
            {isGold ? (
              <StarIcon width={32} height={32} color="#FFD700" />
            ) : (
              <StarIcon width={32} height={32} color={palmeraTheme.colors.textMuted} />
            )}
            <Text style={styles.statusTitle}>
              {isGold ? 'Gold Member' : 'Standard Member'}
            </Text>
          </View>
          <Text style={styles.statusDescription}>
            {isGold 
              ? 'You have access to all premium features and exclusive benefits.'
              : 'Upgrade to Gold for exclusive experiences and premium benefits.'
            }
          </Text>
        </View>

        {/* Membership Tiers */}
        <View style={styles.tiersSection}>
          <Text style={styles.sectionTitle}>Membership Tiers</Text>
          
          {/* Standard Tier */}
          <View style={[styles.tierCard, isGold && styles.inactiveTierCard]}>
            <View style={styles.tierHeader}>
              <View style={styles.tierInfo}>
                <Text style={styles.tierName}>Standard</Text>
                <Text style={styles.tierPrice}>Free</Text>
              </View>
              {currentTier === 'STANDARD' && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current</Text>
                </View>
              )}
            </View>
            
            <View style={styles.benefitsList}>
              {standardBenefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <CheckIcon width={16} height={16} color={palmeraTheme.colors.success} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Gold Tier */}
          <View style={[styles.tierCard, styles.goldTierCard, !isGold && styles.upgradeTierCard]}>
            <View style={styles.tierHeader}>
              <View style={styles.tierInfo}>
                <Text style={styles.tierName}>Gold</Text>
                <Text style={styles.tierPrice}>15,000 XOF/month</Text>
              </View>
              {isGold && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current</Text>
                </View>
              )}
            </View>
            
            <View style={styles.benefitsList}>
              {goldBenefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <CheckIcon width={16} height={16} color="#FFD700" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            {!isGold && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgrade}
                disabled={upgradeMembershipMutation.isPending}
              >
                <SparklesIcon width={20} height={20} color={palmeraTheme.colors.background} />
                <Text style={styles.upgradeButtonText}>Upgrade to Gold</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Exclusive Benefits */}
        {isGold && (
          <View style={styles.exclusiveSection}>
            <Text style={styles.sectionTitle}>Your Gold Benefits</Text>
            
            <View style={styles.exclusiveCard}>
              <GiftIcon width={24} height={24} color="#FFD700" />
              <Text style={styles.exclusiveTitle}>Welcome Gift</Text>
              <Text style={styles.exclusiveDescription}>
                Enjoy a complimentary welcome experience worth 25,000 XOF
              </Text>
            </View>

            <View style={styles.exclusiveCard}>
              <StarIcon width={24} height={24} color="#FFD700" />
              <Text style={styles.exclusiveTitle}>Concierge Service</Text>
              <Text style={styles.exclusiveDescription}>
                Get personalized recommendations and booking assistance
              </Text>
            </View>
          </View>
        )}

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I cancel my Gold membership anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can cancel your Gold membership at any time. You'll continue to have access to Gold benefits until the end of your current billing period.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I get my 10% discount?</Text>
            <Text style={styles.faqAnswer}>
              Your discount is automatically applied at checkout. No promo code needed!
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What is the concierge service?</Text>
            <Text style={styles.faqAnswer}>
              Our concierge team helps you find the perfect experiences, handles special requests, and provides personalized recommendations.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.background,
  },
  content: {
    padding: 20,
  },
  currentStatus: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 20,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginLeft: 12,
  },
  statusDescription: {
    fontSize: 16,
    color: palmeraTheme.colors.textSecondary,
    lineHeight: 24,
  },
  tiersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 16,
  },
  tierCard: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  inactiveTierCard: {
    opacity: 0.6,
  },
  goldTierCard: {
    borderColor: '#FFD700',
    backgroundColor: '#FFD700' + '10',
  },
  upgradeTierCard: {
    borderColor: palmeraTheme.colors.primary,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 18,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 4,
  },
  tierPrice: {
    fontSize: 16,
    color: palmeraTheme.colors.textMuted,
  },
  currentBadge: {
    backgroundColor: palmeraTheme.colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: palmeraTheme.borderRadius.md,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: palmeraTheme.colors.background,
  },
  benefitsList: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: palmeraTheme.colors.text,
    marginLeft: 8,
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: palmeraTheme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: palmeraTheme.borderRadius.lg,
    gap: 8,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.background,
  },
  exclusiveSection: {
    marginBottom: 24,
  },
  exclusiveCard: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  exclusiveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginLeft: 12,
    marginBottom: 4,
  },
  exclusiveDescription: {
    fontSize: 14,
    color: palmeraTheme.colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  faqSection: {
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: palmeraTheme.colors.textSecondary,
    lineHeight: 20,
  },
});
