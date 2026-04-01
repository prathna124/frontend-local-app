import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { WIDTH as wp, HEIGHT as hp } from "../../utils/responsive";

export default function ShopOwnerProfileScreen() {
  const [form, setForm] = useState({
    first_name: "Rakesh",
    last_name: "Patel",
    email: "rakesh@gmail.com",
    phone_number: "9876543210",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = () => {
    // API CALL -> update user_accounts
    console.log(form);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Owner Profile</Text>

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
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fa",
    padding: wp(4),
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
  input: {
    marginBottom: hp(1.5),
  },
  btn: {
    marginTop: hp(2),
  },
});
