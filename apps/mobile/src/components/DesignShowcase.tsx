import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function DesignShowcase() {
  return (
    <ScrollView className="flex-1 bg-background p-6">
      <Text className="text-2xl font-bold text-text mb-6 text-center">
        🎨 Design System Showcase
      </Text>

      {/* Color Palette */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-text mb-4">Brand Colors</Text>
        <View className="space-y-3">
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-midnight rounded-lg p-4">
              <Text className="text-ivory text-center font-medium">Midnight</Text>
            </View>
            <View className="flex-1 bg-palm rounded-lg p-4">
              <Text className="text-midnight text-center font-medium">Palm</Text>
            </View>
          </View>
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-ivory rounded-lg p-4">
              <Text className="text-midnight text-center font-medium">Ivory</Text>
            </View>
            <View className="flex-1 bg-sandstone rounded-lg p-4">
              <Text className="text-midnight text-center font-medium">Sandstone</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Typography */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-text mb-4">Typography</Text>
        <View className="space-y-3">
          <Text className="text-3xl font-bold text-text">Heading 1</Text>
          <Text className="text-2xl font-semibold text-text">Heading 2</Text>
          <Text className="text-xl font-medium text-text">Heading 3</Text>
          <Text className="text-lg text-text">Body Large</Text>
          <Text className="text-base text-textSecondary">Body Regular</Text>
          <Text className="text-sm text-textMuted">Body Small</Text>
        </View>
      </View>

      {/* Buttons */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-text mb-4">Buttons</Text>
        <View className="space-y-3">
          <TouchableOpacity className="bg-primary rounded-lg py-4">
            <Text className="text-white text-center font-semibold">Primary Button</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-secondary rounded-lg py-4">
            <Text className="text-white text-center font-semibold">Secondary Button</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border-2 border-primary rounded-lg py-4">
            <Text className="text-primary text-center font-semibold">Outline Button</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cards */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-text mb-4">Cards</Text>
        <View className="space-y-3">
          <View className="bg-surface border border-border rounded-lg p-4">
            <Text className="text-text font-semibold mb-2">Experience Card</Text>
            <Text className="text-textSecondary text-sm mb-3">
              Beautiful card design using our design tokens
            </Text>
            <TouchableOpacity className="bg-primary rounded-lg py-2">
              <Text className="text-white text-center text-sm font-medium">Action</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Spacing */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-text mb-4">Spacing</Text>
        <View className="space-y-2">
          <View className="bg-primary rounded h-2" style={{ width: 20 }} />
          <View className="bg-primary rounded h-2" style={{ width: 40 }} />
          <View className="bg-primary rounded h-2" style={{ width: 60 }} />
          <View className="bg-primary rounded h-2" style={{ width: 80 }} />
        </View>
      </View>
    </ScrollView>
  );
}
