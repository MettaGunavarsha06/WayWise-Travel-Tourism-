import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useTrips } from '../context/TripContext';
import { hotels } from '../data/hotels';
import { weatherData, defaultWeather } from '../data/weather';
import { crowdData } from '../data/crowdData';
import { CrowdIndicator } from './CrowdIndicator';
import { EcoScoreBadge } from './EcoScoreBadge';
import { HotelCard } from './HotelCard';
import { FloatingPressable } from './FloatingPressable';
import { formatCurrency } from '../utils/helpers';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const LOCATION_TABS = ['All', 'To do', 'To stay', 'To eat'];

export const ExpandingPlaceDetailModal = ({
  destination,
  visible,
  onClose,
  navigation,
}) => {
  const { theme, isDark } = useTheme();
  const { createTrip } = useTrips();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState('All');
  const [isLiked, setIsLiked] = useState(false);

  const expandAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      expandAnim.setValue(0);
      Animated.spring(expandAnim, {
        toValue: 1,
        bounciness: 8,
        speed: 16,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(expandAnim, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!destination) return null;

  const destinationWeather = weatherData[destination.id] || defaultWeather;
  const destinationCrowd = crowdData[destination.id];
  const destHotels = hotels.filter((h) => h.destinationId === destination.id || h.destinationName === destination.name);

  const modalScale = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });

  const modalTranslateY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0],
  });

  const modalOpacity = expandAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.9, 1],
  });

  const handlePlanTrip = () => {
    onClose();
    navigation.navigate('TripPlannerWizard', {
      initialDestination: destination,
      startAtBudget: true,
    });
  };

  const handleOpenMap = () => {
    onClose();
    navigation.navigate('SmartMap', { selectedDestId: destination.id });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.expandingContainer,
            {
              backgroundColor: theme.background,
              opacity: modalOpacity,
              transform: [{ scale: modalScale }, { translateY: modalTranslateY }],
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {/* Top Banner Image with Floating Navigation */}
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: destination.banner || destination.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />

            {/* Gradient Scrim */}
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(10,12,16,0.92)']}
              locations={[0, 0.4, 1]}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Top Controls Row */}
            <View style={styles.topControlRow}>
              <FloatingPressable
                activeScale={1.15}
                onPress={onClose}
                style={styles.frostedCircleBtn}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </FloatingPressable>

              <View style={styles.topRightBtns}>
                <FloatingPressable
                  activeScale={1.15}
                  onPress={() => setIsLiked(!isLiked)}
                  style={styles.frostedCircleBtn}
                >
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={18}
                    color={isLiked ? '#EF4444' : '#FFFFFF'}
                  />
                </FloatingPressable>

                <FloatingPressable
                  activeScale={1.15}
                  onPress={handleOpenMap}
                  style={styles.frostedCircleBtn}
                >
                  <Ionicons name="map-outline" size={18} color="#FFFFFF" />
                </FloatingPressable>
              </View>
            </View>

            {/* Top Duration Badge */}
            <View style={styles.durationPill}>
              <Ionicons name="time-outline" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.durationPillText}>
                {destination.duration || '3 Days, 2 Nights'}
              </Text>
            </View>

            {/* Banner Bottom Title */}
            <View style={styles.bannerBottomInfo}>
              <Text style={styles.bannerTitle}>{destination.name}</Text>
              <Text style={styles.bannerSub}>
                {destination.subtitle || `${destination.state} · ${destination.category}`}
              </Text>
            </View>
          </View>

          {/* Scrollable Details & Remaining Options */}
          <ScrollView
            contentContainerStyle={styles.scrollBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Metadata Badges (Rating, Crowd, Eco) */}
            <View style={styles.badgesSection}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingVal}>{destination.rating || 4.8}</Text>
                <Text style={styles.ratingCount}>({destination.reviews || 420})</Text>
              </View>

              <CrowdIndicator
                level={destination.crowdLevel}
                percent={destinationCrowd?.densityPercent || destination.crowdScore}
              />
              <EcoScoreBadge score={destination.ecoScore} />
            </View>

            {/* Locations Section Header & Tabs */}
            <View style={styles.sectionHeaderWrap}>
              <Text style={[styles.sectionHeading, { color: theme.text }]}>Locations</Text>
              <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
                Explore verified spots and experiences in {destination.name}
              </Text>
            </View>

            {/* Filter Category Tabs (All, To do, To stay, To eat) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.locationTabsScroll}
            >
              {LOCATION_TABS.map((tab) => {
                const isSelected = activeTab === tab;
                return (
                  <FloatingPressable
                    key={tab}
                    activeScale={1.08}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      styles.locTabPill,
                      {
                        backgroundColor: isSelected ? '#FFFFFF' : (isDark ? '#1E2129' : theme.card),
                        borderColor: isSelected ? '#FFFFFF' : (isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.locTabText,
                        {
                          color: isSelected ? '#111216' : theme.textSecondary,
                          fontFamily: isSelected ? 'Manrope_700Bold' : 'Manrope_500Medium',
                        },
                      ]}
                    >
                      {tab}
                    </Text>
                  </FloatingPressable>
                );
              })}
            </ScrollView>

            {/* Attractions & Experiences (To do) */}
            {(activeTab === 'All' || activeTab === 'To do') && (
              <View style={styles.groupSection}>
                <Text style={[styles.groupTitle, { color: theme.text }]}>Top Attractions & Sights</Text>
                {destination.attractions && destination.attractions.length > 0 ? (
                  destination.attractions.map((attr) => (
                    <FloatingPressable
                      key={attr.id}
                      activeScale={1.03}
                      style={[styles.attrCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                    >
                      <Image source={{ uri: attr.image || destination.image }} style={styles.attrThumb} />
                      <View style={styles.attrContent}>
                        <Text style={[styles.attrName, { color: theme.text }]} numberOfLines={1}>
                          {attr.name}
                        </Text>
                        <Text style={[styles.attrDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                          {attr.description}
                        </Text>
                        <View style={styles.attrFooter}>
                          <View style={styles.attrMeta}>
                            <Ionicons name="time-outline" size={13} color={theme.primary} />
                            <Text style={[styles.attrMetaText, { color: theme.textMuted }]}>{attr.time || '2 hrs'}</Text>
                          </View>
                          <Text style={[styles.attrCost, { color: theme.primary }]}>
                            {attr.cost === 0 ? 'Free' : formatCurrency(attr.cost)}
                          </Text>
                        </View>
                      </View>
                    </FloatingPressable>
                  ))
                ) : (
                  <View style={[styles.attrCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Image source={{ uri: destination.image }} style={styles.attrThumb} />
                    <View style={styles.attrContent}>
                      <Text style={[styles.attrName, { color: theme.text }]}>Scenic Exploration & Heritage Walk</Text>
                      <Text style={[styles.attrDesc, { color: theme.textSecondary }]}>
                        {destination.description}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Verified Eco Stays & Hotels (To stay) */}
            {(activeTab === 'All' || activeTab === 'To stay') && (
              <View style={styles.groupSection}>
                <Text style={[styles.groupTitle, { color: theme.text }]}>Verified Eco-Stays & Lodgings</Text>
                {destHotels.length > 0 ? (
                  destHotels.map((h) => (
                    <HotelCard
                      key={h.id}
                      hotel={h}
                      onPress={() => {
                        onClose();
                        navigation.navigate('HotelDetail', { hotel: h });
                      }}
                    />
                  ))
                ) : (
                  <HotelCard
                    hotel={{
                      id: `h_${destination.id}`,
                      name: `Grand Heritage Retreat ${destination.name}`,
                      image: destination.image,
                      destinationName: destination.name,
                      pricePerNight: destination.estimatedCost ? Math.round(destination.estimatedCost / 4) : 3800,
                      rating: 4.8,
                      description: 'Certified low-carbon boutique eco stay with renewable solar power and local organic dining.',
                    }}
                    onPress={() => {}}
                  />
                )}
              </View>
            )}

            {/* Local Cuisine & Dining (To eat) */}
            {(activeTab === 'All' || activeTab === 'To eat') && (
              <View style={styles.groupSection}>
                <Text style={[styles.groupTitle, { color: theme.text }]}>Local Cuisine & Dining</Text>
                <View style={[styles.cuisineCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Ionicons name="restaurant-outline" size={24} color={theme.primary} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cuisineTitle, { color: theme.text }]}>Authentic Local Flavors</Text>
                    <Text style={[styles.cuisineDesc, { color: theme.textSecondary }]}>
                      Enjoy traditional regional delicacies, fresh coastal & farm-to-table cuisine prepared with organic sustainable sourcing.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Live Weather & Climate Overview */}
            <View style={styles.groupSection}>
              <Text style={[styles.groupTitle, { color: theme.text }]}>Weather & Forecast</Text>
              <View style={[styles.weatherCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.weatherHeader}>
                  <Ionicons name="partly-sunny" size={26} color="#F59E0B" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.weatherTemp, { color: theme.text }]}>
                      {destinationWeather.temp || '28°C'} · {destinationWeather.condition || 'Clear Skies'}
                    </Text>
                    <Text style={[styles.weatherSub, { color: theme.textMuted }]}>
                      Humidity {destinationWeather.humidity || '62%'} · Wind {destinationWeather.wind || '12 km/h'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ height: 90 }} />
          </ScrollView>

          {/* Bottom Floating Radiant Blue Action Button */}
          <View style={[styles.bottomActionBar, { backgroundColor: isDark ? 'rgba(17, 18, 22, 0.95)' : 'rgba(255, 255, 255, 0.95)' }]}>
            <FloatingPressable
              activeScale={1.04}
              liftY={-4}
              onPress={handlePlanTrip}
              style={styles.planTripBtnWrap}
            >
              <LinearGradient
                colors={['#4F75FF', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.planTripGrad}
              >
                <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.planTripText}>Plan Trip to {destination.name}</Text>
              </LinearGradient>
            </FloatingPressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  expandingContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  bannerContainer: {
    height: 270,
    width: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  topControlRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  topRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  frostedCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 23, 31, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  durationPill: {
    position: 'absolute',
    top: 70,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 23, 31, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
  },
  durationPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  bannerBottomInfo: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: -0.4,
  },
  bannerSub: {
    color: '#CBD5E1',
    fontSize: 13,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  badgesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  ratingVal: {
    color: '#F59E0B',
    fontSize: 12.5,
    fontFamily: 'Manrope_700Bold',
  },
  ratingCount: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  sectionHeaderWrap: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 19,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  locationTabsScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  locTabPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 8,
  },
  locTabText: {
    fontSize: 13,
  },
  groupSection: {
    marginBottom: 22,
  },
  groupTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 10,
  },
  attrCard: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  attrThumb: {
    width: 75,
    height: 75,
    borderRadius: 12,
  },
  attrContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  attrName: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 3,
  },
  attrDesc: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 16,
    marginBottom: 6,
  },
  attrFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attrMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attrMetaText: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  attrCost: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
  cuisineCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  cuisineTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 3,
  },
  cuisineDesc: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 17,
  },
  weatherCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
  },
  weatherSub: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  planTripBtnWrap: {
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#4F75FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  planTripGrad: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTripText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.2,
  },
});
