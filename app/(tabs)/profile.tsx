// app/(tabs)/profile.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollViewBase,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import authService from "../../services/authService";
import { Ionicons } from "@expo/vector-icons";

interface UserData {
  userName: string;
  fullName: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const data = await authService.getUserData();
    setUserData(data);
    setLoading(false);
  };

  const handleLogout = () => {
    Alert.alert("خروج از حساب", "آیا مطمئن هستید؟", [
      { text: "لغو", style: "cancel" },
      {
        text: "خروج",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          await authService.logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userData?.fullName?.charAt(0                               ) || "U"}
            </Text>
          </View>
          <Text style={styles.fullName}>{userData?.fullName}</Text>
          <Text style={styles.userName}>@{userData?.userName}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View>
            <TouchableOpacity style={styles.infoRow}>
              <Ionicons name="save-outline" size={14} />
              <Text style={styles.infoLabel}>ذخیره اطلاعات قرائت</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoRow}>
              <Ionicons name="print-outline" size={14} />
              <Text style={styles.infoLabel}>پرینت اطلاعات قرائت</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoRow}>
              <Ionicons name="paper-plane-outline" size={14} />
              <Text style={styles.infoLabel}>ارسال اطلاعات قرائت</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoRow}>
              <Ionicons name="reload-outline" size={14} />
              <Text style={styles.infoLabel}>بروز رسانی</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>خروج</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#4a90e2",
    padding: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 30,
    // fontWeight: "bold",
    color: "#4a90e2",
    fontFamily: 'iransans'
  },
  fullName: {
    fontSize: 18,
    fontWeight: "400",
    color: "#fff",
    marginBottom: 5,
    fontFamily: 'iransans'
  },
  userName: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    fontFamily: 'iransans'
  },
  infoContainer: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    direction: "rtl",
  },
  infoCol: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 12,
    marginRight: 10,
    color: "#666",
    fontFamily: 'iransans'
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    fontFamily: 'nazanin'
  },
  activeStatus: {
    color: "#4caf50",
  },
  tokenInfo: {
    backgroundColor: "#e8f4fd",
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a90e2",
    marginBottom: 5,
  },
  tokenText: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    fontFamily: 'nazanin'
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'nazanin'
  },
});
