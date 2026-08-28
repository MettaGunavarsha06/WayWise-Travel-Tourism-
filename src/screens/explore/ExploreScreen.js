import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList
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
const crowdFilters = ['All Crowds', '🟢 Low', '🟡 Moderate', '🔴 High'];

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
    if (selectedCrowd.includes('Low')) matchesCrowd = dest.crowdLevel === 'low';
    if (selectedCrowd.includes('Moderate')) matchesCrowd = dest.crowdLevel === 'moderate';
    if (selectedCrowd.includes('High')) matchesCrowd = dest.crowdLevel === 'high';

    let matchesEco = true;
    if (ecoOnly) matchesEco = dest.ecoScore >= 85;

    return matchesSearch && matchesCategory && matchesCrowd && matchesEco;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Header — uses insets for top safe area */}
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
          {t('explore') || 'Explore'}
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
            size={19}
            color={searchFocused ? theme.primary : theme.textMuted}
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={t('searchPlaceholder') || 'Search cities, beaches, temples...'}
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
            { label: 'Eco Hotels', icon: 'bed', bg: theme.primaryLight, color: theme.primary, screen: 'Hotels' },
            { label: 'Transit', icon: 'train', bg: '#FFF7ED', color: '#C2410C', screen: 'Transport' },
            { label: 'Artisans', icon: 'storefront', bg: '#FDF4FF', color: '#9333EA', screen: 'LocalBusiness' },
            { label: 'Gems', icon: 'diamond', bg: '#F0FDF4', color: theme.ecoGreen, screen: 'HiddenGems' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigation.navigate(item.screen)}
              style={[styles.portalCard, { backgroundColor: item.bg, borderColor: theme.border }]}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon} size={20} color={item.color} />
              <Text style={[styles.portalText, { color: item.color }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
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
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Crowd Filter + Eco Toggle */}
        <View style={styles.subFilterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subFilterScroll}>
            {crowdFilters.map((crowd) => {
              const isSelected = selectedCrowd === crowd;
              return (
                <TouchableOpacity
                  key={crowd}
                  onPress={() => setSelectedCrowd(crowd)}
                  style={[
                    styles.subChip,
                    {
                      backgroundColor: isSelected ? theme.primaryLight : theme.card,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.subChipText,
                      { color: isSelected ? theme.primaryDark : theme.textSecondary },
                    ]}
                  >
                    {crowd}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Eco Only Toggle */}
            <TouchableOpacity
              onPress={() => setEcoOnly(!ecoOnly)}
              style={[
                styles.subChip,
                {
                  backgroundColor: ecoOnly ? theme.ecoGreenLight : theme.card,
                  borderColor: ecoOnly ? theme.ecoGreen : theme.border,
                },
              ]}
              activeOpacity={0.8}
            >
              <Ionicons
                name="leaf"
                size={12}
                color={ecoOnly ? theme.ecoGreen : theme.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.subChipText,
                  {
                    color: ecoOnly ? theme.ecoGreen : theme.textSecondary,
                    fontFamily: ecoOnly ? 'Manrope_700Bold' : 'Manrope_500Medium',
                  },
                ]}
              >
                Eco 85+ 🌱
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Results Count */}
        <View style={styles.resultsBar}>
          <Text style={[styles.resultsCount, { color: theme.textSecondary }]}>
            {filtered.length} destination{filtered.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {/* Destinations */}
        {filtered.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            onPress={() => navigation.navigate('DestinationDetail', { destination: dest })}
          />
        ))}

        {filtered.length === 0 && (
          <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="compass-outline" size={40} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No destinations match
            </Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              Try adjusting your filters or search keyword.
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating WayWise AI Button */}
      <GemmaAIFloatingButton
        bottomOffset={24}
        rightOffset={18}
        onPress={() => setGemmaModalVisible(true)}
      />

      {/* Gemma AI Modal */}
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
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 13,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  scrollContent: {
    padding: 16,
  },

  // Service Portals
  portalsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  portalCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 5,
  },
  portalText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },

  // Chips
  chipsRow: {
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  subFilterRow: {
    marginBottom: 14,
  },
  subFilterScroll: {
    gap: 8,
  },
  subChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  subChipText: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },

  // Results
  resultsBar: {
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },

  // Empty state
  emptyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
});
