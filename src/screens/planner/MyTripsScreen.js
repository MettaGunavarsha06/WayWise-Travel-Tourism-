import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTrips } from '../../context/TripContext';
import { Button } from '../../components/Button';
import { DestinationCard } from '../../components/DestinationCard';
import { InteractiveItineraryMapCard } from '../../components/InteractiveItineraryMapCard';
import { ScrollFadeItem } from '../../components/ScrollFadeItem';

const MockupTripCard = ({ trip, navigation, setActiveTripById }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const itemCount = trip.daysPlan?.length
    ? `${trip.daysPlan.length * 3} Items`
    : `${trip.days * 3} Items`;

  const handlePressIn = () => {
    Animated.spring(floatAnim, {
      toValue: 1,
      bounciness: 9,
      speed: 18,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(floatAnim, {
      toValue: 0,
      bounciness: 6,
      speed: 14,
      useNativeDriver: true,
    }).start();
  };

  const cardScale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const cardTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -7],
  });

  return (
    <Animated.View
      style={[
        styles.tripMockupCard,
        {
          transform: [{ scale: cardScale }, { translateY: cardTranslateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.94}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          setActiveTripById?.(trip.id);
          navigation.navigate('ItineraryDetail', { trip });
        }}
        style={styles.tripCardInner}
      >
        {/* Full Cover Trip Image */}
        <Image
          source={{
            uri:
              trip.bannerImage ||
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.tripMockupImg}
          resizeMode="cover"
        />

        {/* Gradient Scrim */}
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'transparent', 'rgba(10,12,16,0.85)']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Top Row: Items Badge & Heart */}
        <View style={styles.tripTopRow}>
          <View style={styles.itemsGlassBadge}>
            <Text style={styles.itemsGlassBadgeText}>{itemCount}</Text>
          </View>

          <View style={styles.heartCircleGlass}>
            <Ionicons name="heart" size={17} color="#EF4444" />
          </View>
        </View>

        {/* Bottom Frosted Glass Title Strip */}
        <View style={styles.tripBottomStrip}>
          <View style={styles.tripTitleGroup}>
            <Text style={styles.tripMainTitle} numberOfLines={1}>
              Trip to {trip.destinationName}
            </Text>
            <Text style={styles.tripDateSub}>
              {trip.dates || '18/09/2026 - 20/09/2026'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              setActiveTripById?.(trip.id);
              navigation.navigate('ItineraryDetail', { trip });
            }}
            style={styles.editPenCircle}
          >
            <Ionicons name="pencil" size={15} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const MyTripsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage?.() || { t: (k) => k };
  const { trips = [], activeTrip, setActiveTripById, savedPlaces = [] } = useTrips?.() || {};
  const [activeTab, setActiveTab] = useState('upcoming');
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t('myTrips') || 'My Trips'}
        </Text>
        <Button
          title={t('newAITrip') || '+ New AI Trip'}
          variant="primary"
          size="small"
          onPress={() => navigation.navigate('TripPlannerWizard')}
        />
      </View>

      {/* 3 Tabs: Upcoming Trips, Saved Places, Past Travels */}
      <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('upcoming')}
          style={[
            styles.tabItem,
            activeTab === 'upcoming' && { borderBottomColor: theme.primary },
          ]}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'upcoming' ? theme.primary : theme.textSecondary, fontFamily: activeTab === 'upcoming' ? 'Manrope_700Bold' : 'Manrope_600SemiBold' },
            ]}
            numberOfLines={1}
          >
            {t('upcomingTrips') || 'Upcoming'} ({trips.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('saved')}
          style={[
            styles.tabItem,
            activeTab === 'saved' && { borderBottomColor: theme.primary },
          ]}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'saved' ? theme.primary : theme.textSecondary, fontFamily: activeTab === 'saved' ? 'Manrope_700Bold' : 'Manrope_600SemiBold' },
            ]}
            numberOfLines={1}
          >
            {t('savedPlaces') || 'Saved'} ({savedPlaces.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('past')}
          style={[
            styles.tabItem,
            activeTab === 'past' && { borderBottomColor: theme.primary },
          ]}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'past' ? theme.primary : theme.textSecondary, fontFamily: activeTab === 'past' ? 'Manrope_700Bold' : 'Manrope_600SemiBold' },
            ]}
            numberOfLines={1}
          >
            {t('pastTravels') || 'Past'} (2)
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {activeTab === 'upcoming' && (
          <View>
            {/* Interactive Itinerary Map Feature Card */}
            {activeTrip && (
              <ScrollFadeItem scrollY={scrollY}>
                <View style={{ marginHorizontal: 16, marginBottom: 16, marginTop: 10 }}>
                  <InteractiveItineraryMapCard
                    trip={activeTrip}
                    onPressExpand={() => navigation.navigate('ItineraryDetail', { trip: activeTrip })}
                  />
                </View>
              </ScrollFadeItem>
            )}

            {/* Trips Section Header */}
            <View style={styles.sectionHeaderWrap}>
              <Text style={[styles.mockupSectionTitle, { color: theme.text }]}>
                {t('myItineraries') || 'Itineraries'}
              </Text>
              <Text style={[styles.mockupSectionSub, { color: theme.textSecondary }]}>
                {t('savedUpcomingSub') || 'Your saved upcoming itineraries'}
              </Text>
            </View>

            {trips.map((trip) => (
              <ScrollFadeItem key={trip.id} scrollY={scrollY}>
                <MockupTripCard
                  trip={trip}
                  navigation={navigation}
                  setActiveTripById={setActiveTripById}
                />
              </ScrollFadeItem>
            ))}

            {/* Radiant Blue Gradient Action Button */}
            <ScrollFadeItem scrollY={scrollY}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => navigation.navigate('TripPlannerWizard')}
                style={styles.addNewLocationBtnWrap}
              >
                <LinearGradient
                  colors={['#4F75FF', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addNewLocationGrad}
                >
                  <Text style={styles.addNewLocationText}>
                    {t('addNewLocation') || 'Add new location'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollFadeItem>
          </View>
        )}

        {activeTab === 'saved' && (
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <View style={styles.sectionHeaderWrap}>
              <Text style={[styles.mockupSectionTitle, { color: theme.text }]}>
                {t('savedDestinations') || 'Saved Destinations'}
              </Text>
              <Text style={[styles.mockupSectionSub, { color: theme.textSecondary }]}>
                {t('savedDestinationsSub') || 'Places and spots bookmarked across your journeys'}
              </Text>
            </View>

            {savedPlaces.length === 0 ? (
              <View style={[styles.emptySavedBox, { borderColor: theme.border, backgroundColor: theme.card }]}>
                <Ionicons name="bookmark-outline" size={48} color={theme.textMuted} />
                <Text style={[styles.emptySavedTitle, { color: theme.text }]}>
                  {t('noSavedPlacesYet') || 'No Saved Places Yet'}
                </Text>
                <Text style={[styles.emptySavedSub, { color: theme.textSecondary }]}>
                  {t('tapBookmarkToSave') || 'Tap the heart/bookmark icon on any destination or attraction to save it here.'}
                </Text>
              </View>
            ) : (
              savedPlaces.map((place) => (
                <ScrollFadeItem key={place.id} scrollY={scrollY}>
                  <DestinationCard
                    destination={place}
                    onPress={() => navigation.navigate('DestinationDetail', { destination: place })}
                  />
                </ScrollFadeItem>
              ))
            )}
          </View>
        )}

        {activeTab === 'past' && (
          <ScrollFadeItem scrollY={scrollY}>
            <View style={styles.pastCardMockup}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
                }}
                style={styles.pastImg}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(10, 12, 16, 0.90)']}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.pastOverlay}>
                <Text style={styles.pastTitle}>Visakhapatnam Coast & Araku Valley</Text>
                <Text style={styles.pastDate}>Completed · 12 August 2026</Text>
              </View>
            </View>
          </ScrollFadeItem>
        )}
      </Animated.ScrollView>
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
    fontFamily: 'Manrope_700Bold',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    alignItems: 'stretch',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_600SemiBold',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeaderWrap: {
    paddingHorizontal: 4,
    marginTop: 14,
    marginBottom: 10,
  },
  mockupSectionTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.3,
  },
  mockupSectionSub: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  tripMockupCard: {
    height: 230,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'visible',
  },
  tripCardInner: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: '#16181F',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  tripMockupImg: {
    width: '100%',
    height: '100%',
  },
  tripTopRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  itemsGlassBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(25, 28, 36, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  itemsGlassBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  heartCircleGlass: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(25, 28, 36, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripBottomStrip: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(20, 23, 31, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  tripTitleGroup: {
    flex: 1,
  },
  tripMainTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
  tripDateSub: {
    color: '#8E95A5',
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  editPenCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewLocationBtnWrap: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#4F75FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  addNewLocationGrad: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewLocationText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.2,
  },
  pastCardMockup: {
    height: 200,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#16181F',
  },
  pastImg: {
    width: '100%',
    height: '100%',
  },
  pastOverlay: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
  },
  pastTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  pastDate: {
    color: '#8E95A5',
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  emptySavedBox: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
  },
  emptySavedTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySavedSub: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
