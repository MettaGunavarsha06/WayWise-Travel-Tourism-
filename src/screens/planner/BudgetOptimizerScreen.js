import React from 'react';
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
import { useTrips } from '../../context/TripContext';
import { BudgetBreakdownChart } from '../../components/BudgetBreakdownChart';

export const BudgetOptimizerScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { activeTrip, optimizeBudget } = useTrips();

  const trip = activeTrip;

  const handleOptimize = () => {
    optimizeBudget();
    Alert.alert('Optimization Applied', 'Your trip budget has been streamlined to prevent deficits while maximizing sustainability score.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.topBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.text }]}>Budget Optimization</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
          <Ionicons name="calculator-outline" size={24} color={theme.primaryDark} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: theme.primaryDark }]}>
              Expenditure Rebalancing
            </Text>
            <Text style={[styles.bannerSubtitle, { color: theme.primaryDark }]}>
              Replaces premium options with certified local eco-homestays, trains &amp; authentic community experiences.
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
            <Text style={[styles.cardTitle, { color: theme.text }]}>Applied Budget Optimizations</Text>
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
          <Text style={[styles.cardTitle, { color: theme.text }]}>Local Economy &amp; Artisan Impact</Text>
          <Text style={[styles.impactDesc, { color: theme.textSecondary }]}>
            By optimizing your budget through WayWise, 78% of your trip expenditure goes directly to local homestay families, tribal artisans, and community guides rather than multinational aggregators.
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
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
  },
  scrollContent: {
    padding: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
  },
  bannerSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
    lineHeight: 17,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 10,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  changeText: {
    fontSize: 13,
    fontFamily: 'Manrope_500Medium',
    flex: 1,
  },
  impactDesc: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
  },
});
