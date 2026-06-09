import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderBarProps {
  onMenuPress: () => void;
  onBackPress: () => void;
}

export const HeaderBar = ({ onMenuPress, onBackPress }: HeaderBarProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={{ marginRight: 'auto' }} onPress={onMenuPress}>
        <Ionicons name="list-outline" size={25} style={{ color: '#ffff' }} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>قرائت کنتور</Text>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="arrow-forward" size={17} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#4a90e2",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  backButton: { marginLeft: 10 },
  headerTitle: { fontSize: 14, color: "#fff", fontFamily: "iransans" },
});