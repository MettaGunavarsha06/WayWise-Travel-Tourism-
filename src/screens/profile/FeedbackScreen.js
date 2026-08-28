import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const categories = ['Hotel', 'Destination', 'Transport', 'Restaurant', 'Local Guide'];
const feedbackTags = ['Eco-friendly 🌱', 'Clean Facilities 🧹', 'Helpful Guide 🧭', 'Punctual ⏱️', 'Authentic Food 🍲'];

export const FeedbackScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [category, setCategory] = useState('Hotel');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Eco-friendly 🌱']);
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true);
    Alert.alert(
      'Feedback Received! ⭐',
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
            Your ratings directly influence hotel quality certifications and local guide accreditations.
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
                  size={36}
                  color="#F59E0B"
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.ratingLabel, { color: theme.textSecondary }]}>
            {rating === 5
              ? '⭐⭐⭐⭐⭐ Exceptional Quality'
              : rating === 4
              ? '⭐⭐⭐⭐ Very Good'
              : rating === 3
              ? '⭐⭐⭐ Average'
              : 'Needs Improvement'}
          </Text>

          {/* Experience Tags */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Highlights & Attributes</Text>
          <View style={styles.tagsGrid}>
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
                      styles.tagText,
                      { color: isSelected ? theme.primaryDark : theme.text },
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Review Text */}
          <Input
            label="Detailed Comments & Suggestions"
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder="Share details about cleanliness, staff hospitality, punctuality or eco-efforts..."
            multiline
            numberOfLines={4}
            style={{ marginTop: 14 }}
          />

          <Button
            title="Submit Tourist Review"
            variant="primary"
            size="large"
            icon="send-outline"
            onPress={handleSubmit}
            style={styles.submitBtn}
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
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 6,
  },
  starBtn: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 16,
  },
});
