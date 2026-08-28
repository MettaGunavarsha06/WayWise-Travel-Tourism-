import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Hidden Gems &amp; Offbeat Spots</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Mission Statement Banner */}
        <View style={[styles.missionCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
          <Ionicons name="compass" size={22} color="#166534" style={{ marginRight: 10, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.missionTitle, { color: '#166534' }]}>
              Balanced Tourism &amp; Cultural Discovery
            </Text>
            <Text style={[styles.missionDesc, { color: '#15803D' }]}>
              By exploring these peaceful, lesser-known destinations, you help distribute tourism benefits directly to local communities while enjoying unhurried travel.
            </Text>
          </View>
        </View>

        {/* Crowd Density Legend */}
        <View style={[styles.legendCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.legendTitle, { color: theme.text }]}>Live Crowd Density Indicators</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Low (&lt;40%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Moderate (40-75%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>High (&gt;75%)</Text>
            </View>
          </View>
        </View>

        {/* Hidden Gems List */}
        <View style={styles.listHeadingRow}>
          <Text style={[styles.listHeading, { color: theme.text }]}>
            Curated Offbeat Destinations ({hiddenGems.length})
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
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
  },
  scrollContent: {
    padding: 16,
  },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  missionTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 4,
  },
  missionDesc: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
  },
  legendCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 18,
  },
  legendTitle: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
  },
  listHeadingRow: {
    marginBottom: 12,
  },
  listHeading: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
});
