import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';

export const QRCodeView = ({ size = 160, value = 'ST2026VIZAG', color = '#0F172A', bgColor = '#FFFFFF' }) => {
  // Generate deterministic QR-like aesthetic visual matrix from value string
  const modules = 21;
  const cellSize = size / modules;

  // Simple pseudo-random hash generator based on input string
  const getCellState = (row, col) => {
    // Standard Finder patterns (Top-left, Top-right, Bottom-left)
    if (
      (row < 7 && col < 7) ||
      (row < 7 && col >= modules - 7) ||
      (row >= modules - 7 && col < 7)
    ) {
      if (
        (row === 0 || row === 6 || col === 0 || col === 6) && row < 7 && col < 7 ||
        (row >= 2 && row <= 4 && col >= 2 && col <= 4)
      ) {
        return true;
      }
      if (
        (row === 0 || row === 6 || col === modules - 7 || col === modules - 1) &&
        row < 7 &&
        col >= modules - 7 ||
        (row >= 2 && row <= 4 && col >= modules - 5 && col <= modules - 3)
      ) {
        return true;
      }
      if (
        (row === modules - 7 || row === modules - 1 || col === 0 || col === 6) &&
        row >= modules - 7 &&
        col < 7 ||
        (row >= modules - 5 && row <= modules - 3 && col >= 2 && col <= 4)
      ) {
        return true;
      }
      return false;
    }

    // Timing patterns
    if (row === 6 || col === 6) {
      return (row + col) % 2 === 0;
    }

    // Data payload pseudo-pattern
    let charCode = value.charCodeAt((row * modules + col) % value.length) || 42;
    return ((row * 7 + col * 13 + charCode) % 3) === 0;
  };

  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: bgColor }]}>
      <Svg width={size} height={size}>
        <Rect x={0} y={0} width={size} height={size} fill={bgColor} />
        {Array.from({ length: modules }).map((_, r) =>
          Array.from({ length: modules }).map((_, c) => {
            if (getCellState(r, c)) {
              return (
                <Rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize + 0.3}
                  height={cellSize + 0.3}
                  fill={color}
                />
              );
            }
            return null;
          })
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
