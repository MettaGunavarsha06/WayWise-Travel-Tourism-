import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { hotels } from '../../data/hotels';
import { HotelCard } from '../../components/HotelCard';

const priceRanges = ['All', 'Under ₹2,500', '₹2,500 - ₹4,000', 'Above ₹4,000'];

export const HotelsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [ecoOnly, setEcoOnly] = useState(false);
  const [minRating45, setMinRating45] = useState(false);

  const filteredHotels = hotels.filter((h) => {
    let matchesPrice = true;
    if (selectedPrice === 'Under ₹2,500') matchesPrice = h.pricePerNight < 2500;
    if (selectedPrice === '₹2,500 - ₹4,000') matchesPrice = h.pricePerNight >= 2500 && h.pricePerNight <= 4000;
    if (selectedPrice === 'Above ₹4,000') matchesPrice = h.pricePerNight > 4000;

    let matchesEco = true;
    if (ecoOnly) matchesEco = h.sustainabilityScore >= 90;

    let matchesRating = true;
    if (minRating45) matchesRating = h.rating >= 4.7;

    return matchesPrice && matchesEco && matchesRating;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Verified Eco-Stays &amp; Homestays</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Eco Stays Guarantee Banner */}
        <View style={[styles.ecoBanner, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
          <Ionicons name="leaf-outline" size={22} color="#166534" style={{ marginRight: 10, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.ecoBannerTitle, { color: '#166534' }]}>
              Certified Green Tourism Partners
            </Text>
            <Text style={[styles.ecoBannerDesc, { color: '#15803D' }]}>
              All listed accommodations are audited for solar adoption, zero-plastic amenities, and local community profit-sharing.
            </Text>
          </View>
        </View>

        {/* Filters */}
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
        </View>

        {/* Hotels List */}
        {filteredHotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onPress={() => navigation.navigate('HotelDetail', { hotel })}
            onBookPress={() => navigation.navigate('HotelDetail', { hotel })}
          />
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
    fontFamily: 'Manrope_700Bold',
  },
  scrollContent: {
    padding: 16,
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
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 3,
  },
  ecoBannerDesc: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
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
    fontSize: 12.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  listHeadingRow: {
    marginBottom: 12,
  },
  listHeading: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
});
