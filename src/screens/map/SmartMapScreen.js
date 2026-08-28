import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getCurrentUserLocation, DEFAULT_COORDINATES } from '../../utils/locationService';
import { CrowdIndicator } from '../../components/CrowdIndicator';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';
import { formatCurrency, calculateDistance } from '../../utils/helpers';

const { width } = Dimensions.get('window');

const mapCategories = [
  { id: 'all', label: 'All Markers', icon: 'map-outline' },
  { id: 'attraction', label: 'Attractions', icon: 'location-outline' },
  { id: 'hotel', label: 'Hotels', icon: 'bed-outline' },
  { id: 'food', label: 'Dining', icon: 'restaurant-outline' },
  { id: 'transport', label: 'Transit', icon: 'train-outline' },
  { id: 'business', label: 'Artisans', icon: 'storefront-outline' },
  { id: 'gem', label: 'Hidden Gems', icon: 'compass-outline' },
  { id: 'eco', label: 'Eco-Tourism', icon: 'leaf-outline' },
  { id: 'emergency', label: 'Emergency Care', icon: 'shield-outline' },
];

const allMarkers = [
  {
    id: 'm_amer_fort',
    name: 'Amer Fort',
    category: 'attraction',
    subCategory: 'UNESCO World Heritage',
    crowdLevel: 'moderate',
    ecoScore: 92,
    coords: { latitude: 26.9855, longitude: 75.8513 },
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80',
    description: 'A historic hilltop fort known for its grand courtyards, architecture and views.',
    fee: 200,
    openHours: '08:00 AM - 05:30 PM',
  },
  {
    id: 'm_hawa_mahal',
    name: 'Hawa Mahal',
    category: 'attraction',
    subCategory: 'Palace of Winds',
    crowdLevel: 'high',
    ecoScore: 90,
    coords: { latitude: 26.9239, longitude: 75.8267 },
    image: 'https://images.unsplash.com/photo-1603289984181-42b781e64030?auto=format&fit=crop&w=400&q=80',
    description: 'Iconic five-story pink sandstone palace with 953 ornate honeycomb jharokhas.',
    fee: 50,
    openHours: '09:00 AM - 05:00 PM',
  },
  {
    id: 'm_rk_beach',
    name: 'RK Beach & Promenade',
    category: 'attraction',
    subCategory: 'Beach Viewpoint',
    crowdLevel: 'high',
    ecoScore: 84,
    coords: { latitude: 17.7120, longitude: 83.3240 },
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    description: 'Iconic golden shoreline with memorial parks and coastal promenade.',
    fee: 0,
    openHours: 'Open 24/7',
  },
  {
    id: 'm_submarine',
    name: 'INS Kursura Submarine Museum',
    category: 'attraction',
    subCategory: 'Naval Museum',
    crowdLevel: 'moderate',
    ecoScore: 90,
    coords: { latitude: 17.7180, longitude: 83.3320 },
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=400&q=80',
    description: 'Decommissioned naval submarine preserved on beach sands with guided tours.',
    fee: 70,
    openHours: '02:00 PM - 08:30 PM',
  },
  {
    id: 'm_hotel_bay',
    name: 'Bay Breeze Eco-Luxury Resort',
    category: 'hotel',
    subCategory: 'Solar Eco Resort',
    crowdLevel: 'low',
    ecoScore: 92,
    coords: { latitude: 17.7150, longitude: 83.3280 },
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
    description: '100% Solar-powered beachfront resort with organic zero-plastic dining.',
    fee: 4200,
    openHours: '24/7 Front Desk',
  },
  {
    id: 'm_craft_guild',
    name: 'Etikoppaka Lacquer Craft Artisans',
    category: 'business',
    subCategory: 'Local Handicrafts',
    crowdLevel: 'low',
    ecoScore: 98,
    coords: { latitude: 17.7050, longitude: 83.3100 },
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    description: 'Certified master wood-turners carving chemical-free vegetable lacquer toys.',
    fee: 200,
    openHours: '10:00 AM - 07:00 PM',
  },
  {
    id: 'm_food_andhra',
    name: 'Andhra Ruchulu Organic Dining',
    category: 'food',
    subCategory: 'Regional Coastal Cuisine',
    crowdLevel: 'moderate',
    ecoScore: 88,
    coords: { latitude: 17.7200, longitude: 83.3150 },
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80',
    description: 'Traditional banana leaf meals and fresh coastal seasonal curries.',
    fee: 350,
    openHours: '11:30 AM - 10:30 PM',
  },
  {
    id: 'm_ev_hub',
    name: 'Beach Road EV Shuttle Hub',
    category: 'transport',
    subCategory: 'Electric Transit',
    crowdLevel: 'low',
    ecoScore: 96,
    coords: { latitude: 17.7100, longitude: 83.3200 },
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
    description: 'Zero emission electric transit station and hop-on electric tourist shuttle.',
    fee: 20,
    openHours: '06:00 AM - 10:00 PM',
  },
  {
    id: 'm_yarada_gem',
    name: 'Yarada Secluded Golden Coast',
    category: 'gem',
    subCategory: 'Hidden Coastal Gem',
    crowdLevel: 'low',
    ecoScore: 94,
    coords: { latitude: 17.6540, longitude: 83.2700 },
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
    description: 'Peaceful alternative to crowded city beaches, flanked by dolphin hills.',
    fee: 0,
    openHours: 'Open 24/7',
  },
  {
    id: 'm_kailasagiri_eco',
    name: 'Kailasagiri Hilltop Eco-Park',
    category: 'eco',
    subCategory: 'Biodiversity Reserve',
    crowdLevel: 'moderate',
    ecoScore: 92,
    coords: { latitude: 17.7490, longitude: 83.3420 },
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80',
    description: 'Hilltop garden featuring panoramic sea views, solar tram, and floral clock.',
    fee: 150,
    openHours: '06:00 AM - 08:00 PM',
  },
  {
    id: 'm_hospital_care',
    name: 'Government Hospital & Emergency',
    category: 'emergency',
    subCategory: '24/7 Medical Care',
    crowdLevel: 'moderate',
    ecoScore: 80,
    coords: { latitude: 17.7080, longitude: 83.3050 },
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
    description: '24-hour emergency hospital with trauma center and tourist assistance.',
    fee: 0,
    openHours: 'Emergency Helpline 108',
  },
  {
    id: 'm_police_tourist',
    name: 'Tourist Police Assistance Desk',
    category: 'emergency',
    subCategory: 'Safety & Assistance',
    crowdLevel: 'low',
    ecoScore: 85,
    coords: { latitude: 17.7140, longitude: 83.3220 },
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
    description: 'Dedicated multilingual tourist safety police assistance desk.',
    fee: 0,
    openHours: 'Helpline 112',
  },
];

