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
import { formatCurrency } from '../../utils/helpers';

export const ItineraryDetailScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { activeTrip, applyWeatherAdjustment, optimizeBudget } = useTrips();
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
          onPress={() => navigation.navigate('DigitalPass', { trip })}
          style={[styles.passIconBtn, { backgroundColor: theme.primaryLight }]}
        >
          <Ionicons name="qr-code-outline" size={18} color={theme.primary} />
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
            title="Digital Pass"
            variant="outline"
            size="small"
            icon="qr-code-outline"
            onPress={() => navigation.navigate('DigitalPass', { trip })}
            style={styles.actionPill}
          />
          <Button
            title="Optimize Budget"
            variant="secondary"
            size="small"
            icon="options-outline"
            onPress={handleBudgetOptimize}
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
                  {d.isWeatherAdjusted && (
                    <Ionicons
                      name="umbrella-outline"
                      size={12}
                      color={isSelected ? '#FFFFFF' : theme.primary}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Timeline Activities for Selected Day */}
        <View style={[styles.timelineCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.timelineHeading, { color: theme.text }]}>
            {activeDayPlan?.title}
          </Text>

          <View style={styles.timelineList}>
            {activeDayPlan?.activities?.map((act, index) => (
              <View key={index} style={styles.activityItem}>
                {/* Time & Dot indicator */}
                <View style={styles.timeCol}>
                  <Text style={[styles.timeText, { color: theme.primary }]}>{act.time}</Text>
                  <View style={[styles.timeDot, { backgroundColor: act.isWeatherSafe ? theme.ecoGreen : theme.secondary }]} />
                  {index < activeDayPlan.activities.length - 1 && (
                    <View style={[styles.timeLine, { backgroundColor: theme.border }]} />
                  )}
                </View>

                {/* Content Box */}
                <View style={[styles.actBox, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
                  <View style={styles.actTitleRow}>
                    <Text style={[styles.actTitle, { color: theme.text }]}>{act.title}</Text>
                  </View>
                  <View style={styles.actMetaRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Ionicons name="location-outline" size={12} color={theme.textSecondary} />
                      <Text style={[styles.actVenue, { color: theme.textSecondary }]}>{act.venue}</Text>
                    </View>
                    <Text style={[styles.actCost, { color: theme.primary }]}>
                      {act.cost === 0 ? 'Free' : formatCurrency(act.cost)}
                    </Text>
                  </View>
                  {act.swappedNote && (
                    <View style={[styles.swappedBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={styles.swappedText}>{act.swappedNote}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Matched Hotel & Transport Details */}
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoCardTitle, { color: theme.text }]}>Selected Accommodation</Text>
          <View style={styles.matchRow}>
            <Image source={{ uri: trip.hotel?.image }} style={styles.thumbImg} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.matchName, { color: theme.text }]}>{trip.hotel?.name}</Text>
              <Text style={[styles.matchDetail, { color: theme.textSecondary }]}>
                {trip.hotel?.type} · {formatCurrency(trip.hotel?.pricePerNight)}/night
              </Text>
              <EcoScoreBadge score={trip.hotel?.sustainabilityScore} size="small" />
            </View>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoCardTitle, { color: theme.text }]}>Transit &amp; Mobility</Text>
          <View style={styles.matchRow}>
            <View style={[styles.thumbIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="train-outline" size={22} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.matchName, { color: theme.text }]}>{trip.transport?.name}</Text>
              <Text style={[styles.matchDetail, { color: theme.textSecondary }]}>
                {trip.transport?.time} · {formatCurrency(trip.transport?.cost)}/person
              </Text>
              <EcoScoreBadge score={trip.transport?.ecoScore} size="small" />
            </View>
          </View>
        </View>

        {/* Budget Breakdown Chart */}
        <BudgetBreakdownChart
          breakdown={trip.budgetBreakdown}
          onOptimizePress={handleBudgetOptimize}
        />

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
    marginHorizontal: 12,
  },
  topTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  topSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    marginTop: 1,
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
    height: 170,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
    backgroundColor: '#E2E8F0',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    padding: 14,
    justifyContent: 'flex-end',
  },
  ecoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  prefTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    justifyContent: 'center',
  },
  prefText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  bannerDestTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 2,
  },
  bannerBudget: {
    color: '#CBD5E1',
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
  },
  actionPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  actionPill: {
    flex: 1,
  },
  daySelectorRow: {
    marginBottom: 14,
  },
  daySelectorScroll: {
    gap: 8,
  },
  dayTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  dayTabText: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
  },
  timelineCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  timelineHeading: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 16,
  },
  timelineList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
  },
  timeCol: {
    width: 72,
    alignItems: 'flex-start',
    position: 'relative',
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
});
