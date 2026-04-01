import React from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import {
  Card,
  Text,
  Chip,
  IconButton,
  FAB,
  useTheme,
  Button,
} from "react-native-paper";
import { useShop } from "../../context/ShopContext";

export default function ShopListScreen({ navigation }) {
  const theme = useTheme();
  const { shops, deleteShop, setActiveShop, setInactiveShop } = useShop();


  const confirmDelete = (shop) => {
    Alert.alert(
      "Delete Shop",
      `Are you sure you want to delete "${shop.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete shop", shop.id),
            /* ================= MOCK ================= */

            deleteShop(shop.id);



            /* ================= API (UNCOMMENT LATER) =================

            await axios.delete(`/shops/${shop.id}`, {

              headers: { Authorization: `Bearer ${token}` },

            });

            deleteShop(shop.id);

            */

          },
        },
      ]
    );
  };

  const renderShop = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopName}>{item.name}</Text>
        </View>

        <IconButton
          icon="pencil-outline"
          size={20}
          onPress={() => navigation.navigate("AddEditShop", { shop: item })}
        />

        <IconButton
          icon="delete-outline"
          size={20}
          iconColor={theme.colors.error}
          onPress={() => confirmDelete(item)}
        />
      </View>

      <Text style={styles.metaText}>{item.categories}</Text>
      <Text style={styles.metaText}>{item.city}</Text>

      <View style={styles.chipRow}>
        <Chip style={[styles.chip, styles[item.status]]} textStyle={styles.chipText}>
          {item.status}
        </Chip>

        {item.verified && (
          <Chip style={[styles.chip, styles.verified]} textStyle={styles.chipText}>
            verified
          </Chip>
        )}

        <Button
          compact
          textColor={theme.colors.primary}
          onPress={() =>
            item.isActiveShop ? setInactiveShop(item.id) : setActiveShop(item.id)
          }
        >
          {item.isActiveShop ? "Set Inactive" : "Set Active"}
        </Button>
      </View>
    </Card>
  );

  return (
    <>
      <FlatList
        data={shops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderShop}
        contentContainerStyle={styles.list}
        ListEmptyComponent={

          <Text style={{ textAlign: "center", marginTop: 40 }}>

            No shops added yet

          </Text>

        }
      />

      <FAB
        icon="plus"
        label="Add Shop"
        style={styles.fab}
        onPress={() => navigation.navigate("AddEditShop")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  shopName: {
    fontSize: 18,
    fontWeight: "600",
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  chip: {
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
  },
  chipText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  active: {
    backgroundColor: "#C8E6C9",
  },
  inactive: {
    backgroundColor: "#EEEEEE",
  },
  verified: {
    backgroundColor: "#BBDEFB",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    borderRadius: 28,
  },
});
