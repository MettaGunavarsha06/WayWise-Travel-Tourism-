import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { destinations } from '../../data/destinations';
import { DestinationCard } from '../../components/DestinationCard';

const categories = ['All', 'Beaches', 'Nature', 'Heritage', 'Spiritual', 'Hidden Gems'];
const crowdFilters = ['All Crowds', '🟢 Low Crowd Only', '🟡 Moderate', '🔴 High'];

export const ExploreScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCrowd, setSelectedCrowd] = useState('All Crowds');
  const [ecoOnly, setEcoOnly] = useState(false);

  const filtered = destinations.filter((dest) => {
    // Search filter
    const matchesSearch =
      dest.name.toLowerCase().includes(search.toLowerCase()) ||
      dest.state.toLowerCase().includes(search.toLowerCase()) ||
      dest.category.toLowerCase().includes(search.toLowerCase());

    // Category filter
    let matchesCategory = true;
    if (selectedCategory === 'Hidden Gems') {
      matchesCategory = dest.isHiddenGem;
    } else if (selectedCategory !== 'All') {
      matchesCategory = dest.category.toLowerCase().includes(selectedCategory.toLowerCase());
    }

    // Crowd filter
    let matchesCrowd = true;
    if (selectedCrowd.includes('Low')) matchesCrowd = dest.crowdLevel === 'low';
    if (selectedCrowd.includes('Moderate')) matchesCrowd = dest.crowdLevel === 'moderate';
    if (selectedCrowd.includes('High')) matchesCrowd = dest.crowdLevel === 'high';

    // Eco filter
    let matchesEco = true;
    if (ecoOnly) matchesEco = dest.ecoScore >= 85;

    return matchesSearch && matchesCategory && matchesCrowd && matchesEco;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={20} color={theme.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('searchPlaceholder') || 'Search cities, beaches, temples...'}
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
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
          <TouchableOpacity
            onPress={() => navigation.navigate('Hotels')}
            style={[styles.portalCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
          >
            <Ionicons name="bed" size={20} color="#2563EB" />
            <Text style={[styles.portalText, { color: '#1E40AF' }]}>Eco Hotels</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Transport')}
            style={[styles.portalCard, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}
          >
            <Ionicons name="train" size={20} color="#D97706" />
            <Text style={[styles.portalText, { color: '#92400E' }]}>Transport</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('LocalBusiness')}
            style={[styles.portalCard, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}
          >
            <Ionicons name="storefront" size={20} color="#DB2777" />
            <Text style={[styles.portalText, { color: '#9D174D' }]}>Artisans</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('HiddenGems')}
            style={[styles.portalCard, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}
          >
            <Ionicons name="diamond" size={20} color="#7C3AED" />
            <Text style={[styles.portalText, { color: '#5B21B6' }]}>Gems</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
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

        {/* Crowd Filter Chips & Eco Toggle */}
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
            >
              <Ionicons name="leaf" size={12} color={ecoOnly ? theme.ecoGreen : theme.textSecondary} style={{ marginRight: 4 }} />
              <Text
                style={[
                  styles.subChipText,
                  { color: ecoOnly ? theme.ecoGreen : theme.textSecondary, fontWeight: ecoOnly ? '700' : '500' },
                ]}
              >
                Eco Score 85+ 🌱
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Results Counter */}
        <View style={styles.resultsBar}>
          <Text style={[styles.resultsCount, { color: theme.textSecondary }]}>
            Showing {filtered.length} Destination{filtered.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Destinations List */}
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
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No destinations match criteria</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              Try resetting crowd filters or search keyword.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  scrollContent: {
    padding: 16,
  },
  portalsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  portalCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 4,
  },
  portalText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chipsRow: {
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
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
    fontWeight: '600',
  },
  resultsBar: {
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
