import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, useSafeAreaInsets } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { ThemeToggle } from '../../components/ThemeToggle';

// Design tokens from our theme system
const DESIGN_TOKENS = {
  // Spacing (8pt grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  // Typography
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
    },
    fontWeight: {
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;

// Custom tab button component with proper spacing
const TabButton = ({ 
  iconName, 
  label, 
  focused, 
  theme 
}: {
  iconName: string;
  label: string;
  focused: boolean;
  theme: any;
}) => {
  if (focused) {
    return (
      <View style={[
        styles.activeTab,
        {
          backgroundColor: theme.colors.gold,
          ...DESIGN_TOKENS.shadows.md,
        }
      ]}>
        <Ionicons 
          name={iconName as any} 
          size={24}
          color={theme.colors.charcoal}
        />
        <Text style={[
          styles.activeTabText,
          {
            color: theme.colors.charcoal,
            fontSize: DESIGN_TOKENS.typography.fontSize.sm,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
          }
        ]}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.inactiveTab}>
      <Ionicons 
        name={iconName as any} 
        size={24}
        color={theme.colors.textMuted}
      />
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useTheme();
  
  // Calculate proper tab bar height with safe area
  const tabBarHeight = DESIGN_TOKENS.spacing['3xl'] + DESIGN_TOKENS.spacing.lg + (insets.bottom > 0 ? insets.bottom : DESIGN_TOKENS.spacing.md);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.gold,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          paddingBottom: insets.bottom > 0 ? insets.bottom : DESIGN_TOKENS.spacing.md,
          paddingTop: DESIGN_TOKENS.spacing.md,
          paddingHorizontal: DESIGN_TOKENS.spacing.lg,
          height: tabBarHeight,
          position: 'absolute',
          bottom: DESIGN_TOKENS.spacing.lg,
          left: DESIGN_TOKENS.spacing.lg,
          right: DESIGN_TOKENS.spacing.lg,
          borderRadius: DESIGN_TOKENS.borderRadius['2xl'],
          ...DESIGN_TOKENS.shadows.lg,
          zIndex: 1000,
          // Subtle border for definition
          borderWidth: 1,
          borderColor: `${theme.colors.gold}20`, // 12% opacity
        },
        tabBarLabelStyle: {
          fontSize: 0, // Hide default labels
          height: 0,
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: theme.colors.primary,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.offWhite,
        headerTitleStyle: {
          fontSize: DESIGN_TOKENS.typography.fontSize.lg,
          fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
          color: theme.colors.offWhite,
        },
        headerRight: () => (
          <View style={styles.headerRight}>
            <ThemeToggle onToggle={toggleTheme} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabButton
              iconName="home"
              label="Home"
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: true,
          tabBarIcon: ({ focused, color }) => (
            <TabButton
              iconName="search"
              label="Search"
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          headerShown: true,
          tabBarIcon: ({ focused, color }) => (
            <TabButton
              iconName="people"
              label="Groups"
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          headerShown: true,
          tabBarIcon: ({ focused, color }) => (
            <TabButton
              iconName="ticket"
              label="Tickets"
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          headerShown: true,
          tabBarIcon: ({ focused, color }) => (
            <TabButton
              iconName="information-circle"
              label="About"
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Active tab with proper spacing
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    paddingVertical: DESIGN_TOKENS.spacing.sm,
    borderRadius: DESIGN_TOKENS.borderRadius.xl,
    minWidth: 88, // Wider for better touch target
    height: 48, // Taller for better accessibility
    gap: DESIGN_TOKENS.spacing.xs,
  },
  activeTabText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.sm,
    fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
    letterSpacing: 0.3,
  },
  // Inactive tab with proper touch target
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48, // iOS minimum touch target
    height: 48,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
  },
  // Header right container
  headerRight: {
    paddingRight: DESIGN_TOKENS.spacing.md,
  },
});