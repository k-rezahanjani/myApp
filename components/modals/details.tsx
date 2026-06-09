import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface onProps {
  isVisible: boolean,
  data: any,
  close: () => void;
}

export default function DetailsModal({ close, isVisible, data }: onProps) {
    const insets = useSafeAreaInsets();
  return (
    <Modal animationType="slide" transparent={false} visible={isVisible} statusBarTranslucent={false}>
      <SafeAreaView 
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top,
      }}
      edges={['top', 'left', 'right']}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>جزییات</Text>
            <TouchableOpacity onPress={close}>
              <Ionicons name="close" color="#ffffffff" size={22} />
            </TouchableOpacity>
          </View>
          <View style={{ padding: 10 }}>
            <View style={styles.fix}>
              <Text style={{ direction: 'rtl', margin: 5 }}>کد اشتراک</Text>
              <Text>{data.subscriberCode}</Text>
            </View>
            <View style={styles.fix}>
              <Text style={{ direction: 'rtl', margin: 5 }}>نام مشترک</Text>
              <Text>{data.subscriberName}</Text>
            </View>
            <View style={styles.fix}>
              <Text style={{ direction: 'rtl', margin: 5 }}>شماره تلفن همراه</Text>
              <Text>{data.cellPhone}</Text>
            </View>
            <View style={styles.fix}>
              <Text style={{ direction: 'rtl', margin: 5 }}>کد شناسایی</Text>
              <Text>{data.identityCode}</Text>
            </View>
            <View style={styles.fix}>
              <Text style={{ direction: 'rtl', margin: 5 }}>آدرس</Text>
              <Text>{data.address}</Text>
            </View>
            <View style={styles.fix}>
              <Text style={{ direction: 'rtl', margin: 5 }}>سریال کنتور</Text>
              <Text>{data.waterMeterSerial}</Text>
            </View>
            <View style={styles.fix}>
              <Text style={{ direction: 'rtl', margin: 5 }}>قطر کنتور</Text>
              <Text>{data.boreDesc}</Text>
            </View>
            <View style={styles.fix}>
              <Text style={{ direction: 'rtl', margin: 5, fontFamily: 'nazanin' }}>ریز کاربری</Text>
              <Text>{data.currentUsageDetailDesc}</Text>
            </View>
            <View style={styles.fix}>
              <Text style={{ direction: 'rtl', margin: 5 }}>شماره پلمپ</Text>
              <Text style={{ textAlign: 'center' }}>{data.waterMeterPlump}</Text>
            </View>
            <TouchableOpacity style={styles.modalSavebtn}>
              <Text style={{ padding: 2, color: '#ffff' }}>ذخیره</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSavebtn} onPress={close}>
              <Text style={{ padding: 2, color: '#ffff' }}>بستن</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </Modal >

  )
}


const styles = StyleSheet.create({
  modalContent: { width: '100%', backgroundColor: '#ffffffff', borderTopRightRadius: 18, borderTopLeftRadius: 18, },
  titleContainer: { height: 50, backgroundColor: '#4a90e2', paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
  title: { color: '#ffffffff', fontSize: 20 },
  modalSavebtn: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#4a90e2', alignItems: 'center', width: 200, borderRadius: 5, margin: 'auto', paddingVertical: 5, marginTop: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, marginBottom: 12, backgroundColor: "#fafafa", direction: 'rtl' },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: Platform.OS === "ios" ? 14 : 12, fontSize: 20, textAlign: "right", fontFamily: "nazanin" },
  fix: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.3,
    alignItems: 'center',
  }

})