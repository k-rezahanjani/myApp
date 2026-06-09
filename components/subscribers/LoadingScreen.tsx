import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const LoadingScreen = () => {
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4a90e2" />
      <Text style={styles.loadingText}>در حال بارگذاری...</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: { marginTop: 10, fontSize: 14, color: "#666", fontFamily: "nazanin" },
});