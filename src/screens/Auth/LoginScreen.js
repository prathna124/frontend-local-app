import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAuthToken } from "../../api/api";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  IconButton,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { WIDTH as wp, HEIGHT as hp } from "../../utils/responsive";

export default function LoginScreen({ navigation, onToggleTheme, isDark, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const passwordRef = useRef(null);

  /* ================= VALIDATION ================= */

  const getFieldError = (field, value) => {
    if (field === "email") {
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email";
    }

    if (field === "password") {
      if (!value) return "Password is required";
      if (value.length < 6)
        return "Password must be at least 6 characters";
    }

    if (field === "userType") {
      if (!value) return "Please select a user type";
    }

    return "";
  };

  const validateAll = () => {
    const newErrors = {
      email: getFieldError("email", email),
      password: getFieldError("password", password),
      userType: getFieldError("userType", userType),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every(err => !err);
  };

  /* ================= LOGIN ================= */

  //last final method:
  // const handleLogin = async () => {
  //   setTouched({ email: true, password: true, userType: true });
  //   if (!validateAll()) return;

  //   try {
  //     const res = await api.post("/auth/login", {
  //       email,
  //       password,
  //       userType,
  //     });

  //     const { token, role } = res.data;

  //     await AsyncStorage.multiSet([
  //       ["token", token],
  //       ["role", role],
  //     ]);

  //     setAuthToken(token);

  //     onLoginSuccess({ role });
  //   } catch (e) {
  //     setErrors({ general: "Invalid login credentials" });
  //   }
  // };

  const handleLogin = async () => {
    setTouched({ email: true, password: true, userType: true });

    if (!validateAll()) return;
    onLoginSuccess({
      role: userType, // "shopkeeper" or "customer"
    });
  //   try {
  //   // 🔹 TEMP LOGIN (for testing without API)
  //   onLoginSuccess({
  //     role: userType, // "shopkeeper" or "customer"
  //   });

  //   // ================= REAL API (ENABLE LATER) =================
  //   /*
  //   const url =
  //     "http://192.168.92.239:3000/api/auth/v1/customers/login";

  //   const response = await axios.patch(
  //     url,
  //     { email, password, userType },
  //     {
  //       headers: {
  //         "x-api-token": 456,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   onLoginSuccess({
  //     role: response.data.user.user_type, // shopkeeper / customer
  //   });
  //   */

  // } catch (error) {
  //   setErrors({
  //     general:
  //       error?.response?.data?.message ||
  //       "Invalid email or password",
  //   });
  // }
   
  };


  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <IconButton
        icon={isDark ? "weather-sunny" : "weather-night"}
        size={wp(6)}
        onPress={onToggleTheme}
        style={styles.themeToggle}
      />

      <Text variant="headlineLarge" style={styles.title}>
        ApnaDukan
      </Text>

      {/* Email */}
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (touched.email) {
            setErrors(e => ({
              ...e,
              email: getFieldError("email", text),
            }));
          }
        }}
        onBlur={() =>
          setTouched(t => ({ ...t, email: true }))
        }
        style={styles.input}
        error={touched.email && !!errors.email}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <HelperText
        type="error"
        visible={touched.email && !!errors.email}
        style={{ paddingVertical: 0 }}
      >
        {errors.email}
      </HelperText>

      {/* Password */}
      <TextInput
        ref={passwordRef}
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (touched.password) {
            setErrors(e => ({
              ...e,
              password: getFieldError("password", text),
            }));
          }
        }}
        onBlur={() =>
          setTouched(t => ({ ...t, password: true }))
        }
        style={styles.input}
        error={touched.password && !!errors.password}
        returnKeyType="done"
      />

      <HelperText
        type="error"
        visible={touched.password && !!errors.password}
        style={{ paddingVertical: 0 }}
      >
        {errors.password}
      </HelperText>

      {/* User Type */}
      <Text style={styles.label}>User Type</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={userType}
          onValueChange={(value) => {
            setUserType(value);
            setTouched(t => ({ ...t, userType: true }));
            setErrors(e => ({
              ...e,
              userType: getFieldError("userType", value),
            }));
          }}
        >
          <Picker.Item label="Select user type" value="" />
          <Picker.Item label="Customer" value="customer" />
          <Picker.Item label="Shopkeeper" value="shopkeeper" />
        </Picker>
      </View>

      <HelperText
        type="error"
        visible={touched.userType && !!errors.userType}
        style={{ paddingVertical: 0 }}
      >
        {errors.userType}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
      >
        Login
      </Button>

      <Button onPress={() => navigation.navigate("Signup")}>
        Create Account
      </Button>

      <Button onPress={() => navigation.replace("Home")}>
        Continue as Guest
      </Button>

      {errors.general && (
        <HelperText type="error" visible>
          {errors.general}
        </HelperText>
      )}
    </View>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: wp(6),
  },

  title: {
    textAlign: "center",
    marginBottom: hp(3),
    fontSize: wp(7),
    fontWeight: "700",
  },

  input: {
    marginBottom: hp(0.8),
  },

  button: {
    marginVertical: hp(1.5),
    paddingVertical: hp(1.1),
    borderRadius: wp(2),
  },

  label: {
    marginTop: hp(1.5),
    marginBottom: hp(0.5),
    fontSize: wp(4),
    fontWeight: "500",
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    marginBottom: hp(1),
    backgroundColor: "#fafafa",
  },

  themeToggle: {
    position: "absolute",
    top: hp(4),
    right: wp(5),
  },
});
