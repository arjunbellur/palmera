import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { palmeraTheme } from '@palmera/ui';
import { UserClient, FilesClient } from '@palmera/sdk';
import { 
  UserIcon, 
  CameraIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import * as ImagePicker from 'expo-image-picker';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const userClient = new UserClient();
  const filesClient = new FilesClient();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userClient.getProfile(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileForm) => userClient.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
    },
  });

  React.useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || '',
      });
    }
  }, [profile, reset]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleSave = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const handleAvatarUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        
        const asset = result.assets[0];
        const signedUrlResponse = await filesClient.getSignedUrl({
          fileName: `avatar-${Date.now()}.jpg`,
          contentType: 'image/jpeg',
          fileSize: asset.fileSize || 0,
          purpose: 'avatar',
        });

        // Upload to signed URL
        const uploadResponse = await fetch(signedUrlResponse.uploadUrl, {
          method: 'PUT',
          body: asset.uri,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });

        if (uploadResponse.ok) {
          // Update user profile with new avatar URL
          await userClient.updateProfile({ avatar: signedUrlResponse.fileUrl });
          queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
          Alert.alert('Success', 'Avatar updated successfully');
        } else {
          throw new Error('Upload failed');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {profile?.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <UserIcon size={40} color={palmeraTheme.colors.textMuted} />
              </View>
            )}
            <TouchableOpacity
              style={styles.avatarEditButton}
              onPress={handleAvatarUpload}
              disabled={isUploading}
            >
              <CameraIcon size={16} color={palmeraTheme.colors.background} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text style={styles.userEmail}>{profile?.email}</Text>
        </View>

        {/* Profile Form */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!isEditing ? (
              <TouchableOpacity onPress={handleEdit}>
                <PencilIcon size={20} color={palmeraTheme.colors.accent} />
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity onPress={handleCancel}>
                  <XMarkIcon size={20} color={palmeraTheme.colors.error} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit(handleSave)}>
                  <CheckIcon size={20} color={palmeraTheme.colors.success} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, errors.firstName && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={isEditing}
                      placeholder="Enter first name"
                      placeholderTextColor={palmeraTheme.colors.textMuted}
                    />
                    {errors.firstName && (
                      <Text style={styles.errorText}>{errors.firstName.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, errors.lastName && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={isEditing}
                      placeholder="Enter last name"
                      placeholderTextColor={palmeraTheme.colors.textMuted}
                    />
                    {errors.lastName && (
                      <Text style={styles.errorText}>{errors.lastName.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, errors.phone && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={isEditing}
                      placeholder="Enter phone number"
                      placeholderTextColor={palmeraTheme.colors.textMuted}
                      keyboardType="phone-pad"
                    />
                    {errors.phone && (
                      <Text style={styles.errorText}>{errors.phone.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/my-bookings')}
          >
            <Text style={styles.actionButtonText}>My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/membership')}
          >
            <Text style={styles.actionButtonText}>Membership</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palmeraTheme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: palmeraTheme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palmeraTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: palmeraTheme.colors.textMuted,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: palmeraTheme.typography.fontFamily.display,
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 4,
  },
  input: {
    height: 48,
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
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: palmeraTheme.colors.background,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: palmeraTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palmeraTheme.colors.text,
  },
  logoutButton: {
    borderColor: palmeraTheme.colors.error,
    backgroundColor: palmeraTheme.colors.error + '10',
  },
  logoutButtonText: {
    color: palmeraTheme.colors.error,
  },
});
