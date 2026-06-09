import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SubscriberInfoCardProps {
  subscriber: any;
}

export const SubscriberInfoCard = ({ subscriber }: SubscriberInfoCardProps) => {
  return (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderIcon}>
          <Ionicons name="person-outline" size={22} color="#4a90e2" />
        </View>
        <Text style={styles.cardHeaderText}>اطلاعات مشترک</Text>
      </View>
      <View style={styles.infoGrid}>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>کد اشتراک</Text>
          <Text style={styles.infoValue}>{subscriber?.subscriberCode}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>نام و نام خانوادگی</Text>
          <Text style={styles.infoValue}>{subscriber?.subscriberName}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>آدرس</Text>
          <Text style={styles.infoValue}>{subscriber?.address}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>کاربری</Text>
          <Text style={styles.infoValue}>{subscriber?.usageDetailDesc}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>تلفن همراه</Text>
          <Text style={styles.infoValue}>{subscriber?.cellPhone}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>تاریخ قرائت قبلی</Text>
          <Text style={styles.infoValue}>{subscriber?.prevReadDateShamsi}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>عدد قرائت قبلی</Text>
          <Text style={styles.infoValue}>{subscriber?.prevReadNumber}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 12,
  },
  cardHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e8f0fe",
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderText: { fontSize: 12, fontWeight: "800", color: "#333", fontFamily: "iransans" },
  infoGrid: { gap: 16 },
  infoGridItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { fontSize: 13, color: "#999", fontFamily: "nazanin" },
  infoValue: { fontSize: 13, color: "#333", fontFamily: "nazanin", fontWeight: "500", textAlign: "left" },
});