import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { destinations } from '../../data/destinations';
import { DestinationCard } from '../../components/DestinationCard';

export const HiddenGemsScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const hiddenGems = destinations.filter((d) => d.isHiddenGem);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Hidden Gems of India</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Mission Statement Banner */}
        <View style={[styles.missionCard, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
          <Ionicons name="diamond" size={24} color="#7C3AED" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.missionTitle, { color: '#5B21B6' }]}>
              Anti-Overtourism & Cultural Discovery
            </Text>
            <Text style={[styles.missionDesc, { color: '#6D28D9' }]}>
              By exploring these lesser-known, peaceful destinations, you help distribute tourism benefits directly to indigenous communities while avoiding massive queues and high prices.
            </Text>
          </View>
        </View>

        {/* Crowd Flow Indicator Legend */}
        <View style={[styles.legendCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.legendTitle, { color: theme.text }]}>Real-Time Crowd Density Legend</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>🟢 Low (&lt;40%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>🟡 Moderate (40-75%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>🔴 High (&gt;75%)</Text>
            </View>
          </View>
        </View>

        {/* Hidden Gems List */}
        <View style={styles.listHeadingRow}>
          <Text style={[styles.listHeading, { color: theme.text }]}>
            Offbeat Curated Destinations ({hiddenGems.length})
          </Text>
        </View>

        {hiddenGems.map((gem) => (
          <DestinationCard
            key={gem.id}
            destination={gem}
            onPress={() => navigation.navigate('DestinationDetail', { destination: gem })}
          />
        ))}

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
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  missionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  missionDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  legendCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
  },
  listHeadingRow: {
    marginBottom: 12,
  },
  listHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
});
