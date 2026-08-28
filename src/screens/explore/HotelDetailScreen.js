import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../utils/helpers';

export const HotelDetailScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { theme } = useTheme();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const gallery = hotel.gallery || [hotel.image];

  const handleBook = () => {
    Alert.alert(
      'Reservation Confirmed! 🏨',
      `Your stay at "${hotel.name}" has been reserved for your SmartTour itinerary.\n\nTotal: ${formatCurrency(hotel.pricePerNight * 3)} for 3 Nights\nCheck-in: 11:00 AM\nEco Points Earned: +45 🌱`,
      [
        { text: 'View in My Trips', onPress: () => navigation.navigate('MyTrips') },
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Banner / Main Photo */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: gallery[selectedPhotoIndex] || hotel.image }} style={styles.bannerImg} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartBtn}>
          <Ionicons name="heart-outline" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Gallery Thumbnails */}
      {gallery.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
          {gallery.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedPhotoIndex(idx)}
              style={[
                styles.thumbWrap,
                selectedPhotoIndex === idx && { borderColor: theme.primary, borderWidth: 2 },
              ]}
            >
              <Image source={{ uri: img }} style={styles.thumbImg} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title & Ratings */}
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: theme.text }]}>{hotel.name}</Text>
              <Text style={[styles.type, { color: theme.textSecondary }]}>
                {hotel.type} • {hotel.destinationName}
              </Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{hotel.rating}</Text>
              <Text style={styles.reviewsText}>({hotel.reviewsCount})</Text>
            </View>
          </View>

          <View style={styles.distanceRow}>
            <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.distanceText, { color: theme.textSecondary }]}>
              {hotel.distanceFromAttraction}
            </Text>
          </View>
        </View>

        {/* Eco Score & Sustainability Credentials */}
        <View style={[styles.ecoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.ecoHeader}>
            <Text style={[styles.ecoCardTitle, { color: theme.text }]}>🌱 Green Tourism Certification</Text>
            <EcoScoreBadge score={hotel.sustainabilityScore} />
          </View>

          <View style={styles.badgeChipsWrap}>
            {hotel.sustainabilityBadges?.map((badge, index) => (
              <View key={index} style={[styles.greenBadge, { backgroundColor: theme.ecoGreenLight }]}>
                <Ionicons name="checkmark-circle" size={13} color={theme.ecoGreen} />
                <Text style={[styles.greenBadgeText, { color: theme.ecoGreen }]}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>About Property</Text>
          <Text style={[styles.descText, { color: theme.textSecondary }]}>
            {hotel.description}
          </Text>
          <Text style={[styles.addressText, { color: theme.textMuted }]}>
            📍 {hotel.address}
          </Text>
        </View>

        {/* Facilities & Amenities */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Property Amenities</Text>
          <View style={styles.facilitiesGrid}>
            {hotel.facilities?.map((f, i) => (
              <View key={i} style={[styles.facPill, { backgroundColor: theme.cardSecondary }]}>
                <Ionicons name="checkmark" size={14} color={theme.primary} />
                <Text style={[styles.facText, { color: theme.text }]}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Guest Reviews */}
        {hotel.reviews?.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Verified Guest Reviews</Text>
            {hotel.reviews.map((rev) => (
              <View key={rev.id} style={styles.reviewItem}>
                <View style={styles.revHeader}>
                  <Text style={[styles.revUser, { color: theme.text }]}>{rev.user}</Text>
                  <View style={styles.revRating}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={[styles.revRateText, { color: theme.text }]}>{rev.rating}</Text>
                  </View>
                </View>
                <Text style={[styles.revComment, { color: theme.textSecondary }]}>"{rev.comment}"</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: theme.textMuted }]}>Nightly Tariff</Text>
          <Text style={[styles.price, { color: theme.primary }]}>
            {formatCurrency(hotel.pricePerNight)}
            <Text style={[styles.perNight, { color: theme.textSecondary }]}> / room</Text>
          </Text>
        </View>

        <Button
          title="Reserve Room"
          variant="primary"
          size="medium"
          onPress={handleBook}
          style={styles.bookBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    position: 'absolute',
    top: 14,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  thumbWrap: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbImg: {
    width: 60,
    height: 45,
  },
  scrollContent: {
    padding: 16,
  },
  headerInfo: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  type: {
    fontSize: 13,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
  },
  ratingText: {
    color: '#92400E',
    fontWeight: '700',
    fontSize: 13,
  },
  reviewsText: {
    color: '#B45309',
    fontSize: 11,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  distanceText: {
    fontSize: 12,
  },
  ecoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  ecoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ecoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  badgeChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  greenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  greenBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  descText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 11,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  facText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reviewItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  revHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  revUser: {
    fontSize: 13,
    fontWeight: '700',
  },
  revRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  revRateText: {
    fontSize: 12,
    fontWeight: '700',
  },
  revComment: {
    fontSize: 12,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  priceLabel: {
    fontSize: 11,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  perNight: {
    fontSize: 12,
    fontWeight: '400',
  },
  bookBtn: {
    minWidth: 150,
  },
});
