import { Tabs } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Clean navigation icons using Ionicons
const HomeIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: focused ? '#90EE90' : 'transparent',
    paddingHorizontal: focused ? 16 : 8,
    paddingVertical: focused ? 8 : 4,
    borderRadius: 24,
    justifyContent: 'center',
    minHeight: 32,
  }}>
    <Ionicons 
      name={focused ? "home" : "home-outline"} 
      size={20} 
      color={focused ? '#000000' : color}
      style={{ marginRight: focused ? 10 : 0 }}
    />
    {focused && <Text style={{ color: '#000000', fontSize: 12, fontWeight: '600' }}>Home</Text>}
  </View>
);

const SearchIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{ padding: 8 }}>
    <Ionicons 
      name={focused ? "search" : "search-outline"} 
      size={20} 
      color={color}
    />
  </View>
);

const HeartIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{ padding: 8 }}>
    <Ionicons 
      name={focused ? "heart" : "heart-outline"} 
      size={20} 
      color={color}
    />
  </View>
);

const ProfileIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{ padding: 8 }}>
    <Ionicons 
      name={focused ? "person" : "person-outline"} 
      size={20} 
      color={color}
    />
  </View>
);

const FilterIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{ padding: 8 }}>
    <Ionicons 
      name="filter" 
      size={20} 
      color={color}
    />
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
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderTopWidth: 0,
          paddingBottom: Math.max(insets.bottom + 8, 12),
          paddingTop: 16,
          height: 75 + Math.max(insets.bottom, 0),
          paddingHorizontal: palmeraTheme.spacing[8],
          position: 'absolute',
          bottom: palmeraTheme.spacing[3],
          left: palmeraTheme.spacing[4],
          right: palmeraTheme.spacing[4],
          borderRadius: 28,
          // Enhanced glassmorphic effect
          backdropFilter: 'blur(40px)',
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 20,
          zIndex: 1000,
        },
        tabBarLabelStyle: {
          fontSize: 0,
          height: 0,
        },
        tabBarShowLabel: false,
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
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon color={color} size={20} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <SearchIcon color={color} size={20} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <HeartIcon color={color} size={20} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon color={color} size={20} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <FilterIcon color={color} size={20} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
