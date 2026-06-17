import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

interface MapProps {
  data: any;
  isVisible: boolean;
  close: () => void;
}

export default function MapScreen({ data, isVisible, close }: MapProps) {
  const latitude = data?.xLocation;
  const longitude = data?.yLocation;

  const isValidCoordinates =
    latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude);

  if (!isValidCoordinates) {
    return (
      <Modal visible={isVisible} animationType="slide" onRequestClose={close}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>موقعیت مشترک</Text>
            <TouchableOpacity onPress={close}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.errorContainer}>
            <Ionicons name="location-outline" size={64} color="#ccc" />
            <Text style={styles.errorText}>
              موقعیت مکانی برای این مشترک ثبت نشده است
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([${latitude}, ${longitude}], 16);
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);
          L.marker([${latitude}, ${longitude}])
            .addTo(map)
            .bindPopup('📍 موقعیت مشترک')
            .openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={close}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>موقعیت مشترک</Text>
          <TouchableOpacity onPress={close}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <WebView
          source={{ html: htmlContent }}
          style={styles.map}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  map: { flex: 1 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});