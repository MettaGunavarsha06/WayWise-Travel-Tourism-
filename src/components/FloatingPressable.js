import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';

export const FloatingPressable = ({
  children,
  onPress,
  style,
  activeScale = 1.06,
  liftY = -5,
  disabled = false,
  activeOpacity = 0.9,
  ...rest
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(floatAnim, {
      toValue: 1,
      bounciness: 10,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(floatAnim, {
      toValue: 0,
      bounciness: 6,
      speed: 16,
      useNativeDriver: true,
    }).start();
  };

  const scale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, activeScale],
  });

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, liftY],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale }, { translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        style={style}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'visible',
  },
});
