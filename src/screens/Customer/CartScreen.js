import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Cart</Text>
      <Text>Your selected items will appear here.</Text>
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
