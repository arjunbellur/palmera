import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens from mobile app
import WelcomeScreen from './apps/mobile/src/screens/WelcomeScreen';
import LoginScreen from './apps/mobile/src/screens/LoginScreen';
import SignupScreen from './apps/mobile/src/screens/SignupScreen';
import HomeScreen from './apps/mobile/src/screens/HomeScreen';
import DesignShowcase from './apps/mobile/src/components/DesignShowcase';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F6F2' }, // background color
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DesignShowcase" component={DesignShowcase} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
