import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTrips } from '../../context/TripContext';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { CrowdIndicator } from '../../components/CrowdIndicator';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../utils/helpers';

export const MyTripsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const {
    pastMemories,
    savedPlaces,
    savedCollections,
    toggleSavePlace,
    deletePastMemory,
  } = useTrips();

  // Primary tabs: 'past' (Past Memories) and 'saved' (Saved Places) - Old 'trips' option is disabled
  const initialTab = route?.params?.initialTab === 'saved' ? 'saved' : 'past';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCollection, setSelectedCollection] = useState('All Saved');

  // Filter saved places by collection
  const filteredSavedPlaces = savedPlaces.filter((p) => {
    if (selectedCollection === 'All Saved') return true;
    return p.collection === selectedCollection;
  });

  const handleDeleteMemory = (memory) => {
    Alert.alert(
      'Delete Past Memory',
      `Are you sure you want to remove "${memory.destinationName}" from your completed memories?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePastMemory(memory.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Memories & Saved</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Completed Journeys & Wishlist
          </Text>
        </View>
        <Button
          title="+ Plan New Trip"
          variant="primary"
          size="small"
          icon="sparkles"
          onPress={() => navigation.navigate('TripPlannerWizard')}
        />
      </View>

      {/* 2 Focused Tabs (Past Memories | Saved Collections) - Trips Option Disabled */}
      <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
        {/* 1. Past Memories Tab (Completed Trips) */}
        <TouchableOpacity
          onPress={() => setActiveTab('past')}
          style={[
            styles.tabItem,
            activeTab === 'past' && { borderBottomColor: theme.primary, borderBottomWidth: 2.5 },
          ]}
        >
          <View style={styles.tabBadgeRow}>
            <Ionicons
              name={activeTab === 'past' ? 'images' : 'images-outline'}
              size={15}
              color={activeTab === 'past' ? theme.primary : theme.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'past' ? theme.primary : theme.textSecondary },
              ]}
            >
              Past Memories ({pastMemories.length})
            </Text>
          </View>
        </TouchableOpacity>

        {/* 2. Instagram-Style Saved Collections Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('saved')}
          style={[
            styles.tabItem,
            activeTab === 'saved' && { borderBottomColor: theme.primary, borderBottomWidth: 2.5 },
          ]}
        >
          <View style={styles.tabBadgeRow}>
            <Ionicons
              name={activeTab === 'saved' ? 'bookmark' : 'bookmark-outline'}
              size={15}
              color={activeTab === 'saved' ? theme.primary : theme.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'saved' ? theme.primary : theme.textSecondary },
              ]}
            >
              Saved ({savedPlaces.length})
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. PAST MEMORIES TAB (COMPLETED TRIPS SAVED FOR USER) */}
        {activeTab === 'past' && (
          <View style={styles.memoriesSection}>
            {pastMemories.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="images-outline" size={48} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No Past Memories Yet</Text>
                <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                  When you complete a trip itinerary, mark it as completed to save your travel stats, visited places, and memories here!
                </Text>
                <Button
                  title="Plan an AI Trip"
                  variant="primary"
                  size="small"
                  icon="sparkles"
                  onPress={() => navigation.navigate('TripPlannerWizard')}
                  style={{ marginTop: 14 }}
                />
              </View>
            ) : (
              pastMemories.map((memory) => (
                <View
                  key={memory.id}
                  style={[
                    styles.memoryCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      shadowColor: theme.shadow,
                    },
                  ]}
                >
                  {/* Hero Cover Image & Badges */}
                  <View style={styles.memoryImageWrap}>
                    <Image source={{ uri: memory.bannerImage }} style={styles.memoryImg} resizeMode="cover" />
                    
                    {/* Completed Tag */}
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" />
                      <Text style={styles.completedBadgeText}>Completed • {memory.completedDate}</Text>
                    </View>

                    {/* 5-Star Rating Badge */}
                    <View style={styles.memoryRatingBadge}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.memoryRatingText}>{memory.userRating}.0</Text>
                    </View>

                    {/* Delete Button */}
                    <TouchableOpacity
                      onPress={() => handleDeleteMemory(memory)}
                      style={styles.deleteMemoryBtn}
                    >
                      <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Body Content */}
                  <View style={styles.memoryBody}>
                    <View style={styles.memoryTitleRow}>
                      <Text style={[styles.memoryTitle, { color: theme.text }]} numberOfLines={1}>
                        {memory.destinationName}
                      </Text>
                      <EcoScoreBadge score={memory.ecoScore} size="small" />
                    </View>

                    {/* Stats Row (Duration, Travelers, Total Spent) */}
                    <View style={[styles.statsRow, { backgroundColor: theme.cardSecondary }]}>
                      <View style={styles.statCol}>
                        <Text style={[styles.statLabel, { color: theme.textMuted }]}>DURATION</Text>
                        <Text style={[styles.statVal, { color: theme.text }]}>{memory.days} Days</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statCol}>
                        <Text style={[styles.statLabel, { color: theme.textMuted }]}>TRAVELERS</Text>
                        <Text style={[styles.statVal, { color: theme.text }]}>{memory.travelers} Persons</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statCol}>
                        <Text style={[styles.statLabel, { color: theme.textMuted }]}>TOTAL SPENT</Text>
                        <Text style={[styles.statVal, { color: theme.primary, fontWeight: '700' }]}>
                          {formatCurrency(memory.totalSpent)}
                        </Text>
                      </View>
                    </View>

                    {/* Visited Sights Chips */}
                    {memory.spotsVisited && memory.spotsVisited.length > 0 && (
                      <View style={styles.visitedSection}>
                        <Text style={[styles.visitedLabel, { color: theme.textSecondary }]}>
                          📍 Places Visited ({memory.spotsVisited.length}):
                        </Text>
                        <View style={styles.visitedChipsRow}>
                          {memory.spotsVisited.map((spot, idx) => (
                            <View
                              key={idx}
                              style={[styles.visitedChip, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
                            >
                              <Text style={[styles.visitedChipText, { color: theme.text }]}>{spot}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Travel Notes / Journal */}
                    {memory.notes && (
                      <View style={[styles.notesBox, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
                        <Ionicons name="chatbox-ellipses-outline" size={14} color="#64748B" style={{ marginTop: 1 }} />
                        <Text style={styles.notesText}>{memory.notes}</Text>
                      </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.memoryBtnRow}>
                      <Button
                        title="Relive / View Details"
                        variant="primary"
                        size="small"
                        icon="calendar-outline"
                        onPress={() => {
                          if (memory.fullTripData) {
                            navigation.navigate('ItineraryDetail', { trip: memory.fullTripData });
                          } else {
                            Alert.alert(
                              memory.destinationName,
                              `Trip completed with ${memory.spotsVisited?.join(', ')}. Total expenditure was ${formatCurrency(memory.totalSpent)}.`
                            );
                          }
                        }}
                        style={{ flex: 1.2 }}
                      />
                      <Button
                        title="Review"
                        variant="outline"
                        size="small"
                        icon="star-outline"
                        onPress={() => navigation.navigate('Feedback')}
                        style={{ flex: 0.8 }}
                      />
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* 2. INSTAGRAM-STYLE SAVED PLACES & COLLECTIONS TAB */}
        {activeTab === 'saved' && (
          <View style={styles.savedSection}>
            {/* Collections Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.collectionsScroll}
            >
              {savedCollections.map((col) => {
                const isSelected = selectedCollection === col;
                return (
                  <TouchableOpacity
                    key={col}
                    onPress={() => setSelectedCollection(col)}
                    style={[
                      styles.colChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.cardSecondary,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="bookmark"
                      size={13}
                      color={isSelected ? '#FFFFFF' : theme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.colChipText,
                        { color: isSelected ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      {col}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Saved Places List */}
            {filteredSavedPlaces.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="bookmark-outline" size={48} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No Saved Places Yet</Text>
                <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                  Save destinations and tourist attractions by tapping the bookmark ribbon icon on any place card!
                </Text>
                <Button
                  title="Explore Destinations"
                  variant="primary"
                  size="small"
                  icon="compass-outline"
                  onPress={() => navigation.navigate('HomeTab')}
                  style={{ marginTop: 14 }}
                />
              </View>
            ) : (
              <View style={styles.savedGrid}>
                {filteredSavedPlaces.map((place) => (
                  <View
                    key={place.id}
                    style={[styles.savedCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  >
                    <Image source={{ uri: place.image }} style={styles.savedCardImage} resizeMode="cover" />

                    {/* Bookmark Ribbon on image */}
                    <TouchableOpacity
                      onPress={() => {
                        toggleSavePlace(place);
                        Alert.alert('Removed', `${place.name} removed from saved.`);
                      }}
                      style={styles.savedBookmarkBadge}
                    >
                      <Ionicons name="bookmark" size={16} color="#2563EB" />
                    </TouchableOpacity>

                    <View style={styles.savedCardBody}>
                      <View style={styles.savedCardTitleRow}>
                        <Text style={[styles.savedPlaceName, { color: theme.text }]} numberOfLines={1}>
                          {place.name}
                        </Text>
                        <View style={styles.savedRating}>
                          <Ionicons name="star" size={11} color="#F59E0B" />
                          <Text style={styles.savedRatingText}>{place.rating || '4.8'}</Text>
                        </View>
                      </View>

                      <Text style={[styles.savedPlaceSub, { color: theme.textSecondary }]} numberOfLines={1}>
                        {place.state || place.subtitle || place.category}
                      </Text>

                      {place.collection && (
                        <View style={styles.savedCollectionTag}>
                          <Text style={styles.savedCollectionTagText}>📁 {place.collection}</Text>
                        </View>
                      )}

                      <View style={styles.savedActionsRow}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('DestinationDetail', { destination: place })}
                          style={[styles.savedViewBtn, { borderColor: theme.border, backgroundColor: theme.cardSecondary }]}
                        >
                          <Text style={[styles.savedViewBtnText, { color: theme.text }]}>Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('TripPlannerWizard', {
                              initialDestination: place,
                              startAtBudget: true,
                            })
                          }
                          style={styles.savedPlanBtn}
                        >
                          <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                          <Text style={styles.savedPlanBtnText}>Plan Trip</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
    marginTop: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  scrollContent: {
    padding: 16,
  },

  /* Past Memories / Completed Trips Section */
  memoriesSection: {
    gap: 16,
  },
  memoryCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  memoryImageWrap: {
    height: 150,
    width: '100%',
    position: 'relative',
  },
  memoryImg: {
    width: '100%',
    height: '100%',
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#16A34A', // Vibrant green completed badge
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  memoryRatingBadge: {
    position: 'absolute',
    top: 10,
    right: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  memoryRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  deleteMemoryBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryBody: {
    padding: 14,
  },
  memoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  memoryTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9.5,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.3,
  },
  statVal: {
    fontSize: 12.5,
    fontFamily: 'Manrope_600SemiBold',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignSelf: 'center',
  },
  visitedSection: {
    marginBottom: 10,
  },
  visitedLabel: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 6,
  },
  visitedChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  visitedChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  visitedChipText: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  notesBox: {
    flexDirection: 'row',
    gap: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  notesText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    color: '#475569',
    flex: 1,
    lineHeight: 16,
  },
  memoryBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },

  /* Saved Places Section */
  savedSection: {
    gap: 14,
  },
  collectionsScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  colChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  colChipText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
  },
  savedGrid: {
    gap: 14,
  },
  savedCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  savedCardImage: {
    width: 110,
    height: 110,
  },
  savedBookmarkBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  savedCardBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  savedCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedPlaceName: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    flex: 1,
  },
  savedRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  savedRatingText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
    color: '#D97706',
  },
  savedPlaceSub: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  savedCollectionTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginVertical: 2,
  },
  savedCollectionTagText: {
    color: '#2563EB',
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
  },
  savedActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  savedViewBtn: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedViewBtnText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  savedPlanBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingVertical: 5,
    borderRadius: 8,
  },
  savedPlanBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontFamily: 'Manrope_700Bold',
  },
});
