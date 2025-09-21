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
    paddingHorizontal: focused ? 12 : 0,
    paddingVertical: focused ? 6 : 0,
    borderRadius: 20,
    justifyContent: 'center',
  }}>
    <Ionicons 
      name={focused ? "home" : "home-outline"} 
      size={20} 
      color={focused ? '#000000' : color}
      style={{ marginRight: focused ? 8 : 0 }}
    />
    {focused && <Text style={{ color: '#000000', fontSize: 12, fontWeight: '600' }}>Home</Text>}
  </View>
);

const SearchIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <Ionicons 
    name={focused ? "search" : "search-outline"} 
    size={20} 
    color={color}
  />
);

const HeartIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <Ionicons 
    name={focused ? "heart" : "heart-outline"} 
    size={20} 
    color={color}
  />
);

const ProfileIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <Ionicons 
    name={focused ? "person" : "person-outline"} 
    size={20} 
    color={color}
  />
);

const FilterIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <Ionicons 
    name="filter" 
    size={20} 
    color={color}
  />
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
          paddingBottom: Math.max(insets.bottom + 12, 20),
          paddingTop: 12,
          height: 80 + Math.max(insets.bottom, 0),
          paddingHorizontal: palmeraTheme.spacing[6],
          position: 'absolute',
          bottom: palmeraTheme.spacing[3],
          left: palmeraTheme.spacing[4],
          right: palmeraTheme.spacing[4],
          borderRadius: 28,
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
