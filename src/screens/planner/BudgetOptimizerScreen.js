import React from 'react';
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
import { useTrips } from '../../context/TripContext';
import { BudgetBreakdownChart } from '../../components/BudgetBreakdownChart';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../utils/helpers';

export const BudgetOptimizerScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { activeTrip, optimizeBudget } = useTrips();

  const trip = activeTrip;

  const handleOptimize = () => {
    optimizeBudget();
    Alert.alert('Optimization Applied! 💰', 'Your trip budget has been streamlined to prevent deficits while maximizing eco score!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.topBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.text }]}>AI Budget Optimizer</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
          <Ionicons name="sparkles" size={24} color={theme.primaryDark} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: theme.primaryDark }]}>
              Smart Expenditure Rebalancing
            </Text>
            <Text style={[styles.bannerSubtitle, { color: theme.primaryDark }]}>
              AI dynamically replaces overpriced options with certified local eco-homestays, trains & authentic community experiences.
            </Text>
          </View>
        </View>

        {/* Current Budget Breakdown */}
        {trip?.budgetBreakdown && (
          <BudgetBreakdownChart
            breakdown={trip.budgetBreakdown}
            onOptimizePress={handleOptimize}
            showOptimizeButton={!trip.budgetBreakdown.isOptimized}
          />
        )}

        {/* Optimization Insights / Changes Applied */}
        {trip?.budgetBreakdown?.optimizationChanges && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>✨ Applied AI Optimizations</Text>
            {trip.budgetBreakdown.optimizationChanges.map((change, idx) => (
              <View key={idx} style={styles.changeItem}>
                <Ionicons name="checkmark-circle" size={18} color={theme.ecoGreen} />
                <Text style={[styles.changeText, { color: theme.text }]}>{change}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Local Business Impact Note */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>🤝 Local Economy Contribution</Text>
          <Text style={[styles.impactDesc, { color: theme.textSecondary }]}>
            By optimizing your budget through SmartTour, 78% of your trip expenditure goes directly to local homestay families, tribal artisans, and community guides rather than multinational aggregators.
          </Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconBtn: {
    padding: 6,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  changeText: {
    fontSize: 13,
    flex: 1,
  },
  impactDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
