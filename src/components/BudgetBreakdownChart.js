import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';
import { formatCurrency } from '../utils/helpers';

export const BudgetBreakdownChart = ({
  breakdown,
  onOptimizePress,
  showOptimizeButton = true,
}) => {
  const { theme } = useTheme();

  if (!breakdown) return null;

  const total = breakdown.total || 0;
  const userBudget = breakdown.userBudget || 15000;
  const isOver = breakdown.isOverBudget;
  const deficit = breakdown.deficit || 0;
  const remaining = breakdown.remaining || 0;

  const items = [
    { label: 'Hotel & Lodging', amount: breakdown.hotel, icon: 'bed-outline', color: '#2563EB' },
    { label: 'Transit & Local Transport', amount: breakdown.transport, icon: 'train-outline', color: '#15803D' },
    { label: 'Food & Dining', amount: breakdown.food, icon: 'restaurant-outline', color: '#D97706' },
    { label: 'Attractions & Sightseeing', amount: breakdown.activities, icon: 'ticket-outline', color: '#7C3AED' },
    { label: 'Artisan Crafts & Shopping', amount: breakdown.shopping, icon: 'bag-handle-outline', color: '#DB2777' },
    { label: 'Contingency / Emergency', amount: breakdown.other, icon: 'shield-checkmark-outline', color: '#475569' },
  ];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isOver ? theme.error : theme.border,
          borderWidth: isOver ? 1.5 : 1,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Budget Breakdown</Text>
          <Text style={[styles.subTitle, { color: theme.textSecondary }]}>
            Target Budget: {formatCurrency(userBudget)}
          </Text>
        </View>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isOver ? theme.errorLight : theme.successLight,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isOver ? theme.error : theme.success },
            ]}
          >
            {isOver ? `Over by ${formatCurrency(deficit)}` : `Surplus: ${formatCurrency(remaining)}`}
          </Text>
        </View>
      </View>

      {/* Progress Bar of Budget Utilization */}
      <View style={[styles.progressBarBg, { backgroundColor: theme.cardSecondary }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${Math.min(100, Math.round((total / (userBudget || 1)) * 100))}%`,
              backgroundColor: isOver ? theme.error : theme.primary,
            },
          ]}
        />
      </View>

      <View style={styles.summaryValuesRow}>
        <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
          Total Plan Cost: <Text style={{ fontWeight: '700', color: theme.text }}>{formatCurrency(total)}</Text>
        </Text>
        <Text style={[styles.utilizationText, { color: isOver ? theme.error : theme.primary }]}>
          {Math.round((total / (userBudget || 1)) * 100)}% of Budget
        </Text>
      </View>

      {/* Over Budget Alert Box */}
      {isOver && (
        <View style={[styles.alertBox, { backgroundColor: theme.errorLight, borderColor: theme.error }]}>
          <Ionicons name="alert-circle" size={18} color={theme.error} style={{ marginRight: 8 }} />
          <Text style={[styles.alertText, { color: theme.error }]}>
            Current itinerary exceeds target budget by {formatCurrency(deficit)}.
          </Text>
        </View>
      )}

      {/* Optimized Badge Box */}
      {breakdown.isOptimized && (
        <View style={[styles.optimizedBox, { backgroundColor: theme.successLight, borderColor: theme.success }]}>
          <Ionicons name="checkmark-circle" size={18} color={theme.success} style={{ marginRight: 6 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.optimizedTitle, { color: theme.success }]}>
              Budget Optimized
            </Text>
            <Text style={[styles.optimizedDesc, { color: theme.textSecondary }]}>
              Saved {formatCurrency(breakdown.savingsGained || 1850)} by selecting certified eco-homestays and public transit.
            </Text>
          </View>
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Itemized Breakdown Table */}
      <View style={styles.itemList}>
        {items.map((item, index) => {
          const itemPercent = total > 0 ? Math.round((item.amount / total) * 100) : 0;
          return (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.itemIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={15} color={item.color} />
                </View>
                <Text style={[styles.itemLabel, { color: theme.text }]}>{item.label}</Text>
              </View>

              <View style={styles.itemRight}>
                <Text style={[styles.itemAmount, { color: theme.text }]}>
                  {formatCurrency(item.amount)}
                </Text>
                <Text style={[styles.itemPercent, { color: theme.textMuted }]}>
                  ({itemPercent}%)
                </Text>
              </View>
            </View>
          );
        })}

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Remaining row */}
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <View style={[styles.itemIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="wallet-outline" size={15} color={theme.primary} />
            </View>
            <Text style={[styles.itemLabel, { fontWeight: '700', color: theme.text }]}>
              Remaining Savings
            </Text>
          </View>

          <View style={styles.itemRight}>
            <Text
              style={[
                styles.itemAmount,
                {
                  color: isOver ? theme.error : theme.ecoGreen,
                  fontWeight: '700',
                  fontSize: 15,
                },
              ]}
            >
              {formatCurrency(remaining)}
            </Text>
          </View>
        </View>
      </View>

      {/* Optimize Button if over budget or requested */}
      {showOptimizeButton && onOptimizePress && !breakdown.isOptimized && (
        <Button
          title="Optimize Budget"
          variant="primary"
          icon="options-outline"
          onPress={onOptimizePress}
          style={styles.optimizeBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
  },
  subTitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  summaryValuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
  },
  utilizationText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    lineHeight: 16,
  },
  optimizedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  optimizedTitle: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 2,
  },
  optimizedDesc: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  itemList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 13,
    fontFamily: 'Manrope_500Medium',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemAmount: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
  },
  itemPercent: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
  },
  optimizeBtn: {
    marginTop: 14,
  },
});
