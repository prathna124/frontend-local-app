import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import {
  Text,
  Surface,
  IconButton,
  FAB,
  Switch,
  Divider,
} from "react-native-paper";

/**
 * ACTIVE SHOP (dummy)
 * Later → from context / redux
 */
const ACTIVE_SHOP_ID = 1;

/**
 * Dummy category data
 * DB: product_categories
 */
const INITIAL_CATEGORIES = [
  { id: 1, name: "Dairy", is_active: true },
  { id: 2, name: "Grocery", is_active: true },
  { id: 3, name: "Bakery", is_active: false },
];

/**
 * Category Card (memoized)
 */
const CategoryCard = React.memo(
  ({ item, onToggle, onEdit, onDelete }) => {
    return (
      <Surface style={styles.card}>
        <View style={styles.row}>
          <View style={styles.left}>
            <Text variant="titleMedium">{item.name}</Text>
            <Text style={styles.status}>
              {item.is_active ? "Active" : "Inactive"}
            </Text>
          </View>

          <View style={styles.actions}>
            <Switch
              value={item.is_active}
              onValueChange={() => onToggle(item.id)}
            />
            <IconButton
              icon="pencil-outline"
              size={20}
              onPress={() => onEdit(item)}
            />
            <IconButton
              icon="delete-outline"
              size={20}
              onPress={() => onDelete(item.id)}
            />
          </View>
        </View>
      </Surface>
    );
  }
);

export default function ProductCategoryScreen() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const toggleCategory = useCallback((id) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_active: !c.is_active } : c
      )
    );
  }, []);

  const editCategory = (item) => {
    // navigate to AddEditCategoryScreen
    console.log("Edit", item);
  };

  const deleteCategory = (id) => {
    // confirmation modal later
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const renderItem = ({ item }) => (
    <CategoryCard
      item={item}
      onToggle={toggleCategory}
      onEdit={editCategory}
      onDelete={deleteCategory}
    />
  );

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.header}>
        Product Categories
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={{ paddingBottom: 120 }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={7}
        removeClippedSubviews
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log("Add Category")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
  },
  status: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
});
