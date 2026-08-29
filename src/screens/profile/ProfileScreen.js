import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { THEMES_LIST } from '../../constants/colors';
import { Button } from '../../components/Button';
import { VoiceTranslatorModal } from '../../components/VoiceTranslatorModal';
import * as ImagePicker from 'expo-image-picker';
import {
  generateAITripPlan,
  queryDestinationGuide,
  generateAIBudgetPlan,
  recommendLocalExperiences,
  translateTravelText,
  getSafetyGuidance,
  getSmartRecommendations,
} from '../../utils/gemmaAI';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

export const ProfileScreen = ({ navigation }) => {
  const { theme, themeName, setThemeName, isDark, toggleTheme, themesList } = useTheme();
  const { currentLanguage, languages, setLanguage, t } = useLanguage();
  const { user, role, toggleRole, logout, updateProfile, updateSettings } = useAuth();

  // --- THEME MODAL STATE ---
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // --- EDIT PROFILE MODAL STATE ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || DEFAULT_AVATAR);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  // --- AI TRAVEL ASSISTANT MODAL STATES ---
  const [activeAITool, setActiveAITool] = useState(null); // 'trip', 'guide', 'budget', 'local', 'translate', 'safety', 'smart'
  const [showVoiceTranslator, setShowVoiceTranslator] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // AI Tool Form States
  // 1. Trip Planner
  const [tripDest, setTripDest] = useState('Jaipur');
  const [tripDays, setTripDays] = useState('3');
  const [tripBudget, setTripBudget] = useState('15000');
  const [tripTravelers, setTripTravelers] = useState('2');
  const [tripPref, setTripPref] = useState('Eco-friendly & Cultural');

  // 2. Destination Guide
  const [guideQuestion, setGuideQuestion] = useState('');

  // 3. Budget Planner
  const [budgetAmount, setBudgetAmount] = useState('12000');

  // 5. Translator
  const [translateInput, setTranslateInput] = useState('Where is the nearest tourist information center?');
  const [targetLang, setTargetLang] = useState('hi');

  // --- EDIT PROFILE HANDLERS ---
  const pickImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access your photo gallery is required to pick a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEditAvatar(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not open photo gallery. Please try again.');
    }
  };

  const openEditModal = () => {
    setEditName(user?.name || 'Gunavarsha');
    setEditEmail(user?.email || 'gunavarsha@sih2026.gov.in');
    setEditPhone(user?.phone || '+91 98480 99887');
    setEditAddress(user?.address || 'Plot 42, Green Valley Enclave, Visakhapatnam, AP - 530017');
    setEditAvatar(user?.avatar || DEFAULT_AVATAR);
    setValidationErrors({});
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!editName.trim()) {
      errors.name = 'Full Name is required';
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!editEmail.trim()) {
      errors.email = 'Email Address is required';
    } else if (!emailRegex.test(editEmail)) {
      errors.email = 'Please enter a valid email address';
    }
    const phoneRegex = /^\+?[0-9\s-]{8,15}$/;
    if (!editPhone.trim()) {
      errors.phone = 'Phone Number is required';
    } else if (!phoneRegex.test(editPhone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!editAddress.trim()) {
      errors.address = 'Address is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    try {
      await updateProfile({
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim(),
        avatar: editAvatar,
      });
      setIsEditModalOpen(false);
      Alert.alert('Success', 'Your profile information has been updated successfully!');
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  // --- AI TOOL EXECUTORS ---
  const runAITool = async (toolType, customQuery = null) => {
    setActiveAITool(toolType);
    setAiLoading(true);
    setAiResult(null);

    try {
      let res = null;
      if (toolType === 'trip') {
        res = await generateAITripPlan({
          destination: tripDest || 'Jaipur',
          days: parseInt(tripDays) || 3,
          budget: parseInt(tripBudget) || 15000,
          travelers: parseInt(tripTravelers) || 2,
          preferences: tripPref,
        });
      } else if (toolType === 'guide') {
        res = await queryDestinationGuide({
          question: customQuery || guideQuestion || 'What are the best places to visit here?',
          destination: tripDest || 'Jaipur',
        });
      } else if (toolType === 'budget') {
        res = await generateAIBudgetPlan({
          totalBudget: parseInt(budgetAmount) || 10000,
          destination: tripDest || 'Jaipur',
          days: parseInt(tripDays) || 3,
        });
      } else if (toolType === 'local') {
        res = await recommendLocalExperiences({
          destination: tripDest || 'Jaipur',
        });
      } else if (toolType === 'translate') {
        setShowVoiceTranslator(true);
        setAiLoading(false);
        return;
      } else if (toolType === 'safety') {
        res = await getSafetyGuidance({
          destination: tripDest || 'Jaipur',
        });
      } else if (toolType === 'smart') {
        res = await getSmartRecommendations({
          destination: tripDest || 'Jaipur',
          preferences: tripPref,
          budget: parseInt(tripBudget) || 15000,
          language: currentLanguage,
        });
      }
      setAiResult(res);
    } catch (err) {
      setAiResult({ error: 'AI Assistant unavailable right now. Please try again.' });
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(t('signOut') || 'Sign Out', t('signOutConfirm') || 'Are you sure you want to sign out of WayWise?', [
      { text: t('cancel') || 'Cancel', style: 'cancel' },
      { text: t('signOut') || 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const userSettings = user?.settings || {};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('profile') || 'Profile & Settings'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={[styles.userCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Image source={{ uri: user?.avatar || DEFAULT_AVATAR }} style={styles.avatar} />

          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Gunavarsha'}</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email || 'gunavarsha@sih2026.gov.in'}</Text>
            <Text style={[styles.userPhone, { color: theme.textMuted }]}>{user?.phone || '+91 98480 99887'}</Text>
            <Text style={[styles.userAddress, { color: theme.textSecondary }]} numberOfLines={2}>
              {user?.address || 'Plot 42, Green Valley Enclave, Visakhapatnam, AP'}
            </Text>

            <View style={styles.badgeRow}>
              <View style={[styles.ecoBadgePill, { backgroundColor: theme.ecoGreenLight }]}>
                <Ionicons name="leaf" size={13} color={theme.ecoGreen} />
                <Text style={[styles.ecoBadgeText, { color: theme.ecoGreen }]}>
                  {user?.ecoPoints || 520} {t('ecoPoints') || 'Eco Points'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
            onPress={openEditModal}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={16} color={theme.primaryDark} />
            <Text style={[styles.editBtnText, { color: theme.primaryDark }]}>{t('edit') || 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* AI TRAVEL ASSISTANT FEATURES SECTION */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={[styles.aiIconBadge, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="sparkles" size={16} color={theme.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 0 }]}>{t('aiAssistant') || 'AI Travel Assistant'}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('AIAssistant')}>
              <Text style={[styles.linkText, { color: theme.primary }]}>{t('openChat') || 'Open Chat'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.aiSubtitle, { color: theme.textSecondary }]}>
            {t('aiSubtitle') || 'AI-powered travel tools designed for sustainable, budget-friendly and cultural tourism.'}
          </Text>

          {/* 7 AI Feature Tool Grid */}
          <View style={styles.aiGrid}>
            <TouchableOpacity
              style={[styles.aiToolCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
              onPress={() => runAITool('trip')}
              activeOpacity={0.8}
            >
              <Ionicons name="map-outline" size={22} color={theme.primary} />
              <Text style={[styles.aiToolTitle, { color: theme.text }]}>{t('aiTripPlanner') || 'AI Trip Planner'}</Text>
              <Text style={[styles.aiToolSub, { color: theme.textMuted }]}>{t('aiTripPlannerSub') || 'Custom day-by-day itinerary'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aiToolCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
              onPress={() => runAITool('guide')}
              activeOpacity={0.8}
            >
              <Ionicons name="compass-outline" size={22} color={theme.primary} />
              <Text style={[styles.aiToolTitle, { color: theme.text }]}>{t('destinationGuide') || 'Destination Guide'}</Text>
              <Text style={[styles.aiToolSub, { color: theme.textMuted }]}>{t('destinationGuideSub') || 'Places, foods & activities'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aiToolCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
              onPress={() => runAITool('budget')}
              activeOpacity={0.8}
            >
              <Ionicons name="wallet-outline" size={22} color={theme.primary} />
              <Text style={[styles.aiToolTitle, { color: theme.text }]}>{t('budgetPlanner') || 'Budget Planner'}</Text>
              <Text style={[styles.aiToolSub, { color: theme.textMuted }]}>{t('budgetPlannerSub') || 'Breakdown & savings tips'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aiToolCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
              onPress={() => runAITool('local')}
              activeOpacity={0.8}
            >
              <Ionicons name="storefront-outline" size={22} color={theme.primary} />
              <Text style={[styles.aiToolTitle, { color: theme.text }]}>{t('localRecommender') || 'Local Recommender'}</Text>
              <Text style={[styles.aiToolSub, { color: theme.textMuted }]}>{t('localRecommenderSub') || 'Artisans & eco-experiences'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aiToolCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
              onPress={() => setShowVoiceTranslator(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="mic-circle" size={24} color="#2563EB" />
              <Text style={[styles.aiToolTitle, { color: theme.text }]}>{t('voiceTranslator') || 'Voice AI Translator'}</Text>
              <Text style={[styles.aiToolSub, { color: theme.textMuted }]}>{t('voiceTranslatorSub') || 'Voice record → 9+ languages'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aiToolCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
              onPress={() => runAITool('safety')}
              activeOpacity={0.8}
            >
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.primary} />
              <Text style={[styles.aiToolTitle, { color: theme.text }]}>{t('safetyAssistant') || 'Safety Assistant'}</Text>
              <Text style={[styles.aiToolSub, { color: theme.textMuted }]}>{t('safetyAssistantSub') || 'Rules, alerts & contacts'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aiToolCardFull, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
              onPress={() => runAITool('smart')}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="bulb-outline" size={20} color={theme.primaryDark} />
                <Text style={[styles.aiToolTitle, { color: theme.primaryDark }]}>{t('aiSmartRecommendations') || 'Smart Recommendations'}</Text>
              </View>
              <Text style={[styles.aiToolSub, { color: theme.primaryDark }]}>{t('smartRecommendationsSub') || 'Personalized suggestions based on preferences'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferred Language Selection */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{t('preferredLanguage') || 'Preferred Language'}</Text>
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
                  activeOpacity={0.8}
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
          <Text style={[styles.cardTitle, { color: theme.text }]}>{t('appSettings') || 'App Settings & Permissions'}</Text>

          {/* App Theme & Visual Experience Selector */}
          <TouchableOpacity
            onPress={() => setIsThemeModalOpen(true)}
            style={[styles.menuRow, { paddingVertical: 13 }]}
            activeOpacity={0.8}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.themeIconBox, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="color-palette-outline" size={20} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: theme.text }]}>{t('appTheme') || 'App Theme & Experience'}</Text>
                <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                  {themesList?.find((t) => t.id === themeName)?.name || 'Glass Horizon'} · {themesList?.find((t) => t.id === themeName)?.badge || 'Luxury'}
                </Text>
              </View>
            </View>
            <View style={styles.themeBadgeWrap}>
              <View style={[styles.activeThemePill, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                <Text style={[styles.activeThemePillText, { color: theme.primaryDark }]}>
                  {themesList?.find((t) => t.id === themeName)?.name || 'Glass Horizon'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </View>
          </TouchableOpacity>

          {/* Quick Dark Mode Toggle */}
          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('darkMode') || 'Dark Mode'}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Notifications Toggle */}
          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('pushNotifications') || 'Push Notifications'}</Text>
            </View>
            <Switch
              value={userSettings.notifications !== false}
              onValueChange={(val) => updateSettings('notifications', val)}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Location Permission Toggle */}
          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('locationAccess') || 'Location Access'}</Text>
            </View>
            <Switch
              value={userSettings.locationPermission !== false}
              onValueChange={(val) => updateSettings('locationPermission', val)}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* AI Recommendations Toggle */}
          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="sparkles-outline" size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('aiSmartRecommendations') || 'AI Smart Recommendations'}</Text>
            </View>
            <Switch
              value={userSettings.aiRecommendations !== false}
              onValueChange={(val) => updateSettings('aiRecommendations', val)}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Eco-Friendly Recommendations Toggle */}
          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="leaf-outline" size={20} color={theme.ecoGreen} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('ecoTourismMode') || 'Eco-Friendly Tourism Mode'}</Text>
            </View>
            <Switch
              value={userSettings.ecoRecommendations !== false}
              onValueChange={(val) => updateSettings('ecoRecommendations', val)}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Feedback */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Feedback')}
            style={[styles.menuRow, { borderTopColor: theme.borderLight }]}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="star-outline" size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('touristFeedback') || 'Tourist Feedback & Ratings'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* Emergency SOS Hub */}
          <TouchableOpacity
            onPress={() => navigation.navigate('EmergencySOS')}
            style={[styles.menuRow, { borderTopColor: theme.borderLight }]}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="warning-outline" size={20} color={theme.error} />
              <Text style={[styles.settingLabel, { color: theme.error }]}>{t('emergencySafetyHub') || 'Emergency Safety Hub'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.error} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <Button
          title={t('signOut') || 'Sign Out'}
          variant="outline"
          size="medium"
          icon="log-out-outline"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ========================================================================= */}
      {/* 1. EDIT PROFILE MODAL */}
      {/* ========================================================================= */}
      <Modal visible={isEditModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{t('editProfile') || 'Edit Profile Information'}</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <Ionicons name="close" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
              {/* Profile Photo Picker & Preview */}
              <View style={styles.avatarSection}>
                <Image source={{ uri: editAvatar }} style={styles.modalAvatarPreview} />
                <View style={styles.avatarActionRow}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>{t('selectProfilePic') || 'Select Profile Picture'}</Text>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
                    {AVATAR_PRESETS.map((presetUrl, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setEditAvatar(presetUrl)}
                        style={[
                          styles.presetPill,
                          { borderColor: editAvatar === presetUrl ? theme.primary : theme.border },
                        ]}
                      >
                        <Image source={{ uri: presetUrl }} style={styles.presetThumb} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={styles.avatarBtnRow}>
                    <TouchableOpacity
                      onPress={pickImageFromGallery}
                      style={[styles.smallActionBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
                    >
                      <Ionicons name="image-outline" size={14} color={theme.primaryDark} />
                      <Text style={[styles.smallActionBtnText, { color: theme.primaryDark }]}>{t('uploadPhoto') || 'Upload Photo'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setShowUrlInput(!showUrlInput)}
                      style={[styles.smallActionBtn, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
                    >
                      <Ionicons name="link-outline" size={14} color={theme.primary} />
                      <Text style={[styles.smallActionBtnText, { color: theme.primary }]}>{t('url') || 'URL'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setEditAvatar(DEFAULT_AVATAR)}
                      style={[styles.smallActionBtn, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
                    >
                      <Ionicons name="trash-outline" size={14} color={theme.error} />
                      <Text style={[styles.smallActionBtnText, { color: theme.error }]}>{t('remove') || 'Remove'}</Text>
                    </TouchableOpacity>
                  </View>

                  {showUrlInput && (
                    <TextInput
                      value={customAvatarUrl}
                      onChangeText={(val) => {
                        setCustomAvatarUrl(val);
                        if (val.startsWith('http')) setEditAvatar(val);
                      }}
                      placeholder={t('pasteImageUrl') || 'Paste image URL (https://...)'}
                      placeholderTextColor={theme.textMuted}
                      style={[styles.inputField, { backgroundColor: theme.cardSecondary, color: theme.text, borderColor: theme.border, marginTop: 8 }]}
                    />
                  )}
                </View>
              </View>

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>{t('fullName') || 'Full Name'} *</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder={t('enterFullName') || 'Enter full name'}
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.inputField,
                    {
                      backgroundColor: theme.cardSecondary,
                      color: theme.text,
                      borderColor: validationErrors.name ? theme.error : theme.border,
                    },
                  ]}
                />
                {validationErrors.name && <Text style={styles.errorMsg}>{validationErrors.name}</Text>}
              </View>

              {/* Email Address */}
              <View style={styles.inputGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>{t('emailAddress') || 'Email Address'} *</Text>
                <TextInput
                  value={editEmail}
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder={t('enterEmailAddress') || 'Enter email address'}
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.inputField,
                    {
                      backgroundColor: theme.cardSecondary,
                      color: theme.text,
                      borderColor: validationErrors.email ? theme.error : theme.border,
                    },
                  ]}
                />
                {validationErrors.email && <Text style={styles.errorMsg}>{validationErrors.email}</Text>}
              </View>

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>{t('phoneNumber') || 'Phone Number'} *</Text>
                <TextInput
                  value={editPhone}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                  placeholder={t('enterPhoneNumber') || 'Enter phone number (+91...)'}
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.inputField,
                    {
                      backgroundColor: theme.cardSecondary,
                      color: theme.text,
                      borderColor: validationErrors.phone ? theme.error : theme.border,
                    },
                  ]}
                />
                {validationErrors.phone && <Text style={styles.errorMsg}>{validationErrors.phone}</Text>}
              </View>

              {/* Complete Address */}
              <View style={styles.inputGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>{t('address') || 'Home / Tourist Address'} *</Text>
                <TextInput
                  value={editAddress}
                  onChangeText={setEditAddress}
                  multiline
                  numberOfLines={3}
                  placeholder={t('enterAddress') || 'Enter complete tourist or home address'}
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.inputField,
                    styles.textArea,
                    {
                      backgroundColor: theme.cardSecondary,
                      color: theme.text,
                      borderColor: validationErrors.address ? theme.error : theme.border,
                    },
                  ]}
                />
                {validationErrors.address && <Text style={styles.errorMsg}>{validationErrors.address}</Text>}
              </View>

              {/* Action Buttons */}
              <View style={styles.modalBtnRow}>
                <Button
                  title={t('cancel') || 'Cancel'}
                  variant="outline"
                  size="medium"
                  onPress={() => setIsEditModalOpen(false)}
                  style={{ flex: 1 }}
                />
                <Button
                  title={t('saveChanges') || 'Save Changes'}
                  variant="primary"
                  size="medium"
                  onPress={handleSaveProfile}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 2. AI TOOL INTERACTIVE MODAL */}
      {/* ========================================================================= */}
      <Modal visible={!!activeAITool} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="sparkles" size={20} color={theme.primary} />
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {activeAITool === 'trip' && 'AI Trip Planner'}
                  {activeAITool === 'guide' && 'AI Destination Guide'}
                  {activeAITool === 'budget' && 'AI Budget Planner'}
                  {activeAITool === 'local' && 'AI Local Recommender'}
                  {activeAITool === 'translate' && 'AI Travel Translator'}
                  {activeAITool === 'safety' && 'AI Travel Safety Assistant'}
                  {activeAITool === 'smart' && 'AI Smart Recommendations'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setActiveAITool(null)}>
                <Ionicons name="close" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
              {/* Form Input Section based on active tool */}
              {activeAITool === 'trip' && (
                <View style={{ gap: 10 }}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>Destination</Text>
                  <TextInput
                    value={tripDest}
                    onChangeText={setTripDest}
                    style={[styles.inputField, { backgroundColor: theme.cardSecondary, color: theme.text, borderColor: theme.border }]}
                  />
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: theme.text }]}>Days</Text>
                      <TextInput
                        value={tripDays}
                        onChangeText={setTripDays}
                        keyboardType="numeric"
                        style={[styles.inputField, { backgroundColor: theme.cardSecondary, color: theme.text, borderColor: theme.border }]}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: theme.text }]}>Total Budget (₹)</Text>
                      <TextInput
                        value={tripBudget}
                        onChangeText={setTripBudget}
                        keyboardType="numeric"
                        style={[styles.inputField, { backgroundColor: theme.cardSecondary, color: theme.text, borderColor: theme.border }]}
                      />
                    </View>
                  </View>
                  <Button title="Generate AI Itinerary" variant="primary" onPress={() => runAITool('trip')} />
                </View>
              )}

              {activeAITool === 'guide' && (
                <View style={{ gap: 10 }}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>Ask Destination Question</Text>
                  <TextInput
                    value={guideQuestion}
                    onChangeText={setGuideQuestion}
                    placeholder="e.g. What are the best places to visit here?"
                    placeholderTextColor={theme.textMuted}
                    style={[styles.inputField, { backgroundColor: theme.cardSecondary, color: theme.text, borderColor: theme.border }]}
                  />
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                    {[
                      'What are the best places to visit here?',
                      'What should I do today?',
                      'Suggest places near me',
                      'What local food should I try?',
                      'What are budget-friendly attractions?',
                    ].map((q, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          setGuideQuestion(q);
                          runAITool('guide', q);
                        }}
                        style={[styles.presetChip, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
                      >
                        <Text style={[styles.presetChipText, { color: theme.primaryDark }]}>{q}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <Button title="Ask AI Guide" variant="primary" onPress={() => runAITool('guide')} />
                </View>
              )}

              {activeAITool === 'budget' && (
                <View style={{ gap: 10 }}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>Total Budget (₹)</Text>
                  <TextInput
                    value={budgetAmount}
                    onChangeText={setBudgetAmount}
                    keyboardType="numeric"
                    style={[styles.inputField, { backgroundColor: theme.cardSecondary, color: theme.text, borderColor: theme.border }]}
                  />
                  <Button title="Calculate AI Budget Breakdown" variant="primary" onPress={() => runAITool('budget')} />
                </View>
              )}

              {activeAITool === 'translate' && (
                <View style={{ gap: 10 }}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>Phrase to Translate</Text>
                  <TextInput
                    value={translateInput}
                    onChangeText={setTranslateInput}
                    style={[styles.inputField, { backgroundColor: theme.cardSecondary, color: theme.text, borderColor: theme.border }]}
                  />
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>Target Language</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {[
                      { code: 'hi', label: 'Hindi (हिन्दी)' },
                      { code: 'te', label: 'Telugu (తెలుగు)' },
                      { code: 'ta', label: 'Tamil (தமிழ்)' },
                      { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
                      { code: 'ml', label: 'Malayalam (മലയാളം)' },
                    ].map((l) => (
                      <TouchableOpacity
                        key={l.code}
                        onPress={() => setTargetLang(l.code)}
                        style={[
                          styles.presetChip,
                          { backgroundColor: targetLang === l.code ? theme.primary : theme.cardSecondary, borderColor: theme.border },
                        ]}
                      >
                        <Text style={{ fontSize: 12, color: targetLang === l.code ? '#FFF' : theme.text }}>{l.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Button title="Translate Now" variant="primary" onPress={() => runAITool('translate')} />
                </View>
              )}

              {/* Loading State */}
              {aiLoading && (
                <View style={{ paddingVertical: 24, alignItems: 'center', gap: 10 }}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={{ color: theme.textSecondary, fontFamily: 'Manrope_500Medium' }}>
                    Consulting WayWise AI Travel Concierge...
                  </Text>
                </View>
              )}

              {/* AI Response Output Display */}
              {aiResult && !aiLoading && (
                <View style={[styles.aiResultBox, { backgroundColor: theme.cardSecondary, borderColor: theme.border, marginTop: 14 }]}>
                  {activeAITool === 'trip' && aiResult.itineraryDays && (
                    <View style={{ gap: 12 }}>
                      <Text style={[styles.resultTitle, { color: theme.primaryDark }]}>{aiResult.summary}</Text>
                      {aiResult.itineraryDays.map((dayItem) => (
                        <View key={dayItem.day} style={[styles.dayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                          <Text style={[styles.dayTitle, { color: theme.text }]}>{dayItem.title}</Text>
                          <Text style={[styles.dayDetail, { color: theme.textSecondary }]}>• {dayItem.morning}</Text>
                          <Text style={[styles.dayDetail, { color: theme.textSecondary }]}>• {dayItem.afternoon}</Text>
                          <Text style={[styles.dayDetail, { color: theme.textSecondary }]}>• {dayItem.evening}</Text>
                          <View style={styles.tagRow}>
                            <Text style={[styles.ecoTag, { color: theme.ecoGreen }]}>Cost: ₹{dayItem.estimatedCost}</Text>
                            <Text style={[styles.ecoTag, { color: theme.primary }]}>{dayItem.travelTime}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {activeAITool === 'guide' && (
                    <View>
                      <Text style={[styles.resultTitle, { color: theme.primary }]}>AI Travel Guide Response</Text>
                      <Text style={[styles.resultText, { color: theme.text }]}>{aiResult.answer}</Text>
                    </View>
                  )}

                  {activeAITool === 'budget' && aiResult.breakdown && (
                    <View style={{ gap: 8 }}>
                      <Text style={[styles.resultTitle, { color: theme.primary }]}>Budget Allocation (Total ₹{aiResult.totalBudget})</Text>
                      <Text style={[styles.resultText, { color: theme.text }]}>• Accommodation: ₹{aiResult.breakdown.accommodation}</Text>
                      <Text style={[styles.resultText, { color: theme.text }]}>• Food &amp; Dining: ₹{aiResult.breakdown.food}</Text>
                      <Text style={[styles.resultText, { color: theme.text }]}>• Transportation: ₹{aiResult.breakdown.transportation}</Text>
                      <Text style={[styles.resultText, { color: theme.text }]}>• Attractions &amp; Entry: ₹{aiResult.breakdown.attractions}</Text>
                      <Text style={[styles.resultText, { color: theme.text }]}>• Shopping &amp; Souvenirs: ₹{aiResult.breakdown.shopping}</Text>
                      <Text style={[styles.resultText, { color: theme.text }]}>• Misc Emergency Fund: ₹{aiResult.breakdown.miscellaneous}</Text>

                      <Text style={[styles.resultTitle, { color: theme.ecoGreen, marginTop: 8 }]}>AI Budget Optimization Tips:</Text>
                      {aiResult.budgetTips.map((tip, idx) => (
                        <Text key={idx} style={[styles.resultText, { color: theme.textSecondary }]}>✔ {tip}</Text>
                      ))}
                    </View>
                  )}

                  {activeAITool === 'local' && Array.isArray(aiResult) && (
                    <View style={{ gap: 10 }}>
                      <Text style={[styles.resultTitle, { color: theme.primary }]}>Recommended Sustainable Local Experiences</Text>
                      {aiResult.map((item) => (
                        <View key={item.id} style={[styles.dayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.dayTitle, { color: theme.text }]}>{item.title}</Text>
                            <Text style={{ fontSize: 11, fontFamily: 'Manrope_700Bold', color: theme.ecoGreen }}>Eco {item.ecoScore}</Text>
                          </View>
                          <Text style={[styles.dayDetail, { color: theme.textSecondary }]}>{item.description}</Text>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                            <Text style={{ fontSize: 11, color: theme.textMuted }}>{item.location}</Text>
                            <Text style={{ fontSize: 11, fontFamily: 'Manrope_700Bold', color: theme.primary }}>{item.price}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {activeAITool === 'translate' && (
                    <View style={{ gap: 8 }}>
                      <Text style={{ fontSize: 12, color: theme.textMuted }}>Original:</Text>
                      <Text style={[styles.resultText, { color: theme.text }]}>{aiResult.originalText}</Text>
                      <Text style={{ fontSize: 12, color: theme.primary, marginTop: 4, fontFamily: 'Manrope_700Bold' }}>Translation:</Text>
                      <Text style={[styles.resultTitle, { color: theme.primaryDark, fontSize: 16 }]}>{aiResult.translatedText}</Text>
                    </View>
                  )}

                  {activeAITool === 'safety' && aiResult.emergencyNumbers && (
                    <View style={{ gap: 8 }}>
                      <Text style={[styles.resultTitle, { color: theme.error }]}>Emergency Contacts &amp; Cautions</Text>
                      {aiResult.emergencyNumbers.map((num, idx) => (
                        <Text key={idx} style={[styles.resultText, { color: theme.text }]}>☎ {num.label}: {num.phone}</Text>
                      ))}
                      <Text style={[styles.resultTitle, { color: theme.primary, marginTop: 6 }]}>Local Tourist Precautions:</Text>
                      {aiResult.localPrecautions.map((p, idx) => (
                        <Text key={idx} style={[styles.resultText, { color: theme.textSecondary }]}>• {p}</Text>
                      ))}
                    </View>
                  )}

                  {activeAITool === 'smart' && aiResult.recommendations && (
                    <View style={{ gap: 10 }}>
                      <Text style={[styles.resultTitle, { color: theme.primary }]}>Smart Personalized Recommendations</Text>
                      {aiResult.recommendations.map((rec) => (
                        <View key={rec.id} style={[styles.dayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                          <Text style={[styles.dayTitle, { color: theme.text }]}>{rec.title}</Text>
                          <Text style={[styles.dayDetail, { color: theme.textSecondary }]}>{rec.reason}</Text>
                          <Text style={{ fontSize: 11, fontFamily: 'Manrope_700Bold', color: theme.ecoGreen, marginTop: 4 }}>{rec.ecoPointsReward}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Voice AI Multi-Language Simultaneous Translator Modal */}
      <VoiceTranslatorModal
        visible={showVoiceTranslator}
        onClose={() => setShowVoiceTranslator(false)}
        initialText={translateInput}
      />

      {/* APP THEME & EXPERIENCE MODAL */}
      <Modal
        visible={isThemeModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsThemeModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.themeModalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.themeModalIcon, { backgroundColor: theme.primaryLight }]}>
                  <Ionicons name="color-palette" size={20} color={theme.primary} />
                </View>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>App Theme &amp; Experience</Text>
                  <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                    {t('themeSubtitle') || "Luxury aesthetics, glassmorphism & maps"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsThemeModalOpen(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.themeModalScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.themeIntroText, { color: theme.textSecondary }]}>
                {t('themeIntro') || 'Choose your bespoke travel aesthetic. The entire app (tabs, headers, cards, buttons, badges) updates instantly.'}
              </Text>

              <View style={styles.themeCardsList}>
                {(themesList || []).map((tItem) => {
                  const isSelected = themeName === tItem.id;
                  return (
                    <TouchableOpacity
                      key={tItem.id}
                      activeOpacity={0.85}
                      onPress={() => {
                        setThemeName(tItem.id);
                      }}
                      style={[
                        styles.themeItemCard,
                        {
                          backgroundColor: isSelected ? theme.primaryLight : theme.cardSecondary,
                          borderColor: isSelected ? theme.primary : theme.border,
                          borderWidth: isSelected ? 2 : 1,
                        },
                      ]}
                    >
                      {/* Top Row: Icon, Title & Badge */}
                      <View style={styles.themeCardTop}>
                        <View style={styles.themeCardTitleRow}>
                          <View
                            style={[
                              styles.themeIconCircle,
                              { backgroundColor: isSelected ? theme.primary : theme.card },
                            ]}
                          >
                            <Ionicons
                              name={tItem.icon}
                              size={20}
                              color={isSelected ? '#FFFFFF' : theme.primary}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text style={[styles.themeCardName, { color: isSelected ? theme.primaryDark : theme.text }]}>
                                {tItem.name}
                              </Text>
                              <View style={[styles.themeTagBadge, { backgroundColor: isSelected ? theme.primary : 'rgba(0,0,0,0.06)' }]}>
                                <Text style={[styles.themeTagBadgeText, { color: isSelected ? '#FFFFFF' : theme.textSecondary }]}>
                                  {tItem.badge}
                                </Text>
                              </View>
                            </View>
                            <Text style={[styles.themeCardTagline, { color: theme.textSecondary }]} numberOfLines={1}>
                              {tItem.tagline}
                            </Text>
                          </View>
                        </View>

                        {/* Radio Checkmark */}
                        <View
                          style={[
                            styles.themeRadio,
                            {
                              borderColor: isSelected ? theme.primary : theme.border,
                              backgroundColor: isSelected ? theme.primary : 'transparent',
                            },
                          ]}
                        >
                          {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                        </View>
                      </View>

                      {/* Description */}
                      <Text style={[styles.themeDescText, { color: theme.textSecondary }]}>
                        {tItem.description}
                      </Text>

                      {/* Color Palette Swatches */}
                      <View style={styles.swatchRow}>
                        <Text style={[styles.swatchLabel, { color: theme.textMuted }]}>{t('palette') || "Palette"}:</Text>
                        <View style={styles.swatches}>
                          <View style={[styles.swatchCircle, { backgroundColor: tItem.bgColor, borderColor: theme.border }]} />
                          <View style={[styles.swatchCircle, { backgroundColor: tItem.cardColor, borderColor: theme.border }]} />
                          <View style={[styles.swatchCircle, { backgroundColor: tItem.primaryColor, borderColor: theme.border }]} />
                          <View style={[styles.swatchCircle, { backgroundColor: tItem.accentColor, borderColor: theme.border }]} />
                        </View>
                        {isSelected && (
                          <View style={[styles.appliedTag, { backgroundColor: theme.primary }]}>
                            <Text style={styles.appliedTagText}>{t('activeTheme') || 'Active'}</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={[styles.themeModalFooter, { borderTopColor: theme.border }]}>
              <Button
                title={t('done') || "Done"}
                variant="primary"
                size="large"
                onPress={() => setIsThemeModalOpen(false)}
                style={{ width: '100%' }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.3,
  },
  scrollContent: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
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
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
  },
  userEmail: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  userAddress: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 3,
  },
  badgeRow: {
    marginTop: 7,
  },
  ecoBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ecoBadgeText: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  editBtnText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
  roleSwitchCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  roleTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 2,
  },
  roleSub: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  aiSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginBottom: 14,
    lineHeight: 17,
  },
  aiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  aiToolCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  aiToolCardFull: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  aiToolTitle: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  aiToolSub: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langButton: {
    width: '31%',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  langBtnName: {
    fontSize: 12.5,
    fontFamily: 'Manrope_700Bold',
  },
  langBtnNative: {
    fontSize: 10.5,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  settingLabel: {
    fontSize: 13.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  settingSub: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
  },

  // Modal Common
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  modalSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    padding: 18,
    gap: 14,
  },
  avatarPickerSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  avatarActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  photoBtnText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
  urlInputWrap: {
    width: '100%',
    marginTop: 8,
  },
  presetScroll: {
    marginTop: 4,
    gap: 8,
  },
  presetAvatarWrap: {
    padding: 2,
    borderRadius: 22,
    borderWidth: 2,
  },
  presetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  fieldWrap: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  inputField: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13.5,
    fontFamily: 'Manrope_500Medium',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },

  // Theme Picker Row & Modal Styles
  themeIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeThemePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  activeThemePillText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  themeModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '88%',
  },
  themeModalIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeModalScroll: {
    padding: 16,
    gap: 12,
  },
  themeIntroText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
    marginBottom: 4,
  },
  themeCardsList: {
    gap: 12,
  },
  themeItemCard: {
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  themeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  themeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeCardName: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
  themeTagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  themeTagBadgeText: {
    fontSize: 9.5,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: 0.3,
  },
  themeCardTagline: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  themeRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  themeDescText: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 17,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  swatchLabel: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
    marginRight: 6,
  },
  swatches: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swatchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
  },
  appliedTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  appliedTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Manrope_800ExtraBold',
  },
  themeModalFooter: {
    padding: 16,
    borderTopWidth: 1,
  },

  // AI Modal Results
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  aiResultBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  resultTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 6,
  },
  resultText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
  },
  dayCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 4,
  },
  dayTitle: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  dayDetail: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 16,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  ecoTag: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
});
