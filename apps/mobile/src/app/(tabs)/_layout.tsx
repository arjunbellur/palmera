import { Tabs } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Modern navigation tab component with proper glassmorphism
const TabButton = ({ 
  iconName, 
  iconNameFocused, 
  label, 
  focused, 
  color 
}: {
  iconName: string;
  iconNameFocused?: string;
  label: string;
  focused: boolean;
  color: string;
}) => {
  if (focused) {
    return (
      <View style={styles.activeTab}>
        <Ionicons 
          name={(iconNameFocused || iconName) as any} 
          size={20} 
          color="#000000"
        />
        <Text style={styles.activeTabText}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.inactiveTab}>
      <Ionicons 
        name={iconName as any} 
        size={22} 
        color={color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#90EE90',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    justifyContent: 'center',
  },
  activeTabText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderTopWidth: 0,
          paddingBottom: insets.bottom,
          paddingTop: 12,
          paddingHorizontal: 20,
          height: 68 + insets.bottom,
          position: 'absolute',
          bottom: 12,
          left: 20,
          right: 20,
          borderRadius: 30,
          // Professional glassmorphic effect (backdrop filter not supported in RN)
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.6,
          shadowRadius: 20,
          elevation: 30,
          zIndex: 1000,
          // Modern iOS-style border
          borderWidth: 0.5,
          borderColor: 'rgba(255, 255, 255, 0.1)',
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
            <TabButton
              iconName="home-outline"
              iconNameFocused="home"
              label="Home"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabButton
              iconName="people-outline"
              iconNameFocused="people"
              label="Groups"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabButton
              iconName="ticket-outline"
              iconNameFocused="ticket"
              label="Tickets"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabButton
              iconName="information-circle-outline"
              iconNameFocused="information-circle"
              label="About"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
