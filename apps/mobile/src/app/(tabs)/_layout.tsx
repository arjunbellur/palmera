import { Tabs } from 'expo-router';
import { palmeraTheme, getTheme } from '../../theme/palmeraTheme';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Modern navigation tab component following iOS Human Interface Guidelines
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
  const theme = palmeraTheme;
  
  if (focused) {
    return (
      <View style={styles.activeTab}>
        <Ionicons 
          name={(iconNameFocused || iconName) as any} 
          size={24} // Increased for better visibility
          color={theme.colors.charcoal}
        />
        <Text style={styles.activeTabText}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.inactiveTab}>
      <Ionicons 
        name={iconName as any} 
        size={24} // Consistent sizing
        color={color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37', // Gold
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    height: 40,
    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  activeTabText: {
    color: '#2C2C2C', // Charcoal
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 0.3,
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
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.gold,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(28, 28, 28, 0.95)' 
            : 'rgba(44, 44, 44, 0.95)',
          borderTopWidth: 0,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12, // Better bottom spacing
          paddingTop: 12, // Add top padding
          paddingHorizontal: 16, // Reduced horizontal padding
          height: 70 + (insets.bottom > 0 ? insets.bottom : 12), // Proper height for touch targets
          position: 'absolute',
          bottom: 16, // More space from bottom
          left: 16, // Better edge spacing
          right: 16,
          borderRadius: 32, // Larger radius for modern look
          // Professional glassmorphic effect with gold accent
          shadowColor: theme.colors.gold,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 24,
          zIndex: 1000,
          // Subtle gold border for luxury feel
          borderWidth: 1,
          borderColor: `${theme.colors.gold}30`, // Gold with subtle opacity
        },
        tabBarLabelStyle: {
          fontSize: 0,
          height: 0,
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: colorScheme === 'dark' 
            ? theme.colors.midnightBlue 
            : theme.colors.forestGreen,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.offWhite,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: theme.colors.offWhite,
          fontFamily: theme.typography.fontFamily.heading,
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
