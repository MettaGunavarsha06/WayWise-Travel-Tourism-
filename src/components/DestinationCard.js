import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CrowdIndicator } from './CrowdIndicator';
import { EcoScoreBadge } from './EcoScoreBadge';
import { formatCurrency } from '../utils/helpers';

export const DestinationCard = ({ destination, onPress, style, horizontal = false }) => {
  const { theme } = useTheme();

  if (horizontal) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
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
        <Image source={{ uri: destination.image }} style={styles.horizontalImage} />
        {/* Overlay rating badge */}
        <View style={styles.hOverlayRating}>
          <Ionicons name="star" size={11} color="#F59E0B" />
          <Text style={styles.hOverlayRatingText}>{destination.rating}</Text>
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
              💎 {destination.alternativeTo}
            </Text>
          ) : null}

          <View style={styles.badgesRow}>
            <CrowdIndicator level={destination.crowdLevel} compact />
            <EcoScoreBadge score={destination.ecoScore} size="small" showLabel={false} />
          </View>

          <View style={styles.bottomRow}>
            <Text style={[styles.cost, { color: theme.primary }]}>
              {formatCurrency(destination.estimatedCost)}
              <Text style={[styles.perPerson, { color: theme.textMuted }]}> / trip</Text>
            </Text>
            <Text style={[styles.duration, { color: theme.textSecondary }]}>
              {destination.duration}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
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
        <Image source={{ uri: destination.image }} style={styles.image} />

        {/* Hidden Gem badge — green instead of dark/blue */}
        {destination.isHiddenGem && (
          <View style={styles.hiddenGemBadge}>
            <Text style={styles.hiddenGemText}>💎 Hidden Gem</Text>
          </View>
        )}

        <View style={styles.overlayRating}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={styles.overlayRatingText}>{destination.rating}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {destination.name}
        </Text>

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
          <View>
            <Text style={[styles.estLabel, { color: theme.textMuted }]}>Est. Cost</Text>
            <Text style={[styles.cost, { color: theme.primary }]}>
              {formatCurrency(destination.estimatedCost)}
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
    height: 165,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hiddenGemBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(22, 101, 52, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hiddenGemText: {
    color: '#BBF7D0',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  overlayRating: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(10, 30, 10, 0.78)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  overlayRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  content: {
    padding: 14,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 3,
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
    width: 240,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  horizontalImage: {
    width: '100%',
    height: 130,
  },
  hOverlayRating: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(10, 30, 10, 0.78)',
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
  horizontalContent: {
    padding: 11,
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
