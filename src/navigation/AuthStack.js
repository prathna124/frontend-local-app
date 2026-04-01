import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack({ onToggleTheme, isDark, onLoginSuccess }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onToggleTheme={onToggleTheme}
            isDark={isDark}
            onLoginSuccess={onLoginSuccess}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Signup">
        {(props) => (
          <SignupScreen
            {...props}
            onToggleTheme={onToggleTheme}
            isDark={isDark}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
