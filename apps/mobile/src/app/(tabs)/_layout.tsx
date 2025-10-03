import { Tabs } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
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
    backgroundColor: palmeraTheme.colors.gold, // Gold for active state
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 14,
    minWidth: 65,
    justifyContent: 'center',
    height: 24,
  },
  activeTabText: {
    color: palmeraTheme.colors.charcoal, // Dark text on gold
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: palmeraTheme.typography.fontFamily.body,
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 24,
  },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? palmeraTheme : palmeraTheme;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.gold,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(28, 28, 28, 0.95)' // Dark charcoal with transparency
            : 'rgba(44, 44, 44, 0.95)', // Charcoal with transparency
          borderTopWidth: 0,
          paddingBottom: insets.bottom,
          paddingTop: 0,
          paddingHorizontal: 20,
          height: 36 + insets.bottom,
          position: 'absolute',
          bottom: 12,
          left: 20,
          right: 20,
          borderRadius: 30,
          // Professional glassmorphic effect with gold accent
          shadowColor: theme.colors.gold,
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 30,
          zIndex: 1000,
          // Gold border for luxury feel
          borderWidth: 0.5,
          borderColor: `${theme.colors.gold}40`, // Gold with 25% opacity
          // Force override React Navigation defaults
          marginBottom: 0,
          marginTop: 0,
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
