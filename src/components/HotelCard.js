import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { EcoScoreBadge } from './EcoScoreBadge';
import { Button } from './Button';
import { formatCurrency } from '../utils/helpers';

export const HotelCard = ({ hotel, onPress, onBookPress, isSelected = false }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isSelected ? theme.primary : theme.border,
          borderWidth: isSelected ? 2 : 1,
          shadowColor: theme.shadow,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: hotel.image }} style={styles.image} resizeMode="cover" />
        {hotel.isRecommended && (
          <View style={[styles.recBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.recBadgeText}>Recommended Stay</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={styles.ratingText}>{hotel.rating}</Text>
          <Text style={styles.reviewsText}>({hotel.reviewsCount})</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {hotel.name}
          </Text>
        </View>

        <Text style={[styles.type, { color: theme.textSecondary }]}>
          {hotel.type} · {hotel.destinationName}
        </Text>

        <View style={styles.distanceRow}>
          <Ionicons name="location-outline" size={13} color={theme.textSecondary} />
          <Text style={[styles.distanceText, { color: theme.textSecondary }]}>
            {hotel.distanceFromAttraction}
          </Text>
        </View>

        {/* Eco Score and Badges */}
        <View style={styles.ecoRow}>
          <EcoScoreBadge score={hotel.sustainabilityScore} size="small" />
          {hotel.sustainabilityBadges?.[0] && (
            <View style={[styles.ecoTag, { backgroundColor: theme.ecoGreenLight }]}>
              <Text style={[styles.ecoTagText, { color: theme.ecoGreen }]}>
                {hotel.sustainabilityBadges[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Facilities Pills */}
        <View style={styles.facilitiesRow}>
          {hotel.facilities?.slice(0, 3).map((facility, index) => (
            <View
              key={index}
              style={[styles.facilityPill, { backgroundColor: theme.cardSecondary }]}
            >
              <Text style={[styles.facilityText, { color: theme.textSecondary }]}>
                {facility}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.footer}>
          <View>
            <Text style={[styles.priceLabel, { color: theme.textMuted }]}>Per Night</Text>
            <Text style={[styles.price, { color: theme.primary }]}>
              {formatCurrency(hotel.pricePerNight)}
            </Text>
          </View>

          <Button
            title={isSelected ? 'Selected' : 'Book Now'}
            variant={isSelected ? 'outline' : 'primary'}
            size="small"
            onPress={onBookPress || onPress}
            style={styles.bookBtn}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  recBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  reviewsText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontFamily: 'Manrope_400Regular',
  },
  content: {
    padding: 14,
  },
  titleRow: {
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.2,
  },
  type: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    marginBottom: 6,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
  },
  ecoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  ecoTag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ecoTagText: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  facilityPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  facilityText: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  bookBtn: {
    minWidth: 100,
  },
});
