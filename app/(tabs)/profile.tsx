import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Button,
  TextInput,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authService from '../../services/authService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GetWaterPriceList } from '../../services/GetWaterPriceList';
import WaterPriceListCard from '../../components/WaterPriceListCard';
import { createTables, saveDataToDatabase, searchByReadLine } from '../../services/db/waterDatabase';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [priceList, setPriceList] = useState<any>(null);
  const [filteredPriceList, setFilteredPriceList] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await authService.getUserData();
      setUserData(data);
      const result = await GetWaterPriceList('0');
      await createTables();
      await saveDataToDatabase(result);
      
      setPriceList(result);
      setFilteredPriceList(result);
      setHasSearched(false);
      setSearch(''); 
      // console.log('Result Water Price List ', result)
    } catch (error) {
      Alert.alert("خطا", "خطا در دریافت اطلاعات");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDetailsPress = (item: any) => {
    console.log("Details pressed for:", item);
  };

  const handleMapPress = (item: any) => {
    setVisible(!visible);
  };

  const handleContinuePress = (item: any) => {
    console.log("Continue pressed for ID:", item.tblWaterPriceWorkId);
    const workId = item.tblWaterPriceWorkId;
    router.push({
      pathname: `/subscriber/${item.tblWaterPriceWorkId}`,
      params: {
        workId: JSON.stringify(workId)
      }
    });
  };

  const handleClearSearch = () => {
    setSearch('');
    setFilteredPriceList(priceList);
    setHasSearched(false);
    Keyboard.dismiss();
  };

  const handleSearchPress = () => {
    Keyboard.dismiss();
    performSearch();
  };

  const handleNotification = () => {
    router.push("/(tabs)/profile")
  }

  const performSearch = async () => {
    const searchValue = search.trim();
    
    if (!searchValue) {
      setFilteredPriceList(priceList);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const cleanSearch = searchValue.replace(/-/g, '');
      const readLineNumber = Number(cleanSearch);
      
      let searchResults: any = null;
      
      if (!isNaN(readLineNumber) && cleanSearch.length > 0) {
        const dbResults = await searchByReadLine(cleanSearch);
        console.log("Search Result ", dbResults)
        
        if (dbResults && dbResults.length > 0) {
          searchResults = dbResults;
        } else {
          searchResults = priceList?.waterPriceWork?.filter((work: any) => {
            const workCode = work.readLineCode?.replace(/-/g, '') || '';
            return workCode.includes(cleanSearch);
          });
        }
      } else {
        searchResults = priceList?.waterPriceWork?.filter((work: any) => {
          const workCode = work.readLineCode?.replace(/-/g, '') || '';
          return workCode.includes(cleanSearch) ||
                 work.readLineDesc?.includes(searchValue) ||
                 work.cityDesc?.includes(searchValue) ||
                 work.zoneDesc?.includes(searchValue);
        });
      }
      
      if (searchResults && searchResults.length > 0) {
        setFilteredPriceList({ 
          ...priceList, 
          waterPriceWork: searchResults 
        });
        setHasSearched(true);
      } else {
        setFilteredPriceList({ 
          ...priceList, 
          waterPriceWork: [] 
        });
        setHasSearched(true);
        Alert.alert('نتیجه جستجو', 'هیچ نتیجه‌ای یافت نشد');
      }
      
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('خطا', 'مشکلی در جستجو پیش آمد');
      setFilteredPriceList(priceList);
      setHasSearched(false);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (search.trim() === '' && hasSearched) {
      setFilteredPriceList(priceList);
      setHasSearched(false);
    }
  }, [search]);

  if (!priceList) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={{ fontFamily: 'iransans', marginTop: 10, color: '#666' }}>
          در حال بارگذاری...
        </Text>
      </View>
    );
  }

  const resultCount = filteredPriceList?.waterPriceWork?.length || 0;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#4a90e2' }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfoBar}>
            <View style={{ flex: 3, justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
              <Text style={styles.gardeshKar}>اطلاعات گردش کار</Text>
              <View style={{ flexDirection: 'row', direction: 'rtl', gap: 10 }}>
                <TouchableOpacity>
                  <Ionicons name='document-sharp' size={20} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name='notifications-sharp' size={20} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNotification}>
                  <Ionicons name='settings-sharp' size={20} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onRefresh}>
                  <Ionicons name='reload-outline' size={20} color={'white'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder='کد اشتراک، کد شناسایی، مسیر قرائت'
              placeholderTextColor={'#999'}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearchPress}
              returnKeyType="search"
              keyboardType="default"
              textAlign="right"
            />
            {search.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={handleClearSearch}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchPress}
            disabled={isSearching}
            activeOpacity={0.7}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color="#4a90e2" />
            ) : (
              <Ionicons name="search" size={20} color="#4a90e2" />
            )}
            <Text style={styles.searchButtonText}>
              {isSearching ? '...' : 'جستجو'}
            </Text>
          </TouchableOpacity>
        </View>

        {hasSearched && (
          <View style={styles.resultInfo}>
            <Text style={styles.resultInfoText}>
              {resultCount > 0 
                ? `${resultCount} نتیجه یافت شد`
                : 'نتیجه‌ای یافت نشد'
              }
            </Text>
          </View>
        )}
      </SafeAreaView>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#4a90e2']}
            tintColor="#4a90e2"
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        {hasSearched && resultCount === 0 ? (
          <View style={styles.noResult}>
            <Ionicons name="search-outline" size={60} color="#ccc" />
            <Text style={styles.noResultText}>
              موردی با این مشخصات پیدا نشد
            </Text>
            <TouchableOpacity 
              style={styles.showAllButton}
              onPress={handleClearSearch}
            >
              <Text style={styles.showAllButtonText}>
                نمایش همه موارد
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WaterPriceListCard
            data={filteredPriceList || priceList}
            onDetailsPress={handleDetailsPress}
            onMapPress={handleMapPress}
            onContinuePress={handleContinuePress}
          />
        )}

        {/* Modal */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modalBox}>
              <View style={styles.centerContainer}>
                <Ionicons name="map-outline" size={50} color="#4a90e2" />
                <Text style={{ fontFamily: 'iransans', marginTop: 10, fontSize: 16 }}>
                  نقشه باز شد
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.closeModalText}>بستن</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a90e2',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  userInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  gardeshKar: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'right',
    fontFamily: 'iransans',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 10,
    paddingBottom: 10,
    alignItems: 'center',
    gap: 8,
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 35,
    height: 47,
    fontFamily: 'iransans',
    textAlign: 'right',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: 13,
    padding: 2,
  },
  searchButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 47,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 90,
  },
  searchButtonText: {
    color: '#4a90e2',
    fontFamily: 'iransans',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultInfo: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#d0e3ff',
  },
  resultInfoText: {
    fontFamily: 'iransans',
    fontSize: 13,
    color: '#4a90e2',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResult: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultText: {
    fontFamily: 'iransans',
    fontSize: 16,
    color: '#999',
    marginTop: 15,
    textAlign: 'center',
  },
  showAllButton: {
    marginTop: 20,
    backgroundColor: '#4a90e2',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  showAllButtonText: {
    color: 'white',
    fontFamily: 'iransans',
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  closeModalButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  closeModalText: {
    color: 'white',
    fontFamily: 'iransans',
    fontSize: 14,
  },
});