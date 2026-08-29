import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const GemmaAIFloatingButton = ({ onPress, bottomOffset = 76, rightOffset = 18 }) => {
  const { theme, isDark } = useTheme();
  const isGlass = theme.mode === 'glass_horizon';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.floatingButton,
        {
          bottom: bottomOffset,
          right: rightOffset,
          backgroundColor: isGlass
            ? (isDark ? 'rgba(56, 189, 248, 0.90)' : 'rgba(30, 58, 95, 0.92)')
            : theme.primary,
          borderColor: isGlass ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
          borderWidth: isGlass ? 1.5 : 0,
          shadowColor: theme.shadow,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isDark && isGlass ? 'rgba(10, 25, 47, 0.25)' : 'rgba(255, 255, 255, 0.22)' },
          ]}
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={16}
            color={isDark && isGlass ? '#0A192F' : '#FFFFFF'}
          />
        </View>
        <Text
          style={[
            styles.label,
            { color: isDark && isGlass ? '#0A192F' : '#FFFFFF' },
          ]}
        >
          Assistant
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
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
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.2,
  },
});
