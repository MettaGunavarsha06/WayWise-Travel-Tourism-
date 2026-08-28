import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ImageBackground,
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
  const [weatherApplied, setWeatherApplied] = useState(false);
  const [gemmaModalVisible, setGemmaModalVisible] = useState(false);

  const filteredDestinations = destinations.filter((d) =>
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        onNotificationsPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="search-outline" size={20} color={theme.textMuted} style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('searchPlaceholder') || 'Where do you want to go?'}
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 30-Second Judge Demo Hero Card */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1000&q=80' }}
          style={styles.heroBanner}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>⚡ 30-SEC SIH 2026 DEMO</Text>
            </View>
            <Text style={styles.heroTitle}>Plan Your Smart AI Trip</Text>
            <Text style={styles.heroSubtitle}>
              Tell us your destination, budget & interests. AI generates full itinerary, eco-hotel booking & transit!
            </Text>

            <View style={styles.heroBtnRow}>
              <Button
                title={t('createAITrip') || '✨ Create AI Trip'}
                variant="secondary"
                size="medium"
                onPress={() => navigation.navigate('TripPlannerWizard')}
                style={styles.heroCtaBtn}
              />
              <Button
                title="View Active Pass"
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

        {/* Live Weather & Smart Plan Adjustment Banner */}
        <WeatherAlertCard
          alertMessage="🌧️ Heavy rain expected tomorrow in Visakhapatnam. Swap outdoor beach trip to INS Kursura Submarine & TU 142 Aircraft Museum."
          onApplyChanges={handleApplyWeather}
          isApplied={weatherApplied || activeTrip?.daysPlan?.some((d) => d.isWeatherAdjusted)}
        />

        {/* Eco Score & Quick Highlights Card */}
        <View style={[styles.ecoSummaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.ecoLeft}>
            <View style={[styles.ecoIconBox, { backgroundColor: theme.ecoGreenLight }]}>
              <Ionicons name="leaf" size={24} color={theme.ecoGreen} />
            </View>
            <View>
              <Text style={[styles.ecoTitle, { color: theme.text }]}>Tourism Sustainability</Text>
              <Text style={[styles.ecoSub, { color: theme.textSecondary }]}>
                Green verified hotels & electric public transport
              </Text>
            </View>
          </View>
          <EcoScoreBadge score={86} showLabel={false} />
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Ecosystem</Text>
        </View>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TripPlannerWizard')}
            style={[styles.quickCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="sparkles" size={22} color="#059669" />
            </View>
            <Text style={[styles.quickText, { color: theme.text }]}>AI Planner</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Hotels')}
            style={[styles.quickCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="bed" size={22} color="#3B82F6" />
            </View>
            <Text style={[styles.quickText, { color: theme.text }]}>{t('hotels') || 'Hotels'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Transport')}
            style={[styles.quickCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="train" size={22} color="#D97706" />
            </View>
            <Text style={[styles.quickText, { color: theme.text }]}>{t('transport') || 'Transport'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('LocalBusiness')}
            style={[styles.quickCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#FDF2F8' }]}>
              <Ionicons name="storefront" size={22} color="#DB2777" />
            </View>
            <Text style={[styles.quickText, { color: theme.text }]}>Local Artisans</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('HiddenGems')}
            style={[styles.quickCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="diamond" size={22} color="#7C3AED" />
            </View>
            <Text style={[styles.quickText, { color: theme.text }]}>Hidden Gems</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('BudgetOptimizer')}
            style={[styles.quickCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#ECFEFF' }]}>
              <Ionicons name="wallet" size={22} color="#0891B2" />
            </View>
            <Text style={[styles.quickText, { color: theme.text }]}>Budget Optimizer</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Destinations Carousel */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('recommended') || 'Recommended Destinations'}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Curated for balanced crowds and cultural depth
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={[styles.viewAllText, { color: theme.primary }]}>{t('viewAll') || 'View All'}</Text>
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

        {/* Hidden Gems Spotlight (Lesser-known alternatives) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              💎 {t('hiddenGems') || 'Hidden Gems & Zero Crowds'}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Distributing tourism away from overcrowded hubs
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('HiddenGems')}>
            <Text style={[styles.viewAllText, { color: theme.primary }]}>{t('viewAll') || 'View All'}</Text>
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

        {/* Trending Destinations Vertical List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🔥 {t('trending') || 'Trending Destinations'}
          </Text>
        </View>

        {trendingDestinations.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            onPress={() => navigation.navigate('DestinationDetail', { destination: dest })}
          />
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Gemma AI Assistant Pop-up Button (Placed directly above SOS) */}
      <GemmaAIFloatingButton
        bottomOffset={76}
        rightOffset={18}
        onPress={() => setGemmaModalVisible(true)}
      />

      {/* Floating Emergency SOS Quick Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('EmergencySOS')}
        style={styles.floatingSOS}
      >
        <Ionicons name="warning" size={20} color="#FFFFFF" />
        <Text style={styles.floatingSOSText}>SOS</Text>
      </TouchableOpacity>

      {/* Google Gemma AI Assistant Interactive Pop-up Modal */}
      <GemmaAssistantModal
        visible={gemmaModalVisible}
        onClose={() => setGemmaModalVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchSection: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  heroBanner: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    padding: 18,
    borderRadius: 20,
  },
  heroBadge: {
    backgroundColor: '#F59E0B',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 17,
    marginBottom: 14,
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
    borderColor: '#FFFFFF',
  },
  ecoSummaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
  },
  ecoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    fontWeight: '700',
  },
  ecoSub: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  quickCard: {
    width: '31%',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  horizontalList: {
    paddingBottom: 16,
  },
  floatingSOS: {
    position: 'absolute',
    bottom: 24,
    right: 18,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingSOSText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
