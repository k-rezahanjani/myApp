import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface onProps {
  isVisible: boolean,
  data: any,
  close: () => void;
}

interface payloadProps {
  postalCode: any | number,
  phone: any | number,
  cellPhone: any | number
}

export default function SubscriberModal({ close, isVisible, data }: onProps) {
  const [postCode, setPostCode] = useState('');
  const [phone, setPhone] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const insets = useSafeAreaInsets();


  useEffect(() => {
    if (data && isVisible) {
      setPostCode(data?.postalCode || 0);
      setPhone(data?.phone || 0)
      setCellPhone(data?.cellPhone || 0)
    }
  }, [])

  return (
    <Modal animationType="slide" transparent={false} visible={isVisible}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: insets.top,
        }}
        edges={['top', 'left', 'right']}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>دریافت اطلاعات پایه مشترکین</Text>
            <TouchableOpacity onPress={close}>
              <Ionicons name="close" color="#ffffffff" size={22} />
            </TouchableOpacity>
          </View>
          <View style={{ padding: 10 }}>
            <Text style={{ direction: 'rtl', margin: 5 }}>کد پستی</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="کد پستی"
                placeholderTextColor="#999"
                value={postCode}
                onChangeText={setPostCode}
                textAlign="right"
              />
            </View>
            <Text style={{ direction: 'rtl', margin: 5 }}>تلفن</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="تلفن"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor="#999"
                textAlign="right"
              />
            </View>
            <Text style={{ direction: 'rtl', margin: 5 }}>تلفن همراه</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="تلفن همراه"
                placeholderTextColor="#999"
                textAlign="right"
                value={cellPhone}
                onChangeText={setCellPhone}
              />
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
    </Modal>
  )
}


const styles = StyleSheet.create({
  modalContent: { height: '50%', width: '100%', backgroundColor: '#ffffffff', borderTopRightRadius: 18, borderTopLeftRadius: 18, },
  titleContainer: { height: 50, backgroundColor: '#4a90e2', paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
  title: { color: '#ffffffff', fontSize: 16 },
  modalSavebtn: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#4a90e2', alignItems: 'center', width: 200, borderRadius: 5, margin: 'auto', paddingVertical: 5, marginTop: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, marginBottom: 12, backgroundColor: "#fafafa", direction: 'rtl' },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: Platform.OS === "ios" ? 14 : 12, fontSize: 14, textAlign: "right", fontFamily: "nazanin" },

})