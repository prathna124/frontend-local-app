// src/screens/HomeScreen.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { WIDTH as wp, HEIGHT as hp } from "../../utils/responsive";


export default function HomeScreen({ navigation, onToggleTheme, isDark }) {
  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={{ fontSize: wp(8), marginBottom: hp(3) }}>Welcome Home</Text>
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
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingHorizontal: wp(5),
  },

  button: { 
    marginTop: hp(2), 
    paddingVertical: hp(1.2),
    width: wp(70),
    borderRadius: wp(3),
  },
});

