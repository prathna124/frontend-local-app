import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductsScreen from "../screens/Shopkeeper/ProductsScreen";
import AddEditProductScreen from "../screens/Shopkeeper/AddEditProductScreen";

const Stack = createNativeStackNavigator();

export default function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductsList"
        component={ProductsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddEditProduct"
        component={AddEditProductScreen}
        options={{
          title: "Add / Edit Product",
        }}
      />
    </Stack.Navigator>
  );
}
