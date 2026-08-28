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
        <View style={styles.horizontalContent}>
          <View style={styles.topRow}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {destination.name}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={[styles.rating, { color: theme.text }]}>{destination.rating}</Text>
            </View>
          </View>

          <Text style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
            {destination.state} • {destination.category}
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
              <Text style={[styles.perPerson, { color: theme.textSecondary }]}> / trip</Text>
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
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {destination.name}
          </Text>
        </View>

        <Text style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
          {destination.state} • {destination.category}
        </Text>

        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {destination.description}
        </Text>

        <View style={styles.badgesRow}>
          <CrowdIndicator level={destination.crowdLevel} compact />
          <EcoScoreBadge score={destination.ecoScore} size="small" showLabel={false} />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    height: 160,
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
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hiddenGemText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  overlayRating: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
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
    fontWeight: '700',
  },
  content: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  location: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
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
    textTransform: 'uppercase',
  },
  cost: {
    fontSize: 16,
    fontWeight: '700',
  },
  perPerson: {
    fontSize: 11,
    fontWeight: '400',
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Horizontal layout
  horizontalCard: {
    width: 260,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  horizontalImage: {
    width: '100%',
    height: 130,
  },
  horizontalContent: {
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
  },
  altTag: {
    fontSize: 11,
    fontWeight: '600',
    marginVertical: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  duration: {
    fontSize: 11,
    fontWeight: '500',
  },
});
