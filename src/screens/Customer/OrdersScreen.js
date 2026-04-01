import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Orders</Text>
      <Text>Your order history will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
});
