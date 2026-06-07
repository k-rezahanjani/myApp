// import {getReadInfosForWork}  from "../../services/authService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
  TextInput,
  Platform,
  Alert,
  Animated,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import { GetWaterPriceWorkReadBasicModel } from "../../services/GetWaterPriceWorkReadBasicModel";
import { Picker } from '@react-native-picker/picker';
import { SaveWaterPriceList } from "../../services/SaveWaterPriceWork";
import SubscriberModal from "../../components/modals/subscriberModal";
import DebitDetailsModal from "../../components/modals/debitDetails";
import DetailsModal from "../../components/modals/details";
import { getReadInfosForWork } from "../../services/db/waterDatabase";
import CameraScreen from "../../components/camera";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function SubscriberScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [readBasicModel, setReadBasicModel] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [readNumber, setReadNumber] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedView, setSelectedView] = useState("");
  const [readDescription, setReadDescription] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isChanging, setIsChanging] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDebitDetailsModalOpen, setIsDebitDetailsModalOpen] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const workId = params.workId;

  const getDefaultReadStateCode = useCallback(() => {
    const states = readBasicModel?.readDeviceSettingState;
    if (!states || states.length === 0) return "";
    const stateReuslt = states?.readStateCode;
    console.log('State Status: ', stateReuslt)
    // return states?.readStateCode;
  }, [readBasicModel]);

  const getDefaultViewCodeForState = useCallback((stateCode: string) => {
    if (!stateCode || !readBasicModel?.readDeviceSettingView) return "";
    const stateId = Number(stateCode);
    const related = readBasicModel.readDeviceSettingView.filter(
      (v: any) => v.tblReadStateTypeId === stateId
    );
    const unique = related.filter(
      (v: any, idx: number, self: any[]) =>
        idx === self.findIndex(x => x.readViewDesc === v.readViewDesc)
    );
    return unique[0]?.readViewCode.toString() || "";
  }, [readBasicModel]);

  const setDefaults = useCallback(() => {
    const defaultStatus = getDefaultReadStateCode();
    if (defaultStatus) {
      setSelectedStatus(defaultStatus);
      const defaultView = getDefaultViewCodeForState(defaultStatus);
      setSelectedView(defaultView);
    } else {
      setSelectedStatus("");
      setSelectedView("");
    }
  }, [getDefaultReadStateCode, getDefaultViewCodeForState]);

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {

      if (!workId) {
        ToastAndroid.showWithGravity(
          "شناسه کاربری یافت نشد",
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
        return;
      }

      // const data = await getReadInfosForWork(Number(workId));
      const data = await getReadInfosForWork(Number(workId))
      const response = await GetWaterPriceWorkReadBasicModel();
      const basicModel = response.readDeviceSetting;

      console.log("Basic Model ", basicModel)
      setSubscribers(data);
      console.log("Sub data ", data)
      setReadBasicModel(basicModel);

      if (data && data.length > 0) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Parse error:", error);
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && readBasicModel && subscribers.length > 0) {
      setDefaults();
    }
  }, [loading, readBasicModel, subscribers, setDefaults]);

  useEffect(() => {
    if (!selectedStatus || !readBasicModel?.readDeviceSettingView) return;
    const stateId = Number(selectedStatus);
    const relatedViews = readBasicModel.readDeviceSettingView.filter(
      (v: any) => v.tblReadStateTypeId === stateId
    );
    const uniqueViews = relatedViews.filter(
      (v: any, idx: number, self: any[]) =>
        idx === self.findIndex(x => x.readViewDesc === v.readViewDesc)
    );
    const currentViewValid = uniqueViews.some(
      (v: any) => v.readViewCode.toString() === selectedView
    );
    if (!currentViewValid && uniqueViews.length > 0) {
      setSelectedView(uniqueViews[0].readViewCode.toString());
    } else if (uniqueViews.length === 0) {
      setSelectedView("");
    }
    console.log("Current ", currentSubscriber?.tblWaterPriceWorkReadInfoId)
  }, [selectedStatus, readBasicModel]);

  const filteredViews = readBasicModel?.readDeviceSettingView?.filter(
    (view: any) => view.tblReadStateTypeId === Number(selectedStatus)
  );
  const uniqueViews = filteredViews?.filter(
    (view: any, index: number, self: any[]) =>
      index === self.findIndex((v: any) => v.readViewDesc === view.readViewDesc)
  ) || [];

  const changeSubscriber = useCallback(
    (newIndex: number, direction: "next" | "prev") => {
      if (newIndex < 0 || newIndex >= subscribers.length || isChanging) return;

      setIsChanging(true);
      Animated.timing(slideAnim, {
        toValue: direction === "next" ? -SCREEN_WIDTH : SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(newIndex);
        setReadNumber("");
        setReadDescription("");
        // مقداردهی مجدد پیش‌فرض برای مشترک جدید
        setDefaults();

        slideAnim.setValue(direction === "next" ? SCREEN_WIDTH : -SCREEN_WIDTH);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setIsChanging(false);
        });
      });
    },
    [subscribers.length, isChanging, slideAnim, setDefaults]
  );

  const goToNext = () => {
    if (currentIndex < subscribers.length - 1 && !isChanging) {
      changeSubscriber(currentIndex + 1, "next");
      ToastAndroid.showWithGravity(
        `${currentIndex + 2} از ${subscribers.length}`,
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    } else if (currentIndex === subscribers.length - 1) {
      ToastAndroid.showWithGravity("آخرین مشترک هستید", ToastAndroid.SHORT, ToastAndroid.TOP);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0 && !isChanging) {
      changeSubscriber(currentIndex - 1, "prev");
      ToastAndroid.showWithGravity(
        `${currentIndex} از ${subscribers.length}`,
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    } else if (currentIndex === 0) {
      ToastAndroid.showWithGravity("اولین مشترک هستید", ToastAndroid.SHORT, ToastAndroid.TOP);
    }
  };

  const swipeRightGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => goToNext())
    .runOnJS(true);
  const swipeLeftGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => goToPrev())
    .runOnJS(true);
  const combinedGestures = Gesture.Race(swipeRightGesture, swipeLeftGesture);

  const handleReadNumber = (value: any) => {
    setReadNumber(value)
    console.log("Read number set to ", value)
  }

  const handleDetailsModal = () => {
    setIsDetailsModalOpen(true)
  }

  const handleDebitDetailsModal = () => {
    setIsDebitDetailsModalOpen(true)
  }

  const getReadStateDesc = (stateCode: string) => {
    const state = readBasicModel?.readDeviceSettingState?.find(
      (s: any) => s.readStateCode.toString() === stateCode
    );
    return state?.readStateDesc || "";
  };

  const getReadViewDesc = (viewCode: string) => {
    const view = readBasicModel?.readDeviceSettingView?.find(
      (v: any) => v.readViewCode.toString() === viewCode
    );
    return view?.readViewDesc || "";
  };

  const handleSubmitReading = async () => {
    if (!readNumber) {
      Alert.alert("خطا", "لطفاً رقم کنتور را وارد کنید");
      return;
    }
    if (!selectedStatus) {
      Alert.alert("خطا", "لطفاً وضعیت قرائت را انتخاب کنید");
      return;
    }
    if (!selectedView) {
      Alert.alert("خطا", "لطفاً مشاهده قرائت را انتخاب کنید");
      return;
    }

    const current = subscribers[currentIndex];
    if (!current) {
      Alert.alert("خطا", "اطلاعات مشترک یافت نشد");
      return;
    }
    debugger
    const payload = {
      ReceivedReadLineBaseInfo: [],
      ReceivedWaterPriceWorkReadInfo: {
        address: current.address || "",
        boreDesc: current.boreDesc || "",
        cellPhone: current.cellPhone || "",
        currentUsageDetailDesc: current.currentUsageDetailDesc || current.usageDetailDesc || "",
        gisLocation: current.gisLocation || [0, 0],
        hasNew: current.hasNew ?? 0,
        identityCode: current.identityCode || "",
        isLost: current.isLost ?? false,
        manualResult: current.manualResult ?? 0,
        manualResultDesc: current.manualResultDesc || "",
        phone: current.phone || "",
        postalCode: current.postalCode || "",
        prevAvgAmount: current.prevAvgAmount ?? 0.0,
        prevReadDate: current.prevReadDate || "",
        prevReadDateShamsi: current.prevReadDateShamsi || "",
        prevReadNumber: current.prevReadNumber ?? 0,
        prevUseAmount: current.prevUseAmount ?? 0.0,
        readDate: new Date().toISOString(),
        readDateShamsi: "",
        readStateDesc: getReadStateDesc(selectedStatus),
        readViewDescs: getReadViewDesc(selectedView),
        sewageDebtAmount: current.sewageDebtAmount ?? 0.0,
        state: "READ",
        status: "NeedRead",
        statusToast: false,
        subscriberCode: current.subscriberCode,
        subscriberName: current.subscriberName || "",
        tblBoreTypeId: current.tblBoreTypeId ?? 1,
        tblReadStateTypeId: Number(selectedStatus),
        tblReadViewTypeId: [selectedView ? Number(selectedView) : 0],
        tblSubscriberId: current.tblSubscriberId,
        tblUsageTypeInfoDetailCurrId: current.tblUsageTypeInfoDetailCurrId || current.tblUsageTypeInfoDetailId,
        tblUsageTypeInfoDetailId: current.tblUsageTypeInfoDetailId,
        tblWaterPriceWorkReadInfoId: currentSubscriber?.tblWaterPriceWorkReadInfoId,
        usageDetailDesc: current.usageDetailDesc || "",
        waterDebtAmount: current.waterDebtAmount ?? 0.0,
        waterMainUnitQty: current.waterMainUnitQty ?? 1,
        waterMeterSerial: current.waterMeterSerial || "",
        waterPriceDebtAmount: current.waterPriceDebtAmount ?? 0.0,
        waterPriceWorkId: workId,
        xLocation: current.xLocation ?? 0,
        yLocation: current.yLocation ?? 0,
        readNumber: Number(readNumber),
        readDescription: readDescription,
      }

    };
    console.log('Payload ', payload)

    if (!payload) {
      Alert.alert("خطا", "خطا در ساخت اطلاعات ارسالی");
      return;
    }

    setSubmitting(true);
    try {
      const result = await SaveWaterPriceList(payload);
      console.log("نتیجه ثبت:", result);
      if (result.exception.code === 800) {
        Alert.alert('موفقیت', result?.exception.message)
      } else {
        Alert.alert('خطا', result?.exception.message)
      }
      setReadNumber("");
      setReadDescription("");
    } catch (error: any) {
      console.error(error);
      Alert.alert("خطا", error.message || "مشکل در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCameraCapture = (imageUri: string) => {
    console.log('عکس گرفته شده:', imageUri);
    setCapturedImage(imageUri);
    // اینجا می‌تونید عکس رو پردازش کنید
    // مثلاً OCR برای خوندن عدد کنتور
  };

  const handleCameraClose = () => {
    setIsCameraActive(false);
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>در حال بارگذاری...</Text>
      </SafeAreaView>
    );
  }

  const currentSubscriber = subscribers[currentIndex];

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={{ marginRight: 'auto' }} onPress={() => setIsModalOpen(true)}>
          <Ionicons name="list-outline" size={25} style={{ color: '#ffff' }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>قرائت کنتور</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={17} color="#fff" />
        </TouchableOpacity>
      </View>

      {
        isModalOpen &&
        <SubscriberModal
          data={currentSubscriber}
          isVisible={isModalOpen}
          close={() => setIsModalOpen(false)} />
      }

      {
        isDetailsModalOpen && <DetailsModal data={currentSubscriber} isVisible={isDetailsModalOpen} close={() => setIsDetailsModalOpen(false)} />
      }

      {/* نتیجه بدهی */}
      {
        isDebitDetailsModalOpen &&
        <DebitDetailsModal
          data={currentSubscriber}
          isVisible={isDebitDetailsModalOpen}
          close={() => setIsDebitDetailsModalOpen(false)} />
      }

      <Animated.View style={[styles.topSection, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
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
                  <Text style={styles.infoValue}>{currentSubscriber?.subscriberCode}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>نام و نام خانوادگی</Text>
                  <Text style={styles.infoValue}>{currentSubscriber?.subscriberName}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>آدرس</Text>
                  <Text style={styles.infoValue}>{currentSubscriber?.address}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>کاربری</Text>
                  <Text style={styles.infoValue}>{currentSubscriber?.usageDetailDesc}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>تلفن همراه</Text>
                  <Text style={styles.infoValue}>{currentSubscriber?.cellPhone}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>تاریخ قرائت قبلی</Text>
                  <Text style={styles.infoValue}>{currentSubscriber?.prevReadDateShamsi}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>عدد قرائت قبلی</Text>
                  <Text style={styles.infoValue}>{currentSubscriber?.prevReadNumber}</Text>
                </View>
              </View>
            </View>

            {/* کارت فرم قرائت */}
            <View style={styles.formCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderIcon}>
                  <Ionicons name="create-outline" size={22} color="#4a90e2" />
                </View>
                <Text style={styles.cardHeaderText}>اطلاعات قرائت جدید</Text>
                <View style={{ marginRight: 'auto', flexDirection: 'row', gap: 15 }}>
                  {/* اشتراک همسایه */}
                  <TouchableOpacity onPress={() => Alert.alert("", "اشتراک همسایه کلیک شد")}>
                    <Ionicons name='home-outline' size={20} />
                  </TouchableOpacity>
                  {/* جزیئات */}
                  <TouchableOpacity onPress={handleDetailsModal}>
                    <Ionicons name="ellipsis-vertical" size={20} />
                  </TouchableOpacity>
                  {/* نقشه */}
                  <TouchableOpacity onPress={() => Alert.alert("نقشه کلیک شد")}>
                    <Ionicons name="map-sharp" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="رقم کنتور"
                  placeholderTextColor="#999"
                  value={readNumber}
                  onChangeText={(value) => handleReadNumber(value)}
                  textAlign="right"
                />
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => setIsCameraActive(true)}>
                  <Ionicons name="camera-outline" size={22} color="#000000ff" />
                </TouchableOpacity>
              </View>

              {/* مودال دوربین */}
              <Modal
                visible={isCameraActive}
                animationType="slide"
                onRequestClose={handleCameraClose}
              >
                <CameraScreen
                  onClose={handleCameraClose}
                  onCapture={handleCameraCapture}
                />
              </Modal>

              <Text style={styles.label}>وضعیت قرائت:</Text>
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                  style={styles.picker}
                  dropdownIconRippleColor="#4a90e2"
                  mode="dialog">
                  {readBasicModel?.readDeviceSettingState?.map((state: any) => (
                    <Picker.Item
                      key={state.tblReadStateTypeId}
                      label={state.readStateDesc}
                      value={state.readStateCode.toString()}
                      style={{ textAlign: 'left' }}
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>مشاهده قرائت:</Text>
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={selectedView}
                  onValueChange={(itemValue) => setSelectedView(itemValue)}
                  style={styles.picker}
                  dropdownIconRippleColor="#4a90e2"
                  mode="dialog"
                  enabled={!!selectedStatus}>
                  {uniqueViews.map((view: any, index: number) => (
                    <Picker.Item
                      key={`${view.tblReadViewTypeId}-${index}`}
                      label={view.readViewDesc}
                      value={view.readViewCode.toString()}
                    />
                  ))}
                </Picker>
              </View>
              {/* Voice */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="توضیحات"
                  placeholderTextColor="#999"
                  value={readDescription}
                  onChangeText={setReadDescription}
                  textAlign="right"
                />
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => { }}>
                  <Ionicons name="mic-outline" size={22} color="#000000ff" />
                </TouchableOpacity>
              </View>
              <View style={styles.circleButtonContainer}>
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={handleSubmitReading}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      {/* <Text style={styles.submitButtonText}>ثبت قرائت</Text> */}
                      <Ionicons name="checkmark" size={34} color="#ffffffff" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      <GestureDetector gesture={combinedGestures}>
        <View style={styles.bottomBar}>
          <View style={styles.subscriberRect}>
            <TouchableOpacity
              onPress={goToPrev}
              style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
              disabled={currentIndex === 0}>
              <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? "#ccc" : "#4a90e2"} />
            </TouchableOpacity>
            <View style={styles.subscriberInfo}>
              <Text style={styles.subscriberCode}>{currentSubscriber?.subscriberCode}</Text>
              <Text style={styles.subscriberName}>{currentSubscriber?.subscriberName}</Text>
              {/* دکمه های عملیاتی */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={styles.operationButton} onPress={handleDebitDetailsModal}>
                  <Text>بدهی</Text>
                  <Ionicons name="cash-outline" size={20} style={{ marginLeft: 5 }} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.operationButton} onPress={() => Alert.alert('', 'بدهی کلیک شد')}>
                  <Text>نتیجه</Text>
                  <Ionicons name="document-text-outline" size={20} style={{ marginLeft: 5 }} />
                </TouchableOpacity>

              </View>
            </View>
            <TouchableOpacity
              onPress={goToNext}
              style={[styles.navButton, currentIndex === subscribers.length - 1 && styles.navButtonDisabled]}
              disabled={currentIndex === subscribers.length - 1}>
              <Ionicons name="chevron-forward" size={24} color={currentIndex === subscribers.length - 1 ? "#ccc" : "#4a90e2"} />
            </TouchableOpacity>
          </View>
          <Text style={styles.counterText}>{currentIndex + 1} / {subscribers.length}</Text>
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f0f0ff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  loadingText: { marginTop: 10, fontSize: 14, color: "#666", fontFamily: "nazanin" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", backgroundColor: "#4a90e2", paddingHorizontal: 15, paddingVertical: 12 },
  backButton: { marginLeft: 10 },
  headerTitle: { fontSize: 14, color: "#fff", fontFamily: "iransans" },
  topSection: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20, gap: 16, direction: "rtl" },
  infoCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  formCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#f0f0f0", paddingBottom: 12 },
  cardHeaderIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#e8f0fe", alignItems: "center", justifyContent: "center" },
  cardHeaderText: { fontSize: 12, fontWeight: "800", color: "#333", fontFamily: "iransans" },
  infoGrid: { gap: 16 },
  infoGridItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { fontSize: 13, color: "#999", fontFamily: "nazanin" },
  infoValue: { fontSize: 13, color: "#333", fontFamily: "nazanin", fontWeight: "500", textAlign: "left" },
  label: { textAlign: 'left', marginBottom: 10, fontSize: 13, color: '#666', fontFamily: 'nazanin' },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, marginBottom: 12, backgroundColor: "#fafafa", direction: 'rtl' },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: Platform.OS === "ios" ? 14 : 12, fontSize: 14, textAlign: "right", fontFamily: "nazanin" },
  cameraButton: { padding: 12, paddingHorizontal: 16, borderLeftWidth: 1, borderLeftColor: "#e5e5e5" },
  textAreaContainer: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, marginBottom: 20, backgroundColor: "#fafafa" },
  textArea: { paddingHorizontal: 16, paddingVertical: Platform.OS === "ios" ? 14 : 12, fontSize: 14, textAlign: "right", fontFamily: "nazanin", minHeight: 30 },
  submitButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#4a90e2", borderRadius: 12, paddingVertical: 14, gap: 8 },
  submitButtonText: { fontSize: 13, color: "#fff", fontWeight: "800", fontFamily: "iransans" },
  bottomBar: { paddingHorizontal: 16, paddingBottom: Platform.OS === "ios" ? 20 : 16, paddingTop: 8, backgroundColor: "transparent" },
  subscriberRect: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#e5e5e5", paddingHorizontal: 8, paddingVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  subscriberInfo: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  subscriberCode: { fontSize: 18, fontWeight: "bold", color: "#333", fontFamily: "iransans", marginBottom: 4, textAlign: "center" },
  subscriberName: { fontSize: 13, color: "#666", fontFamily: "nazanin", textAlign: "center" },
  navButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "center" },
  operationButton: { width: 100, height: 33, flexDirection: 'row', marginTop: 10, borderRadius: 5, backgroundColor: "#d6d6d6ff", alignItems: "center", justifyContent: "center" },
  navButtonDisabled: { opacity: 0.5 },
  counterText: { textAlign: "center", marginTop: 8, fontSize: 11, color: "#999", fontFamily: "nazanin" },
  picker: { flex: 1, height: 55, color: '#333', fontFamily: 'nazanin', fontSize: 14, textAlign: 'left', direction: 'ltr' },
  circleButtonContainer: {
    width: 60,
    height: 60,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: '#1ca4ffff',
    borderRadius: 42,
    padding: 3,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#1ca4ffff',
  },
  capturedImageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  capturedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  capturedImageText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    fontFamily: 'nazanin',
  },
});
