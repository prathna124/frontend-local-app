import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { setAuthToken } from "../api/api";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// useEffect(() => {
//   const bootstrap = async () => {
//     const token = await AsyncStorage.getItem("token");
//     const role = await AsyncStorage.getItem("role");

//     if (token && role) {
//       setAuthToken(token);
//       setUser({ role });
//     }
//   };

//   bootstrap();
// }, []);

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
  // user = { role: "shopkeeper" } or { role: "customer" }

  return (
    <ShopProvider>
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      {!user ? (
        /* ================= AUTH STACK ================= */
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        /* ================= SHOPKEEPER ================= */
        <ShopkeeperTabs />
      ) : (
        /* ================= CUSTOMER ================= */
        <CustomerTabs />
      )}
    </NavigationContainer>
    </ShopProvider>
  );
}