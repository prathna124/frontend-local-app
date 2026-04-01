import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  Text,
  Card,
  Chip,
  IconButton,
  FAB,
  useTheme,
  Button,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { useShop } from "../../context/ShopContext";
import { getProductsByShop, deleteProduct } from "../../api/productsApi";

const ProductsScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { shops, activeShop } = useShop();
  const shopIdFromRoute = route.params?.shopId;

  const shopId = shopIdFromRoute ?? activeShop?.id;
  const shop = shops.find((s) => s.id === shopId) || activeShop;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    if (!shopId) {
      setLoading(false);
      setProducts([]);
      return;
    }

    try {
      setError(null);
      const data = await getProductsByShop(shopId);
      setProducts(Array.isArray(data) ? data : data?.products ?? data?.data ?? []);
    } catch (err) {
      setError(err.message || "Failed to load products");
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [shopId]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: shop ? `${shop.name} – Products` : "Products",
      });
      loadProducts();
    }, [shopId, shop?.name, loadProducts])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const confirmDelete = (item) => {
    Alert.alert(
      "Delete Product",
      `Delete "${item.name}"?`,
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(item),
        },
      ]
    );
  };

  const handleDelete = async (item) => {
    const productId = item.product_id ?? item.id;
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => (p.product_id ?? p.id) !== productId));
    } catch (err) {
      setProducts((prev) => prev.filter((p) => (p.product_id ?? p.id) !== productId));
    }
  };

  const formatPrice = (basePrice, discountPrice) => {
    const base = parseFloat(basePrice ?? 0);
    const discount = parseFloat(discountPrice ?? 0);
    if (discount > 0 && discount < base) {
      return `${base} → ₹${discount}`;
    }
    return `₹${base}`;
  };

  const getStatusText = (status) => {
    if (!status) return "Active";
    const s = String(status).toLowerCase();
    return s === "active" ? "Active" : s === "inactive" ? "Inactive" : s;
  };

  const isActive = (item) => {
    const s = String(item.status ?? "active").toLowerCase();
    return s === "active";
  };

  const getCategoryNames = (item) => {
    const cats = item.categories ?? item.category_names ?? item.category;
    if (Array.isArray(cats)) {
      return cats.map((c) => (typeof c === "object" ? c.name : c)).filter(Boolean).join(", ");
    }
    if (typeof cats === "string") return cats;
    return null;
  };

  const renderItem = ({ item }) => {
    const id = item.product_id ?? item.id;
    const categoryLabel = getCategoryNames(item) || "—";
    const priceLabel = formatPrice(item.base_price, item.discount_price);

    return (
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {categoryLabel} • {priceLabel}
            </Text>
            {item.quantity_available != null && (
              <Text style={styles.stock}>Stock: {item.quantity_available}</Text>
            )}
            <Chip
              compact
              style={[
                styles.chip,
                {
                  backgroundColor: isActive(item) ? "#E8F5E9" : "#F3F3F3",
                },
              ]}
              textStyle={{
                color: isActive(item) ? theme.colors.primary : "#777",
              }}
            >
              {getStatusText(item.status)}
            </Chip>
          </View>

          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() =>
                navigation.navigate("AddEditProduct", {
                  shopId,
                  product: item,
                })
              }
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor="#D32F2F"
              onPress={() => confirmDelete(item)}
            />
          </View>
        </View>
      </Card>
    );
  };

  if (!shopId) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>Select a shop</Text>
        <Text style={styles.emptySub}>
          Choose a shop to view and manage products
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Shops")}
          style={styles.selectShopBtn}
        >
          Go to My Shops
        </Button>
      </View>
    );
  }

  if (loading && products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading products…</Text>
      </View>
    );
  }

  return (
    <>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>Showing sample data</Text>
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.product_id ?? item.id)}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No products added yet</Text>
        }
      />

      <FAB
        icon="plus"
        label="Add Product"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() =>
          navigation.navigate("AddEditProduct", { shopId })
        }
      />
    </>
  );
};

function getMockProducts() {
  return [
    {
      product_id: 1,
      name: "Amul Milk 500ml",
      categories: ["Dairy"],
      base_price: 30,
      discount_price: 0,
      quantity_available: 50,
      status: "active",
    },
    {
      product_id: 2,
      name: "Tata Salt 1kg",
      categories: ["Grocery"],
      base_price: 28,
      discount_price: 25,
      quantity_available: 100,
      status: "inactive",
    },
  ];
}

export default ProductsScreen;

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 90,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
  },
  row: {
    flexDirection: "row",
    padding: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    fontSize: 13,
    color: "#666",
    marginVertical: 4,
  },
  stock: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  chip: {
    alignSelf: "flex-start",
    marginTop: 6,
  },
  actions: {
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    borderRadius: 14,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  selectShopBtn: {
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
  errorBanner: {
    backgroundColor: "#FFF3E0",
    padding: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE0B2",
  },
  errorText: {
    fontSize: 13,
    color: "#E65100",
  },
  errorHint: {
    fontSize: 12,
    color: "#BF360C",
    marginTop: 2,
  },
});
