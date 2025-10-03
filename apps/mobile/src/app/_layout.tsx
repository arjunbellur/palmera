import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { palmeraTheme } from '../theme/palmeraTheme';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SDKProvider } from '../contexts/SDKContext';
import { AuthProvider } from '../contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <SDKProvider>
              <AuthProvider>
              <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: palmeraTheme.colors.primary,
              },
              headerTintColor: palmeraTheme.colors.background,
              headerTitleStyle: {
                fontFamily: palmeraTheme.typography.fontFamily.display,
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{ 
                title: 'Palmera',
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="auth/login" 
              options={{ 
                title: 'Sign In',
                presentation: 'modal'
              }} 
            />
            <Stack.Screen 
              name="auth/verify-magic-link" 
              options={{ 
                title: 'Verify Magic Link',
                presentation: 'modal'
              }} 
            />
            <Stack.Screen 
              name="auth/password-reset-request" 
              options={{ 
                title: 'Reset Password',
                presentation: 'modal'
              }} 
            />
            <Stack.Screen 
              name="auth/password-reset" 
              options={{ 
                title: 'Set New Password',
                presentation: 'modal'
              }} 
            />
            <Stack.Screen 
              name="listing/[id]" 
              options={{ 
                title: 'Experience Details'
              }} 
            />
            <Stack.Screen 
              name="search" 
              options={{ 
                title: 'Search Experiences'
              }} 
            />
            <Stack.Screen 
              name="booking/start" 
              options={{ 
                title: 'Book Experience'
              }} 
            />
            <Stack.Screen 
              name="booking/review" 
              options={{ 
                title: 'Review Booking'
              }} 
            />
            <Stack.Screen 
              name="booking/payment" 
              options={{ 
                title: 'Payment'
              }} 
            />
            <Stack.Screen 
              name="booking/result" 
              options={{ 
                title: 'Booking Result',
                headerShown: false
              }} 
            />
            <Stack.Screen 
              name="booking/[id]" 
              options={{ 
                title: 'Booking Details'
              }} 
            />
            <Stack.Screen 
              name="profile" 
              options={{ 
                title: 'Profile'
              }} 
            />
            <Stack.Screen 
              name="my-bookings" 
              options={{ 
                title: 'My Bookings'
              }} 
            />
            <Stack.Screen 
              name="membership" 
              options={{ 
                title: 'Membership'
              }} 
            />
              </Stack>
              <StatusBar style="light" backgroundColor="#000000" translucent={false} />
              <Toast />
              </AuthProvider>
            </SDKProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
