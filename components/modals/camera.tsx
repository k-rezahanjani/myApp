import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

interface CameraScreenProps {
  visible: boolean;
  onClose: () => void;
  onCapture?: (uri: string) => void;
}

export default function CameraScreen({ visible, onClose, onCapture }: CameraScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  const takePicture = async () => {
    if (!cameraReady || !cameraRef.current) {
      Alert.alert('خطا', 'دوربین آماده نیست');
      return;
    }

    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
        exif: false,
      });

      setCapturedImage(photo.uri);

      if (onCapture) {
        onCapture(photo.uri);
      }
    } catch (error) {
      console.log('خطا در گرفتن عکس:', error);
      Alert.alert('خطا', 'مشکل در گرفتن عکس');
    } finally {
      setLoading(false);
    }
  };

  const usePhoto = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
    }
    onClose();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const handleClose = () => {
    setCapturedImage(null);
    onClose();
  };


  if (!permission?.granted) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={60} color="#4a90e2" />
          <Text style={styles.permissionText}>برای استفاده از دوربین نیاز به مجوز دارید</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
              const result = await requestPermission();
              if (!result.granted) {
                Alert.alert('خطا', 'مجوز دوربین داده نشد');
              }
            }}>
            <Text style={styles.permissionButtonText}>درخواست مجوز</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closePermissionButton} onPress={handleClose}>
            <Text style={styles.closePermissionText}>بستن</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']}>
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={styles.container}>
          {!capturedImage ? (
            <>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
                onCameraReady={() => setCameraReady(true)}>
                <View style={styles.cameraOverlay}>
                  <View style={styles.cameraHeader}>
                    <Text style={styles.cameraTitle}>عکس از کنتور</Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeCameraButton}>
                      <Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cameraFooter}>
                    <TouchableOpacity
                      style={[styles.captureButton, !cameraReady && styles.captureButtonDisabled]}
                      onPress={takePicture}
                      disabled={!cameraReady || loading}>
                      {loading ? (
                        <ActivityIndicator color="#fff" size="large" />
                      ) : (
                        <View style={styles.captureInner} />
                      )}
                    </TouchableOpacity>

                    <Text style={styles.cameraHint}>
                      برای عکس گرفتن ضربه بزنید
                    </Text>
                  </View>
                </View>
              </CameraView>
            </>
          ) : (
            <View style={styles.previewContainer}>
              <Image source={{ uri: capturedImage }} style={styles.previewImage} />

              <View style={styles.previewButtons}>
                <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
                  <Ionicons name="refresh" size={24} color="#fff" />
                  <Text style={styles.buttonText}>دوباره</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.useButton} onPress={usePhoto}>
                  <Ionicons name="checkmark" size={24} color="#fff" />
                  <Text style={styles.buttonText}>استفاده</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4a90e2" />
              <Text style={styles.loadingText}>در حال پردازش...</Text>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  cameraTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'iransans',
    fontWeight: 'bold',
  },
  closeCameraButton: {
    padding: 10,
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  cameraHint: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'nazanin',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    gap: 10,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  useButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34c759',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'nazanin',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  permissionText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'nazanin',
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
    fontSize: 16,
    fontFamily: 'nazanin',
  },
  closePermissionButton: {
    marginTop: 10,
    padding: 10,
  },
  closePermissionText: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'nazanin',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'nazanin',
  },
});