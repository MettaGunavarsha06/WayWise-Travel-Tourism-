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
    { label: 'Hotel & Lodging', amount: breakdown.hotel, icon: 'bed-outline', color: '#3B82F6' },
    { label: 'Transport & Transit', amount: breakdown.transport, icon: 'train-outline', color: '#10B981' },
    { label: 'Food & Dining', amount: breakdown.food, icon: 'restaurant-outline', color: '#F59E0B' },
    { label: 'Activities & Tours', amount: breakdown.activities, icon: 'ticket-outline', color: '#8B5CF6' },
    { label: 'Artisan Shopping', amount: breakdown.shopping, icon: 'bag-handle-outline', color: '#EC4899' },
    { label: 'Other / Emergency', amount: breakdown.other, icon: 'shield-checkmark-outline', color: '#64748B' },
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
          <Text style={[styles.title, { color: theme.text }]}>AI Budget Optimizer</Text>
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
          <Ionicons name="alert-circle" size={20} color={theme.error} style={{ marginRight: 8 }} />
          <Text style={[styles.alertText, { color: theme.error }]}>
            Your current plan exceeds your budget by {formatCurrency(deficit)}.
          </Text>
        </View>
      )}

      {/* Optimized Badge Box */}
      {breakdown.isOptimized && (
        <View style={[styles.optimizedBox, { backgroundColor: theme.successLight, borderColor: theme.success }]}>
          <Ionicons name="sparkles" size={18} color={theme.success} style={{ marginRight: 6 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.optimizedTitle, { color: theme.success }]}>
              Plan Budget Optimized!
            </Text>
            <Text style={[styles.optimizedDesc, { color: theme.textSecondary }]}>
              Saved {formatCurrency(breakdown.savingsGained || 1850)} by choosing high-rated eco homestays and community transit.
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
                <View style={[styles.itemIcon, { backgroundColor: item.color + '18' }]}>
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
          icon="sparkles"
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
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
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
  },
  utilizationText: {
    fontSize: 12,
    fontWeight: '700',
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
    fontWeight: '600',
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
    fontWeight: '700',
    marginBottom: 2,
  },
  optimizedDesc: {
    fontSize: 11,
    lineHeight: 15,
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
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemAmount: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemPercent: {
    fontSize: 11,
  },
  optimizeBtn: {
    marginTop: 14,
  },
});
