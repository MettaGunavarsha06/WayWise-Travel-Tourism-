import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTrips } from '../context/TripContext';
import { getTranslatedDestination } from '../data/translations';
import { formatCurrency } from '../utils/helpers';

export const DestinationCard = ({
  destination: rawDestination,
  onPress,
  onBookmark,
  style,
  horizontal = false,
}) => {
  const { theme, isDark } = useTheme();
  const { currentLanguage } = useLanguage?.() || { currentLanguage: 'en' };
  const { toggleSavePlace, isPlaceSaved } = useTrips?.() || {};

  const destination = rawDestination
    ? getTranslatedDestination?.(rawDestination, currentLanguage) || rawDestination
    : null;

  const [localLiked, setLocalLiked] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;

  if (!destination) return null;

  const isSaved = isPlaceSaved ? isPlaceSaved(destination.id) : localLiked;

  const handleLike = (e) => {
    e?.stopPropagation?.();
    setLocalLiked(!localLiked);
    if (toggleSavePlace) {
      toggleSavePlace(destination);
    }
    if (onBookmark) onBookmark(destination);
  };

  const handlePressIn = () => {
    Animated.spring(floatAnim, {
      toValue: 1,
      bounciness: 8,
      speed: 18,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(floatAnim, {
      toValue: 0,
      bounciness: 5,
      speed: 14,
      useNativeDriver: true,
    }).start();
  };

  const cardScale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const cardTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <Animated.View
      style={[
        horizontal ? styles.horizontalHeroCardWrap : styles.heroCardWrap,
        {
          transform: [{ scale: cardScale }, { translateY: cardTranslateY }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.heroCardInner,
          {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : theme.border,
          },
        ]}
      >
        {/* Full Cover Destination Photography */}
        <Image
          source={{
            uri:
              destination.image ||
              'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Smooth Glass Scrim - Soft seamless gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.10)', 'rgba(12,15,22,0.58)']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Top Floating Glass Badges Row */}
        <View style={styles.topRow}>
          {/* Duration Glass Badge */}
          <View style={styles.frostedPill}>
            <Text style={styles.frostedPillText}>
              {destination.duration || '3 Days, 2 Nights'}
            </Text>
          </View>

          {/* Floating Glass Heart Bookmark */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLike}
            style={styles.frostedHeartBtn}
          >
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={18}
              color={isSaved ? '#EF4444' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Floating Frosted Glass Control Bar (Price, Destination Name, City) */}
        <View
          style={[
            styles.bottomControlBar,
            {
              backgroundColor: isDark ? 'rgba(26, 30, 42, 0.72)' : 'rgba(255, 255, 255, 0.85)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
        >
          {/* Left Arrow Button */}
          <View
            style={[
              styles.controlCircleBtn,
              { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.06)' },
            ]}
          >
            <Ionicons name="arrow-back" size={16} color={isDark ? '#FFFFFF' : theme.text} />
          </View>

          {/* Center: Destination Name, Subtitle & Price */}
          <View style={styles.centerMetaWrap}>
            <Text
              style={[styles.destName, { color: isDark ? '#FFFFFF' : theme.text }]}
              numberOfLines={1}
            >
              {destination.name}
            </Text>
            <Text
              style={[styles.destSub, { color: isDark ? '#A1A8B8' : theme.textSecondary }]}
              numberOfLines={1}
            >
              {destination.subtitle ||
                `${destination.state || 'India'} · ${destination.category || 'Travel'}`}
            </Text>
            <Text style={[styles.priceTag, { color: isDark ? '#FFFFFF' : theme.primaryDark }]}>
              {formatCurrency(destination.estimatedCost || 12000)}
            </Text>
          </View>

          {/* Right Action Arrow Button */}
          <View
            style={[
              styles.controlCircleBtn,
              { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.06)' },
            ]}
          >
            <Ionicons name="arrow-forward" size={16} color={isDark ? '#FFFFFF' : theme.text} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  heroCardWrap: {
    height: 320,
    marginBottom: 20,
    overflow: 'visible',
  },
  horizontalHeroCardWrap: {
    width: 270,
    height: 300,
    marginRight: 16,
    overflow: 'visible',
  },
  heroCardInner: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  frostedPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(25, 28, 36, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  frostedPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: 0.2,
  },
  frostedHeartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(25, 28, 36, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControlBar: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  controlCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerMetaWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  destName: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  destSub: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
    marginTop: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  priceTag: {
    fontSize: 15,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: 0.3,
  },
});
