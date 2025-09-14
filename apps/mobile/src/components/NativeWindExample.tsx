import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function NativeWindExample() {
  return (
    <View className="flex-1 bg-green-800 p-6">
      <Text className="text-3xl font-bold text-white mb-4 text-center">
        🌴 NativeWind Demo
      </Text>
      
      <View className="bg-green-700 rounded-lg p-4 mb-4">
        <Text className="text-white text-lg font-semibold mb-2">
          Tailwind CSS in React Native
        </Text>
        <Text className="text-green-100 text-sm leading-5">
          This component uses NativeWind to apply Tailwind CSS classes directly to React Native components.
        </Text>
      </View>

      <TouchableOpacity className="bg-white rounded-lg p-4 mb-4 active:bg-gray-100">
        <Text className="text-green-800 font-semibold text-center">
          Touchable Button
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-between">
        <View className="bg-green-600 rounded-lg p-3 flex-1 mr-2">
          <Text className="text-white text-center font-medium">Card 1</Text>
        </View>
        <View className="bg-green-600 rounded-lg p-3 flex-1 ml-2">
          <Text className="text-white text-center font-medium">Card 2</Text>
        </View>
      </View>
    </View>
  );
}
