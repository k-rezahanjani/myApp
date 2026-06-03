import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface WaterPriceListCardProps {
  data: any;
  onDetailsPress?: (item: any) => void;
  onMapPress?: (item: any) => void;
  onContinuePress?: (item: any) => void;
}

const WaterPriceListCard = ({ data, onDetailsPress, onMapPress, onContinuePress }: WaterPriceListCardProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log("WaterPriceListCard received data:", data);

    if (data) {
      if (data.waterPriceWork && Array.isArray(data.waterPriceWork)) {
        setItems(data.waterPriceWork);
      } else if (Array.isArray(data)) {
        setItems(data);
      } else if (data.data && Array.isArray(data.data)) {
        setItems(data.data);
      } else {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [data]);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatToPersianDate = (dateString: string) => {
    if (!dateString) return 'نامشخص';

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <Text>داده‌ای برای نمایش وجود ندارد</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="document-text-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>اطلاعاتی وجود ندارد</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {items.map((item: any, index: number) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.regionContainer}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <Text style={styles.regionText}>
                    منطقه: {item.cityDesc}
                  </Text>
                </View>

                <Ionicons name='ellipsis-vertical' size={16} color="#666" style={{ marginLeft: 15 }} />

                <Ionicons
                  name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#666"
                />
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="git-branch-outline" size={16} color="#666" />
                  <Text style={styles.infoLabel}>مسیر قرائت:</Text>
                  <Text style={styles.infoValue}>
                    {item.readLineCode}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={16} color="#666" />
                  <Text style={styles.infoLabel}>تعداد مشترکین:</Text>
                  <Text style={styles.infoValue}>
                    {item.waterPriceWorkCount}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.infoLabel}>تاریخ شروع:</Text>
                  <Text style={styles.infoValue}>
                    {formatToPersianDate(item.createDateShamsi)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="briefcase-outline" size={16} color="#666" />
                  <Text style={styles.infoLabel}>نوع گردش کار:</Text>
                  <Text style={styles.infoValue}>
                    {item.workKindDesc}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {expandedIndex === index && (
              <View style={styles.expandedSection}>
                <View style={styles.divider} />

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => onDetailsPress?.(item)}
                  >
                    <Text style={styles.detailsButtonText}>بروز رسانی</Text>
                    <Ionicons name="reload-outline" size={16} color="#4a90e2" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => onMapPress?.(item)}
                  >
                    <Text style={styles.detailsButtonText}>نقشه مسیر قرائت</Text>
                    <Ionicons name="map-outline" size={18} color="#4a90e2" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => onContinuePress?.(item)}
                  >
                    <Text style={styles.detailsButtonText}>ادامه</Text>
                    <Ionicons name="caret-back" size={18} color="#4a90e2" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    direction: 'rtl',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  regionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  regionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
    flex: 1,
    fontFamily: 'iransans'
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 11,
    color: '#666',
    marginLeft: 5,
    marginRight: 3,
    fontFamily: 'iransans'
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    fontFamily: 'nazanin'
  },
  expandedSection: {
    padding: 15,
    paddingTop: 0,
    backgroundColor: '#f8f9fa',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  expandedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
    fontFamily: 'nazanin'
  },
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  expandedLabel: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
    marginRight: 5,
    fontFamily: 'nazanin'
  },
  expandedValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  detailsButtonText: {
    marginLeft: 8,
    fontSize: 10,
    color: '#4a90e2',
    fontWeight: '400',
    fontFamily: 'iransans'
  },
  mapButtonText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#4caf50',
    fontWeight: '500',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
});

export default WaterPriceListCard;