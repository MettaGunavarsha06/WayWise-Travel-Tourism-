import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Sustainable Tourism & Travel Planning',
    subtitle: 'Curated day-by-day itineraries, balanced travel budgets, and verified cultural destinations across India.',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    icon: 'map-outline',
  },
  {
    id: '2',
    title: 'Support Local Artisans & Hidden Gems',
    subtitle: 'Connect directly with certified community craft guilds, homestay hosts, and explore peaceful offbeat destinations.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    icon: 'storefront-outline',
  },
  {
    id: '3',
    title: 'Live Safety & Adaptive Travel',
    subtitle: 'Real-time crowd monitoring, adaptive weather rescheduling, eco-score tracking, and instant safety assistance.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    icon: 'shield-checkmark-outline',
  },
];

export const OnboardingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { loginAsGuest } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const slide = slides[currentSlide];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topNav}>
        <View style={styles.logoRow}>
          <Ionicons name="leaf" size={22} color={theme.primary} />
          <Text style={[styles.logoText, { color: theme.text }]}>WayWise</Text>
        </View>
        <TouchableOpacity onPress={loginAsGuest} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip to App</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slideContainer}>
        <Image source={{ uri: slide.image }} style={styles.image} resizeMode="cover" />
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name={slide.icon} size={26} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{slide.title}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{slide.subtitle}</Text>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === currentSlide ? theme.primary : theme.border,
                    width: index === currentSlide ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          <Button
            title={currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
            variant="primary"
            size="large"
            iconRight="arrow-forward"
            onPress={handleNext}
            style={styles.primaryBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 18,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: -0.3,
  },
  skipBtn: {
    padding: 6,
  },
  skipText: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
  },
  slideContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: '42%',
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  primaryBtn: {
    width: '100%',
  },
});
