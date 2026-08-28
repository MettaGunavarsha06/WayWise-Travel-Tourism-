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
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/Button';

export const NotificationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { notifications, markAllAsRead, triggerDemoNotification, clearAll } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'hotel':
        return { name: 'bed', color: '#3B82F6', bg: '#EFF6FF' };
      case 'weather':
        return { name: 'rainy', color: '#D97706', bg: '#FEF3C7' };
      case 'crowd':
        return { name: 'people', color: '#EF4444', bg: '#FEE2E2' };
      case 'budget':
        return { name: 'wallet', color: '#10B981', bg: '#D1FAE5' };
      case 'eco':
        return { name: 'leaf', color: '#059669', bg: '#ECFDF5' };
      default:
        return { name: 'notifications', color: '#6366F1', bg: '#EEF2FF' };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notification Center</Text>
        <TouchableOpacity onPress={markAllAsRead} style={styles.actionBtn}>
          <Text style={[styles.actionText, { color: theme.primary }]}>Read All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Judge Simulation Trigger Box */}
        <View style={[styles.demoBox, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.demoTitle, { color: theme.text }]}>⚡ Trigger Live Notifications</Text>
            <Text style={[styles.demoSub, { color: theme.textSecondary }]}>
              Simulate push alerts for hotel check-ins, weather alerts, or crowd warnings.
            </Text>
          </View>
          <Button
            title="+ Trigger Alert"
            variant="secondary"
            size="small"
            onPress={() =>
              triggerDemoNotification({
                title: '🌧️ Sudden Coastal Rain Alert',
                message: 'Rainfall intensity increasing near RK Beach. Swap outdoor walk to Aircraft Museum simulator now.',
                type: 'weather',
              })
            }
          />
        </View>

        {/* Notifications List */}
        <View style={styles.notifList}>
          {notifications.map((n) => {
            const iconObj = getIcon(n.type);
            return (
              <View
                key={n.id}
                style={[
                  styles.notifCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: n.unread ? theme.primary : theme.border,
                    borderWidth: n.unread ? 1.5 : 1,
                  },
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: iconObj.bg }]}>
                  <Ionicons name={iconObj.name} size={20} color={iconObj.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.notifTitle, { color: theme.text }]}>{n.title}</Text>
                    {n.unread && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
                  </View>
                  <Text style={[styles.notifMsg, { color: theme.textSecondary }]}>{n.message}</Text>
                  <Text style={[styles.timeText, { color: theme.textMuted }]}>{n.time}</Text>
                </View>
              </View>
            );
          })}

          {notifications.length === 0 && (
            <View style={styles.emptyWrap}>
              <Ionicons name="notifications-off-outline" size={40} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No notifications right now</Text>
            </View>
          )}
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
  actionBtn: {
    padding: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  demoSub: {
    fontSize: 11,
    marginTop: 2,
  },
  notifList: {
    gap: 12,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notifMsg: {
    fontSize: 12,
    lineHeight: 17,
  },
  timeText: {
    fontSize: 10,
    marginTop: 6,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
  },
});
