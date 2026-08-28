import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTrips } from '../../context/TripContext';
import { destinations } from '../../data/destinations';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { formatCurrency } from '../../utils/helpers';

const interestOptions = [
  { id: 'Nature', label: 'Nature & Hills', icon: 'leaf' },
  { id: 'History', label: 'History & Forts', icon: 'shield' },
  { id: 'Adventure', label: 'Adventure Treks', icon: 'compass' },
  { id: 'Beaches', label: 'Beaches & Ocean', icon: 'water' },
  { id: 'Food', label: 'Local Food & Culinary', icon: 'restaurant' },
  { id: 'Shopping', label: 'Artisans & Shopping', icon: 'bag-handle' },
  { id: 'Culture', label: 'Tribal & Culture', icon: 'people' },
  { id: 'Spiritual', label: 'Spiritual Temples', icon: 'star' },
  { id: 'Photography', label: 'Scenic Photography', icon: 'camera' },
  { id: 'Wildlife', label: 'Wildlife & Caves', icon: 'globe' },
];

const travelPreferences = [
  { id: 'Comfortable', label: 'Comfortable', desc: 'Balanced AC travel & scenic stays', icon: 'happy' },
  { id: 'Eco-friendly', label: 'Eco-friendly 🌱', desc: 'Electric rail, solar stays & zero plastic', icon: 'leaf' },
  { id: 'Cheapest', label: 'Cheapest', desc: 'Budget community stays & bus transit', icon: 'wallet' },
  { id: 'Fastest', label: 'Fastest', desc: 'Point-to-point express transit', icon: 'flash' },
];

const budgetPresets = [8000, 12000, 15000, 20000, 30000];

