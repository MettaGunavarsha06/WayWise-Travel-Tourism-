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
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const Header = ({ onSOSPress, onNotificationsPress }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { currentLanguage, languages, setLanguage, t } = useLanguage();
  const { user, role, toggleRole } = useAuth();
  const { unreadCount } = useNotifications();
  const [langModalVisible, setLangModalVisible] = useState(false);

  const currentLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
      {/* Top Bar: Brand, Role Switcher, Controls */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={[styles.logoIcon, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="compass" size={20} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: theme.text }]}>SmartTour</Text>
            <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>SIH 2026</Text>
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
                backgroundColor: role === 'authority_admin' ? '#FEF3C7' : theme.primaryLight,
                borderColor: role === 'authority_admin' ? '#F59E0B' : theme.primary,
              },
            ]}
          >
            <Ionicons
              name={role === 'authority_admin' ? 'shield-checkmark' : 'person'}
              size={12}
              color={role === 'authority_admin' ? '#B45309' : theme.primaryDark}
            />
            <Text
              style={[
                styles.roleText,
                { color: role === 'authority_admin' ? '#B45309' : theme.primaryDark },
              ]}
            >
              {role === 'authority_admin' ? 'Admin' : 'Tourist'}
            </Text>
          </TouchableOpacity>

          {/* Language Selector */}
          <TouchableOpacity
            onPress={() => setLangModalVisible(true)}
            style={[styles.iconButton, { backgroundColor: theme.cardSecondary }]}
          >
            <Text style={[styles.langCode, { color: theme.text }]}>
              {currentLangObj.code.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {/* Theme Toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconButton, { backgroundColor: theme.cardSecondary }]}
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={18}
              color={isDark ? '#FBBF24' : theme.text}
            />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            onPress={onNotificationsPress}
            style={[styles.iconButton, { backgroundColor: theme.cardSecondary }]}
          >
            <Ionicons name="notifications-outline" size={18} color={theme.text} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.error }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting & Weather row if in Tourist Mode */}
      {role === 'tourist' && (
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextContainer}>
            <Text style={[styles.greeting, { color: theme.text }]}>
              {t('greeting') || `Good morning, ${user?.name || 'Gunavarsha'} 👋`}
            </Text>
            <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>
              Eco Points: {user?.ecoPoints || 520} 🌱 • {user?.ecoBadge || 'Eco Champion'}
            </Text>
          </View>

          {/* Weather Widget */}
          <View style={[styles.weatherWidget, { backgroundColor: theme.cardSecondary }]}>
            <Ionicons name="partly-sunny" size={18} color="#F59E0B" />
            <Text style={[styles.weatherTemp, { color: theme.text }]}>29°C</Text>
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
            <Text style={[styles.modalTitle, { color: theme.text }]}>Choose Language / భాష</Text>
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
    paddingTop: 10,
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
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langCode: {
    fontSize: 11,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
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
    fontWeight: '700',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
  },
  subGreeting: {
    fontSize: 12,
    marginTop: 2,
  },
  weatherWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  weatherTemp: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    fontSize: 16,
    fontWeight: '700',
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
    marginBottom: 6,
  },
  langOptionName: {
    fontSize: 14,
    fontWeight: '600',
  },
  langNative: {
    fontSize: 12,
  },
});
