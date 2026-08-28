import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const GemmaAIFloatingButton = ({ onPress, bottomOffset = 82, rightOffset = 18 }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.floatingButton,
        {
          bottom: bottomOffset,
          right: rightOffset,
          backgroundColor: theme.primary,
          shadowColor: theme.primaryDark,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Ionicons name="chatbubble-ellipses" size={16} color="#FFFFFF" />
        </View>
        <Text style={styles.label}>WayWise AI</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 22,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 7,
    zIndex: 999,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.1,
  },
});
