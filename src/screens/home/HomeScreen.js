import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { destinations } from '../../data/destinations';
import { Header } from '../../components/Header';
import { DestinationCard } from '../../components/DestinationCard';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { GemmaAIFloatingButton } from '../../components/GemmaAIFloatingButton';
import { GemmaAssistantModal } from '../../components/GemmaAssistantModal';

const FILTER_CATEGORIES = [
  'All India',
  'Hills & Snow',
  'Royal Heritage',
  'Beaches & Coast',
  'Spiritual',
  'Eco Nature',
  'South India',
  'North India',
  'East & Islands',
];

export const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All India');
  const [gemmaModalVisible, setGemmaModalVisible] = useState(false);

  const jaipurDest = destinations.find((d) => d.id === 'dest_jaipur') || destinations[4];
  const amerFortAttraction = jaipurDest?.attractions?.find((a) => a.id === 'j1') || {
    name: 'Amer Fort',
    location: 'Jaipur, Rajasthan',
    description: 'A historic hilltop fort known for its grand courtyards, architecture and views.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    time: '3 hrs',
    cost: 200,
  };

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        (d.attractions && d.attractions.some((a) => a.name.toLowerCase().includes(q)));

      let matchesCategory = true;
      if (selectedFilter === 'Hills & Snow') {
        matchesCategory =
          d.category.includes('Snow') ||
          d.category.includes('Hills') ||
          d.category.includes('Mountain') ||
          ['Himachal Pradesh', 'Jammu & Kashmir', 'Ladakh', 'Uttarakhand', 'Sikkim', 'Meghalaya', 'West Bengal'].includes(d.state);
      } else if (selectedFilter === 'Royal Heritage') {
        matchesCategory =
          d.category.includes('Heritage') ||
          d.category.includes('Palaces') ||
          d.category.includes('Ruins') ||
          d.category.includes('Forts') ||
          ['Rajasthan', 'Delhi', 'Uttar Pradesh', 'Karnataka', 'Telangana'].includes(d.state);
      } else if (selectedFilter === 'Beaches & Coast') {
        matchesCategory =
          d.category.includes('Beaches') ||
          d.category.includes('Islands') ||
          d.category.includes('Coast') ||
          ['Goa', 'Andhra Pradesh', 'Tamil Nadu', 'Maharashtra', 'Kerala', 'Andaman and Nicobar'].includes(d.state);
      } else if (selectedFilter === 'Spiritual') {
        matchesCategory =
          d.category.includes('Spiritual') ||
          d.category.includes('Spirituality') ||
          d.category.includes('Ghats') ||
          ['Varanasi', 'Tirupati & Chandragiri', 'Rishikesh & Haridwar', 'Amritsar', 'Madurai'].some((n) => d.name.includes(n));
      } else if (selectedFilter === 'Eco Nature') {
        matchesCategory = d.ecoScore >= 90 || d.category.includes('Nature') || d.category.includes('Eco');
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
      <Header
        onNotificationsPress={() => navigation.navigate('Notifications')}
        onWeatherPress={() => navigation.navigate('WeatherTab')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: theme.card,
                borderColor: searchFocused ? theme.primary : theme.border,
                shadowColor: theme.shadow,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={19}
              color={searchFocused ? theme.primary : theme.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search all places in India (e.g. Manali, Goa, Jaipur, Kerala)..."
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text, fontFamily: 'Manrope_400Regular' }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Region & Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = selectedFilter === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isActive ? theme.primary : theme.card,
                      borderColor: isActive ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedFilter(cat)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterText,
                      { color: isActive ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
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
                <TouchableOpacity
                  style={[styles.resetSearchBtn, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedFilter('All India');
                  }}
                >
                  <Text style={styles.resetSearchBtnText}>View All Destinations</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredDestinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  onPress={() => navigation.navigate('DestinationDetail', { destination: dest })}
                />
              ))
            )}
          </View>
        ) : (
          <>
            {/* Spotlight: Featured Heritage Attraction (Amer Fort) */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Heritage Attraction</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                  Iconic landmarks and historic architecture
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('DestinationDetail', { destination: jaipurDest })}
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
                        {amerFortAttraction.time || '3 hrs'}
                      </Text>
                    </View>
                    <View style={styles.spotlightMetaItem}>
                      <Ionicons name="ticket-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.spotlightMetaText, { color: theme.textSecondary }]}>
                        ₹{amerFortAttraction.cost || 200} entry
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('DestinationDetail', { destination: jaipurDest })}
                    style={[styles.exploreBtn, { backgroundColor: theme.primaryLight }]}
                  >
                    <Text style={[styles.exploreBtnText, { color: theme.primaryDark }]}>Explore Jaipur</Text>
                    <Ionicons name="arrow-forward" size={14} color={theme.primaryDark} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* Sustainability Impact Summary */}
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
                    Certified eco-stays, low-emission transit &amp; local artisan cooperatives
                  </Text>
                </View>
              </View>
              <View style={styles.ecoRight}>
                <EcoScoreBadge score={86} showLabel={false} />
              </View>
            </View>

            {/* Quick Travel Services Navigation */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Services</Text>
            </View>
            <View style={styles.quickGrid}>
              {[
                { label: 'Trip Planner', icon: 'map-outline', bg: theme.primaryLight, color: theme.primary, screen: 'TripPlannerWizard' },
                { label: t('hotels') || 'Hotels', icon: 'bed-outline', bg: '#EFF6FF', color: '#2563EB', screen: 'Hotels' },
                { label: t('transport') || 'Transit', icon: 'train-outline', bg: '#FFF7ED', color: '#C2410C', screen: 'Transport' },
                { label: 'Artisans', icon: 'storefront-outline', bg: '#FDF4FF', color: '#9333EA', screen: 'LocalBusiness' },
                { label: 'Hidden Gems', icon: 'compass-outline', bg: '#F0FDF4', color: theme.primary, screen: 'HiddenGems' },
                { label: 'Budget', icon: 'wallet-outline', bg: '#ECFEFF', color: '#0891B2', screen: 'BudgetOptimizer' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => navigation.navigate(item.screen)}
                  style={[styles.quickCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  activeOpacity={0.8}
                >
                  <View style={[styles.quickIcon, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={[styles.quickText, { color: theme.text }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recommended Destinations */}
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

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={destinations.slice(0, 8)}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <DestinationCard
                  destination={item}
                  horizontal
                  onPress={() => navigation.navigate('DestinationDetail', { destination: item })}
                />
              )}
            />

            {/* Hidden Gems & Offbeat Escapes */}
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

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={hiddenGems}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <DestinationCard
                  destination={item}
                  horizontal
                  onPress={() => navigation.navigate('DestinationDetail', { destination: item })}
                />
              )}
            />

            {/* All Destinations Across India */}
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

            {trendingDestinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onPress={() => navigation.navigate('DestinationDetail', { destination: dest })}
              />
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Travel Assistant Button */}
      <GemmaAIFloatingButton
        bottomOffset={76}
        rightOffset={18}
        onPress={() => setGemmaModalVisible(true)}
      />

      {/* Floating SOS Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('EmergencySOS')}
        style={styles.floatingSOS}
      >
        <Ionicons name="warning" size={16} color="#FFFFFF" />
        <Text style={styles.floatingSOSText}>SOS</Text>
      </TouchableOpacity>

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
  },

  // Search & Filters
  searchSection: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    height: '100%',
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
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

  // Quick Services Grid
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  quickCard: {
    width: '30.8%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickText: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
    textAlign: 'center',
  },

  // Horizontal List
  horizontalList: {
    paddingBottom: 8,
    marginBottom: 16,
  },

  // Floating SOS
  floatingSOS: {
    position: 'absolute',
    bottom: 76,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingSOSText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: 0.5,
  },
});
