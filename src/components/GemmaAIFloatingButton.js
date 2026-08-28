import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const GemmaAIFloatingButton = ({ onPress, bottomOffset = 82, rightOffset = 18 }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.floatingButton,
        {
          bottom: bottomOffset,
          right: rightOffset,
          backgroundColor: theme.primary,
          shadowColor: theme.primary,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.iconContainer}>
          <Ionicons name="sparkles" size={18} color="#FFFFFF" />
        </View>
        <Text style={styles.label}>Gemma AI</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 999,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
