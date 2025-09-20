import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';
import { Text } from 'react-native';

export function SearchBar() {
  const handleSearchPress = () => {
    router.push('/search');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search experiences..."
          placeholderTextColor={palmeraTheme.colors.textMuted}
          editable={false}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  searchIcon: {
    fontSize: 20,
    color: palmeraTheme.colors.textMuted,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: palmeraTheme.colors.text,
  },
});