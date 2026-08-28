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
          backgroundColor: isApplied ? theme.successLight : '#F0F7EE',
          borderColor: isApplied ? theme.ecoGreen : '#A5C8A0',
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: isApplied ? theme.ecoGreenLight : '#DCF0D8' },
          ]}
        >
          <Ionicons
            name={isApplied ? 'checkmark-circle' : 'partly-sunny-outline'}
            size={20}
            color={isApplied ? theme.ecoGreen : '#2E7D32'}
          />
        </View>
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: isApplied ? theme.ecoGreen : '#1B5E20' }]}>
            {isApplied ? '✓ Adjustment Applied' : '💡 Smart Travel Tip'}
          </Text>
          <Text style={[styles.subtitle, { color: isApplied ? '#2E7D32' : '#33691E' }]}>
            {alertMessage || '🌧️ Rain expected tomorrow. Outdoor activity → Indoor attraction'}
          </Text>
        </View>
      </View>

      {!isApplied && onApplyChanges && (
        <Button
          title="Apply Suggested Changes"
          variant="primary"
          size="small"
          icon="refresh-outline"
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
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
  },
  applyBtn: {
    marginTop: 12,
  },
});
