import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Animated,
  Platform,
  Alert,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import {
  translateVoiceSpeechMultiLang,
  SUPPORTED_TRANSLATION_LANGUAGES,
} from '../utils/gemmaAI';

const { width, height } = Dimensions.get('window');

const PRESET_VOICE_PHRASES = [
  { id: '1', text: 'Where is the nearest hospital?', icon: 'medkit', label: 'Emergency Hospital' },
  { id: '2', text: 'Where is the nearest tourist information center?', icon: 'compass', label: 'Tourist Info' },
  { id: '3', text: 'How much does this cost?', icon: 'pricetag', label: 'Ask Price' },
  { id: '4', text: 'Please take me to the railway station', icon: 'train', label: 'Train Station' },
  { id: '5', text: 'Is there vegetarian food available?', icon: 'restaurant', label: 'Veg Food' },
  { id: '6', text: 'Thank you very much for your help!', icon: 'heart', label: 'Thank You' },
];

export const VoiceTranslatorModal = ({ visible, onClose, initialText = '' }) => {
  const { theme, isDark } = useTheme();
  
  const [inputText, setInputText] = useState(initialText || 'Where is the nearest hospital?');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [currentlySpeaking, setCurrentlySpeaking] = useState(null);
  const [copiedLangId, setCopiedLangId] = useState(null);

  // Animation values for microphone pulse
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Trigger initial translation on open
  useEffect(() => {
    if (visible) {
      handleTranslate(inputText || 'Where is the nearest hospital?');
    }
  }, [visible]);

  // Handle pulse animation when recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.35,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ])
      ).start();

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      pulseAnim.setValue(1);
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Voice recording & Web Speech API integration
  const startVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
      return;
    }

    setIsRecording(true);
    setRecordingSeconds(0);

    // If running in browser environment, use Web Speech API
    if (Platform.OS === 'web' && (window.webkitSpeechRecognition || window.SpeechRecognition)) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join('');
          setInputText(transcript);
        };

        recognition.onerror = (err) => {
          console.warn('Speech recognition error:', err);
          stopVoiceRecording();
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (inputText) {
            handleTranslate(inputText);
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Web Speech API not supported:', err);
      }
    } else {
      // Mobile / simulated voice recording countdown
      setTimeout(() => {
        setIsRecording(false);
        handleTranslate(inputText || 'Where is the nearest hospital?');
      }, 3500);
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    handleTranslate(inputText);
  };

  const handleTranslate = async (textToTranslate) => {
    if (!textToTranslate || !textToTranslate.trim()) return;
    setIsLoading(true);
    try {
      const res = await translateVoiceSpeechMultiLang({ text: textToTranslate });
      setTranslationResult(res);
    } catch (err) {
      Alert.alert('Translation Error', 'Could not complete translation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech Playback (Speaks in that specific language accent)
  const handlePlayVoice = (item) => {
    setCurrentlySpeaking(item.languageId);

    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(item.translatedText);
        utterance.lang = item.speechCode || 'en-US';
        utterance.rate = 0.9; // Slightly slower for clear understanding by locals

        utterance.onend = () => setCurrentlySpeaking(null);
        utterance.onerror = () => setCurrentlySpeaking(null);

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setCurrentlySpeaking(null);
      }
    } else {
      // Native audio fallback
      setTimeout(() => {
        setCurrentlySpeaking(null);
      }, 2000);
    }
  };

  const handleCopy = (text, langId) => {
    if (Clipboard && Clipboard.setString) {
      Clipboard.setString(text);
    } else if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedLangId(langId);
    setTimeout(() => setCopiedLangId(null), 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.modalHeaderTitleWrap}>
              <View style={[styles.modalHeaderIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="mic" size={20} color="#2563EB" />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Voice AI Multi-Translator</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                  Record voice & translate simultaneously into 9+ languages
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Voice Recording / Mouth Record Section */}
            <View style={[styles.recorderCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
              <Text style={[styles.recorderTitle, { color: theme.text }]}>
                {isRecording ? '🎙️ Listening to your voice...' : '🎙️ Tap Microphone to Record Voice'}
              </Text>
              <Text style={[styles.recorderDesc, { color: theme.textSecondary }]}>
                {isRecording
                  ? `Recording... (00:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}) - Speak clearly`
                  : 'Speak any travel question or sentence to get instant translations with audio playback.'}
              </Text>

              {/* Glowing Animated Microphone Button */}
              <View style={styles.micButtonContainer}>
                <Animated.View
                  style={[
                    styles.micGlowRing,
                    {
                      backgroundColor: isRecording ? 'rgba(239, 68, 68, 0.25)' : 'rgba(37, 99, 235, 0.2)',
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={startVoiceRecording}
                  style={[
                    styles.micMainBtn,
                    {
                      backgroundColor: isRecording ? '#EF4444' : '#2563EB',
                    },
                  ]}
                >
                  <Ionicons
                    name={isRecording ? 'stop' : 'mic'}
                    size={32}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>

              {/* Status Badge */}
              <View style={styles.recordingStatusPill}>
                <View
                  style={[
                    styles.pulseDot,
                    { backgroundColor: isRecording ? '#EF4444' : '#16A34A' },
                  ]}
                />
                <Text style={[styles.recordingStatusText, { color: theme.textSecondary }]}>
                  {isRecording ? 'Capturing Mouth Audio...' : 'Voice AI Engine Ready'}
                </Text>
              </View>
            </View>

            {/* Spoken Text Input / Editor */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Spoken Phrase (or type text):</Text>
              <View style={[styles.inputBox, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="e.g. Where is the nearest hospital?"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.textInputField, { color: theme.text }]}
                  multiline
                />
                <TouchableOpacity
                  onPress={() => handleTranslate(inputText)}
                  style={styles.translateBtnSmall}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Travel Phrases */}
            <View style={styles.presetsSection}>
              <Text style={[styles.presetsTitle, { color: theme.textSecondary }]}>
                Quick Travel Voice Prompts:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsScroll}>
                {PRESET_VOICE_PHRASES.map((phrase) => (
                  <TouchableOpacity
                    key={phrase.id}
                    onPress={() => {
                      setInputText(phrase.text);
                      handleTranslate(phrase.text);
                    }}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: inputText === phrase.text ? theme.primaryLight : theme.cardSecondary,
                        borderColor: inputText === phrase.text ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={phrase.icon}
                      size={14}
                      color={inputText === phrase.text ? theme.primary : theme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.presetChipText,
                        { color: inputText === phrase.text ? theme.primary : theme.text },
                      ]}
                    >
                      {phrase.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Simultaneous Multi-Language Translations List */}
            <View style={styles.resultsSection}>
              <View style={styles.resultsHeaderRow}>
                <Text style={[styles.resultsHeaderTitle, { color: theme.text }]}>
                  Translated into {translationResult?.translations?.length || 9} Languages:
                </Text>
                {translationResult?.timestamp && (
                  <Text style={[styles.resultsTimestamp, { color: theme.textMuted }]}>
                    Updated {translationResult.timestamp}
                  </Text>
                )}
              </View>

              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                    Translating into Indian & Global languages...
                  </Text>
                </View>
              ) : (
                translationResult?.translations?.map((item) => {
                  const isSpeaking = currentlySpeaking === item.languageId;
                  const isCopied = copiedLangId === item.languageId;

                  return (
                    <View
                      key={item.languageId}
                      style={[
                        styles.langCard,
                        {
                          backgroundColor: theme.cardSecondary,
                          borderColor: isSpeaking ? '#2563EB' : theme.border,
                        },
                      ]}
                    >
                      {/* Language Header */}
                      <View style={styles.langCardHeader}>
                        <View style={styles.langNameRow}>
                          <Text style={styles.langFlag}>{item.flag}</Text>
                          <Text style={[styles.langNameText, { color: theme.text }]}>
                            {item.languageName}
                          </Text>
                          <Text style={[styles.langNativeBadge, { color: theme.textSecondary }]}>
                            ({item.nativeName})
                          </Text>
                        </View>

                        {/* Action buttons: Speak Audio + Copy */}
                        <View style={styles.langActions}>
                          {/* Text-To-Speech Play Button */}
                          <TouchableOpacity
                            onPress={() => handlePlayVoice(item)}
                            style={[
                              styles.speakerBtn,
                              {
                                backgroundColor: isSpeaking ? '#2563EB' : theme.card,
                                borderColor: isSpeaking ? '#2563EB' : theme.border,
                              },
                            ]}
                          >
                            <Ionicons
                              name={isSpeaking ? 'volume-high' : 'volume-medium-outline'}
                              size={17}
                              color={isSpeaking ? '#FFFFFF' : theme.primary}
                            />
                            <Text
                              style={[
                                styles.speakerBtnText,
                                { color: isSpeaking ? '#FFFFFF' : theme.primary },
                              ]}
                            >
                              {isSpeaking ? 'Playing' : 'Speak'}
                            </Text>
                          </TouchableOpacity>

                          {/* Copy Button */}
                          <TouchableOpacity
                            onPress={() => handleCopy(item.translatedText, item.languageId)}
                            style={[
                              styles.copyIconBtn,
                              {
                                backgroundColor: isCopied ? '#DCFCE7' : theme.card,
                                borderColor: isCopied ? '#16A34A' : theme.border,
                              },
                            ]}
                          >
                            <Ionicons
                              name={isCopied ? 'checkmark' : 'copy-outline'}
                              size={15}
                              color={isCopied ? '#16A34A' : theme.textSecondary}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Native Translated Script */}
                      <Text style={[styles.translatedScriptText, { color: theme.text }]}>
                        {item.translatedText}
                      </Text>

                      {/* Phonetic Pronunciation Guide */}
                      {item.phonetic && (
                        <View style={styles.phoneticRow}>
                          <Ionicons name="chatbubble-ellipses-outline" size={13} color={theme.textMuted} />
                          <Text style={[styles.phoneticText, { color: theme.textSecondary }]}>
                            {item.phonetic}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.88,
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalHeaderTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalHeaderIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  modalSubtitle: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  scrollArea: {
    padding: 16,
  },
  recorderCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 14,
  },
  recorderTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  recorderDesc: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  micButtonContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  micGlowRing: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 39,
  },
  micMainBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  recordingStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recordingStatusText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  inputSection: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12.5,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  textInputField: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: 'Manrope_500Medium',
    paddingVertical: 4,
  },
  translateBtnSmall: {
    backgroundColor: '#2563EB',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetsSection: {
    marginBottom: 16,
  },
  presetsTitle: {
    fontSize: 11.5,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  presetsScroll: {
    gap: 8,
    paddingBottom: 2,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  resultsSection: {
    marginBottom: 30,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultsHeaderTitle: {
    fontSize: 13.5,
    fontFamily: 'Manrope_700Bold',
  },
  resultsTimestamp: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_500Medium',
  },
  langCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  langCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  langNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langFlag: {
    fontSize: 16,
  },
  langNameText: {
    fontSize: 13.5,
    fontFamily: 'Manrope_700Bold',
  },
  langNativeBadge: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
  langActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  speakerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  speakerBtnText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  copyIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  translatedScriptText: {
    fontSize: 15.5,
    fontFamily: 'Manrope_700Bold',
    lineHeight: 22,
    marginBottom: 6,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  phoneticText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
    fontStyle: 'italic',
  },
});
