import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
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
  const { toggleSavePlace, isPlaceSaved } = useTrips();
  
  // Location States
  const [userCoords, setUserCoords] = useState(DEFAULT_COORDINATES);
  const [cityName, setCityName] = useState('Visakhapatnam (Demo)');
  const [gpsStatus, setGpsStatus] = useState('demo'); // 'loading' | 'live' | 'denied' | 'demo'
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  // Compute Places around user coordinates
  const { places, allPlaces, categoryCounts } = useMemo(() => {
    return getPlacesAroundLocation(userCoords, selectedCategory, selectedRadius, searchQuery);
  }, [userCoords, selectedCategory, selectedRadius, searchQuery]);

  // Initial check & auto-select first place
  useEffect(() => {
    checkInitialPermissions();
  }, []);

  useEffect(() => {
    if (places && places.length > 0) {
      if (!selectedPlace || !places.some((p) => p.id === selectedPlace.id)) {
        setSelectedPlace(places[0]);
      }
    } else {
      setSelectedPlace(null);
    }
  }, [places]);

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

  const currentSymbol = selectedPlace?.symbolConfig || {
    icon: 'location',
    symbol: '📍',
    color: theme.primary,
    bg: theme.primaryLight,
  };

  const isCurrentSaved = selectedPlace ? isPlaceSaved(selectedPlace.id) : false;

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
              placeholder="Search restaurants, hospitals, forts, cafes..."
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

      {/* Category Filter Chips with Unique Icons & Counts (Hidden during navigation) */}
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
                    {cat.label}
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
          {/* Real Leaflet Map Engine with Google Maps Navigation Route */}
          <RealLeafletMap
            userLocation={userCoords}
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={(place) => {
              setSelectedPlace(place);
            }}
            mapType={mapLayer}
            showRoute={navigationActive}
            travelMode={travelMode}
            isDarkMode={isDark}
          />

          {/* Floating Map Controls (Layers, Recenter) */}
          <View style={[styles.floatingControls, navigationActive && { top: 80 }]}>
            {/* Map Layer Switcher Button */}
            <TouchableOpacity
              onPress={() => setShowLayerMenu(!showLayerMenu)}
              style={[styles.fabBtn, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
            >
              <Ionicons name="layers-outline" size={20} color={theme.text} />
            </TouchableOpacity>

            {/* Recenter on User Location */}
            <TouchableOpacity
              onPress={handleRequestLocation}
              style={[styles.fabBtn, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
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
            <View style={[styles.gmapsBottomHUD, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
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
            /* Standard Bottom Selected Place Details Card */
            selectedPlace && (
              <View style={[styles.bottomSheet, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                <View style={styles.sheetHandle} />

                <View style={styles.sheetMainRow}>
                  <Image
                    source={{ uri: selectedPlace.image }}
                    style={styles.sheetPlaceImage}
                    resizeMode="cover"
                  />

                  <View style={styles.sheetDetails}>
                    {/* Category Symbol & Subcategory */}
                    <View style={styles.subCategoryRow}>
                      <View
                        style={[
                          styles.symbolBadge,
                          {
                            backgroundColor: currentSymbol.bg,
                            borderColor: currentSymbol.color,
                          },
                        ]}
                      >
                        <Text style={styles.symbolEmoji}>{currentSymbol.symbol}</Text>
                        <Text style={[styles.symbolLabel, { color: currentSymbol.color }]}>
                          {selectedPlace.subCategory}
                        </Text>
                      </View>

                      <Text style={[styles.distanceText, { color: theme.primary }]}>
                        {selectedPlace.distanceKm} km away
                      </Text>
                    </View>

                    {/* Name */}
                    <Text style={[styles.sheetPlaceName, { color: theme.text }]} numberOfLines={1}>
                      {selectedPlace.name}
                    </Text>

                    {/* ETA & Rating */}
                    <View style={styles.etaRow}>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={styles.ratingText}>{selectedPlace.rating}</Text>
                        <Text style={[styles.reviewsText, { color: theme.textMuted }]}>
                          ({selectedPlace.reviews})
                        </Text>
                      </View>

                      <Text style={[styles.etaDot, { color: theme.textMuted }]}>•</Text>
                      <Text style={[styles.etaText, { color: theme.textSecondary }]}>
                        🚗 {selectedPlace.driveMinutes} min drive · 🚶 {selectedPlace.walkMinutes} min
                      </Text>
                    </View>

                    {/* Crowd & Eco Badges */}
                    <View style={styles.badgesRow}>
                      {selectedPlace.crowdLevel && (
                        <CrowdIndicator level={selectedPlace.crowdLevel} compact />
                      )}
                      {selectedPlace.ecoScore && (
                        <EcoScoreBadge score={selectedPlace.ecoScore} size="small" />
                      )}
                    </View>
                  </View>
                </View>

                {/* Special Info (Cuisine / Specialty / Emergency / Entry Fee) */}
                <View style={[styles.infoSnippet, { backgroundColor: theme.cardSecondary }]}>
                  {selectedPlace.category === 'restaurant' && (
                    <Text style={[styles.snippetText, { color: theme.text }]} numberOfLines={1}>
                      🍴 <Text style={{ fontFamily: 'Manrope_700Bold' }}>Cuisine:</Text> {selectedPlace.cuisine} ({selectedPlace.priceRange})
                    </Text>
                  )}
                  {selectedPlace.category === 'hospital' && (
                    <Text style={[styles.snippetText, { color: '#DC2626' }]} numberOfLines={1}>
                      🚨 <Text style={{ fontFamily: 'Manrope_700Bold' }}>Emergency Hotline:</Text> {selectedPlace.emergencyHelpline || '108 / 112'}
                    </Text>
                  )}
                  {selectedPlace.category === 'famous' && (
                    <Text style={[styles.snippetText, { color: theme.text }]} numberOfLines={1}>
                      🎟️ <Text style={{ fontFamily: 'Manrope_700Bold' }}>Entry:</Text> {selectedPlace.entryFee > 0 ? `₹${selectedPlace.entryFee}` : 'Free Entry'} · {selectedPlace.openHours}
                    </Text>
                  )}
                  {selectedPlace.category === 'hotel' && (
                    <Text style={[styles.snippetText, { color: theme.text }]} numberOfLines={1}>
                      🏨 <Text style={{ fontFamily: 'Manrope_700Bold' }}>Stay:</Text> ₹{selectedPlace.pricePerNight} / night · {selectedPlace.openHours}
                    </Text>
                  )}
                  {selectedPlace.category === 'artisan' && (
                    <Text style={[styles.snippetText, { color: theme.text }]} numberOfLines={1}>
                      🎨 <Text style={{ fontFamily: 'Manrope_700Bold' }}>Crafts:</Text> {selectedPlace.crafts ? selectedPlace.crafts.join(', ') : 'Traditional Handicrafts'}
                    </Text>
                  )}
                  {selectedPlace.category === 'transit' && (
                    <Text style={[styles.snippetText, { color: theme.text }]} numberOfLines={1}>
                      🚆 <Text style={{ fontFamily: 'Manrope_700Bold' }}>Transit:</Text> {selectedPlace.fare || 'Standard Transit Tariff'}
                    </Text>
                  )}
                  {selectedPlace.category === 'emergency' && (
                    <Text style={[styles.snippetText, { color: theme.text }]} numberOfLines={1}>
                      👮 <Text style={{ fontFamily: 'Manrope_700Bold' }}>Police:</Text> Dial 112 for immediate assistance
                    </Text>
                  )}
                </View>

                {/* Action Buttons: Call + Instagram Bookmark + Start Directions + Add to Trip */}
                <View style={styles.sheetActionRow}>
                  {selectedPlace.phone ? (
                    <TouchableOpacity
                      onPress={() => handleCallEmergency(selectedPlace.phone)}
                      style={[styles.actionIconBtn, { backgroundColor: '#FEE2E2', borderColor: '#DC2626' }]}
                    >
                      <Ionicons name="call" size={18} color="#DC2626" />
                    </TouchableOpacity>
                  ) : null}

                  {/* Instagram-Style Bookmark Save Button */}
                  <TouchableOpacity
                    onPress={() => {
                      const nowSaved = toggleSavePlace(selectedPlace);
                      setToastVisible(nowSaved);
                    }}
                    style={[
                      styles.actionIconBtn,
                      {
                        backgroundColor: isCurrentSaved ? '#2563EB' : theme.cardSecondary,
                        borderColor: isCurrentSaved ? '#2563EB' : theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isCurrentSaved ? 'bookmark' : 'bookmark-outline'}
                      size={18}
                      color={isCurrentSaved ? '#FFFFFF' : theme.text}
                    />
                  </TouchableOpacity>

                  {/* Start Google Maps Turn-by-Turn Navigation */}
                  <Button
                    title="Directions"
                    variant="primary"
                    size="small"
                    icon="navigate"
                    onPress={() => handleStartNavigation(selectedPlace)}
                    style={styles.sheetBtnPrimary}
                  />

                  {/* Add to Travel Plan */}
                  <Button
                    title="Add to Trip"
                    variant="outline"
                    size="small"
                    icon="add-circle-outline"
                    onPress={() =>
                      Alert.alert(
                        'Added to Travel Plan',
                        `${selectedPlace.name} has been added to your smart itinerary.`
                      )
                    }
                    style={styles.sheetBtnOutline}
                  />
                </View>
              </View>
            )
          )}
        </View>
      ) : (
        /* List View Mode */
        <ScrollView style={styles.listView} contentContainerStyle={styles.listContent}>
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
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  categoriesScroll: {
    paddingHorizontal: 12,
    gap: 8,
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
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    padding: 14,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginBottom: 10,
  },
  sheetMainRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sheetPlaceImage: {
    width: 82,
    height: 82,
    borderRadius: 14,
  },
  sheetDetails: {
    flex: 1,
  },
  subCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  symbolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  symbolEmoji: {
    fontSize: 12,
  },
  symbolLabel: {
    fontSize: 10.5,
    fontFamily: 'Manrope_700Bold',
  },
  distanceText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  sheetPlaceName: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginVertical: 2,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
    color: '#D97706',
  },
  reviewsText: {
    fontSize: 10,
    fontFamily: 'Manrope_500Medium',
  },
  etaDot: {
    fontSize: 10,
  },
  etaText: {
    fontSize: 10.5,
    fontFamily: 'Manrope_500Medium',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoSnippet: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 10,
  },
  snippetText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
  },
  sheetActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBtnPrimary: {
    flex: 1.2,
  },
  sheetBtnOutline: {
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
