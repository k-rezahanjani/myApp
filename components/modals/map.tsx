// components/modals/map.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { LeafletView, LatLng } from 'react-native-leaflet-view';
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system'; // استفاده از API جدید
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface MapScreenProps {
  data: any;
  isVisible: boolean;
  close: () => void;
}

export default function MapScreen({ data, isVisible, close }: MapScreenProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const latitude = data?.xLocation;
  const longitude = data?.yLocation;

  useEffect(() => {
    let isMounted = true;
    const loadHtml = async () => {
      try {
        const path = require('../../assets/leaflet.html');
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();

        const file = new File(asset.localUri!);
        const htmlContent = await file.text();

        if (isMounted) {
          setHtmlContent(htmlContent);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('خطا در بارگذاری نقشه:', error);
        Alert.alert('خطا', 'مشکل در بارگذاری نقشه');
        if (isMounted) setIsLoading(false);
      }
    };

    if (isVisible) {
      loadHtml();
    }

    return () => {
      isMounted = false;
    };
  }, [isVisible]);

  // پیام‌های دریافتی از نقشه (اختیاری)
  const handleMessageReceived = (message: any) => {
    console.log('پیام از نقشه:', message);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={close}
    >
      <View style={styles.container}>
        {/* هدر مودال */}
        <View style={styles.header}>
          <Text style={styles.title}>موقعیت مکانی مشترک</Text>
          <TouchableOpacity onPress={close} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* محتوای نقشه */}
        <View style={styles.mapContainer}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4a90e2" />
              <Text style={styles.loadingText}>در حال بارگذاری نقشه...</Text>
            </View>
          )}

          {htmlContent && (
            <LeafletView
              source={{ html: htmlContent }}
              mapCenterPosition={{
                lat: latitude,
                lng: longitude
              }}
              zoom={15}
              zoomControl={true}
              onMessageReceived={handleMessageReceived}
              mapMarkers={[
                {
                  id: 'subscriber-location',
                  position: { lat: latitude, lng: longitude },
                  icon: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                }
              ]}
              onLoadEnd={() => setIsLoading(false)}
              onError={(error) => {
                console.error('خطای نقشه:', error);
                setIsLoading(false);
                Alert.alert('خطا', 'مشکل در نمایش نقشه');
              }}
            />
          )}
        </View>

        {/* پایین صفحه */}
        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#4a90e2" />
            <Text style={styles.coordsText}>
              مختصات: {latitude.toFixed(6)} , {longitude.toFixed(6)}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'iransans',
  },
  closeButton: {
    padding: 5,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    fontFamily: 'nazanin',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coordsText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'nazanin',
  },
});