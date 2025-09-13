// src/screens/HomeScreen.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";

export default function HomeScreen({ navigation, onToggleTheme, isDark }) {
  return (
    <View style={styles.container}>
      <Text variant="headlineLarge">Welcome Home</Text>
      <Button mode="contained" onPress={onToggleTheme} style={styles.button}>
        Switch to {isDark ? "Light" : "Dark"} Mode
      </Button>
      <Button mode="outlined" onPress={() => navigation.replace("Login")} style={styles.button}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: { marginTop: 15 },
});
