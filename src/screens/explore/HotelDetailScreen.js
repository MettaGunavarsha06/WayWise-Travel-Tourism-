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
      'Reservation Confirmed',
      `Your stay at "${hotel.name}" has been reserved for your WayWise itinerary.\n\nTotal: ${formatCurrency(hotel.pricePerNight * 3)} for 3 Nights\nCheck-in: 11:00 AM\nEco Points Earned: +45`,
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
        <Image source={{ uri: gallery[selectedPhotoIndex] || hotel.image }} style={styles.bannerImg} resizeMode="cover" />
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
              <Image source={{ uri: img }} style={styles.thumbImg} resizeMode="cover" />
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
                {hotel.type} · {hotel.destinationName}
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
            <Text style={[styles.ecoCardTitle, { color: theme.text }]}>Sustainable Tourism Credentials</Text>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Ionicons name="navigate-outline" size={13} color={theme.textMuted} />
            <Text style={[styles.addressText, { color: theme.textMuted }]}>
              {hotel.address}
            </Text>
          </View>
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
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={[styles.revScore, { color: theme.text }]}>{rev.rating}</Text>
                  </View>
                </View>
                <Text style={[styles.revComment, { color: theme.textSecondary }]}>{rev.comment}</Text>
                <Text style={[styles.revDate, { color: theme.textMuted }]}>{rev.date}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: theme.textMuted }]}>Price per Night</Text>
          <Text style={[styles.bottomPrice, { color: theme.primary }]}>
            {formatCurrency(hotel.pricePerNight)}
            <Text style={[styles.perNight, { color: theme.textSecondary }]}> / room</Text>
          </Text>
        </View>

        <Button
          title="Reserve Stay"
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
    height: 230,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    position: 'absolute',
    top: 14,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  heartBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  galleryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  thumbWrap: {
    width: 60,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    padding: 16,
  },
  headerInfo: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.2,
  },
  type: {
    fontSize: 12.5,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    color: '#B45309',
  },
  reviewsText: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    color: '#B45309',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
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
    fontFamily: 'Manrope_700Bold',
  },
  badgeChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  greenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  greenBadgeText: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 8,
  },
  descText: {
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 20,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  facText: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
  reviewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  revHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  revUser: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  revRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  revScore: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  revComment: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 17,
  },
  revDate: {
    fontSize: 10.5,
    fontFamily: 'Manrope_400Regular',
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_500Medium',
    textTransform: 'uppercase',
  },
  bottomPrice: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
  },
  perNight: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
  },
  bookBtn: {
    minWidth: 140,
  },
});
