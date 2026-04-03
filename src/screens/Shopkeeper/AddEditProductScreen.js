import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  Image,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Switch,
  Surface,
  HelperText,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import {
  getProductCategories,
  getMyShops,
  createProduct,
  updateProduct,
} from "../../api/productsApi";
import { validateProductForm } from "../../utils/validators";
import { useShop } from "../../context/ShopContext";

const AddEditProductScreen = ({ navigation, route }) => {
  const { shopId: routeShopId, product } = route.params || {};
  const { shops: contextShops, activeShop } = useShop();

  const isEdit = !!product;
  const productId = product?.product_id ?? product?.id;

  const priceRef = useRef(null);
  const discountRef = useRef(null);
  const stockRef = useRef(null);
  const skuRef = useRef(null);
  const descRef = useRef(null);

  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [selectedShopId, setSelectedShopId] = useState(null);
  /** 'shop' | 'category' | null — only one inline dropdown open at a time */
  const [openDropdown, setOpenDropdown] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState("active");
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? "Edit Product" : "Add Product",
    });
  }, [isEdit]);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const data = await getMyShops();
        const list = Array.isArray(data) ? data : data?.shops ?? data?.data ?? [];
        setShops(normalizeShops(list));
      } catch {
        setShops(normalizeShops(contextShops));
      } finally {
        setShopsLoading(false);
      }
    };
    loadShops();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getProductCategories();
        const list = Array.isArray(data) ? data : data?.categories ?? data?.data ?? [];
        setCategories(normalizeProductCategories(list));
      } catch {
        setCategories(normalizeProductCategories(getMockCategories()));
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const sid =
      routeShopId ??
      product?.shop_id ??
      activeShop?.id ??
      null;
    if (sid != null) setSelectedShopId(Number(sid));
  }, [routeShopId, product?.shop_id, activeShop?.id]);

  useEffect(() => {
    if (isEdit && product) {
      setName(product.name ?? "");
      setDescription(product.description ?? "");
      setBasePrice(String(product.base_price ?? ""));
      setDiscountPrice(String(product.discount_price ?? ""));
      setQuantityAvailable(String(product.quantity_available ?? ""));
      setSku(product.sku ?? "");
      setStatus(
        String(product.status ?? "active").toLowerCase() === "active"
          ? "active"
          : "inactive"
      );
      const ids =
        product.category_ids ??
        product.categories?.map((c) => (typeof c === "object" ? c.category_id ?? c.id : c)) ??
        [];
      const firstId = Array.isArray(ids) && ids.length > 0 ? Number(ids[0]) : null;
      setSelectedCategoryId(Number.isFinite(firstId) ? firstId : null);

      const img =
        product.image_url ??
        product.primary_image_url ??
        (Array.isArray(product.images) && product.images.length > 0
          ? product.images.find((im) => im?.is_primary)?.image_url ??
            product.images[0]?.image_url
          : null);
      if (img) setProductImage({ uri: img });
    }
  }, [isEdit, product]);

  const categoryOptions = useMemo(
    () => orderCategoriesForDropdown(categories),
    [categories]
  );

  const selectedCategory = categories.find(
    (c) => c.category_id === selectedCategoryId
  );
  const selectedShop = shops.find((s) => s.shop_id === selectedShopId);

  const toggleShopDropdown = () => {
    if (shopPickerLocked) return;
    Keyboard.dismiss();
    setOpenDropdown((k) => (k === "shop" ? null : "shop"));
  };

  const toggleCategoryDropdown = () => {
    Keyboard.dismiss();
    setOpenDropdown((k) => (k === "category" ? null : "category"));
  };

  const pickProductImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setProductImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    const payload = {
      shop_id: selectedShopId,
      name: name.trim(),
      description: description.trim() || null,
      base_price: parseFloat(basePrice) || 0,
      discount_price: parseFloat(discountPrice) || 0,
      quantity_available: parseInt(quantityAvailable, 10) || 0,
      sku: sku.trim() || null,
      status: status,
      category_ids:
        selectedCategoryId != null ? [selectedCategoryId] : [],
      image_url: productImage?.uri || null,
    };

    const { isValid, errors } = validateProductForm(payload);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    setSaving(true);
    try {
      if (isEdit) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }
      navigation.goBack();
    } catch (err) {
      setFormErrors({
        submit: err.response?.data?.message || err.message || "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  const isActive = status === "active";
  const shopPickerLocked = isEdit;

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        onScrollBeginDrag={() => setOpenDropdown(null)}
      >
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleSmall" style={styles.cardHint}>
            {isEdit ? "Update product details" : "Choose shop, then fill product details"}
          </Text>

          {/* Shop (public.shops) */}
          <InlineExpandableSelect
            expanded={openDropdown === "shop"}
            onToggle={toggleShopDropdown}
            loading={shopsLoading}
            placeholder="Select shop"
            displayValue={selectedShop?.shop_name}
            error={!!formErrors.shop_id}
            disabled={shopPickerLocked}
            data={shops}
            emptyLabel="No shops available"
            selectedId={selectedShopId}
            getItemId={(item) => item.shop_id}
            renderLabel={(item) => item.shop_name}
            renderSubtitle={(item) =>
              item.status ? `Status: ${item.status}` : null
            }
            onSelectItem={(item) => {
              setSelectedShopId(item.shop_id);
              setFormErrors((e) => ({ ...e, shop_id: "" }));
              setOpenDropdown(null);
            }}
          />
          {shopPickerLocked && (
            <HelperText type="info" visible>
              Shop cannot be changed when editing
            </HelperText>
          )}
          <HelperText type="error" visible={!!formErrors.shop_id}>
            {formErrors.shop_id}
          </HelperText>

          {/* PRODUCT NAME */}
          <TextInput
            label="Product Name *"
            mode="outlined"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (formErrors.name) setFormErrors((e) => ({ ...e, name: "" }));
            }}
            style={styles.input}
            error={!!formErrors.name}
            returnKeyType="next"
            onSubmitEditing={() => priceRef.current?.focus()}
          />
          <HelperText type="error" visible={!!formErrors.name}>
            {formErrors.name}
          </HelperText>

          {/* DESCRIPTION */}
          <TextInput
            ref={descRef}
            label="Description"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
            numberOfLines={3}
            returnKeyType="next"
            
          />

          {/* Product category (product_categories) */}
          <InlineExpandableSelect
            expanded={openDropdown === "category"}
            onToggle={toggleCategoryDropdown}
            loading={categoriesLoading}
            placeholder="Select category"
            displayValue={selectedCategory?.name}
            error={!!formErrors.category_ids}
            disabled={false}
            data={categoryOptions}
            emptyLabel="No categories available"
            selectedId={selectedCategoryId}
            getItemId={(item) => item.category_id}
            renderLabel={(item) => `${"  ".repeat(item.depth)}${item.name}`.trim()}
            onSelectItem={(item) => {
              setSelectedCategoryId(item.category_id);
              setFormErrors((e) => ({ ...e, category_ids: "" }));
              setOpenDropdown(null);
            }}
          />
          <HelperText type="error" visible={!!formErrors.category_ids}>
            {formErrors.category_ids}
          </HelperText>

          {/* BASE PRICE */}
          <TextInput
            ref={priceRef}
            label="Base Price (₹) *"
            mode="outlined"
            keyboardType="decimal-pad"
            value={basePrice}
            onChangeText={(text) => {
              setBasePrice(text);
              if (formErrors.base_price) setFormErrors((e) => ({ ...e, base_price: "" }));
            }}
            style={styles.input}
            error={!!formErrors.base_price}
            returnKeyType="next"
            onSubmitEditing={() => discountRef.current?.focus()}
          />
          <HelperText type="error" visible={!!formErrors.base_price}>
            {formErrors.base_price}
          </HelperText>

          {/* DISCOUNT PRICE */}
          <TextInput
            ref={discountRef}
            label="Discount Price (₹) - optional"
            mode="outlined"
            keyboardType="decimal-pad"
            value={discountPrice}
            onChangeText={(text) => {
              setDiscountPrice(text);
              if (formErrors.discount_price) setFormErrors((e) => ({ ...e, discount_price: "" }));
            }}
            style={styles.input}
            error={!!formErrors.discount_price}
            returnKeyType="next"
            onSubmitEditing={() => stockRef.current?.focus()}
          />
          <HelperText type="error" visible={!!formErrors.discount_price}>
            {formErrors.discount_price}
          </HelperText>

          {/* STOCK */}
          <TextInput
            ref={stockRef}
            label="Stock Quantity *"
            mode="outlined"
            keyboardType="number-pad"
            value={quantityAvailable}
            onChangeText={(text) => {
              setQuantityAvailable(text);
              if (formErrors.quantity_available)
                setFormErrors((e) => ({ ...e, quantity_available: "" }));
            }}
            style={styles.input}
            error={!!formErrors.quantity_available}
            returnKeyType="next"
            onSubmitEditing={() => skuRef.current?.focus()}
          />
          <HelperText type="error" visible={!!formErrors.quantity_available}>
            {formErrors.quantity_available}
          </HelperText>

          {/* SKU */}
          <TextInput
            ref={skuRef}
            label="SKU / Barcode"
            mode="outlined"
            value={sku}
            onChangeText={setSku}
            style={styles.input}
          />

          <Button
            mode="outlined"
            icon="upload"
            style={styles.uploadBtn}
            onPress={pickProductImage}
          >
            Upload Product Image
          </Button>
          {productImage?.uri ? (
            <Image
              source={{ uri: productImage.uri }}
              style={styles.productImagePreview}
            />
          ) : null}

          <View style={styles.switchRow}>
            <Text>Product Active</Text>
            <Switch
              value={isActive}
              onValueChange={(v) => setStatus(v ? "active" : "inactive")}
            />
          </View>
        </Surface>

        {formErrors.submit && (
          <HelperText type="error" visible style={styles.submitError}>
            {formErrors.submit}
          </HelperText>
        )}

        <Button
          mode="contained"
          style={styles.saveBtn}
          onPress={handleSave}
          loading={saving}
          disabled={saving}
        >
          {isEdit ? "UPDATE PRODUCT" : "SAVE PRODUCT"}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InlineExpandableSelect({
  expanded,
  onToggle,
  loading,
  placeholder,
  displayValue,
  error,
  disabled,
  data,
  emptyLabel,
  selectedId,
  getItemId,
  renderLabel,
  renderSubtitle,
  onSelectItem,
}) {
  const showChevron = !disabled && !loading;
  const headerText = displayValue || placeholder;
  const isPlaceholder = !displayValue;

  return (
    <View
      style={[
        styles.ddOuter,
        { marginTop: 12 },
        expanded && styles.ddOuterExpanded,
        disabled && styles.ddOuterDisabled,
      ]}
    >
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.85}
        onPress={() => {
          if (disabled || loading) return;
          onToggle();
        }}
        style={styles.ddTrigger}
      >
        {loading ? (
          <ActivityIndicator size="small" style={styles.ddLoader} />
        ) : (
          <>
            <Text
              style={[
                styles.ddTriggerText,
                isPlaceholder && styles.ddTriggerPlaceholder,
              ]}
              numberOfLines={1}
            >
              {headerText}
            </Text>
            {showChevron && (
              <MaterialCommunityIcons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={22}
              />
            )}
          </>
        )}
      </TouchableOpacity>

      {expanded && !loading && !disabled && (
        <View style={styles.ddList}>
          {data.length === 0 ? (
            <View style={styles.ddEmpty}>
              <Text style={styles.ddEmptyText}>{emptyLabel}</Text>
            </View>
          ) : (
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              style={styles.ddScroll}
              contentContainerStyle={styles.ddScrollContent}
            >
              {data.map((item) => {
                const id = getItemId(item);
                const selected = selectedId === id;
                return (
                  <TouchableOpacity
                    key={String(id)}
                    activeOpacity={0.75}
                    style={[
                      styles.ddItem,
                      selected,
                    ]}
                    onPress={() => onSelectItem(item)}
                  >
                    <Text style={styles.ddItemTitle}>{renderLabel(item)}</Text>
                    {renderSubtitle?.(item) ? (
                      <Text style={styles.ddItemSub}>{renderSubtitle(item)}</Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

function getMockCategories() {
  return [
    { category_id: 1, name: "Grocery", parent_category_id: null },
    { category_id: 2, name: "Dairy", parent_category_id: null },
    { category_id: 3, name: "Bakery", parent_category_id: null },
    { category_id: 4, name: "Vegetables", parent_category_id: null },
    { category_id: 5, name: "Fruits", parent_category_id: null },
    { category_id: 6, name: "Meat", parent_category_id: null },
    { category_id: 7, name: "Fish", parent_category_id: null },
    { category_id: 8, name: "Eggs", parent_category_id: null },
    { category_id: 9, name: "Seafood", parent_category_id: null },  
    { category_id: 10, name: "Poultry", parent_category_id: null },
    { category_id: 11, name: "Beverages", parent_category_id: null },
    { category_id: 12, name: "Alcohol", parent_category_id: null },
    { category_id: 13, name: "Snacks", parent_category_id: null },
    { category_id: 14, name: "Dairy", parent_category_id: null },
    { category_id: 15, name: "Dairy", parent_category_id: null },
  ];
}

/** public.shops → shop_id, shop_name, status */
function normalizeShops(list) {
  return (list || [])
    .map((row) => ({
      shop_id: Number(row.shop_id ?? row.id),
      shop_name: row.shop_name ?? row.name ?? "",
      status: row.status ?? null,
    }))
    .filter((s) => Number.isFinite(s.shop_id) && s.shop_name.trim().length > 0);
}

function normalizeProductCategories(list) {
  return (list || [])
    .map((row) => ({
      category_id: Number(row.category_id ?? row.id),
      name: row.name ?? "",
      description: row.description ?? null,
      parent_category_id:
        row.parent_category_id != null && row.parent_category_id !== ""
          ? Number(row.parent_category_id)
          : null,
    }))
    .filter((c) => Number.isFinite(c.category_id) && c.name.trim().length > 0);
}

function orderCategoriesForDropdown(normalized) {
  if (!normalized?.length) return [];

  const byParent = new Map();
  for (const c of normalized) {
    const key = c.parent_category_id ?? "__root__";
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(c);
  }
  for (const arr of byParent.values()) {
    arr.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }

  const result = [];
  const seen = new Set();

  function walk(parentKey, depth) {
    const kids = byParent.get(parentKey) ?? [];
    for (const c of kids) {
      if (seen.has(c.category_id)) continue;
      seen.add(c.category_id);
      result.push({ ...c, depth });
      walk(c.category_id, depth + 1);
    }
  }

  walk("__root__", 0);

  for (const c of normalized) {
    if (!seen.has(c.category_id)) {
      seen.add(c.category_id);
      result.push({ ...c, depth: 0 });
    }
  }

  return result;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  cardHint: {
    marginBottom: 12,
    opacity: 0.85,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  input: {
    marginTop: 12,
  },
  ddOuter: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  ddOuterExpanded: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
    }),
  },
  ddOuterDisabled: {
    backgroundColor: "#FAFAFA",
    opacity: 0.92,
  },
  ddTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  ddTriggerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  ddTriggerPlaceholder: {
    fontWeight: "600",
  },
  ddLoader: {
    marginVertical: 4,
  },
  ddList: {
    backgroundColor: "#FFFFFF",
  },
  ddScroll: {
    maxHeight: 260,
  },
  ddScrollContent: {
    paddingBottom: 4,
  },
  ddItem: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  ddItemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  ddItemSub: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  ddEmpty: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  ddEmptyText: {
    fontSize: 14,
    fontWeight: "500",
  },
  uploadBtn: {
    marginTop: 12,
  },
  productImagePreview: {
    width: "100%",
    height: 150,
    marginTop: 10,
    borderRadius: 8,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  saveBtn: {
    marginTop: 20,
    paddingVertical: 6,
    borderRadius: 14,
  },
  submitError: {
    marginTop: 8,
  },
});

export default AddEditProductScreen;
