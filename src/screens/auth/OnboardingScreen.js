import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'AI-Powered Smart Travel Planning',
    subtitle: 'Generate tailored day-by-day itineraries, optimize travel budgets, and discover verified spots across India.',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    icon: 'sparkles',
  },
  {
    id: '2',
    title: 'Support Local Businesses & Hidden Gems',
    subtitle: 'Directly connect with indigenous tribal artisans, homestay hosts, and explore peaceful offbeat destinations.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    icon: 'storefront',
  },
  {
    id: '3',
    title: 'Sustainable & Safe Tourism',
    subtitle: 'Real-time crowd monitoring, adaptive rainy day rescheduling, eco-score tracking, and instant SOS emergency protection.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    icon: 'shield-checkmark',
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
          <Ionicons name="compass" size={24} color={theme.primary} />
          <Text style={[styles.logoText, { color: theme.text }]}>SmartTour</Text>
        </View>
        <TouchableOpacity onPress={loginAsGuest} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip to Demo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slideContainer}>
        <Image source={{ uri: slide.image }} style={styles.image} />
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name={slide.icon} size={28} color={theme.primary} />
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

          <View style={styles.authRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.authLink, { color: theme.textSecondary }]}>
                Already have an account? <Text style={{ color: theme.primary, fontWeight: '700' }}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
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
    gap: 6,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
  },
  skipBtn: {
    padding: 6,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  slideContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    justifyContent: 'flex-end',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '65%',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 18,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  primaryBtn: {
    width: '100%',
    marginBottom: 14,
  },
  authRow: {
    alignItems: 'center',
  },
  authLink: {
    fontSize: 13,
  },
});
