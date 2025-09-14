import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { palmeraTheme } from '../palmera-rn-theme';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, onPress, disabled, style, textStyle, ...props }, ref) => {
    const buttonStyle = [
      styles.base,
      styles[variant],
      styles[size],
      disabled && styles.disabled,
      style,
    ];

    const textStyles = [
      styles.text,
      styles[`${variant}Text`],
      styles[`${size}Text`],
      disabled && styles.disabledText,
      textStyle,
    ];

    return (
      <TouchableOpacity
        ref={ref}
        style={buttonStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
      >
        <Text style={textStyles}>{children}</Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    borderRadius: palmeraTheme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Variants
  primary: {
    backgroundColor: palmeraTheme.colors.primary,
  },
  secondary: {
    backgroundColor: palmeraTheme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palmeraTheme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  sm: {
    paddingHorizontal: palmeraTheme.spacing[3],
    paddingVertical: palmeraTheme.spacing[2],
    minHeight: 32,
  },
  md: {
    paddingHorizontal: palmeraTheme.spacing[4],
    paddingVertical: palmeraTheme.spacing[3],
    minHeight: 40,
  },
  lg: {
    paddingHorizontal: palmeraTheme.spacing[6],
    paddingVertical: palmeraTheme.spacing[4],
    minHeight: 48,
  },
  // Text styles
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: palmeraTheme.colors.background,
  },
  secondaryText: {
    color: palmeraTheme.colors.background,
  },
  outlineText: {
    color: palmeraTheme.colors.text,
  },
  ghostText: {
    color: palmeraTheme.colors.text,
  },
  smText: {
    fontSize: palmeraTheme.typography.fontSize.sm,
  },
  mdText: {
    fontSize: palmeraTheme.typography.fontSize.base,
  },
  lgText: {
    fontSize: palmeraTheme.typography.fontSize.lg,
  },
  // Disabled states
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});