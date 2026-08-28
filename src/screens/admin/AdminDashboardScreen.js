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
import { useAuth } from '../../context/AuthContext';
import { adminStatistics } from '../../data/adminStats';
import { MetricCard } from '../../components/MetricCard';
import { CrowdIndicator } from '../../components/CrowdIndicator';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';

export const AdminDashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { toggleRole } = useAuth();
  const [feedbackList, setFeedbackList] = useState(adminStatistics.touristFeedbackList);

  const kpis = adminStatistics.kpis;

  const handleResolveFeedback = (id) => {
    setFeedbackList((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, status: 'resolved' } : fb))
    );
    Alert.alert('Grievance Resolved', 'Authority resolution note dispatched to tourist.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Authority Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.badgeIcon, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="shield-checkmark" size={20} color="#D97706" />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Tourism Authority</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              State Analytics & Crowd Management Hub
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={toggleRole}
          style={[styles.touristSwitchPill, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
        >
          <Ionicons name="person" size={13} color={theme.primaryDark} />
          <Text style={[styles.switchText, { color: theme.primaryDark }]}>Tourist App</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Core KPI Metrics Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionHeading, { color: theme.text }]}>Live Ecosystem KPIs</Text>
          <Text style={[styles.liveTag, { color: theme.ecoGreen }]}>● Live Telemetry</Text>
        </View>

        <View style={styles.kpiGrid}>
          <MetricCard
            title="Total Tourists (FY26)"
            value={kpis.totalTourists}
            change="+8.2%"
            icon="people"
            color="#0D9488"
          />
          <MetricCard
            title="Today's Arrivals"
            value={kpis.todayTourists}
            change={kpis.todayGrowth}
            icon="airplane"
            color="#3B82F6"
          />
          <MetricCard
            title="Hotel Occupancy"
            value={kpis.hotelOccupancy}
            change="+4.1%"
            icon="bed"
            color="#8B5CF6"
          />
          <MetricCard
            title="Registered Artisans"
            value={kpis.registeredBusinesses}
            change={kpis.newBizThisMonth}
            icon="storefront"
            color="#EC4899"
          />
          <MetricCard
            title="Avg Tourist Spend"
            value={kpis.avgTouristSpending}
            icon="wallet"
            color="#F59E0B"
          />
          <MetricCard
            title="Overall Eco Score"
            value={kpis.overallEcoScore}
            icon="leaf"
            color="#10B981"
          />
        </View>

        {/* Real-time Destination Analytics & Crowd Capacity */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>📍 Destination Footfall & Crowd Distribution</Text>
              <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                Real-time capacity tracking to prevent over-tourism
              </Text>
            </View>
          </View>

          <View style={styles.destList}>
            {adminStatistics.destinationAnalytics.map((dest) => (
              <View key={dest.id} style={styles.destItem}>
                <View style={styles.destTop}>
                  <Text style={[styles.destName, { color: theme.text }]}>{dest.name}</Text>
                  <CrowdIndicator level={dest.crowdLevel} compact />
                </View>

                {/* Progress Bar of Capacity */}
                <View style={[styles.barBg, { backgroundColor: theme.cardSecondary }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${dest.capacityPercent}%`,
                        backgroundColor:
                          dest.capacityPercent > 85 ? theme.error : dest.capacityPercent > 55 ? '#F59E0B' : theme.ecoGreen,
                      },
                    ]}
                  />
                </View>

                <View style={styles.destBottom}>
                  <Text style={[styles.visitorText, { color: theme.textSecondary }]}>
                    {dest.visitorsToday.toLocaleString()} visitors today
                  </Text>
                  <Text
                    style={[
                      styles.capText,
                      {
                        color:
                          dest.capacityPercent > 85 ? theme.error : dest.capacityPercent > 55 ? '#D97706' : theme.ecoGreen,
                      },
                    ]}
                  >
                    {dest.capacityPercent}% of Capacity
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Local Business Marketplace Economic Impact */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>🏪 Local Economy & Direct Vendor Impact</Text>
          <Text style={[styles.revenueText, { color: theme.primary }]}>
            {adminStatistics.businessAnalytics.revenueGeneratedDirectly}{' '}
            <Text style={{ fontSize: 13, color: theme.textSecondary, fontWeight: '400' }}>
              transferred directly to grassroots businesses
            </Text>
          </Text>

          <View style={styles.bizGrid}>
            {adminStatistics.businessAnalytics.breakdown.map((item, idx) => (
              <View key={idx} style={[styles.bizItem, { backgroundColor: theme.cardSecondary }]}>
                <Text style={[styles.bizCat, { color: theme.text }]}>{item.category}</Text>
                <Text style={[styles.bizCount, { color: theme.primary }]}>
                  {item.count}{' '}
                  <Text style={[styles.bizPercent, { color: theme.textMuted }]}>({item.percent})</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sustainability & Environmental Metrics */}
        <View style={[styles.card, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
          <View style={styles.ecoHeaderRow}>
            <Ionicons name="leaf" size={22} color="#059669" />
            <Text style={[styles.ecoMainTitle, { color: '#065F46' }]}>
              Eco-Tourism Sustainability Index
            </Text>
          </View>

          <View style={styles.ecoStatsGrid}>
            <View style={styles.ecoStatCol}>
              <Text style={styles.ecoStatVal}>
                {adminStatistics.sustainabilityMetrics.ecoHotelsCertified}
              </Text>
              <Text style={styles.ecoStatLbl}>Certified Eco-Hotels</Text>
            </View>

            <View style={styles.ecoStatCol}>
              <Text style={styles.ecoStatVal}>
                {adminStatistics.sustainabilityMetrics.publicAndEVTransportUsagePercent}%
              </Text>
              <Text style={styles.ecoStatLbl}>Public & EV Transit Use</Text>
            </View>

            <View style={styles.ecoStatCol}>
              <Text style={styles.ecoStatVal}>
                {adminStatistics.sustainabilityMetrics.plasticWasteReductionTons} T
              </Text>
              <Text style={styles.ecoStatLbl}>Plastic Diverted</Text>
            </View>
          </View>
        </View>

        {/* Tourist Grievances & Feedback Resolution Desk */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            📬 Tourist Feedback & Grievance Resolution Desk
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Direct feedback from app users with action routing
          </Text>

          <View style={styles.feedbackList}>
            {feedbackList.map((fb) => (
              <View key={fb.id} style={[styles.fbItem, { borderBottomColor: theme.border }]}>
                <View style={styles.fbHeader}>
                  <View>
                    <Text style={[styles.fbName, { color: theme.text }]}>{fb.touristName}</Text>
                    <Text style={[styles.fbMeta, { color: theme.textSecondary }]}>
                      {fb.destination} • {fb.category} • {fb.date}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: fb.status === 'resolved' ? theme.successLight : '#FEF3C7',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: fb.status === 'resolved' ? theme.success : '#B45309' },
                      ]}
                    >
                      {fb.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.fbComment, { color: theme.text }]}>"{fb.comment}"</Text>

                {fb.status !== 'resolved' && (
                  <Button
                    title="Mark Action Resolved"
                    variant="primary"
                    size="small"
                    icon="checkmark-done-outline"
                    onPress={() => handleResolveFeedback(fb.id)}
                    style={styles.resolveBtn}
                  />
                )}
              </View>
            ))}
          </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  badgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
  },
  touristSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  switchText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
  },
  liveTag: {
    fontSize: 12,
    fontWeight: '700',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
  },
  destList: {
    gap: 12,
  },
  destItem: {
    paddingVertical: 6,
  },
  destTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  destName: {
    fontSize: 13,
    fontWeight: '700',
  },
  barBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  destBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  visitorText: {
    fontSize: 11,
  },
  capText: {
    fontSize: 11,
    fontWeight: '700',
  },
  revenueText: {
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 8,
  },
  bizGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  bizItem: {
    width: '48%',
    padding: 10,
    borderRadius: 10,
  },
  bizCat: {
    fontSize: 11,
    fontWeight: '600',
  },
  bizCount: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  bizPercent: {
    fontSize: 11,
    fontWeight: '400',
  },
  ecoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ecoMainTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  ecoStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ecoStatCol: {
    alignItems: 'center',
    flex: 1,
  },
  ecoStatVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#065F46',
  },
  ecoStatLbl: {
    fontSize: 10,
    color: '#047857',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
  },
  feedbackList: {
    gap: 12,
    marginTop: 10,
  },
  fbItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  fbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  fbName: {
    fontSize: 13,
    fontWeight: '700',
  },
  fbMeta: {
    fontSize: 10,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  fbComment: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  resolveBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});
