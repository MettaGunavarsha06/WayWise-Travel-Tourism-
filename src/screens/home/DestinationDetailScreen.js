import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTrips } from '../../context/TripContext';
import { useBusinesses } from '../../context/BusinessContext';
import { weatherData, defaultWeather } from '../../data/weather';
import { crowdData } from '../../data/crowdData';
import { CrowdIndicator } from '../../components/CrowdIndicator';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { BusinessCard } from '../../components/BusinessCard';
import { Button } from '../../components/Button';
import { SavedToast } from '../../components/SavedToast';
import { getTranslatedDestination } from '../../data/translations';
import { formatCurrency } from '../../utils/helpers';

export const DestinationDetailScreen = ({ route, navigation }) => {
  const { destination: rawDestination } = route.params;
  const { theme } = useTheme();
  const { currentLanguage, t } = useLanguage();
  const destination = getTranslatedDestination(rawDestination, currentLanguage);
  const {
    createTrip,
    toggleSavePlace,
    isPlaceSaved,
    savedCollections,
    createCollection,
  } = useTrips();
  const { getBusinessesByDestination } = useBusinesses();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(destination.reviews ? destination.reviews + 420 : 1840);
  const [toastVisible, setToastVisible] = useState(false);
  const [activeCollectionName, setActiveCollectionName] = useState('All Saved');
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const isSaved = isPlaceSaved(destination.id);

  const destinationWeather = weatherData[destination.id] || defaultWeather;
  const destinationCrowd = crowdData[destination.id];
  const nearbyBizList = getBusinessesByDestination(destination.id);

  const handlePlanTripHere = () => {
    navigation.navigate('TripPlannerWizard', {
      initialDestination: destination,
      startAtBudget: true,
    });
  };

  // Instagram-style Save Toggle
  const handleToggleSave = () => {
    const nowSaved = toggleSavePlace(destination, activeCollectionName);
    if (nowSaved) {
      setToastVisible(true);
    } else {
      setToastVisible(false);
    }
  };

  const handleSelectCollection = (colName) => {
    setActiveCollectionName(colName);
    toggleSavePlace(destination, colName);
    setShowCollectionModal(false);
    setToastVisible(true);
  };

  const handleCreateNewCollection = () => {
    if (!newCollectionName.trim()) return;
    createCollection(newCollectionName.trim());
    handleSelectCollection(newCollectionName.trim());
    setNewCollectionName('');
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Banner Image with Navigation Bar */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: destination.banner || destination.image }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.overlayNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          {/* Instagram-Style Actions: Like, Save to Collection, and Map */}
          <View style={styles.rightNavBtns}>
            {/* Heart / Like Button */}
            <TouchableOpacity onPress={handleToggleLike} style={styles.circleBtn}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked ? '#EF4444' : '#0F172A'}
              />
            </TouchableOpacity>

            {/* Instagram Bookmark / Saved Button */}
            <TouchableOpacity
              onPress={handleToggleSave}
              onLongPress={() => setShowCollectionModal(true)}
              style={[
                styles.circleBtn,
                isSaved && { backgroundColor: '#2563EB' },
              ]}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isSaved ? '#FFFFFF' : '#0F172A'}
              />
            </TouchableOpacity>

            {/* Smart Map Shortcut */}
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

          {/* Social Proof Row (Likes & Saved Indicator) */}
          <View style={styles.socialProofRow}>
            <View style={styles.socialItem}>
              <Ionicons name="heart" size={13} color="#EF4444" />
              <Text style={[styles.socialText, { color: theme.textSecondary }]}>
                {likeCount.toLocaleString()} travelers liked this
              </Text>
            </View>
            {isSaved && (
              <TouchableOpacity
                onPress={() => setShowCollectionModal(true)}
                style={styles.savedBadgePill}
              >
                <Ionicons name="bookmark" size={11} color="#2563EB" />
                <Text style={styles.savedBadgeText}>Saved in {activeCollectionName}</Text>
              </TouchableOpacity>
            )}
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
              <Ionicons name="time-outline" size={16} color={theme.primary} />
              <Text style={[styles.metaLabel, { color: theme.textMuted }]}>Duration: </Text>
              <Text style={[styles.metaVal, { color: theme.primary, fontWeight: '700' }]}>
                {destination.duration}
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
                <Image source={{ uri: destination.image }} style={styles.attrImage} resizeMode="cover" />
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

      {/* Floating Instagram-Style Saved Toast Popup */}
      <SavedToast
        visible={toastVisible}
        place={destination}
        collectionName={activeCollectionName}
        onChangeCollection={() => setShowCollectionModal(true)}
        onViewSaved={() => {
          setToastVisible(false);
          navigation.navigate('TripsTab', { initialTab: 'saved' });
        }}
        onDismiss={() => setToastVisible(false)}
      />

      {/* Instagram-Style Save to Collection Picker Modal */}
      <Modal visible={showCollectionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Save to Collection</Text>
              <TouchableOpacity onPress={() => setShowCollectionModal(false)}>
                <Ionicons name="close" size={22} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* List Existing Collections */}
            <ScrollView style={{ maxHeight: 220 }}>
              {savedCollections.map((col) => {
                const isSelected = activeCollectionName === col;
                return (
                  <TouchableOpacity
                    key={col}
                    onPress={() => handleSelectCollection(col)}
                    style={[
                      styles.collectionItem,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : theme.cardSecondary,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="bookmark"
                      size={18}
                      color={isSelected ? theme.primary : theme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.collectionName,
                        { color: isSelected ? theme.primary : theme.text },
                      ]}
                    >
                      {col}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Create New Collection Input */}
            <View style={styles.newColRow}>
              <TextInput
                placeholder="New collection name (e.g. Summer 2026)"
                placeholderTextColor={theme.textMuted}
                value={newCollectionName}
                onChangeText={setNewCollectionName}
                style={[
                  styles.newColInput,
                  {
                    color: theme.text,
                    backgroundColor: theme.cardSecondary,
                    borderColor: theme.border,
                  },
                ]}
              />
              <TouchableOpacity
                onPress={handleCreateNewCollection}
                style={styles.newColBtn}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.bottomPriceLabel, { color: theme.textMuted }]}>Recommended Stay</Text>
          <Text style={[styles.bottomPrice, { color: theme.primary }]}>
            {destination.duration}
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    marginBottom: 6,
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
  socialProofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  socialText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
  },
  savedBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  savedBadgeText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
    color: '#2563EB',
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

  /* Collection Picker Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: 450,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  collectionName: {
    fontSize: 13.5,
    fontFamily: 'Manrope_600SemiBold',
    flex: 1,
  },
  newColRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  newColInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 13,
    fontFamily: 'Manrope_500Medium',
  },
  newColBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
