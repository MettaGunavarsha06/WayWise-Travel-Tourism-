import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export const CrowdIndicator = ({ level = 'low', percent, compact = false }) => {
  const { t } = useLanguage();

  const getDetails = () => {
    switch (level?.toLowerCase()) {
      case 'high':
        return {
          label: t('highCrowd') || 'High Crowd',
          color: '#EF4444',
          bg: '#FEE2E2',
          icon: 'people',
          dot: '🔴',
        };
      case 'moderate':
        return {
          label: t('modCrowd') || 'Moderate Crowd',
          color: '#D97706',
          bg: '#FEF3C7',
          icon: 'people-outline',
          dot: '🟡',
        };
      case 'low':
      default:
        return {
          label: t('lowCrowd') || 'Low Crowd',
          color: '#059669',
          bg: '#D1FAE5',
          icon: 'person-outline',
          dot: '🟢',
        };
    }
  };

  const config = getDetails();

  if (compact) {
    return (
      <View style={[styles.compactBadge, { backgroundColor: config.bg }]}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        <Text style={[styles.compactText, { color: config.color }]}>
          {config.label} {percent ? `(${percent}%)` : ''}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.color + '40' }]}>
      <Ionicons name={config.icon} size={14} color={config.color} style={{ marginRight: 4 }} />
      <Text style={[styles.text, { color: config.color }]}>
        {config.label} {percent ? `• ${percent}% density` : ''}
      </Text>
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
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  compactText: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
});
