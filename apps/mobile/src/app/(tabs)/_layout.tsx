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
    paddingHorizontal: focused ? 12 : 4,
    paddingVertical: focused ? 6 : 2,
    borderRadius: 20,
    justifyContent: 'center',
    minHeight: 28,
  }}>
    <Ionicons 
      name={focused ? "home" : "home-outline"} 
      size={18} 
      color={focused ? '#000000' : color}
      style={{ marginRight: focused ? 8 : 0 }}
    />
    {focused && <Text style={{ color: '#000000', fontSize: 11, fontWeight: '600' }}>Home</Text>}
  </View>
);

const GroupsIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{ padding: 4 }}>
    <Ionicons 
      name={focused ? "people" : "people-outline"} 
      size={18} 
      color={color}
    />
  </View>
);

const TicketsIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{ padding: 4 }}>
    <Ionicons 
      name={focused ? "ticket" : "ticket-outline"} 
      size={18} 
      color={color}
    />
  </View>
);

const AboutIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{ padding: 4 }}>
    <Ionicons 
      name={focused ? "information-circle" : "information-circle-outline"} 
      size={18} 
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
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderTopWidth: 0,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          height: 52 + insets.bottom,
          paddingHorizontal: palmeraTheme.spacing[3],
          position: 'absolute',
          bottom: 0,
          left: palmeraTheme.spacing[5],
          right: palmeraTheme.spacing[5],
          borderRadius: 26,
          // Dark glassmorphic effect with high intensity blur
          backdropFilter: 'blur(60px)',
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 15,
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
        name="groups"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <GroupsIcon color={color} size={20} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TicketsIcon color={color} size={20} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <AboutIcon color={color} size={20} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
