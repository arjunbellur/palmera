import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { palmeraTheme } from '../theme/palmeraTheme';

export default function WelcomeScreen() {
  useEffect(() => {
    // Auto-skip to main app to test navigation
    setTimeout(() => {
      router.push('/(tabs)');
    }, 2000);
  }, []);

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const handleSignUp = () => {
    router.push('/auth/register' as any);
  };

  const handleSkipToApp = () => {
    router.push('/(tabs)');
  };

  return (
    <LinearGradient
      colors={[palmeraTheme.colors.primary, palmeraTheme.colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Text style={styles.logo}>🌴</Text>
          </View>
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
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkipToApp}>
            <Text style={styles.skipButtonText}>Continue as Guest</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: palmeraTheme.spacing[6],
    paddingVertical: palmeraTheme.spacing[16],
    paddingTop: palmeraTheme.spacing[20],
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: palmeraTheme.spacing[8],
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: palmeraTheme.spacing[6],
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logo: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.background,
    marginBottom: palmeraTheme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: palmeraTheme.colors.background,
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: '500',
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
    marginBottom: palmeraTheme.spacing[8],
    paddingHorizontal: palmeraTheme.spacing[2],
  },
  primaryButton: {
    backgroundColor: palmeraTheme.colors.accent,
    paddingVertical: palmeraTheme.spacing[4],
    borderRadius: palmeraTheme.borderRadius.xl,
    alignItems: 'center',
    marginBottom: palmeraTheme.spacing[3],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: palmeraTheme.colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: palmeraTheme.spacing[4],
    paddingHorizontal: palmeraTheme.spacing[8],
    borderRadius: palmeraTheme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palmeraTheme.colors.background,
    marginBottom: palmeraTheme.spacing[3],
  },
  secondaryButtonText: {
    color: palmeraTheme.colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: palmeraTheme.spacing[3],
    paddingHorizontal: palmeraTheme.spacing[6],
    borderRadius: palmeraTheme.borderRadius.lg,
    alignItems: 'center',
  },
  skipButtonText: {
    color: palmeraTheme.colors.background,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
});
