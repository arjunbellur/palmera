import { Tabs } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Proper navigation icons matching the reference design
const HomeIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: focused ? '#90EE90' : 'transparent',
    paddingHorizontal: focused ? 12 : 0,
    paddingVertical: focused ? 8 : 0,
    borderRadius: 20,
    justifyContent: 'center',
    minWidth: focused ? undefined : 24,
  }}>
    {/* House icon shape */}
    <View style={{
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: focused ? 8 : 0,
    }}>
      <View style={{
        width: 16,
        height: 12,
        backgroundColor: focused ? '#000000' : color,
        position: 'relative',
      }}>
        {/* Roof triangle */}
        <View style={{
          position: 'absolute',
          top: -6,
          left: 2,
          width: 0,
          height: 0,
          borderLeftWidth: 6,
          borderRightWidth: 6,
          borderBottomWidth: 6,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: focused ? '#000000' : color,
        }} />
        {/* Door */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 6,
          width: 4,
          height: 6,
          backgroundColor: focused ? '#90EE90' : '#000000',
        }} />
      </View>
    </View>
    {focused && <Text style={{ color: '#000000', fontSize: 12, fontWeight: '600' }}>Home</Text>}
  </View>
);

const SearchIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {/* Magnifying glass circle */}
    <View style={{
      width: 14,
      height: 14,
      borderWidth: 2,
      borderColor: color,
      borderRadius: 7,
      position: 'relative',
    }} />
    {/* Handle */}
    <View style={{
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 8,
      height: 2,
      backgroundColor: color,
      transform: [{ rotate: '45deg' }],
    }} />
  </View>
);

const HeartIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {/* Heart shape made with two circles and a triangle */}
    <View style={{
      width: 18,
      height: 16,
      position: 'relative',
    }}>
      {/* Left circle */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 10,
        height: 10,
        backgroundColor: color,
        borderRadius: 5,
      }} />
      {/* Right circle */}
      <View style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        backgroundColor: color,
        borderRadius: 5,
      }} />
      {/* Bottom triangle */}
      <View style={{
        position: 'absolute',
        top: 6,
        left: 4,
        width: 0,
        height: 0,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
      }} />
    </View>
  </View>
);

const ProfileIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {/* Person icon */}
    <View style={{
      width: 18,
      height: 18,
      position: 'relative',
    }}>
      {/* Head circle */}
      <View style={{
        width: 8,
        height: 8,
        backgroundColor: color,
        borderRadius: 4,
        position: 'absolute',
        top: 0,
        left: 5,
      }} />
      {/* Body shape */}
      <View style={{
        width: 14,
        height: 8,
        backgroundColor: color,
        borderRadius: 7,
        position: 'absolute',
        bottom: 0,
        left: 2,
      }} />
    </View>
  </View>
);

const FilterIcon = ({ color, size = 24, focused }: { color: string; size?: number; focused?: boolean }) => (
  <View style={{
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {/* Triangle/filter icon */}
    <View style={{
      width: 0,
      height: 0,
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderTopWidth: 12,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: color,
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
            <HeartIcon color={color} size={focused ? 26 : 22} focused={focused} />
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
      <Tabs.Screen
        name="favorites"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <FilterIcon color={color} size={focused ? 26 : 22} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
