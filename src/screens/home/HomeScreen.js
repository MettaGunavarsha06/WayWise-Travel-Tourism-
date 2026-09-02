import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { destinations } from '../../data/destinations';
import { Header } from '../../components/Header';
import { DestinationCard } from '../../components/DestinationCard';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { GemmaAIFloatingButton } from '../../components/GemmaAIFloatingButton';
import { GemmaAssistantModal } from '../../components/GemmaAssistantModal';
import { LiquidGlassBackground } from '../../components/LiquidGlassBackground';
import { InteractiveItineraryMapCard } from '../../components/InteractiveItineraryMapCard';
import { FloatingPressable } from '../../components/FloatingPressable';
import { ExpandingPlaceDetailModal } from '../../components/ExpandingPlaceDetailModal';
import { ScrollFadeItem } from '../../components/ScrollFadeItem';

const FILTER_CATEGORIES = [
  { id: 'All India', key: 'allIndia' },
  { id: 'Hills & Snow', key: 'hillsSnow' },
  { id: 'Royal Heritage', key: 'royalHeritage' },
  { id: 'Beaches & Coast', key: 'beachesCoast' },
  { id: 'Spiritual', key: 'spiritual' },
  { id: 'Eco Nature', key: 'ecoNature' },
  { id: 'South India', key: 'southIndia' },
  { id: 'North India', key: 'northIndia' },
  { id: 'East & Islands', key: 'eastIslands' },
];

