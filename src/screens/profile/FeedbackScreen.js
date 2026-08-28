import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const categories = ['Hotel', 'Destination', 'Transport', 'Restaurant', 'Local Guide'];
const feedbackTags = [
  'Eco-Friendly',
  'Clean Facilities',
  'Helpful Guide',
  'Punctual Service',
  'Authentic Cuisine',
  'Fair Pricing',
];

export const FeedbackScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [category, setCategory] = useState('Hotel');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Eco-Friendly']);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Feedback Required', 'Please provide a brief comment on your experience.');
      return;
    }
    Alert.alert(
      'Feedback Submitted',
      'Thank you for your valuable feedback. It has been routed to the Tourism Authority Quality Dashboard and helps improve ecosystem rankings.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Tourist Feedback System</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Rate Your Tourism Experience</Text>
          <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
            Your ratings directly influence quality certifications and local guide accreditations.
          </Text>

          {/* Category Selector */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Service Category</Text>
          <View style={styles.catRow}>
            {categories.map((c) => {
              const isSelected = category === c;
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[
                    styles.catPill,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.cardSecondary,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      { color: isSelected ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 5-Star Rating Bar */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Overall Star Rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starBtn}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color={star <= rating ? '#F59E0B' : theme.border}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tags */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Experience Highlights</Text>
          <View style={styles.tagsRow}>
            {feedbackTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tagPill,
                    {
                      backgroundColor: isSelected ? theme.primaryLight : theme.cardSecondary,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagPillText,
                      { color: isSelected ? theme.primaryDark : theme.textSecondary },
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Comment Box */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Detailed Review</Text>
          <Input
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder="Describe your experience with cleanliness, hospitality, pricing..."
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Button
            title="Submit Feedback"
            variant="primary"
            size="large"
            icon="send-outline"
            onPress={handleSubmit}
            style={{ marginTop: 16 }}
          />
        </View>

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
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 10,
  },
  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  starBtn: {
    padding: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagPillText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
});
