import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  ScrollView,
  View,
  Animated,
  Alert,
  ToastAndroid,
  Dimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import { getReadInfosForWork } from "../../services/db/waterDatabase";
import { GetWaterPriceWorkReadBasicModel } from "../../services/GetWaterPriceWorkReadBasicModel";
import { SaveWaterPriceList } from "../../services/SaveWaterPriceWork";
import { LoadingScreen } from "../../components/subscribers/LoadingScreen";
import { HeaderBar } from "../../components/subscribers/HeaderBar";
import { ModalsContainer } from "../../components/subscribers/ModalsContainer";
import { SubscriberInfoCard } from "../../components/subscribers/SubscriberInfoCard";
import { ReadingFormCard } from "../../components/subscribers/ReadingFormCard";
import { BottomNavigationBar } from "../../components/subscribers/BottomNavigationBar";


const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function SubscriberScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const workId = params.workId;

  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [readBasicModel, setReadBasicModel] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [readNumber, setReadNumber] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedView, setSelectedView] = useState("");
  const [readDescription, setReadDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalStates, setModalStates] = useState({
    isModalOpen: false,
    isDetailsModalOpen: false,
    isDebitDetailsModalOpen: false,
    isCameraActive: false,
    mapVisible: false,
  });

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isChanging, setIsChanging] = useState(false);

  const getReadStateDesc = useCallback((stateCode: string) => {
    const state = readBasicModel?.readDeviceSettingState?.find(
      (s: any) => s.readStateCode.toString() === stateCode
    );
    return state?.readStateDesc || "";
  }, [readBasicModel]);

  const getReadViewDesc = useCallback((viewCode: string) => {
    const view = readBasicModel?.readDeviceSettingView?.find(
      (v: any) => v.readViewCode.toString() === viewCode
    );
    return view?.readViewDesc || "";
  }, [readBasicModel]);

  const getDefaultReadStateCode = useCallback(() => {
    const states = readBasicModel?.readDeviceSettingState;
    if (!states || states.length === 0) return "";
    return states[0]?.readStateCode?.toString() || "";
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
    return unique[0]?.readViewCode?.toString() || "";
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

      const data = await getReadInfosForWork(Number(workId));
      const response = await GetWaterPriceWorkReadBasicModel();
      const basicModel = response.readDeviceSetting;

      setSubscribers(data);
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
    loadData();
  }, []);

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
  }, [selectedStatus, readBasicModel, selectedView]);

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
    } else if (currentIndex === subscribers.length - 1) {
      ToastAndroid.showWithGravity("آخرین مشترک هستید", ToastAndroid.SHORT, ToastAndroid.TOP);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0 && !isChanging) {
      changeSubscriber(currentIndex - 1, "prev");
    } else if (currentIndex === 0) {
      ToastAndroid.showWithGravity("اولین مشترک هستید", ToastAndroid.SHORT, ToastAndroid.TOP);
    }
  };

  const swipeRightGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => goToNext())
    .runOnJS(true);
  const swipeLeftGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => goToPrev())
    .runOnJS(true);
  const combinedGestures = Gesture.Race(swipeRightGesture, swipeLeftGesture);

  // Submit reading
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
        tblWaterPriceWorkReadInfoId: current.tblWaterPriceWorkReadInfoId,
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
      },
    };

    setSubmitting(true);
    try {
      const result = await SaveWaterPriceList(payload);
      if (result.exception.code === 800) {
        Alert.alert('موفقیت', result?.exception.message);
      } else {
        Alert.alert('خطا', result?.exception.message);
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

  const filteredViews = readBasicModel?.readDeviceSettingView?.filter(
    (view: any) => view.tblReadStateTypeId === Number(selectedStatus)
  );
  const uniqueViews = filteredViews?.filter(
    (view: any, index: number, self: any[]) =>
      index === self.findIndex((v: any) => v.readViewDesc === view.readViewDesc)
  ) || [];

  if (loading) {
    return <LoadingScreen />;
  }

  const currentSubscriber = subscribers[currentIndex];

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <HeaderBar
        onMenuPress={() => setModalStates(prev => ({ ...prev, isModalOpen: true }))}
        onBackPress={() => router.back()}
      />

      <ModalsContainer
        modalStates={modalStates}
        setModalStates={setModalStates}
        subscriber={currentSubscriber}
      />

      <Animated.View style={[styles.topSection, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <SubscriberInfoCard subscriber={currentSubscriber} />

            <ReadingFormCard
              readNumber={readNumber}
              setReadNumber={setReadNumber}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedView={selectedView}
              setSelectedView={setSelectedView}
              readDescription={readDescription}
              setReadDescription={setReadDescription}
              uniqueViews={uniqueViews}
              readBasicModel={readBasicModel}
              onSubmit={handleSubmitReading}
              submitting={submitting}
              onDetailsPress={() => setModalStates(prev => ({ ...prev, isDetailsModalOpen: true }))}
              currentSubscriber={currentSubscriber}
            />
          </View>
        </ScrollView>
      </Animated.View>

      <GestureDetector gesture={combinedGestures}>
        <View collapsable={false}>
          <BottomNavigationBar
            currentIndex={currentIndex}
            totalCount={subscribers.length}
            onPrev={goToPrev}
            onNext={goToNext}
            subscriber={currentSubscriber}
            onDebitDetails={() => setModalStates(prev => ({ ...prev, isDebitDetailsModalOpen: true }))}
            onResult={() => Alert.alert('', 'نتیجه کلیک شد')}
          />
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f0f0ff" },
  topSection: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
    direction: 'rtl'
  },
});