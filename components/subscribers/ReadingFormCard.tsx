// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Platform,
//   Image,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import CameraScreen from "../modals/camera";
// import MapScreen from "../modals/map";

// interface ReadingFormCardProps {
//   readNumber: string;
//   setReadNumber: (value: string) => void;
//   selectedStatus: string;
//   setSelectedStatus: (value: string) => void;
//   selectedView: string;
//   setSelectedView: (value: string) => void;
//   readDescription: string;
//   setReadDescription: (value: string) => void;
//   uniqueViews: any[];
//   readBasicModel: any;
//   onSubmit: () => void;
//   submitting: boolean;
//   onDetailsPress: () => void;
//   currentSubscriber?: any;
// }

// export const ReadingFormCard = ({
//   readNumber,
//   setReadNumber,
//   selectedStatus,
//   setSelectedStatus,
//   selectedView,
//   setSelectedView,
//   readDescription,
//   setReadDescription,
//   uniqueViews,
//   readBasicModel,
//   onSubmit,
//   submitting,
//   onDetailsPress,
//   currentSubscriber,
// }: ReadingFormCardProps) => {
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [mapVisible, setMapVisible] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

//   const savedReadInfo = currentSubscriber?.waterPriceWorkReadInfo;
  
//   const findStateCodeByDesc = (stateDesc: string) => {
//     const state = readBasicModel?.readDeviceSettingState?.find(
//       (s: any) => s.readStateDesc === stateDesc
//     );
//     return state?.readStateCode?.toString() || "";
//   };

//   const findViewCodeByDesc = (viewDesc: string) => {
//     const view = readBasicModel?.readDeviceSettingView?.find(
//       (v: any) => v.readViewDesc === viewDesc
//     );
//     return view?.readViewCode?.toString() || "";
//   };

//   useEffect(() => {
//     if (savedReadInfo && readBasicModel) {
      
//       if (savedReadInfo.readStateDesc && !selectedStatus) {
//         const savedStateCode = findStateCodeByDesc(savedReadInfo.readStateDesc);
//         if (savedStateCode) {
//           console.log('تنظیم وضعیت پیش‌فرض:', savedReadInfo.readStateDesc, 'کد:', savedStateCode);
//           setSelectedStatus(savedStateCode);
//         }
//       }
      
//       if (savedReadInfo.readViewDescs && !selectedView) {
//         const savedViewCode = findViewCodeByDesc(savedReadInfo.readViewDescs);
//         if (savedViewCode) {
//           console.log('تنظیم مشاهده پیش‌فرض:', savedReadInfo.readViewDescs, 'کد:', savedViewCode);
//           setSelectedView(savedViewCode);
//         }
//       }
      
//       if (savedReadInfo.readNumber && !readNumber) {
//         console.log('تنظیم رقم کنتور پیش‌فرض:', savedReadInfo.readNumber);
//         setReadNumber(savedReadInfo.readNumber.toString());
//       }
      
//       if (savedReadInfo.readDescription && !readDescription) {
//         console.log('تنظیم توضیحات پیش‌فرض:', savedReadInfo.readDescription);
//         setReadDescription(savedReadInfo.readDescription);
//       }
//     } else {
//     }
//   }, [savedReadInfo, readBasicModel]);

//   const handleCameraCapture = (uri: string) => {
//     setCapturedPhoto(uri);
//     Alert.alert('موفق', 'عکس با موفقیت گرفته شد');
//   };

//   const handleOpenMap = () => {
//     if (!currentSubscriber) {
//       Alert.alert('خطا', 'اطلاعات موقعیت مکانی یافت نشد');
//       return;
//     }
//     setMapVisible(true);
//   };

//   return (
//     <View style={styles.formCard}>
//       <View style={styles.cardHeader}>
//         <View style={styles.cardHeaderIcon}>
//           <Ionicons name="create-outline" size={22} color="#4a90e2" />
//         </View>
//         <Text style={styles.cardHeaderText}>اطلاعات قرائت جدید</Text>
//         <View style={{ marginRight: 'auto', flexDirection: 'row', gap: 15 }}>
//           <TouchableOpacity onPress={() => console.log("اشتراک همسایه")}>
//             <Ionicons name='home-outline' size={24} color="#666" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={onDetailsPress}>
//             <Ionicons name="ellipsis-vertical" size={24} color="#666" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handleOpenMap}>
//             <Ionicons name="map-sharp" size={24} color="#666" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {savedReadInfo && (
//         <View style={styles.debugContainer}>
//           <Text style={styles.debugText}>قرائت قبلی:</Text>
//           <Text style={styles.debugTextSmall}>وضعیت: {savedReadInfo.readStateDesc}</Text>
//           <Text style={styles.debugTextSmall}>مشاهده: {savedReadInfo.readViewDescs}</Text>
//           <Text style={styles.debugTextSmall}>رقم: {savedReadInfo.readNumber}</Text>
//         </View>
//       )}

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           keyboardType="numeric"
//           placeholder="رقم کنتور"
//           placeholderTextColor="#999"
//           value={readNumber}
//           onChangeText={setReadNumber}
//           textAlign="right"
//         />
//         <TouchableOpacity 
//           style={styles.cameraButton} 
//           onPress={() => setCameraVisible(true)}>
//           <Ionicons name="camera-outline" size={22} color="#000000ff" />
//         </TouchableOpacity>
//       </View>

