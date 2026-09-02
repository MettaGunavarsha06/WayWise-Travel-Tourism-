import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getLiveTelemetry } from '../utils/weatherService';
import { getTimeBasedGreeting } from '../utils/helpers';
import { MiniSketchedWondersLoop } from './MiniSketchedWondersLoop';
import { FloatingPressable } from './FloatingPressable';

export const Header = ({ onSOSPress, onNotificationsPress, onWeatherPress }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { currentLanguage, languages, setLanguage, t } = useLanguage();
  const { user, role, toggleRole } = useAuth();
  const { unreadCount } = useNotifications();
  const insets = useSafeAreaInsets();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [liveTemp, setLiveTemp] = useState(null);
  const [liveIcon, setLiveIcon] = useState('partly-sunny-outline');
  const [liveCity, setLiveCity] = useState('');
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveWeather = async () => {
      try {
        setLoadingWeather(true);
        let coords = { lat: 17.6868, lon: 83.2185 }; // Default Vizag
        try {
          const perm = await Location.getForegroundPermissionsAsync().catch(() => null);
          if (perm && perm.status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }).catch(() => null);
            if (loc && loc.coords) {
              coords = { lat: loc.coords.latitude, lon: loc.coords.longitude };
            }
          }
        } catch (locErr) {
          // fallback to default coords
        }

        const data = await getLiveTelemetry({ lat: coords.lat, lon: coords.lon });
        if (data && isMounted) {
          setLiveTemp(data.temperature);
          setLiveIcon(data.iconName || 'partly-sunny-outline');
          setLiveCity(data.city || '');
        }
      } catch (err) {
        // Fallback default
        if (isMounted) setLiveTemp(29);
      } finally {
        if (isMounted) setLoadingWeather(false);
      }
    };

    fetchLiveWeather();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
          // Safe area: push header content below status bar / notch / camera cutout
          paddingTop: insets.top + 8,
        },
      ]}
    >
      {/* Top Bar: Brand, Sketch Wonders Loop, Role Switcher, Controls */}
      <View style={styles.topRow}>
        {/* WayWise Brand */}
        <View style={styles.brandContainer}>
          <View style={[styles.logoIcon, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="leaf" size={18} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: theme.primaryDark }]}>WayWise</Text>
            <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
              Sustainable Travel
            </Text>
          </View>
        </View>

        {/* Sketched Animated Car & 7 World Wonders Loop (Stretching from WayWise to Tourist) */}
        <View style={styles.sketchRibbonStretch}>
          <MiniSketchedWondersLoop />
        </View>

        <View style={styles.controlsRow}>
          {/* Role Switcher Pill */}
          <FloatingPressable
            activeScale={1.1}
            liftY={-3}
            onPress={toggleRole}
            style={[
              styles.rolePill,
              {
                backgroundColor:
                  role === 'authority_admin' ? theme.accentLight : theme.primaryLight,
                borderColor:
                  role === 'authority_admin' ? theme.accent : theme.primary,
              },
            ]}
          >
            <Ionicons
              name={role === 'authority_admin' ? 'shield-checkmark' : 'person'}
              size={11}
              color={role === 'authority_admin' ? '#92400E' : theme.primaryDark}
            />
            <Text
              style={[
                styles.roleText,
                { color: role === 'authority_admin' ? '#92400E' : theme.primaryDark },
              ]}
            >
              {role === 'authority_admin' ? 'Admin' : 'Tourist'}
            </Text>
          </FloatingPressable>

          {/* Language Selector */}
          <FloatingPressable
            activeScale={1.12}
            liftY={-3}
            onPress={() => setLangModalVisible(true)}
            style={[styles.iconButton, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
          >
            <Text style={[styles.langCode, { color: theme.text }]}>
              {currentLangObj.code.toUpperCase()}
            </Text>
          </FloatingPressable>

          {/* Theme Toggle */}
          <FloatingPressable
            activeScale={1.12}
            liftY={-3}
            onPress={toggleTheme}
            style={[styles.iconButton, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={16}
              color={isDark ? '#FBBF24' : theme.text}
            />
          </FloatingPressable>

          {/* Notifications */}
          <FloatingPressable
            activeScale={1.12}
            liftY={-3}
            onPress={onNotificationsPress}
            style={[styles.iconButton, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
          >
            <Ionicons name="notifications-outline" size={17} color={theme.text} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.error }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </FloatingPressable>
        </View>
      </View>

      {/* Greeting & Real Live Weather Row — Tourist Mode Only */}
      {role === 'tourist' && (
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextContainer}>
            <Text style={[styles.greeting, { color: theme.text }]}>
              {getTimeBasedGreeting(t, user?.name || 'Gunavarsha')}
            </Text>
            <View style={styles.ecoRow}>
              <Ionicons name="leaf" size={12} color={theme.ecoGreen} />
              <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>
                {user?.ecoPoints || 520} Eco Points · {user?.ecoBadge || 'Eco Champion'}
              </Text>
            </View>
          </View>

          {/* Real Live Weather Telemetry Widget */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onWeatherPress}
            style={[styles.weatherWidget, { backgroundColor: theme.primaryLight, borderColor: theme.border }]}
          >
            {loadingWeather ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <>
                <Ionicons name={liveIcon || 'partly-sunny-outline'} size={16} color={theme.primary} />
                <Text style={[styles.weatherTemp, { color: theme.primaryDark }]}>
                  {liveTemp !== null ? `${liveTemp}°C` : '28°C'}
                </Text>
                <View style={styles.liveIndicatorDot} />
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Language Selection Modal */}
      <Modal visible={langModalVisible} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setLangModalVisible(false)}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Choose Language / భాష
            </Text>
            <View style={styles.langListWrap}>
              {languages.map((item) => {
                const isSelected = item.code === currentLanguage;
                return (
                  <TouchableOpacity
                    key={item.code}
                    onPress={() => {
                      setLanguage(item.code);
                      setLangModalVisible(false);
                    }}
                    style={[
                      styles.langOption,
                      isSelected && { backgroundColor: theme.primaryLight },
                    ]}
                  >
                    <View>
                      <Text
                        style={[
                          styles.langOptionName,
                          { color: isSelected ? theme.primaryDark : theme.text },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={[styles.langNative, { color: theme.textSecondary }]}>
                        {item.nativeName}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  sketchRibbonStretch: {
    flex: 1,
    height: 38,
    marginHorizontal: 6,
    justifyContent: 'center',
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 10,
    fontFamily: 'Manrope_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langCode: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Manrope_700Bold',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 19,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.2,
  },
  ecoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  subGreeting: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
  weatherWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  weatherTemp: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  langOptionName: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
  },
  langNative: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginTop: 1,
  },
});
