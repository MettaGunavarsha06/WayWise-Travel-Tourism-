import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTrips } from '../../context/TripContext';
import { queryGemmaAssistant, GEMMA_MODEL_VERSION } from '../../utils/gemmaAI';
import { VoiceTranslatorModal } from '../../components/VoiceTranslatorModal';

const quickPrompts = [
  '🎙️ Voice Multi-Translator',
  'Suggest places near me',
  'I have ₹2,000 remaining',
  'Change tomorrow\'s plan because of rain',
  'Find local organic coffee & craft stores',
  'Show less-crowded alternative destinations',
];

export const AIAssistantScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  const { activeTrip, applyWeatherAdjustment, optimizeBudget } = useTrips();
  const scrollViewRef = useRef(null);

  const [inputMessage, setInputMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceTranslator, setShowVoiceTranslator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: `Namaste! I am your WayWise Travel Assistant.\n\nHow can I help you explore destinations, optimize budgets, or adapt your travel itinerary today?`,
      time: '10:00 AM',
    },
  ]);

  const speakText = (text) => {
    try {
      if (isSpeaking) {
        Speech.stop();
        setIsSpeaking(false);
      } else {
        setIsSpeaking(true);
        const cleanText = text.replace(/\*\*/g, '').replace(/•/g, '');
        Speech.speak(cleanText, {
          language: currentLanguage === 'hi' ? 'hi-IN' : 'en-IN',
          onDone: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } catch (e) {
      console.log('Speech synthesis note', e);
      setIsSpeaking(false);
    }
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    if (query === '🎙️ Voice Multi-Translator') {
      setShowVoiceTranslator(true);
      return;
    }

    const userMsg = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await queryGemmaAssistant({
        prompt: query,
        activeTrip,
        userLanguage: currentLanguage,
      });

      const aiMsg = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: response.text,
        actionSuggestion: response.actionSuggestion,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
      speakText(response.text);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    if (!action) return;
    if (action.type === 'APPLY_WEATHER_SWAP') {
      applyWeatherAdjustment();
      Alert.alert('Weather Adjustment Applied', 'Your itinerary has been adapted to weather-sheltered indoor sites.');
    } else if (action.type === 'OPTIMIZE_BUDGET') {
      optimizeBudget();
      Alert.alert('Budget Optimized', 'Your lodging and transit have been optimized for sustainability and savings.');
    } else if (action.type === 'EXPLORE_GEMS') {
      navigation.navigate('HiddenGems');
    } else if (action.type === 'VIEW_BUSINESSES') {
      navigation.navigate('LocalBusiness');
    } else if (action.type === 'OPEN_MAP') {
      navigation.navigate('SmartMap');
    } else if (action.type === 'OPEN_PLANNER') {
      navigation.navigate('TripPlannerWizard');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatarBox, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Travel Assistant</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              WayWise Smart Concierge
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            onPress={() => setShowVoiceTranslator(true)}
            style={[styles.voiceBtn, { backgroundColor: theme.primaryLight }]}
          >
            <Ionicons name="mic" size={18} color={theme.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => speakText(messages[messages.length - 1]?.text || 'Assistant ready')}
            style={[styles.voiceBtn, { backgroundColor: isSpeaking ? theme.primary : theme.cardSecondary }]}
          >
            <Ionicons
              name={isSpeaking ? 'volume-high' : 'volume-medium-outline'}
              size={18}
              color={isSpeaking ? '#FFFFFF' : theme.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Quick Prompts */}
        <View style={[styles.quickPromptsWrap, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPromptsScroll}>
            {quickPrompts.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSend(item)}
                style={[styles.quickPromptPill, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
              >
                <Text style={[styles.quickPromptText, { color: theme.primary }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Log */}
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
                  isUser ? styles.userRow : styles.aiRow,
                ]}
              >
                {!isUser && (
                  <View style={[styles.msgAvatar, { backgroundColor: theme.primaryLight }]}>
                    <Ionicons name="compass-outline" size={14} color={theme.primary} />
                  </View>
                )}

                <View
                  style={[
                    styles.bubble,
                    isUser
                      ? [
                          styles.userBubble,
                          {
                            backgroundColor: theme.primary,
                            borderColor: theme.mode === 'glass_horizon' ? 'rgba(255, 255, 255, 0.40)' : 'transparent',
                            borderWidth: theme.mode === 'glass_horizon' ? 1 : 0,
                          },
                        ]
                      : [
                          styles.aiBubble,
                          {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                            borderWidth: 1,
                          },
                        ],
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

                  {/* Suggestion Action CTA */}
                  {msg.actionSuggestion && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleAction(msg.actionSuggestion)}
                      style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                    >
                      <Ionicons name="arrow-forward-circle-outline" size={14} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>{msg.actionSuggestion.label}</Text>
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

        {/* Input Row */}
        <View style={[styles.inputRow, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type your travel inquiry..."
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
              { backgroundColor: inputMessage.trim() ? theme.primary : theme.border },
            ]}
            disabled={!inputMessage.trim()}
          >
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Voice AI Multi-Language Simultaneous Translator Modal */}
      <VoiceTranslatorModal
        visible={showVoiceTranslator}
        onClose={() => setShowVoiceTranslator(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    marginTop: 1,
  },
  voiceBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPromptsWrap: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  quickPromptsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickPromptPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickPromptText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  chatScroll: {
    padding: 16,
    gap: 12,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
  aiBubble: {
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
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  actionBtnText: {
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
