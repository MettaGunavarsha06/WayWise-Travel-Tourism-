import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTrips } from '../../context/TripContext';
import { useBusinesses } from '../../context/BusinessContext';
import { weatherData, defaultWeather } from '../../data/weather';
import { crowdData } from '../../data/crowdData';
import { CrowdIndicator } from '../../components/CrowdIndicator';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { BusinessCard } from '../../components/BusinessCard';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../utils/helpers';

export const DestinationDetailScreen = ({ route, navigation }) => {
  const { destination } = route.params;
  const { theme } = useTheme();
  const { createTrip } = useTrips();
  const { getBusinessesByDestination } = useBusinesses();

  const destinationWeather = weatherData[destination.id] || defaultWeather;
  const destinationCrowd = crowdData[destination.id];
  const nearbyBizList = getBusinessesByDestination(destination.id);

  const handlePlanTripHere = () => {
    createTrip({
      destinationId: destination.id,
      destinationName: destination.name,
      days: 4,
      travelers: 2,
      totalBudget: destination.estimatedCost || 15000,
      interests: ['Nature', 'History', 'Culture', 'Beaches'],
      travelPreference: 'Comfortable',
    });
    navigation.navigate('ItineraryDetail');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Banner Image with Action Bar */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: destination.banner || destination.image }} style={styles.bannerImage} />
        <View style={styles.overlayNav}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.circleBtn}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.rightNavBtns}>
            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="heart-outline" size={20} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('SmartMap', { selectedDestId: destination.id })}
              style={styles.circleBtn}
            >
              <Ionicons name="map-outline" size={20} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>

        {destination.isHiddenGem && (
          <View style={styles.gemTag}>
            <Text style={styles.gemTagText}>💎 Hidden Gem</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title & Metadata */}
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.text }]}>{destination.name}</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {destination.subtitle || destination.state}
              </Text>
            </View>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{destination.rating}</Text>
              <Text style={styles.reviewText}>({destination.reviews})</Text>
            </View>
          </View>

          {/* Crowd & Eco Badges */}
          <View style={styles.badgesRow}>
            <CrowdIndicator
              level={destination.crowdLevel}
              percent={destinationCrowd?.densityPercent || destination.crowdScore}
            />
            <EcoScoreBadge score={destination.ecoScore} />
          </View>
        </View>

        {/* Alternative to crowded spot banner if hidden gem */}
        {destination.isHiddenGem && destination.alternativeTo && (
          <View style={[styles.altCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
            <Ionicons name="sparkles" size={18} color={theme.primaryDark} style={{ marginRight: 8 }} />
            <Text style={[styles.altText, { color: theme.primaryDark }]}>
              {destination.alternativeTo}
            </Text>
          </View>
        )}

        {/* Description */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>About Destination</Text>
          <Text style={[styles.descText, { color: theme.textSecondary }]}>
            {destination.description}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.primary} />
              <Text style={[styles.metaLabel, { color: theme.textMuted }]}>Best Time: </Text>
              <Text style={[styles.metaVal, { color: theme.text }]}>{destination.bestTimeToVisit}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={16} color={theme.primary} />
              <Text style={[styles.metaLabel, { color: theme.textMuted }]}>Est. Budget: </Text>
              <Text style={[styles.metaVal, { color: theme.primary, fontWeight: '700' }]}>
                {formatCurrency(destination.estimatedCost)}
              </Text>
            </View>
          </View>
        </View>

        {/* Real-time Crowd Management Box */}
        {destinationCrowd && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>👥 Live Crowd Flow & Distribution</Text>
              <Text style={[styles.crowdStatus, { color: destination.crowdLevel === 'high' ? theme.error : theme.success }]}>
                {destinationCrowd.overallCrowdLevel.toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.peakHours, { color: theme.textSecondary }]}>
              Typical Peak Rush: {destinationCrowd.peakHours}
            </Text>

            {destinationCrowd.liveSpots?.map((spot) => (
              <View key={spot.id} style={styles.spotRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.spotName, { color: theme.text }]}>{spot.name}</Text>
                  <Text style={[styles.spotStatus, { color: theme.textMuted }]}>{spot.status}</Text>
                </View>
                <CrowdIndicator level={spot.level} percent={spot.percent} compact />
              </View>
            ))}
          </View>
        )}

        {/* Eco Sustainability Highlights */}
        {destination.ecoHighlights && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>🌱 Sustainable Tourism Initiatives</Text>
            {destination.ecoHighlights.map((highlight, index) => (
              <View key={index} style={styles.highlightRow}>
                <Ionicons name="checkmark-circle" size={16} color={theme.ecoGreen} />
                <Text style={[styles.highlightText, { color: theme.textSecondary }]}>
                  {highlight}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Key Attractions */}
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionHeading, { color: theme.text }]}>Major Attractions & Activities</Text>
        </View>
        <View style={styles.attractionsList}>
          {destination.attractions?.map((attr) => (
            <View
              key={attr.id}
              style={[styles.attractionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View style={[styles.attrIcon, { backgroundColor: theme.cardSecondary }]}>
                <Ionicons name={attr.icon || 'location'} size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.attrName, { color: theme.text }]}>{attr.name}</Text>
                <View style={styles.attrDetailsRow}>
                  <Text style={[styles.attrTime, { color: theme.textSecondary }]}>⏳ {attr.time}</Text>
                  <Text style={[styles.attrType, { color: attr.type === 'indoor' ? theme.info : theme.secondary }]}>
                    {attr.type === 'indoor' ? '🏛️ Indoor / Weather-Safe' : '☀️ Outdoor'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.attrCost, { color: theme.primary }]}>
                {attr.cost === 0 ? 'Free Entry' : formatCurrency(attr.cost)}
              </Text>
            </View>
          ))}
        </View>

        {/* Weather-Protected Alternatives */}
        {destination.indoorAlternatives && (
          <View style={[styles.card, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
            <Text style={[styles.cardTitle, { color: '#166534' }]}>
              🌧️ Rainy Day & High-Heat Indoor Swaps
            </Text>
            <Text style={[styles.indoorSubtitle, { color: '#15803D' }]}>
              Pre-mapped indoor alternatives if weather turns inclement:
            </Text>
            {destination.indoorAlternatives.map((alt, idx) => (
              <View key={idx} style={styles.indoorItem}>
                <Text style={styles.indoorName}>• {alt.name}</Text>
                <Text style={styles.indoorDesc}>{alt.desc}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Nearby Local Businesses */}
        {nearbyBizList.length > 0 && (
          <>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionHeading, { color: theme.text }]}>Local Artisans & Verified Homestays</Text>
            </View>
            {nearbyBizList.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.bottomPriceLabel, { color: theme.textMuted }]}>Est. Full Package</Text>
          <Text style={[styles.bottomPrice, { color: theme.primary }]}>
            {formatCurrency(destination.estimatedCost)}
            <Text style={[styles.perTrip, { color: theme.textSecondary }]}> / 4 Days</Text>
          </Text>
        </View>

        <Button
          title="✨ Plan AI Trip Here"
          variant="primary"
          size="medium"
          onPress={handlePlanTripHere}
          style={styles.planBtn}
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
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  overlayNav: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightNavBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  gemTag: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  gemTagText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
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
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: '#92400E',
    fontWeight: '700',
    fontSize: 13,
  },
  reviewText: {
    color: '#B45309',
    fontSize: 11,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  altCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  altText: {
    flex: 1,
    fontSize: 12,
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  crowdStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  peakHours: {
    fontSize: 11,
    marginBottom: 10,
  },
  spotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  spotName: {
    fontSize: 13,
    fontWeight: '600',
  },
  spotStatus: {
    fontSize: 11,
  },
  descText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
  },
  metaVal: {
    fontSize: 12,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  highlightText: {
    fontSize: 12,
  },
  sectionTitleRow: {
    marginVertical: 10,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
  attractionsList: {
    gap: 10,
    marginBottom: 14,
  },
  attractionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  attrIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attrName: {
    fontSize: 14,
    fontWeight: '600',
  },
  attrDetailsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 3,
  },
  attrTime: {
    fontSize: 11,
  },
  attrType: {
    fontSize: 11,
    fontWeight: '600',
  },
  attrCost: {
    fontSize: 13,
    fontWeight: '700',
  },
  indoorSubtitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  indoorItem: {
    marginBottom: 6,
  },
  indoorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#14532D',
  },
  indoorDesc: {
    fontSize: 11,
    color: '#166534',
    marginLeft: 10,
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
  bottomPriceLabel: {
    fontSize: 11,
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  perTrip: {
    fontSize: 12,
    fontWeight: '400',
  },
  planBtn: {
    minWidth: 160,
  },
});
