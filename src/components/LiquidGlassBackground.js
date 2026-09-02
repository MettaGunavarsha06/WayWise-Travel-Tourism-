import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export const LiquidGlassBackground = ({ children, style }) => {
  const { theme, isDark } = useTheme();
  const isLiquid = theme?.isLiquidGlass || theme?.mode === 'liquid_glass';

  if (!isLiquid) {
    return children || null;
  }

  const gradientColors = isDark
    ? ['#080C16', '#0E1726', '#140E28', '#080C16']
    : ['#EFF6FF', '#EEF2FF', '#FAF5FF', '#FDF2F8'];

  return (
    <View style={[styles.container, style]}>
      {/* Base Prismatic Gradient Layer */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Optical Lensing Orb 1 (Top Right Prism) */}
      <View
        style={[
          styles.lensingOrb,
          {
            top: -60,
            right: -60,
            width: width * 0.75,
            height: width * 0.75,
            borderRadius: (width * 0.75) / 2,
            backgroundColor: isDark
              ? 'rgba(56, 189, 248, 0.09)'
              : 'rgba(2, 132, 199, 0.09)',
          },
        ]}
      />

      {/* Optical Lensing Orb 2 (Mid Left Violet) */}
      <View
        style={[
          styles.lensingOrb,
          {
            top: height * 0.35,
            left: -80,
            width: width * 0.85,
            height: width * 0.85,
            borderRadius: (width * 0.85) / 2,
            backgroundColor: isDark
              ? 'rgba(167, 139, 250, 0.08)'
              : 'rgba(99, 102, 241, 0.07)',
          },
        ]}
      />

      {/* Optical Lensing Orb 3 (Bottom Right Magenta) */}
      <View
        style={[
          styles.lensingOrb,
          {
            bottom: -40,
            right: -40,
            width: width * 0.7,
            height: width * 0.7,
            borderRadius: (width * 0.7) / 2,
            backgroundColor: isDark
              ? 'rgba(244, 114, 182, 0.08)'
              : 'rgba(236, 72, 153, 0.06)',
          },
        ]}
      />

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  lensingOrb: {
    position: 'absolute',
  },
});
