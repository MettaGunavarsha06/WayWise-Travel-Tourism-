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
import { useBusinesses } from '../../context/BusinessContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const categoryOptions = [
  'Handicrafts & Artisans',
  'Eco-Friendly Homestays',
  'Organic Food & Dining',
  'Certified Local Guides',
  'Green Transport & EV',
];

const priceOptions = ['₹ (Affordable)', '₹₹ (Moderate)', '₹₹₹ (Premium)'];

export const RegisterBusinessScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { registerBusiness } = useBusinesses();

  const [name, setName] = useState('');
  const [category, setCategory] = useState(categoryOptions[0]);
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [priceRange, setPriceRange] = useState('₹₹ (Moderate)');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim() || !phone.trim()) {
      Alert.alert('Incomplete Form', 'Please enter business name, location, and contact phone number.');
      return;
    }

    setSubmitting(true);
    await registerBusiness({
      name,
      category,
      location,
      contactPerson,
      phone,
      priceRange,
      description,
    });
    setSubmitting(false);

    Alert.alert(
      'Business Registered',
      `"${name}" has been successfully added to the WayWise Local Business Marketplace and Tourism Authority Directory.`,
      [{ text: 'View Marketplace', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Register Your Business</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={[styles.infoBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
          <Ionicons name="shield-checkmark" size={22} color={theme.primaryDark} style={{ marginRight: 8 }} />
          <Text style={[styles.infoText, { color: theme.primaryDark }]}>
            Join the SIH 2026 Integrated Tourism Network. Verified listings connect directly with traveling tourists.
          </Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Input
            label="Business / Enterprise Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Coastal Wooden Toy Artisans"
            icon="storefront-outline"
          />

          {/* Category Selector */}
          <Text style={[styles.label, { color: theme.textSecondary }]}>Business Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {categoryOptions.map((cat) => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
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
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Input
            label="Operational Location / Address *"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Etikoppaka Village, Visakhapatnam"
            icon="location-outline"
          />

          <Input
            label="Contact Person Name"
            value={contactPerson}
            onChangeText={setContactPerson}
            placeholder="e.g. Master Artisan Ramana"
            icon="person-outline"
          />

          <Input
            label="Contact Phone / WhatsApp *"
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. +91 98480 12345"
            icon="call-outline"
            keyboardType="phone-pad"
          />

          {/* Price Range */}
          <Text style={[styles.label, { color: theme.textSecondary }]}>Typical Price Range</Text>
          <View style={styles.priceRow}>
            {priceOptions.map((p) => {
              const isSelected = priceRange === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriceRange(p)}
                  style={[
                    styles.pricePill,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.cardSecondary,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.priceText,
                      { color: isSelected ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Input
            label="Business Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your artisan heritage, eco practices, products..."
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          <Button
            title="Submit Registration"
            variant="primary"
            size="large"
            loading={submitting}
            icon="checkmark-circle-outline"
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_500Medium',
    lineHeight: 18,
    flex: 1,
  },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 6,
  },
  catScroll: {
    gap: 8,
    paddingBottom: 14,
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
  priceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  pricePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
