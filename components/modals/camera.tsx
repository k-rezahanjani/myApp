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
  ScrollView,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

interface CameraScreenProps {
  visible: boolean;
  onClose: () => void;
  onCapture?: (uris: string[]) => void;
}

export default function CameraScreen({ visible, onClose, onCapture }: CameraScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
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

      setTempImage(photo.uri);
      setShowPreview(true);
    } catch (error) {
      console.log('خطا در گرفتن عکس:', error);
      Alert.alert('خطا', 'مشکل در گرفتن عکس');
    } finally {
      setLoading(false);
    }
  };

  const confirmPhoto = () => {
    if (tempImage) {
      setCapturedImages(prev => [...prev, tempImage]);
      setTempImage(null);
      setShowPreview(false);
    }
  };

  const retakePhoto = () => {
    setTempImage(null);
    setShowPreview(false);
  };

  const removeImage = (index: number) => {
    Alert.alert(
      'حذف عکس',
      'آیا از حذف این عکس مطمئن هستید؟',
      [
        { text: 'لغو', style: 'cancel' },
        {
          text: 'حذف',
          onPress: () => {
            setCapturedImages(prev => prev.filter((_, i) => i !== index));
          },
          style: 'destructive'
        }
      ]
    );
  };

  const confirmAllImages = () => {
    if (capturedImages.length === 0) {
      Alert.alert('خطا', 'هیچ عکسی گرفته نشده است');
      return;
    }

    if (onCapture) {
      onCapture(capturedImages);
    }
    handleClose();
  };

  const handleClose = () => {
    setCapturedImages([]);
    setTempImage(null);
    setShowPreview(false);
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
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {capturedImages.length > 0 ? `${capturedImages.length} عکس گرفته شده` : 'دوربین'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {!showPreview ? (
            <View style={styles.cameraWrapper}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
                onCameraReady={() => setCameraReady(true)}
              >
                <View style={styles.cameraOverlay}>
                  {capturedImages.length > 0 && (
                    <View style={styles.thumbnailsContainer}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailsScroll}
                      >
                        {capturedImages.map((uri, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.thumbnailWrapper}
                            onPress={() => removeImage(index)}
                          >
                            <Image source={{ uri }} style={styles.thumbnail} />
                            <View style={styles.thumbnailOverlay}>
                              <Ionicons name="close-circle" size={20} color="#ff4444" />
                            </View>
                            <Text style={styles.thumbnailNumber}>{index + 1}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  <View style={styles.footer}>
                    {capturedImages.length > 0 && (
                      <TouchableOpacity
                        style={styles.confirmAllButton}
                        onPress={confirmAllImages}
                      >
                        <Ionicons name="checkmark-done-circle" size={24} color="#fff" />
                        <Text style={styles.confirmAllText}>تایید همه</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.captureButton, !cameraReady && styles.captureButtonDisabled]}
                      onPress={takePicture}
                      disabled={!cameraReady || loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" size="large" />
                      ) : (
                        <View style={styles.captureInner} />
                      )}
                    </TouchableOpacity>

                    {capturedImages.length > 0 && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>{capturedImages.length}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </CameraView>
            </View>
          ) : (
            <View style={styles.previewContainer}>
              {tempImage && (
                <Image source={{ uri: tempImage }} style={styles.previewImage} />
              )}

              <View style={styles.previewButtons}>
                <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
                  <Ionicons name="refresh" size={28} color="#fff" />
                  <Text style={styles.buttonText}>دوباره</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.useButton} onPress={confirmPhoto}>
                  <Ionicons name="checkmark" size={28} color="#fff" />
                  <Text style={styles.buttonText}>تایید</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  cameraWrapper: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  thumbnailsContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  thumbnailsScroll: {
    paddingHorizontal: 5,
  },
  thumbnailWrapper: {
    marginHorizontal: 4,
    position: 'relative',
  },
  thumbnail: {
    width: 55,
    height: 55,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  thumbnailNumber: {
    position: 'absolute',
    bottom: -5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 9,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
    gap: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  confirmAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34c759',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 6,
  },
  confirmAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#4a90e2',
  },
  countBadge: {
    backgroundColor: '#4a90e2',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 30,
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    gap: 10,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  useButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34c759',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomImagesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 10,
    paddingHorizontal: 5,
    maxHeight: 110,
  },
  bottomImagesScroll: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  bottomImageWrapper: {
    marginHorizontal: 5,
    position: 'relative',
  },
  bottomImage: {
    width: 75,
    height: 75,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  bottomRemoveButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  bottomImageNumber: {
    position: 'absolute',
    bottom: -5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bottomImageNumberText: {
    color: '#fff',
    fontSize: 10,
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
  },
  closePermissionButton: {
    marginTop: 10,
    padding: 10,
  },
  closePermissionText: {
    color: '#999',
    fontSize: 14,
  },

});