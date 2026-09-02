import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path,
  Circle,
  Line,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { EcoScoreBadge } from './EcoScoreBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SAMPLE_PINS = [
  {
    day: 1,
    title: 'Amer Fort & Mirror Palace',
    subtitle: 'Sandstone Fortress & Panoramic Lake',
    category: 'Heritage Landmark',
    time: '09:30 AM',
    duration: '3.5 hrs',
    ecoScore: 92,
    xPercent: 24,
    yPercent: 32,
    color: '#0284C7', // Electric Azure
    icon: 'trail-sign-outline',
  },
  {
    day: 2,
    title: 'Hawa Mahal & City Bazaar',
    subtitle: 'Honeycomb Facade & Local Artisans',
    category: 'Cultural Walk',
    time: '10:00 AM',
    duration: '2.5 hrs',
    ecoScore: 90,
    xPercent: 54,
    yPercent: 25,
    color: '#6366F1', // Radiant Violet
    icon: 'business-outline',
  },
  {
    day: 3,
    title: 'Jantar Mantar & Nahargarh',
    subtitle: 'Ancient Astronomy & Hilltop Sunset',
    category: 'Eco Nature & Astro',
    time: '02:30 PM',
    duration: '4 hrs',
    ecoScore: 95,
    xPercent: 78,
    yPercent: 52,
    color: '#F59E0B', // Warm Amber
    icon: 'telescope-outline',
  },
  {
    day: 4,
    title: 'Chokhi Dhani Cultural Village',
    subtitle: 'Traditional Folk Dance & Organic Dining',
    category: 'Folk Dining & Arts',
    time: '06:00 PM',
    duration: '3 hrs',
    ecoScore: 94,
    xPercent: 46,
    yPercent: 74,
    color: '#10B981', // Emerald Eco
    icon: 'restaurant-outline',
  },
];

