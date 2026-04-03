import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  TextInput,
  Button,
  Card,
  ActivityIndicator,
  HelperText,
} from "react-native-paper";
import api, { setAuthToken, getApiTokenHeaders } from "../../api/api";
import { WIDTH as wp, HEIGHT as hp } from "../../utils/responsive";

const PROFILE_PATH = "/auth/v1/shopkeepers/profile";

function normalizeProfilePayload(data) {
  const src = data?.data ?? data?.user ?? data ?? {};
  return {
    first_name: String(src.first_name ?? ""),
    last_name: String(src.last_name ?? ""),
    email: String(src.email ?? ""),
    phone_number: String(src.phone_number ?? src.phone ?? ""),
  };
}

export default function ShopOwnerProfileScreen() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadProfile = useCallback(async () => {
    setLoadError("");
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) setAuthToken(token);

      const res = await api.get(PROFILE_PATH, {
        headers: getApiTokenHeaders(),
      });
      setForm(normalizeProfilePayload(res.data));
    } catch (e) {
      const msg =
        e?.response?.data?.message ??
        e?.message ??
        "Could not load profile.";
      setLoadError(typeof msg === "string" ? msg : "Could not load profile.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    // API CALL -> update user_accounts
    console.log(form);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      keyboardShouldPersistTaps="handled"
    >
      <Card style={styles.card}>
        <Text style={styles.title}>Owner Profile</Text>

        {loadError ? (
          <HelperText type="error" visible style={styles.helper}>
            {loadError}
          </HelperText>
        ) : null}
        {error ? (
          <HelperText type="error" visible style={styles.helper}>
            {error}
          </HelperText>
        ) : null}

        <TextInput
          label="First Name"
          value={form.first_name}
          onChangeText={(v) => handleChange("first_name", v)}
          style={styles.input}
        />

        <TextInput
          label="Last Name"
          value={form.last_name}
          onChangeText={(v) => handleChange("last_name", v)}
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={form.email}
          disabled
          style={styles.input}
        />

        <TextInput
          label="Phone Number"
          value={form.phone_number}
          onChangeText={(v) => handleChange("phone_number", v)}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleUpdate}
          style={styles.btn}
        >
          Update Profile
        </Button>
      </Card>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f4f6fa",
  },
  container: {
    flexGrow: 1,
    padding: wp(4),
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  muted: {
    marginTop: hp(1.5),
    opacity: 0.7,
  },
  card: {
    padding: wp(4),
    borderRadius: wp(3),
  },
  title: {
    fontSize: wp(4.8),
    fontWeight: "600",
    marginBottom: hp(2),
  },
  helper: {
    marginBottom: hp(1),
  },
  input: {
    marginBottom: hp(1.5),
  },
  btn: {
    marginTop: hp(2),
  },
});
