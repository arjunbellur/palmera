import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { palmeraTheme } from '@palmera/ui';
import { AuthClient } from '@palmera/sdk';

const verifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

type VerifyForm = z.infer<typeof verifySchema>;

export function VerifyMagicLinkScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);
  const { token: urlToken } = useLocalSearchParams<{ token?: string }>();
  const authClient = new AuthClient();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
  });

  useEffect(() => {
    if (urlToken) {
      setValue('token', urlToken);
      handleAutoVerify(urlToken);
    }
  }, [urlToken]);

  const handleAutoVerify = async (token: string) => {
    try {
      setIsAutoVerifying(true);
      const result = await authClient.verifyMagicLink(token);
      
      // Store auth tokens
      // TODO: Implement secure token storage
      
      Alert.alert(
        'Success',
        'You have been signed in successfully!',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        'The magic link is invalid or has expired. Please request a new one.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/auth/login'),
          },
        ]
      );
    } finally {
      setIsAutoVerifying(false);
    }
  };

  const onSubmit = async (data: VerifyForm) => {
    try {
      setIsLoading(true);
      const result = await authClient.verifyMagicLink(data.token);
      
      // Store auth tokens
      // TODO: Implement secure token storage
      
      Alert.alert(
        'Success',
        'You have been signed in successfully!',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        'The magic link is invalid or has expired. Please request a new one.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isAutoVerifying) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palmeraTheme.colors.primary} />
        <Text style={styles.loadingText}>Verifying your magic link...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Magic Link</Text>
        <Text style={styles.subtitle}>
          Enter the verification code from your email
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="token"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={[styles.input, errors.token && styles.inputError]}
                placeholder="Enter verification code"
                placeholderTextColor={palmeraTheme.colors.textMuted}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.token && (
                <Text style={styles.errorText}>{errors.token.message}</Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.linkText}>Request new magic link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: palmeraTheme.colors.textSecondary,
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: palmeraTheme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    borderRadius: palmeraTheme.borderRadius.lg,
    paddingHorizontal: 16,
    fontSize: 16,
    color: palmeraTheme.colors.text,
    backgroundColor: palmeraTheme.colors.background,
  },
  inputError: {
    borderColor: palmeraTheme.colors.error,
  },
  errorText: {
    fontSize: 14,
    color: palmeraTheme.colors.error,
    marginTop: 4,
  },
  button: {
    height: 56,
    backgroundColor: palmeraTheme.colors.primary,
    borderRadius: palmeraTheme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.background,
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: palmeraTheme.colors.accent,
    fontWeight: '500',
  },
});
