import React from 'react';
import { View, ViewStyle } from 'react-native';
import { palmeraTheme } from '../../theme/palmeraTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: palmeraTheme.colors.background,
          borderRadius: palmeraTheme.borderRadius.lg,
          padding: palmeraTheme.spacing[4],
          ...palmeraTheme.shadows.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
