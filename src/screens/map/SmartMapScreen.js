import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { destinations } from '../../data/destinations';
import { hotels } from '../../data/hotels';
import { initialBusinesses } from '../../data/businesses';
import { getCurrentUserLocation, DEFAULT_COORDINATES } from '../../utils/locationService';
import { CrowdIndicator } from '../../components/CrowdIndicator';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';
import { formatCurrency, calculateDistance } from '../../utils/helpers';

const { width, height } = Dimensions.get('window');

const mapCategories = [
  { id: 'all', label: 'All Markers', icon: 'map' },
  { id: 'attraction', label: '📍 Attractions', icon: 'location' },
  { id: 'hotel', label: '🏨 Hotels', icon: 'bed' },
  { id: 'food', label: '🍴 Food & Cafes', icon: 'restaurant' },
  { id: 'transport', label: '🚕 Transport', icon: 'car' },
  { id: 'business', label: '🏪 Local Artisans', icon: 'storefront' },
  { id: 'gem', label: '💎 Hidden Gems', icon: 'diamond' },
  { id: 'eco', label: '🌿 Eco-Tourism', icon: 'leaf' },
  { id: 'emergency', label: '🚨 Hospitals & Police', icon: 'shield' },
];

// Compiled markers list around Visakhapatnam and surrounding tourism belts
const allMarkers = [
  {
    id: 'm_rk_beach',
    name: 'RK Beach & Promenade',
    category: 'attraction',
    subCategory: 'Beach Viewpoint',
    crowdLevel: 'high',
    ecoScore: 84,
    coords: { latitude: 17.7120, longitude: 83.3240 },
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    description: 'Iconic golden shoreline with memorial parks and coastal street food.',
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
    description: 'Decommissioned submarine preserved on beach sands with guided naval tours.',
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
    name: 'Andhra Ruchulu Organic Coastal Dining',
    category: 'food',
    subCategory: 'Authentic Seafood & Thali',
    crowdLevel: 'moderate',
    ecoScore: 88,
    coords: { latitude: 17.7200, longitude: 83.3150 },
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80',
    description: 'Traditional banana leaf meals and fresh coastal seafood curry.',
    fee: 350,
    openHours: '11:30 AM - 10:30 PM',
  },
  {
    id: 'm_ev_hub',
    name: 'Beach Road EV Shuttle Hub & Rental',
    category: 'transport',
    subCategory: 'Electric Transit',
    crowdLevel: 'low',
    ecoScore: 96,
    coords: { latitude: 17.7100, longitude: 83.3200 },
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
    description: 'Zero emission e-auto station and hop-on electric tourist shuttle.',
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
    name: 'Kailasagiri Eco-Park & Ropeway',
    category: 'eco',
    subCategory: 'Hilltop Biodiversity',
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
    name: 'King George Government Hospital & Trauma',
    category: 'emergency',
    subCategory: '24/7 Emergency Care',
    crowdLevel: 'moderate',
    ecoScore: 80,
    coords: { latitude: 17.7080, longitude: 83.3050 },
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
    description: '24-hour emergency hospital with trauma center and tourist medical assistance.',
    fee: 0,
    openHours: '24/7 Emergency Helpline 108',
  },
  {
    id: 'm_police_tourist',
    name: 'Beach Road Tourist Police Assistance Booth',
    category: 'emergency',
    subCategory: 'Police & Safety',
    crowdLevel: 'low',
    ecoScore: 85,
    coords: { latitude: 17.7140, longitude: 83.3220 },
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
    description: 'Dedicated English/Hindi/Telugu tourist safety police desk.',
    fee: 0,
    openHours: '24/7 Helpline 112',
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
    setLocationStatus(res.success ? '📍 GPS Active (Visakhapatnam)' : '📍 Demo Location (Vizag Coast)');
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
        return { name: 'car', color: '#7C3AED', bg: '#F5F3FF' };
      case 'business':
        return { name: 'storefront', color: '#DB2777', bg: '#FDF2F8' };
      case 'gem':
        return { name: 'diamond', color: '#0891B2', bg: '#ECFEFF' };
      case 'eco':
        return { name: 'leaf', color: '#059669', bg: '#ECFDF5' };
      case 'emergency':
        return { name: 'shield', color: '#DC2626', bg: '#FEE2E2' };
      default:
        return { name: 'pin', color: '#0F172A', bg: '#F1F5F9' };
    }
  };

  const handleDirections = (marker) => {
    const dist = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      marker.coords.latitude,
      marker.coords.longitude
    );
    Alert.alert(
      `Navigation to ${marker.name}`,
      `Distance: ${dist || 1.2} km\nEstimated E-Auto time: 8 mins\nWalking time: 18 mins\nCarbon emission saved via EV: 0.8 kg CO₂ 🌱`,
      [{ text: 'Start Turn-by-Turn', onPress: () => Alert.alert('Navigation Active', 'Simulating turn-by-turn route along Beach Road.') }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Controls Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.topInfo}>
          <Text style={[styles.mapTitle, { color: theme.text }]}>Smart Tourism Map</Text>
          <Text style={[styles.locationStatus, { color: theme.primary }]}>{locationStatus}</Text>
        </View>
        <TouchableOpacity
          onPress={fetchLiveLocation}
          style={[styles.gpsBtn, { backgroundColor: theme.primaryLight }]}
        >
          <Ionicons name="locate" size={18} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Chips Scroll */}
      <View style={[styles.filterBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {mapCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.cardSecondary,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
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

      {/* Interactive Map View Simulation */}
      <View style={[styles.mapCanvas, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#E0F2FE' }]}>
        {/* Visual Map Grid & Coastline Elements */}
        <View style={styles.coastlineOverlay}>
          <View style={[styles.seaZone, { backgroundColor: theme.mode === 'dark' ? '#070D18' : '#BAE6FD' }]}>
            <Text style={[styles.seaLabel, { color: theme.mode === 'dark' ? '#334155' : '#7DD3FC' }]}>
              🌊 Bay of Bengal (East Coastline)
            </Text>
          </View>
          <View style={styles.beachRoadLine}>
            <Text style={styles.roadLabel}>────── Beach Road Corridor (EV Lane) ──────</Text>
          </View>
        </View>

        {/* Dynamic Interactive Pinpoints Canvas */}
        <ScrollView contentContainerStyle={styles.pinsCanvas} showsVerticalScrollIndicator={false}>
          <View style={styles.pinsGrid}>
            {filteredMarkers.map((marker) => {
              const iconInfo = getMarkerIcon(marker.category);
              const isSelected = selectedMarker?.id === marker.id;
              return (
                <TouchableOpacity
                  key={marker.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedMarker(marker)}
                  style={[
                    styles.markerPin,
                    {
                      backgroundColor: isSelected ? iconInfo.color : iconInfo.bg,
                      borderColor: iconInfo.color,
                      transform: [{ scale: isSelected ? 1.15 : 1 }],
                      shadowColor: iconInfo.color,
                    },
                  ]}
                >
                  <Ionicons
                    name={iconInfo.name}
                    size={16}
                    color={isSelected ? '#FFFFFF' : iconInfo.color}
                  />
                  <Text
                    style={[
                      styles.pinLabel,
                      {
                        color: isSelected ? '#FFFFFF' : theme.text,
                        fontWeight: isSelected ? '800' : '600',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {marker.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* User GPS Pulse Point */}
        <View style={styles.userPulse}>
          <View style={styles.userDot} />
          <Text style={styles.userLabel}>You Are Here</Text>
        </View>
      </View>

      {/* Selected Marker Bottom Information Card */}
      {selectedMarker && (
        <View style={[styles.bottomCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Image source={{ uri: selectedMarker.image }} style={styles.cardThumb} />
            <View style={{ flex: 1 }}>
              <View style={styles.cardTitleRow}>
                <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
                  {selectedMarker.name}
                </Text>
              </View>
              <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
                {selectedMarker.subCategory} • {selectedMarker.openHours}
              </Text>

              <View style={styles.cardBadges}>
                <CrowdIndicator level={selectedMarker.crowdLevel} compact />
                <EcoScoreBadge score={selectedMarker.ecoScore} size="small" showLabel={false} />
              </View>
            </View>
          </View>

          <Text style={[styles.cardDesc, { color: theme.textSecondary }]} numberOfLines={2}>
            {selectedMarker.description}
          </Text>

          <View style={styles.cardFooter}>
            <View>
              <Text style={[styles.feeLabel, { color: theme.textMuted }]}>Entry / Fare</Text>
              <Text style={[styles.feeValue, { color: theme.primary }]}>
                {selectedMarker.fee === 0 ? 'Free' : formatCurrency(selectedMarker.fee)}
              </Text>
            </View>

            <View style={styles.btnGroup}>
              <Button
                title="Directions"
                variant="primary"
                size="small"
                icon="navigate-outline"
                onPress={() => handleDirections(selectedMarker)}
                style={styles.actionBtn}
              />
              <Button
                title="Details"
                variant="outline"
                size="small"
                onPress={() => {
                  if (selectedMarker.category === 'hotel') {
                    navigation.navigate('Hotels');
                  } else if (selectedMarker.category === 'business') {
                    navigation.navigate('LocalBusiness');
                  } else {
                    navigation.navigate('Explore');
                  }
                }}
                style={styles.actionBtn}
              />
            </View>
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
  topInfo: {
    flex: 1,
  },
  mapTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  locationStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  gpsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBar: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  chipsScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  coastlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  seaZone: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#38BDF8',
  },
  seaLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  beachRoadLine: {
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  roadLabel: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '700',
  },
  pinsCanvas: {
    padding: 16,
    minHeight: '100%',
  },
  pinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 80,
  },
  markerPin: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginVertical: 4,
  },
  pinLabel: {
    fontSize: 11,
  },
  userPulse: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  userDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38BDF8',
  },
  userLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomCard: {
    borderTopWidth: 1,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  cardThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  cardSub: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 4,
  },
  cardBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  feeLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  feeValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    minWidth: 100,
  },
});
