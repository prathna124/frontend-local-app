// src/navigation/ShopkeeperTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Shopkeeper Screens
import DashboardScreen from "../screens/Shopkeeper/DashboardScreen";
import ProfileScreen from "../screens/Shopkeeper/ProfileScreen";

import ProductsStack from "./ProductsStack";
import ShopStack from "./ShopStack";


const Tab = createBottomTabNavigator();

export default function ShopkeeperTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Shops"
        component={ShopStack}
        options={{
          title: "Create Shop",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="store-plus-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

     
      <Tab.Screen
        name="Products"
        component={ProductsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cube-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Orders / Customers — add screens when ready
      <Tab.Screen name="Orders" component={OrdersScreen} ... />
      */}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