export const InteractiveItineraryMapCard = ({
  trip,
  destinationName = 'Jaipur Heritage Expedition',
  dates = 'Oct 12 – 15, 2026',
  currentDay = 2,
  totalDays = 4,
  progress = 0.5,
  onNavigateDetail,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPinIndex, setSelectedPinIndex] = useState(0);

  // Animation values
  const expandAnim = useRef(new Animated.Value(0)).current; // 0 = idle, 1 = expanded
  const cardScaleAnim = useRef(new Animated.Value(1)).current;
  const blurBackdropAnim = useRef(new Animated.Value(0)).current;
  const routeLineAnim = useRef(new Animated.Value(0)).current;

  // Pin animation values (spring bounce drop)
  const pin1Anim = useRef(new Animated.Value(0)).current;
  const pin2Anim = useRef(new Animated.Value(0)).current;
  const pin3Anim = useRef(new Animated.Value(0)).current;
  const pin4Anim = useRef(new Animated.Value(0)).current;
  const pinAnims = [pin1Anim, pin2Anim, pin3Anim, pin4Anim];

  // Shimmer pulse animation for idle progress bar
  const progressShimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressShimmer, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(progressShimmer, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleCardPress = () => {
    if (isExpanded) return;

    // Trigger Cubic-Bezier (0.25, 1, 0.5, 1) Spring Scaling & Expansion
    setIsExpanded(true);

    // 1. Expand Card Height & Scale
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: 1,
        duration: 480,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(cardScaleAnim, {
          toValue: 1.025,
          duration: 220,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: false,
        }),
        Animated.timing(cardScaleAnim, {
          toValue: 1.0,
          duration: 260,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: false,
        }),
      ]),
      Animated.timing(blurBackdropAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(routeLineAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => {
      // 2. Trigger Sequential Day-by-Day Pins Drop with Gentle Bounce
      triggerPinDrops();
    });
  };

  const triggerPinDrops = () => {
    // Reset all pin values
    pinAnims.forEach((anim) => anim.setValue(0));

    // Staggered Spring Bounce Drop
    const springAnimations = pinAnims.map((anim) =>
      Animated.spring(anim, {
        toValue: 1,
        bounciness: 10,
        speed: 12,
        useNativeDriver: true,
      })
    );

    Animated.stagger(150, springAnimations).start();
  };

  const handleCollapse = () => {
    // Reset pins
    pinAnims.forEach((anim) => anim.setValue(0));

    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: 0,
        duration: 380,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: false,
      }),
      Animated.timing(blurBackdropAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(routeLineAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsExpanded(false);
    });
  };

  // Interpolated Styles
  const cardHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [186, 520],
  });

  const idleOpacity = expandAnim.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [1, 0, 0],
  });

  const mapContentOpacity = expandAnim.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 0.2, 1],
  });

  const selectedPin = SAMPLE_PINS[selectedPinIndex] || SAMPLE_PINS[0];

  return (
    <View style={[styles.outerWrapper, style]}>
      {/* Background Soft Dim/Blur Overlay during expansion */}
      {isExpanded && (
        <Animated.View
          style={[
            styles.backdropOverlay,
            {
              opacity: blurBackdropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.65],
              }),
            },
          ]}
        />
      )}

      {/* Main Animated Floating Card Container */}
      <Animated.View
        style={[
          styles.floatingCard,
          {
            height: cardHeight,
            transform: [{ scale: cardScaleAnim }],
            backgroundColor: theme.card,
            borderColor: isExpanded ? theme.primary : theme.border,
            borderWidth: theme.mode === 'liquid_glass' ? 1.5 : 1,
            shadowColor: theme.shadow,
          },
        ]}
      >
        {/* ========================================================================= */}
        {/* 1. IDLE STATE: Floating Card with Dest Name, Date Badge, and Progress Bar */}
        {/* ========================================================================= */}
        {!isExpanded && (
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={handleCardPress}
            style={styles.idleTouchable}
          >
            {/* Top Row: Live Pulse, Destination & Date Badge */}
            <View style={styles.idleHeaderRow}>
              <View style={styles.destNameWrap}>
                <View style={styles.activePulsingRow}>
                  <View style={[styles.pulseDot, { backgroundColor: theme.primary }]} />
                  <Text style={[styles.activeStatusTag, { color: theme.primary }]}>
                    ACTIVE EXPEDITION
                  </Text>
                </View>
                <Text style={[styles.destTitle, { color: theme.text }]} numberOfLines={1}>
                  {trip?.destinationName || destinationName}
                </Text>
              </View>

              <View style={[styles.dateBadgePill, { backgroundColor: theme.primaryLight, borderColor: theme.border }]}>
                <Ionicons name="calendar-outline" size={13} color={theme.primary} />
                <Text style={[styles.dateBadgeText, { color: theme.primaryDark }]}>
                  {dates}
                </Text>
              </View>
            </View>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
              <View style={styles.progressLabelRow}>
                <Text style={[styles.progressSubtitle, { color: theme.textSecondary }]}>
                  Day {currentDay} of {totalDays} Itinerary Progress
                </Text>
                <Text style={[styles.progressPercent, { color: theme.primaryDark }]}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>

              {/* Progress Bar Track */}
              <View style={[styles.progressBarTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                <LinearGradient
                  colors={[theme.primary, theme.secondary || '#6366F1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
                />
              </View>
            </View>

            {/* Bottom Info & Tap to Launch Prompt */}
            <View style={styles.idleFooterRow}>
              <View style={styles.stopsBadge}>
                <Ionicons name="location" size={13} color={theme.secondary || '#6366F1'} />
                <Text style={[styles.stopsText, { color: theme.textSecondary }]}>
                  {SAMPLE_PINS.length} Geo-Pins Planned
                </Text>
              </View>

              <View style={[styles.expandPromptPill, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.expandPromptText, { color: theme.primaryDark }]}>
                  Tap for Interactive Map
                </Text>
                <Ionicons name="arrow-forward" size={13} color={theme.primaryDark} />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* ========================================================================= */}
        {/* 2. FINAL STATE: Interactive Map with Sequential Dropping Bounce Pins     */}
        {/* ========================================================================= */}
        {isExpanded && (
          <Animated.View style={[styles.expandedContent, { opacity: mapContentOpacity }]}>
            {/* Expanded Header Bar */}
            <View style={[styles.expandedHeader, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.expandedDestTitle, { color: theme.text }]}>
                  {trip?.destinationName || destinationName} Route
                </Text>
                <Text style={[styles.expandedSubtitle, { color: theme.textSecondary }]}>
                  Day-by-Day Sequenced Landmark Pins
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleCollapse}
                activeOpacity={0.8}
                style={[styles.collapseBtn, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
              >
                <Ionicons name="close" size={18} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Interactive Vector Map Viewport */}
            <View style={[styles.mapViewport, { backgroundColor: isDark ? '#0F172A' : '#E0F2FE' }]}>
              {/* Decorative Vector Topography & Roads SVG */}
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
                <Defs>
                  <SvgGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor={isDark ? '#0284C7' : '#38BDF8'} stopOpacity="0.25" />
                    <Stop offset="1" stopColor={isDark ? '#6366F1' : '#818CF8'} stopOpacity="0.15" />
                  </SvgGradient>
                </Defs>

                {/* Ambient River / Valley Trail */}
                <Path
                  d="M -20,80 Q 90,140 180,90 T 380,180"
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="28"
                  strokeLinecap="round"
                />

                {/* Grid Guidelines */}
                <Line x1="25%" y1="0" x2="25%" y2="100%" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />
                <Line x1="50%" y1="0" x2="50%" y2="100%" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />
                <Line x1="75%" y1="0" x2="75%" y2="100%" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />
                <Line x1="0" y1="33%" x2="100%" y2="33%" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />
                <Line x1="0" y1="66%" x2="100%" y2="66%" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />

                {/* Connecting Journey Route Path between Pins */}
                <Path
                  d={`M ${SCREEN_WIDTH * 0.24},65 Q ${SCREEN_WIDTH * 0.40},50 ${SCREEN_WIDTH * 0.54},50 T ${SCREEN_WIDTH * 0.78},105 T ${SCREEN_WIDTH * 0.46},150`}
                  fill="none"
                  stroke={theme.primary}
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                  strokeOpacity="0.8"
                />
              </Svg>

              {/* Day-by-Day Pins Dropping Sequentially with Gentle Bounce */}
              {SAMPLE_PINS.map((pin, idx) => {
                const anim = pinAnims[idx];
                const isSelected = selectedPinIndex === idx;

                const pinTranslateY = anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-90, 0],
                });

                const pinScale = anim.interpolate({
                  inputRange: [0, 0.7, 1],
                  outputRange: [0.3, 1.2, 1],
                });

                const pinOpacity = anim.interpolate({
                  inputRange: [0, 0.4, 1],
                  outputRange: [0, 0.8, 1],
                });

                return (
                  <Animated.View
                    key={pin.day}
                    style={[
                      styles.pinWrapper,
                      {
                        left: `${pin.xPercent}%`,
                        top: `${pin.yPercent}%`,
                        opacity: pinOpacity,
                        transform: [{ translateY: pinTranslateY }, { scale: pinScale }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => setSelectedPinIndex(idx)}
                      style={styles.pinTouchable}
                    >
                      {/* Day Badge Tag */}
                      <View
                        style={[
                          styles.pinDayTag,
                          {
                            backgroundColor: isSelected ? pin.color : theme.card,
                            borderColor: pin.color,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pinDayTagText,
                            { color: isSelected ? '#FFFFFF' : pin.color },
                          ]}
                        >
                          Day {pin.day}
                        </Text>
                      </View>

                      {/* Bouncing Pin Head Marker */}
                      <View
                        style={[
                          styles.pinHead,
                          {
                            backgroundColor: pin.color,
                            borderColor: '#FFFFFF',
                            transform: [{ scale: isSelected ? 1.2 : 1 }],
                          },
                        ]}
                      >
                        <Ionicons name="location" size={16} color="#FFFFFF" />
                      </View>

                      {/* Ground Shadow Ripple */}
                      <View style={[styles.pinGroundShadow, { backgroundColor: pin.color }]} />
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}

              {/* Re-trigger Pins Drop Button (Mini Control) */}
              <TouchableOpacity
                onPress={triggerPinDrops}
                style={[styles.replayPinBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={14} color={theme.primary} />
                <Text style={[styles.replayPinText, { color: theme.primary }]}>Drop Pins</Text>
              </TouchableOpacity>
            </View>

            {/* Selected Pin Details Card */}
            <View style={[styles.pinDetailsCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
              <View style={styles.pinDetailsHeader}>
                <View style={[styles.dayIconBox, { backgroundColor: selectedPin.color }]}>
                  <Text style={styles.dayIconBoxText}>D{selectedPin.day}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pinDetailTitle, { color: theme.text }]} numberOfLines={1}>
                    {selectedPin.title}
                  </Text>
                  <Text style={[styles.pinDetailSub, { color: theme.textSecondary }]} numberOfLines={1}>
                    {selectedPin.subtitle}
                  </Text>
                </View>
                <EcoScoreBadge score={selectedPin.ecoScore} size="small" />
              </View>

              {/* Meta row: Time & Duration */}
              <View style={styles.pinMetaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={13} color={theme.textMuted} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {selectedPin.time} ({selectedPin.duration})
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="pricetag-outline" size={13} color={theme.textMuted} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {selectedPin.category}
                  </Text>
                </View>
              </View>

              {/* Action Button */}
              <View style={styles.pinActionRow}>
                <TouchableOpacity
                  onPress={() => {
                    if (onNavigateDetail) {
                      onNavigateDetail(trip);
                    }
                  }}
                  style={[styles.viewItineraryBtn, { backgroundColor: theme.primary }]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.viewItineraryBtnText}>View Full Day Schedule</Text>
                  <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    marginHorizontal: 16,
    marginVertical: 10,
    zIndex: 10,
  },
  backdropOverlay: {
    position: 'absolute',
    top: -500,
    left: -50,
    right: -50,
    bottom: -500,
    backgroundColor: '#000000',
    zIndex: -1,
  },
  floatingCard: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },
  idleTouchable: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  idleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  destNameWrap: {
    flex: 1,
  },
  activePulsingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  activeStatusTag: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.8,
  },
  destTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.3,
  },
  dateBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  dateBadgeText: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
  progressPercent: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  idleFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stopsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopsText: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
  expandPromptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  expandPromptText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  expandedContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  expandedDestTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  expandedSubtitle: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  collapseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  mapViewport: {
    height: 230,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -20,
    marginTop: -20,
    zIndex: 20,
  },
  pinTouchable: {
    alignItems: 'center',
  },
  pinDayTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  pinDayTagText: {
    fontSize: 9,
    fontFamily: 'Manrope_700Bold',
  },
  pinHead: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  pinGroundShadow: {
    width: 14,
    height: 4,
    borderRadius: 7,
    opacity: 0.25,
    marginTop: 2,
  },
  replayPinBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 30,
  },
  replayPinText: {
    fontSize: 10,
    fontFamily: 'Manrope_600SemiBold',
  },
  pinDetailsCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  pinDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayIconBoxText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Manrope_800ExtraBold',
  },
  pinDetailTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
  },
  pinDetailSub: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  pinMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  pinActionRow: {
    marginTop: 4,
  },
  viewItineraryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  viewItineraryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
});
