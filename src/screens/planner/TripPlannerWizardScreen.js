import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTrips } from '../../context/TripContext';
import { destinations } from '../../data/destinations';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { formatCurrency } from '../../utils/helpers';

const interestOptions = [
  { id: 'Nature', label: 'Nature & Hills', icon: 'leaf-outline' },
  { id: 'History', label: 'History & Forts', icon: 'shield-outline' },
  { id: 'Adventure', label: 'Adventure Treks', icon: 'compass-outline' },
  { id: 'Beaches', label: 'Beaches & Ocean', icon: 'water-outline' },
  { id: 'Food', label: 'Local Food & Culinary', icon: 'restaurant-outline' },
  { id: 'Shopping', label: 'Artisans & Shopping', icon: 'bag-handle-outline' },
  { id: 'Culture', label: 'Heritage & Culture', icon: 'people-outline' },
  { id: 'Spiritual', label: 'Spiritual Temples', icon: 'star-outline' },
  { id: 'Photography', label: 'Scenic Photography', icon: 'camera-outline' },
  { id: 'Wildlife', label: 'Wildlife & Caves', icon: 'globe-outline' },
];

const travelPreferences = [
  { id: 'Comfortable', label: 'Comfortable', desc: 'Balanced AC travel & scenic stays', icon: 'happy-outline' },
  { id: 'Eco-friendly', label: 'Eco-friendly', desc: 'Electric rail, solar stays & zero plastic', icon: 'leaf-outline' },
  { id: 'Cheapest', label: 'Budget-Friendly', desc: 'Community stays & public transit', icon: 'wallet-outline' },
  { id: 'Fastest', label: 'Express Transit', desc: 'Point-to-point express routes', icon: 'flash-outline' },
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
      }, 600);
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
          <Text style={[styles.wizardTitle, { color: theme.text }]}>Trip Planner</Text>
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
              Choose from prime destinations and certified eco-reserves across India.
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
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                  >
                    <Image source={{ uri: dest.image }} style={styles.destImg} resizeMode="cover" />
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
            <Text style={[styles.stepHeading, { color: theme.text }]}>How many travelers in your group?</Text>
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
                    name={count === 1 ? 'person-outline' : 'people-outline'}
                    size={22}
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
            <Text style={[styles.stepHeading, { color: theme.text }]}>What is your target budget?</Text>
            <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
              Total budget for lodging, travel, activities, and dining.
            </Text>

            <View style={[styles.budgetDisplayCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
              <Text style={[styles.budgetLabel, { color: theme.primaryDark }]}>Target Budget</Text>
              <Text style={[styles.budgetValue, { color: theme.primaryDark }]}>
                {formatCurrency(budget)}
              </Text>
              <Text style={[styles.budgetPerPerson, { color: theme.textSecondary }]}>
                ≈ {formatCurrency(Math.round(budget / travelers))} per traveler
              </Text>
            </View>

            <Text style={[styles.subHeading, { color: theme.text }]}>Quick Select</Text>
            <View style={styles.presetsRow}>
              {budgetPresets.map((val) => (
                <TouchableOpacity
                  key={val}
                  onPress={() => setBudget(val)}
                  style={[
                    styles.presetPill,
                    {
                      backgroundColor: budget === val ? theme.primary : theme.card,
                      borderColor: budget === val ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      { color: budget === val ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {formatCurrency(val)}
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
          title={step === 6 ? 'Generate Itinerary' : 'Continue'}
          variant="primary"
          size="large"
          loading={generating}
          iconRight="arrow-forward"
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
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  wizardTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  stepIndicator: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
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
    paddingBottom: 10,
  },
  stepHeading: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  stepSub: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
    marginBottom: 16,
  },
  destGrid: {
    gap: 12,
  },
  destCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 10,
    gap: 12,
  },
  destImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  destTextWrap: {
    flex: 1,
  },
  destName: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
  destState: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  dayPill: {
    width: '30%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dayNum: {
    fontSize: 22,
    fontFamily: 'Manrope_800ExtraBold',
  },
  dayLabel: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
    marginTop: 2,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
  },
  travelerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  travelerCard: {
    width: '30%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  travelerCount: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  budgetDisplayCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetLabel: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  budgetValue: {
    fontSize: 32,
    fontFamily: 'Manrope_800ExtraBold',
    marginVertical: 4,
  },
  budgetPerPerson: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
  },
  subHeading: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 10,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  interestLabel: {
    fontSize: 12.5,
    fontFamily: 'Manrope_600SemiBold',
    flex: 1,
  },
  prefList: {
    gap: 12,
  },
  prefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
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
    fontFamily: 'Manrope_700Bold',
  },
  prefDesc: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
  },
  fullBtn: {
    width: '100%',
  },
});
