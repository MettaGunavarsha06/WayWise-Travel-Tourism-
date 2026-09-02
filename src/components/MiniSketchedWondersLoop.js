import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
  Path,
  G,
  Circle,
  Line,
  Rect,
  Polyline,
} from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const MINI_HEIGHT = 40;
const SEGMENT_WIDTH = 960; // 8 world landmarks + rich architectural details across 960px

export const MiniSketchedWondersLoop = () => {
  const { theme, isDark } = useTheme();
  const [containerWidth, setContainerWidth] = useState(140);

  const scrollAnim = useRef(new Animated.Value(0)).current;
  const carBobAnim = useRef(new Animated.Value(0)).current;
  const wheelSpinAnim = useRef(new Animated.Value(0)).current;

  // Hand-drawn sketch marker stroke colors
  const strokeColor = isDark ? '#FFFFFF' : '#0F172A';
  const strokeDim = isDark ? 'rgba(255, 255, 255, 0.38)' : 'rgba(15, 23, 42, 0.40)';
  const strokeSoft = isDark ? 'rgba(255, 255, 255, 0.20)' : 'rgba(15, 23, 42, 0.22)';
  const carBodyFill = isDark ? '#181A22' : '#FFFFFF';
  const windowFill = isDark ? '#262936' : '#F1F5F9';

  useEffect(() => {
    // 1. Non-stop continuous loop
    const scrollLoop = Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -SEGMENT_WIDTH,
        duration: 22000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // 2. Car suspension bobbing
    const carBobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(carBobAnim, {
          toValue: -1.4,
          duration: 150,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(carBobAnim, {
          toValue: 1.0,
          duration: 180,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(carBobAnim, {
          toValue: 0,
          duration: 160,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Wheel rotation
    const wheelLoop = Animated.loop(
      Animated.timing(wheelSpinAnim, {
        toValue: 1,
        duration: 480,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    scrollLoop.start();
    carBobLoop.start();
    wheelLoop.start();

    return () => {
      scrollLoop.stop();
      carBobLoop.stop();
      wheelLoop.stop();
    };
  }, []);

  const wheelRotation = wheelSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Render intricately sketched landmarks in continuous loop
  const renderSketchedWonders = () => (
    <Svg width={SEGMENT_WIDTH} height={MINI_HEIGHT} viewBox={`0 0 ${SEGMENT_WIDTH} ${MINI_HEIGHT}`}>
      {/* Background Distant Mountain Ridgeline & Clouds */}
      <Path
        d="M 0,22 Q 40,16 80,21 T 160,17 T 240,22 T 320,18 T 400,22 T 480,17 T 560,21 T 640,18 T 720,22 T 800,17 T 880,21 T 960,22"
        stroke={strokeSoft}
        strokeWidth="0.8"
        fill="none"
      />

      {/* Floating Whispering Clouds & Soaring Birds */}
      <G stroke={strokeDim} strokeWidth="0.7" fill="none">
        {/* Cloud 1 */}
        <Path d="M 60,7 Q 66,4 72,6 Q 78,3 84,7 Q 88,9 85,11 L 62,11 Q 58,9 60,7 Z" />
        {/* Birds 1 */}
        <Path d="M 110,5 Q 112,3 114,5 Q 116,3 118,5" />
        <Path d="M 122,8 Q 124,6 126,8 Q 128,6 130,8" />

        {/* Cloud 2 */}
        <Path d="M 310,6 Q 316,3 322,5 Q 328,2 334,6 Q 338,8 335,10 L 312,10 Q 308,8 310,6 Z" />
        {/* Birds 2 */}
        <Path d="M 360,5 Q 362,3 364,5 Q 366,3 368,5" />

        {/* Cloud 3 */}
        <Path d="M 540,6 Q 546,3 552,5 Q 558,2 564,6 Q 568,8 565,10 L 542,10 Q 538,8 540,6 Z" />

        {/* Cloud 4 */}
        <Path d="M 770,5 Q 776,2 782,4 Q 788,1 794,5 Q 798,7 795,9 L 772,9 Q 768,7 770,5 Z" />
        {/* Birds 3 */}
        <Path d="M 820,4 Q 822,2 824,4 Q 826,2 828,4" />
      </G>

      {/* Ground Horizon and Highway Road Bed */}
      <Line x1="0" y1="30" x2={SEGMENT_WIDTH} y2="30" stroke={strokeColor} strokeWidth="1.2" />
      <Line x1="0" y1="33" x2={SEGMENT_WIDTH} y2="33" stroke={strokeDim} strokeWidth="0.8" strokeDasharray="4,4" />

      {/* ========================================================= */}
      {/* 1. TAJ MAHAL (AGRA, INDIA) - x: 25 */}
      {/* ========================================================= */}
      <G transform="translate(25, 2)">
        {/* Left Minaret (Outer, with 2 balconies & pointed cap) */}
        <Line x1="2" y1="28" x2="2" y2="7" stroke={strokeColor} strokeWidth="1.1" />
        <Line x1="5" y1="28" x2="5" y2="7" stroke={strokeColor} strokeWidth="1.1" />
        <Line x1="0" y1="18" x2="7" y2="18" stroke={strokeColor} strokeWidth="1" />
        <Line x1="0" y1="12" x2="7" y2="12" stroke={strokeColor} strokeWidth="1" />
        <Path d="M 1,7 Q 3.5,4 6,7 Z" stroke={strokeColor} strokeWidth="0.9" fill="none" />
        <Line x1="3.5" y1="4" x2="3.5" y2="2" stroke={strokeColor} strokeWidth="0.8" />

        {/* Right Minaret (Outer, with 2 balconies & pointed cap) */}
        <Line x1="49" y1="28" x2="49" y2="7" stroke={strokeColor} strokeWidth="1.1" />
        <Line x1="52" y1="28" x2="52" y2="7" stroke={strokeColor} strokeWidth="1.1" />
        <Line x1="47" y1="18" x2="54" y2="18" stroke={strokeColor} strokeWidth="1" />
        <Line x1="47" y1="12" x2="54" y2="12" stroke={strokeColor} strokeWidth="1" />
        <Path d="M 48,7 Q 50.5,4 53,7 Z" stroke={strokeColor} strokeWidth="0.9" fill="none" />
        <Line x1="50.5" y1="4" x2="50.5" y2="2" stroke={strokeColor} strokeWidth="0.8" />

        {/* Main Mausoleum Base & Grand Central Arch */}
        <Path d="M 10,28 L 10,13 L 44,13 L 44,28 Z" stroke={strokeColor} strokeWidth="1.3" fill="none" />
        {/* Central Iwan Grand Archway */}
        <Path d="M 21,28 L 21,19 C 21,15.5 33,15.5 33,19 L 33,28 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        {/* Left and Right Small Arches */}
        <Path d="M 13,20 L 13,16 C 13,14.5 17,14.5 17,16 L 17,20 Z" stroke={strokeDim} strokeWidth="0.8" fill="none" />
        <Path d="M 37,20 L 37,16 C 37,14.5 41,14.5 41,16 L 41,20 Z" stroke={strokeDim} strokeWidth="0.8" fill="none" />

        {/* Central Iconic Bulbous Onion Dome with Golden Finial */}
        <Path d="M 19,13 C 18,7 27,2 27,0 C 27,2 36,7 35,13 Z" stroke={strokeColor} strokeWidth="1.3" fill="none" />
        <Line x1="27" y1="0" x2="27" y2="-2.5" stroke={strokeColor} strokeWidth="1" />

        {/* Flanking Side Cupolas (Chhatris) */}
        <Path d="M 12,13 L 12,9 Q 15,6 18,9 L 18,13" stroke={strokeColor} strokeWidth="0.9" fill="none" />
        <Path d="M 36,13 L 36,9 Q 39,6 42,9 L 42,13" stroke={strokeColor} strokeWidth="0.9" fill="none" />
      </G>

      {/* ========================================================= */}
      {/* 2. PYRAMIDS OF GIZA & DESERT SUN (EGYPT) - x: 145 */}
      {/* ========================================================= */}
      <G transform="translate(145, 3)">
        {/* Radiant Desert Sun */}
        <Circle cx="50" cy="5" r="4" stroke={strokeColor} strokeWidth="1" fill="none" />
        <Line x1="50" y1="-0.5" x2="50" y2="-2.5" stroke={strokeDim} strokeWidth="0.8" />
        <Line x1="55" y1="2" x2="57" y2="0.5" stroke={strokeDim} strokeWidth="0.8" />
        <Line x1="56" y1="6.5" x2="58.5" y2="7.5" stroke={strokeDim} strokeWidth="0.8" />

        {/* Great Pyramid of Khufu */}
        <Path d="M 2,27 L 26,5 L 50,27 Z" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        {/* Ridge Line showing 3D faceted face */}
        <Line x1="26" y1="5" x2="31" y2="27" stroke={strokeColor} strokeWidth="1.2" />
        {/* Fine Stone Step Texture Lines */}
        <Line x1="8" y1="22" x2="29" y2="22" stroke={strokeDim} strokeWidth="0.7" />
        <Line x1="14" y1="17" x2="28" y2="17" stroke={strokeDim} strokeWidth="0.7" />
        <Line x1="20" y1="11" x2="27" y2="11" stroke={strokeDim} strokeWidth="0.7" />

        {/* Secondary Pyramid of Khafre in Background */}
        <Path d="M 40,27 L 56,12 L 68,27" stroke={strokeDim} strokeWidth="1.1" fill="none" />
        <Line x1="56" y1="12" x2="60" y2="27" stroke={strokeDim} strokeWidth="0.9" />

        {/* Silhouette Desert Palm Tree */}
        <Path d="M 72,27 Q 73,19 71,15" stroke={strokeColor} strokeWidth="1.1" fill="none" />
        <Path d="M 71,15 Q 66,13 64,16" stroke={strokeColor} strokeWidth="0.9" fill="none" />
        <Path d="M 71,15 Q 71,10 70,12" stroke={strokeColor} strokeWidth="0.9" fill="none" />
        <Path d="M 71,15 Q 76,12 78,16" stroke={strokeColor} strokeWidth="0.9" fill="none" />
      </G>

      {/* ========================================================= */}
      {/* 3. EIFFEL TOWER (PARIS, FRANCE) - x: 265 */}
      {/* ========================================================= */}
      <G transform="translate(265, 1)">
        {/* Base Grand Arch */}
        <Path d="M 4,29 Q 17,19 30,29" stroke={strokeColor} strokeWidth="1.3" fill="none" />
        {/* 4 Foundation Legs */}
        <Line x1="2" y1="29" x2="7" y2="21" stroke={strokeColor} strokeWidth="1.4" />
        <Line x1="7" y1="29" x2="10" y2="21" stroke={strokeColor} strokeWidth="1.1" />
        <Line x1="27" y1="29" x2="24" y2="21" stroke={strokeColor} strokeWidth="1.1" />
        <Line x1="32" y1="29" x2="27" y2="21" stroke={strokeColor} strokeWidth="1.4" />

        {/* First Platform Deck */}
        <Rect x="6" y="20" width="22" height="1.8" rx="0.5" stroke={strokeColor} strokeWidth="1.1" fill="none" />
        {/* First Level Cross Bracing */}
        <Line x1="9" y1="20" x2="13" y2="13" stroke={strokeDim} strokeWidth="0.8" />
        <Line x1="13" y1="20" x2="9" y2="13" stroke={strokeDim} strokeWidth="0.8" />
        <Line x1="21" y1="20" x2="25" y2="13" stroke={strokeDim} strokeWidth="0.8" />
        <Line x1="25" y1="20" x2="21" y2="13" stroke={strokeDim} strokeWidth="0.8" />

        {/* Second Platform Deck */}
        <Rect x="10" y="12" width="14" height="1.6" rx="0.5" stroke={strokeColor} strokeWidth="1" fill="none" />

        {/* Tapered Upper Spire Pillar */}
        <Path d="M 12,12 L 16,1.5 L 18,1.5 L 22,12 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        <Line x1="17" y1="12" x2="17" y2="2" stroke={strokeDim} strokeWidth="0.8" />

        {/* Beacon Dome & Needle Antenna Tip */}
        <Circle cx="17" cy="1.2" r="1.1" stroke={strokeColor} strokeWidth="0.9" fill="none" />
        <Line x1="17" y1="0.5" x2="17" y2="-2.5" stroke={strokeColor} strokeWidth="1" />
      </G>

      {/* ========================================================= */}
      {/* 4. COLOSSEUM (ROME, ITALY) - x: 375 */}
      {/* ========================================================= */}
      <G transform="translate(375, 4)">
        {/* Exterior Oval Wall with Classical Broken Ruin Silhouette */}
        <Path
          d="M 2,26 L 2,12 L 8,7 L 22,6 L 38,7 L 50,11 L 50,26 Z"
          stroke={strokeColor}
          strokeWidth="1.3"
          fill="none"
        />

        {/* Horizontal Tier Molding Lines */}
        <Line x1="3" y1="19" x2="49" y2="19" stroke={strokeColor} strokeWidth="1" />
        <Line x1="5" y1="13" x2="47" y2="13" stroke={strokeColor} strokeWidth="1" />

        {/* Lower Tier Arches */}
        <Path d="M 6,26 L 6,22 Q 9,20 12,22 L 12,26" stroke={strokeColor} strokeWidth="0.9" fill="none" />
        <Path d="M 15,26 L 15,22 Q 18,20 21,22 L 21,26" stroke={strokeColor} strokeWidth="0.9" fill="none" />
        <Path d="M 24,26 L 24,22 Q 27,20 30,22 L 30,26" stroke={strokeColor} strokeWidth="0.9" fill="none" />
        <Path d="M 33,26 L 33,22 Q 36,20 39,22 L 39,26" stroke={strokeColor} strokeWidth="0.9" fill="none" />
        <Path d="M 42,26 L 42,22 Q 45,20 48,22 L 48,26" stroke={strokeColor} strokeWidth="0.9" fill="none" />

        {/* Middle Tier Arches */}
        <Path d="M 7,19 L 7,15 Q 10,14 13,15 L 13,19" stroke={strokeDim} strokeWidth="0.8" fill="none" />
        <Path d="M 16,19 L 16,15 Q 19,14 22,15 L 22,19" stroke={strokeDim} strokeWidth="0.8" fill="none" />
        <Path d="M 25,19 L 25,15 Q 28,14 31,15 L 31,19" stroke={strokeDim} strokeWidth="0.8" fill="none" />
        <Path d="M 34,19 L 34,15 Q 37,14 40,15 L 40,19" stroke={strokeDim} strokeWidth="0.8" fill="none" />
        <Path d="M 43,19 L 43,15 Q 45.5,14 47,15 L 47,19" stroke={strokeDim} strokeWidth="0.8" fill="none" />

        {/* Upper Attic Square Windows */}
        <Rect x="10" y="8.5" width="3" height="3" stroke={strokeDim} strokeWidth="0.7" fill="none" />
        <Rect x="19" y="8" width="3" height="3" stroke={strokeDim} strokeWidth="0.7" fill="none" />
        <Rect x="28" y="8" width="3" height="3" stroke={strokeDim} strokeWidth="0.7" fill="none" />
        <Rect x="37" y="8.5" width="3" height="3" stroke={strokeDim} strokeWidth="0.7" fill="none" />
      </G>

      {/* ========================================================= */}
      {/* 5. BIG BEN & PALACE OF WESTMINSTER (LONDON, UK) - x: 495 */}
      {/* ========================================================= */}
      <G transform="translate(495, 1)">
        {/* Adjoining Parliament Hall & Crenellations */}
        <Path d="M 0,29 L 0,20 L 12,20 L 12,29 Z" stroke={strokeDim} strokeWidth="1" fill="none" />
        <Line x1="3" y1="20" x2="3" y2="18" stroke={strokeDim} strokeWidth="0.8" />
        <Line x1="6" y1="20" x2="6" y2="18" stroke={strokeDim} strokeWidth="0.8" />
        <Line x1="9" y1="20" x2="9" y2="18" stroke={strokeDim} strokeWidth="0.8" />

        {/* Main Clock Tower Shaft */}
        <Path d="M 12,29 L 12,8 L 26,8 L 26,29 Z" stroke={strokeColor} strokeWidth="1.3" fill="none" />
        <Line x1="19" y1="29" x2="19" y2="18" stroke={strokeDim} strokeWidth="0.8" />

        {/* Famous 4-Dial Clock Face */}
        <Circle cx="19" cy="13" r="4.2" stroke={strokeColor} strokeWidth="1.1" fill="none" />
        {/* Clock Hands pointing to 3 o'clock */}
        <Line x1="19" y1="13" x2="19" y2="10.5" stroke={strokeColor} strokeWidth="0.9" />
        <Line x1="19" y1="13" x2="21.5" y2="13" stroke={strokeColor} strokeWidth="0.9" />

        {/* Belfry & Roof Gallery */}
        <Path d="M 10,8 L 10,6 L 28,6 L 28,8 Z" stroke={strokeColor} strokeWidth="1" fill="none" />

        {/* Gothic Pyramid Spire & Finial Cross */}
        <Path d="M 11,6 L 19, -0.5 L 27,6 Z" stroke={strokeColor} strokeWidth="1.3" fill="none" />
        <Line x1="19" y1="-0.5" x2="19" y2="-3" stroke={strokeColor} strokeWidth="1" />
        <Line x1="17.5" y1="-2" x2="20.5" y2="-2" stroke={strokeColor} strokeWidth="0.8" />
      </G>

      {/* ========================================================= */}
      {/* 6. MT. FUJI & CHUREITO PAGODA (JAPAN) - x: 595 */}
      {/* ========================================================= */}
      <G transform="translate(595, 2)">
        {/* Symmetrical Mt. Fuji Volcanic Cone */}
        <Path d="M 16,28 L 44,5 L 72,28 Z" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        {/* Snow Cap Jagged Line */}
        <Path d="M 36,12 Q 40,15 44,12 Q 48,15 52,12" stroke={strokeColor} strokeWidth="1.1" fill="none" />
        <Line x1="44" y1="5" x2="44" y2="12" stroke={strokeDim} strokeWidth="0.7" />

        {/* Traditional Multi-Tier Japanese Pagoda */}
        <G transform="translate(0, 3)">
          <Path d="M 1,25 L 14,25 L 14,21 L 1,21 Z" stroke={strokeColor} strokeWidth="1" fill="none" />
          {/* Tier 1 Eaves (Upturned tips) */}
          <Path d="M -1,21 Q 7.5,19 16,21" stroke={strokeColor} strokeWidth="1.3" fill="none" />

          {/* Tier 2 */}
          <Path d="M 2.5,19 L 12.5,19 L 12.5,15 L 2.5,15 Z" stroke={strokeColor} strokeWidth="0.9" fill="none" />
          <Path d="M 0.5,15 Q 7.5,13 14.5,15" stroke={strokeColor} strokeWidth="1.3" fill="none" />

          {/* Tier 3 */}
          <Path d="M 4,13 L 11,13 L 11,9 L 4,9 Z" stroke={strokeColor} strokeWidth="0.9" fill="none" />
          <Path d="M 2,9 Q 7.5,7 13,9" stroke={strokeColor} strokeWidth="1.3" fill="none" />

          {/* Spire Needle (Kurin rings) */}
          <Line x1="7.5" y1="7" x2="7.5" y2="0" stroke={strokeColor} strokeWidth="1" />
          <Circle cx="7.5" cy="0" r="0.8" fill={strokeColor} />
        </G>
      </G>

      {/* ========================================================= */}
      {/* 7. GATEWAY OF INDIA / ROYAL TRIUMPHAL ARCH - x: 715 */}
      {/* ========================================================= */}
      <G transform="translate(715, 3)">
        {/* Main Base & Side Towers */}
        <Path d="M 2,27 L 2,10 L 8,10 L 8,27" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        <Path d="M 38,27 L 38,10 L 44,10 L 44,27" stroke={strokeColor} strokeWidth="1.2" fill="none" />

        {/* Monumental Central Arch Spanning Top */}
        <Path d="M 8,10 L 8,6 L 38,6 L 38,10" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        {/* Central Royal Pointed Arch */}
        <Path d="M 13,27 L 13,17 Q 23,11 33,17 L 33,27 Z" stroke={strokeColor} strokeWidth="1.3" fill="none" />

        {/* 4 Corner Domes (Chhatris) */}
        <Path d="M 2,10 Q 5,6 8,10 Z" stroke={strokeColor} strokeWidth="1" fill="none" />
        <Path d="M 38,10 Q 41,6 44,10 Z" stroke={strokeColor} strokeWidth="1" fill="none" />
        <Line x1="5" y1="6" x2="5" y2="4" stroke={strokeColor} strokeWidth="0.8" />
        <Line x1="41" y1="6" x2="41" y2="4" stroke={strokeColor} strokeWidth="0.8" />

        {/* Central Grand Dome */}
        <Path d="M 17,6 Q 23,0.5 29,6 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        <Line x1="23" y1="0.5" x2="23" y2="-1.5" stroke={strokeColor} strokeWidth="0.9" />

        {/* Jali Lattice Perforations */}
        <Line x1="15" y1="8" x2="31" y2="8" stroke={strokeDim} strokeWidth="0.8" strokeDasharray="2,2" />
      </G>

      {/* ========================================================= */}
      {/* 8. SYDNEY OPERA HOUSE & OCEAN SAILS (AUSTRALIA) - x: 825 */}
      {/* ========================================================= */}
      <G transform="translate(825, 4)">
        {/* Shell 1 (Small Front Sail) */}
        <Path d="M 4,26 C 6,17 14,14 18,26 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
        {/* Shell 2 (Tall Main Sail) */}
        <Path d="M 12,26 C 15,10 25,6 30,26 Z" stroke={strokeColor} strokeWidth="1.4" fill="none" />
        {/* Shell 3 (Secondary Grand Sail) */}
        <Path d="M 24,26 C 27,12 36,8 42,26 Z" stroke={strokeColor} strokeWidth="1.3" fill="none" />
        {/* Shell 4 (Rear Restaurant Sail) */}
        <Path d="M 38,26 C 41,18 48,16 52,26 Z" stroke={strokeColor} strokeWidth="1.1" fill="none" />

        {/* Harbor Water Waves */}
        <Path d="M 0,28 Q 12,26 24,28 T 48,28 T 64,28" stroke={strokeDim} strokeWidth="0.8" fill="none" />
      </G>
    </Svg>
  );

  return (
    <View
      onLayout={(e) => {
        const { width } = e.nativeEvent.layout;
        if (width > 0) setContainerWidth(width);
      }}
      style={[
        styles.stretchContainer,
        {
          backgroundColor: isDark ? 'rgba(25, 28, 36, 0.92)' : 'rgba(241, 245, 249, 0.94)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
        },
      ]}
    >
      {/* Sliding Wonders Strip */}
      <Animated.View
        style={[
          styles.stripWrapper,
          {
            transform: [{ translateX: scrollAnim }],
          },
        ]}
      >
        {renderSketchedWonders()}
        {renderSketchedWonders()}
      </Animated.View>

      {/* Center Animated Sketched Hand-Drawn Car (EXACT MATCH to user drawing) */}
      <Animated.View
        style={[
          styles.carWrap,
          {
            transform: [{ translateY: carBobAnim }],
          },
        ]}
      >
        <Svg width="54" height="24" viewBox="0 0 54 24">
          {/* Main Car Body Outer Shell */}
          <Path
            d="
              M 2,21
              L 2,15.5
              C 2,14.5 3,14 4.5,14
              L 11,14
              L 16.5,4.5
              L 35.5,4.5
              L 41,14
              L 49,14
              C 52.5,14 53,16 53,19
              L 53,21
              L 47,21
              C 47,17.5 37,17.5 37,21
              L 19,21
              C 19,17.5 9,17.5 9,21
              Z
            "
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill={carBodyFill}
          />

          {/* Trapezoid Windows Frame */}
          <Path
            d="
              M 17,6
              L 35,6
              L 39.5,13
              L 13,13
              Z
            "
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeLinejoin="round"
            fill={windowFill}
          />

          {/* Vertical B-Pillar Window Divider */}
          <Line x1="26" y1="6" x2="26" y2="13" stroke={strokeColor} strokeWidth="1.4" />

          {/* Steering Wheel in Front Window (Diagonal bar & crossbar) */}
          <Line x1="32.5" y1="12" x2="36" y2="8.5" stroke={strokeColor} strokeWidth="1.2" />
          <Line x1="34" y1="7" x2="38" y2="10" stroke={strokeColor} strokeWidth="1.2" />

          {/* Middle Door Dividing Vertical Seam Line */}
          <Line x1="26" y1="13" x2="26" y2="21" stroke={strokeColor} strokeWidth="1.3" />

          {/* Horizontal Middle Body Seam Line */}
          <Line x1="9" y1="17.5" x2="37" y2="17.5" stroke={strokeColor} strokeWidth="0.9" />

          {/* Door Handles */}
          <Rect x="21" y="15.5" width="2.8" height="1" rx="0.5" fill={strokeColor} />
          <Rect x="28" y="15.5" width="2.8" height="1" rx="0.5" fill={strokeColor} />

          {/* Rear Tail Light Box */}
          <Path d="M 2.5,15.5 L 5.5,15.5 L 5.5,18.5 L 2.5,18.5 Z" stroke={strokeColor} strokeWidth="0.9" fill="none" />
          <Line x1="2.5" y1="17" x2="5.5" y2="17" stroke={strokeColor} strokeWidth="0.7" />

          {/* Front Headlight */}
          <Path d="M 49,15.5 C 52,16 52.5,18 51.5,19.5 L 48.5,19.5 Z" stroke={strokeColor} strokeWidth="1" fill="none" />
          <Path d="M 50.5,17 C 51.2,18 51,19 50,19.5" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        </Svg>

        {/* Left Rotating Wheel */}
        <Animated.View
          style={[
            styles.wheel,
            {
              left: 8.5,
              transform: [{ rotate: wheelRotation }],
            },
          ]}
        >
          <Svg width="11" height="11" viewBox="0 0 11 11">
            <Circle cx="5.5" cy="5.5" r="4.5" stroke={strokeColor} strokeWidth="1.4" fill={carBodyFill} />
            <Circle cx="5.5" cy="5.5" r="2.4" fill={strokeColor} />
            <Line x1="5.5" y1="1" x2="5.5" y2="3.1" stroke={strokeColor} strokeWidth="0.8" />
          </Svg>
        </Animated.View>

        {/* Right Rotating Wheel */}
        <Animated.View
          style={[
            styles.wheel,
            {
              left: 36.5,
              transform: [{ rotate: wheelRotation }],
            },
          ]}
        >
          <Svg width="11" height="11" viewBox="0 0 11 11">
            <Circle cx="5.5" cy="5.5" r="4.5" stroke={strokeColor} strokeWidth="1.4" fill={carBodyFill} />
            <Circle cx="5.5" cy="5.5" r="2.4" fill={strokeColor} />
            <Line x1="5.5" y1="1" x2="5.5" y2="3.1" stroke={strokeColor} strokeWidth="0.8" />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  stretchContainer: {
    height: MINI_HEIGHT,
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  stripWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row',
    width: SEGMENT_WIDTH * 2,
    height: MINI_HEIGHT,
  },
  carWrap: {
    position: 'absolute',
    left: '50%',
    marginLeft: -27,
    bottom: 5,
    zIndex: 20,
    width: 54,
    height: 24,
  },
  wheel: {
    position: 'absolute',
    bottom: -2,
    width: 11,
    height: 11,
  },
});
