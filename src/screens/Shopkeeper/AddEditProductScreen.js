import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Switch,
  Surface,
  HelperText,
  Divider,
  useTheme,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getProductCategories,
  getMyShops,
  createProduct,
  updateProduct,
} from "../../api/productsApi";
import { validateProductForm } from "../../utils/validators";
import { useShop } from "../../context/ShopContext";

const AddEditProductScreen = ({ navigation, route }) => {
  const theme = useTheme();
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
  const [shopModalVisible, setShopModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState("active");

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

  const openShopModal = useCallback(() => {
    Keyboard.dismiss();
    setShopModalVisible(true);
  }, []);

  const openCategoryModal = useCallback(() => {
    Keyboard.dismiss();
    setCategoryModalVisible(true);
  }, []);

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
      >
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleSmall" style={styles.cardHint}>
            {isEdit ? "Update product details" : "Choose shop, then fill product details"}
          </Text>

          {/* Shop (public.shops) */}
          <Text style={styles.fieldLabel}>Shop *</Text>
          <PickerField
            loading={shopsLoading}
            placeholder="Select shop"
            value={selectedShop?.shop_name}
            error={!!formErrors.shop_id}
            disabled={shopPickerLocked}
            onPress={openShopModal}
            icon="store-outline"
            theme={theme}
          />
          {shopPickerLocked && (
            <HelperText type="info" visible>
              Shop cannot be changed when editing
            </HelperText>
          )}
          <HelperText type="error" visible={!!formErrors.shop_id}>
            {formErrors.shop_id}
          </HelperText>

          <Divider style={styles.divider} />

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

          {/* Product category — Modal picker (reliable vs Menu in ScrollView) */}
          <Text style={styles.fieldLabel}>Product Category *</Text>
          <PickerField
            loading={categoriesLoading}
            placeholder="Select category"
            value={selectedCategory?.name}
            error={!!formErrors.category_ids}
            onPress={openCategoryModal}
            icon="shape-outline"
            theme={theme}
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
            icon="image"
            mode="outlined"
            style={styles.uploadBtn}
            onPress={() => {}}
          >
            Upload Product Image
          </Button>

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

      <SelectModal
        visible={shopModalVisible}
        onDismiss={() => setShopModalVisible(false)}
        title="Select shop"
        theme={theme}
        data={shops}
        keyExtractor={(item) => String(item.shop_id)}
        selectedId={selectedShopId}
        onSelect={(item) => {
          setSelectedShopId(item.shop_id);
          setFormErrors((e) => ({ ...e, shop_id: "" }));
        }}
        renderTitle={(item) => item.shop_name}
        renderSubtitle={(item) =>
          item.status ? `Status: ${item.status}` : null
        }
      />

      <SelectModal
        visible={categoryModalVisible}
        onDismiss={() => setCategoryModalVisible(false)}
        title="Select category"
        theme={theme}
        data={categoryOptions}
        keyExtractor={(item) => String(item.category_id)}
        selectedId={selectedCategoryId}
        onSelect={(item) => {
          setSelectedCategoryId(item.category_id);
          setFormErrors((e) => ({ ...e, category_ids: "" }));
        }}
        renderTitle={(item) => `${"  ".repeat(item.depth)}${item.name}`}
        emptyMessage="No categories found"
      />
    </KeyboardAvoidingView>
  );
}

function PickerField({
  loading,
  placeholder,
  value,
  error,
  disabled,
  onPress,
  icon,
  theme,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.pickerRow,
        {
          borderColor: error ? theme.colors.error : "#E0E0E0",
          backgroundColor: disabled ? "#F5F5F5" : "#FAFAFA",
          opacity: disabled ? 0.85 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <>
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.pickerText,
              !value && styles.pickerPlaceholder,
            ]}
            numberOfLines={1}
          >
            {value || placeholder}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={22}
            color={theme.colors.onSurfaceVariant}
          />
        </>
      )}
    </TouchableOpacity>
  );
}

function SelectModal({
  visible,
  onDismiss,
  title,
  data,
  keyExtractor,
  selectedId,
  onSelect,
  renderTitle,
  renderSubtitle,
  emptyMessage,
  theme,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onDismiss}
        />
        <View style={[styles.modalSheet, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {title}
            </Text>
            <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
          <Divider />
          {data.length === 0 ? (
            <View style={styles.modalEmpty}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                {emptyMessage ?? "Nothing to show"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={keyExtractor}
              keyboardShouldPersistTaps="handled"
              style={styles.modalList}
              initialNumToRender={20}
              windowSize={10}
              renderItem={({ item }) => {
                const id = item.shop_id ?? item.category_id;
                const selected = selectedId === id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      selected && { backgroundColor: theme.colors.primaryContainer },
                    ]}
                    onPress={() => {
                      onSelect(item);
                      onDismiss();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalItemTitle,
                        { color: theme.colors.onSurface },
                        selected && { fontWeight: "600", color: theme.colors.onPrimaryContainer },
                      ]}
                    >
                      {renderTitle(item)}
                    </Text>
                    {renderSubtitle?.(item) ? (
                      <Text
                        style={[
                          styles.modalItemSub,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {renderSubtitle(item)}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

function getMockCategories() {
  return [
    { category_id: 1, name: "Grocery", parent_category_id: null },
    { category_id: 2, name: "Dairy", parent_category_id: null },
    { category_id: 3, name: "Bakery", parent_category_id: null },
    { category_id: 4, name: "Vegetables", parent_category_id: null },
    { category_id: 5, name: "Grocery", parent_category_id: null },
    { category_id: 6, name: "Dairy", parent_category_id: null },
    { category_id: 7, name: "Bakery", parent_category_id: null },
    { category_id: 8, name: "Vegetables", parent_category_id: null },
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

export default AddEditProductScreen;

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
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
  },
  pickerPlaceholder: {
    color: "#9E9E9E",
  },
  loader: {
    marginVertical: 12,
  },
  uploadBtn: {
    marginTop: 16,
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
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "72%",
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalList: {
    flexGrow: 0,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modalItemTitle: {
    fontSize: 16,
  },
  modalItemSub: {
    fontSize: 12,
    marginTop: 2,
  },
  modalEmpty: {
    padding: 32,
    alignItems: "center",
  },
});
