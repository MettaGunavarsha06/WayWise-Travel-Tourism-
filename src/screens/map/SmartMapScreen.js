import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  TextInput,
  Modal,
  Linking,
  ActivityIndicator,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTrips } from '../../context/TripContext';
import {
  requestAndGetUserLocation,
  checkLocationPermission,
  DEFAULT_COORDINATES,
  PRESET_CITIES,
} from '../../utils/locationService';
import {
  PLACE_CATEGORIES,
  SUB_CATEGORY_SYMBOLS,
  getPlacesAroundLocation,
} from '../../utils/placesEngine';
import { RealLeafletMap } from '../../components/RealLeafletMap';
import { CrowdIndicator } from '../../components/CrowdIndicator';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';
import { SavedToast } from '../../components/SavedToast';
import { formatCurrency } from '../../utils/helpers';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.84;

const RADIUS_OPTIONS = [
  { label: 'All', value: 30 },
  { label: '1 km', value: 1.5 },
  { label: '3 km', value: 3.5 },
  { label: '5 km', value: 5.5 },
  { label: '10 km', value: 10.5 },
];

const MAP_LAYERS = [
  { id: 'standard', label: 'Street', icon: 'map-outline' },
  { id: 'satellite', label: 'Satellite', icon: 'earth-outline' },
  { id: 'dark', label: 'Dark Neon', icon: 'moon-outline' },
  { id: 'terrain', label: 'Terrain', icon: 'triangle-outline' },
];

const TRAVEL_MODES = [
  { id: 'driving', label: 'Drive', icon: 'car-outline', speedMultiplier: 1 },
  { id: 'motorcycle', label: 'Bike', icon: 'bicycle-outline', speedMultiplier: 0.8 },
  { id: 'walking', label: 'Walk', icon: 'walk-outline', speedMultiplier: 3.8 },
  { id: 'transit', label: 'Transit', icon: 'train-outline', speedMultiplier: 1.4 },
];

