// src/screens/Auth/SignupScreen.js
import React, { useState } from "react";
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
import {
  validateEmail,
  validatePassword,
  validateName,
  validateLastName,
  validatePhone,
  validateShopName,
} from "../../utils/validators";

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

  const validateAll = () => {
    const newErrors = {};

    // Match backend Joi schema
    const firstNameErr = validateName(name);
    if (firstNameErr) newErrors.name = firstNameErr;

    const lastNameErr = validateLastName(lastname);
    if (lastNameErr) newErrors.lastname = lastNameErr;

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validatePhone(phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const passwordErr = validatePassword(password);
    if (passwordErr) newErrors.password = passwordErr;

    if (!confirm || confirm.trim() === "")
      newErrors.confirm = "Confirm password is required";
    else if (confirm !== password)
      newErrors.confirm = "Passwords do not match";

    if (role === "shopkeeper") {
      const shopErr = validateShopName(shopName);
      if (shopErr) newErrors.shopName = shopErr;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validateAll()) return;

    const payload = {
      user_type: role,
      first_name: name.trim(),
      last_name: lastname.trim(),
      email: email.trim(),
      phone_number: phone.trim(),
      password_hash: password,
      ...(role === "shopkeeper" ? { shop_name: shopName.trim() } : {}),
    };

    console.log("Signup Payload:", payload);
    navigation.replace("Home");
  };

  const screenWidth = Dimensions.get("window").width;

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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: screenWidth < 360 ? 12 : 20,
            paddingTop: 60,
            paddingBottom: 40,
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
              onValueChange={setRole}
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

            {/* Shop Name (for shopkeepers only) */}
            {role === "shopkeeper" && (
              <>
                <TextInput
                  label="Shop Name"
                  value={shopName}
                  onChangeText={setShopName}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.shopName}
                  left={<TextInput.Icon icon="store" />}
                />
                <HelperText type="error" visible={!!errors.shopName}>
                  {errors.shopName}
                </HelperText>
              </>
            )}

            {/* Buttons */}
            <Button
              mode="contained"
              onPress={handleSignup}
              style={[styles.button, { backgroundColor: colors.primary }]}
              labelStyle={{ fontSize: 16, fontWeight: "600" }}
            >
              Sign Up
            </Button>

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
    top: 20,
    right: 20,
    zIndex: 10,
  },
  formInner: {
    flex: 1,
    borderRadius: 18,
    padding: 10,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  segmented: {
    alignSelf: "center",
    marginBottom: 14,
  },
  input: {
    marginBottom: 8,
    borderRadius: 10,
  },
  button: {
    marginTop: 15,
    borderRadius: 12,
    paddingVertical: 5,
  },
});
