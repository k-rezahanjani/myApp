import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomNavigationBarProps {
  currentIndex: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
  subscriber: any;
  onDebitDetails: () => void;
  onResult: () => void;
}

export const BottomNavigationBar = ({
  currentIndex,
  totalCount,
  onPrev,
  onNext,
  subscriber,
  onDebitDetails,
  onResult,
}: BottomNavigationBarProps) => {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.subscriberRect}>
        <TouchableOpacity
          onPress={onPrev}
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          disabled={currentIndex === 0}>
          <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? "#ccc" : "#4a90e2"} />
        </TouchableOpacity>
        <View style={styles.subscriberInfo}>
          <Text style={styles.subscriberCode}>{subscriber?.subscriberCode}</Text>
          <Text style={styles.subscriberName}>{subscriber?.subscriberName}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.operationButton} onPress={onDebitDetails}>
              <Text>بدهی</Text>
              <Ionicons name="cash-outline" size={20} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.operationButton} onPress={onResult}>
              <Text>نتیجه</Text>
              <Ionicons name="document-text-outline" size={20} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={onNext}
          style={[styles.navButton, currentIndex === totalCount - 1 && styles.navButtonDisabled]}
          disabled={currentIndex === totalCount - 1}>
          <Ionicons name="chevron-forward" size={24} color={currentIndex === totalCount - 1 ? "#ccc" : "#4a90e2"} />
        </TouchableOpacity>
      </View>
      <Text style={styles.counterText}>{currentIndex + 1} / {totalCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    paddingTop: 8,
    backgroundColor: "transparent",
  },
  subscriberRect: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 8,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subscriberInfo: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  subscriberCode: { fontSize: 18, fontWeight: "bold", color: "#333", fontFamily: "iransans", marginBottom: 4, textAlign: "center" },
  subscriberName: { fontSize: 13, color: "#666", fontFamily: "nazanin", textAlign: "center" },
  navButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "center" },
  operationButton: { width: 100, height: 33, flexDirection: 'row', marginTop: 10, borderRadius: 5, backgroundColor: "#d6d6d6ff", alignItems: "center", justifyContent: "center" },
  navButtonDisabled: { opacity: 0.5 },
  counterText: { textAlign: "center", marginTop: 8, fontSize: 11, color: "#999", fontFamily: "nazanin" },
});