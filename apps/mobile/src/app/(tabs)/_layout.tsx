import { Tabs } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Flat UI Icons as SVG-like components
const HomeIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <View style={{
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: 2,
    opacity: 0.8,
  }} />
);

const SearchIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <View style={{
    width: size,
    height: size,
    borderWidth: 2,
    borderColor: color,
    borderRadius: size / 2,
    position: 'relative',
  }}>
    <View style={{
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: size * 0.4,
      height: 2,
      backgroundColor: color,
      transform: [{ rotate: '45deg' }],
    }} />
  </View>
);

const GroupsIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <View style={{
    width: size,
    height: size,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }}>
    <View style={{
      width: size * 0.4,
      height: size * 0.4,
      backgroundColor: color,
      borderRadius: 2,
    }} />
    <View style={{
      width: size * 0.4,
      height: size * 0.4,
      backgroundColor: color,
      borderRadius: 2,
    }} />
    <View style={{
      width: size * 0.4,
      height: size * 0.4,
      backgroundColor: color,
      borderRadius: 2,
    }} />
    <View style={{
      width: size * 0.4,
      height: size * 0.4,
      backgroundColor: color,
      borderRadius: 2,
    }} />
  </View>
);

const ProfileIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <View style={{
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: size / 2,
    position: 'relative',
  }}>
    <View style={{
      position: 'absolute',
      top: size * 0.2,
      left: size * 0.25,
      width: size * 0.5,
      height: size * 0.3,
      backgroundColor: palmeraTheme.colors.background,
      borderRadius: size * 0.15,
    }} />
    <View style={{
      position: 'absolute',
      bottom: size * 0.15,
      left: size * 0.15,
      width: size * 0.7,
      height: size * 0.35,
      backgroundColor: palmeraTheme.colors.background,
      borderRadius: size * 0.175,
    }} />
  </View>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palmeraTheme.colors.primary,
        tabBarInactiveTintColor: palmeraTheme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: palmeraTheme.colors.background,
          borderTopColor: palmeraTheme.colors.border,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, palmeraTheme.spacing[3]),
          paddingTop: palmeraTheme.spacing[2],
          height: 88 + Math.max(insets.bottom, palmeraTheme.spacing[3]),
          paddingHorizontal: palmeraTheme.spacing[4],
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: palmeraTheme.spacing[1],
        },
        headerStyle: {
          backgroundColor: palmeraTheme.colors.background,
          borderBottomColor: palmeraTheme.colors.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: palmeraTheme.colors.text,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: palmeraTheme.colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon color={color} size={focused ? 26 : 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <SearchIcon color={color} size={focused ? 26 : 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, focused }) => (
            <GroupsIcon color={color} size={focused ? 26 : 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon color={color} size={focused ? 26 : 22} />
          ),
        }}
      />
    </Tabs>
  );
}
