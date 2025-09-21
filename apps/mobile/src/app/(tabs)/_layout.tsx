import { Tabs } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Flat UI Icons as SVG-like components
const HomeIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: focused ? 'rgba(144, 238, 144, 1)' : 'transparent',
    paddingHorizontal: focused ? 16 : 8,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: focused ? 80 : 40,
    justifyContent: 'center',
  }}>
    <View style={{
      width: 20,
      height: 20,
      backgroundColor: focused ? '#000000' : color,
      borderRadius: 2,
      marginRight: focused ? 8 : 0,
    }} />
    {focused && <Text style={{ color: '#000000', fontSize: 12, fontWeight: '600' }}>Home</Text>}
  </View>
);

const SearchIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: focused ? 'rgba(144, 238, 144, 1)' : 'transparent',
    paddingHorizontal: focused ? 16 : 8,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: focused ? 80 : 40,
    justifyContent: 'center',
  }}>
    <View style={{
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: focused ? '#000000' : color,
      borderRadius: 10,
      position: 'relative',
      marginRight: focused ? 8 : 0,
    }}>
      <View style={{
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 8,
        height: 2,
        backgroundColor: focused ? '#000000' : color,
        transform: [{ rotate: '45deg' }],
      }} />
    </View>
    {focused && <Text style={{ color: '#000000', fontSize: 12, fontWeight: '600' }}>Search</Text>}
  </View>
);

const GroupsIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: focused ? 'rgba(144, 238, 144, 1)' : 'transparent',
    paddingHorizontal: focused ? 16 : 8,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: focused ? 80 : 40,
    justifyContent: 'center',
  }}>
    <View style={{
      width: 20,
      height: 20,
      backgroundColor: focused ? '#000000' : color,
      borderRadius: 10,
      marginRight: focused ? 8 : 0,
    }} />
    {focused && <Text style={{ color: '#000000', fontSize: 12, fontWeight: '600' }}>Favorites</Text>}
  </View>
);

const ProfileIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: focused ? 'rgba(144, 238, 144, 1)' : 'transparent',
    paddingHorizontal: focused ? 16 : 8,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: focused ? 80 : 40,
    justifyContent: 'center',
  }}>
    <View style={{
      width: 20,
      height: 20,
      backgroundColor: focused ? '#000000' : color,
      borderRadius: 10,
      marginRight: focused ? 8 : 0,
    }} />
    {focused && <Text style={{ color: '#000000', fontSize: 12, fontWeight: '600' }}>Profile</Text>}
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
            <HomeIcon color={color} size={focused ? 26 : 22} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <SearchIcon color={color} size={focused ? 26 : 22} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <GroupsIcon color={color} size={focused ? 26 : 22} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon color={color} size={focused ? 26 : 22} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
