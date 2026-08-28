import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const EcoScoreBadge = ({ score = 85, size = 'medium', showLabel = true }) => {
  const numScore = Number(score) || 85;

  const getColors = () => {
    if (numScore >= 80) return { text: '#166534', bg: '#DCFCE7', border: '#86EFAC', ring: '#2E7D32' };
    if (numScore >= 60) return { text: '#92400E', bg: '#FEF3C7', border: '#FDE68A', ring: '#D97706' };
    return { text: '#991B1B', bg: '#FEF2F2', border: '#FECACA', ring: '#DC2626' };
  };

  const colors = getColors();

  if (size === 'small') {
    return (
      <View style={[styles.smallBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
        <Ionicons name="leaf" size={10} color={colors.text} style={{ marginRight: 2 }} />
        <Text style={[styles.smallText, { color: colors.text }]}>{numScore}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mediumWrapper}>
      {/* Eco ring */}
      <View style={[styles.scoreRing, { borderColor: colors.ring }]}>
        <Text style={[styles.scoreNumber, { color: colors.ring }]}>{numScore}</Text>
      </View>
      {showLabel && (
        <View style={{ alignItems: 'center', marginTop: 2 }}>
          <Ionicons name="leaf" size={11} color={colors.ring} />
          <Text style={[styles.labelText, { color: colors.text }]}>Eco</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  smallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smallText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  mediumWrapper: {
    alignItems: 'center',
  },
  scoreRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 14,
    fontFamily: 'Manrope_800ExtraBold',
  },
  labelText: {
    fontSize: 9,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