export const HomeScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All India');
  const [gemmaModalVisible, setGemmaModalVisible] = useState(false);
  const [selectedPlaceModal, setSelectedPlaceModal] = useState(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const sosFloatAnim = useRef(new Animated.Value(0)).current;

  const handleSosPressIn = () => {
    Animated.spring(sosFloatAnim, {
      toValue: 1,
      bounciness: 10,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  const handleSosPressOut = () => {
    Animated.spring(sosFloatAnim, {
      toValue: 0,
      bounciness: 6,
      speed: 16,
      useNativeDriver: true,
    }).start();
  };

  const sosScale = sosFloatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const sosTranslateY = sosFloatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const jaipurDest = destinations.find((d) => d.id === 'dest_jaipur') || destinations[4];
  const foundAmerFort = jaipurDest?.attractions?.find((a) => a.id === 'j1');
  const amerFortAttraction = {
    name: foundAmerFort?.name || 'Amer Fort',
    location: foundAmerFort?.location || 'Amer, Jaipur, Rajasthan',
    description: foundAmerFort?.description || 'Majestic hilltop sandstone fortress featuring the Sheesh Mahal mirror palace and panoramic Maota lake vistas.',
    image: foundAmerFort?.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    time: foundAmerFort?.time || '3 hrs',
    cost: foundAmerFort?.cost || 200,
  };

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        (d.subtitle && d.subtitle.toLowerCase().includes(q)) ||
        (d.category && d.category.toLowerCase().includes(q));

      let matchesCategory = true;
      if (selectedFilter === 'Hills & Snow') {
        matchesCategory =
          (d.category && (d.category.includes('Snow') || d.category.includes('Hills') || d.category.includes('Mountain'))) ||
          ['Himachal Pradesh', 'Jammu & Kashmir', 'Ladakh', 'Uttarakhand', 'Sikkim', 'Meghalaya', 'West Bengal'].includes(d.state);
      } else if (selectedFilter === 'Royal Heritage') {
        matchesCategory =
          (d.category && (d.category.includes('Heritage') || d.category.includes('Palaces') || d.category.includes('Ruins') || d.category.includes('Forts'))) ||
          ['Rajasthan', 'Delhi', 'Uttar Pradesh', 'Karnataka', 'Telangana'].includes(d.state);
      } else if (selectedFilter === 'Beaches & Coast') {
        matchesCategory =
          (d.category && (d.category.includes('Beaches') || d.category.includes('Islands') || d.category.includes('Coast'))) ||
          ['Goa', 'Andhra Pradesh', 'Tamil Nadu', 'Maharashtra', 'Kerala', 'Andaman and Nicobar'].includes(d.state);
      } else if (selectedFilter === 'Spiritual') {
        matchesCategory =
          (d.category && (d.category.includes('Spiritual') || d.category.includes('Spirituality') || d.category.includes('Ghats'))) ||
          ['Varanasi', 'Tirupati & Chandragiri', 'Rishikesh & Haridwar', 'Amritsar', 'Madurai'].some((n) => d.name.includes(n));
      } else if (selectedFilter === 'Eco Nature') {
        matchesCategory = d.ecoScore >= 90 || (d.category && (d.category.includes('Nature') || d.category.includes('Eco')));
      } else if (selectedFilter === 'South India') {
        matchesCategory = ['Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Karnataka', 'Kerala'].includes(d.state);
      } else if (selectedFilter === 'North India') {
        matchesCategory = ['Delhi', 'Rajasthan', 'Uttar Pradesh', 'Himachal Pradesh', 'Uttarakhand', 'Jammu & Kashmir', 'Ladakh', 'Punjab'].includes(d.state);
      } else if (selectedFilter === 'East & Islands') {
        matchesCategory = ['West Bengal', 'Meghalaya', 'Sikkim', 'Assam', 'Odisha', 'Andaman and Nicobar'].includes(d.state);
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedFilter]);

  const trendingDestinations = destinations.filter((d) => d.isTrending);
  const hiddenGems = destinations.filter((d) => d.isHiddenGem);

  const isFilteredOrSearching = searchQuery.trim().length > 0 || selectedFilter !== 'All India';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LiquidGlassBackground />
      <Header
        onNotificationsPress={() => navigation.navigate('Notifications')}
        onWeatherPress={() => navigation.navigate('WeatherTab')}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? '#1E2129' : theme.card,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={theme.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={t('searchAllPlaces') || 'Search all places in India (e.g. Manali, Goa, Jaipur, Kerala)...'}
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text, fontFamily: 'Manrope_500Medium' }]}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.searchFilterBtn} activeOpacity={0.8}>
                <Ionicons name="options-outline" size={17} color={isDark ? '#FFFFFF' : theme.text} />
              </TouchableOpacity>
            )}
          </View>

          {/* Section Heading */}
          <Text style={[styles.selectTripHeading, { color: theme.text }]}>
            {t('selectTrip') || 'Select your next trip'}
          </Text>

          {/* Quick Region & Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = selectedFilter === cat.id;
              const catLabel = t(cat.key) || cat.id;
              return (
                <FloatingPressable
                  key={cat.id}
                  activeScale={1.10}
                  liftY={-4}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isActive ? '#FFFFFF' : (isDark ? '#1E2129' : theme.card),
                      borderColor: isActive ? '#FFFFFF' : (isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border),
                    },
                  ]}
                  onPress={() => setSelectedFilter(cat.id)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      { color: isActive ? '#111216' : theme.textSecondary, fontFamily: isActive ? 'Manrope_700Bold' : 'Manrope_500Medium' },
                    ]}
                  >
                    {catLabel}
                  </Text>
                </FloatingPressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Dynamic Search Results Section */}
        {isFilteredOrSearching ? (
          <View style={styles.searchResultsWrap}>
            <View style={styles.resultsHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {searchQuery.trim().length > 0
                    ? `Search Results for "${searchQuery}"`
                    : `${selectedFilter} Destinations`}
                </Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                  Found {filteredDestinations.length} places across India
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('All India');
                }}
                style={[styles.clearFilterBtn, { backgroundColor: theme.cardSecondary }]}
              >
                <Ionicons name="close" size={14} color={theme.textSecondary} />
                <Text style={[styles.clearFilterText, { color: theme.textSecondary }]}>Reset</Text>
              </TouchableOpacity>
            </View>

            {filteredDestinations.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="compass-outline" size={44} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No matching destinations found</Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                  Try searching for another state, city (e.g. Manali, Varanasi, Goa, Kerala), or choose "All India".
                </Text>
                <FloatingPressable
                  activeScale={1.05}
                  style={[styles.resetSearchBtn, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedFilter('All India');
                  }}
                >
                  <Text style={styles.resetSearchBtnText}>{t('viewAllDestinations') || 'View All Destinations'}</Text>
                </FloatingPressable>
              </View>
            ) : (
              filteredDestinations.map((dest) => (
                <ScrollFadeItem key={dest.id} scrollY={scrollY}>
                  <DestinationCard
                    destination={dest}
                    onPress={() => setSelectedPlaceModal(dest)}
                  />
                </ScrollFadeItem>
              ))
            )}
          </View>
        ) : (
          <>
            {/* Active Expedition Interactive Map Card */}
            <ScrollFadeItem scrollY={scrollY}>
              <InteractiveItineraryMapCard
                destinationName="Jaipur Heritage Expedition"
                dates="Oct 12 – 15, 2026"
                currentDay={2}
                totalDays={4}
                progress={0.65}
                onNavigateDetail={() => navigation.navigate('TripsTab')}
              />
            </ScrollFadeItem>

            {/* Spotlight: Featured Heritage Attraction (Amer Fort) */}
            <ScrollFadeItem scrollY={scrollY}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Heritage Attraction</Text>
                  <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                    Iconic landmarks and historic architecture
                  </Text>
                </View>
              </View>

              <FloatingPressable
                activeScale={1.04}
                liftY={-5}
                onPress={() => setSelectedPlaceModal(jaipurDest)}
                style={[
                  styles.spotlightCard,
                  { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow },
                ]}
              >
                <View style={styles.spotlightImageWrap}>
                  <Image
                    source={{ uri: amerFortAttraction.image }}
                    style={styles.spotlightImage}
                    resizeMode="cover"
                  />
                  <View style={styles.spotlightRatingBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.spotlightRatingText}>4.9</Text>
                  </View>
                  <View style={styles.spotlightCategoryBadge}>
                    <Text style={styles.spotlightCategoryText}>UNESCO World Heritage</Text>
                  </View>
                </View>

                <View style={styles.spotlightContent}>
                  <View style={styles.spotlightHeaderRow}>
                    <Text style={[styles.spotlightTitle, { color: theme.text }]}>
                      {amerFortAttraction.name}
                    </Text>
                    <Text style={[styles.spotlightLocation, { color: theme.primary }]}>
                      {amerFortAttraction.location || 'Jaipur, Rajasthan'}
                    </Text>
                  </View>

                  <Text style={[styles.spotlightDesc, { color: theme.textSecondary }]}>
                    {amerFortAttraction.description}
                  </Text>

                  <View style={styles.spotlightFooter}>
                    <View style={styles.spotlightMetaGroup}>
                      <View style={styles.spotlightMetaItem}>
                        <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                        <Text style={[styles.spotlightMetaText, { color: theme.textSecondary }]}>
                          3-4 hours
                        </Text>
                      </View>
                      <View style={styles.spotlightMetaItem}>
                        <Ionicons name="leaf-outline" size={14} color={theme.primary} />
                        <Text style={[styles.spotlightMetaText, { color: theme.primary }]}>
                          Eco Guided
                        </Text>
                      </View>
                    </View>

                    <View style={styles.spotlightPriceBadge}>
                      <Text style={[styles.spotlightPriceText, { color: theme.primary }]}>
                        ₹500 <Text style={styles.spotlightPriceSub}>entry</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </FloatingPressable>
            </ScrollFadeItem>

            {/* Sustainability Impact Summary */}
            <ScrollFadeItem scrollY={scrollY}>
              <View
                style={[
                  styles.ecoSummaryCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={styles.ecoLeft}>
                  <View style={[styles.ecoIconBox, { backgroundColor: theme.ecoGreenLight }]}>
                    <Ionicons name="leaf" size={20} color={theme.ecoGreen} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.ecoTitle, { color: theme.text }]}>
                      Sustainable Travel Verification
                    </Text>
                    <Text style={[styles.ecoSub, { color: theme.textSecondary }]}>
                      Certified eco-stays, low-emission transit & local artisan cooperatives
                    </Text>
                  </View>
                </View>
                <View style={styles.ecoRight}>
                  <EcoScoreBadge score={86} showLabel={false} />
                </View>
              </View>
            </ScrollFadeItem>

            {/* Recommended Destinations */}
            <ScrollFadeItem scrollY={scrollY}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    {t('recommended') || 'Recommended Destinations'}
                  </Text>
                  <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                    Handpicked destinations across India with balanced crowd density
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {destinations.slice(0, 8).map((item) => (
                  <DestinationCard
                    key={item.id}
                    destination={item}
                    horizontal
                    onPress={() => setSelectedPlaceModal(item)}
                  />
                ))}
              </ScrollView>
            </ScrollFadeItem>

            {/* Hidden Gems & Offbeat Escapes */}
            <ScrollFadeItem scrollY={scrollY}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    {t('hiddenGems') || 'Hidden Gems of India'}
                  </Text>
                  <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                    Peaceful offbeat destinations away from tourist congestion
                  </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('HiddenGems')}>
                  <Text style={[styles.viewAllText, { color: theme.primary }]}>
                    {t('viewAll') || 'View All'}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {hiddenGems.map((item) => (
                  <DestinationCard
                    key={item.id}
                    destination={item}
                    horizontal
                    onPress={() => setSelectedPlaceModal(item)}
                  />
                ))}
              </ScrollView>
            </ScrollFadeItem>

            {/* All Destinations Across India */}
            <ScrollFadeItem scrollY={scrollY}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    {t('trending') || 'All Travel Destinations Across India'}
                  </Text>
                  <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                    Explore iconic heritage, nature, and coastal hubs ({destinations.length} places)
                  </Text>
                </View>
              </View>
            </ScrollFadeItem>

            {trendingDestinations.map((dest) => (
              <ScrollFadeItem key={dest.id} scrollY={scrollY}>
                <DestinationCard
                  destination={dest}
                  onPress={() => setSelectedPlaceModal(dest)}
                />
              </ScrollFadeItem>
            ))}
          </>
        )}

        {/* Feature Promo Card Matching Left Mockup */}
        <ScrollFadeItem scrollY={scrollY}>
          <View style={styles.promoMockupCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }}
              style={styles.promoMockupImg}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(15,18,25,0.7)', 'rgba(15,18,25,0.94)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>New Feature</Text>
            </View>
            <View style={styles.promoBottomRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.promoTitle}>AI Travel Assistant</Text>
                <Text style={styles.promoSub}>Sit back, relax, and let AI help</Text>
              </View>
              <FloatingPressable
                activeScale={1.1}
                liftY={-3}
                onPress={() => setGemmaModalVisible(true)}
                style={styles.tryItOutBtn}
              >
                <Text style={styles.tryItOutText}>Try it out</Text>
              </FloatingPressable>
            </View>
          </View>
        </ScrollFadeItem>

        <View style={{ height: 110 }} />
      </Animated.ScrollView>

      {/* Floating Travel Assistant Button */}
      <GemmaAIFloatingButton
        bottomOffset={100}
        rightOffset={18}
        onPress={() => setGemmaModalVisible(true)}
      />

      {/* Floating SOS Button */}
      <Animated.View
        style={[
          styles.floatingSOSWrap,
          {
            bottom: 100,
            left: 18,
            transform: [{ scale: sosScale }, { translateY: sosTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.92}
          onPressIn={handleSosPressIn}
          onPressOut={handleSosPressOut}
          onPress={() => navigation.navigate('EmergencySOS')}
          style={[
            styles.floatingSOS,
            {
              backgroundColor: 'rgba(239, 68, 68, 0.94)',
              borderColor: 'rgba(255, 255, 255, 0.35)',
              borderWidth: 1.5,
            },
          ]}
        >
          <Ionicons name="warning" size={16} color="#FFFFFF" />
          <Text style={styles.floatingSOSText}>SOS</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Origin-Expanding Full-Screen Place Detail Modal */}
      <ExpandingPlaceDetailModal
        destination={selectedPlaceModal}
        visible={!!selectedPlaceModal}
        onClose={() => setSelectedPlaceModal(null)}
        navigation={navigation}
      />

      {/* Travel Assistant Modal */}
      <GemmaAssistantModal
        visible={gemmaModalVisible}
        onClose={() => setGemmaModalVisible(false)}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    overflow: 'visible',
  },

  // Search & Filters
  searchSection: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 16,
    height: 52,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  searchFilterBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  selectTripHeading: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 100,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
  },
  promoMockupCard: {
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: '#1C202C',
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  promoMockupImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  promoBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
  },
  promoBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
  promoSub: {
    color: '#8E95A5',
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  tryItOutBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#4F75FF',
  },
  tryItOutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },

  // Search Results
  searchResultsWrap: {
    marginBottom: 20,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  clearFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  clearFilterText: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  emptyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetSearchBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  resetSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontFamily: 'Manrope_700Bold',
  },

  // Spotlight Card (Amer Fort)
  spotlightCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  spotlightImageWrap: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
  },
  spotlightRatingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  spotlightRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  spotlightCategoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  spotlightCategoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.5,
  },
  spotlightContent: {
    padding: 16,
  },
  spotlightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  spotlightTitle: {
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
    flex: 1,
  },
  spotlightLocation: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    marginLeft: 8,
  },
  spotlightDesc: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
    marginBottom: 14,
  },
  spotlightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightMetaGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  spotlightMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spotlightMetaText: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  exploreBtnText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },

  // Eco Summary Card
  ecoSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  ecoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  ecoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecoTitle: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  ecoSub: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 1,
  },
  ecoRight: {
    marginLeft: 8,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
  },
  sectionSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_700Bold',
  },

  // Horizontal List
  horizontalList: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 4,
    marginBottom: 12,
    overflow: 'visible',
  },

  // Floating SOS
  floatingSOSWrap: {
    position: 'absolute',
    zIndex: 999,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingSOS: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 5,
  },
  floatingSOSText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: 0.5,
  },
});
