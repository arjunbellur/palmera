import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DesignShowcase from '../components/DesignShowcase';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => navigation.navigate('Welcome')
        },
      ]
    );
  };

  const experiences = [
    {
      id: 1,
      title: 'Dakar City Tour',
      location: 'Dakar, Senegal',
      price: '$45',
      rating: 4.8,
      image: '🏛️',
    },
    {
      id: 2,
      title: 'Goree Island Visit',
      location: 'Goree Island',
      price: '$35',
      rating: 4.9,
      image: '🏝️',
    },
    {
      id: 3,
      title: 'Traditional Cooking Class',
      location: 'Saint-Louis',
      price: '$60',
      rating: 4.7,
      image: '🍽️',
    },
    {
      id: 4,
      title: 'Desert Safari',
      location: 'Lompoul Desert',
      price: '$120',
      rating: 4.9,
      image: '🏜️',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-border">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-text">Welcome back!</Text>
              <Text className="text-textSecondary">Discover amazing experiences</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-surface border border-border rounded-lg px-3 py-2"
            >
              <Text className="text-text font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-6 py-4">
          <View className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center">
            <Text className="text-lg mr-3">🔍</Text>
            <Text className="text-textMuted flex-1">Search experiences...</Text>
          </View>
        </View>

        {/* Categories */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-text mb-4">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {['All', 'Culture', 'Adventure', 'Food', 'Nature'].map((category, index) => (
                <TouchableOpacity
                  key={index}
                  className={`px-4 py-2 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-surface border border-border'
                  }`}
                >
                  <Text className={`font-medium ${
                    index === 0 ? 'text-white' : 'text-text'
                  }`}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Experiences */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-text mb-4">Featured Experiences</Text>
          <View className="space-y-4">
            {experiences.map((experience) => (
              <TouchableOpacity
                key={experience.id}
                className="bg-white border border-border rounded-lg p-4"
              >
                <View className="flex-row space-x-4">
                  <View className="w-16 h-16 bg-surface rounded-lg items-center justify-center">
                    <Text className="text-2xl">{experience.image}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-text mb-1">
                      {experience.title}
                    </Text>
                    <Text className="text-sm text-textSecondary mb-2">
                      📍 {experience.location}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Text className="text-sm text-textSecondary mr-1">⭐</Text>
                        <Text className="text-sm text-textSecondary">
                          {experience.rating}
                        </Text>
                      </View>
                      <Text className="text-lg font-bold text-primary">
                        {experience.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

          {/* Quick Actions */}
          <View className="px-6 pb-8">
            <Text className="text-lg font-semibold text-text mb-4">Quick Actions</Text>
            <View className="space-y-3">
              <View className="flex-row space-x-3">
                <TouchableOpacity className="flex-1 bg-primary rounded-lg py-4 items-center">
                  <Text className="text-white font-semibold">Browse All</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-secondary rounded-lg py-4 items-center">
                  <Text className="text-white font-semibold">My Bookings</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                className="bg-accent rounded-lg py-4 items-center"
                onPress={() => navigation.navigate('DesignShowcase')}
              >
                <Text className="text-white font-semibold">🎨 View Design System</Text>
              </TouchableOpacity>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}
