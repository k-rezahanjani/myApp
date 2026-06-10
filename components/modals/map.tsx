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

export default function MapScreen({
  data,
  isVisible,
  close,
}: MapProps) {
  const latitude = Number(
    data?.xLocation
  );

  const longitude = Number(
    data?.yLocation
  );

  const subscriberName =
    data?.subscriberName;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="stylesheet"
 href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

<style>
html,body,#map{
  height:100%;
  width:100%;
  margin:0;
  padding:0;
}
</style>
</head>

<body>

<div id="map"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>

var map = L.map('map').setView(
  [${latitude}, ${longitude}],
  16
);

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19
  }
).addTo(map);

L.marker([${latitude}, ${longitude}])
 .addTo(map)
 .bindPopup('${subscriberName}')
 .openPopup();

</script>

</body>
</html>
`;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={close}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            موقعیت مشترک
          </Text>

          <TouchableOpacity onPress={close}>
            <Ionicons
              name="close"
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <WebView
          source={{ html }}
          style={styles.map}
          javaScriptEnabled
          domStorageEnabled
        />

        {/* <View style={styles.footer}>
          <Text style={styles.coords}>
            {latitude.toFixed(6)}
            {' , '}
            {longitude.toFixed(6)}
          </Text>
        </View> */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  map: {
    flex: 1,
  },

  footer: {
    padding: 15,
    backgroundColor: '#fff',
  },

  coords: {
    textAlign: 'center',
    color: '#666',
  },
});