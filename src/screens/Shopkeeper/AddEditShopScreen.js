import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Checkbox,
  Surface,
  List,
  HelperText,
} from "react-native-paper";

import { useShop } from "../../context/ShopContext";
import { validateCreateShopForm } from "../../utils/validators";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";



/**
 * Dummy categories
 * DB: shop_categories
 */
const SHOP_CATEGORIES = [
  { id: 1, name: "Grocery" },
  { id: 2, name: "Dairy" },
  { id: 3, name: "Vegetables" },
  { id: 4, name: "Bakery" },
  { id: 5, name: "Pharmacy" },
];

export default function AddEditShopScreen({ route, navigation }) {
  const [errors, setErrors] = useState({});
   const editingShop = route?.params?.shop;
  const { addShop, updateShop, setActiveShop  } = useShop();
  const [addressProof, setAddressProof] = useState(null);


  /* Business Details */
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [businessRegNo, setBusinessRegNo] = useState("");
  const [taxId, setTaxId] = useState("");
  const [bankDetails, setBankDetails] = useState("");

  /* Address */
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  /* Category */
  const [categoryExpanded, setCategoryExpanded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  const selectedCategoryNames = SHOP_CATEGORIES
    .filter((c) => selectedCategories.includes(c.id))
    .map((c) => c.name)
    .join(", ");

  useEffect(() => {
    if (editingShop) {
      setShopName(editingShop.name || editingShop.shop_name || "");
      setDescription(editingShop.description || "");
      setBusinessRegNo(editingShop.business_registration_number || "");
      setTaxId(editingShop.tax_id || "");
      setBankDetails(editingShop.bank_account_details || "");
      setAddress(editingShop.street_address || "");
      setCity(editingShop.city || "");
      setState(editingShop.state || "");
      setPostalCode(editingShop.postal_code || "");
      setCountry(editingShop.country || "India");

      if (editingShop.address_proof) {
        setAddressProof({ uri: editingShop.address_proof });
      }

      // Pre-select categories from shop data (handles array of IDs or comma-separated names)
      const raw = editingShop.categories;
      if (Array.isArray(raw) && raw.length > 0) {
        const ids = raw.every((n) => typeof n === "number")
          ? raw
          : raw
              .map((v) =>
                SHOP_CATEGORIES.find((c) => c.name === String(v).trim())?.id
              )
              .filter(Boolean);
        setSelectedCategories(ids);
      } else if (typeof raw === "string" && raw.trim()) {
        const ids = raw
          .split(",")
          .map((s) => SHOP_CATEGORIES.find((c) => c.name === s.trim())?.id)
          .filter(Boolean);
        setSelectedCategories(ids);
      }
    }
  }, [editingShop]);

  /** Runs on Save only — not on blur or while typing. */
  const validateForm = () => {
    const { isValid, errors: validationErrors } = validateCreateShopForm({
      shop_name: shopName,
      business_registration_number: businessRegNo,
      tax_id: taxId,
      bank_account_details: bankDetails,
      address_proof: addressProof,
      description,
      categories: selectedCategories,
      street_address: address,
      city,
      state,
      postal_code: postalCode,
      country,
    });
    setErrors(validationErrors);
    return isValid;
  };

  const handleSave = async () => {

    if (!validateForm()) return;

    const payload = {
      shop_name: shopName.trim(),
      name: shopName.trim(), // For local/context display (ShopsListScreen uses .name)
      categories: selectedCategories,
      business_registration_number: businessRegNo.trim() || null,
      tax_id: taxId.trim() || null,
      bank_account_details: bankDetails.trim() || null,
      address_proof: addressProof?.uri || null,
      description: description.trim() || null,
      logo_url: null,
      banner_url: null,
      street_address: address.trim() || null,
      city: city.trim() || null,
      state: state.trim() || null,
      postal_code: postalCode.trim() || null,
      country: country.trim() || null,
    };

  /* ================= MOCK (FOR EXPO TESTING) ================= */

  const mockShop = {
    id: editingShop?.id || Date.now(),
    ...payload,
    status: "active",
    verified: false,
    isActiveShop: true,
  };

  editingShop ? updateShop(mockShop) : addShop(mockShop);
  setActiveShop(mockShop); // Accepts id or shop object (new shops not yet in state)

  navigation.goBack();

  

  /* ================= PRODUCTION READY =================

  const formData = new FormData();

  Object.keys(payload).forEach(key => {
    if (payload[key] !== null) {
      formData.append(key, payload[key]);
    }
  });

  if (addressProof) {
    formData.append("address_proof", {
      uri: addressProof.uri,
      name: "address.jpg",
      type: "image/jpeg",
    });
  }

  if (editingShop) {
    await axios.put(`/shops/${editingShop.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    await axios.post("/shops", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  navigation.goBack();

  ======================================================= */
  }

  const pickAddressProof = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAddressProof(result.assets[0]);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* BUSINESS DETAILS */}
      <Surface style={styles.card}>
        <Text variant="titleMedium">🏪 Shop Details</Text>

        <TextInput
          label="Shop Name *"
          mode="outlined"
          value={shopName}
          maxLength={255}
          onChangeText={setShopName}
          error={!!errors.shop_name}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.shop_name}>
          {errors.shop_name}
        </HelperText>

        <TextInput
          label="Description"
          mode="outlined"
          multiline
          numberOfLines={3}
          maxLength={500}
          value={description}
          onChangeText={setDescription}
          error={!!errors.description}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.description}>
          {errors.description}
        </HelperText>

        <TextInput
          label="Business Registration Number *"
          mode="outlined"
          value={businessRegNo}
          maxLength={100}
          onChangeText={setBusinessRegNo}
          error={!!errors.business_registration_number}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.business_registration_number}>
          {errors.business_registration_number}
        </HelperText>

        <TextInput
          label="GST / Tax ID *"
          mode="outlined"
          value={taxId}
          maxLength={100}
          onChangeText={setTaxId}
          error={!!errors.tax_id}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.tax_id}>
          {errors.tax_id}
        </HelperText>

        <TextInput
          label="Bank Account Details *"
          mode="outlined"
          value={bankDetails}
          maxLength={255}
          onChangeText={setBankDetails}
          error={!!errors.bank_account_details}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.bank_account_details}>
          {errors.bank_account_details}
        </HelperText>

        {/* NEW FIELD */}

        {/* FILE UPLOAD (UI ONLY) */}
        <Button
          mode="outlined"
          icon="upload"
          style={styles.uploadBtn}
          onPress={pickAddressProof}
        >
          Upload Address Proof *
        </Button>
        <HelperText type="error" visible={!!errors.address_proof}>
          {errors.address_proof}
        </HelperText>
        {addressProof && (
  <Image
    source={{ uri: addressProof.uri }}
    style={{
      width: "100%",
      height: 150,
      marginTop: 10,
      borderRadius: 8,
    }}
  />
)}
      </Surface>

      {/* BUSINESS CATEGORY */}
      <Surface style={styles.card}>
        <Text variant="titleMedium">📦 Shop Category</Text>
        <Text style={styles.helper}>
          Select one or more categories *
        </Text>

        <List.Accordion
          title={
            selectedCategoryNames.length
              ? selectedCategoryNames
              : "Select Categories"
          }
          expanded={categoryExpanded}
          onPress={() => setCategoryExpanded(!categoryExpanded)}
        >
          {SHOP_CATEGORIES.map((cat) => (
            <List.Item
              key={cat.id}
              title={cat.name}
              left={() => (
                <Checkbox
                  status={
                    selectedCategories.includes(cat.id)
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => toggleCategory(cat.id)}
                />
              )}
              onPress={() => toggleCategory(cat.id)}
            />
          ))}
        </List.Accordion>
        <HelperText type="error" visible={!!errors.categories}>
          {errors.categories}
        </HelperText>
      </Surface>

      {/* ADDRESS */}
      <Surface style={styles.card}>
        <Text variant="titleMedium">📍 Address Details</Text>

        <TextInput
          label="Shop Address *"
          mode="outlined"
          multiline
          maxLength={255}
          value={address}
          onChangeText={setAddress}
          error={!!errors.street_address}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.street_address}>
          {errors.street_address}
        </HelperText>

        <TextInput
          label="City *"
          mode="outlined"
          value={city}
          maxLength={50}
          onChangeText={setCity}
          error={!!errors.city}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.city}>
          {errors.city}
        </HelperText>

        <TextInput
          label="State *"
          mode="outlined"
          value={state}
          maxLength={50}
          onChangeText={setState}
          error={!!errors.state}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.state}>
          {errors.state}
        </HelperText>

        <TextInput
          label="Postal Code *"
          mode="outlined"
          keyboardType="number-pad"
          value={postalCode}
          onChangeText={setPostalCode}
          error={!!errors.postal_code}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.postal_code}>
          {errors.postal_code}
        </HelperText>

        <TextInput
          label="Country *"
          mode="outlined"
          value={country}
          maxLength={50}
          onChangeText={setCountry}
          error={!!errors.country}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.country}>
          {errors.country}
        </HelperText>
      </Surface>

      {/* SAVE */}
      <Button
        mode="contained"
        style={styles.saveBtn}
        onPress={handleSave}
      >
        SAVE SHOP
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  input: {
    marginTop: 12,
  },
  helper: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  uploadBtn: {
    marginTop: 12,
  },
  saveBtn: {
    marginTop: 8,
    paddingVertical: 6,
  },
});