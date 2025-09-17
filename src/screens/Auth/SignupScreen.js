// src/screens/Auth/SignupScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  SegmentedButtons,
  Checkbox,
  RadioButton,
  useTheme,
  IconButton,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateDOB,
  validateAddress,
  validateCity,
  validateState,
  validatePostalCode,
  validateCountry,
  validateShopName,
} from "../../utils/validators";

export default function SignupScreen({ navigation, route, onToggleTheme, isDark}) {
  const { colors } = useTheme();

  const [role, setRole] = useState("customer");

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Customer-specific
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [shipping, setShipping] = useState({
    street: "",
    city: "",
    state: "",
    postal: "",
    country: "",
    type: "home",
  });
  const [billing, setBilling] = useState({
    street: "",
    city: "",
    state: "",
    postal: "",
    country: "",
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Shopkeeper-specific
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState({
    street: "",
    city: "",
    state: "",
    postal: "",
    country: "",
  });
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [addressProof, setAddressProof] = useState(null);

  const [errors, setErrors] = useState({});

  const validateAll = () => {
    let newErrors = {};

    // Common
    if (validateName(name)) newErrors.name = validateName(name);
    if (validateEmail(email)) newErrors.email = validateEmail(email);
    if (validatePhone(phone)) newErrors.phone = validatePhone(phone);
    if (validatePassword(password)) newErrors.password = validatePassword(password);
    if (confirm !== password) newErrors.confirm = "Passwords do not match";

    if (role === "customer") {
      if (validateDOB(dob)) newErrors.dob = validateDOB(dob);
      if (validateAddress(shipping.street)) newErrors.shippingStreet = validateAddress(shipping.street);
      if (validateCity(shipping.city)) newErrors.shippingCity = validateCity(shipping.city);
      if (validateState(shipping.state)) newErrors.shippingState = validateState(shipping.state);
      if (validatePostalCode(shipping.postal)) newErrors.shippingPostal = validatePostalCode(shipping.postal);
      if (validateCountry(shipping.country)) newErrors.shippingCountry = validateCountry(shipping.country);

      if (!sameAsShipping) {
        if (validateAddress(billing.street)) newErrors.billingStreet = validateAddress(billing.street);
        if (validateCity(billing.city)) newErrors.billingCity = validateCity(billing.city);
        if (validateState(billing.state)) newErrors.billingState = validateState(billing.state);
        if (validatePostalCode(billing.postal)) newErrors.billingPostal = validatePostalCode(billing.postal);
        if (validateCountry(billing.country)) newErrors.billingCountry = validateCountry(billing.country);
      }
    }

    if (role === "shopkeeper") {
      if (validateShopName(shopName)) newErrors.shopName = validateShopName(shopName);
      if (validateAddress(shopAddress.street)) newErrors.shopStreet = validateAddress(shopAddress.street);
      if (validateCity(shopAddress.city)) newErrors.shopCity = validateCity(shopAddress.city);
      if (validateState(shopAddress.state)) newErrors.shopState = validateState(shopAddress.state);
      if (validatePostalCode(shopAddress.postal)) newErrors.shopPostal = validatePostalCode(shopAddress.postal);
      if (validateCountry(shopAddress.country)) newErrors.shopCountry = validateCountry(shopAddress.country);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validateAll()) return;

    let payload = { role, name, email, phone, password };

    if (role === "customer") {
      payload = { ...payload, dob, shipping, billing: sameAsShipping ? shipping : billing };
    } else {
      payload = { ...payload, shopName, shopAddress, logo, banner, addressProof };
    }

    console.log("Signup Payload:", payload);
    navigation.replace("Home");
  };

  return (
    <View style={styles.mainContainer}>
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
          showsVerticalScrollIndicator={true} style={{ flex: 1 }}
        >
          <View style={[styles.formContainer, { backgroundColor: colors.background }]}>
            <Text variant="headlineLarge" style={[styles.title, { color: colors.primary, marginTop: 30}]}>
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
              style={{ marginBottom: 12 }}
            />

            {/* Common Fields */}
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              error={!!errors.name}
              left={<TextInput.Icon icon="account-outline" />}
            />
            <HelperText type="error" visible={!!errors.name}>{errors.name}</HelperText>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              style={styles.input}
              error={!!errors.email}
              left={<TextInput.Icon icon="email-outline" />}
            />
            <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>

            <TextInput
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              error={!!errors.phone}
              left={<TextInput.Icon icon="phone-outline" />}
            />
            <HelperText type="error" visible={!!errors.phone}>{errors.phone}</HelperText>

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
            <HelperText type="error" visible={!!errors.password}>{errors.password}</HelperText>

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
            <HelperText type="error" visible={!!errors.confirm}>{errors.confirm}</HelperText>

            {/* Customer Fields */}
            {role === "customer" && (
              <>
                {/* DOB as TextInput */}
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <TextInput
                    label="Date of Birth"
                    value={dob}
                    mode="outlined"
                    style={styles.input}
                    editable={false}
                    placeholder="Select Date of Birth"
                    left={<TextInput.Icon icon="calendar" />}
                    error={!!errors.dob}
                  />
                </TouchableOpacity>
                <HelperText type="error" visible={!!errors.dob}>{errors.dob}</HelperText>

                {showDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        const d = selectedDate;
                        const formatted = `${("0" + d.getDate()).slice(-2)}-${(
                          "0" + (d.getMonth() + 1)
                        ).slice(-2)}-${d.getFullYear()}`;
                        setDob(formatted);
                      }
                    }}
                  />
                )}

                <Text style={styles.section}>Shipping Address</Text>
                <TextInput
                  label="Street Address"
                  value={shipping.street}
                  onChangeText={(t) => setShipping({ ...shipping, street: t })}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.shippingStreet}
                  left={<TextInput.Icon icon="home-outline" />}
                />
                <HelperText type="error" visible={!!errors.shippingStreet}>{errors.shippingStreet}</HelperText>

                <TextInput
                  label="City"
                  value={shipping.city}
                  onChangeText={(t) => setShipping({ ...shipping, city: t })}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.shippingCity}
                  left={<TextInput.Icon icon="city" />}
                />
                <HelperText type="error" visible={!!errors.shippingCity}>{errors.shippingCity}</HelperText>

                <TextInput
                  label="State"
                  value={shipping.state}
                  onChangeText={(t) => setShipping({ ...shipping, state: t })}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.shippingState}
                  left={<TextInput.Icon icon="map" />}
                />
                <HelperText type="error" visible={!!errors.shippingState}>{errors.shippingState}</HelperText>

                <TextInput
                  label="Postal Code"
                  value={shipping.postal}
                  onChangeText={(t) => setShipping({ ...shipping, postal: t.replace(/[^0-9]/g, "") })}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  error={!!errors.shippingPostal}
                  left={<TextInput.Icon icon="numeric" />}
                />
                <HelperText type="error" visible={!!errors.shippingPostal}>{errors.shippingPostal}</HelperText>

                <TextInput
                  label="Country"
                  value={shipping.country}
                  onChangeText={(t) => setShipping({ ...shipping, country: t })}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.shippingCountry}
                  left={<TextInput.Icon icon="earth" />}
                />
                <HelperText type="error" visible={!!errors.shippingCountry}>{errors.shippingCountry}</HelperText>

                {/* Address Type Radio */}
                <RadioButton.Group
                  onValueChange={(value) => setShipping({ ...shipping, type: value })}
                  value={shipping.type}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                    <RadioButton value="home" />
                    <Text style={{ marginRight: 16 }}>Home</Text>
                    <RadioButton value="work" />
                    <Text style={{ marginRight: 16 }}>Work</Text>
                    <RadioButton value="shop" />
                    <Text>Shop</Text>
                  </View>
                </RadioButton.Group>

                {/* Billing */}
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>
                  <Checkbox
                    status={sameAsShipping ? "checked" : "unchecked"}
                    onPress={() => setSameAsShipping(!sameAsShipping)}
                  />
                  <Text>Billing address same as shipping</Text>
                </View>

                {!sameAsShipping && (
                  <>
                    <Text style={styles.section}>Billing Address</Text>
                    <TextInput
                      label="Street Address"
                      value={billing.street}
                      onChangeText={(t) => setBilling({ ...billing, street: t })}
                      mode="outlined"
                      style={styles.input}
                      error={!!errors.billingStreet}
                      left={<TextInput.Icon icon="home-outline" />}
                    />
                    <HelperText type="error" visible={!!errors.billingStreet}>{errors.billingStreet}</HelperText>

                    <TextInput
                      label="City"
                      value={billing.city}
                      onChangeText={(t) => setBilling({ ...billing, city: t })}
                      mode="outlined"
                      style={styles.input}
                      error={!!errors.billingCity}
                      left={<TextInput.Icon icon="city" />}
                    />
                    <HelperText type="error" visible={!!errors.billingCity}>{errors.billingCity}</HelperText>

                    <TextInput
                      label="State"
                      value={billing.state}
                      onChangeText={(t) => setBilling({ ...billing, state: t })}
                      mode="outlined"
                      style={styles.input}
                      error={!!errors.billingState}
                      left={<TextInput.Icon icon="map" />}
                    />
                    <HelperText type="error" visible={!!errors.billingState}>{errors.billingState}</HelperText>

                    <TextInput
                      label="Postal Code"
                      value={billing.postal}
                      onChangeText={(t) => setBilling({ ...billing, postal: t.replace(/[^0-9]/g, "") })}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                      error={!!errors.billingPostal}
                      left={<TextInput.Icon icon="numeric" />}
                    />
                    <HelperText type="error" visible={!!errors.billingPostal}>{errors.billingPostal}</HelperText>

                    <TextInput
                      label="Country"
                      value={billing.country}
                      onChangeText={(t) => setBilling({ ...billing, country: t })}
                      mode="outlined"
                      style={styles.input}
                      error={!!errors.billingCountry}
                      left={<TextInput.Icon icon="earth" />}
                    />
                    <HelperText type="error" visible={!!errors.billingCountry}>{errors.billingCountry}</HelperText>
                  </>
                )}
              </>
            )}

            {/* Shopkeeper Fields */}
            {role === "shopkeeper" && (
              <>
                <TextInput
                  label="Shop Name"
                  value={shopName}
                  onChangeText={setShopName}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="store" />}
                  error={!!errors.shopName}
                />
                <HelperText type="error" visible={!!errors.shopName}>{errors.shopName}</HelperText>

                <Text style={styles.section}>Shop Address</Text>
                <TextInput
                  label="Street Address"
                  value={shopAddress.street}
                  onChangeText={(t) => setShopAddress({ ...shopAddress, street: t })}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.shopStreet}
                  left={<TextInput.Icon icon="home-outline" />}
                />
                <HelperText type="error" visible={!!errors.shopStreet}>{errors.shopStreet}</HelperText>

                <TextInput
                  label="City"
                  value={shopAddress.city}
                  onChangeText={(t) => setShopAddress({ ...shopAddress, city: t })}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.shopCity}
                  left={<TextInput.Icon icon="city" />}
                />
                <HelperText type="error" visible={!!errors.shopCity}>{errors.shopCity}</HelperText>

                <TextInput
                  label="State"
                  value={shopAddress.state}
                  onChangeText={(t) => setShopAddress({ ...shopAddress, state: t })}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.shopState}
                  left={<TextInput.Icon icon="map" />}
                />
                <HelperText type="error" visible={!!errors.shopState}>{errors.shopState}</HelperText>

                <TextInput
                  label="Postal Code"
                  value={shopAddress.postal}
                  onChangeText={(t) => setShopAddress({ ...shopAddress, postal: t.replace(/[^0-9]/g, "") })}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  error={!!errors.shopPostal}
                  left={<TextInput.Icon icon="numeric" />}
                />
                <HelperText type="error" visible={!!errors.shopPostal}>{errors.shopPostal}</HelperText>

                <TextInput
                  label="Country"
                  value={shopAddress.country}
                  onChangeText={(t) => setShopAddress({ ...shopAddress, country: t })}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.shopCountry}
                  left={<TextInput.Icon icon="earth" />}
                />
                <HelperText type="error" visible={!!errors.shopCountry}>{errors.shopCountry}</HelperText>

                <Button mode="outlined" style={styles.uploadBtn}>Upload Logo</Button>
                <Button mode="outlined" style={styles.uploadBtn}>Upload Banner</Button>
                <Button mode="outlined" style={styles.uploadBtn}>Upload Address Proof</Button>
              </>
            )}

            <Button mode="contained" onPress={handleSignup} style={styles.button}>
              Sign Up
            </Button>

            <Button onPress={() => navigation.goBack()} style={[{ marginBottom: 30}]}>Already have an account? Login</Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
        flex: 1
    },
    keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: 16, // Use horizontal padding for left/right
  },
  title: { textAlign: "center", marginBottom: 12, fontWeight: "bold", marginTop: 15 },
  input: { marginBottom: 6 },
  section: { marginTop: 12, fontWeight: "bold", fontSize: 15 },
  button: { marginTop: 8 },
  uploadBtn: { marginBottom: 6 },
  themeToggle: {
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 1, 
    },
});
