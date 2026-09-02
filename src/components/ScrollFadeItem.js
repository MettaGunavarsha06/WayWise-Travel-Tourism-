import React, { useState } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ScrollFadeItem = ({
  scrollY,
  children,
  style,
}) => {
  const [layoutY, setLayoutY] = useState(null);
  const [layoutHeight, setLayoutHeight] = useState(240);

  const handleLayout = (e) => {
    const { y, height } = e.nativeEvent.layout;
    if (y !== undefined && y !== null) {
      setLayoutY(y);
      if (height > 0) setLayoutHeight(height);
    }
  };

  // If scrollY is provided and layout is measured
  if (scrollY && layoutY !== null) {
    const bottomHidden = Math.max(0, layoutY - SCREEN_HEIGHT + 30);
    const bottomVisible = Math.max(bottomHidden + 30, layoutY - SCREEN_HEIGHT + 190);
    const topStartExit = Math.max(bottomVisible + 20, layoutY - 20);
    const topMidExit = Math.max(topStartExit + 20, layoutY + layoutHeight * 0.35);
    const topFullExit = Math.max(topMidExit + 20, layoutY + layoutHeight * 0.8);

    // Full, rich fade in & fade out with elastic overscroll protection at top
    const opacity = scrollY.interpolate({
      inputRange: [-160, 0, bottomHidden, bottomVisible, topStartExit, topMidExit, topFullExit],
      outputRange: [1, 1, 0, 1, 1, 0.4, 0],
      extrapolate: 'clamp',
    });

    const scale = scrollY.interpolate({
      inputRange: [-160, 0, bottomHidden, bottomVisible, topStartExit, topMidExit, topFullExit],
      outputRange: [1.06, 1, 0.91, 1, 1, 0.94, 0.86],
      extrapolate: 'clamp',
    });

    const translateY = scrollY.interpolate({
      inputRange: [-160, 0, bottomHidden, bottomVisible, topStartExit, topMidExit, topFullExit],
      outputRange: [-6, 0, 26, 0, 0, -12, -26],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        onLayout={handleLayout}
        style={[
          styles.container,
          style,
          {
            opacity,
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View onLayout={handleLayout} style={[styles.container, style]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
});
