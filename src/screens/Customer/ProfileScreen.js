import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { X_API_TOKEN } from "../../api/api";

export default function ProfileScreen() {
  useEffect(() => {
    let active = true;
    (async () => {
      console.log("[Customer Profile] step 1: screen mounted");
      try {
        const token = await AsyncStorage.getItem("token");
        const userJson = await AsyncStorage.getItem("user");
        const role = await AsyncStorage.getItem("role");
        if (!active) return;
        console.log(
          "[Customer Profile] step 2: token in storage =",
          token ? `yes (length ${token.length})` : "no — login may not have completed"
        );
        console.log("[Customer Profile] step 3: role =", role ?? "(none)");
        console.log(
          "[Customer Profile] step 4: user JSON =",
          userJson ? userJson : "(none)"
        );
        console.log(
          "[Customer Profile] step 5: app env token (for API calls) =",
          X_API_TOKEN ? `set (length ${X_API_TOKEN.length})` : "not set in .env"
        );
      } catch (e) {
        console.error("[Customer Profile] step ERROR reading storage:", e?.message ?? e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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
