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
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 0,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 12,
          height: 60 + Math.max(insets.bottom, 8),
          paddingHorizontal: palmeraTheme.spacing[6],
          position: 'absolute',
          bottom: palmeraTheme.spacing[4],
          left: palmeraTheme.spacing[4],
          right: palmeraTheme.spacing[4],
          borderRadius: 24,
          // Glassmorphic effect
          backdropFilter: 'blur(20px)',
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: '#000000',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#FFFFFF',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
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
          title: 'Favorites',
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
