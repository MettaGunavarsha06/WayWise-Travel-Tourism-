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
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/helpers';

export const HotelCard = ({
  hotel,
  onPress,
  onBookPress,
  isSelected = false,
}) => {
  const { theme, isDark } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;

  if (!hotel) return null;

  const handleLike = (e) => {
    e?.stopPropagation?.();
    setIsLiked(!isLiked);
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
    outputRange: [0, -5],
  });

  return (
    <Animated.View
      style={[
        styles.mockupHotelCardWrap,
        {
          transform: [{ scale: cardScale }, { translateY: cardTranslateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.touchableCardInner,
          {
            backgroundColor: isDark ? '#1C1E26' : theme.card,
            borderColor: isSelected
              ? theme.primary
              : isDark
              ? 'rgba(255, 255, 255, 0.10)'
              : theme.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      >
        {/* Left Rounded Image Thumbnail with Hotel Badge */}
        <View style={styles.thumbnailContainer}>
          <Image
            source={{
              uri:
                hotel.image ||
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            }}
            style={styles.thumbnailImg}
            resizeMode="cover"
          />
          <View style={styles.hotelPillBadge}>
            <Text style={styles.hotelPillText}>Hotel</Text>
          </View>
        </View>

        {/* Middle & Right Content */}
        <View style={styles.hotelInfoWrap}>
          {/* Title & Heart Button Row */}
          <View style={styles.hotelHeaderRow}>
            <Text
              style={[styles.hotelName, { color: theme.text }]}
              numberOfLines={1}
            >
              {hotel.name}
            </Text>
            <TouchableOpacity
              onPress={handleLike}
              activeOpacity={0.8}
              style={styles.heartSmallBtn}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={17}
                color={isLiked ? '#EF4444' : theme.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[styles.hotelSub, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {hotel.description ||
              `Discover finest luxury stay in ${hotel.destinationName || 'India'}.`}
          </Text>

          {/* Bottom Price & Star Rating Row */}
          <View style={styles.hotelBottomRow}>
            <Text style={[styles.hotelPrice, { color: theme.text }]}>
              {formatCurrency(hotel.pricePerNight || 3500)}
              <Text style={[styles.perNightText, { color: theme.textMuted }]}>
                /night
              </Text>
            </Text>

            <View style={styles.starRatingBadge}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text style={styles.starRatingVal}>{hotel.rating || 4.8}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mockupHotelCardWrap: {
    marginBottom: 16,
    overflow: 'visible',
  },
  touchableCardInner: {
    borderRadius: 22,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  thumbnailContainer: {
    width: 105,
    height: 105,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#232733',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  hotelPillBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(20, 23, 31, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  hotelPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
  },
  hotelInfoWrap: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  hotelHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  hotelName: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.2,
    flex: 1,
    marginRight: 6,
  },
  heartSmallBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  hotelSub: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 16,
    marginBottom: 8,
  },
  hotelBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotelPrice: {
    fontSize: 15,
    fontFamily: 'Manrope_800ExtraBold',
  },
  perNightText: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  starRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2330',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  starRatingVal: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
});
