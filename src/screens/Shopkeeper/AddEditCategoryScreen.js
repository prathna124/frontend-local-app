import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Switch,
  HelperText,
  useTheme,
} from "react-native-paper";

const AddEditCategoryScreen = ({ route, navigation }) => {
  const theme = useTheme();

  const { category = null, shopId } = route.params || {};

  const [name, setName] = useState(category?.name || "");
  const [isActive, setIsActive] = useState(
    category ? category.is_active : true
  );
  const [error, setError] = useState("");

  const nameRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: category ? "Edit Category" : "Add Category",
    });
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setError("");

    const payload = {
      shop_id: shopId,
      name: name.trim(),
      is_active: isActive,
    };

    console.log("SAVE CATEGORY", payload);

    // 🔗 API CALL HERE (add / update)
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.label}>Category Name *</Text>

        <TextInput
          ref={nameRef}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError("");
          }}
          placeholder="e.g. Dairy, Grocery"
          mode="outlined"
          returnKeyType="done"
          autoFocus
          cursorColor={theme.colors.primary}
          selectionColor={theme.colors.primary}
          outlineColor="#DDD"
          activeOutlineColor={theme.colors.primary}
          style={styles.input}
        />

        {!!error && (
          <HelperText type="error" visible>
            {error}
          </HelperText>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Category Status</Text>
          <View style={styles.switchBox}>
            <Text style={{ marginRight: 8 }}>
              {isActive ? "Active" : "Inactive"}
            </Text>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              color={theme.colors.primary}
            />
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveBtn}
          contentStyle={{ paddingVertical: 6 }}
        >
          {category ? "Update Category" : "Save Category"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddEditCategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  input: {
    backgroundColor: "#FFF",
    marginBottom: 4,
  },
  switchRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 15,
  },
  switchBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  saveBtn: {
    marginTop: 24,
    borderRadius: 10,
  },
});
