import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';

export const ProfileScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { currentLanguage, languages, setLanguage, t } = useLanguage();
  const { user, role, toggleRole, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of SmartTour?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile & Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Gunavarsha'}</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
            <Text style={[styles.userPhone, { color: theme.textMuted }]}>{user?.phone || '+91 98480 99887'}</Text>

            <View style={styles.badgeRow}>
              <View style={[styles.ecoBadgePill, { backgroundColor: theme.ecoGreenLight }]}>
                <Ionicons name="leaf" size={13} color={theme.ecoGreen} />
                <Text style={[styles.ecoBadgeText, { color: theme.ecoGreen }]}>
                  {user?.ecoPoints || 520} Eco-Points 🌱
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Role Switcher Banner */}
        <View style={[styles.roleSwitchCard, { backgroundColor: role === 'authority_admin' ? '#FEF3C7' : theme.primaryLight, borderColor: role === 'authority_admin' ? '#F59E0B' : theme.primary }]}>
          <View style={styles.roleHeader}>
            <Ionicons
              name={role === 'authority_admin' ? 'shield-checkmark' : 'person'}
              size={22}
              color={role === 'authority_admin' ? '#B45309' : theme.primaryDark}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.roleTitle, { color: role === 'authority_admin' ? '#B45309' : theme.primaryDark }]}>
                {role === 'authority_admin' ? '🏛️ Tourism Authority Mode' : '🧳 Tourist Mode Active'}
              </Text>
              <Text style={[styles.roleSub, { color: role === 'authority_admin' ? '#92400E' : theme.primaryDark }]}>
                {role === 'authority_admin'
                  ? 'Access state-level analytics, crowd heatmaps & tourist grievance resolution.'
                  : 'Plan trips, book eco-hotels, optimize budgets & browse local artisans.'}
              </Text>
            </View>
          </View>
          <Button
            title={role === 'authority_admin' ? 'Switch to Tourist Mode' : 'Switch to Authority Dashboard'}
            variant={role === 'authority_admin' ? 'secondary' : 'primary'}
            size="small"
            onPress={toggleRole}
            style={{ marginTop: 10 }}
          />
        </View>

        {/* Language Selection Section */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>🌐 Language / భాష / भाषा</Text>
          <View style={styles.langGrid}>
            {languages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => setLanguage(lang.code)}
                  style={[
                    styles.langButton,
                    {
                      backgroundColor: isSelected ? theme.primaryLight : theme.cardSecondary,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.langBtnName, { color: isSelected ? theme.primaryDark : theme.text }]}>
                    {lang.name}
                  </Text>
                  <Text style={[styles.langBtnNative, { color: theme.textSecondary }]}>
                    {lang.nativeName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preferences & Settings */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>⚙️ App Preferences</Text>

          {/* Dark Mode Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Feedback */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Feedback')}
            style={styles.menuRow}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="star-outline" size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Tourist Feedback & Ratings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={styles.menuRow}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Notification Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* Emergency SOS */}
          <TouchableOpacity
            onPress={() => navigation.navigate('EmergencySOS')}
            style={styles.menuRow}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="warning-outline" size={20} color={theme.error} />
              <Text style={[styles.settingLabel, { color: theme.error }]}>Emergency SOS Hub</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.error} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out"
          variant="outline"
          size="medium"
          icon="log-out-outline"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  userPhone: {
    fontSize: 11,
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 6,
  },
  ecoBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  ecoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  roleSwitchCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 16,
  },
  roleHeader: {
    flexDirection: 'row',
    gap: 10,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  roleSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langButton: {
    width: '31%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  langBtnName: {
    fontSize: 12,
    fontWeight: '700',
  },
  langBtnNative: {
    fontSize: 10,
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: 10,
  },
});
