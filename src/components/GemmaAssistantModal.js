import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTrips } from '../context/TripContext';
import { queryGemmaAssistant, GEMMA_MODEL_VERSION } from '../utils/gemmaAI';

const assistantQuickChips = [
  'Suggest places near me',
  'Reschedule tomorrow for rain',
  'I have ₹2,000 remaining',
  'Less crowded alternative destinations',
  'Find organic coffee and local crafts',
];

export const GemmaAssistantModal = ({ visible, onClose, navigation }) => {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  const { activeTrip, applyWeatherAdjustment, optimizeBudget } = useTrips();
  const scrollViewRef = useRef(null);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'assistant_init',
      sender: 'gemma',
      text: `Namaste! I am your WayWise Travel Assistant.\n\nI can help you adjust your itinerary for weather changes, rebalance your travel budget, or discover heritage landmarks and artisan crafts.`,
      time: 'Just now',
    },
  ]);

  const handleSpeak = (textToSpeak) => {
    try {
      if (isSpeaking) {
        Speech.stop();
        setIsSpeaking(false);
      } else {
        setIsSpeaking(true);
        const cleanText = textToSpeak.replace(/\*\*/g, '').replace(/•/g, '');
        Speech.speak(cleanText, {
          language: currentLanguage === 'hi' ? 'hi-IN' : 'en-IN',
          onDone: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } catch (e) {
      console.log('Speech error', e);
      setIsSpeaking(false);
    }
  };

  const handleSend = async (customPrompt) => {
    const text = (customPrompt || input).trim();
    if (!text) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await queryGemmaAssistant({
        prompt: text,
        activeTrip,
        userLanguage: currentLanguage,
      });

      const gemmaMsg = {
        id: `gemma_${Date.now()}`,
        sender: 'gemma',
        text: response.text,
        actionSuggestion: response.actionSuggestion,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, gemmaMsg]);
      setLoading(false);
      handleSpeak(response.text);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleActionPress = (action) => {
    if (!action) return;

    if (action.type === 'APPLY_WEATHER_SWAP') {
      applyWeatherAdjustment();
      Alert.alert(
        'Weather Adjustment Applied',
        'Your itinerary has been automatically updated: outdoor activities rescheduled for sheltered indoor venues.'
      );
    } else if (action.type === 'OPTIMIZE_BUDGET') {
      optimizeBudget();
      Alert.alert(
        'Budget Optimized',
        'Lodging and transit rebalanced to certified community homestays and public transit.'
      );
    } else if (action.type === 'EXPLORE_GEMS') {
      onClose();
      navigation?.navigate('HiddenGems');
    } else if (action.type === 'VIEW_BUSINESSES') {
      onClose();
      navigation?.navigate('LocalBusiness');
    } else if (action.type === 'OPEN_MAP') {
      onClose();
      navigation?.navigate('SmartMap');
    } else if (action.type === 'OPEN_PLANNER') {
      onClose();
      navigation?.navigate('TripPlannerWizard');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.modalSheet, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          {/* Pop-up Sheet Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.gemmaIconBox, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="chatbubble-ellipses" size={18} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.text }]}>Travel Assistant</Text>
                <Text style={[styles.modelSub, { color: theme.textSecondary }]}>
                  Personalized travel guidance
                </Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => handleSpeak(messages[messages.length - 1]?.text || 'Travel assistant ready.')}
                style={[styles.iconBtn, { backgroundColor: isSpeaking ? theme.primary : theme.cardSecondary }]}
              >
                <Ionicons
                  name={isSpeaking ? 'volume-high' : 'volume-medium-outline'}
                  size={18}
                  color={isSpeaking ? '#FFFFFF' : theme.text}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={[styles.iconBtn, { backgroundColor: theme.cardSecondary }]}>
                <Ionicons name="close" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Prompt Chips */}
          <View style={styles.chipsWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {assistantQuickChips.map((chip, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSend(chip)}
                  style={[styles.chip, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
                >
                  <Text style={[styles.chipText, { color: theme.primary }]}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Chat Messages Timeline */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatScroll}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.msgRow,
                    isUser ? styles.userMsgRow : styles.gemmaMsgRow,
                  ]}
                >
                  {!isUser && (
                    <View style={[styles.botAvatar, { backgroundColor: theme.primaryLight }]}>
                      <Ionicons name="compass-outline" size={14} color={theme.primary} />
                    </View>
                  )}

                  <View
                    style={[
                      styles.bubble,
                      isUser
                        ? [styles.userBubble, { backgroundColor: theme.primary }]
                        : [styles.gemmaBubble, { backgroundColor: theme.cardSecondary, borderColor: theme.border }],
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        { color: isUser ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      {msg.text}
                    </Text>

                    {/* Action Suggestion Button */}
                    {msg.actionSuggestion && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleActionPress(msg.actionSuggestion)}
                        style={[styles.actionCta, { backgroundColor: theme.primary }]}
                      >
                        <Ionicons name="arrow-forward-circle-outline" size={14} color="#FFFFFF" />
                        <Text style={styles.actionCtaText}>{msg.actionSuggestion.label}</Text>
                      </TouchableOpacity>
                    )}

                    <Text
                      style={[
                        styles.msgTime,
                        { color: isUser ? 'rgba(255,255,255,0.7)' : theme.textMuted },
                      ]}
                    >
                      {msg.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Bottom Chat Input */}
          <View style={[styles.inputRow, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about hotels, weather, or destinations..."
              placeholderTextColor={theme.textMuted}
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.cardSecondary,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              style={[
                styles.sendBtn,
                { backgroundColor: input.trim() ? theme.primary : theme.border },
              ]}
              disabled={!input.trim()}
            >
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    height: '82%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gemmaIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  modelSub: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsWrap: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  chatScroll: {
    padding: 16,
    paddingBottom: 20,
    gap: 12,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userMsgRow: {
    justifyContent: 'flex-end',
  },
  gemmaMsgRow: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  gemmaBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 13.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 20,
  },
  msgTime: {
    fontSize: 10,
    fontFamily: 'Manrope_400Regular',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  actionCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  actionCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
