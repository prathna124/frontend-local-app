import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, HelperText, IconButton } from "react-native-paper";

export default function LoginScreen({ navigation, onToggleTheme, isDark }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    console.log("Login clicked", email, password);
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      {/* Theme Toggle Icon */}
      <IconButton
        icon={isDark ? "weather-sunny" : "weather-night"}
        size={24}
        onPress={onToggleTheme}
        style={styles.themeToggle}
      />

      <Text variant="headlineLarge" style={styles.title}>ApnaDukan</Text>

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        error={!!errors.email}
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>

      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        error={!!errors.password}
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>

      <Button onPress={() => navigation.navigate("Signup")}>
        Create Account
      </Button>

      <Button onPress={() => navigation.replace("Home")}>
        Continue as Guest
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { textAlign: "center", marginBottom: 30 },
  input: { marginBottom: 5 },
  button: { marginVertical: 10 },
  themeToggle: { position: "absolute", top: 40, right: 20 }
});
