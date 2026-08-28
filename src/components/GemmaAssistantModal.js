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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTrips } from '../context/TripContext';
import { queryGemmaAssistant, GEMMA_MODEL_VERSION } from '../utils/gemmaAI';
import { Button } from './Button';

const gemmaQuickChips = [
  'Suggest places near me',
  '🌧️ Reschedule tomorrow for rain',
  '💰 I have ₹2,000 remaining',
  '💎 Less crowded alternative destinations',
  '☕ Find organic tribal coffee & crafts',
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
      id: 'gemma_init',
      sender: 'gemma',
      text: `Namaste! I am **SmartTour Gemma AI** 🤖 (powered by Google Gemma architecture).\n\nAsk me to rebalance your travel budget, adapt your plan for rainy weather, or discover serene hidden gems away from crowds!`,
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
        // Clean markdown asterisks for voice output
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
        'Gemma Weather Action Applied 🌧️',
        'Your itinerary has been automatically updated: outdoor activities swapped for air-conditioned museums!'
      );
    } else if (action.type === 'OPTIMIZE_BUDGET') {
      optimizeBudget();
      Alert.alert(
        'Gemma Budget Optimized 💰',
        'Lodging and transit rebalanced to community eco-options. Budget deficit eliminated!'
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
                <Ionicons name="sparkles" size={18} color={theme.primary} />
              </View>
              <View>
                <View style={styles.badgeRow}>
                  <Text style={[styles.title, { color: theme.text }]}>SmartTour Gemma AI</Text>
                  <View style={[styles.gemmaPill, { backgroundColor: '#CCFBF1' }]}>
                    <Text style={styles.gemmaPillText}>Google Gemma</Text>
                  </View>
                </View>
                <Text style={[styles.modelSub, { color: theme.textSecondary }]}>
                  {GEMMA_MODEL_VERSION}
                </Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => handleSpeak(messages[messages.length - 1]?.text || 'SmartTour Gemma AI ready.')}
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

          {/* Quick Gemma Prompt Chips */}
          <View style={styles.chipsWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {gemmaQuickChips.map((chip, idx) => (
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
                      <Ionicons name="sparkles" size={14} color={theme.primary} />
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

                    {/* Action Suggestion Button from Gemma */}
                    {msg.actionSuggestion && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleActionPress(msg.actionSuggestion)}
                        style={[styles.actionCta, { backgroundColor: theme.primary }]}
                      >
                        <Ionicons name="flash" size={13} color="#FFFFFF" />
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

            {loading && (
              <View style={styles.loadingRow}>
                <View style={[styles.botAvatar, { backgroundColor: theme.primaryLight }]}>
                  <ActivityIndicator size="small" color={theme.primary} />
                </View>
                <View style={[styles.loadingBubble, { backgroundColor: theme.cardSecondary }]}>
                  <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                    Gemma AI is reasoning...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom Chat Input Bar */}
          <View style={[styles.inputBar, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
            <TouchableOpacity
              onPress={() => handleSend('Suggest places near me')}
              style={[styles.micBtn, { backgroundColor: theme.cardSecondary }]}
            >
              <Ionicons name="mic-outline" size={20} color={theme.primary} />
            </TouchableOpacity>

            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Gemma about budget, rain, hidden gems..."
              placeholderTextColor={theme.textMuted}
              style={[styles.textInput, { color: theme.text, backgroundColor: theme.cardSecondary }]}
              onSubmitEditing={() => handleSend()}
            />

            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={!input.trim()}
              style={[
                styles.sendBtn,
                { backgroundColor: input.trim() ? theme.primary : theme.border },
              ]}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    height: '82%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  gemmaPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gemmaPillText: {
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '800',
  },
  modelSub: {
    fontSize: 11,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsWrap: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  chipsScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chatScroll: {
    padding: 16,
    gap: 12,
  },
  msgRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
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
  },
  bubble: {
    maxWidth: '84%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  gemmaBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  actionCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  actionCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  msgTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  micBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
