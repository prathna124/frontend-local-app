// src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";
import HomeScreen from "../screens/Home/HomeScreen";

const Stack = createStackNavigator();

export default function AppNavigator({ onToggleTheme, isDark }) {
  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen {...props} onToggleTheme={onToggleTheme} isDark={isDark} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen {...props} onToggleTheme={onToggleTheme} isDark={isDark} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