//       {capturedPhoto && (
//         <View style={styles.photoPreview}>
//           <Image source={{ uri: capturedPhoto }} style={styles.photoPreviewImage} />
//           <TouchableOpacity 
//             style={styles.removePhotoButton} 
//             onPress={() => setCapturedPhoto(null)}>
//             <Ionicons name="close-circle" size={24} color="#ff4444" />
//           </TouchableOpacity>
//         </View>
//       )}

//       <Text style={styles.label}>وضعیت قرائت:</Text>
//       <View style={styles.inputContainer}>
//         <Picker
//           selectedValue={selectedStatus}
//           onValueChange={setSelectedStatus}
//           style={styles.picker}
//           dropdownIconRippleColor="#4a90e2"
//           mode="dialog">
//           <Picker.Item label="انتخاب کنید" value="" />
//           {readBasicModel?.readDeviceSettingState?.map((state: any) => (
//             <Picker.Item
//               key={state.tblReadStateTypeId}
//               label={state.readStateDesc}
//               value={state.readStateCode.toString()}
//               style={{ textAlign: 'left' }}
//             />
//           ))}
//         </Picker>
//       </View>

//       <Text style={styles.label}>مشاهده قرائت:</Text>
//       <View style={styles.inputContainer}>
//         <Picker
//           selectedValue={selectedView}
//           onValueChange={setSelectedView}
//           style={styles.picker}
//           dropdownIconRippleColor="#4a90e2"
//           mode="dialog"
//           enabled={!!selectedStatus}>
//           <Picker.Item label="انتخاب کنید" value="" />
//           {uniqueViews.map((view: any, index: number) => (
//             <Picker.Item
//               key={`${view.tblReadViewTypeId}-${index}`}
//               label={view.readViewDesc}
//               value={view.readViewCode.toString()}
//             />
//           ))}
//         </Picker>
//       </View>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="توضیحات"
//           placeholderTextColor="#999"
//           value={readDescription}
//           onChangeText={setReadDescription}
//           textAlign="right"
//         />
//         <TouchableOpacity style={styles.cameraButton} onPress={() => {}}>
//           <Ionicons name="mic-outline" size={22} color="#000000ff" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.circleButtonContainer}>
//         <TouchableOpacity
//           style={styles.circleButton}
//           onPress={onSubmit}
//           disabled={submitting}>
//           {submitting ? (
//             <ActivityIndicator color="#fff" size="small" />
//           ) : (
//             <Ionicons name="checkmark" size={34} color="#ffffffff" />
//           )}
//         </TouchableOpacity>
//       </View>

//       <CameraScreen 
//         visible={cameraVisible}
//         onClose={() => setCameraVisible(false)}
//         onCapture={handleCameraCapture}
//       />

