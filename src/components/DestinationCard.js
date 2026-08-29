import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTrips } from '../context/TripContext';
import { CrowdIndicator } from './CrowdIndicator';
import { EcoScoreBadge } from './EcoScoreBadge';
import { formatCurrency } from '../utils/helpers';

export const DestinationCard = ({ destination, onPress, style, horizontal = false }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { toggleSavePlace, isPlaceSaved } = useTrips();

  const isSaved = isPlaceSaved(destination.id);

  const handleSavePress = (e) => {
    e.stopPropagation();
    toggleSavePlace(destination);
  };

  if (horizontal) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={[
          styles.horizontalCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            shadowColor: theme.shadow,
          },
          style,
        ]}
      >
        <View style={styles.hImageWrap}>
          <Image source={{ uri: destination.image }} style={styles.horizontalImage} resizeMode="cover" />
          
          {/* Overlay rating badge */}
          <View style={styles.hOverlayRating}>
            <Ionicons name="star" size={11} color="#F59E0B" />
            <Text style={styles.hOverlayRatingText}>{destination.rating}</Text>
          </View>

          {/* Instagram-Style Bookmark Save Icon */}
          <TouchableOpacity
            onPress={handleSavePress}
            style={[styles.hOverlayBookmark, isSaved && { backgroundColor: '#2563EB' }]}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={14}
              color={isSaved ? '#FFFFFF' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.horizontalContent}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {destination.name}
          </Text>
          <Text style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
            <Ionicons name="location-outline" size={11} color={theme.textMuted} />{' '}
            {destination.state}
          </Text>

          {destination.isHiddenGem && destination.alternativeTo ? (
            <Text style={[styles.altTag, { color: theme.primary }]} numberOfLines={1}>
              {destination.alternativeTo}
            </Text>
          ) : null}

          <View style={styles.badgesRow}>
            <CrowdIndicator level={destination.crowdLevel} compact />
            <EcoScoreBadge score={destination.ecoScore} size="small" showLabel={false} />
          </View>

          <View style={styles.bottomRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={12} color={theme.textSecondary} />
              <Text style={[styles.duration, { color: theme.textSecondary }]}>
                {destination.duration}
              </Text>
            </View>
            <Text style={[styles.duration, { color: theme.primary, fontFamily: 'Manrope_700Bold' }]}>
              {t('exploreArrow') || 'Explore →'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
        style,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: destination.image }} style={styles.image} resizeMode="cover" />

        {/* Hidden Gem badge */}
        {destination.isHiddenGem && (
          <View style={styles.hiddenGemBadge}>
            <Ionicons name="compass-outline" size={12} color="#BBF7D0" style={{ marginRight: 4 }} />
            <Text style={styles.hiddenGemText}>Hidden Gem</Text>
          </View>
        )}

        {/* Top Right Badges: Rating + Bookmark */}
        <View style={styles.topRightBadgeGroup}>
          <View style={styles.overlayRating}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.overlayRatingText}>{destination.rating}</Text>
          </View>

          {/* Instagram-Style Bookmark Button */}
          <TouchableOpacity
            onPress={handleSavePress}
            style={[
              styles.overlayBookmark,
              isSaved && { backgroundColor: '#2563EB', borderColor: '#2563EB' },
            ]}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={15}
              color={isSaved ? '#FFFFFF' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {destination.name}
          </Text>
          {destination.subtitle && (
            <Text style={[styles.subtitleTag, { color: theme.primary }]}>
              {destination.subtitle}
            </Text>
          )}
        </View>

        <Text style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
          <Ionicons name="location-outline" size={12} color={theme.textMuted} />{' '}
          {destination.state} · {destination.category}
        </Text>

        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {destination.description}
        </Text>

        <View style={styles.badgesRow}>
          <CrowdIndicator level={destination.crowdLevel} compact />
          <EcoScoreBadge score={destination.ecoScore} size="small" showLabel={false} />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

        <View style={styles.footer}>
          <View style={styles.categoryPill}>
            <Ionicons name="compass-outline" size={13} color={theme.primary} />
            <Text style={[styles.categoryPillText, { color: theme.primary }]}>
              {destination.category}
            </Text>
          </View>
          <View style={styles.durationPill}>
            <Ionicons name="time-outline" size={13} color={theme.textSecondary} />
            <Text style={[styles.durationText, { color: theme.textSecondary }]}>
              {destination.duration}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Vertical card
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hiddenGemBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(22, 101, 52, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hiddenGemText: {
    color: '#BBF7D0',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  topRightBadgeGroup: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  overlayRating: {
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  overlayRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  overlayBookmark: {
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.2,
    flex: 1,
  },
  subtitleTag: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
    marginLeft: 8,
  },
  location: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  cost: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
  perPerson: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  categoryPillText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },

  // Horizontal card
  horizontalCard: {
    width: 250,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  hImageWrap: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
  },
  hOverlayRating: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  hOverlayRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  hOverlayBookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalContent: {
    padding: 12,
  },
  altTag: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
    marginVertical: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  duration: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
});
