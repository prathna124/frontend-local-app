import React, { useState } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Auth
import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";

// Shopkeeper
import ShopkeeperTabs from "./ShopkeeperTabs";
import { ShopProvider } from "../context/ShopContext";

// Customer
import CustomerTabs from "./CustomerTabs";

const Stack = createStackNavigator();

export default function AppNavigator({ onToggleTheme, isDark }) {
  const [user, setUser] = useState(null);
  // user = { role: "shopkeeper" } | { role: "customer" } — set only after successful login

  return (
    <ShopProvider>
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        {!user ? (
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  onToggleTheme={onToggleTheme}
                  isDark={isDark}
                  onLoginSuccess={(userData) => setUser(userData)}
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
        ) : user.role === "shopkeeper" ? (
          <ShopkeeperTabs />
        ) : (
          <CustomerTabs />
        )}
      </NavigationContainer>
    </ShopProvider>
  );
}
