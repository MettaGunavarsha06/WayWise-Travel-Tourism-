import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';

export const WeatherAlertCard = ({ alertMessage, onApplyChanges, isApplied = false }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isApplied ? theme.successLight : '#FEF3C7',
          borderColor: isApplied ? theme.success : '#F59E0B',
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={isApplied ? 'checkmark-circle' : 'rainy'}
            size={22}
            color={isApplied ? theme.success : '#D97706'}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: isApplied ? theme.success : '#92400E' }]}>
            {isApplied ? 'Weather Adjustment Applied' : 'Smart Plan Adjustment'}
          </Text>
          <Text style={[styles.subtitle, { color: isApplied ? theme.success : '#78350F' }]}>
            {alertMessage || '🌧️ Rain is expected tomorrow. Outdoor activity → Indoor attraction'}
          </Text>
        </View>
      </View>

      {!isApplied && onApplyChanges && (
        <Button
          title="Apply Suggested Changes"
          variant="secondary"
          size="small"
          icon="refresh"
          onPress={onApplyChanges}
          style={styles.applyBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  applyBtn: {
    marginTop: 12,
  },
});
