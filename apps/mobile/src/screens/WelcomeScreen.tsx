import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WelcomeScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const features = [
    {
      icon: '🏖️',
      title: 'Discover Experiences',
      description: 'Find unique activities and adventures in Senegal',
    },
    {
      icon: '📅',
      title: 'Easy Booking',
      description: 'Book your experiences with just a few taps',
    },
    {
      icon: '⭐',
      title: 'Premium Quality',
      description: 'Curated experiences from trusted local providers',
    },
    {
      icon: '🌍',
      title: 'Local Culture',
      description: 'Immerse yourself in authentic Senegalese culture',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Hero Section */}
        <View className="flex-1 justify-center px-6">
          {/* Logo */}
          <View className="items-center mb-12">
            <View className="w-24 h-24 bg-primary rounded-full items-center justify-center mb-8">
              <Text className="text-4xl">🌴</Text>
            </View>
            <Text className="text-4xl font-bold text-text mb-4 text-center">
              Welcome to Palmera
            </Text>
            <Text className="text-lg text-textSecondary text-center leading-6">
              Premium experiences in Senegal. Discover, book, and create unforgettable memories.
            </Text>
          </View>

          {/* Features */}
          <View className="space-y-6 mb-12">
            {features.map((feature, index) => (
              <View key={index} className="flex-row items-center space-x-4">
                <View className="w-12 h-12 bg-surface rounded-full items-center justify-center">
                  <Text className="text-xl">{feature.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-text mb-1">
                    {feature.title}
                  </Text>
                  <Text className="text-sm text-textSecondary">
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View className="space-y-4">
            <TouchableOpacity
              className="bg-primary rounded-lg py-4"
              onPress={() => navigation.navigate('Signup')}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Get Started
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-surface border border-border rounded-lg py-4"
              onPress={() => navigation.navigate('Login')}
            >
              <Text className="text-text text-center text-lg font-semibold">
                I Already Have an Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 pb-8">
          <View className="items-center">
            <Text className="text-xs text-textMuted text-center leading-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
