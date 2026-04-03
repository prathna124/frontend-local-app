// src/screens/Auth/SignupScreen.js
import React, { useState } from "react";
import { WIDTH, HEIGHT } from "../../utils/responsive";
import axios from "axios";
import {
  API_BASE_URL,
  X_API_TOKEN,
  getApiTokenHeaders,
} from "../../api/api";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  SegmentedButtons,
  useTheme,
  IconButton,
} from "react-native-paper";
import { validateShopKeeperSignupForm } from "../../utils/validators";

export default function SignupScreen({
  navigation,
  route,
  onToggleTheme,
  isDark,
}) {
  const { colors } = useTheme();
  const [role, setRole] = useState("customer");

  // Fields
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [shopName, setShopName] = useState("");

  const [errors, setErrors] = useState({});

  const mapBackendErrorsToForm = (data) => {
    const next = {};
    if (!data || typeof data !== "object") return next;

    const raw = data.errors ?? data.error ?? data.details;
    const fieldMap = {
      first_name: "name",
      last_name: "lastname",
      phone_number: "phone",
      password_hash: "password",
      confirm_password: "confirm",
      user_type: "user_type",
      email: "email",
    };

    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      for (const [k, v] of Object.entries(raw)) {
        const key = fieldMap[k] ?? k;
        const msg = Array.isArray(v) ? String(v[0] ?? "") : String(v ?? "");
        if (msg) next[key] = msg;
      }
    } else if (Array.isArray(raw)) {
      for (const item of raw) {
        if (!item || typeof item !== "object") continue;
        const k = item.path ?? item.field ?? item.key ?? item.param;
        const key = fieldMap[k] ?? k;
        const msg = String(item.message ?? item.msg ?? "");
        if (key && msg) next[key] = msg;
      }
    }

    if (!next.general) {
      const message = data.message ?? data.error ?? data.msg;
      if (message && typeof message === "string") next.general = message;
    }

    return next;
  };

  const resetForm = () => {
    setName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirm("");
    setShopName("");
    setErrors({});
  };

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    resetForm();
  };

  const validateAll = () => {
    const userType = role === "shopkeeper" ? "shop_owner" : "customer";
    const { isValid, errors: next } = validateShopKeeperSignupForm({
      first_name: name,
      last_name: lastname,
      email,
      phone_number: phone,
      password_hash: password,
      confirm_password: confirm,
      user_type: userType
    });
    setErrors(next);
    console.log("signup errors:", next);
    console.log(isValid);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateAll()) return;
    setErrors((e) => ({ ...e, general: "" }));

    const payload = {
      user_type: role === "shopkeeper" ? "shop_owner" : "customer",
      first_name: name.trim(),
      last_name: lastname.trim(),
      email: email.trim().toLowerCase(),
      phone_number: phone.trim(),
      password_hash: password,
      confirm_password: confirm
    };

    const registerUrl = `${API_BASE_URL}/auth/v1/shopkeepers/register`;
    console.log("[Signup] step 1: payload ready (email/user_type set)");
    console.log("[Signup] step 2: URL =", registerUrl);
    console.log(
      "[Signup] step 3: x-api-token configured =",
      X_API_TOKEN ? `yes (length ${X_API_TOKEN.length})` : "NO — set EXPO_PUBLIC_X_API_TOKEN"
    );

    try {
      const res = await axios.post(registerUrl, payload, {
        headers: getApiTokenHeaders(),
      });
      console.log("[Signup] step 4: success, status =", res.status);
      console.log("[Signup] step 5: response.data =", res.data);
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      if (status === 400) {
        const backend = mapBackendErrorsToForm(data);
        setErrors((prev) => ({
          ...prev,
          ...backend,
          general:
            backend.general ||
            "Please fix the highlighted fields and try again.",
        }));
        return;
      }

      setErrors((prev) => ({
        ...prev,
        general:
          data?.message ||
          (status
            ? `Request failed (${status}). Please try again.`
            : "Network error. Please check your connection and try again."),
      }));
      console.error("[Signup] step FAIL: status =", error?.response?.status);
      console.error("[Signup] step FAIL: data =", error?.response?.data ?? error.message);
    }
    // TODO: replace with real API
    // optionally send role too     
    // 🔹 TEMP SI
    //navigation.replace("Home");
  };

  return (
    <View style={styles.mainContainer}>
      {/* Theme Toggle */}
      <IconButton
        icon={isDark ? "weather-sunny" : "weather-night"}
        size={24}
        onPress={onToggleTheme}
        style={styles.themeToggle}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: WIDTH("5%"),
            paddingTop: HEIGHT("8%"),
            paddingBottom: HEIGHT("5%"),
            backgroundColor: colors.background,
          }}
        >
          <View style={styles.formInner}>
            <Text
              variant="headlineLarge"
              style={[styles.title, { color: colors.primary, marginBottom: 25 }]}
            >
              Create Account
            </Text>

            {/* Role Switch */}
            <SegmentedButtons
              value={role}
              onValueChange={handleRoleChange}
              buttons={[
                { value: "customer", label: "Customer", icon: "account" },
                { value: "shopkeeper", label: "Shopkeeper", icon: "store" },
              ]}
              style={styles.segmented}
            />

            {/* First Name */}
            <TextInput
              label="First Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              error={!!errors.name}
              left={<TextInput.Icon icon="account-outline" />}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            {/* Last Name */}
            <TextInput
              label="Last Name"
              value={lastname}
              onChangeText={setLastName}
              mode="outlined"
              style={styles.input}
              error={!!errors.lastname}
              left={<TextInput.Icon icon="account-outline" />}
            />
            <HelperText type="error" visible={!!errors.lastname}>
              {errors.lastname}
            </HelperText>

            {/* Email */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              style={styles.input}
              error={!!errors.email}
              left={<TextInput.Icon icon="email-outline" />}
              autoCapitalize="none"
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            {/* Phone */}
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="number-pad"
              style={styles.input}
              error={!!errors.phone}
              left={<TextInput.Icon icon="phone-outline" />}
            />
            <HelperText type="error" visible={!!errors.phone}>
              {errors.phone}
            </HelperText>

            {/* Password */}
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              error={!!errors.password}
              left={<TextInput.Icon icon="lock-outline" />}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            {/* Confirm Password */}
            <TextInput
              label="Confirm Password"
              value={confirm}
              onChangeText={setConfirm}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              error={!!errors.confirm}
              left={<TextInput.Icon icon="lock-check-outline" />}
            />
            <HelperText type="error" visible={!!errors.confirm}>
              {errors.confirm}
            </HelperText>

            {/* Buttons */}
            <Button
              mode="contained"
              onPress={handleSignup}
              style={[styles.button, { backgroundColor: colors.primary }]}
              labelStyle={{ fontSize: 16, fontWeight: "600" }}
            >
              Sign Up
            </Button>

            {errors.general ? (
              <HelperText type="error" visible>
                {errors.general}
              </HelperText>
            ) : null}

            <Button
              onPress={() => navigation.goBack()}
              textColor={colors.primary}
              style={{ marginTop: 10 }}
            >
              Already have an account? Login
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  themeToggle: {
    position: "absolute",
    top: HEIGHT("3%"),
    right: WIDTH("4%"),
    zIndex: 10
  },
  formInner: {
    flex: 1,
   borderRadius: WIDTH("4%"),
    padding: WIDTH("2%"),
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    letterSpacing: 0.5,
    fontSize: HEIGHT("3%"),
  },
  segmented: {
    alignSelf: "center",
    marginBottom: HEIGHT("2%"),
  },
  input: {
    marginBottom: HEIGHT("1.2%"),
  borderRadius: WIDTH("2%"),
  },
  button: {
    marginTop: HEIGHT("2%"),
  borderRadius: WIDTH("3%"),
  paddingVertical: HEIGHT("1.2%"),
  },
});
