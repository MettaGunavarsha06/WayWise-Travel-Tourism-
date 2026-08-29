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
    navigation.navigate('TripPlannerWizard', {
      initialDestination: destination,
      startAtBudget: true,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Banner Image with Navigation Bar */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: destination.banner || destination.image }} style={styles.bannerImage} resizeMode="cover" />
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
            <Ionicons name="compass-outline" size={12} color="#BBF7D0" style={{ marginRight: 4 }} />
            <Text style={styles.gemTagText}>Hidden Gem</Text>
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
              <Ionicons name="star" size={15} color="#F59E0B" />
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
            <Ionicons name="information-circle-outline" size={18} color={theme.primaryDark} style={{ marginRight: 8 }} />
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

        {/* Real-time Crowd Distribution */}
        {destinationCrowd && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Live Crowd Distribution</Text>
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

        {/* Sustainable Tourism Initiatives */}
        {destination.ecoHighlights && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Sustainable Tourism Initiatives</Text>
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
          <Text style={[styles.sectionHeading, { color: theme.text }]}>Attractions &amp; Heritage Sites</Text>
        </View>
        <View style={styles.attractionsList}>
          {destination.attractions?.map((attr) => (
            <View
              key={attr.id}
              style={[styles.attractionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              {attr.image ? (
                <Image source={{ uri: attr.image }} style={styles.attrImage} resizeMode="cover" />
              ) : (
                <View style={[styles.attrIcon, { backgroundColor: theme.cardSecondary }]}>
                  <Ionicons name={attr.icon || 'location-outline'} size={20} color={theme.primary} />
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={[styles.attrName, { color: theme.text }]}>{attr.name}</Text>
                {attr.description && (
                  <Text style={[styles.attrDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                    {attr.description}
                  </Text>
                )}
                <View style={styles.attrDetailsRow}>
                  <View style={styles.attrDetailItem}>
                    <Ionicons name="time-outline" size={12} color={theme.textSecondary} />
                    <Text style={[styles.attrTime, { color: theme.textSecondary }]}>{attr.time}</Text>
                  </View>
                  <View style={styles.attrDetailItem}>
                    <Ionicons
                      name={attr.type === 'indoor' ? 'business-outline' : 'sunny-outline'}
                      size={12}
                      color={attr.type === 'indoor' ? theme.info : theme.secondary}
                    />
                    <Text style={[styles.attrType, { color: attr.type === 'indoor' ? theme.info : theme.secondary }]}>
                      {attr.type === 'indoor' ? 'Indoor / Weather-Safe' : 'Outdoor'}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.attrCost, { color: theme.primary }]}>
                {attr.cost === 0 ? 'Free' : formatCurrency(attr.cost)}
              </Text>
            </View>
          ))}
        </View>

        {/* Weather-Protected Alternatives */}
        {destination.indoorAlternatives && (
          <View style={[styles.card, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
            <Text style={[styles.cardTitle, { color: '#166534' }]}>
              Weather-Adapted Indoor Experiences
            </Text>
            <Text style={[styles.indoorSubtitle, { color: '#15803D' }]}>
              Sheltered cultural destinations if rainfall or high heat occurs:
            </Text>
            {destination.indoorAlternatives.map((alt, idx) => (
              <View key={idx} style={styles.indoorItem}>
                <Text style={styles.indoorName}>{alt.name}</Text>
                <Text style={styles.indoorDesc}>{alt.desc}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Nearby Local Businesses */}
        {nearbyBizList.length > 0 && (
          <>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionHeading, { color: theme.text }]}>Local Artisans &amp; Verified Homestays</Text>
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
          <Text style={[styles.bottomPriceLabel, { color: theme.textMuted }]}>Estimated Trip</Text>
          <Text style={[styles.bottomPrice, { color: theme.primary }]}>
            {formatCurrency(destination.estimatedCost)}
            <Text style={[styles.perTrip, { color: theme.textSecondary }]}> / {destination.duration}</Text>
          </Text>
        </View>

        <Button
          title="Plan Trip Here"
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
    height: 240,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
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
  rightNavBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  gemTag: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    backgroundColor: 'rgba(22, 101, 52, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  gemTagText: {
    color: '#BBF7D0',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
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
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
    color: '#B45309',
  },
  reviewText: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    color: '#B45309',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  altCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  altText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: 'Manrope_600SemiBold',
    lineHeight: 18,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginBottom: 12,
  },
  descText: {
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 20,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
  },
  metaVal: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  crowdStatus: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  peakHours: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginBottom: 12,
  },
  spotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  spotName: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
  },
  spotStatus: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 1,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  highlightText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    flex: 1,
  },
  sectionTitleRow: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  attractionsList: {
    gap: 12,
    marginBottom: 16,
  },
  attractionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  attrImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  attrIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attrName: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 2,
  },
  attrDesc: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 16,
    marginBottom: 4,
  },
  attrDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  attrDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attrTime: {
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
  },
  attrType: {
    fontSize: 11.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  attrCost: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  indoorSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginBottom: 10,
  },
  indoorItem: {
    marginVertical: 4,
  },
  indoorName: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
    color: '#166534',
  },
  indoorDesc: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    color: '#15803D',
    marginTop: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  bottomPriceLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  bottomPrice: {
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
  },
  perTrip: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
  },
  planBtn: {
    minWidth: 150,
  },
});
