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
import { WeatherAlertCard } from '../../components/WeatherAlertCard';
import { BudgetBreakdownChart } from '../../components/BudgetBreakdownChart';
import { Button } from '../../components/Button';
import { InteractiveItineraryMapCard } from '../../components/InteractiveItineraryMapCard';
import { formatCurrency } from '../../utils/helpers';

export const ItineraryDetailScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const {
    activeTrip,
    applyWeatherAdjustment,
    optimizeBudget,
    saveTripToPastMemories,
  } = useTrips();
  const [selectedDay, setSelectedDay] = useState(1);

  const trip = route?.params?.trip || activeTrip;

  if (!trip) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text, fontFamily: 'Manrope_500Medium' }}>No active trip found.</Text>
        <Button title="Plan a Trip" onPress={() => navigation.navigate('TripPlannerWizard')} style={{ marginTop: 12 }} />
      </SafeAreaView>
    );
  }

  const handleWeatherApply = () => {
    applyWeatherAdjustment();
    Alert.alert('Itinerary Updated', 'Outdoor activities swapped for weather-protected indoor museums and cultural centers.');
  };

  const handleBudgetOptimize = () => {
    optimizeBudget();
    Alert.alert('Budget Optimized', 'Replaced premium options with certified eco homestays and community transit.');
  };

  const handleCompleteTrip = () => {
    Alert.alert(
      'Complete Journey',
      `Save this completed ${trip.destinationName} trip into your Past Memories with all visited sights and budget stats?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save to Memories 📸',
          onPress: () => {
            saveTripToPastMemories(trip, `Completed a wonderful ${trip.days}-day tour of ${trip.destinationName}!`);
            Alert.alert(
              'Trip Saved to Past Memories! 🎉',
              'Your completed journey, places visited, and budget stats have been saved to Past Memories.',
              [
                {
                  text: 'View Past Memories',
                  onPress: () => navigation.navigate('TripsTab', { initialTab: 'past' }),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const activeDayPlan = trip.daysPlan?.find((d) => d.dayNumber === selectedDay) || trip.daysPlan?.[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.topTitleWrap}>
          <Text style={[styles.topTitle, { color: theme.text }]} numberOfLines={1}>
            {trip.days}-Day {trip.destinationName} Travel Plan
          </Text>
          <Text style={[styles.topSubtitle, { color: theme.textSecondary }]}>
            Trip ID: {trip.id} · {trip.travelers} Travelers
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleCompleteTrip}
          style={[styles.passIconBtn, { backgroundColor: '#DCFCE7' }]}
        >
          <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Card */}
        <View style={styles.bannerContainer}>
          <Image source={{ uri: trip.bannerImage }} style={styles.bannerImg} resizeMode="cover" />
          <View style={styles.bannerOverlay}>
            <View style={styles.ecoRow}>
              <EcoScoreBadge score={trip.ecoScore} />
              <View style={[styles.prefTag, { backgroundColor: 'rgba(15, 23, 42, 0.8)' }]}>
                <Text style={styles.prefText}>{trip.travelPreference}</Text>
              </View>
            </View>
            <Text style={styles.bannerDestTitle}>{trip.destinationName} Itinerary</Text>
            <Text style={styles.bannerBudget}>
              Target Budget: {formatCurrency(trip.userBudget)} · Planned: {formatCurrency(trip.budgetBreakdown?.total)}
            </Text>
          </View>
        </View>

        {/* Quick Action Pills */}
        <View style={styles.actionPillsRow}>
          <Button
            title="Complete & Save"
            variant="primary"
            size="small"
            icon="checkmark-circle"
            onPress={handleCompleteTrip}
            style={styles.actionPillPrimary}
          />
          <Button
            title="Digital Pass"
            variant="outline"
            size="small"
            icon="qr-code-outline"
            onPress={() => navigation.navigate('DigitalPass', { trip })}
            style={styles.actionPill}
          />
          <Button
            title="Map View"
            variant="outline"
            size="small"
            icon="map-outline"
            onPress={() => navigation.navigate('SmartMap', { selectedDestId: trip.destinationId })}
            style={styles.actionPill}
          />
        </View>

        {/* Live Weather Alert Banner */}
        <WeatherAlertCard
          alertMessage="Rain forecasted tomorrow. Outdoor activities have been adapted to sheltered cultural sites."
          onApplyChanges={handleWeatherApply}
          isApplied={trip.daysPlan?.some((d) => d.isWeatherAdjusted)}
        />

        {/* Interactive Spring-Animated Route Map Card */}
        <InteractiveItineraryMapCard
          trip={trip}
          destinationName={trip?.destinationName || 'Expedition Route'}
          dates={`${trip?.days || 4}-Day Expedition`}
          currentDay={selectedDay}
          totalDays={trip?.days || 4}
          progress={selectedDay / (trip?.days || 4)}
        />

        {/* Day Selector Tabs */}
        <View style={styles.daySelectorRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelectorScroll}>
            {trip.daysPlan?.map((d) => {
              const isSelected = selectedDay === d.dayNumber;
              return (
                <TouchableOpacity
                  key={d.dayNumber}
                  onPress={() => setSelectedDay(d.dayNumber)}
                  style={[
                    styles.dayTab,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.card,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayTabText,
                      { color: isSelected ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    Day {d.dayNumber}
                  </Text>
                  <Text
                    style={[
                      styles.dayTabTheme,
                      { color: isSelected ? 'rgba(255,255,255,0.8)' : theme.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {d.theme}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Day Timeline */}
        {activeDayPlan && (
          <View style={styles.timelineSection}>
            <View style={styles.dayHeaderRow}>
              <Text style={[styles.dayTitle, { color: theme.text }]}>
                Day {activeDayPlan.dayNumber}: {activeDayPlan.theme}
              </Text>
              <View style={[styles.weatherBadge, { backgroundColor: theme.cardSecondary }]}>
                <Ionicons name="sunny-outline" size={14} color="#F59E0B" />
                <Text style={[styles.weatherBadgeText, { color: theme.textSecondary }]}>
                  {activeDayPlan.weatherNote || 'Pleasant 27°C'}
                </Text>
              </View>
            </View>

            {/* Morning Item */}
            {activeDayPlan.morning && (
              <View style={styles.timelineItem}>
                <View style={styles.timeCol}>
                  <Text style={[styles.timeText, { color: theme.primary }]}>09:00 AM</Text>
                  <View style={[styles.timeDot, { backgroundColor: theme.primary }]} />
                  <View style={[styles.timeLine, { backgroundColor: theme.border }]} />
                </View>
                <View style={[styles.actBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.actTitleRow}>
                    <Text style={[styles.actTitle, { color: theme.text }]}>{activeDayPlan.morning.title}</Text>
                  </View>
                  <View style={styles.actMetaRow}>
                    <Text style={[styles.actVenue, { color: theme.textSecondary }]}>
                      📍 {activeDayPlan.morning.venue}
                    </Text>
                    <Text style={[styles.actCost, { color: theme.primary }]}>
                      {activeDayPlan.morning.cost === 0 ? 'Free' : formatCurrency(activeDayPlan.morning.cost)}
                    </Text>
                  </View>
                  {activeDayPlan.morning.isSwapped && (
                    <View style={[styles.swappedBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={styles.swappedText}>⚡ Weather Protected Indoor Swap</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Afternoon Item */}
            {activeDayPlan.afternoon && (
              <View style={styles.timelineItem}>
                <View style={styles.timeCol}>
                  <Text style={[styles.timeText, { color: theme.primary }]}>01:30 PM</Text>
                  <View style={[styles.timeDot, { backgroundColor: theme.primary }]} />
                  <View style={[styles.timeLine, { backgroundColor: theme.border }]} />
                </View>
                <View style={[styles.actBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.actTitleRow}>
                    <Text style={[styles.actTitle, { color: theme.text }]}>{activeDayPlan.afternoon.title}</Text>
                  </View>
                  <View style={styles.actMetaRow}>
                    <Text style={[styles.actVenue, { color: theme.textSecondary }]}>
                      📍 {activeDayPlan.afternoon.venue}
                    </Text>
                    <Text style={[styles.actCost, { color: theme.primary }]}>
                      {activeDayPlan.afternoon.cost === 0 ? 'Free' : formatCurrency(activeDayPlan.afternoon.cost)}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Evening Item */}
            {activeDayPlan.evening && (
              <View style={styles.timelineItem}>
                <View style={styles.timeCol}>
                  <Text style={[styles.timeText, { color: theme.primary }]}>06:00 PM</Text>
                  <View style={[styles.timeDot, { backgroundColor: theme.primary }]} />
                </View>
                <View style={[styles.actBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.actTitleRow}>
                    <Text style={[styles.actTitle, { color: theme.text }]}>{activeDayPlan.evening.title}</Text>
                  </View>
                  <View style={styles.actMetaRow}>
                    <Text style={[styles.actVenue, { color: theme.textSecondary }]}>
                      📍 {activeDayPlan.evening.venue}
                    </Text>
                    <Text style={[styles.actCost, { color: theme.primary }]}>
                      {activeDayPlan.evening.cost === 0 ? 'Free' : formatCurrency(activeDayPlan.evening.cost)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Accommodation & Eco Homestay */}
        {trip.hotel && (
          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.infoCardTitle, { color: theme.text }]}>Selected Eco Stay</Text>
            <View style={styles.matchRow}>
              {trip.hotel.image ? (
                <Image source={{ uri: trip.hotel.image }} style={styles.thumbImg} />
              ) : (
                <View style={[styles.thumbIcon, { backgroundColor: theme.cardSecondary }]}>
                  <Ionicons name="bed-outline" size={20} color={theme.primary} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.matchName, { color: theme.text }]}>{trip.hotel.name}</Text>
                <Text style={[styles.matchDetail, { color: theme.textSecondary }]}>
                  {trip.hotel.type} • {trip.hotel.location || trip.destinationName}
                </Text>
                <Text style={{ color: theme.primary, fontFamily: 'Manrope_700Bold', fontSize: 13 }}>
                  {formatCurrency(trip.hotel.pricePerNight)} / night
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Budget Breakdown Chart */}
        {trip.budgetBreakdown && (
          <BudgetBreakdownChart
            breakdown={trip.budgetBreakdown}
            userBudget={trip.userBudget}
          />
        )}

        {/* Bottom Finish / Complete Trip Card */}
        <View style={[styles.finishCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
          <Ionicons name="checkmark-done-circle" size={28} color="#16A34A" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.finishCardTitle, { color: '#166534' }]}>Completed this Trip?</Text>
            <Text style={[styles.finishCardDesc, { color: '#15803D' }]}>
              Save your visited spots, photos, and expenditure to Past Memories.
            </Text>
          </View>
          <TouchableOpacity onPress={handleCompleteTrip} style={styles.finishBtn}>
            <Text style={styles.finishBtnText}>Save Memory</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconBtn: {
    padding: 6,
  },
  topTitleWrap: {
    flex: 1,
    marginHorizontal: 8,
  },
  topTitle: {
    fontSize: 14.5,
    fontFamily: 'Manrope_700Bold',
  },
  topSubtitle: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  passIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  bannerContainer: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
    padding: 14,
    justifyContent: 'flex-end',
  },
  ecoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  prefTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  prefText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  bannerDestTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Manrope_800ExtraBold',
  },
  bannerBudget: {
    color: '#E2E8F0',
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  actionPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  actionPillPrimary: {
    flex: 1.3,
  },
  actionPill: {
    flex: 1,
  },
  daySelectorRow: {
    marginVertical: 12,
  },
  daySelectorScroll: {
    gap: 8,
  },
  dayTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  dayTabText: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  dayTabTheme: {
    fontSize: 10,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
    maxWidth: 90,
  },
  timelineSection: {
    marginBottom: 16,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  weatherBadgeText: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeCol: {
    width: 65,
    position: 'relative',
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 4,
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 2,
  },
  timeLine: {
    position: 'absolute',
    left: 5,
    top: 20,
    bottom: -10,
    width: 2,
  },
  actBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 11,
    marginLeft: 6,
  },
  actTitleRow: {
    marginBottom: 4,
  },
  actTitle: {
    fontSize: 13.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  actMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actVenue: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
  },
  actCost: {
    fontSize: 12.5,
    fontFamily: 'Manrope_700Bold',
  },
  swappedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  swappedText: {
    fontSize: 10.5,
    fontFamily: 'Manrope_500Medium',
    color: '#92400E',
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  infoCardTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 10,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbImg: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  thumbIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchName: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 2,
  },
  matchDetail: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginBottom: 4,
  },
  finishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  finishCardTitle: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  finishCardDesc: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 1,
  },
  finishBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontFamily: 'Manrope_700Bold',
  },
});