export const SmartMapScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState(allMarkers[0]);
  const [userLocation, setUserLocation] = useState(DEFAULT_COORDINATES);
  const [locationStatus, setLocationStatus] = useState('Locating...');

  useEffect(() => {
    fetchLiveLocation();
  }, []);

  const fetchLiveLocation = async () => {
    const res = await getCurrentUserLocation();
    setUserLocation(res.coords);
    setLocationStatus(res.success ? 'GPS Connected' : 'Demo Location');
  };

  const filteredMarkers = allMarkers.filter((m) => {
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  const getMarkerIcon = (category) => {
    switch (category) {
      case 'attraction':
        return { name: 'location', color: '#0D9488', bg: '#CCFBF1' };
      case 'hotel':
        return { name: 'bed', color: '#2563EB', bg: '#EFF6FF' };
      case 'food':
        return { name: 'restaurant', color: '#D97706', bg: '#FEF3C7' };
      case 'transport':
        return { name: 'train', color: '#16A34A', bg: '#DCFCE7' };
      case 'business':
        return { name: 'storefront', color: '#9333EA', bg: '#F3E8FF' };
      case 'gem':
        return { name: 'compass', color: '#059669', bg: '#D1FAE5' };
      case 'eco':
        return { name: 'leaf', color: '#15803D', bg: '#BBF7D0' };
      case 'emergency':
        return { name: 'shield', color: '#DC2626', bg: '#FEE2E2' };
      default:
        return { name: 'pin', color: theme.primary, bg: theme.primaryLight };
    }
  };

  const distFromUser = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    selectedMarker.coords.latitude,
    selectedMarker.coords.longitude
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Map Header */}
      <View style={[styles.topBar, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={[styles.topTitle, { color: theme.text }]}>Smart Tourism Map</Text>
          <Text style={[styles.locationStatus, { color: theme.primary }]}>
            {locationStatus}
          </Text>
        </View>
        <TouchableOpacity onPress={fetchLiveLocation} style={[styles.locateBtn, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="navigate-outline" size={18} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Scroll Filter */}
      <View style={[styles.filterBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {mapCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.cardSecondary,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={isSelected ? '#FFFFFF' : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Interactive Simulated Map Canvas */}
      <View style={[styles.mapCanvas, { backgroundColor: '#E2E8F0' }]}>
        {/* Decorative Grid Lines */}
        <View style={styles.mapGridPattern} />

        {/* User Location Marker */}
        <View style={[styles.userDotRing, { top: '48%', left: '50%' }]}>
          <View style={styles.userDotCenter} />
        </View>

        {/* Pin Markers */}
        {filteredMarkers.map((marker, index) => {
          const isSelected = selectedMarker.id === marker.id;
          const iconConf = getMarkerIcon(marker.category);

          const topPercent = 20 + ((index * 23) % 60);
          const leftPercent = 15 + ((index * 31) % 70);

          return (
            <TouchableOpacity
              key={marker.id}
              activeOpacity={0.8}
              onPress={() => setSelectedMarker(marker)}
              style={[
                styles.mapMarker,
                {
                  top: `${topPercent}%`,
                  left: `${leftPercent}%`,
                  zIndex: isSelected ? 99 : 10,
                },
              ]}
            >
              <View
                style={[
                  styles.markerPin,
                  {
                    backgroundColor: isSelected ? theme.primary : iconConf.bg,
                    borderColor: isSelected ? '#FFFFFF' : iconConf.color,
                    transform: [{ scale: isSelected ? 1.25 : 1 }],
                  },
                ]}
              >
                <Ionicons
                  name={iconConf.name}
                  size={isSelected ? 16 : 14}
                  color={isSelected ? '#FFFFFF' : iconConf.color}
                />
              </View>
              {isSelected && (
                <View style={[styles.markerCallout, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
                  <Text style={[styles.calloutText, { color: theme.text }]} numberOfLines={1}>
                    {marker.name}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom Selected Marker Sheet */}
      {selectedMarker && (
        <View style={[styles.markerSheet, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetContent}>
            <Image source={{ uri: selectedMarker.image }} style={styles.sheetImage} resizeMode="cover" />

            <View style={styles.sheetInfo}>
              <View style={styles.sheetTitleRow}>
                <Text style={[styles.sheetName, { color: theme.text }]} numberOfLines={1}>
                  {selectedMarker.name}
                </Text>
              </View>

              <Text style={[styles.sheetSubCat, { color: theme.textSecondary }]}>
                {selectedMarker.subCategory} · {distFromUser} km away
              </Text>

              <View style={styles.sheetBadges}>
                <CrowdIndicator level={selectedMarker.crowdLevel} compact />
                <EcoScoreBadge score={selectedMarker.ecoScore} size="small" />
              </View>

              <Text style={[styles.sheetHours, { color: theme.textMuted }]}>
                {selectedMarker.openHours}
              </Text>
            </View>
          </View>

          <View style={styles.sheetActions}>
            <Button
              title="Directions"
              variant="outline"
              size="small"
              icon="navigate-outline"
              onPress={() => Alert.alert('Routing Active', `Navigating to ${selectedMarker.name}.`)}
              style={styles.sheetBtn}
            />
            <Button
              title="Add to Itinerary"
              variant="primary"
              size="small"
              icon="add-outline"
              onPress={() => Alert.alert('Added', `${selectedMarker.name} added to your active travel plan.`)}
              style={styles.sheetBtn}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconBtn: {
    padding: 6,
  },
  titleWrap: {
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  locationStatus: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
    marginTop: 1,
  },
  locateBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBar: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapGridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  userDotRing: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -11,
    marginTop: -11,
  },
  userDotCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -15,
    marginTop: -15,
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  markerCallout: {
    position: 'absolute',
    bottom: 36,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    minWidth: 90,
    alignItems: 'center',
  },
  calloutText: {
    fontSize: 10.5,
    fontFamily: 'Manrope_700Bold',
  },
  markerSheet: {
    padding: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginBottom: 10,
  },
  sheetContent: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  sheetImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },
  sheetInfo: {
    flex: 1,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sheetName: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    flex: 1,
  },
  sheetSubCat: {
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
    marginBottom: 6,
  },
  sheetBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sheetHours: {
    fontSize: 10.5,
    fontFamily: 'Manrope_400Regular',
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 10,
  },
  sheetBtn: {
    flex: 1,
  },
});
