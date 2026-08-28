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
import { transportModes } from '../../data/transport';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../utils/helpers';

const filters = [
  { id: 'all', label: 'All Modes' },
  { id: 'cheapest', label: 'Budget-Friendly' },
  { id: 'fastest', label: 'Express Transit' },
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'eco', label: 'Eco-Friendly' },
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
      'Transport Selected',
      `"${mode.name}" set as your preferred transit mode.\nCost: ${formatCurrency(mode.cost)} | Time: ${mode.time} | Eco: ${mode.ecoScore}/100`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Transport &amp; Mobility Planner</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Comparison Summary Table Card */}
        <View style={[styles.tableCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.tableTitle, { color: theme.text }]}>Multi-Modal Comparison Matrix</Text>

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
              <Text style={[styles.td, { flex: 1.2, fontFamily: 'Manrope_700Bold', color: theme.text }]} numberOfLines={1}>
                {t.name.split(' ')[0]}
              </Text>
              <Text style={[styles.td, { flex: 0.8, color: theme.textSecondary }]}>{t.time}</Text>
              <Text style={[styles.td, { flex: 0.8, color: theme.primary, fontFamily: 'Manrope_700Bold' }]}>
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
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Cards */}
        <View style={styles.cardList}>
          {filteredModes.map((mode) => (
            <View
              key={mode.id}
              style={[styles.modeCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View style={styles.modeHeader}>
                <View style={[styles.modeIconBox, { backgroundColor: theme.primaryLight }]}>
                  <Ionicons name={mode.icon || 'train-outline'} size={24} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modeName, { color: theme.text }]}>{mode.name}</Text>
                  <Text style={[styles.modeRoute, { color: theme.textSecondary }]}>{mode.route}</Text>
                </View>
              </View>

              <Text style={[styles.modeDesc, { color: theme.textSecondary }]}>
                {mode.description}
              </Text>

              <View style={styles.statGrid}>
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>DURATION</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>{mode.time}</Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>TICKET FARE</Text>
                  <Text style={[styles.statValue, { color: theme.primary, fontFamily: 'Manrope_700Bold' }]}>
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
                  Frequency: {mode.frequency}
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
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
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
    fontFamily: 'Manrope_700Bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  th: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  td: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
  filterRow: {
    gap: 8,
    paddingBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12.5,
    fontFamily: 'Manrope_600SemiBold',
  },
  cardList: {
    gap: 14,
  },
  modeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  modeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeName: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },
  modeRoute: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  modeDesc: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
    marginBottom: 12,
  },
  statGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCol: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 9.5,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
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
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
  },
  chooseBtn: {
    minWidth: 110,
  },
});
