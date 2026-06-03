import React, { useEffect, useState } from "react";
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
  StatusBar,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import authService from "../../services/authService";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';

interface LoginFormData {
  username: string;
  password: string;
}

// const logo = require('../../assets/images/ardabil-fazelab-logo.png');

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [rememberCredentials, setRememberCredentials] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    loadRememberMe();
  }, [control])

  const onSubmit = async (data: LoginFormData) => {
    debugger
    setLoading(true);

    try {
      const result = await authService.login(data.username, data.password);

      if (result.success) {
        if (rememberCredentials) {
          try {
            await SecureStore.setItem('rememberedUserName', data.username);
            await SecureStore.setItem('rememebredPassword', data.password);
            console.log("username and password saved!")
          } catch (error) {
            console.log("Error ", error)
          }
        }
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      Alert.alert("خطا", "خطایی غیرمنتظره رخ داد");
    } finally {
      setLoading(false);
    }
  };

  const loadRememberMe = async () => {
    try {
      const user = await SecureStore.getItem('rememberedUserName')
      const pass = await SecureStore.getItem('rememebredPassword');
      if (user && pass) {
        reset({
          username: user,
          password: pass,
        });
      }
      console.log('Load Remember Me Successfully!')
    } catch (error) {
      console.log("Loading error ", error)
    }
  }


  const handleCrendentials = () => {
    setRememberCredentials(!rememberCredentials)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {/* <Image
            source={logo}
            style={{
              width: 100, height: 100, marginBottom: 10
            }}
            resizeMode="contain" /> */}
          <Text style={styles.title}>سامانه قرائت آب و فاضلاب</Text>
          <Text style={styles.subtitle}>استان اردبیل</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>نام کاربری</Text>
            <Controller
              control={control}
              rules={{
                required: "نام کاربری الزامی است",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  placeholder="نام کاربری خود را وارد کنید"
                  placeholderTextColor="#999"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  editable={!loading}
                />
              )}
              name="username"
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>رمز عبور</Text>
            <Controller
              control={control}
              rules={{
                required: "رمز عبور الزامی است",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="رمز عبور خود را وارد کنید"
                  placeholderTextColor="#999"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  editable={!loading}
                />
              )}
              name="password"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.rememberContainer}
            onPress={handleCrendentials}
            activeOpacity={0.7}>
            <View
              style={[
                styles.checkbox, styles.checkboxChecked,
              ]}>
              {rememberCredentials && (
                <Ionicons name="checkmark" size={18} color="black" />
              )}
            </View>
            <Text style={styles.rememberText}>ذخیره اطلاعات برای ورود</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}>
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
