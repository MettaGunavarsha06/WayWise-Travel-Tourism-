import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const GemmaAIFloatingButton = ({
  onPress,
  bottomOffset = 100,
  rightOffset = 18,
}) => {
  const { theme, isDark } = useTheme();
  const floatAnim = useRef(new Animated.Value(0)).current;

  const isGlass = theme.mode === 'glass_horizon' || theme.mode === 'liquid_glass';
  const isLiquid = theme.mode === 'liquid_glass';

  const getBgColor = () => {
    if (isLiquid) {
      return isDark ? 'rgba(56, 189, 248, 0.92)' : 'rgba(2, 132, 199, 0.92)';
    }
    if (isGlass) {
      return isDark ? 'rgba(79, 117, 255, 0.94)' : 'rgba(30, 58, 95, 0.92)';
    }
    return theme.primary;
  };

  const getTextColor = () => {
    return '#FFFFFF';
  };

  const handlePressIn = () => {
    Animated.spring(floatAnim, {
      toValue: 1,
      bounciness: 10,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(floatAnim, {
      toValue: 0,
      bounciness: 6,
      speed: 16,
      useNativeDriver: true,
    }).start();
  };

  const buttonScale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.14],
  });

  const buttonTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <Animated.View
      style={[
        styles.floatingButtonWrap,
        {
          bottom: bottomOffset,
          right: rightOffset,
          transform: [{ scale: buttonScale }, { translateY: buttonTranslateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.floatingButton,
          {
            backgroundColor: getBgColor(),
            borderColor: isGlass
              ? theme.glassBorder || 'rgba(255, 255, 255, 0.35)'
              : 'transparent',
            borderWidth: isGlass ? 1.5 : 0,
            shadowColor: '#4F75FF',
          },
        ]}
      >
        <View style={styles.contentRow}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
              },
            ]}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={16}
              color={getTextColor()}
            />
          </View>
          <Text style={[styles.label, { color: getTextColor() }]}>
            Assistant
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingButtonWrap: {
    position: 'absolute',
    zIndex: 999,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 26,
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
