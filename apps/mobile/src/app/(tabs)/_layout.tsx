import { Tabs } from 'expo-router';
import { palmeraTheme } from '@palmera/ui';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palmeraTheme.colors.accent,
        tabBarInactiveTintColor: palmeraTheme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: palmeraTheme.colors.background,
          borderTopColor: palmeraTheme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🔍</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👥</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
