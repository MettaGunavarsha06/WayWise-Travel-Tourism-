import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Instagram-Style Floating "Saved to Collection" Bottom Toast
 */
export const SavedToast = ({
  visible,
  place,
  collectionName = 'All Saved',
  onViewSaved,
  onChangeCollection,
  onDismiss,
}) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleHide();
      }, 3500);

      return () => clearTimeout(timer);
    } else {
      handleHide();
    }
  }, [visible]);

  const handleHide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 80,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  if (!visible && opacity._value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: '#0F172A', // Instagram dark floating pill
          shadowColor: '#000',
        },
      ]}
    >
      {/* Place Thumbnail */}
      {place?.image ? (
        <Image source={{ uri: place.image }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={styles.iconBox}>
          <Ionicons name="bookmark" size={16} color="#FFFFFF" />
        </View>
      )}

      {/* Text Info */}
      <View style={styles.textWrap}>
        <Text style={styles.savedTitle} numberOfLines={1}>
          Saved to <Text style={styles.collectionBold}>{collectionName}</Text>
        </Text>
        <Text style={styles.placeName} numberOfLines={1}>
          {place?.name || 'Destination'}
        </Text>
      </View>

      {/* Action Buttons (Change / View Saved) */}
      <View style={styles.actionsRow}>
        {onChangeCollection && (
          <TouchableOpacity onPress={onChangeCollection} style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        )}

        {onViewSaved && (
          <TouchableOpacity onPress={onViewSaved} style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View Saved</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    elevation: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    zIndex: 9999,
  },
  thumbnail: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textWrap: {
    flex: 1,
  },
  savedTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  collectionBold: {
    color: '#FFFFFF',
    fontFamily: 'Manrope_700Bold',
  },
  placeName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 6,
  },
  changeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  changeBtnText: {
    color: '#93C5FD',
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  viewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  viewBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontFamily: 'Manrope_700Bold',
  },
});
