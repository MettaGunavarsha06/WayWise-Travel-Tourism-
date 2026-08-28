import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTrips } from '../../context/TripContext';
import { destinations } from '../../data/destinations';
import { Header } from '../../components/Header';
import { DestinationCard } from '../../components/DestinationCard';
import { WeatherAlertCard } from '../../components/WeatherAlertCard';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';
import { GemmaAIFloatingButton } from '../../components/GemmaAIFloatingButton';
import { GemmaAssistantModal } from '../../components/GemmaAssistantModal';

export const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { activeTrip, applyWeatherAdjustment } = useTrips();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [weatherApplied, setWeatherApplied] = useState(false);
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

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingDestinations = destinations.filter((d) => d.isTrending);
  const hiddenGems = destinations.filter((d) => d.isHiddenGem);

  const handleApplyWeather = () => {
    applyWeatherAdjustment();
    setWeatherApplied(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header onNotificationsPress={() => navigation.navigate('Notifications')} />

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
              placeholder={t('searchPlaceholder') || 'Where do you want to go?'}
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text, fontFamily: 'Manrope_400Regular' }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hero Banner: Sustainable Heritage Journeys */}
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.heroBanner}
          imageStyle={styles.heroBannerImage}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadge}>
              <Ionicons name="leaf" size={11} color="#166534" />
              <Text style={styles.heroBadgeText}>SUSTAINABLE HERITAGE TRAVEL</Text>
            </View>

            <Text style={styles.heroTitle}>Discover India's Royal Heritage &amp; Serene Landscapes</Text>
            <Text style={styles.heroSubtitle}>
              Curated itineraries, certified green homestays, and crowd-conscious discovery across historic destinations.
            </Text>

            <View style={styles.heroBtnRow}>
              <Button
                title={t('createAITrip') || 'Plan Your Trip'}
                variant="primary"
                size="medium"
                onPress={() => navigation.navigate('TripPlannerWizard')}
                style={styles.heroCtaBtn}
              />
              <Button
                title="Digital Pass"
                variant="outline"
                size="medium"
                icon="qr-code-outline"
                onPress={() => navigation.navigate('DigitalPass')}
                style={styles.heroPassBtn}
                textStyle={{ color: '#FFFFFF' }}
              />
            </View>
          </View>
        </ImageBackground>

        {/* Live Weather Advisory */}
        <WeatherAlertCard
          alertMessage="Heavy coastal rains forecasted tomorrow in Visakhapatnam. We recommend exploring indoor heritage sites such as the INS Kursura Submarine Museum."
          onApplyChanges={handleApplyWeather}
          isApplied={
            weatherApplied || activeTrip?.daysPlan?.some((d) => d.isWeatherAdjusted)
          }
        />

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
          style={[styles.spotlightCard, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}
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
              Handpicked destinations with balanced crowd density
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={[styles.viewAllText, { color: theme.primary }]}>
              {t('viewAll') || 'View All'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filteredDestinations.slice(0, 4)}
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

        {/* Hidden Gems */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('hiddenGems') || 'Hidden Gems'}
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

        {/* All Destinations */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t('trending') || 'All Travel Destinations'}
          </Text>
        </View>

        {trendingDestinations.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            onPress={() => navigation.navigate('DestinationDetail', { destination: dest })}
          />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Travel Assistant Button */}
      <GemmaAIFloatingButton
        bottomOffset={76}
        rightOffset={18}
        onPress={() => setGemmaModalVisible(false || true)}
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

  // Search
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
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },

  // Hero Banner
  heroBanner: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    minHeight: 210,
  },
  heroBannerImage: {
    borderRadius: 18,
  },
  heroOverlay: {
    backgroundColor: 'rgba(12, 38, 18, 0.68)',
    padding: 20,
    borderRadius: 18,
    minHeight: 210,
    justifyContent: 'flex-end',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(187, 247, 208, 0.95)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#166534',
    fontSize: 10,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    color: '#D1FAE5',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroCtaBtn: {
    flex: 1.3,
  },
  heroPassBtn: {
    flex: 1,
    borderColor: 'rgba(255,255,255,0.7)',
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
    top: 12,
    left: 12,
    backgroundColor: 'rgba(180, 83, 9, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  spotlightCategoryText: {
    color: '#FEF3C7',
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.3,
  },
  spotlightContent: {
    padding: 14,
  },
  spotlightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  spotlightTitle: {
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
  },
  spotlightLocation: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  spotlightDesc: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
    marginBottom: 12,
  },
  spotlightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  spotlightMetaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
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
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
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
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  ecoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flex: 1,
  },
  ecoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecoTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
  },
  ecoSub: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
    lineHeight: 16,
  },
  ecoRight: {
    marginLeft: 8,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
    lineHeight: 16,
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
  },

  // Quick Grid (Services)
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  quickCard: {
    width: '31%',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
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

  // Destination lists
  horizontalList: {
    paddingBottom: 16,
  },

  // Floating SOS Button
  floatingSOS: {
    position: 'absolute',
    bottom: 24,
    right: 18,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 7,
  },
  floatingSOSText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: 0.5,
  },
});
