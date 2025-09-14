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

interface SignupScreenProps {
  navigation: any;
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
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
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-6">
                <Text className="text-3xl">🌴</Text>
              </View>
              <Text className="text-3xl font-bold text-text mb-2">
                Join Palmera
              </Text>
              <Text className="text-base text-textSecondary text-center">
                Create your account and start exploring amazing experiences
              </Text>
            </View>

            {/* Signup Form */}
            <View className="space-y-4">
              {/* Name Fields */}
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-text mb-2">
                    First Name
                  </Text>
                  <View className="bg-surface border border-border rounded-lg">
                    <TextInput
                      className="px-4 py-3 text-base text-text"
                      placeholder="First name"
                      placeholderTextColor="#9CA3AF"
                      value={formData.firstName}
                      onChangeText={(value) => handleInputChange('firstName', value)}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
                
                <View className="flex-1">
                  <Text className="text-sm font-medium text-text mb-2">
                    Last Name
                  </Text>
                  <View className="bg-surface border border-border rounded-lg">
                    <TextInput
                      className="px-4 py-3 text-base text-text"
                      placeholder="Last name"
                      placeholderTextColor="#9CA3AF"
                      value={formData.lastName}
                      onChangeText={(value) => handleInputChange('lastName', value)}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              </View>

              {/* Email Input */}
              <View>
                <Text className="text-sm font-medium text-text mb-2">
                  Email Address
                </Text>
                <View className="bg-surface border border-border rounded-lg">
                  <TextInput
                    className="px-4 py-3 text-base text-text"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
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
                    className="px-4 py-3 text-base text-text"
                    placeholder="Create a password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Confirm Password Input */}
              <View>
                <Text className="text-sm font-medium text-text mb-2">
                  Confirm Password
                </Text>
                <View className="bg-surface border border-border rounded-lg">
                  <TextInput
                    className="px-4 py-3 text-base text-text"
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Terms and Conditions */}
              <View className="flex-row items-start space-x-3 py-2">
                <TouchableOpacity
                  onPress={() => setAcceptTerms(!acceptTerms)}
                  className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${
                    acceptTerms ? 'bg-primary border-primary' : 'border-border'
                  }`}
                >
                  {acceptTerms && <Text className="text-white text-xs">✓</Text>}
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className="text-sm text-textSecondary leading-5">
                    I agree to the{' '}
                    <Text className="text-primary font-medium">Terms of Service</Text>
                    {' '}and{' '}
                    <Text className="text-primary font-medium">Privacy Policy</Text>
                  </Text>
                </View>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                className={`bg-primary rounded-lg py-4 mt-4 ${
                  isLoading ? 'opacity-50' : ''
                }`}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-border" />
                <Text className="mx-4 text-textMuted text-sm">or</Text>
                <View className="flex-1 h-px bg-border" />
              </View>

              {/* Social Signup */}
              <View className="space-y-3">
                <TouchableOpacity className="bg-white border border-border rounded-lg py-4 flex-row items-center justify-center">
                  <Text className="text-lg mr-2">📧</Text>
                  <Text className="text-text font-medium">Sign up with Google</Text>
                </TouchableOpacity>
                
                <TouchableOpacity className="bg-white border border-border rounded-lg py-4 flex-row items-center justify-center">
                  <Text className="text-lg mr-2">📱</Text>
                  <Text className="text-text font-medium">Sign up with Apple</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="px-6 pb-8">
            <View className="flex-row justify-center items-center">
              <Text className="text-textMuted text-sm">
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-primary font-semibold text-sm">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
