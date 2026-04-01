import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Profile</Text>
      <Text>Your profile details will appear here.</Text>
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
