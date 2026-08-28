import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const Header = ({ onSOSPress, onNotificationsPress }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { currentLanguage, languages, setLanguage, t } = useLanguage();
  const { user, role, toggleRole } = useAuth();
  const { unreadCount } = useNotifications();
  const insets = useSafeAreaInsets();
  const [langModalVisible, setLangModalVisible] = useState(false);

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
      {/* Top Bar: Brand, Role Switcher, Controls */}
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

        <View style={styles.controlsRow}>
          {/* Role Switcher Pill */}
          <TouchableOpacity
            activeOpacity={0.7}
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
          </TouchableOpacity>

          {/* Language Selector */}
          <TouchableOpacity
            onPress={() => setLangModalVisible(true)}
            style={[styles.iconButton, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
          >
            <Text style={[styles.langCode, { color: theme.text }]}>
              {currentLangObj.code.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {/* Theme Toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconButton, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={16}
              color={isDark ? '#FBBF24' : theme.text}
            />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            onPress={onNotificationsPress}
            style={[styles.iconButton, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
          >
            <Ionicons name="notifications-outline" size={17} color={theme.text} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.error }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting & Weather Row — Tourist Mode Only */}
      {role === 'tourist' && (
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextContainer}>
            <Text style={[styles.greeting, { color: theme.text }]}>
              {t('greeting') || `Good morning, ${user?.name || 'Gunavarsha'}`}
            </Text>
            <View style={styles.ecoRow}>
              <Ionicons name="leaf" size={12} color={theme.ecoGreen} />
              <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>
                {user?.ecoPoints || 520} Eco Points · {user?.ecoBadge || 'Eco Champion'}
              </Text>
            </View>
          </View>

          {/* Weather Widget */}
          <View style={[styles.weatherWidget, { backgroundColor: theme.primaryLight, borderColor: theme.border }]}>
            <Ionicons name="partly-sunny-outline" size={16} color={theme.primary} />
            <Text style={[styles.weatherTemp, { color: theme.primaryDark }]}>29°C</Text>
          </View>
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
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const isSelected = item.code === currentLanguage;
                return (
                  <TouchableOpacity
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
              }}
            />
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
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    gap: 5,
  },
  weatherTemp: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
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
