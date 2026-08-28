import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';

export const BusinessCard = ({ business, onContactPress, onAddToTripPress }) => {
  const { theme } = useTheme();

  const handleDefaultContact = () => {
    Alert.alert(
      `Contact ${business.name}`,
      `Lead Contact: ${business.contactPerson || 'Vendor Lead'}\nPhone: ${business.phone || '+91 98480 12345'}\nLocation: ${business.location}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Vendor (Simulated)', onPress: () => Alert.alert('Connected', `Dialing ${business.phone}...`) }
      ]
    );
  };

  const handleDefaultAdd = () => {
    Alert.alert('Added to Trip Itinerary', `"${business.name}" has been added to your local experiences!`);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: business.image }} style={styles.image} />
        <View style={[styles.categoryBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.categoryText}>{business.category}</Text>
        </View>
        {business.verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={13} color="#38BDF8" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {business.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: theme.text }]}>{business.rating}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={theme.textSecondary} />
          <Text style={[styles.locationText, { color: theme.textSecondary }]} numberOfLines={1}>
            {business.location}
          </Text>
        </View>

        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {business.description}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: theme.textMuted }]}>Price Range: </Text>
          <Text style={[styles.priceValue, { color: theme.primary }]}>
            {business.priceRange}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.actionRow}>
          <Button
            title="Contact"
            variant="outline"
            size="small"
            icon="call-outline"
            onPress={onContactPress || handleDefaultContact}
            style={{ flex: 1 }}
          />
          <Button
            title="Add to Trip"
            variant="primary"
            size="small"
            icon="add-circle-outline"
            onPress={onAddToTripPress || handleDefaultAdd}
            style={{ flex: 1.2 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 12,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
