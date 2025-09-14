import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { palmeraTheme } from '@palmera/ui';

export default function WelcomeScreen() {
  useEffect(() => {
    // Check if user is already logged in
    // If yes, redirect to main app
    // If no, show welcome screen
  }, []);

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const handleSignUp = () => {
    router.push('/auth/register');
  };

  return (
    <LinearGradient
      colors={[palmeraTheme.colors.primary, palmeraTheme.colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🌴</Text>
          <Text style={styles.title}>Palmera</Text>
          <Text style={styles.subtitle}>Premium Experiences in Africa</Text>
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Discover and book exclusive experiences in Dakar, Saly, and beyond. 
            From luxury beach villas to thrilling jet ski adventures.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUp}>
            <Text style={styles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.background,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: palmeraTheme.colors.background,
    opacity: 0.9,
  },
  description: {
    marginBottom: 48,
  },
  descriptionText: {
    fontSize: 16,
    color: palmeraTheme.colors.background,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: palmeraTheme.colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: palmeraTheme.borderRadius.xl,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: palmeraTheme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: palmeraTheme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palmeraTheme.colors.background,
  },
  secondaryButtonText: {
    color: palmeraTheme.colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
});
