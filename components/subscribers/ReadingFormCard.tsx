import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import CameraScreen from "../modals/camera";
import MapScreen from "../modals/map";

interface ReadingFormCardProps {
  readNumber: string;
  setReadNumber: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedView: string;
  setSelectedView: (value: string) => void;
  readDescription: string;
  setReadDescription: (value: string) => void;
  uniqueViews: any[];
  readBasicModel: any;
  onSubmit: () => void;
  submitting: boolean;
  onDetailsPress: () => void;
  currentSubscriber?: any;
}

export const ReadingFormCard = ({
  readNumber,
  setReadNumber,
  selectedStatus,
  setSelectedStatus,
  selectedView,
  setSelectedView,
  readDescription,
  setReadDescription,
  uniqueViews,
  readBasicModel,
  onSubmit,
  submitting,
  onDetailsPress,
  currentSubscriber,
}: ReadingFormCardProps) => {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const savedReadInfo = currentSubscriber?.waterPriceWorkReadInfo;
  
  // تابع برای پیدا کردن کد وضعیت بر اساس توضیحات ذخیره شده
  const findStateCodeByDesc = (stateDesc: string) => {
    const state = readBasicModel?.readDeviceSettingState?.find(
      (s: any) => s.readStateDesc === stateDesc
    );
    return state?.readStateCode?.toString() || "";
  };

  // تابع برای پیدا کردن کد مشاهده بر اساس توضیحات ذخیره شده
  const findViewCodeByDesc = (viewDesc: string) => {
    const view = readBasicModel?.readDeviceSettingView?.find(
      (v: any) => v.readViewDesc === viewDesc
    );
    return view?.readViewCode?.toString() || "";
  };

  // تنظیم مقادیر پیش‌فرض از داده‌های ذخیره شده قبلی در waterPriceWorkReadInfo
  useEffect(() => {
    if (savedReadInfo && readBasicModel) {
      
      // اگر readStateDesc ذخیره شده وجود دارد
      if (savedReadInfo.readStateDesc && !selectedStatus) {
        const savedStateCode = findStateCodeByDesc(savedReadInfo.readStateDesc);
        if (savedStateCode) {
          console.log('تنظیم وضعیت پیش‌فرض:', savedReadInfo.readStateDesc, 'کد:', savedStateCode);
          setSelectedStatus(savedStateCode);
        }
      }
      
      // اگر readViewDescs ذخیره شده وجود دارد
      if (savedReadInfo.readViewDescs && !selectedView) {
        const savedViewCode = findViewCodeByDesc(savedReadInfo.readViewDescs);
        if (savedViewCode) {
          console.log('تنظیم مشاهده پیش‌فرض:', savedReadInfo.readViewDescs, 'کد:', savedViewCode);
          setSelectedView(savedViewCode);
        }
      }
      
      // اگر readNumber ذخیره شده وجود دارد
      if (savedReadInfo.readNumber && !readNumber) {
        console.log('تنظیم رقم کنتور پیش‌فرض:', savedReadInfo.readNumber);
        setReadNumber(savedReadInfo.readNumber.toString());
      }
      
      // اگر readDescription ذخیره شده وجود دارد
      if (savedReadInfo.readDescription && !readDescription) {
        console.log('تنظیم توضیحات پیش‌فرض:', savedReadInfo.readDescription);
        setReadDescription(savedReadInfo.readDescription);
      }
    } else {
    }
  }, [savedReadInfo, readBasicModel]);

  const handleCameraCapture = (uri: string) => {
    setCapturedPhoto(uri);
    Alert.alert('موفق', 'عکس با موفقیت گرفته شد');
  };

  const handleOpenMap = () => {
    if (!currentSubscriber) {
      Alert.alert('خطا', 'اطلاعات موقعیت مکانی یافت نشد');
      return;
    }
    setMapVisible(true);
  };

  return (
    <View style={styles.formCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderIcon}>
          <Ionicons name="create-outline" size={22} color="#4a90e2" />
        </View>
        <Text style={styles.cardHeaderText}>اطلاعات قرائت جدید</Text>
        <View style={{ marginRight: 'auto', flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity onPress={() => console.log("اشتراک همسایه")}>
            <Ionicons name='home-outline' size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDetailsPress}>
            <Ionicons name="ellipsis-vertical" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenMap}>
            <Ionicons name="map-sharp" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {savedReadInfo && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>قرائت قبلی:</Text>
          <Text style={styles.debugTextSmall}>وضعیت: {savedReadInfo.readStateDesc}</Text>
          <Text style={styles.debugTextSmall}>مشاهده: {savedReadInfo.readViewDescs}</Text>
          <Text style={styles.debugTextSmall}>رقم: {savedReadInfo.readNumber}</Text>
        </View>
      )}

      {/* فیلد شماره کنتور با دکمه دوربین */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="رقم کنتور"
          placeholderTextColor="#999"
          value={readNumber}
          onChangeText={setReadNumber}
          textAlign="right"
        />
        <TouchableOpacity 
          style={styles.cameraButton} 
          onPress={() => setCameraVisible(true)}>
          <Ionicons name="camera-outline" size={22} color="#000000ff" />
        </TouchableOpacity>
      </View>

      {/* نمایش عکس گرفته شده */}
      {capturedPhoto && (
        <View style={styles.photoPreview}>
          <Image source={{ uri: capturedPhoto }} style={styles.photoPreviewImage} />
          <TouchableOpacity 
            style={styles.removePhotoButton} 
            onPress={() => setCapturedPhoto(null)}>
            <Ionicons name="close-circle" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.label}>وضعیت قرائت:</Text>
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={selectedStatus}
          onValueChange={setSelectedStatus}
          style={styles.picker}
          dropdownIconRippleColor="#4a90e2"
          mode="dialog">
          <Picker.Item label="انتخاب کنید" value="" />
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
          onValueChange={setSelectedView}
          style={styles.picker}
          dropdownIconRippleColor="#4a90e2"
          mode="dialog"
          enabled={!!selectedStatus}>
          <Picker.Item label="انتخاب کنید" value="" />
          {uniqueViews.map((view: any, index: number) => (
            <Picker.Item
              key={`${view.tblReadViewTypeId}-${index}`}
              label={view.readViewDesc}
              value={view.readViewCode.toString()}
            />
          ))}
        </Picker>
      </View>

      {/* فیلد توضیحات با دکمه میکروفون */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="توضیحات"
          placeholderTextColor="#999"
          value={readDescription}
          onChangeText={setReadDescription}
          textAlign="right"
        />
        <TouchableOpacity style={styles.cameraButton} onPress={() => {}}>
          <Ionicons name="mic-outline" size={22} color="#000000ff" />
        </TouchableOpacity>
      </View>

      {/* دکمه ثبت */}
      <View style={styles.circleButtonContainer}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={onSubmit}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="checkmark" size={34} color="#ffffffff" />
          )}
        </TouchableOpacity>
      </View>

      {/* مودال دوربین */}
      <CameraScreen 
        visible={cameraVisible}
        onClose={() => setCameraVisible(false)}
        onCapture={handleCameraCapture}
      />

      {/* مودال نقشه */}
      {currentSubscriber && (
        <MapScreen 
          data={currentSubscriber}
          isVisible={mapVisible}
          close={() => setMapVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formCard: {
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
  cardHeaderText: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: "#333", 
    fontFamily: "iransans" 
  },
  label: { 
    textAlign: 'left', 
    marginBottom: 10, 
    fontSize: 17, 
    color: '#666', 
    fontFamily: 'nazanin' 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
    direction: "rtl" as const,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 18,
    textAlign: "right",
    fontFamily: "nazanin",
  },
  cameraButton: { 
    padding: 12, 
    paddingHorizontal: 16, 
    borderLeftWidth: 1, 
    borderLeftColor: "#e5e5e5" 
  },
  picker: { 
    flex: 1, 
    height: 55, 
    color: '#333', 
    fontFamily: 'nazanin', 
    fontSize: 19, 
    textAlign: 'left', 
    direction: 'ltr' 
  },
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
    marginTop: 20,
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#1ca4ffff',
  },
  photoPreview: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoPreviewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 2,
  },
  debugContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  debugText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'nazanin',
    marginBottom: 5,
  },
  debugTextSmall: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'nazanin',
  },
});