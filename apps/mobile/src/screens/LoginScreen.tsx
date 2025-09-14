import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Home');
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-1 justify-center px-6">
            {/* Logo and Title */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-6">
                <Text className="text-3xl">🌴</Text>
              </View>
              <Text className="text-3xl font-bold text-text mb-2">
                Welcome Back
              </Text>
              <Text className="text-base text-textSecondary text-center">
                Sign in to continue your journey with Palmera
              </Text>
            </View>

            {/* Login Form */}
            <View className="space-y-6">
              {/* Email Input */}
              <View>
                <Text className="text-sm font-medium text-text mb-2">
                  Email Address
                </Text>
                <View className="bg-surface border border-border rounded-lg">
                  <TextInput
                    className="px-4 py-4 text-base text-text"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-sm font-medium text-text mb-2">
                  Password
                </Text>
                <View className="bg-surface border border-border rounded-lg">
                  <TextInput
                    className="px-4 py-4 text-base text-text"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Forgot Password */}
              <View className="items-end">
                <TouchableOpacity>
                  <Text className="text-sm text-primary font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className={`bg-primary rounded-lg py-4 ${
                  isLoading ? 'opacity-50' : ''
                }`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-border" />
                <Text className="mx-4 text-textMuted text-sm">or</Text>
                <View className="flex-1 h-px bg-border" />
              </View>

              {/* Social Login */}
              <View className="space-y-3">
                <TouchableOpacity className="bg-white border border-border rounded-lg py-4 flex-row items-center justify-center">
                  <Text className="text-lg mr-2">📧</Text>
                  <Text className="text-text font-medium">Continue with Google</Text>
                </TouchableOpacity>
                
                <TouchableOpacity className="bg-white border border-border rounded-lg py-4 flex-row items-center justify-center">
                  <Text className="text-lg mr-2">📱</Text>
                  <Text className="text-text font-medium">Continue with Apple</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="px-6 pb-8">
            <View className="flex-row justify-center items-center">
              <Text className="text-textMuted text-sm">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text className="text-primary font-semibold text-sm">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
