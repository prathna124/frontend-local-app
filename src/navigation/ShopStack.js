import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopsListScreen from "../screens/Shopkeeper/ShopsListScreen";
import AddEditShopScreen from "../screens/Shopkeeper/AddEditShopScreen";

const Stack = createNativeStackNavigator();

export default function ShopStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyShops"
        component={ShopsListScreen}
        options={{ title: "My Shops" }}
      />

      <Stack.Screen
        name="AddEditShop"
        component={AddEditShopScreen}
        options={{ title: "Add / Edit Shop" }}
      />
    </Stack.Navigator>
  );
}