export const TripPlannerWizardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { createTrip } = useTrips();

  const [step, setStep] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(15000);
  const [selectedInterests, setSelectedInterests] = useState(['Nature', 'History', 'Beaches']);
  const [selectedPreference, setSelectedPreference] = useState('Comfortable');
  const [generating, setGenerating] = useState(false);

  const toggleInterest = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interestId));
      }
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Final step: generate AI itinerary
      setGenerating(true);
      setTimeout(() => {
        setGenerating(false);
        const newTrip = createTrip({
          destinationId: selectedDestination.id,
          destinationName: selectedDestination.name,
          days,
          travelers,
          totalBudget: budget,
          interests: selectedInterests,
          travelPreference: selectedPreference,
        });
        navigation.navigate('ItineraryDetail', { trip: newTrip });
      }, 700);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Wizard Header */}
      <View style={[styles.wizardHeader, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.wizardTitle, { color: theme.text }]}>AI Smart Trip Planner</Text>
          <Text style={[styles.stepIndicator, { color: theme.primary }]}>Step {step} of 6</Text>
        </View>
        <View style={{ width: 30 }} />
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${(step / 6) * 100}%`, backgroundColor: theme.primary },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 1: Destination */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { color: theme.text }]}>Where do you want to explore?</Text>
            <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
              Choose from prime Indian destinations and protected eco-reserves.
            </Text>

            <View style={styles.destGrid}>
              {destinations.map((dest) => {
                const isSelected = selectedDestination.id === dest.id;
                return (
                  <TouchableOpacity
                    key={dest.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDestination(dest)}
                    style={[
                      styles.destCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: isSelected ? theme.primary : theme.border,
                        borderWidth: isSelected ? 2.5 : 1,
                      },
                    ]}
                  >
                    <Image source={{ uri: dest.image }} style={styles.destImg} />
                    {isSelected && (
                      <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      </View>
                    )}
                    <View style={styles.destTextWrap}>
                      <Text style={[styles.destName, { color: theme.text }]} numberOfLines={1}>
                        {dest.name}
                      </Text>
                      <Text style={[styles.destState, { color: theme.textSecondary }]}>
                        {dest.state}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 2: Number of Days */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { color: theme.text }]}>How many days are you traveling?</Text>
            <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
              We will craft an optimized day-by-day itinerary timeline.
            </Text>

            <View style={styles.daysSelector}>
              {[2, 3, 4, 5, 6, 7].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => setDays(num)}
                  style={[
                    styles.dayPill,
                    {
                      backgroundColor: days === num ? theme.primary : theme.card,
                      borderColor: days === num ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNum,
                      { color: days === num ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {num}
                  </Text>
                  <Text
                    style={[
                      styles.dayLabel,
                      { color: days === num ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    Days
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.infoBanner, { backgroundColor: theme.cardSecondary }]}>
              <Ionicons name="time-outline" size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Selected: <Text style={{ fontWeight: '700', color: theme.text }}>{days} Days Itinerary</Text> for {selectedDestination.name}.
              </Text>
            </View>
          </View>
        )}

        {/* Step 3: Number of Travelers */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { color: theme.text }]}>How many travelers are in your group?</Text>
            <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
              Hotel rooms and transport fare will scale automatically.
            </Text>

            <View style={styles.travelerRow}>
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <TouchableOpacity
                  key={count}
                  onPress={() => setTravelers(count)}
                  style={[
                    styles.travelerCard,
                    {
                      backgroundColor: travelers === count ? theme.primary : theme.card,
                      borderColor: travelers === count ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={count === 1 ? 'person' : count === 2 ? 'people' : 'people-sharp'}
                    size={24}
                    color={travelers === count ? '#FFFFFF' : theme.primary}
                  />
                  <Text
                    style={[
                      styles.travelerCount,
                      { color: travelers === count ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {count} {count === 1 ? 'Solo' : 'Persons'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Budget */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { color: theme.text }]}>What is your total trip budget?</Text>
            <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
              AI will distribute funds across hotel, transport, meals, and crafts.
            </Text>

            <View style={[styles.budgetDisplayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.budgetDisplayLabel, { color: theme.textSecondary }]}>Total Planned Budget</Text>
              <Text style={[styles.budgetDisplayValue, { color: theme.primary }]}>
                {formatCurrency(budget)}
              </Text>
            </View>

            <Text style={[styles.presetTitle, { color: theme.textSecondary }]}>Quick Budget Presets:</Text>
            <View style={styles.presetRow}>
              {budgetPresets.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  onPress={() => setBudget(preset)}
                  style={[
                    styles.presetPill,
                    {
                      backgroundColor: budget === preset ? theme.primary : theme.cardSecondary,
                      borderColor: budget === preset ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      { color: budget === preset ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {formatCurrency(preset)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 5: Interests */}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { color: theme.text }]}>Select your travel interests</Text>
            <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
              Choose multiple interests to personalize your attraction queue.
            </Text>

            <View style={styles.interestGrid}>
              {interestOptions.map((item) => {
                const isSelected = selectedInterests.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => toggleInterest(item.id)}
                    style={[
                      styles.interestCard,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : theme.card,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={isSelected ? theme.primaryDark : theme.text}
                    />
                    <Text
                      style={[
                        styles.interestLabel,
                        { color: isSelected ? theme.primaryDark : theme.text },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 6: Travel Preference */}
        {step === 6 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { color: theme.text }]}>How do you prefer to travel?</Text>
            <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
              We will match the best transport modes and accommodations.
            </Text>

            <View style={styles.prefList}>
              {travelPreferences.map((pref) => {
                const isSelected = selectedPreference === pref.id;
                return (
                  <TouchableOpacity
                    key={pref.id}
                    onPress={() => setSelectedPreference(pref.id)}
                    style={[
                      styles.prefCard,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : theme.card,
                        borderColor: isSelected ? theme.primary : theme.border,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.prefIcon, { backgroundColor: isSelected ? theme.primary : theme.cardSecondary }]}>
                      <Ionicons
                        name={pref.icon}
                        size={20}
                        color={isSelected ? '#FFFFFF' : theme.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.prefLabel,
                          { color: isSelected ? theme.primaryDark : theme.text },
                        ]}
                      >
                        {pref.label}
                      </Text>
                      <Text style={[styles.prefDesc, { color: theme.textSecondary }]}>
                        {pref.desc}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Bottom Sticky Next Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <Button
          title={step === 6 ? '✨ Generate Smart AI Itinerary' : 'Continue'}
          variant="primary"
          size="large"
          loading={generating}
          iconRight={step === 6 ? 'sparkles' : 'arrow-forward'}
          onPress={handleNext}
          style={styles.fullBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wizardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  wizardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepIndicator: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  progressBarBg: {
    height: 4,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
  },
  scrollContent: {
    padding: 16,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepHeading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  stepSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  destGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  destCard: {
    width: '48%',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  destImg: {
    width: '100%',
    height: 100,
  },
  checkCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destTextWrap: {
    padding: 8,
  },
  destName: {
    fontSize: 13,
    fontWeight: '700',
  },
  destState: {
    fontSize: 11,
    marginTop: 1,
  },
  daysSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  dayPill: {
    width: '30%',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontSize: 22,
    fontWeight: '800',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
  travelerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  travelerCard: {
    width: '48%',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  travelerCount: {
    fontSize: 14,
    fontWeight: '700',
  },
  budgetDisplayCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetDisplayLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  budgetDisplayValue: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 6,
  },
  presetTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '700',
  },
  interestGrid: {
    gap: 10,
  },
  interestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  interestLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  prefList: {
    gap: 12,
  },
  prefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  prefIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  prefDesc: {
    fontSize: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  fullBtn: {
    width: '100%',
  },
});
