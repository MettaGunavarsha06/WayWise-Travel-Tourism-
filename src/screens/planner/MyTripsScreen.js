import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTrips } from '../../context/TripContext';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../utils/helpers';

export const MyTripsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { trips, activeTrip, setActiveTripById } = useTrips();
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | past

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Trips</Text>
        <Button
          title="+ New AI Trip"
          variant="primary"
          size="small"
          onPress={() => navigation.navigate('TripPlannerWizard')}
        />
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('upcoming')}
          style={[
            styles.tabItem,
            activeTab === 'upcoming' && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'upcoming' ? theme.primary : theme.textSecondary },
            ]}
          >
            Upcoming Trips ({trips.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('past')}
          style={[
            styles.tabItem,
            activeTab === 'past' && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'past' ? theme.primary : theme.textSecondary },
            ]}
          >
            Past Memories (1)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'upcoming' && (
          <View style={styles.tripsList}>
            {trips.map((trip) => {
              const isActive = activeTrip?.id === trip.id;
              return (
                <TouchableOpacity
                  key={trip.id}
                  activeOpacity={0.9}
                  onPress={() => {
                    setActiveTripById(trip.id);
                    navigation.navigate('ItineraryDetail', { trip });
                  }}
                  style={[
                    styles.tripCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isActive ? theme.primary : theme.border,
                      borderWidth: isActive ? 2 : 1,
                      shadowColor: theme.shadow,
                    },
                  ]}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: trip.bannerImage }} style={styles.tripImg} />
                    {isActive && (
                      <View style={[styles.activeBadge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.activeText}>● Active Itinerary</Text>
                      </View>
                    )}
                    <View style={styles.passBtnWrap}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('DigitalPass', { trip })}
                        style={styles.qrIconBtn}
                      >
                        <Ionicons name="qr-code" size={16} color="#0F172A" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.tripContent}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.destTitle, { color: theme.text }]}>
                        {trip.destinationName}
                      </Text>
                      <EcoScoreBadge score={trip.ecoScore} size="small" />
                    </View>

                    <Text style={[styles.durationText, { color: theme.textSecondary }]}>
                      {trip.days} Days • {trip.travelers} Persons • {trip.travelPreference} Style
                    </Text>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <Text style={[styles.detailLabel, { color: theme.textMuted }]}>HOTEL</Text>
                        <Text style={[styles.detailVal, { color: theme.text }]} numberOfLines={1}>
                          {trip.hotel?.name}
                        </Text>
                      </View>

                      <View style={styles.detailItem}>
                        <Text style={[styles.detailLabel, { color: theme.textMuted }]}>BUDGET</Text>
                        <Text style={[styles.detailVal, { color: theme.primary, fontWeight: '700' }]}>
                          {formatCurrency(trip.budgetBreakdown?.total)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.btnRow}>
                      <Button
                        title="View Day-by-Day"
                        variant="primary"
                        size="small"
                        icon="calendar-outline"
                        onPress={() => {
                          setActiveTripById(trip.id);
                          navigation.navigate('ItineraryDetail', { trip });
                        }}
                        style={{ flex: 1.3 }}
                      />
                      <Button
                        title="Pass"
                        variant="outline"
                        size="small"
                        icon="qr-code-outline"
                        onPress={() => navigation.navigate('DigitalPass', { trip })}
                        style={{ flex: 0.7 }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {activeTab === 'past' && (
          <View style={[styles.pastCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80' }}
              style={styles.pastImg}
            />
            <View style={styles.pastContent}>
              <Text style={[styles.pastTitle, { color: theme.text }]}>Araku Valley Coffee Escapade</Text>
              <Text style={[styles.pastDate, { color: theme.textSecondary }]}>Completed • Feb 2026 • 3 Days</Text>
              <Button
                title="Leave Review & Feedback"
                variant="secondary"
                size="small"
                icon="star-outline"
                onPress={() => navigation.navigate('Feedback')}
                style={{ marginTop: 10 }}
              />
            </View>
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
    fontSize: 20,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  tripsList: {
    gap: 16,
  },
  tripCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    height: 130,
    width: '100%',
    position: 'relative',
  },
  tripImg: {
    width: '100%',
    height: '100%',
  },
  activeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  passBtnWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  qrIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripContent: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  durationText: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  detailVal: {
    fontSize: 13,
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pastCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pastImg: {
    width: '100%',
    height: 130,
  },
  pastContent: {
    padding: 14,
  },
  pastTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  pastDate: {
    fontSize: 12,
    marginTop: 3,
  },
});
