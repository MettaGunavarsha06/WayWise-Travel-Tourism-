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
  'Handicrafts',
  'Local Guides',
  'Restaurants',
  'Homestays',
  'Adventure',
  'Cultural Experiences',
  'Taxi Services',
  'Small Hotels',
];

export const RegisterBusinessScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { registerBusiness } = useBusinesses();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Handicrafts');
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [priceRange, setPriceRange] = useState('₹300 - ₹1,500');
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
      'Business Registered! 🎉',
      `"${name}" has been successfully added to the SmartTour Local Business Marketplace and Tourism Authority Directory.`,
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
            Join the SIH 2026 Integrated Tourism Network. Verified listings connect directly with thousands of traveling tourists.
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
                      styles.catText,
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
            label="Location / Area *"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Etikoppaka Village, Vizag Region"
            icon="location-outline"
          />

          <Input
            label="Contact Person / Owner"
            value={contactPerson}
            onChangeText={setContactPerson}
            placeholder="e.g. K. Someswara Rao"
            icon="person-outline"
          />

          <Input
            label="Phone Number / WhatsApp *"
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. +91 98480 11223"
            icon="call-outline"
            keyboardType="phone-pad"
          />

          <Input
            label="Price Range / Fee Structure"
            value={priceRange}
            onChangeText={setPriceRange}
            placeholder="e.g. ₹200 - ₹1,200 per item / session"
            icon="cash-outline"
          />

          <Input
            label="Business Description & Story"
            value={description}
            onChangeText={setDescription}
            placeholder="Tell tourists about your craft, organic meals, or guided tours..."
            multiline
            numberOfLines={4}
          />

          <Button
            title="Submit Business Listing"
            variant="primary"
            size="large"
            loading={submitting}
            icon="checkmark-circle-outline"
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  catScroll: {
    gap: 8,
    marginBottom: 16,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  catText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 10,
  },
});
