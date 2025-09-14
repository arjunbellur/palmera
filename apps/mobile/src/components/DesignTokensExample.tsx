import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function DesignTokensExample() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-2xl font-bold text-text mb-6 text-center">
          🎨 Design Tokens with NativeWind
        </Text>

        {/* Brand Colors */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-text mb-3">Brand Colors</Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-midnight rounded-lg p-3 flex-1 min-w-[100px]">
              <Text className="text-ivory text-center text-sm font-medium">Midnight</Text>
            </View>
            <View className="bg-palm rounded-lg p-3 flex-1 min-w-[100px]">
              <Text className="text-midnight text-center text-sm font-medium">Palm</Text>
            </View>
            <View className="bg-ivory rounded-lg p-3 flex-1 min-w-[100px]">
              <Text className="text-midnight text-center text-sm font-medium">Ivory</Text>
            </View>
            <View className="bg-sandstone rounded-lg p-3 flex-1 min-w-[100px]">
              <Text className="text-midnight text-center text-sm font-medium">Sandstone</Text>
            </View>
            <View className="bg-gold rounded-lg p-3 flex-1 min-w-[100px]">
              <Text className="text-midnight text-center text-sm font-medium">Gold</Text>
            </View>
          </View>
        </View>

        {/* Semantic Colors */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-text mb-3">Semantic Colors</Text>
          <View className="space-y-2">
            <View className="bg-primary rounded-lg p-3">
              <Text className="text-white text-center font-medium">Primary</Text>
            </View>
            <View className="bg-secondary rounded-lg p-3">
              <Text className="text-white text-center font-medium">Secondary</Text>
            </View>
            <View className="bg-accent rounded-lg p-3">
              <Text className="text-white text-center font-medium">Accent</Text>
            </View>
            <View className="bg-success rounded-lg p-3">
              <Text className="text-white text-center font-medium">Success</Text>
            </View>
            <View className="bg-warning rounded-lg p-3">
              <Text className="text-white text-center font-medium">Warning</Text>
            </View>
            <View className="bg-error rounded-lg p-3">
              <Text className="text-white text-center font-medium">Error</Text>
            </View>
          </View>
        </View>

        {/* Typography */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-text mb-3">Typography</Text>
          <View className="space-y-3">
            <Text className="text-4xl font-bold text-text">Heading 1</Text>
            <Text className="text-3xl font-semibold text-text">Heading 2</Text>
            <Text className="text-2xl font-medium text-text">Heading 3</Text>
            <Text className="text-lg text-text">Body Large</Text>
            <Text className="text-base text-textSecondary">Body Regular</Text>
            <Text className="text-sm text-textMuted">Body Small</Text>
          </View>
        </View>

        {/* Spacing & Layout */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-text mb-3">Spacing & Layout</Text>
          <View className="bg-surface rounded-lg p-4">
            <View className="bg-primary rounded-lg p-2 mb-2">
              <Text className="text-white text-center text-sm">Padding 2</Text>
            </View>
            <View className="bg-secondary rounded-lg p-4 mb-4">
              <Text className="text-white text-center text-sm">Padding 4</Text>
            </View>
            <View className="bg-accent rounded-lg p-6">
              <Text className="text-white text-center text-sm">Padding 6</Text>
            </View>
          </View>
        </View>

        {/* Interactive Elements */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-text mb-3">Interactive Elements</Text>
          <View className="space-y-3">
            <TouchableOpacity className="bg-primary rounded-lg p-4 active:bg-primary/80">
              <Text className="text-white text-center font-semibold">Primary Button</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-secondary rounded-lg p-4 active:bg-secondary/80">
              <Text className="text-white text-center font-semibold">Secondary Button</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border-2 border-primary rounded-lg p-4 active:bg-primary/10">
              <Text className="text-primary text-center font-semibold">Outline Button</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-text mb-3">Cards</Text>
          <View className="space-y-3">
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-text font-semibold mb-2">Experience Card</Text>
              <Text className="text-textSecondary text-sm mb-3">
                Discover amazing experiences in Senegal with our curated selection of activities.
              </Text>
              <TouchableOpacity className="bg-primary rounded-lg p-2">
                <Text className="text-white text-center text-sm font-medium">Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
