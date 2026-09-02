import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Path,
  G,
  Circle,
  Line,
  Rect,
  Polyline,
  Polygon,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = 160;
const PANORAMA_SEGMENT_WIDTH = 1400; // Total width for all 7 wonders + loop bridge

// List of the 7 World Wonders with coordinates along the panorama
const WONDERS = [
  { id: 'taj', name: 'Taj Mahal', location: 'Agra, India', posX: 100, icon: '🏛️' },
  { id: 'colosseum', name: 'Colosseum', location: 'Rome, Italy', posX: 300, icon: '🏟️' },
  { id: 'petra', name: 'Petra', location: 'Wadi Musa, Jordan', posX: 500, icon: '🏜️' },
  { id: 'great_wall', name: 'Great Wall', location: 'Huairou, China', posX: 700, icon: '🏯' },
  { id: 'christ', name: 'Christ the Redeemer', location: 'Rio, Brazil', posX: 900, icon: '🗿' },
  { id: 'machu_picchu', name: 'Machu Picchu', location: 'Cusco, Peru', posX: 1100, icon: '⛰️' },
  { id: 'chichen_itza', name: 'Chichén Itzá', location: 'Yucatán, Mexico', posX: 1300, icon: '🏺' },
];

export const SketchedWondersLoop = ({ onWonderPress }) => {
  const { theme, isDark } = useTheme();

  // Animation values
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const carBobAnim = useRef(new Animated.Value(0)).current;
  const wheelSpinAnim = useRef(new Animated.Value(0)).current;
  const puffAnim = useRef(new Animated.Value(0)).current;

  const [activeWonder, setActiveWonder] = useState(WONDERS[0]);

  // Sketch Stroke Colors
  const strokeColor = isDark ? 'rgba(255, 255, 255, 0.88)' : '#1E293B';
  const strokeDim = isDark ? 'rgba(255, 255, 255, 0.40)' : 'rgba(30, 41, 59, 0.45)';
  const strokeHatch = isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(30, 41, 59, 0.25)';
  const accentColor = '#4F75FF';

  useEffect(() => {
    // 1. Non-Stop Linear Infinite Panorama Scroll
    const scrollLoop = Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -PANORAMA_SEGMENT_WIDTH,
        duration: 22000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // 2. Car Suspension Bobbing & Pitch Tilt Loop
    const carBobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(carBobAnim, {
          toValue: -3.5,
          duration: 180,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(carBobAnim, {
          toValue: 2,
          duration: 220,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(carBobAnim, {
          toValue: -1.5,
          duration: 160,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(carBobAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Wheel Spin Loop
    const wheelLoop = Animated.loop(
      Animated.timing(wheelSpinAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // 4. Exhaust Puff Loop
    const puffLoop = Animated.loop(
      Animated.timing(puffAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );

    scrollLoop.start();
    carBobLoop.start();
    wheelLoop.start();
    puffLoop.start();

    // Listener to update active wonder badge based on current scroll position
    const listenerId = scrollAnim.addListener(({ value }) => {
      const pos = (Math.abs(value) + (CARD_WIDTH / 2 - 40)) % PANORAMA_SEGMENT_WIDTH;
      let closest = WONDERS[0];
      let minDiff = Infinity;
      for (const w of WONDERS) {
        const diff = Math.abs(w.posX - pos);
        if (diff < minDiff) {
          minDiff = diff;
          closest = w;
        }
      }
      setActiveWonder(closest);
    });

    return () => {
      scrollLoop.stop();
      carBobLoop.stop();
      wheelLoop.stop();
      puffLoop.stop();
      scrollAnim.removeListener(listenerId);
    };
  }, []);

  const wheelRotation = wheelSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const puffScale = puffAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1.8],
  });

  const puffOpacity = puffAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.8, 0.6, 0],
  });

  const puffTranslateX = puffAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -24],
  });

  // Render the architectural pencil-sketch vectors for all 7 wonders
  const renderSketchedWondersStrip = () => (
    <Svg width={PANORAMA_SEGMENT_WIDTH} height={CARD_HEIGHT} viewBox={`0 0 ${PANORAMA_SEGMENT_WIDTH} ${CARD_HEIGHT}`}>
      {/* Background Blueprint Grid / Sketch Horizon Guidelines */}
      <Line x1="0" y1="35" x2={PANORAMA_SEGMENT_WIDTH} y2="35" stroke={strokeHatch} strokeWidth="0.8" strokeDasharray="4,4" />
      <Line x1="0" y1="75" x2={PANORAMA_SEGMENT_WIDTH} y2="75" stroke={strokeHatch} strokeWidth="0.6" strokeDasharray="6,6" />

      {/* 1. TAJ MAHAL (Agra, India) - posX: 100 */}
      <G transform="translate(60, 20)">
        {/* Minarets */}
        <Path d="M 5,95 L 8,30 L 12,30 L 15,95 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        <Path d="M 6,30 L 10,20 L 14,30 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        <Line x1="5" y1="50" x2="15" y2="50" stroke={strokeColor} strokeWidth="1" />
        <Line x1="6" y1="70" x2="14" y2="70" stroke={strokeColor} strokeWidth="1" />

        <Path d="M 65,95 L 68,30 L 72,30 L 75,95 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        <Path d="M 66,30 L 70,20 L 74,30 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        <Line x1="65" y1="50" x2="75" y2="50" stroke={strokeColor} strokeWidth="1" />
        <Line x1="66" y1="70" x2="74" y2="70" stroke={strokeColor} strokeWidth="1" />

        {/* Central Dome & Facade */}
        <Path d="M 22,95 L 22,50 L 58,50 L 58,95 Z" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        <Path d="M 28,50 C 28,25 35,12 40,5 C 45,12 52,25 52,50 Z" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        <Line x1="40" y1="0" x2="40" y2="5" stroke={strokeColor} strokeWidth="1.2" />
        {/* Main Arch (Iwan) */}
        <Path d="M 33,95 L 33,65 C 33,56 47,56 47,65 L 47,95 Z" stroke={strokeColor} strokeWidth="1.3" fill="none" />
        {/* Side Chattris */}
        <Path d="M 23,50 L 26,40 L 30,50 Z" stroke={strokeColor} strokeWidth="1" fill="none" />
        <Path d="M 50,50 L 54,40 L 57,50 Z" stroke={strokeColor} strokeWidth="1" fill="none" />
        {/* Sketch Hatching */}
        <Line x1="26" y1="75" x2="30" y2="75" stroke={strokeHatch} strokeWidth="0.8" />
        <Line x1="50" y1="75" x2="54" y2="75" stroke={strokeHatch} strokeWidth="0.8" />
      </G>

      {/* 2. COLOSSEUM (Rome, Italy) - posX: 300 */}
      <G transform="translate(255, 32)">
        {/* Tiered Elliptical Arches */}
        <Path d="M 5,83 C 5,45 85,45 85,83 Z" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        <Path d="M 12,83 C 12,55 78,55 78,83 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        {/* Ruined Upper Wall Tier */}
        <Path d="M 5,48 L 10,30 L 25,32 L 30,24 L 45,26 L 50,34 L 70,36 L 85,50" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        {/* Colonnade Vertical Pillars */}
        <Line x1="18" y1="52" x2="18" y2="83" stroke={strokeColor} strokeWidth="1" />
        <Line x1="28" y1="46" x2="28" y2="83" stroke={strokeColor} strokeWidth="1" />
        <Line x1="38" y1="42" x2="38" y2="83" stroke={strokeColor} strokeWidth="1" />
        <Line x1="48" y1="40" x2="48" y2="83" stroke={strokeColor} strokeWidth="1" />
        <Line x1="58" y1="42" x2="58" y2="83" stroke={strokeColor} strokeWidth="1" />
        <Line x1="68" y1="46" x2="68" y2="83" stroke={strokeColor} strokeWidth="1" />
        <Line x1="78" y1="52" x2="78" y2="83" stroke={strokeColor} strokeWidth="1" />
        {/* Arch Loops */}
        <Path d="M 18,65 C 23,60 23,60 28,65 M 28,65 C 33,60 33,60 38,65 M 38,65 C 43,60 43,60 48,65 M 48,65 C 53,60 53,60 58,65 M 58,65 C 63,60 63,60 68,65" stroke={strokeColor} strokeWidth="1" fill="none" />
        <Path d="M 28,76 C 33,72 33,72 38,76 M 38,76 C 43,72 43,72 48,76 M 48,76 C 53,72 53,72 58,76" stroke={strokeColor} strokeWidth="1" fill="none" />
      </G>

      {/* 3. PETRA (Wadi Musa, Jordan) - posX: 500 */}
      <G transform="translate(455, 20)">
        {/* Carved Cliff Frame */}
        <Path d="M 0,95 L 8,10 L 22,25 L 20,95" stroke={strokeDim} strokeWidth="1.2" strokeDasharray="3,2" fill="none" />
        <Path d="M 75,95 L 72,15 L 88,8 L 92,95" stroke={strokeDim} strokeWidth="1.2" strokeDasharray="3,2" fill="none" />
        {/* Al-Khazneh Treasury Facade */}
        <Path d="M 20,95 L 20,25 L 72,25 L 72,95 Z" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        {/* Upper Pediment & Urn */}
        <Path d="M 20,25 L 46,6 L 72,25" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        <Path d="M 42,6 C 42,0 50,0 50,6 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        {/* Classical Columns */}
        <Line x1="28" y1="25" x2="28" y2="95" stroke={strokeColor} strokeWidth="1.2" />
        <Line x1="38" y1="25" x2="38" y2="95" stroke={strokeColor} strokeWidth="1.2" />
        <Line x1="54" y1="25" x2="54" y2="95" stroke={strokeColor} strokeWidth="1.2" />
        <Line x1="64" y1="25" x2="64" y2="95" stroke={strokeColor} strokeWidth="1.2" />
        {/* Center Grand Portal */}
        <Path d="M 38,95 L 38,60 C 38,52 54,52 54,60 L 54,95 Z" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        {/* Horizontal Entablatures */}
        <Line x1="20" y1="48" x2="72" y2="48" stroke={strokeColor} strokeWidth="1.2" />
      </G>

      {/* 4. GREAT WALL OF CHINA (China) - posX: 700 */}
      <G transform="translate(650, 24)">
        {/* Mountain Ridge */}
        <Path d="M 0,75 Q 35,45 60,65 T 115,40 T 150,85" stroke={strokeDim} strokeWidth="1" strokeDasharray="4,2" fill="none" />
        {/* Winding Fortified Wall */}
        <Path d="M 0,82 Q 35,52 60,72 T 115,48 T 150,92" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        <Path d="M 0,88 Q 35,58 60,78 T 115,54 T 150,98" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        {/* Watchtower 1 */}
        <Path d="M 48,72 L 48,50 L 68,50 L 68,72 Z" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        <Path d="M 46,50 L 46,45 L 70,45 L 70,50 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        <Line x1="52" y1="45" x2="52" y2="42" stroke={strokeColor} strokeWidth="1" />
        <Line x1="64" y1="45" x2="64" y2="42" stroke={strokeColor} strokeWidth="1" />
        <Rect x="54" y="56" width="8" height="12" stroke={strokeColor} strokeWidth="1" fill="none" />
        {/* Watchtower 2 */}
        <Path d="M 108,48 L 108,28 L 126,28 L 126,48 Z" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        <Path d="M 106,28 L 106,24 L 128,24 L 128,28 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        {/* Wall Crenelations / Stone Blocks */}
        <Line x1="12" y1="78" x2="12" y2="84" stroke={strokeColor} strokeWidth="0.9" />
        <Line x1="28" y1="68" x2="28" y2="74" stroke={strokeColor} strokeWidth="0.9" />
        <Line x1="84" y1="62" x2="84" y2="68" stroke={strokeColor} strokeWidth="0.9" />
      </G>

      {/* 5. CHRIST THE REDEEMER (Rio, Brazil) - posX: 900 */}
      <G transform="translate(860, 15)">
        {/* Mount Corcovado Mountain Base */}
        <Path d="M 10,100 Q 30,55 45,45 Q 60,55 80,100" stroke={strokeDim} strokeWidth="1.2" strokeDasharray="3,2" fill="none" />
        {/* Pedestal */}
        <Rect x="38" y="38" width="14" height="12" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        {/* Statue Figure Body & Robes */}
        <Path d="M 41,38 L 43,15 L 47,15 L 49,38 Z" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        {/* Outstretched Open Arms */}
        <Path d="M 22,20 L 68,20 L 68,23 L 49,24 L 41,24 L 22,23 Z" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        {/* Head */}
        <Circle cx="45" cy="11" r="3.5" stroke={strokeColor} strokeWidth="1.3" fill="none" />
        {/* Birds in flight */}
        <Path d="M 15,10 Q 20,6 25,10 Q 30,6 35,10" stroke={strokeDim} strokeWidth="0.8" fill="none" />
      </G>

      {/* 6. MACHU PICCHU (Cusco, Peru) - posX: 1100 */}
      <G transform="translate(1040, 18)">
        {/* Huayna Picchu Iconic Mountain Peak */}
        <Path d="M 10,95 L 35,8 L 65,55 L 90,25 L 115,95" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        {/* Mountain Ridge Hatching */}
        <Line x1="35" y1="8" x2="30" y2="55" stroke={strokeHatch} strokeWidth="0.9" />
        <Line x1="35" y1="20" x2="48" y2="40" stroke={strokeHatch} strokeWidth="0.8" />
        <Line x1="90" y1="25" x2="85" y2="65" stroke={strokeHatch} strokeWidth="0.8" />
        {/* Stepped Agricultural Terraces */}
        <Polyline points="5,82 25,82 25,87 50,87 50,92 80,92" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        <Polyline points="20,72 45,72 45,77 70,77 70,82 95,82" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        {/* Ancient Stone Ruin Shelters */}
        <Path d="M 68,68 L 74,60 L 80,68 Z" stroke={strokeColor} strokeWidth="1.1" fill="none" />
        <Path d="M 82,74 L 87,67 L 93,74 Z" stroke={strokeColor} strokeWidth="1.1" fill="none" />
      </G>

      {/* 7. CHICHÉN ITZÁ (El Castillo, Mexico) - posX: 1300 */}
      <G transform="translate(1240, 24)">
        {/* Stepped Mayan Pyramid Tiers */}
        <Path d="M 5,90 L 22,35 L 68,35 L 85,90 Z" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        {/* Central Grand Staircase */}
        <Path d="M 36,90 L 40,35 L 50,35 L 54,90 Z" stroke={strokeColor} strokeWidth="1.3" fill="none" />
        {/* Stair Steps */}
        <Line x1="37" y1="80" x2="53" y2="80" stroke={strokeColor} strokeWidth="0.8" />
        <Line x1="38" y1="70" x2="52" y2="70" stroke={strokeColor} strokeWidth="0.8" />
        <Line x1="39" y1="60" x2="51" y2="60" stroke={strokeColor} strokeWidth="0.8" />
        <Line x1="40" y1="50" x2="50" y2="50" stroke={strokeColor} strokeWidth="0.8" />
        <Line x1="40" y1="42" x2="50" y2="42" stroke={strokeColor} strokeWidth="0.8" />
        {/* Pyramid Terraced Levels Lines */}
        <Line x1="18" y1="48" x2="39" y2="48" stroke={strokeDim} strokeWidth="1" />
        <Line x1="51" y1="48" x2="72" y2="48" stroke={strokeDim} strokeWidth="1" />
        <Line x1="14" y1="62" x2="38" y2="62" stroke={strokeDim} strokeWidth="1" />
        <Line x1="52" y1="62" x2="76" y2="62" stroke={strokeDim} strokeWidth="1" />
        <Line x1="10" y1="76" x2="37" y2="76" stroke={strokeDim} strokeWidth="1" />
        <Line x1="53" y1="76" x2="80" y2="76" stroke={strokeDim} strokeWidth="1" />
        {/* Top Temple Sanctuary */}
        <Rect x="38" y="24" width="14" height="11" stroke={strokeColor} strokeWidth="1.3" fill="none" />
        <Rect x="42" y="28" width="6" height="7" stroke={strokeColor} strokeWidth="1" fill="none" />
      </G>

      {/* Sketched Dotted Road Trail & Mile Markers */}
      <Line x1="0" y1="120" x2={PANORAMA_SEGMENT_WIDTH} y2="120" stroke={strokeColor} strokeWidth="1.8" />
      <Line x1="0" y1="126" x2={PANORAMA_SEGMENT_WIDTH} y2="126" stroke={strokeDim} strokeWidth="1" strokeDasharray="8,6" />
    </Svg>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(18, 20, 26, 0.94)' : 'rgba(255, 255, 255, 0.92)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
        },
      ]}
    >
      {/* Top Header Badge Row */}
      <View style={styles.topInfoBar}>
        <View style={styles.wonderLiveBadge}>
          <Text style={styles.wonderIcon}>{activeWonder.icon}</Text>
          <View>
            <Text style={[styles.wonderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {activeWonder.name}
            </Text>
            <Text style={styles.wonderSub}>{activeWonder.location}</Text>
          </View>
        </View>

        <View style={styles.wondersCountPill}>
          <Ionicons name="infinite" size={13} color="#4F75FF" />
          <Text style={styles.wondersCountText}>World 7 Wonders Tour</Text>
        </View>
      </View>

      {/* Infinite Panoramic Viewport */}
      <View style={styles.viewport}>
        {/* Seamless Duplicated Animated Strip for 100% Non-Stop Loop */}
        <Animated.View
          style={[
            styles.stripWrapper,
            {
              transform: [{ translateX: scrollAnim }],
            },
          ]}
        >
          {renderSketchedWondersStrip()}
          {renderSketchedWondersStrip()}
        </Animated.View>

        {/* Mid-Screen Center Sketched Car */}
        <Animated.View
          style={[
            styles.carContainer,
            {
              transform: [{ translateY: carBobAnim }],
            },
          ]}
        >
          {/* Exhaust Smoke Puff */}
          <Animated.View
            style={[
              styles.exhaustPuff,
              {
                opacity: puffOpacity,
                transform: [{ scale: puffScale }, { translateX: puffTranslateX }],
              },
            ]}
          >
            <Svg width="18" height="12" viewBox="0 0 18 12">
              <Circle cx="8" cy="6" r="4" stroke={strokeDim} strokeWidth="1" fill="none" strokeDasharray="2,2" />
              <Circle cx="13" cy="5" r="3" stroke={strokeDim} strokeWidth="0.8" fill="none" strokeDasharray="2,2" />
            </Svg>
          </Animated.View>

          {/* Hand-Sketched Car SVG Body */}
          <Svg width="88" height="46" viewBox="0 0 88 46">
            {/* Headlights Pencil Beam Rays */}
            <Line x1="82" y1="28" x2="98" y2="24" stroke="rgba(79, 117, 255, 0.4)" strokeWidth="1.2" strokeDasharray="3,2" />
            <Line x1="82" y1="30" x2="98" y2="34" stroke="rgba(79, 117, 255, 0.4)" strokeWidth="1.2" strokeDasharray="3,2" />

            {/* Roof Luggage Rack with Strapped Travel Bags */}
            <Line x1="28" y1="12" x2="54" y2="12" stroke={strokeColor} strokeWidth="1.4" />
            <Rect x="30" y="4" width="12" height="8" rx="2" stroke={strokeColor} strokeWidth="1.2" fill="none" />
            <Rect x="43" y="2" width="10" height="10" rx="2" stroke={strokeColor} strokeWidth="1.2" fill="none" />
            <Line x1="36" y1="4" x2="36" y2="12" stroke={strokeHatch} strokeWidth="0.9" />
            <Line x1="48" y1="2" x2="48" y2="12" stroke={strokeHatch} strokeWidth="0.9" />

            {/* Convertible Body Frame / Windshield */}
            <Path
              d="M 10,34 L 14,24 L 26,20 L 56,20 L 66,24 L 80,26 L 82,34 L 74,34 C 74,28 62,28 62,34 L 32,34 C 32,28 20,28 20,34 Z"
              stroke={strokeColor}
              strokeWidth="1.6"
              fill={isDark ? '#191C24' : '#F1F5F9'}
            />
            {/* Slanted Windshield & Driver */}
            <Path d="M 52,20 L 60,10 L 64,20" stroke={strokeColor} strokeWidth="1.4" fill="none" />
            <Circle cx="44" cy="15" r="3.5" stroke={strokeColor} strokeWidth="1.2" fill="none" />
            {/* Steering Wheel */}
            <Line x1="52" y1="16" x2="56" y2="20" stroke={strokeColor} strokeWidth="1.4" />

            {/* Door Line & Handle */}
            <Line x1="34" y1="20" x2="34" y2="34" stroke={strokeColor} strokeWidth="1" />
            <Line x1="52" y1="20" x2="52" y2="34" stroke={strokeColor} strokeWidth="1" />
            <Line x1="38" y1="23" x2="44" y2="23" stroke={strokeColor} strokeWidth="1.2" />

            {/* Front & Rear Bumpers */}
            <Path d="M 8,33 L 11,35" stroke={strokeColor} strokeWidth="2" />
            <Path d="M 80,33 L 84,35" stroke={strokeColor} strokeWidth="2" />
          </Svg>

          {/* Left Rotating Sketched Wheel */}
          <Animated.View
            style={[
              styles.wheel,
              {
                left: 17,
                transform: [{ rotate: wheelRotation }],
              },
            ]}
          >
            <Svg width="18" height="18" viewBox="0 0 18 18">
              <Circle cx="9" cy="9" r="8" stroke={strokeColor} strokeWidth="1.5" fill={isDark ? '#111216' : '#FFFFFF'} />
              <Circle cx="9" cy="9" r="3" stroke={strokeColor} strokeWidth="1.2" fill="none" />
              {/* Wheel Spokes */}
              <Line x1="9" y1="1" x2="9" y2="17" stroke={strokeColor} strokeWidth="1" />
              <Line x1="1" y1="9" x2="17" y2="9" stroke={strokeColor} strokeWidth="1" />
              <Line x1="3" y1="3" x2="15" y2="15" stroke={strokeColor} strokeWidth="0.8" />
              <Line x1="15" y1="3" x2="3" y2="15" stroke={strokeColor} strokeWidth="0.8" />
            </Svg>
          </Animated.View>

          {/* Right Rotating Sketched Wheel */}
          <Animated.View
            style={[
              styles.wheel,
              {
                left: 59,
                transform: [{ rotate: wheelRotation }],
              },
            ]}
          >
            <Svg width="18" height="18" viewBox="0 0 18 18">
              <Circle cx="9" cy="9" r="8" stroke={strokeColor} strokeWidth="1.5" fill={isDark ? '#111216' : '#FFFFFF'} />
              <Circle cx="9" cy="9" r="3" stroke={strokeColor} strokeWidth="1.2" fill="none" />
              {/* Wheel Spokes */}
              <Line x1="9" y1="1" x2="9" y2="17" stroke={strokeColor} strokeWidth="1" />
              <Line x1="1" y1="9" x2="17" y2="9" stroke={strokeColor} strokeWidth="1" />
              <Line x1="3" y1="3" x2="15" y2="15" stroke={strokeColor} strokeWidth="0.8" />
              <Line x1="15" y1="3" x2="3" y2="15" stroke={strokeColor} strokeWidth="0.8" />
            </Svg>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  topInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
    zIndex: 20,
  },
  wonderLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wonderIcon: {
    fontSize: 20,
  },
  wonderTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.2,
  },
  wonderSub: {
    fontSize: 10.5,
    fontFamily: 'Manrope_500Medium',
    color: '#8E95A5',
  },
  wondersCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 117, 255, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(79, 117, 255, 0.25)',
  },
  wondersCountText: {
    color: '#4F75FF',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  viewport: {
    height: CARD_HEIGHT,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  stripWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row',
    width: PANORAMA_SEGMENT_WIDTH * 2,
    height: CARD_HEIGHT,
  },
  carContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -44,
    bottom: 24,
    zIndex: 30,
    width: 88,
    height: 46,
  },
  exhaustPuff: {
    position: 'absolute',
    left: -12,
    bottom: 8,
    zIndex: 25,
  },
  wheel: {
    position: 'absolute',
    bottom: 0,
    width: 18,
    height: 18,
  },
});
