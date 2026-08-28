import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { hotels } from '../../data/hotels';
import { HotelCard } from '../../components/HotelCard';

const priceFilters = ['All Prices', 'Under ₹2,000', '₹2,000 - ₹4,000', 'Luxury ₹4,000+'];

export const HotelsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedPrice, setSelectedPrice] = useState('All Prices');
  const [ecoOnly, setEcoOnly] = useState(false);
  const [minRating45, setMinRating45] = useState(false);

  const filteredHotels = hotels.filter((h) => {
    // Price filter
    let matchPrice = true;
    if (selectedPrice === 'Under ₹2,000') matchPrice = h.pricePerNight < 2000;
    if (selectedPrice === '₹2,000 - ₹4,000') matchPrice = h.pricePerNight >= 2000 && h.pricePerNight <= 4000;
    if (selectedPrice === 'Luxury ₹4,000+') matchPrice = h.pricePerNight > 4000;

    // Eco filter
    let matchEco = true;
    if (ecoOnly) matchEco = h.sustainabilityScore >= 90;

    // Rating filter
    let matchRating = true;
    if (minRating45) matchRating = h.rating >= 4.7;

    return matchPrice && matchEco && matchRating;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Smart Hotel Discovery</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Eco Sustainability Banner */}
        <View style={[styles.ecoBanner, { backgroundColor: theme.ecoGreenLight, borderColor: theme.ecoGreen }]}>
          <Ionicons name="leaf" size={22} color={theme.ecoGreen} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.ecoBannerTitle, { color: theme.ecoGreen }]}>
              Verified Green Accommodations
            </Text>
            <Text style={[styles.ecoBannerSubtitle, { color: '#065F46' }]}>
              Solar powered, plastic-free, and directly supporting local employment.
            </Text>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {priceFilters.map((p) => {
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
              🌱 Eco Score 90+
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
              ⭐ 4.7+ Rating
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
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  ecoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  ecoBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  ecoBannerSubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  filterScroll: {
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listHeadingRow: {
    marginBottom: 12,
  },
  listHeading: {
    fontSize: 15,
    fontWeight: '700',
  },
});
