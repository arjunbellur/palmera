import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { palmeraTheme } from '../../theme/palmeraTheme';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, any email/password will work
      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to main app (tabs)
            router.replace('/(tabs)');
          }
        }
      ]);
    }, 1000);
  };

  const handleSkipLogin = () => {
    // Skip login and go directly to main app
    router.replace('/(tabs)');
  };

  const handleBackToWelcome = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[palmeraTheme.colors.primary, palmeraTheme.colors.secondary]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoWrapper}>
                <Text style={styles.logo}>🌴</Text>
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your Palmera account</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={palmeraTheme.colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={palmeraTheme.colors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.skipButton}
                onPress={handleSkipLogin}
              >
                <Text style={styles.skipButtonText}>
                  Skip Login (Demo Mode)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBackToWelcome}
              >
                <Text style={styles.backButtonText}>
                  ← Back to Welcome
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: palmeraTheme.spacing[10],
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: palmeraTheme.spacing[6],
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logo: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.background,
    marginBottom: palmeraTheme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: palmeraTheme.colors.background,
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: '400',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: palmeraTheme.spacing[5],
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.background,
    marginBottom: palmeraTheme.spacing[2],
  },
  input: {
    backgroundColor: palmeraTheme.colors.background,
    borderRadius: palmeraTheme.borderRadius.lg,
    paddingHorizontal: palmeraTheme.spacing[4],
    paddingVertical: palmeraTheme.spacing[4],
    fontSize: 16,
    color: palmeraTheme.colors.text,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loginButton: {
    backgroundColor: palmeraTheme.colors.accent,
    paddingVertical: palmeraTheme.spacing[4],
    borderRadius: palmeraTheme.borderRadius.xl,
    alignItems: 'center',
    marginTop: palmeraTheme.spacing[2],
    marginBottom: palmeraTheme.spacing[4],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: palmeraTheme.colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: palmeraTheme.spacing[4],
    borderRadius: palmeraTheme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palmeraTheme.colors.background,
    marginBottom: palmeraTheme.spacing[4],
  },
  skipButtonText: {
    color: palmeraTheme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: palmeraTheme.colors.background,
    fontSize: 14,
    opacity: 0.8,
  },
});
