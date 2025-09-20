import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { palmeraTheme } from '../../theme/palmeraTheme';
import { useAuth } from '@/contexts/AuthContext';

// Mock group data
const mockGroupDetail = {
  id: '1',
  name: 'Weekend in Saly',
  description: 'Beach weekend with the crew',
  owner: { 
    id: 'user1',
    firstName: 'John', 
    lastName: 'Doe',
    email: 'john@example.com'
  },
  members: [
    { 
      id: '1',
      user: { id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      role: 'OWNER',
      status: 'ACCEPTED',
      joinedAt: new Date(),
    },
    { 
      id: '2',
      user: { id: 'user2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      role: 'MEMBER',
      status: 'ACCEPTED',
      joinedAt: new Date(),
    },
    { 
      id: '3',
      user: { id: 'user3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com' },
      role: 'MEMBER',
      status: 'INVITED',
      joinedAt: null,
    },
  ],
  bookings: [
    {
      id: 'booking1',
      listing: {
        id: 'listing1',
        title: 'Luxury Beach Villa',
        images: ['https://example.com/villa.jpg'],
        city: 'Saly',
      },
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      total: 250000,
      status: 'confirmed',
      contributions: [
        { user: { firstName: 'John', lastName: 'Doe' }, amount: 125000, status: 'CAPTURED' },
        { user: { firstName: 'Jane', lastName: 'Smith' }, amount: 125000, status: 'CAPTURED' },
      ],
    },
  ],
  chatThread: [
    {
      id: 'msg1',
      senderId: 'user1',
      senderName: 'John Doe',
      message: 'Hey everyone! Looking forward to our beach weekend 🏖️',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'msg2',
      senderId: 'user2',
      senderName: 'Jane Smith',
      message: 'Same here! Should we plan some activities?',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ],
};

export function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'bookings'>('overview');

  // Mock query - replace with actual API call
  const { data: group, isLoading, refetch } = useQuery({
    queryKey: ['group', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockGroupDetail;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleInviteMember = () => {
    Alert.alert(
      'Invite Member',
      'Invite functionality will be implemented here',
      [{ text: 'OK' }]
    );
  };

  const handleSendMessage = () => {
    Alert.alert(
      'Send Message',
      'Chat functionality will be implemented here',
      [{ text: 'OK' }]
    );
  };

  if (isLoading || !group) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading group details...</Text>
        </View>
      </View>
    );
  }

  const acceptedMembers = group.members.filter(m => m.status === 'ACCEPTED');
  const pendingMembers = group.members.filter(m => m.status === 'INVITED');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.groupName}>{group.name}</Text>
          {group.description && (
            <Text style={styles.groupDescription}>{group.description}</Text>
          )}
          <Text style={styles.memberCount}>
            {acceptedMembers.length} members
            {pendingMembers.length > 0 && ` • ${pendingMembers.length} pending`}
          </Text>
        </View>
        <TouchableOpacity style={styles.inviteButton} onPress={handleInviteMember}>
          <Text style={styles.inviteButtonText}>+ Invite</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bookings' && styles.activeTab]}
          onPress={() => setActiveTab('bookings')}
        >
          <Text style={[styles.tabText, activeTab === 'bookings' && styles.activeTabText]}>
            Bookings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Members Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Members</Text>
              {group.members.map((member) => (
                <View key={member.id} style={styles.memberItem}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberInitial}>
                      {member.user.firstName[0]}{member.user.lastName[0]}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.user.firstName} {member.user.lastName}
                      {member.role === 'OWNER' && ' (Owner)'}
                    </Text>
                    <Text style={styles.memberEmail}>{member.user.email}</Text>
                  </View>
                  <View style={styles.memberStatus}>
                    <Text style={[
                      styles.statusText,
                      member.status === 'ACCEPTED' && styles.acceptedStatus,
                      member.status === 'INVITED' && styles.invitedStatus,
                    ]}>
                      {member.status === 'ACCEPTED' ? 'Joined' : 'Invited'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityItem}>
                <Text style={styles.activityText}>
                  Group created by {group.owner.firstName} {group.owner.lastName}
                </Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
              {group.bookings.length > 0 && (
                <View style={styles.activityItem}>
                  <Text style={styles.activityText}>
                    Booked {group.bookings[0].listing.title}
                  </Text>
                  <Text style={styles.activityTime}>1 day ago</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {activeTab === 'chat' && (
          <View style={styles.tabContent}>
            <View style={styles.chatContainer}>
              {group.chatThread.map((message) => (
                <View key={message.id} style={styles.chatMessage}>
                  <Text style={styles.chatSender}>{message.senderName}</Text>
                  <Text style={styles.chatText}>{message.message}</Text>
                  <Text style={styles.chatTime}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.sendMessageButton} onPress={handleSendMessage}>
              <Text style={styles.sendMessageText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'bookings' && (
          <View style={styles.tabContent}>
            {group.bookings.length > 0 ? (
              group.bookings.map((booking) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <Text style={styles.bookingTitle}>{booking.listing.title}</Text>
                  <Text style={styles.bookingDetails}>
                    {booking.listing.city} • {new Date(booking.startDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.bookingAmount}>
                    {(booking.total / 100).toLocaleString()} XOF
                  </Text>
                  <View style={styles.contributionsContainer}>
                    <Text style={styles.contributionsTitle}>Contributions:</Text>
                    {booking.contributions.map((contrib, index) => (
                      <Text key={index} style={styles.contributionItem}>
                        {contrib.user.firstName} {contrib.user.lastName}: {(contrib.amount / 100).toLocaleString()} XOF
                      </Text>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyBookings}>
                <Text style={styles.emptyBookingsText}>No bookings yet</Text>
                <Text style={styles.emptyBookingsSubtext}>
                  Start planning your group experience
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: palmeraTheme.colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 16,
    color: palmeraTheme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  memberCount: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
  },
  inviteButton: {
    backgroundColor: palmeraTheme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inviteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: palmeraTheme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: palmeraTheme.colors.textMuted,
  },
  activeTabText: {
    color: palmeraTheme.colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palmeraTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: palmeraTheme.colors.text,
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
  },
  memberStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  acceptedStatus: {
    color: '#22c55e',
  },
  invitedStatus: {
    color: '#f59e0b',
  },
  activityItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityText: {
    fontSize: 14,
    color: palmeraTheme.colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: palmeraTheme.colors.textMuted,
  },
  chatContainer: {
    marginBottom: 20,
  },
  chatMessage: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  chatSender: {
    fontSize: 14,
    fontWeight: '600',
    color: palmeraTheme.colors.primary,
    marginBottom: 4,
  },
  chatText: {
    fontSize: 16,
    color: palmeraTheme.colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  chatTime: {
    fontSize: 12,
    color: palmeraTheme.colors.textMuted,
  },
  sendMessageButton: {
    backgroundColor: palmeraTheme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendMessageText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 4,
  },
  bookingDetails: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
    marginBottom: 8,
  },
  bookingAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.primary,
    marginBottom: 12,
  },
  contributionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  contributionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  contributionItem: {
    fontSize: 14,
    color: palmeraTheme.colors.textSecondary,
    marginBottom: 4,
  },
  emptyBookings: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyBookingsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  emptyBookingsSubtext: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
  },
});
