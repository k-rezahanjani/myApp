// import React from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { Ionicons } from '@expo/vector-icons';

// interface MapProps {
//   data: any;
//   isVisible: boolean;
//   close: () => void;
// }

// export default function MapScreen({
//   data,
//   isVisible,
//   close,
// }: MapProps) {

//   const latitude = data?.xLocation;
//   const longitude = data?.yLocation;

//   const isValidCoordinates = 
//     latitude !== null && 
//     longitude !== null;

//   if (!isValidCoordinates) {
//     return (
//       <Modal
//         visible={isVisible}
//         animationType="slide"
//         onRequestClose={close}
//       >
//         <View style={styles.container}>
//           <View style={styles.header}>
//             <Text style={styles.title}>
//               موقعیت مشترک
//             </Text>

//             <TouchableOpacity onPress={close}>
//               <Ionicons
//                 name="close"
//                 size={24}
//                 color="#333"
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.errorContainer}>
//             <Ionicons 
//               name="location-outline" 
//               size={64} 
//               color="#ccc" 
//             />
//             <Text style={styles.errorText}>
//               موقعیت مکانی برای این مشترک ثبت نشده است
//             </Text>
//           </View>
//         </View>
//       </Modal>
//     );
//   }

//   const html = `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="utf-8" />
// <meta name="viewport" content="width=device-width, initial-scale=1.0">

// <link rel="stylesheet"
//  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

// <style>
// html,body,#map{
//   height:100%;
//   width:100%;
//   margin:0;
//   padding:0;
// }
// </style>
// </head>

// <body>

// <div id="map"></div>

// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

// <script>

// var map = L.map('map').setView(
//   [${latitude}, ${longitude}],
//   16
// );

// L.tileLayer(
//   'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
//   {
//     maxZoom: 19
//   }
// ).addTo(map);

// L.marker([${latitude}, ${longitude}])
//  .addTo(map)
//  .openPopup();

// </script>

// </body>
// </html>
// `;

//   return (
//     <Modal
//       visible={isVisible}
//       animationType="slide"
//       onRequestClose={close}
//     >
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.title}>
//             موقعیت مشترک
//           </Text>

//           <TouchableOpacity onPress={close}>
//             <Ionicons
//               name="close"
//               size={24}
//               color="#333"
//             />
//           </TouchableOpacity>
//         </View>

//         <WebView
//           source={{ html }}
//           style={styles.map}
//           javaScriptEnabled
//           domStorageEnabled
//         />
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   header: {
//     paddingTop: 50,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },

//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },

//   map: {
//     flex: 1,
//   },

//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     padding: 20,
//   },

//   errorText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 16,
//     marginBottom: 8,
//   },

//   errorSubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//   },
// });


import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { UrlTile, MAP_TYPES, Marker } from 'react-native-maps';

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

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={close}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>موقعیت مشترک</Text>
          <TouchableOpacity onPress={close}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <MapView
          style={styles.map}
          provider={null}              // غیرفعال کردن Google Maps
          mapType={MAP_TYPES.NONE}     // حذف لایه پیش‌فرض
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* لایه OpenStreetMap با استفاده از کارتو (بدون کلید) */}
          <UrlTile
            urlTemplate="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            zIndex={1}
          />

          {/* نشانگر موقعیت */}
          <Marker
            coordinate={{ latitude, longitude }}
            title="موقعیت مشترک"
            description={`مختصات: ${latitude}, ${longitude}`}
          />
        </MapView>
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  map: {
    flex: 1,
  },
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