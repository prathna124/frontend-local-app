import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  Button,
  Chip,
  IconButton,
  useTheme,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { WIDTH as wp, HEIGHT as hp } from "../../utils/responsive";

/* ================= MOCK DATA (API READY) ================= */
const dashboardData = {
  owner: {
    name: "Rakesh Patel",
    verification_status: "pending", // pending | verified | rejected
  },
  shops: [
    {
      shop_id: 1,
      shop_name: "Rakesh Kirana Store",
      status: "active",
    },
    {
      shop_id: 2,
      shop_name: "Rakesh Dairy",
      status: "inactive",
    },
  ],
};

export default function DashboardScreen({ navigation }) {
  const theme = useTheme();

  const statusColor = (status) => {
    switch (status) {
      case "verified":
        return "#2e7d32";
      case "rejected":
        return "#d32f2f";
      default:
        return "#f9a825";
    }
  };

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <IconButton icon="bell-outline" iconColor="#fff" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ================= OWNER INFO ================= */}
        <Card style={styles.ownerCard}>
          <Card.Content>
            <Text style={styles.ownerName}>
              👋 Hi, {dashboardData.owner.name}
            </Text>

            <Chip
              style={[
                styles.statusChip,
                { backgroundColor: statusColor(dashboardData.owner.verification_status) },
              ]}
              textStyle={{ color: "#fff" }}
            >
              {dashboardData.owner.verification_status.toUpperCase()}
            </Chip>

            <Button
              mode="outlined"
              style={styles.editProfileBtn}
              onPress={() => navigation.navigate("Profile")}
            >
              Edit Business Profile
            </Button>
          </Card.Content>
        </Card>

        {/* ================= SHOPS ================= */}
        <SectionHeader title="Your Shops" />

        {dashboardData.shops.length > 0 ? (
          dashboardData.shops.map((shop) => (
            <Card key={shop.shop_id} style={styles.shopCard}>
              <Card.Content style={styles.shopRow}>
                <View>
                  <Text style={styles.shopName}>{shop.shop_name}</Text>
                  <Text style={styles.shopStatus}>
                    Status: {shop.status}
                  </Text>
                </View>

                <Button
                  compact
                  mode="contained"
                  onPress={() =>
                    navigation.navigate("Products", { shopId: shop.shop_id })
                  }
                >
                  Open
                </Button>
              </Card.Content>
            </Card>
          ))
        ) : (
          <EmptyState
            text="No shop created"
            subText="Create your first shop to start selling"
          />
        )}

        <Button
          icon="store-plus-outline"
          mode="contained"
          style={styles.createShopBtn}
          onPress={() => navigation.navigate("CreateShop")}
        >
          Create New Shop
        </Button>

        {/* ================= QUICK ACTIONS ================= */}
        <SectionHeader title="Quick Actions" />

        <View style={styles.actionRow}>
          <ActionCard
            icon="cube-outline"
            label="Products"
            onPress={() => navigation.navigate("Products")}
          />
          <ActionCard
            icon="shape-outline"
            label="Categories"
            onPress={() => navigation.navigate("Categories")}
          />
        </View>

        <View style={styles.actionRow}>
          <ActionCard
            icon="clipboard-list-outline"
            label="Orders"
            onPress={() => navigation.navigate("Orders")}
          />
          <ActionCard
            icon="account-circle-outline"
            label="Profile"
            onPress={() => navigation.navigate("Profile")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const ActionCard = ({ icon, label, onPress }) => (
  <Card style={styles.actionCard} onPress={onPress}>
    <Card.Content style={styles.actionContent}>
      <MaterialCommunityIcons name={icon} size={28} />
      <Text style={styles.actionText}>{label}</Text>
    </Card.Content>
  </Card>
);

const EmptyState = ({ text, subText }) => (
  <Card style={styles.emptyCard}>
    <Text style={styles.emptyText}>{text}</Text>
    <Text style={styles.emptySubText}>{subText}</Text>
  </Card>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fa",
  },

  header: {
    height: hp(8),
    justifyContent: "center",
    paddingHorizontal: wp(4),
  },

  headerTitle: {
    color: "#fff",
    fontSize: wp(5),
    fontWeight: "600",
  },

  content: {
    padding: wp(4),
    paddingBottom: hp(10),
  },

  ownerCard: {
    borderRadius: wp(3),
    marginBottom: hp(2),
  },

  ownerName: {
    fontSize: wp(4.6),
    fontWeight: "600",
    marginBottom: hp(1),
  },

  statusChip: {
    alignSelf: "flex-start",
    marginBottom: hp(1),
  },

  editProfileBtn: {
    alignSelf: "flex-start",
  },

  sectionTitle: {
    fontSize: wp(4.4),
    fontWeight: "600",
    marginVertical: hp(2),
  },

  shopCard: {
    borderRadius: wp(3),
    marginBottom: hp(1.2),
  },

  shopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  shopName: {
    fontSize: wp(4),
    fontWeight: "500",
  },

  shopStatus: {
    fontSize: wp(3.4),
    color: "#666",
  },

  createShopBtn: {
    marginTop: hp(1.5),
    marginBottom: hp(3),
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },

  actionCard: {
    width: "48%",
    borderRadius: wp(3),
  },

  actionContent: {
    alignItems: "center",
    paddingVertical: hp(2),
  },

  actionText: {
    marginTop: hp(1),
    fontSize: wp(3.8),
    fontWeight: "500",
  },

  emptyCard: {
    padding: hp(2),
    alignItems: "center",
    borderRadius: wp(3),
    marginBottom: hp(2),
  },

  emptyText: {
    fontSize: wp(4),
    fontWeight: "600",
  },

  emptySubText: {
    fontSize: wp(3.4),
    color: "#777",
    marginTop: hp(0.5),
  },
});
