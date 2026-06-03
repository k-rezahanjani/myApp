import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import authService from "../../services/auth";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  // ================= LOAD REMEMBER =================
  const loadRemember = useCallback(async () => {
    try {
      const username = await SecureStore.getItemAsync("rememberedUserName");
      const password = await SecureStore.getItemAsync("rememberedPassword");

      if (username && password) {
        setRemember(true);
        reset({ username, password });
      }
    } catch (e) {
      console.log("load remember error", e);
    }
  }, [reset]);

  useEffect(() => {
    loadRemember();
  }, [loadRemember]);

  // ================= LOGIN =================
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const result = await authService.login(data.username, data.password);

      if (result.success) {
        // remember credentials
        if (remember) {
          await SecureStore.setItemAsync("rememberedUserName", data.username);
          await SecureStore.setItemAsync("rememberedPassword", data.password);
        } else {
          await SecureStore.deleteItemAsync("rememberedUserName");
          await SecureStore.deleteItemAsync("rememberedPassword");
        }

        router.replace("/(tabs)/home");
      } else {
        Alert.alert("خطا", result.error || "خطا در ورود");
      }
    } catch (e) {
      Alert.alert("خطا", "خطای غیرمنتظره رخ داد");
    } finally {
      setLoading(false);
    }
  };

  // ================= TOGGLE =================
  const toggleRemember = useCallback(() => {
    setRemember((prev) => !prev);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>سامانه قرائت آب و فاضلاب</Text>
          <Text style={styles.subtitle}>استان اردبیل</Text>
        </View>

        <View style={styles.form}>
          {/* USERNAME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>نام کاربری</Text>

            <Controller
              control={control}
              name="username"
              rules={{ required: "نام کاربری الزامی است" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="نام کاربری"
                  editable={!loading}
                  autoCapitalize="none"
                />
              )}
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>رمز عبور</Text>

            <Controller
              control={control}
              name="password"
              rules={{ required: "رمز عبور الزامی است" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="رمز عبور"
                  secureTextEntry
                  editable={!loading}
                />
              )}
            />
          </View>

          {/* REMEMBER */}
          <TouchableOpacity
            style={styles.rememberContainer}
            onPress={toggleRemember}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
              {remember && <Ionicons name="checkmark" size={16} color="#000" />}
            </View>

            <Text style={styles.rememberText}>ذخیره اطلاعات ورود</Text>
          </TouchableOpacity>

          {/* BUTTON */}
          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>ورود</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "black",
    // marginRight: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkboxChecked: {
    backgroundColor: "white",
  },
  rememberText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "nazanin",
    textAlign: "left",
    flex: 1,
    includeFontPadding: true,
    marginRight: 5
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    direction: "rtl",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: 'nazanin'
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: 'nazanin'
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
    fontFamily: 'nazanin'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    textAlign: "right",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
  },
  loginButton: {
    backgroundColor: "#4a90e2",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: 'nazanin'
  },
});
