import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAuthToken,
  API_BASE_URL,
  X_API_TOKEN,
  getApiTokenHeaders,
} from "../../api/api";
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

    setErrors((prev) => ({ ...prev, general: "" }));

    // Backend register uses user_type: shop_owner | customer (see SignupScreen)
    const user_type =
      userType === "shopkeeper" ? "shop_owner" : "customer";

    const url = `${API_BASE_URL}/auth/v1/shopkeepers/login`;

    console.log("[Login] step 1: validation passed");
    console.log("[Login] step 2: PATCH URL =", url);
    console.log(
      "[Login] step 3: x-api-token configured =",
      X_API_TOKEN ? `yes (length ${X_API_TOKEN.length})` : "NO — set EXPO_PUBLIC_X_API_TOKEN"
    );
    console.log("[Login] step 4: user_type payload =", user_type);

    try {
      const response = await axios.patch(
        url,
        {
          email: email.trim().toLowerCase(),
          password,
          user_type,
        },
        { headers: getApiTokenHeaders() }
      );

      console.log("[Login] step 5: success, status =", response.status);
      console.log("[Login] step 6: response.data keys =", response.data && Object.keys(response.data));

      const apiType =
        response.data?.user?.user_type ?? response.data?.user_type;
      const roleFromApi =
        apiType === "shop_owner" || apiType === "shopkeeper"
          ? "shopkeeper"
          : apiType === "customer"
          ? "customer"
          : null;

      const role =
        roleFromApi ??
        (userType === "shopkeeper" ? "shopkeeper" : "customer");

      if (response.data?.token) {
        await AsyncStorage.setItem("token", response.data.token);
        setAuthToken(response.data.token);
      }
      await AsyncStorage.setItem("role", role);

      const userToStore =
        response.data?.user != null
          ? response.data.user
          : {
              email: email.trim().toLowerCase(),
              user_type,
              role,
            };
      await AsyncStorage.setItem("user", JSON.stringify(userToStore));

      onLoginSuccess({ role });
    } catch (error) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message;
      const data = error?.response?.data;
      console.error("[Login] step FAIL: HTTP status =", status);
      console.error("[Login] step FAIL: message =", msg ?? data);
      console.error("[Login] step FAIL: full body =", data ?? error.message);
      setErrors({
        general:
          msg ||
          (status
            ? `Login failed (${status}). Check user type and credentials.`
            : "Network error. Same Wi‑Fi as server? Check IP in LoginScreen."),
      });
    }
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
