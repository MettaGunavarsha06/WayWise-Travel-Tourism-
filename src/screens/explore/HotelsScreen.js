import React, { useState, useMemo } from 'react';
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
import { hotels } from '../../data/hotels';
import { HotelCard } from '../../components/HotelCard';

const priceRanges = ['All', 'Under ₹2,500', '₹2,500 - ₹4,500', 'Above ₹4,500'];

export const HotelsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [ecoOnly, setEcoOnly] = useState(false);
  const [minRating45, setMinRating45] = useState(false);

  // Extract all unique destination cities
  const uniqueCities = useMemo(() => {
    const citySet = new Set(hotels.map((h) => h.destinationName));
    return ['All Cities', ...Array.from(citySet)];
  }, []);

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      const q = searchCity.toLowerCase().trim();
      const matchesSearch =
        !q ||
        h.destinationName.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q) ||
        h.type.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q);

      let matchesCity = true;
      if (selectedCity !== 'All Cities') {
        matchesCity = h.destinationName.toLowerCase() === selectedCity.toLowerCase();
      }

      let matchesPrice = true;
      if (selectedPrice === 'Under ₹2,500') matchesPrice = h.pricePerNight < 2500;
      if (selectedPrice === '₹2,500 - ₹4,500') matchesPrice = h.pricePerNight >= 2500 && h.pricePerNight <= 4500;
      if (selectedPrice === 'Above ₹4,500') matchesPrice = h.pricePerNight > 4500;

      let matchesEco = true;
      if (ecoOnly) matchesEco = h.sustainabilityScore >= 90;

      let matchesRating = true;
      if (minRating45) matchesRating = h.rating >= 4.7;

      return matchesSearch && matchesCity && matchesPrice && matchesEco && matchesRating;
    });
  }, [searchCity, selectedCity, selectedPrice, ecoOnly, minRating45]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>All India Verified Eco-Stays</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* City Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={theme.primary} style={{ marginRight: 8 }} />
          <TextInput
            value={searchCity}
            onChangeText={setSearchCity}
            placeholder="Search hotels by city (e.g. Manali, Goa, Jaipur, Mumbai)..."
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text, fontFamily: 'Manrope_400Regular' }]}
          />
          {searchCity.length > 0 && (
            <TouchableOpacity onPress={() => setSearchCity('')}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* City Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.citiesScroll}
        >
          {uniqueCities.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <TouchableOpacity
                key={city}
                onPress={() => setSelectedCity(city)}
                style={[
                  styles.cityPill,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.cityPillText,
                    { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Eco Stays Guarantee Banner */}
        <View style={[styles.ecoBanner, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
          <Ionicons name="leaf-outline" size={22} color="#166534" style={{ marginRight: 10, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.ecoBannerTitle, { color: '#166534' }]}>
              Certified Green Tourism Accommodations
            </Text>
            <Text style={[styles.ecoBannerDesc, { color: '#15803D' }]}>
              Audited for solar adoption, zero single-use plastic, water recycling, and local farm-to-table dining across all Indian cities.
            </Text>
          </View>
        </View>

        {/* Secondary Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {priceRanges.map((p) => {
            const isSelected = selectedPrice === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setSelectedPrice(p)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => setEcoOnly(!ecoOnly)}
            style={[
              styles.filterPill,
              {
                backgroundColor: ecoOnly ? theme.ecoGreen : theme.card,
                borderColor: ecoOnly ? theme.ecoGreen : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: ecoOnly ? '#FFFFFF' : theme.text },
              ]}
            >
              Eco Score 90+
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMinRating45(!minRating45)}
            style={[
              styles.filterPill,
              {
                backgroundColor: minRating45 ? '#F59E0B' : theme.card,
                borderColor: minRating45 ? '#F59E0B' : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: minRating45 ? '#FFFFFF' : theme.text },
              ]}
            >
              4.7+ Rating
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.listHeadingRow}>
          <Text style={[styles.listHeading, { color: theme.text }]}>
            Available Properties ({filteredHotels.length})
          </Text>
          {(selectedCity !== 'All Cities' || searchCity.length > 0) && (
            <TouchableOpacity
              onPress={() => {
                setSelectedCity('All Cities');
                setSearchCity('');
                setSelectedPrice('All');
                setEcoOnly(false);
                setMinRating45(false);
              }}
            >
              <Text style={{ fontSize: 12, color: theme.primary, fontFamily: 'Manrope_600SemiBold' }}>
                Reset Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Hotels List */}
        {filteredHotels.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="bed-outline" size={40} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No hotels found</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              Try clearing filters or searching for another Indian city (e.g. Manali, Goa, Jaipur, Vizag, Mumbai).
            </Text>
            <TouchableOpacity
              style={[styles.resetBtn, { backgroundColor: theme.primary }]}
              onPress={() => {
                setSelectedCity('All Cities');
                setSearchCity('');
                setSelectedPrice('All');
              }}
            >
              <Text style={styles.resetBtnText}>View All Hotels</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onPress={() => navigation.navigate('HotelDetail', { hotel })}
              onBookPress={() => navigation.navigate('HotelDetail', { hotel })}
            />
          ))
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
    fontFamily: 'Manrope_700Bold',
  },
  scrollContent: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    height: '100%',
  },
  citiesScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  cityPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
  },
  cityPillText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  ecoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  ecoBannerTitle: {
    fontSize: 13.5,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 3,
  },
  ecoBannerDesc: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 17,
  },
  filtersScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  listHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listHeading: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
  emptyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginTop: 10,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  resetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
});
