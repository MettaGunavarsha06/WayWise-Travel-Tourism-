import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTrips } from '../../context/TripContext';

const quickPrompts = [
  'Suggest places near me',
  'I have ₹2,000 remaining',
  'Change tomorrow\'s plan because of rain',
  'Find local organic coffee & craft stores',
  'Show less-crowded alternative destinations',
];

export const AIAssistantScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  const { activeTrip, applyWeatherAdjustment } = useTrips();
  const scrollViewRef = useRef(null);

  const [inputMessage, setInputMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: 'Namaste! I am SmartTour AI 🤖. How can I help you explore, optimize budgets, or adjust your travel itinerary today?',
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
        Speech.speak(text, {
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

  const handleSend = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let aiReply = '';
      const lower = query.toLowerCase();

      if (lower.includes('near me') || lower.includes('places near')) {
        aiReply =
          '📍 Here are 5 prime attractions near your location in Visakhapatnam:\n1. INS Kursura Submarine Museum (1.2 km)\n2. RK Beach Promenade (1.5 km)\n3. TU 142 Aircraft Simulator (2.1 km)\n4. Kailasagiri Hilltop Ropeway (4.5 km)\n5. Ross Hill Viewpoint (6.0 km)';
      } else if (lower.includes('2,000') || lower.includes('2000') || lower.includes('budget') || lower.includes('remaining')) {
        aiReply =
          '💰 With your remaining ₹2,000 budget, you can comfortably:\n• Visit TU 142 Museum (₹50)\n• Enjoy authentic Andhra Banana-Leaf Thali at Andhra Ruchulu (₹350)\n• Buy genuine Etikoppaka lacquer craft toys (₹600)\n• Hop on the Eco EV Beach Shuttle (₹40)\n\nYou will still have ~₹960 left for souvenirs!';
      } else if (lower.includes('rain') || lower.includes('weather') || lower.includes('tomorrow')) {
        applyWeatherAdjustment();
        aiReply =
          '🌧️ I checked the weather radar! Heavy showers are expected tomorrow afternoon. I have automatically updated your itinerary by swapping the outdoor Kailasagiri hilltop trek for the air-conditioned INS Kursura Submarine and Visakha Heritage Arts Pavilion.';
      } else if (lower.includes('coffee') || lower.includes('craft') || lower.includes('store') || lower.includes('artisan')) {
        aiReply =
          '☕ & 🎨 Here are verified local cooperatives:\n• Araku Organic Tribal Coffee & Spices Co-op (Shade grown Arabica beans)\n• Etikoppaka Lacquer Wooden Toy Artisans (Natural vegetable dyes)\n• Bagru Block Printing Studio\nAll sales directly support indigenous village families!';
      } else if (lower.includes('crowd') || lower.includes('alternative') || lower.includes('gems')) {
        aiReply =
          '💎 To escape peak crowds at RK Beach & Tirumala, consider these serene alternatives:\n• Yarada Golden Beach (75% lower density)\n• Chandragiri Vijayanagara Fort (Peaceful royal gardens)\n• Araku Valley Organic Belt (Zero over-tourism)';
      } else {
        aiReply =
          `I understand you are asking about "${query}". In SmartTour SIH 2026, I can help you find certified eco-hotels, compare multi-modal trains vs buses, rebalance budgets, and issue your Digital Tourism Pass!`;
      }

      const aiMsg = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(aiReply);
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <View style={styles.botRow}>
            <View style={[styles.botDot, { backgroundColor: theme.ecoGreen }]} />
            <Text style={[styles.headerTitle, { color: theme.text }]}>SmartTour AI</Text>
          </View>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            Active Assistant • Multilingual & Voice Ready
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => speakText(messages[messages.length - 1]?.text || 'Hello')}
          style={[styles.voiceBtn, { backgroundColor: isSpeaking ? theme.primary : theme.cardSecondary }]}
        >
          <Ionicons
            name={isSpeaking ? 'volume-high' : 'volume-medium-outline'}
            size={20}
            color={isSpeaking ? '#FFFFFF' : theme.text}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Quick Prompt Chips */}
          <View style={styles.promptsSection}>
            <Text style={[styles.promptsHeading, { color: theme.textMuted }]}>
              Quick Travel Questions:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {quickPrompts.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSend(prompt)}
                  style={[styles.promptChip, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <Text style={[styles.promptChipText, { color: theme.primary }]}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Messages Timeline */}
          <View style={styles.messagesList}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubbleWrap,
                    isUser ? styles.userBubbleWrap : styles.aiBubbleWrap,
                  ]}
                >
                  {!isUser && (
                    <View style={[styles.avatarBox, { backgroundColor: theme.primaryLight }]}>
                      <Ionicons name="sparkles" size={14} color={theme.primary} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isUser
                        ? [styles.userBubble, { backgroundColor: theme.primary }]
                        : [styles.aiBubble, { backgroundColor: theme.card, borderColor: theme.border }],
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
                    <Text
                      style={[
                        styles.timeText,
                        { color: isUser ? 'rgba(255,255,255,0.7)' : theme.textMuted },
                      ]}
                    >
                      {msg.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TouchableOpacity
            onPress={() => handleSend('Suggest places near me')}
            style={[styles.micBtn, { backgroundColor: theme.cardSecondary }]}
          >
            <Ionicons name="mic-outline" size={20} color={theme.primary} />
          </TouchableOpacity>

          <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Ask SmartTour AI anything..."
            placeholderTextColor={theme.textMuted}
            style={[styles.inputField, { color: theme.text, backgroundColor: theme.cardSecondary }]}
            onSubmitEditing={() => handleSend()}
          />

          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!inputMessage.trim()}
            style={[
              styles.sendBtn,
              { backgroundColor: inputMessage.trim() ? theme.primary : theme.border },
            ]}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  backBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
    marginHorizontal: 10,
  },
  botRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  botDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 11,
    marginTop: 1,
  },
  voiceBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  promptsSection: {
    marginBottom: 16,
  },
  promptsHeading: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipsScroll: {
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  promptChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  messagesList: {
    gap: 14,
  },
  messageBubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userBubbleWrap: {
    justifyContent: 'flex-end',
  },
  aiBubbleWrap: {
    justifyContent: 'flex-start',
  },
  avatarBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
