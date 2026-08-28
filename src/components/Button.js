import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const Button = ({
  title,
  onPress,
  variant = 'primary', // primary | secondary | eco | outline | danger | ghost
  size = 'medium',     // small | medium | large
  icon,
  iconRight,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.border;
    switch (variant) {
      case 'primary':  return theme.primary;
      case 'secondary': return theme.secondary;
      case 'eco':      return theme.ecoGreen;
      case 'danger':   return theme.error;
      case 'outline':
      case 'ghost':    return 'transparent';
      default:         return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textMuted;
    switch (variant) {
      case 'outline': return theme.primary;
      case 'ghost':   return theme.text;
      default:        return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return theme.primary;
    return 'transparent';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':  return { paddingVertical: 8, paddingHorizontal: 14 };
      case 'large':  return { paddingVertical: 15, paddingHorizontal: 24 };
      default:       return { paddingVertical: 12, paddingHorizontal: 18 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return 13;
      case 'large': return 15;
      default:      return 14;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getPadding(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: disabled ? 0.55 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon && (
            <Ionicons
              name={icon}
              size={getFontSize() + 3}
              color={getTextColor()}
              style={styles.leftIcon}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontFamily: 'Manrope_600SemiBold',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconRight && (
            <Ionicons
              name={iconRight}
              size={getFontSize() + 3}
              color={getTextColor()}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 6,
  },
  rightIcon: {
    marginLeft: 6,
  },
});
