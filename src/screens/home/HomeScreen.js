import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ImageBackground
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
    // Use plain View — Header handles top safe area with useSafeAreaInsets
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header onNotificationsPress={() => navigation.navigate('Notifications')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Search Bar ── */}
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

        {/* ── Hero Banner ── */}
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',
          }}
          style={styles.heroBanner}
          imageStyle={styles.heroBannerImage}
        >
          {/* Soft green-nature gradient overlay — not a dark AI overlay */}
          <View style={styles.heroOverlay}>
            {/* Tag */}
            <View style={styles.heroBadge}>
              <Ionicons name="leaf" size={10} color="#166534" />
              <Text style={styles.heroBadgeText}>SIH 2026 · SUSTAINABLE TRAVEL</Text>
            </View>

            <Text style={styles.heroTitle}>Plan Your Perfect{'\n'}Eco-Smart Journey</Text>
            <Text style={styles.heroSubtitle}>
              AI-powered itineraries, green hotels &amp; eco-transit — all in one place.
            </Text>

            <View style={styles.heroBtnRow}>
              <Button
                title={t('createAITrip') || '✨ Plan My Trip'}
                variant="primary"
                size="medium"
                onPress={() => navigation.navigate('TripPlannerWizard')}
                style={styles.heroCtaBtn}
              />
              <Button
                title="My Pass"
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

        {/* ── Smart Travel Tip (Weather Alert) ── */}
        <WeatherAlertCard
          alertMessage="🌧️ Heavy rain expected tomorrow in Visakhapatnam. We suggest swapping beach activities with INS Kursura Submarine Museum — an indoor gem!"
          onApplyChanges={handleApplyWeather}
          isApplied={
            weatherApplied || activeTrip?.daysPlan?.some((d) => d.isWeatherAdjusted)
          }
        />

        {/* ── Eco / Sustainability Card ── */}
        <View
          style={[
            styles.ecoSummaryCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.ecoLeft}>
            <View style={[styles.ecoIconBox, { backgroundColor: theme.ecoGreenLight }]}>
              <Ionicons name="leaf" size={22} color={theme.ecoGreen} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.ecoTitle, { color: theme.text }]}>
                Tourism Sustainability
              </Text>
              <Text style={[styles.ecoSub, { color: theme.textSecondary }]}>
                Green-verified hotels &amp; electric public transit
              </Text>
            </View>
          </View>
          <View style={styles.ecoRight}>
            <EcoScoreBadge score={86} showLabel={false} />
          </View>
        </View>

        {/* ── Explore Ecosystem ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore</Text>
        </View>
        <View style={styles.quickGrid}>
          {[
            { label: 'AI Planner', icon: 'sparkles', bg: theme.primaryLight, color: theme.primary, screen: 'TripPlannerWizard' },
            { label: t('hotels') || 'Hotels', icon: 'bed', bg: '#EFF6FF', color: '#2563EB', screen: 'Hotels' },
            { label: t('transport') || 'Transit', icon: 'train', bg: '#FFF7ED', color: '#C2410C', screen: 'Transport' },
            { label: 'Artisans', icon: 'storefront', bg: '#FDF4FF', color: '#9333EA', screen: 'LocalBusiness' },
            { label: 'Hidden Gems', icon: 'diamond', bg: '#F0FDF4', color: theme.primary, screen: 'HiddenGems' },
            { label: 'Budget', icon: 'wallet', bg: '#ECFEFF', color: '#0891B2', screen: 'BudgetOptimizer' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigation.navigate(item.screen)}
              style={[styles.quickCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              activeOpacity={0.8}
            >
              <View style={[styles.quickIcon, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={21} color={item.color} />
              </View>
              <Text style={[styles.quickText, { color: theme.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Recommended Destinations ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('recommended') || 'Recommended'}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Curated for balanced crowds &amp; cultural depth
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

        {/* ── Hidden Gems ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('hiddenGems') || 'Hidden Gems'}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Discover lesser-known places with zero crowds
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

        {/* ── Trending Destinations ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t('trending') || 'Trending Destinations'}
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

      {/* ── Floating WayWise AI Button ── */}
      <GemmaAIFloatingButton
        bottomOffset={76}
        rightOffset={18}
        onPress={() => setGemmaModalVisible(true)}
      />

      {/* ── Floating SOS Button ── */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('EmergencySOS')}
        style={styles.floatingSOS}
      >
        <Ionicons name="warning" size={18} color="#FFFFFF" />
        <Text style={styles.floatingSOSText}>SOS</Text>
      </TouchableOpacity>

      {/* ── Gemma AI Modal ── */}
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
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 13,
    height: 48,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
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
    minHeight: 200,
  },
  heroBannerImage: {
    borderRadius: 18,
  },
  heroOverlay: {
    // Nature-oriented: semi-transparent dark green overlay (not heavy AI dark)
    backgroundColor: 'rgba(10, 40, 15, 0.62)',
    padding: 20,
    borderRadius: 18,
    minHeight: 200,
    justifyContent: 'flex-end',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(187, 247, 208, 0.92)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#166534',
    fontSize: 9,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: 'Manrope_700Bold',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 30,
  },
  heroSubtitle: {
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
    color: '#D1FAE5',
    lineHeight: 19,
    marginBottom: 16,
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroCtaBtn: {
    flex: 1.4,
  },
  heroPassBtn: {
    flex: 1,
    borderColor: 'rgba(255,255,255,0.7)',
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
    width: 42,
    height: 42,
    borderRadius: 12,
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
    fontSize: 17,
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

  // Quick Grid (Explore Ecosystem)
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
    paddingVertical: 13,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
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

  // Floating SOS Button — clearly red, distinct from green brand
  floatingSOS: {
    position: 'absolute',
    bottom: 24,
    right: 18,
    backgroundColor: '#C62828',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    gap: 5,
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 7,
    borderWidth: 2,
    borderColor: '#FFCDD2',
  },
  floatingSOSText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: 0.5,
  },
});
