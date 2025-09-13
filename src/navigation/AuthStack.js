// src/navigation/AuthStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack({ onToggleTheme, isDark }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        initialParams={{ onToggleTheme, isDark }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        initialParams={{ onToggleTheme, isDark }}
      />
    </Stack.Navigator>
  );
}
