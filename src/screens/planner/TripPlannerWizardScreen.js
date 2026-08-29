import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTrips } from '../../context/TripContext';
import { destinations } from '../../data/destinations';
import { Button } from '../../components/Button';
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

// Quick Budget Options requested by user
const quickBudgetOptions = [
  { amount: 5000, label: '₹5,000', tag: 'Backpacker' },
  { amount: 10000, label: '₹10,000', tag: 'Standard' },
  { amount: 15000, label: '₹15,000', tag: 'Recommended' },
  { amount: 25000, label: '₹25,000', tag: 'Comfort' },
  { amount: 50000, label: '₹50,000', tag: 'Luxury' },
];

export const TripPlannerWizardScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { createTrip } = useTrips();

  const initialDest = route?.params?.initialDestination || destinations[0];
  const startAtBudget = route?.params?.startAtBudget || false;

  const [step, setStep] = useState(startAtBudget ? 2 : 1);
  const [selectedDestination, setSelectedDestination] = useState(initialDest);
  const [budget, setBudget] = useState(initialDest.estimatedCost || 15000);
  const [customBudgetInput, setCustomBudgetInput] = useState(
    (initialDest.estimatedCost || 15000).toString()
  );
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [selectedInterests, setSelectedInterests] = useState(['Nature', 'History', 'Beaches']);
  const [selectedPreference, setSelectedPreference] = useState('Comfortable');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (route?.params?.initialDestination) {
      setSelectedDestination(route.params.initialDestination);
      const est = route.params.initialDestination.estimatedCost || 15000;
      setBudget(est);
      setCustomBudgetInput(est.toString());
      if (route.params.startAtBudget) {
        setStep(2);
      }
    }
  }, [route?.params]);

  const toggleInterest = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interestId));
      }
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleCustomBudgetChange = (text) => {
    // Only allow digits
    const cleaned = text.replace(/[^0-9]/g, '');
    setCustomBudgetInput(cleaned);
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num > 0) {
      setBudget(num);
    }
  };

  const handleQuickBudgetSelect = (amount) => {
    setBudget(amount);
    setCustomBudgetInput(amount.toString());
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
        {/* Step 1: Destination Selection */}
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
                    onPress={() => {
                      setSelectedDestination(dest);
                      const est = dest.estimatedCost || 15000;
                      setBudget(est);
                      setCustomBudgetInput(est.toString());
                    }}
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

        {/* Step 2: Budget Selection (Placed right after selecting trip place) */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { color: theme.text }]}>
              What is your budget for {selectedDestination.name}?
            </Text>
            <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
              Total target budget for lodging, travel, activities, and local food.
            </Text>

            {/* Target Budget Display Card */}
            <View
              style={[
                styles.budgetDisplayCard,
                { backgroundColor: theme.primaryLight, borderColor: theme.primary },
              ]}
            >
              <Text style={[styles.budgetLabel, { color: theme.primaryDark }]}>
                Selected Trip Budget
              </Text>
              <Text style={[styles.budgetValue, { color: theme.primaryDark }]}>
                {formatCurrency(budget)}
              </Text>
              <View style={styles.budgetPerPersonRow}>
                <Ionicons name="people-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.budgetPerPerson, { color: theme.textSecondary }]}>
                  ≈ {formatCurrency(Math.round(budget / travelers))} per traveler ({travelers} travelers)
                </Text>
              </View>
            </View>

            {/* Custom Budget Input in ₹ */}
            <View style={styles.customInputSection}>
              <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
                Custom Budget Input (in ₹)
              </Text>
              <View
                style={[
                  styles.customInputWrap,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={[styles.rupeeSymbolBox, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.rupeeSymbol, { color: theme.primaryDark }]}>₹</Text>
                </View>
                <TextInput
                  value={customBudgetInput}
                  onChangeText={handleCustomBudgetChange}
                  keyboardType="numeric"
                  placeholder="Enter amount in ₹ (e.g. 15000)"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.customTextInput, { color: theme.text }]}
                />
                {customBudgetInput.length > 0 && (
                  <TouchableOpacity onPress={() => handleCustomBudgetChange('')}>
                    <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Quick Options Requested: ₹5,000, ₹10,000, ₹15,000, ₹25,000, ₹50,000 */}
            <View style={styles.quickOptionsSection}>
              <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
                Quick Budget Options
              </Text>
              <View style={styles.quickOptionsGrid}>
                {quickBudgetOptions.map((opt) => {
                  const isSelected = budget === opt.amount;
                  return (
                    <TouchableOpacity
                      key={opt.amount}
                      onPress={() => handleQuickBudgetSelect(opt.amount)}
                      style={[
                        styles.quickOptionCard,
                        {
                          backgroundColor: isSelected ? theme.primary : theme.card,
                          borderColor: isSelected ? theme.primary : theme.border,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.quickOptionAmount,
                          { color: isSelected ? '#FFFFFF' : theme.text },
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text
                        style={[
                          styles.quickOptionTag,
                          { color: isSelected ? 'rgba(255,255,255,0.85)' : theme.textSecondary },
                        ]}
                      >
                        {opt.tag}
                      </Text>
                      {isSelected && (
                        <View style={styles.quickOptionCheck}>
                          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Destination Budget Context Info */}
            <View style={[styles.infoBanner, { backgroundColor: theme.cardSecondary }]}>
              <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Average recommended budget for {selectedDestination.name} is{' '}
                <Text style={{ fontWeight: '700', color: theme.text }}>
                  {formatCurrency(selectedDestination.estimatedCost || 15000)}
                </Text>
                .
              </Text>
            </View>
          </View>
        )}

        {/* Step 3: Number of Days */}
        {step === 3 && (
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
                Selected:{' '}
                <Text style={{ fontWeight: '700', color: theme.text }}>{days} Days Itinerary</Text> for{' '}
                {selectedDestination.name}.
              </Text>
            </View>
          </View>
        )}

        {/* Step 4: Number of Travelers */}
        {step === 4 && (
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
                    <View
                      style={[
                        styles.prefIcon,
                        { backgroundColor: isSelected ? theme.primary : theme.cardSecondary },
                      ]}
                    >
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

      {/* Bottom Sticky Continue Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <Button
          title={step === 6 ? 'Generate AI Itinerary' : 'Continue'}
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
    paddingBottom: 20,
  },
  stepHeading: {
    fontSize: 19,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 6,
  },
  stepSub: {
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 19,
    marginBottom: 18,
  },
  sectionSubtitle: {
    fontSize: 13.5,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 8,
  },

  // Step 1: Destination Grid
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
    padding: 10,
  },
  destName: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  destState: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },

  // Step 2: Budget
  budgetDisplayCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetLabel: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 32,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: -0.5,
  },
  budgetPerPersonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  budgetPerPerson: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
  customInputSection: {
    marginBottom: 20,
  },
  customInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 50,
  },
  rupeeSymbolBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rupeeSymbol: {
    fontSize: 16,
    fontFamily: 'Manrope_800ExtraBold',
  },
  customTextInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    height: '100%',
  },
  quickOptionsSection: {
    marginBottom: 16,
  },
  quickOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickOptionCard: {
    width: '31%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    position: 'relative',
  },
  quickOptionAmount: {
    fontSize: 13.5,
    fontFamily: 'Manrope_700Bold',
  },
  quickOptionTag: {
    fontSize: 10,
    fontFamily: 'Manrope_500Medium',
    marginTop: 3,
  },
  quickOptionCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
  },

  // Step 3: Days
  daysSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  dayPill: {
    width: '30%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
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

  // Step 4: Travelers
  travelerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  travelerCard: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  travelerCount: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },

  // Step 5: Interests
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  interestLabel: {
    fontSize: 12.5,
    fontFamily: 'Manrope_600SemiBold',
  },

  // Step 6: Travel Preferences
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
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefLabel: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 2,
  },
  prefDesc: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 16,
  },

  // Banners & Bottom Bar
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    flex: 1,
    lineHeight: 17,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  fullBtn: {
    width: '100%',
  },
});
