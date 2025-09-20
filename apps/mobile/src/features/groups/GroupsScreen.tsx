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
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';
import { useAuth } from '@/contexts/AuthContext';

// Mock API calls - replace with actual SDK calls
const mockGroups = [
  {
    id: '1',
    name: 'Weekend in Saly',
    description: 'Beach weekend with the crew',
    owner: { firstName: 'John', lastName: 'Doe' },
    members: [
      { user: { firstName: 'John', lastName: 'Doe' } },
      { user: { firstName: 'Jane', lastName: 'Smith' } },
      { user: { firstName: 'Mike', lastName: 'Johnson' } },
    ],
    _count: { bookings: 2 },
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Dakar Adventure',
    description: 'Exploring the capital city',
    owner: { firstName: 'Sarah', lastName: 'Wilson' },
    members: [
      { user: { firstName: 'Sarah', lastName: 'Wilson' } },
      { user: { firstName: 'Alex', lastName: 'Brown' } },
    ],
    _count: { bookings: 0 },
    updatedAt: new Date(),
  },
];

export function GroupsScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Mock query - replace with actual API call
  const { data: groups, isLoading, refetch } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockGroups;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreateGroup = () => {
    router.push('/groups/create' as any);
  };

  const handleGroupPress = (groupId: string) => {
    router.push(`/groups/${groupId}` as any);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your groups...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Groups</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {groups && groups.length > 0 ? (
          <View style={styles.groupsList}>
            {groups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.groupCard}
                onPress={() => handleGroupPress(group.id)}
              >
                <View style={styles.groupHeader}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupMemberCount}>
                    {group.members.length} members
                  </Text>
                </View>
                
                {group.description && (
                  <Text style={styles.groupDescription}>{group.description}</Text>
                )}

                <View style={styles.groupFooter}>
                  <View style={styles.groupStats}>
                    <Text style={styles.groupStat}>
                      {group._count.bookings} bookings
                    </Text>
                    <Text style={styles.groupOwner}>
                      by {group.owner.firstName} {group.owner.lastName}
                    </Text>
                  </View>
                  
                  <View style={styles.memberAvatars}>
                    {group.members.slice(0, 3).map((member, index) => (
                      <View key={index} style={[styles.memberAvatar, { marginLeft: index > 0 ? -8 : 0 }]}>
                        <Text style={styles.memberInitial}>
                          {member.user.firstName[0]}{member.user.lastName[0]}
                        </Text>
                      </View>
                    ))}
                    {group.members.length > 3 && (
                      <View style={[styles.memberAvatar, styles.moreMembers, { marginLeft: -8 }]}>
                        <Text style={styles.memberInitial}>+{group.members.length - 3}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateTitle}>No Groups Yet</Text>
            <Text style={styles.emptyStateDescription}>
              Create a group to plan experiences with friends and family
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={handleCreateGroup}>
              <Text style={styles.emptyStateButtonText}>Create Your First Group</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
  },
  createButton: {
    backgroundColor: palmeraTheme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  groupsList: {
    padding: 20,
  },
  groupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    flex: 1,
  },
  groupMemberCount: {
    fontSize: 14,
    color: palmeraTheme.colors.textMuted,
  },
  groupDescription: {
    fontSize: 14,
    color: palmeraTheme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupStats: {
    flex: 1,
  },
  groupStat: {
    fontSize: 12,
    color: palmeraTheme.colors.textMuted,
    marginBottom: 2,
  },
  groupOwner: {
    fontSize: 12,
    color: palmeraTheme.colors.textMuted,
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palmeraTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  moreMembers: {
    backgroundColor: palmeraTheme.colors.textMuted,
  },
  memberInitial: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: palmeraTheme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyStateButton: {
    backgroundColor: palmeraTheme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