export const SmartMapScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const { toggleSavePlace, isPlaceSaved } = useTrips?.() || {};
  const carouselRef = useRef(null);
  const mapRef = useRef(null);
  const insets = useSafeAreaInsets();
  const tabBarHeight = (insets.bottom > 0 ? insets.bottom + 8 : 18) + 64;

  const getCategoryLabel = (catId, defaultLabel) => {
    switch (catId) {
      case 'all': return t('allPlaces') || defaultLabel;
      case 'famous': return t('famousPlaces') || defaultLabel;
      case 'hospital': return t('hospitals') || defaultLabel;
      case 'restaurant': return t('restaurants') || defaultLabel;
      case 'hotel': return t('ecoStays') || defaultLabel;
      case 'artisan': return t('artisans') || defaultLabel;
      case 'transit': return t('transitEV') || defaultLabel;
      case 'emergency': return t('emergencyPolice') || defaultLabel;
      default: return defaultLabel;
    }
  };
  
  // Location States
  const [userCoords, setUserCoords] = useState(DEFAULT_COORDINATES);
  const [cityName, setCityName] = useState('Visakhapatnam (Demo)');
  const [gpsStatus, setGpsStatus] = useState('demo'); // 'loading' | 'live' | 'denied' | 'demo'
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Filter & Search States: Defaults to 'famous' so opening map immediately shows all famous places!
  const initialCategory = route?.params?.category || route?.params?.initialCategory || 'famous';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(30);
  const [mapLayer, setMapLayer] = useState('standard');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'

  // Selection, Google Maps Navigation & Saved Toast States
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [navigationActive, setNavigationActive] = useState(false);
  const [travelMode, setTravelMode] = useState('driving');
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [carouselCollapsed, setCarouselCollapsed] = useState(false);

  // Compute Places around user coordinates
  const { places, allPlaces, categoryCounts } = useMemo(() => {
    return getPlacesAroundLocation(userCoords, selectedCategory, selectedRadius, searchQuery);
  }, [userCoords, selectedCategory, selectedRadius, searchQuery]);

  // Initial check & auto-select first place
  useEffect(() => {
    checkInitialPermissions();
  }, []);

  // When category or places change, auto-select first place and scroll carousel to start
  useEffect(() => {
    if (places && places.length > 0) {
      if (!selectedPlace || !places.some((p) => p.id === selectedPlace.id)) {
        setSelectedPlace(places[0]);
      }
      if (carouselRef.current && carouselRef.current.scrollToOffset) {
        carouselRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    } else {
      setSelectedPlace(null);
    }
  }, [places, selectedCategory]);

  const checkInitialPermissions = async () => {
    const { granted } = await checkLocationPermission();
    setPermissionGranted(granted);
    if (granted) {
      handleRequestLocation();
    }
  };

  // Location Permission Request Action
  const handleRequestLocation = async () => {
    setIsLocating(true);
    setGpsStatus('loading');
    
    const result = await requestAndGetUserLocation();
    setIsLocating(false);

    if (result.success && !result.isDemo) {
      setUserCoords(result.coords);
      setCityName(result.cityName || 'Live GPS Location');
      setGpsStatus('live');
      setPermissionGranted(true);
    } else if (result.permissionDenied) {
      setGpsStatus('denied');
      setPermissionGranted(false);
      Alert.alert(
        'Location Permission Needed',
        'Location access helps locate authentic restaurants, hospitals, and sights right around you. You can enable GPS anytime or select a city below.',
        [
          { text: 'Choose City', onPress: () => setShowCityPicker(true) },
          { text: 'OK', style: 'cancel' },
        ]
      );
    } else {
      setGpsStatus('demo');
      setCityName(DEFAULT_COORDINATES.city);
    }
  };

  const handleSelectPresetCity = (city) => {
    setUserCoords({
      latitude: city.latitude,
      longitude: city.longitude,
    });
    setCityName(`${city.name}`);
    setGpsStatus('demo');
    setShowCityPicker(false);
    setNavigationActive(false);
  };

  const handleCallEmergency = (phone) => {
    if (!phone) {
      Alert.alert('Emergency Helpline', 'Connecting to National Emergency 112 / 108.');
      return;
    }
    const cleanNumber = phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert('Helpline', `Please dial: ${phone}`);
    });
  };

  // Google Maps Turn-by-Turn Navigation Activation
  const handleStartNavigation = (place) => {
    setSelectedPlace(place);
    setNavigationActive(true);
    setViewMode('map');
  };

  // Open native Google Maps app or web
  const handleOpenGoogleMapsApp = (place) => {
    if (!place) return;
    const originLat = userCoords.latitude;
    const originLng = userCoords.longitude;
    const destLat = place.coords.latitude;
    const destLng = place.coords.longitude;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=${travelMode}`;
    
    Linking.openURL(googleMapsUrl).catch(() => {
      Alert.alert('Google Maps', `Could not open Google Maps app. Opening browser link instead: ${googleMapsUrl}`);
    });
  };

  // Calculate dynamic ETA for selected travel mode
  const currentDurationMins = useMemo(() => {
    if (!selectedPlace) return 10;
    const baseDrive = selectedPlace.driveMinutes || Math.max(2, Math.round(selectedPlace.distanceKm * 2.8));
    if (travelMode === 'walking') return Math.max(3, Math.round(selectedPlace.distanceKm * 12));
    if (travelMode === 'motorcycle') return Math.max(1, Math.round(baseDrive * 0.8));
    if (travelMode === 'transit') return Math.max(5, Math.round(baseDrive * 1.5));
    return baseDrive;
  }, [selectedPlace, travelMode]);

  // Calculate ETA arrival time
  const etaClockTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + currentDurationMins);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [currentDurationMins]);

  // Generate realistic Turn-by-Turn step directions
  const turnSteps = useMemo(() => {
    if (!selectedPlace) return [];
    const dist = selectedPlace.distanceKm || 1.2;
    return [
      {
        id: 'step_1',
        instruction: `Head northeast from current location`,
        distance: `${Math.round(dist * 200)} m`,
        icon: 'navigate',
      },
      {
        id: 'step_2',
        instruction: `Turn right onto Main Coastal Arterial Highway`,
        distance: `${(dist * 0.4).toFixed(1)} km`,
        icon: 'arrow-redo',
      },
      {
        id: 'step_3',
        instruction: `Continue straight past landmark junction towards ${selectedPlace.subCategory}`,
        distance: `${(dist * 0.35).toFixed(1)} km`,
        icon: 'arrow-up',
      },
      {
        id: 'step_4',
        instruction: `Slight left onto destination approach road`,
        distance: `${Math.round(dist * 150)} m`,
        icon: 'arrow-undo',
      },
      {
        id: 'step_5',
        instruction: `Arrive at ${selectedPlace.name} on the right`,
        distance: 'Destination reached 🏁',
        icon: 'flag',
      },
    ];
  }, [selectedPlace]);

  // Dynamic category title & banner info
  const categoryHeaderInfo = useMemo(() => {
    const currentCatObj = PLACE_CATEGORIES.find((c) => c.id === selectedCategory) || PLACE_CATEGORIES[0];
    switch (selectedCategory) {
      case 'famous':
        return {
          title: `🏛️ Famous Places & Sights (${places.length} nearby)`,
          subtitle: 'Swipe cards below to view all monuments & viewpoints',
          color: '#0D9488',
          bg: '#CCFBF1',
          icon: 'compass',
        };
      case 'hospital':
        return {
          title: `🏥 Hospitals & Emergency Care (${places.length} nearby)`,
          subtitle: 'Swipe cards below for 24/7 trauma centers & helplines',
          color: '#DC2626',
          bg: '#FEE2E2',
          icon: 'medkit',
        };
      case 'restaurant':
        return {
          title: `🍽️ Restaurants & Dining (${places.length} nearby)`,
          subtitle: 'Swipe cards below for authentic coastal dining & thalis',
          color: '#EA580C',
          bg: '#FFEDD5',
          icon: 'restaurant',
        };
      case 'hotel':
        return {
          title: `🏨 Hotels & Eco-Stays (${places.length} nearby)`,
          subtitle: 'Swipe cards below for verified resorts & beach villas',
          color: '#2563EB',
          bg: '#EFF6FF',
          icon: 'bed',
        };
      case 'artisan':
        return {
          title: `🎨 Artisans & Handicrafts (${places.length} nearby)`,
          subtitle: 'Swipe cards below for lacquer wood & silk weaving',
          color: '#9333EA',
          bg: '#F3E8FF',
          icon: 'color-palette',
        };
      case 'transit':
        return {
          title: `🚆 Transit & Clean EV Hubs (${places.length} nearby)`,
          subtitle: 'Swipe cards below for electric shuttles & charging',
          color: '#16A34A',
          bg: '#DCFCE7',
          icon: 'train',
        };
      case 'emergency':
        return {
          title: `👮 Police & Safety Patrols (${places.length} nearby)`,
          subtitle: 'Swipe cards below for tourist police & safety helpdesks',
          color: '#1E293B',
          bg: '#F1F5F9',
          icon: 'shield-checkmark',
        };
      default:
        return {
          title: `📍 All Nearby Places (${places.length} total)`,
          subtitle: `Showing all places within ${selectedRadius} km`,
          color: theme.primary,
          bg: theme.primaryLight,
          icon: 'map',
        };
    }
  }, [selectedCategory, places.length, selectedRadius, theme]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Bar (Hidden during full-screen Google Maps Navigation for max immersion) */}
      {!navigationActive && (
        <View style={[styles.topBar, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowCityPicker(true)} style={styles.cityTitleWrap} activeOpacity={0.7}>
            <View style={styles.cityRow}>
              <Ionicons
                name={gpsStatus === 'live' ? 'navigate-circle' : 'location-sharp'}
                size={16}
                color={gpsStatus === 'live' ? '#16A34A' : theme.primary}
              />
              <Text style={[styles.cityText, { color: theme.text }]} numberOfLines={1}>
                {cityName}
              </Text>
              <Ionicons name="chevron-down" size={14} color={theme.textSecondary} />
            </View>

            <View style={styles.statusBadgeRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: gpsStatus === 'live' ? '#16A34A' : gpsStatus === 'loading' ? '#EAB308' : '#3B82F6' },
                ]}
              />
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                {gpsStatus === 'live'
                  ? '🟢 Live GPS Connected'
                  : gpsStatus === 'loading'
                  ? '🟡 Locating GPS...'
                  : gpsStatus === 'denied'
                  ? '🔴 GPS Denied (Demo Mode)'
                  : '🔵 Demo Location'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* View Mode & Locate Action */}
          <View style={styles.topRightActions}>
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
              style={[styles.actionBtn, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
            >
              <Ionicons name={viewMode === 'map' ? 'list-outline' : 'map-outline'} size={18} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRequestLocation}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: gpsStatus === 'live' ? '#DCFCE7' : theme.primaryLight,
                  borderColor: gpsStatus === 'live' ? '#16A34A' : theme.primary,
                },
              ]}
            >
              {isLocating ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <Ionicons
                  name={gpsStatus === 'live' ? 'locate' : 'navigate-outline'}
                  size={18}
                  color={gpsStatus === 'live' ? '#16A34A' : theme.primary}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Google Maps Turn-by-Turn Top Navigation Banner (Active when navigating) */}
      {navigationActive && selectedPlace && (
        <View style={styles.gmapsTopHeader}>
          <View style={styles.gmapsTopContent}>
            <View style={styles.gmapsManeuverCircle}>
              <Ionicons name="arrow-redo" size={26} color="#FFFFFF" />
            </View>
            <View style={styles.gmapsInstructionWrap}>
              <Text style={styles.gmapsDistanceNext}>In 250 m</Text>
              <Text style={styles.gmapsManeuverText} numberOfLines={1}>
                Turn right onto Coastal Highway
              </Text>
              <Text style={styles.gmapsTowardText} numberOfLines={1}>
                towards {selectedPlace.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsVoiceMuted(!isVoiceMuted)}
              style={styles.gmapsVoiceBtn}
            >
              <Ionicons
                name={isVoiceMuted ? 'volume-mute-outline' : 'volume-high-outline'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Permission Request Banner (when not navigating & not granted) */}
      {!navigationActive && !permissionGranted && gpsStatus !== 'loading' && (
        <View style={[styles.permissionBanner, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
          <View style={styles.permissionIconCircle}>
            <Ionicons name="location-outline" size={18} color="#2563EB" />
          </View>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionTitle}>Enable Live GPS Access</Text>
            <Text style={styles.permissionDesc}>
              Discover authentic dining, emergency hospitals & top sights right around your live location.
            </Text>
          </View>
          <TouchableOpacity onPress={handleRequestLocation} style={styles.permissionGrantBtn}>
            <Text style={styles.permissionGrantText}>Grant GPS</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Bar & Radius Filter (Hidden during navigation) */}
      {!navigationActive && (
        <View style={[styles.searchSection, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <View style={[styles.searchBox, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
            <Ionicons name="search-outline" size={16} color={theme.textSecondary} />
            <TextInput
              placeholder={t('searchPlaceholder') || 'Search restaurants, hospitals, forts, cafes...'}
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchInput, { color: theme.text }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Radius Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.radiusRow}>
            <Text style={[styles.radiusLabel, { color: theme.textSecondary }]}>Radius:</Text>
            {RADIUS_OPTIONS.map((r) => {
              const isSelected = selectedRadius === r.value;
              return (
                <TouchableOpacity
                  key={r.label}
                  onPress={() => setSelectedRadius(r.value)}
                  style={[
                    styles.radiusChip,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.cardSecondary,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.radiusChipText,
                      { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Category Filter Chips with Unique Icons & Counts (Famous Places, Hospitals, Restaurants, Hotels, etc.) */}
      {!navigationActive && (
        <View style={[styles.categoriesBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {PLACE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: isSelected ? cat.color : theme.cardSecondary,
                      borderColor: isSelected ? cat.color : theme.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={cat.icon}
                    size={15}
                    color={isSelected ? '#FFFFFF' : cat.color}
                  />
                  <Text
                    style={[
                      styles.catChipText,
                      { color: isSelected ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {getCategoryLabel(cat.id, cat.label)}
                  </Text>
                  <View
                    style={[
                      styles.countBadge,
                      {
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : cat.bg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.countBadgeText,
                        { color: isSelected ? '#FFFFFF' : cat.color },
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Main Map View or List View */}
      {viewMode === 'map' ? (
        <View style={styles.mapArea}>
          {/* Real Leaflet Map Engine with Category Filtering & Route */}
          <RealLeafletMap
            ref={mapRef}
            userLocation={userCoords}
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={(place) => {
              setSelectedPlace(place);
              // Auto-scroll carousel to selected place index
              const idx = places.findIndex((p) => p.id === place.id);
              if (idx !== -1 && carouselRef.current && carouselRef.current.scrollToIndex) {
                try {
                  carouselRef.current.scrollToIndex({ index: idx, animated: true, viewPosition: 0.5 });
                } catch (e) {}
              }
            }}
            mapType={mapLayer}
            showRoute={navigationActive}
            travelMode={travelMode}
            isDarkMode={isDark}
          />

          {/* Floating Map Controls (Layers, Recenter, Zoom In/Out) */}
          <View style={[styles.floatingControls, navigationActive && { top: 80 }]}>
            {/* Zoom In Button */}
            <TouchableOpacity
              onPress={() => mapRef.current?.zoomIn?.()}
              style={[styles.fabBtn, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={22} color={theme.text} />
            </TouchableOpacity>

            {/* Zoom Out Button */}
            <TouchableOpacity
              onPress={() => mapRef.current?.zoomOut?.()}
              style={[styles.fabBtn, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
              activeOpacity={0.8}
            >
              <Ionicons name="remove" size={22} color={theme.text} />
            </TouchableOpacity>

            {/* Map Layer Switcher Button */}
            <TouchableOpacity
              onPress={() => setShowLayerMenu(!showLayerMenu)}
              style={[styles.fabBtn, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
              activeOpacity={0.8}
            >
              <Ionicons name="layers-outline" size={20} color={theme.text} />
            </TouchableOpacity>

            {/* Recenter on User Location */}
            <TouchableOpacity
              onPress={handleRequestLocation}
              style={[styles.fabBtn, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
              activeOpacity={0.8}
            >
              <Ionicons name="locate-outline" size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* Layer Menu Popup */}
          {showLayerMenu && (
            <View style={[styles.layerMenu, navigationActive && { top: 125 }, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.layerMenuTitle, { color: theme.textSecondary }]}>Map Style</Text>
              {MAP_LAYERS.map((layer) => (
                <TouchableOpacity
                  key={layer.id}
                  onPress={() => {
                    setMapLayer(layer.id);
                    setShowLayerMenu(false);
                  }}
                  style={[
                    styles.layerOption,
                    mapLayer === layer.id && { backgroundColor: theme.primaryLight },
                  ]}
                >
                  <Ionicons
                    name={layer.icon}
                    size={16}
                    color={mapLayer === layer.id ? theme.primary : theme.text}
                  />
                  <Text
                    style={[
                      styles.layerOptionText,
                      { color: mapLayer === layer.id ? theme.primary : theme.text },
                    ]}
                  >
                    {layer.label}
                  </Text>
                  {mapLayer === layer.id && (
                    <Ionicons name="checkmark" size={16} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Google Maps Live Navigation Active Bottom Card */}
          {navigationActive && selectedPlace ? (
            <View style={[styles.gmapsBottomHUD, { backgroundColor: theme.card, borderTopColor: theme.border, bottom: tabBarHeight + 6 }]}>
              <View style={styles.sheetHandle} />

              {/* ETA Duration, Distance & Arrival Clock */}
              <View style={styles.gmapsEtaRow}>
                <View style={styles.gmapsEtaMain}>
                  <Text style={styles.gmapsDurationBig}>{currentDurationMins} min</Text>
                  <Text style={[styles.gmapsDistanceClock, { color: theme.textSecondary }]}>
                    {selectedPlace.distanceKm} km · {etaClockTime} ETA
                  </Text>
                </View>

                {/* Close / End Route Button */}
                <TouchableOpacity
                  onPress={() => setNavigationActive(false)}
                  style={styles.gmapsCloseBtn}
                >
                  <Ionicons name="close" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {/* Traffic status & Route Tag */}
              <View style={styles.trafficTagRow}>
                <View style={styles.trafficPill}>
                  <Ionicons name="shield-checkmark" size={13} color="#16A34A" />
                  <Text style={styles.trafficText}>Fastest route · Normal traffic</Text>
                </View>
                <Text style={[styles.destNameHeader, { color: theme.text }]} numberOfLines={1}>
                  to {selectedPlace.name}
                </Text>
              </View>

              {/* Travel Mode Selector (Drive / Bike / Walk / Transit) */}
              <View style={styles.travelModesBar}>
                {TRAVEL_MODES.map((mode) => {
                  const isSelected = travelMode === mode.id;
                  return (
                    <TouchableOpacity
                      key={mode.id}
                      onPress={() => setTravelMode(mode.id)}
                      style={[
                        styles.travelModeBtn,
                        {
                          backgroundColor: isSelected ? '#1E3A8A' : theme.cardSecondary,
                          borderColor: isSelected ? '#2563EB' : theme.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name={mode.icon}
                        size={15}
                        color={isSelected ? '#FFFFFF' : theme.textSecondary}
                      />
                      <Text
                        style={[
                          styles.travelModeText,
                          { color: isSelected ? '#FFFFFF' : theme.text },
                        ]}
                      >
                        {mode.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action Buttons: 1-Tap Google Maps Native App & View Steps */}
              <View style={styles.gmapsActionRow}>
                <TouchableOpacity
                  onPress={() => setShowStepsModal(true)}
                  style={[styles.gmapsStepBtn, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
                >
                  <Ionicons name="list-outline" size={17} color={theme.text} />
                  <Text style={[styles.gmapsStepText, { color: theme.text }]}>Steps</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOpenGoogleMapsApp(selectedPlace)}
                  style={styles.gmapsLaunchBtn}
                >
                  <Ionicons name="logo-google" size={16} color="#FFFFFF" />
                  <Text style={styles.gmapsLaunchText}>Open in Google Maps</Text>
                  <Ionicons name="open-outline" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ALL PLACES SHOWN ONE BY ONE IN A BOTTOM SWIPEABLE CAROUSEL */
            places.length > 0 && (
              <View style={[styles.bottomMultiPlacesWrap, { bottom: tabBarHeight + 10 }]} pointerEvents="box-none">
                {/* Header Row: Category summary & collapse toggle */}
                <View style={[styles.carouselHeaderRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.carouselHeaderLeft}>
                    <View style={[styles.catHeaderDot, { backgroundColor: categoryHeaderInfo.color }]} />
                    <Text style={[styles.carouselHeaderText, { color: theme.text }]} numberOfLines={1}>
                      {categoryHeaderInfo.title}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => setCarouselCollapsed(!carouselCollapsed)}
                    style={styles.collapseToggleBtn}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Ionicons
                      name={carouselCollapsed ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Horizontal Scrollable Carousel showing ALL places one by one */}
                {!carouselCollapsed && (
                  <FlatList
                    ref={carouselRef}
                    data={places}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH + 12}
                    decelerationRate="fast"
                    contentContainerStyle={styles.carouselScrollContent}
                    onScrollBeginDrag={() => navigation?.setTabScrollEnabled?.(false)}
                    onScrollEndDrag={() => navigation?.setTabScrollEnabled?.(true)}
                    onMomentumScrollEnd={() => navigation?.setTabScrollEnabled?.(true)}
                    renderItem={({ item: place }) => {
                      const isSelected = selectedPlace?.id === place.id;
                      const sym = place.symbolConfig || { symbol: '📍', color: theme.primary, bg: theme.primaryLight };
                      const isSaved = isPlaceSaved(place.id);

                      return (
                        <View
                          style={[
                            styles.carouselCard,
                            {
                              backgroundColor: theme.card,
                              borderColor: isSelected ? theme.primary : theme.border,
                              borderWidth: isSelected ? 2.5 : 1,
                              shadowColor: theme.shadow,
                            },
                          ]}
                        >
                          {/* Card Top Row: Thumbnail + Info (Tappable to Select Place & Pan Map) */}
                          <TouchableOpacity
                            activeOpacity={0.88}
                            onPress={() => {
                              setSelectedPlace(place);
                              if (place.latitude && place.longitude) {
                                mapRef.current?.panTo?.(place.latitude, place.longitude, 16);
                              }
                            }}
                            style={styles.cCardMainRow}
                          >
                            <View style={styles.cImageWrap}>
                              <Image source={{ uri: place.image }} style={styles.cPlaceImage} resizeMode="cover" />
                              
                              {/* Symbol Badge */}
                              <View style={[styles.cSymbolBadge, { backgroundColor: sym.bg, borderColor: sym.color }]}>
                                <Text style={styles.cSymbolEmoji}>{sym.symbol}</Text>
                              </View>
                            </View>

                            <View style={styles.cDetailsWrap}>
                              {/* Subcategory & Distance */}
                              <View style={styles.cSubCatRow}>
                                <Text style={[styles.cSubCatText, { color: sym.color }]} numberOfLines={1}>
                                  {place.subCategory}
                                </Text>
                                <Text style={[styles.cDistText, { color: theme.primary }]}>
                                  {place.distanceKm} km away
                                </Text>
                              </View>

                              {/* Place Name */}
                              <Text style={[styles.cPlaceName, { color: theme.text }]} numberOfLines={1}>
                                {place.name}
                              </Text>

                              {/* Rating & ETA */}
                              <View style={styles.cEtaRow}>
                                <View style={styles.cRatingBox}>
                                  <Ionicons name="star" size={11} color="#F59E0B" />
                                  <Text style={styles.cRatingText}>{place.rating}</Text>
                                  <Text style={[styles.cReviewsText, { color: theme.textMuted }]}>
                                    ({place.reviews})
                                  </Text>
                                </View>
                                <Text style={[styles.cEtaText, { color: theme.textSecondary }]}>
                                  🚗 {place.driveMinutes}m · 🚶 {place.walkMinutes}m
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>

                          {/* Specific Category Snippet Info */}
                          <View style={[styles.cSnippetBox, { backgroundColor: theme.cardSecondary }]}>
                            {place.category === 'hospital' && (
                              <Text style={[styles.cSnippetText, { color: '#DC2626' }]} numberOfLines={1}>
                                🚨 {place.specialty || '24x7 Emergency Care'} · {place.bedsAvailable ? `${place.bedsAvailable} Beds` : 'Ambulance On-Duty'}
                              </Text>
                            )}
                            {place.category === 'famous' && (
                              <Text style={[styles.cSnippetText, { color: theme.text }]} numberOfLines={1}>
                                🏛️ {place.openHours} · {place.entryFee > 0 ? `Entry ₹${place.entryFee}` : 'Free Entry'}
                              </Text>
                            )}
                            {place.category === 'restaurant' && (
                              <Text style={[styles.cSnippetText, { color: theme.text }]} numberOfLines={1}>
                                🍴 {place.cuisine} · {place.priceRange} (Avg ₹{place.avgCostForTwo} for 2)
                              </Text>
                            )}
                            {place.category === 'hotel' && (
                              <Text style={[styles.cSnippetText, { color: theme.text }]} numberOfLines={1}>
                                🏨 {place.openHours} · ₹{place.pricePerNight}/night
                              </Text>
                            )}
                            {place.category === 'artisan' && (
                              <Text style={[styles.cSnippetText, { color: theme.text }]} numberOfLines={1}>
                                🎨 {place.crafts ? place.crafts.join(', ') : 'Authentic Handicrafts'}
                              </Text>
                            )}
                            {place.category === 'transit' && (
                              <Text style={[styles.cSnippetText, { color: theme.text }]} numberOfLines={1}>
                                🚆 {place.fare || 'Standard Clean Transit Fare'}
                              </Text>
                            )}
                            {place.category === 'emergency' && (
                              <Text style={[styles.cSnippetText, { color: theme.text }]} numberOfLines={1}>
                                👮 Dial 112 for 24/7 tourist safety assistance
                              </Text>
                            )}
                          </View>

                          {/* Card Action Buttons: Call Helpline + Save Bookmark + Directions */}
                          <View style={styles.cActionsRow}>
                            {place.phone ? (
                              <TouchableOpacity
                                onPress={() => handleCallEmergency(place.phone)}
                                style={[styles.cActionIconBtn, { backgroundColor: '#FEE2E2', borderColor: '#DC2626' }]}
                              >
                                <Ionicons name="call" size={15} color="#DC2626" />
                              </TouchableOpacity>
                            ) : null}

                            {/* Instagram Bookmark Button */}
                            <TouchableOpacity
                              onPress={() => {
                                const nowSaved = toggleSavePlace(place);
                                setToastVisible(nowSaved);
                              }}
                              style={[
                                styles.cActionIconBtn,
                                {
                                  backgroundColor: isSaved ? '#2563EB' : theme.cardSecondary,
                                  borderColor: isSaved ? '#2563EB' : theme.border,
                                },
                              ]}
                            >
                              <Ionicons
                                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                                size={15}
                                color={isSaved ? '#FFFFFF' : theme.text}
                              />
                            </TouchableOpacity>

                            {/* 1-Touch Directions Button */}
                            <TouchableOpacity
                              onPress={() => handleStartNavigation(place)}
                              style={styles.cDirectionsBtn}
                            >
                              <Ionicons name="navigate" size={14} color="#FFFFFF" />
                              <Text style={styles.cDirectionsText}>Start Directions</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            )
          )}
        </View>
      ) : (
        /* List View Mode */
        <ScrollView style={styles.listView} contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight + 24 }]}>
          <Text style={[styles.listHeader, { color: theme.textSecondary }]}>
            Found {places.length} places around {cityName} ({selectedRadius} km radius)
          </Text>

          {places.map((place) => {
            const sym = place.symbolConfig || { symbol: '📍', color: theme.primary, bg: theme.primaryLight };
            const isSaved = isPlaceSaved(place.id);
            return (
              <TouchableOpacity
                key={place.id}
                onPress={() => {
                  setSelectedPlace(place);
                  setViewMode('map');
                }}
                style={[styles.placeCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <Image source={{ uri: place.image }} style={styles.cardImage} resizeMode="cover" />

                <View style={styles.cardBody}>
                  <View style={styles.cardTopRow}>
                    <View style={[styles.symbolBadgeSmall, { backgroundColor: sym.bg, borderColor: sym.color }]}>
                      <Text style={styles.symbolEmojiSmall}>{sym.symbol}</Text>
                      <Text style={[styles.symbolLabelSmall, { color: sym.color }]}>
                        {place.subCategory}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.cardDistance, { color: theme.primary }]}>
                        {place.distanceKm} km
                      </Text>
                      {/* Instagram Bookmark in list item */}
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          const nowSaved = toggleSavePlace(place);
                          setToastVisible(nowSaved);
                        }}
                      >
                        <Ionicons
                          name={isSaved ? 'bookmark' : 'bookmark-outline'}
                          size={16}
                          color={isSaved ? '#2563EB' : theme.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={[styles.cardName, { color: theme.text }]} numberOfLines={1}>
                    {place.name}
                  </Text>

                  <Text style={[styles.cardDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                    {place.description}
                  </Text>

                  <View style={styles.cardFooter}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.ratingText}>{place.rating}</Text>
                    </View>

                    <Text style={[styles.cardEta, { color: theme.textMuted }]}>
                      🚗 {place.driveMinutes}m · 🚶 {place.walkMinutes}m
                    </Text>

                    {/* 1-Touch Start Directions */}
                    <TouchableOpacity
                      onPress={() => handleStartNavigation(place)}
                      style={styles.cardDirectBtn}
                    >
                      <Ionicons name="navigate" size={13} color="#FFFFFF" />
                      <Text style={styles.cardDirectText}>Directions</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Floating Instagram-Style Saved Toast Popup */}
      <SavedToast
        visible={toastVisible}
        place={selectedPlace}
        collectionName="All Saved"
        onViewSaved={() => {
          setToastVisible(false);
          navigation.navigate('TripsTab', { initialTab: 'saved' });
        }}
        onDismiss={() => setToastVisible(false)}
      />

      {/* Turn-by-Turn Step Directions Modal */}
      <Modal visible={showStepsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleWrap}>
                <Ionicons name="navigate" size={20} color="#16A34A" />
                <Text style={[styles.modalTitle, { color: theme.text }]}>Turn-by-Turn Directions</Text>
              </View>
              <TouchableOpacity onPress={() => setShowStepsModal(false)}>
                <Ionicons name="close" size={22} color={theme.text} />
              </TouchableOpacity>
            </View>

            {selectedPlace && (
              <View style={[styles.stepDestinationBanner, { backgroundColor: theme.cardSecondary }]}>
                <Text style={[styles.stepDestName, { color: theme.text }]}>Destination: {selectedPlace.name}</Text>
                <Text style={[styles.stepDestDetails, { color: theme.textSecondary }]}>
                  {selectedPlace.distanceKm} km · {currentDurationMins} mins via Coastal Arterial
                </Text>
              </View>
            )}

            <ScrollView style={{ maxHeight: 360 }}>
              {turnSteps.map((step, idx) => (
                <View key={step.id} style={[styles.stepItemRow, { borderBottomColor: theme.border }]}>
                  <View style={styles.stepIconBubble}>
                    <Ionicons name={step.icon} size={18} color="#16A34A" />
                  </View>
                  <View style={styles.stepTextWrap}>
                    <Text style={[styles.stepInstruction, { color: theme.text }]}>{step.instruction}</Text>
                    <Text style={[styles.stepDistance, { color: theme.primary }]}>{step.distance}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.stepModalActions}>
              <Button
                title="Launch Google Maps App"
                variant="primary"
                icon="logo-google"
                onPress={() => {
                  setShowStepsModal(false);
                  handleOpenGoogleMapsApp(selectedPlace);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Preset City Switcher Modal */}
      <Modal visible={showCityPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select City / Live GPS</Text>
              <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                <Ionicons name="close" size={22} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Current GPS Option */}
            <TouchableOpacity
              onPress={() => {
                setShowCityPicker(false);
                handleRequestLocation();
              }}
              style={[styles.cityItem, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
            >
              <Ionicons name="navigate-circle" size={22} color={theme.primary} />
              <View style={styles.cityItemTextWrap}>
                <Text style={[styles.cityNameBold, { color: theme.primary }]}>Use My Real Live GPS</Text>
                <Text style={[styles.cityStateText, { color: theme.textSecondary }]}>
                  Detect location using device GPS
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.primary} />
            </TouchableOpacity>

            <Text style={[styles.modalSectionLabel, { color: theme.textSecondary }]}>
              Popular Tourism Destinations in India
            </Text>

            <ScrollView style={{ maxHeight: 320 }}>
              {PRESET_CITIES.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => handleSelectPresetCity(c)}
                  style={[styles.cityItem, { borderColor: theme.border }]}
                >
                  <Ionicons name="location-outline" size={18} color={theme.textSecondary} />
                  <View style={styles.cityItemTextWrap}>
                    <Text style={[styles.cityNameText, { color: theme.text }]}>{c.name}</Text>
                    <Text style={[styles.cityStateText, { color: theme.textMuted }]}>{c.state}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconBtn: {
    padding: 6,
  },
  cityTitleWrap: {
    alignItems: 'center',
    maxWidth: width * 0.58,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityText: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 10.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Google Maps Navigation Top Header */
  gmapsTopHeader: {
    backgroundColor: '#065F46',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gmapsTopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gmapsManeuverCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#047857',
    borderWidth: 2,
    borderColor: '#34D399',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gmapsInstructionWrap: {
    flex: 1,
  },
  gmapsDistanceNext: {
    color: '#34D399',
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
  },
  gmapsManeuverText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
  gmapsTowardText: {
    color: '#E2E8F0',
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
  },
  gmapsVoiceBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Google Maps Bottom HUD */
  gmapsBottomHUD: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  gmapsEtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  gmapsEtaMain: {
    flex: 1,
  },
  gmapsDurationBig: {
    fontSize: 24,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#10B981',
  },
  gmapsDistanceClock: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    marginTop: 1,
  },
  gmapsCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trafficTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  trafficPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trafficText: {
    color: '#15803D',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  destNameHeader: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    flex: 1,
  },
  travelModesBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  travelModeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  travelModeText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_700Bold',
  },
  gmapsActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gmapsStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  gmapsStepText: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  gmapsLaunchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#2563EB',
    paddingVertical: 11,
    borderRadius: 12,
    elevation: 3,
  },
  gmapsLaunchText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },

  /* Bottom Multi-Place Carousel & List Wrapper */
  bottomMultiPlacesWrap: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    zIndex: 90,
  },
  carouselHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  carouselHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },
  catHeaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  carouselHeaderText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
  collapseToggleBtn: {
    padding: 2,
  },
  carouselScrollContent: {
    paddingHorizontal: 14,
    gap: 12,
  },
  carouselCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 12,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  cCardMainRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cImageWrap: {
    width: 68,
    height: 68,
    borderRadius: 12,
    position: 'relative',
  },
  cPlaceImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  cSymbolBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  cSymbolEmoji: {
    fontSize: 11,
  },
  cDetailsWrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cSubCatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cSubCatText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
    flex: 1,
  },
  cDistText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  cPlaceName: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginVertical: 1,
  },
  cEtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cRatingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cRatingText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
    color: '#D97706',
  },
  cReviewsText: {
    fontSize: 9.5,
    fontFamily: 'Manrope_500Medium',
  },
  cEtaText: {
    fontSize: 10.5,
    fontFamily: 'Manrope_500Medium',
  },
  cSnippetBox: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  cSnippetText: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  cActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cActionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cDirectionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 7,
    borderRadius: 8,
  },
  cDirectionsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },

  /* Step Directions Modal */
  modalHeaderTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepDestinationBanner: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  stepDestName: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  stepDestDetails: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  stepIconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextWrap: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
    lineHeight: 18,
  },
  stepDistance: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
    marginTop: 2,
  },
  stepModalActions: {
    marginTop: 14,
  },

  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  permissionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
    color: '#1E40AF',
  },
  permissionDesc: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
    color: '#3B82F6',
    marginTop: 1,
  },
  permissionGrantBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  permissionGrantText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontFamily: 'Manrope_700Bold',
  },
  searchSection: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Manrope_500Medium',
    paddingVertical: 0,
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingBottom: 2,
  },
  radiusLabel: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
    marginRight: 2,
  },
  radiusChip: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  radiusChipText: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  categoriesBar: {
    paddingTop: 6,
    borderBottomWidth: 1,
  },
  categoriesScroll: {
    paddingHorizontal: 12,
    gap: 8,
    paddingBottom: 6,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 10.5,
    fontFamily: 'Manrope_700Bold',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  floatingControls: {
    position: 'absolute',
    top: 14,
    right: 14,
    gap: 10,
    zIndex: 100,
  },
  fabBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  layerMenu: {
    position: 'absolute',
    top: 60,
    right: 14,
    width: 140,
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    zIndex: 110,
    elevation: 6,
  },
  layerMenuTitle: {
    fontSize: 10.5,
    fontFamily: 'Manrope_700Bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    textTransform: 'uppercase',
  },
  layerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  layerOptionText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    flex: 1,
  },
  listView: {
    flex: 1,
  },
  listContent: {
    padding: 14,
    gap: 12,
  },
  listHeader: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 4,
  },
  placeCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 10,
    padding: 8,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  symbolBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
  },
  symbolEmojiSmall: {
    fontSize: 10,
  },
  symbolLabelSmall: {
    fontSize: 9.5,
    fontFamily: 'Manrope_700Bold',
  },
  cardDistance: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  cardName: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 15,
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardEta: {
    fontSize: 10,
    fontFamily: 'Manrope_500Medium',
  },
  cardDirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardDirectText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontFamily: 'Manrope_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: height * 0.75,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  modalSectionLabel: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 8,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  cityItemTextWrap: {
    flex: 1,
  },
  cityNameBold: {
    fontSize: 13.5,
    fontFamily: 'Manrope_700Bold',
  },
  cityNameText: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
  },
  cityStateText: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
});
