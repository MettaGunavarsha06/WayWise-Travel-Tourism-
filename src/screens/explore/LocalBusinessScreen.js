import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useBusinesses } from '../../context/BusinessContext';
import { BusinessCard } from '../../components/BusinessCard';
import { Button } from '../../components/Button';

const categories = [
  'All',
  'Handicrafts',
  'Local Guides',
  'Restaurants',
  'Adventure',
  'Cultural Experiences',
  'Homestays',
];

export const LocalBusinessScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { businesses } = useBusinesses();

  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const filteredBusinesses = businesses.filter((b) => {
    const matchCat = selectedCat === 'All' || b.category.toLowerCase() === selectedCat.toLowerCase();
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Local Artisans & Businesses</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('RegisterBusiness')}
          style={[styles.registerPill, { backgroundColor: theme.primaryLight }]}
        >
          <Text style={[styles.registerText, { color: theme.primaryDark }]}>+ Register</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Mission Card */}
        <View style={[styles.empowerCard, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}>
          <Ionicons name="storefront" size={24} color="#DB2777" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.empowerTitle, { color: '#9D174D' }]}>
              Empowering Grassroots Tourism
            </Text>
            <Text style={[styles.empowerDesc, { color: '#BE185D' }]}>
              Discover certified local craftsmen, tribal cooperatives, and licensed heritage guides with zero commission middlemen.
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={18} color={theme.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search crafts, guides, homestays..."
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>

        {/* Category Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {categories.map((cat) => {
            const isSelected = selectedCat === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCat(cat)}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catChipText,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.listHeadingRow}>
          <Text style={[styles.listHeading, { color: theme.text }]}>
            Verified Vendors ({filteredBusinesses.length})
          </Text>
        </View>

        {/* Business Cards List */}
        {filteredBusinesses.map((biz) => (
          <BusinessCard key={biz.id} business={biz} />
        ))}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  registerPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  registerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  empowerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  empowerTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  empowerDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  chipScroll: {
    gap: 8,
    marginBottom: 16,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listHeadingRow: {
    marginBottom: 12,
  },
  listHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
});
