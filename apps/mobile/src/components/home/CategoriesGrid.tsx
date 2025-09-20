import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';

const categories = [
  { id: 'accommodation', name: 'Accommodation', icon: '🏨' },
  { id: 'adventure', name: 'Adventure', icon: '🏔️' },
  { id: 'culture', name: 'Culture', icon: '🏛️' },
  { id: 'food', name: 'Food & Dining', icon: '🍽️' },
  { id: 'wellness', name: 'Wellness', icon: '🧘' },
  { id: 'nightlife', name: 'Nightlife', icon: '🍸' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'nature', name: 'Nature', icon: '🌿' },
];

export function CategoriesGrid() {
  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/search',
      params: { category: categoryId },
    });
  };

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={4}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  grid: {
    gap: 16,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    marginHorizontal: 4,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    textAlign: 'center',
  },
});