//       {currentSubscriber && (
//         <MapScreen 
//           data={currentSubscriber}
//           isVisible={mapVisible}
//           close={() => setMapVisible(false)}
//           needGis={true}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   formCard: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//     paddingBottom: 12,
//   },
//   cardHeaderIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#e8f0fe",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cardHeaderText: { 
//     fontSize: 18, 
//     fontWeight: "800", 
//     color: "#333", 
//     fontFamily: "iransans" 
//   },
//   label: { 
//     textAlign: 'left', 
//     marginBottom: 10, 
//     fontSize: 17, 
//     color: '#666', 
//     fontFamily: 'nazanin' 
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e5e5e5",
//     borderRadius: 12,
//     marginBottom: 12,
//     backgroundColor: "#fafafa",
//     direction: "rtl" as const,
//   },
//   input: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingVertical: Platform.OS === "ios" ? 14 : 12,
//     fontSize: 18,
//     textAlign: "right",
//     fontFamily: "nazanin",
//   },
//   cameraButton: { 
//     padding: 12, 
//     paddingHorizontal: 16, 
//     borderLeftWidth: 1, 
//     borderLeftColor: "#e5e5e5" 
//   },
//   picker: { 
//     flex: 1, 
//     height: 55, 
//     color: '#333', 
//     fontFamily: 'nazanin', 
//     fontSize: 19, 
//     textAlign: 'left', 
//     direction: 'ltr' 
//   },
//   circleButtonContainer: {
//     width: 60,
//     height: 60,
//     marginHorizontal: 60,
//     borderWidth: 4,
//     borderColor: '#1ca4ffff',
//     borderRadius: 42,
//     padding: 3,
//     marginRight: 'auto',
//     marginLeft: 'auto',
//     marginTop: 20,
//   },
//   circleButton: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 42,
//     backgroundColor: '#1ca4ffff',
//   },
//   photoPreview: {
//     position: 'relative',
//     marginBottom: 12,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   photoPreviewImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   removePhotoButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     borderRadius: 12,
//     padding: 2,
//   },
//   debugContainer: {
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   debugText: {
//     fontSize: 17,
//     fontWeight: 'bold',
//     color: '#333',
//     fontFamily: 'nazanin',
//     marginBottom: 5,
//   },
//   debugTextSmall: {
//     fontSize: 16,
//     color: '#666',
//     fontFamily: 'nazanin',
//   },
// });

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
import * as Location from 'expo-location';

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
  onSubmit: (capturedLocation?: { latitude: number; longitude: number } | null) => void; // تغییر کرد
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
  const [isDirectLocationLoading, setIsDirectLocationLoading] = useState(false);
  
  const [capturedLocation, setCapturedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const savedReadInfo = currentSubscriber?.waterPriceWorkReadInfo;

  const findStateCodeByDesc = (stateDesc: string) => {
    const state = readBasicModel?.readDeviceSettingState?.find(
      (s: any) => s.readStateDesc === stateDesc
    );
    return state?.readStateCode?.toString() || "";
  };

  const findViewCodeByDesc = (viewDesc: string) => {
    const view = readBasicModel?.readDeviceSettingView?.find(
      (v: any) => v.readViewDesc === viewDesc
    );
    return view?.readViewCode?.toString() || "";
  };

  useEffect(() => {
    if (savedReadInfo && readBasicModel) {
      if (savedReadInfo.readStateDesc && !selectedStatus) {
        const savedStateCode = findStateCodeByDesc(savedReadInfo.readStateDesc);
        if (savedStateCode) {
          setSelectedStatus(savedStateCode);
        }
      }

      if (savedReadInfo.readViewDescs && !selectedView) {
        const savedViewCode = findViewCodeByDesc(savedReadInfo.readViewDescs);
        if (savedViewCode) {
          setSelectedView(savedViewCode);
        }
      }

      if (savedReadInfo.readNumber && !readNumber) {
        setReadNumber(savedReadInfo.readNumber.toString());
      }

      if (savedReadInfo.readDescription && !readDescription) {
        setReadDescription(savedReadInfo.readDescription);
      }
    }
  }, [savedReadInfo, readBasicModel]);

  useEffect(() => {
    setCapturedLocation(null);
  }, [currentSubscriber?.tblSubscriberId]);

  const handleCameraCapture = (uri: string) => {
    setCapturedPhoto(uri);
  };

  const handleDirectLocationCapture = async () => {
    setIsDirectLocationLoading(true);

    try {
      const isEnabled = await Location.hasServicesEnabledAsync();

      if (!isEnabled) {
        Alert.alert(
          'موقعیت مکانی خاموش است',
          Platform.OS === 'ios'
            ? 'لطفاً Location Services را از تنظیمات دستگاه روشن کنید'
            : 'لطفاً GPS را از تنظیمات دستگاه روشن کنید',
          [
            { text: 'انصراف', style: 'cancel' },
            {
              text: 'تنظیمات',
              onPress: async () => {
                if (Platform.OS === 'android') {
                  await Location.enableNetworkProviderAsync();
                }
              },
            },
          ]
        );
        return;
      }

      let { status } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('خطا', 'دسترسی به موقعیت مکانی داده نشد');
          return;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      setCapturedLocation({ latitude, longitude });

      Alert.alert(
        'موفق',
        `موقعیت کاربر با موفقیت ثبت شد`
      );
    } catch (error) {
      console.error('خطا در ثبت موقعیت:', error);
      Alert.alert('خطا', 'خطا در دریافت موقعیت مکانی');
    } finally {
      setIsDirectLocationLoading(false);
    }
  };

  const handleMapLocationCapture = (location: { latitude: number; longitude: number }) => {
    setCapturedLocation(location);
  };

  const handleSubmit = () => {
    onSubmit(capturedLocation);
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

          <TouchableOpacity
            onPress={handleDirectLocationCapture}
            disabled={isDirectLocationLoading}
          >
            {isDirectLocationLoading ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Ionicons name="navigate-circle" size={24} color="#666" />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMapVisible(true)}>
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="توضیحات"
          placeholderTextColor="#999"
          value={readDescription}
          onChangeText={setReadDescription}
          textAlign="right"
        />
      </View>

      <View style={styles.circleButtonContainer}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={handleSubmit}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="checkmark" size={34} color="#ffffffff" />
          )}
        </TouchableOpacity>
      </View>

      <CameraScreen
        visible={cameraVisible}
        onClose={() => setCameraVisible(false)}
        onCapture={handleCameraCapture}
      />

      {currentSubscriber && (
        <MapScreen
          data={currentSubscriber}
          isVisible={mapVisible}
          close={() => setMapVisible(false)}
          needGis={true}
          onLocationCapture={handleMapLocationCapture}
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
  locationInfoContainer: {
    backgroundColor: '#e8f0fe',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderRightWidth: 3,
    borderRightColor: '#4285F4',
  },
  locationInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  locationInfoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a73e8',
    fontFamily: 'nazanin',
    marginBottom: 4,
  },
  locationCoordinatesText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'nazanin',
    direction: 'ltr',
    textAlign: 'left',
  },
  separator: {
    height: 1,
    backgroundColor: '#4285F4',
    marginVertical: 8,
    opacity: 0.3,
  },
});