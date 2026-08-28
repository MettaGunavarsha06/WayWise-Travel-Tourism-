import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const EcoScoreBadge = ({ score = 85, size = 'medium', showLabel = true }) => {
  const numScore = Number(score) || 85;

  const getColor = () => {
    if (numScore >= 80) return { text: '#059669', bg: '#ECFDF5', border: '#A7F3D0' };
    if (numScore >= 60) return { text: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
    return { text: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
  };

  const colors = getColor();

  if (size === 'small') {
    return (
      <View style={[styles.smallBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
        <Ionicons name="leaf" size={10} color={colors.text} style={{ marginRight: 3 }} />
        <Text style={[styles.smallText, { color: colors.text }]}>{numScore}/100</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Ionicons name="leaf" size={14} color={colors.text} style={{ marginRight: 5 }} />
      {showLabel && <Text style={[styles.labelText, { color: colors.text }]}>Eco Score: </Text>}
      <Text style={[styles.scoreText, { color: colors.text }]}>{numScore}/100</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
  smallText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
