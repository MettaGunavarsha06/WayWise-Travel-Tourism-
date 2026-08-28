import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const MetricCard = ({ title, value, change, icon, color = '#0D9488', subtitle, style }) => {
  const { theme } = useTheme();

  return (
    <View
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
      <View style={styles.headerRow}>
        <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        {change && (
          <View style={[styles.changePill, { backgroundColor: theme.successLight }]}>
            <Text style={[styles.changeText, { color: theme.success }]}>{change}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 10,
    marginTop: 2,
  },
});
