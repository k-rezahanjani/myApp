import { useState, useEffect } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen({ onClose, onCapture }) {
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        Alert.alert(
          'خطا',
          'برای استفاده از دوربین نیاز به مجوز دارید',
          [{ text: 'باشه', onPress: onClose }]
        );
      }
    } catch (error) {
      console.error('Permission error:', error);
      setHasPermission(false);
    }
  };

  const openCamera = async () => {
    try {
      const pickImageAsync = async () => {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
        });

        console.log('Camera result:', result);

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const capturedImage = result.assets[0].uri;
          setImage(capturedImage);

          // ارسال عکس به کامپوننت والد
          if (onCapture) {
            onCapture(capturedImage);
          }
        }
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('خطا', 'مشکل در باز کردن دوربین');
    }
  };

  const handleRetake = () => {
    setImage(null);
    // دوباره دوربین رو باز کن
    setTimeout(() => {
      openCamera();
    }, 300);
  };

  const handleConfirm = () => {
    if (image && onCapture) {
      onCapture(image);
    }
    if (onClose) {
      onClose();
    }
  };

  // در حال بررسی مجوز
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>در حال بررسی مجوز دوربین...</Text>
      </View>
    );
  }

  // مجوز داده نشده
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-outline" size={80} color="#666" />
        <Text style={styles.text}>دسترسی به دوربین داده نشده است</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>درخواست مجدد مجوز</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>بستن</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // نمایش عکس گرفته شده
  if (image) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: image }} style={styles.previewImage} />
        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleRetake}>
            <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>عکس جدید</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.confirmButton]} onPress={handleConfirm}>
            <Ionicons name="checkmark-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>تایید عکس</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // صفحه اصلی دوربین
  return (
    <View style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Ionicons name="camera-outline" size={100} color="#4a90e2" />
        <Text style={styles.placeholderText}>برای گرفتن عکس دکمه زیر را بزنید</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={openCamera}>
          <View style={styles.captureButtonInner}>
            <Ionicons name="camera" size={30} color="#fff" />
          </View>
          <Text style={styles.captureButtonText}>باز کردن دوربین</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>انصراف</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'iransans',
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: '#4a90e2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'iransans',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'iransans',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'iransans',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingBottom: 40,
    gap: 15,
  },
  captureButton: {
    alignItems: 'center',
    gap: 10,
  },
  captureButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'iransans',
  },
  cancelButton: {
    alignItems: 'center',
    padding: 10,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'iransans',
  },
  previewImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: '#27ae60',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'iransans',
  },
});