import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { transportModes } from '../../data/transport';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../utils/helpers';

const filters = [
  { id: 'all', label: 'All Modes' },
  { id: 'cheapest', label: '💸 Cheapest' },
  { id: 'fastest', label: '⚡ Fastest' },
  { id: 'comfortable', label: '🛋️ Comfortable' },
  { id: 'eco', label: '🌱 Eco-friendly' },
];

export const TransportScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredModes = transportModes.filter((m) => {
    if (selectedFilter === 'cheapest') return m.isCheapest;
    if (selectedFilter === 'fastest') return m.isFastest;
    if (selectedFilter === 'comfortable') return m.isComfortable;
    if (selectedFilter === 'eco') return m.isEcoFriendly;
    return true;
  });

  const handleSelect = (mode) => {
    Alert.alert(
      'Transport Selected 🚆',
      `"${mode.name}" set as your preferred transit mode.\nCost: ${formatCurrency(mode.cost)} | Time: ${mode.time} | Eco: ${mode.ecoScore}/100`,
      [{ text: 'Great!', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Multi-Modal Transport Planner</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Comparison Summary Table Card */}
        <View style={[styles.tableCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.tableTitle, { color: theme.text }]}>⚡ Multi-Modal Comparison Matrix</Text>

          <View style={[styles.tableHeader, { backgroundColor: theme.cardSecondary }]}>
            <Text style={[styles.th, { flex: 1.2, color: theme.textSecondary }]}>Transport</Text>
            <Text style={[styles.th, { flex: 0.8, color: theme.textSecondary }]}>Time</Text>
            <Text style={[styles.th, { flex: 0.8, color: theme.textSecondary }]}>Cost</Text>
            <Text style={[styles.th, { flex: 0.8, color: theme.textSecondary }]}>Eco</Text>
          </View>

          {transportModes.slice(0, 5).map((t, idx) => (
            <View
              key={t.id}
              style={[
                styles.tableRow,
                { borderBottomColor: theme.border },
                idx === 0 && { backgroundColor: theme.primaryLight + '40' },
              ]}
            >
              <Text style={[styles.td, { flex: 1.2, fontWeight: '700', color: theme.text }]} numberOfLines={1}>
                {t.name.split(' ')[0]}
              </Text>
              <Text style={[styles.td, { flex: 0.8, color: theme.textSecondary }]}>{t.time}</Text>
              <Text style={[styles.td, { flex: 0.8, color: theme.primary, fontWeight: '700' }]}>
                {formatCurrency(t.cost)}
              </Text>
              <View style={{ flex: 0.8 }}>
                <EcoScoreBadge score={t.ecoScore} size="small" showLabel={false} />
              </View>
            </View>
          ))}
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((f) => {
            const isSelected = selectedFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setSelectedFilter(f.id)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Transport Mode Cards */}
        <View style={styles.cardsList}>
          {filteredModes.map((mode) => (
            <View
              key={mode.id}
              style={[
                styles.modeCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  shadowColor: theme.shadow,
                },
              ]}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
                  <Ionicons name={mode.icon} size={24} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modeName, { color: theme.text }]}>{mode.name}</Text>
                  <Text style={[styles.modeDesc, { color: theme.textSecondary }]}>{mode.description}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>TRAVEL TIME</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>{mode.time}</Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>TICKET FARE</Text>
                  <Text style={[styles.statValue, { color: theme.primary, fontWeight: '800' }]}>
                    {formatCurrency(mode.cost)}
                  </Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>CARBON</Text>
                  <Text style={[styles.statValue, { color: theme.textSecondary }]}>
                    {mode.carbonFootprintKg} kg CO₂
                  </Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>SUSTAINABILITY</Text>
                  <EcoScoreBadge score={mode.ecoScore} size="small" showLabel={false} />
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.cardBottomRow}>
                <Text style={[styles.freqText, { color: theme.textMuted }]}>
                  🕒 Frequency: {mode.frequency}
                </Text>
                <Button
                  title="Choose Mode"
                  variant="primary"
                  size="small"
                  onPress={() => handleSelect(mode)}
                  style={styles.chooseBtn}
                />
              </View>
            </View>
          ))}
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
  tableCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  th: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  td: {
    fontSize: 12,
  },
  filterRow: {
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardsList: {
    gap: 14,
  },
  modeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  modeDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freqText: {
    fontSize: 11,
  },
  chooseBtn: {
    minWidth: 110,
  },
});
