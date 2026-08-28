import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { destinations } from '../../data/destinations';
import { DestinationCard } from '../../components/DestinationCard';
import { GemmaAIFloatingButton } from '../../components/GemmaAIFloatingButton';
import { GemmaAssistantModal } from '../../components/GemmaAssistantModal';

const categories = ['All', 'Beaches', 'Nature', 'Heritage', 'Spiritual', 'Hidden Gems'];
const crowdFilters = ['All Crowds', 'Low Crowd', 'Moderate Crowd', 'High Crowd'];

export const ExploreScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCrowd, setSelectedCrowd] = useState('All Crowds');
  const [ecoOnly, setEcoOnly] = useState(false);
  const [gemmaModalVisible, setGemmaModalVisible] = useState(false);

  const filtered = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(search.toLowerCase()) ||
      dest.state.toLowerCase().includes(search.toLowerCase()) ||
      dest.category.toLowerCase().includes(search.toLowerCase());

    let matchesCategory = true;
    if (selectedCategory === 'Hidden Gems') {
      matchesCategory = dest.isHiddenGem;
    } else if (selectedCategory !== 'All') {
      matchesCategory = dest.category.toLowerCase().includes(selectedCategory.toLowerCase());
    }

    let matchesCrowd = true;
    if (selectedCrowd === 'Low Crowd') matchesCrowd = dest.crowdLevel === 'low';
    if (selectedCrowd === 'Moderate Crowd') matchesCrowd = dest.crowdLevel === 'moderate';
    if (selectedCrowd === 'High Crowd') matchesCrowd = dest.crowdLevel === 'high';

    let matchesEco = true;
    if (ecoOnly) matchesEco = dest.ecoScore >= 85;

    return matchesSearch && matchesCategory && matchesCrowd && matchesEco;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.card,
            borderBottomColor: theme.border,
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <Text style={[styles.screenTitle, { color: theme.text }]}>
          {t('explore') || 'Explore Destinations'}
        </Text>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.cardSecondary,
              borderColor: searchFocused ? theme.primary : theme.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={searchFocused ? theme.primary : theme.textMuted}
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={t('searchPlaceholder') || 'Search cities, beaches, temples, heritage...'}
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text, fontFamily: 'Manrope_400Regular' }]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Service Portals */}
        <View style={styles.portalsRow}>
          {[
            { label: 'Eco Hotels', icon: 'bed-outline', bg: theme.primaryLight, color: theme.primary, screen: 'Hotels' },
            { label: 'Transit', icon: 'train-outline', bg: '#FFF7ED', color: '#C2410C', screen: 'Transport' },
            { label: 'Artisans', icon: 'storefront-outline', bg: '#FDF4FF', color: '#9333EA', screen: 'LocalBusiness' },
            { label: 'Hidden Gems', icon: 'compass-outline', bg: '#F0FDF4', color: theme.ecoGreen, screen: 'HiddenGems' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigation.navigate(item.screen)}
              style={[styles.portalCard, { backgroundColor: item.bg, borderColor: theme.border }]}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon} size={20} color={item.color} />
              <Text style={[styles.portalLabel, { color: theme.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Filters */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.card,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: isSelected ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Secondary Filters (Crowd & Eco) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollSub}>
            {crowdFilters.map((cr) => {
              const isSelected = selectedCrowd === cr;
              return (
                <TouchableOpacity
                  key={cr}
                  onPress={() => setSelectedCrowd(cr)}
                  style={[
                    styles.filterSubChip,
                    {
                      backgroundColor: isSelected ? theme.cardSecondary : theme.card,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  {cr !== 'All Crowds' && (
                    <View
                      style={[
                        styles.crowdDot,
                        {
                          backgroundColor:
                            cr === 'Low Crowd' ? '#15803D' : cr === 'Moderate Crowd' ? '#D97706' : '#DC2626',
                        },
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.filterSubChipText,
                      { color: isSelected ? theme.primary : theme.textSecondary },
                    ]}
                  >
                    {cr}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={() => setEcoOnly(!ecoOnly)}
              style={[
                styles.filterSubChip,
                {
                  backgroundColor: ecoOnly ? theme.ecoGreenLight : theme.card,
                  borderColor: ecoOnly ? theme.ecoGreen : theme.border,
                },
              ]}
            >
              <Ionicons name="leaf-outline" size={13} color={ecoOnly ? theme.ecoGreen : theme.textSecondary} />
              <Text
                style={[
                  styles.filterSubChipText,
                  { color: ecoOnly ? theme.ecoGreen : theme.textSecondary },
                ]}
              >
                High Eco-Score
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Results Counter */}
        <View style={styles.resultsRow}>
          <Text style={[styles.resultsCount, { color: theme.textSecondary }]}>
            Showing {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'}
          </Text>
        </View>

        {/* Destination Cards List */}
        {filtered.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            onPress={() => navigation.navigate('DestinationDetail', { destination: dest })}
          />
        ))}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Travel Assistant Button */}
      <GemmaAIFloatingButton
        bottomOffset={76}
        rightOffset={18}
        onPress={() => setGemmaModalVisible(true)}
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
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
  },
  scrollContent: {
    padding: 16,
  },
  portalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  portalCard: {
    width: '23%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
  },
  portalLabel: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  filterSection: {
    marginBottom: 14,
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 8,
  },
  filterScrollSub: {
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  filterSubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterSubChipText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
  },
  crowdDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  resultsRow: {
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
});
