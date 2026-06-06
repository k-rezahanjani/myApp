import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet, Platform, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

interface onProps {
  isVisible: boolean,
  data: any,
  close: () => void;
}

export default function DebitDetailsModal({ close, isVisible, data }: onProps) {

  const debit = data?.lastDebitPrice

  return (
    <SafeAreaView edges={['top']}>
      <Modal animationType="slide" transparent={false} visible={isVisible}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>نتیجه بدهی</Text>
            <TouchableOpacity onPress={close}>
              <Ionicons name="close" color="#ffffffff" size={22} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row-reverse' }}>
            <View style={styles.half}>
              <View style={styles.fix}>
                <Text style={styles.debitTitle}>کد اشتراک: </Text>
                <Text style={styles.debitValue}>{data?.subscriberCode}</Text>
              </View>
              <View style={[styles.fix]}>
                <Text style={styles.debitTitle}>عنوان: </Text>
                <Text style={styles.debitValue}>{debit?.fullName}</Text>
              </View>
              <View style={styles.fix}>
                <Text style={styles.debitTitle}>شناسه قبض: </Text>
                <Text style={styles.debitValue}>{debit?.billIdentity}</Text>
              </View>
              <View style={styles.fix}>
                <Text style={styles.debitTitle}>شناسه پرداخت: </Text>
                <Text style={styles.debitValue}>{debit?.payIdentity}</Text>
              </View>
              <View style={styles.fix}>
                <Text style={styles.debitTitle}>مبلغ تقسیط: </Text>
                <Text style={styles.debitValue}>{debit?.debitAmount}</Text>
              </View>
              <View style={styles.fix}>
                <Text style={styles.debitTitle}>تخفیف: </Text>
                <Text style={styles.debitValue}>{debit?.discountAmount}</Text>
              </View>
              <View style={styles.fix}>
                <Text style={styles.debitTitle}>مبلغ هزینه ها: </Text>
                <Text style={styles.debitValue}>{debit?.costAmount}</Text>
              </View>
              <View style={styles.fix}>
                <Text style={{ direction: 'rtl', margin: 5, fontFamily: 'nazanin' }}>اصلاحات: </Text>
                <Text style={styles.debitValue}>{debit?.editRemainAmount}</Text>
              </View>
              <View style={styles.fix}>
                <Text style={styles.debitTitle}>مانده بدهی: </Text>
                <Text style={styles.debitValue}>{debit?.mainAmount}</Text>
              </View>
              <View style={[styles.fix, { width: '100%' }]}>
                <Text style={styles.debitTitle}>مبلغ به حروف: </Text>
                <Text style={styles.debitValue}>{debit?.mainAmountText}</Text>
              </View>
              <View style={styles.fix}>
                <Text style={styles.debitTitle}>مبلغ صورتحساب: </Text>
                <Text style={styles.debitValue}>{debit?.paymentAmount}</Text>
              </View>
              <View style={styles.fix}>
                <Text style={styles.debitTitle}>مبلغ تعرفه: </Text>
                <Text style={styles.debitValue}>{debit?.tariffAmount}</Text>
              </View>
            </View>
            <View style={styles.halfTwo}>
              {debit?.items?.map((item: any, index: number) => (
                <View key={index} style={styles.fix}>
                  <Text>{item.itemAmount}</Text>
                  <Text style={{ marginHorizontal: 5 }}>
                    {item.itemDesc}:
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.modalSavebtn} onPress={() => Alert.alert('توجه', 'این بخش در حال توسعه می باشد.')}>
            <Text style={{ padding: 2, color: '#ffff' }}>پرداخت</Text>
          </TouchableOpacity>
        </View>
      </Modal >
    </SafeAreaView>

  )
}


const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffffff',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
  titleContainer: {
    height: 50,
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#ffffffff',
    fontSize: 16
  },
  modalSavebtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#4a90e2',
    alignItems: 'center',
    width: 200,
    borderRadius: 5,
    margin: 'auto',
    paddingVertical: 5,
    marginTop: 10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
    direction: 'rtl'
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 14,
    textAlign: "right",
    fontFamily: "nazanin"
  },
  fix: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    // width: '50%',
    marginLeft: 'auto',
    padding: 0,
    justifyContent: 'flex-start'
  },
  half: {
    padding: 5,
    direction: 'ltr',
    flexDirection: 'column',
    width: 258,
    marginLeft: 'auto'
  },
  halfTwo: {
    padding: 10,
    direction: 'rtl',
    flexDirection: 'column',
    width: 220,
    marginLeft: 'auto',
    height: 200
  },
  debitTitle: {
    direction: 'rtl',
    margin: 5
  },
  debitValue: {
    textAlign: 'center'
  }

})