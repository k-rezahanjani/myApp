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
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import authService from "../../services/authService";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface LoginFormData {
  username: string;
  password: string;
}

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
    setLoading(true);

    try {
      const result = await authService.login(data.username, data.password);

      if (result.success) {
        if (rememberCredentials) {
          try {
            await SecureStore.setItem('rememberedUserName', data.username);
            await SecureStore.setItem('rememebredPassword', data.password);
          } catch (error) {
            Alert.alert('خطا', error)
          }
        }
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      Alert.alert('Error Login (loginscreen) ', error)
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
    } catch (error) {
      Alert.alert("Loading error ", error)
    }
  }

  const handleCrendentials = () => {
    setRememberCredentials(!rememberCredentials)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* تصویر پس‌زمینه با گرادیان و المان‌های آب */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1548839147-2a749c1de9cf?w=1080' }}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.3 }}
      >
        <LinearGradient
          colors={['rgba(0, 100, 148, 0.95)', 'rgba(0, 150, 200, 0.9)', 'rgba(0, 200, 210, 0.85)']}
          style={styles.gradient}
        >
          {/* المان‌های تزئینی قطره آب */}
          <View style={styles.waterDropsContainer}>
            <View style={[styles.waterDrop, styles.drop1]} />
            <View style={[styles.waterDrop, styles.drop2]} />
            <View style={[styles.waterDrop, styles.drop3]} />
            <View style={[styles.waterDrop, styles.drop4]} />
            <View style={[styles.waterDrop, styles.drop5]} />
            <View style={[styles.waterDrop, styles.drop6]} />
            <View style={[styles.waterDrop, styles.drop7]} />
            <View style={[styles.waterDrop, styles.drop8]} />
            <View style={[styles.waterDrop, styles.drop9]} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>

            {/* کارت اصلی با افکت شیشه‌ای */}
            <BlurView intensity={30} tint="light" style={styles.card}>
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <View>
                    <Image
                      source={require('../../assets/icon_ab.png')}
                      style={styles.logoImage}
                      resizeMode="contain" />
                  </View>
                </View>
                <Text style={styles.title}>سامانه قرائت</Text>
                <Text style={styles.subtitle}>آب و فاضلاب استان اردبیل</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="person-outline" size={20} color="#4a90e2" />
                  </View>
                  <Controller
                    control={control}
                    rules={{
                      required: "نام کاربری الزامی است",
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, errors.username && styles.inputError]}
                        placeholder="نام کاربری"
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
                  <View style={styles.inputIcon}>
                    <Ionicons name="lock-closed-outline" size={20} color="#4a90e2" />
                  </View>
                  <Controller
                    control={control}
                    rules={{
                      required: "رمز عبور الزامی است",
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, errors.password && styles.inputError]}
                        placeholder="رمز عبور"
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
                  <View style={[
                    styles.checkbox,
                    rememberCredentials && styles.checkboxChecked
                  ]}>
                    {rememberCredentials && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.rememberText}>ذخیره اطلاعات ورود</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>ورود به سامانه</Text>
                      <Ionicons name="arrow-back" size={20} color="#fff" />
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.footerText}>
                  <Text style={styles.versionText}>نسخه 1.1.0</Text>
                  <Text style={styles.copyrightText}>© ۱۴۰۴ شرکت آتی رویکر افکار </Text>
                </View>
              </View>
            </BlurView>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: "rtl",
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
  },
  waterDropsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  waterDrop: {
    position: 'absolute',
    width: 40,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    transform: [{ rotate: '5deg' }],
  },
  drop1: { top: '10%', left: '5%', width: 30, height: 45, opacity: 0.3 },
  drop2: { top: '20%', right: '8%', width: 25, height: 38, opacity: 0.2 },
  drop3: { top: '40%', left: '3%', width: 35, height: 52, opacity: 0.25 },
  drop4: { bottom: '25%', right: '12%', width: 28, height: 42, opacity: 0.3 },
  drop5: { bottom: '10%', left: '10%', width: 20, height: 30, opacity: 0.2 },
  drop6: { top: '15%', left: '20%', width: 22, height: 33, opacity: 0.15 },
  drop7: { bottom: '35%', left: '15%', width: 32, height: 48, opacity: 0.2 },
  drop8: { top: '55%', right: '5%', width: 26, height: 40, opacity: 0.25 },
  drop9: { bottom: '15%', left: '25%', width: 18, height: 27, opacity: 0.15 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  // logoCircle: {
  //   width: 90,
  //   height: 90,
  //   borderRadius: 45,
  //   backgroundColor: '#4a90e2',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   shadowColor: "#4a90e2",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.4,
  //   shadowRadius: 10,
  //   elevation: 8,
  // },
  waveIcon: {
    position: 'absolute',
    bottom: -5,
    right: -10,
    backgroundColor: '#2ecc71',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 5,
    fontFamily: 'iransans',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    fontFamily: 'nazanin',
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 15,
    padding: 14,
    paddingRight: 45,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlign: "right",
    fontFamily: 'nazanin',
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
    fontFamily: 'nazanin',
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginLeft: 10,
  },
  checkboxChecked: {
    backgroundColor: "#4a90e2",
  },
  rememberText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "nazanin",
    flex: 1,
  },
  loginButton: {
    backgroundColor: "#4a90e2",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: 'nazanin',
  },
  footerText: {
    marginTop: 30,
    alignItems: 'center',
    gap: 5,
  },
  versionText: {
    fontSize: 11,
    color: "#95a5a6",
    fontFamily: 'nazanin',
  },
  copyrightText: {
    fontSize: 11,
    color: "#95a5a6",
    fontFamily: 'nazanin',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
});