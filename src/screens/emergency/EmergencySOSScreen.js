import React, { useState, useEffect } from 'react';
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
import { getCurrentUserLocation, DEFAULT_COORDINATES } from '../../utils/locationService';
import { Button } from '../../components/Button';

export const EmergencySOSScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [coords, setCoords] = useState(DEFAULT_COORDINATES);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLocating(true);
    const res = await getCurrentUserLocation();
    setCoords(res.coords);
    setLocating(false);
  };

  const handleTriggerSOS = (serviceName, number) => {
    Alert.alert(
      `🚨 EMERGENCY DISPATCH: ${serviceName}`,
      `Calling ${number}...\n\nYour Live GPS Coordinates:\nLat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}\nArea: Visakhapatnam Beach Corridor\n\n(Simulated Emergency Call)`,
      [
        { text: 'Cancel Call', style: 'cancel' },
        { text: 'Confirm Dispatch', onPress: () => Alert.alert('Emergency Broadcasted', 'Nearest police and ambulance units have received your distress signal and GPS pin.') }
      ]
    );
  };

  const handleShareLocation = () => {
    Alert.alert(
      'Location Broadcasted 📡',
      `Emergency coordinates (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}) sent to Tourist Helpline 1363 and emergency contacts.`
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.error }]}>🚨 Emergency SOS Hub</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Distress Card */}
        <View style={[styles.distressCard, { backgroundColor: theme.errorLight, borderColor: theme.error }]}>
          <View style={styles.distressIconBox}>
            <Ionicons name="warning" size={32} color={theme.error} />
          </View>
          <Text style={[styles.distressTitle, { color: theme.error }]}>
            Immediate Emergency Assistance
          </Text>
          <Text style={[styles.distressSubtitle, { color: '#7F1D1D' }]}>
            In case of medical, safety, or accident emergencies, tap below. Your live GPS coordinates will be shared with authorities.
          </Text>
        </View>

        {/* Live GPS Coordinates Card */}
        <View style={[styles.gpsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.gpsHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="navigate-circle" size={20} color={theme.primary} />
              <Text style={[styles.gpsTitle, { color: theme.text }]}>Live GPS Coordinates</Text>
            </View>
            <TouchableOpacity onPress={fetchLocation} style={styles.refreshBtn}>
              <Ionicons name="refresh" size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.coordsRow}>
            <View style={[styles.coordBox, { backgroundColor: theme.cardSecondary }]}>
              <Text style={[styles.coordLabel, { color: theme.textMuted }]}>LATITUDE</Text>
              <Text style={[styles.coordVal, { color: theme.text }]}>{coords.latitude.toFixed(5)}</Text>
            </View>
            <View style={[styles.coordBox, { backgroundColor: theme.cardSecondary }]}>
              <Text style={[styles.coordLabel, { color: theme.textMuted }]}>LONGITUDE</Text>
              <Text style={[styles.coordVal, { color: theme.text }]}>{coords.longitude.toFixed(5)}</Text>
            </View>
          </View>

          <Button
            title="Share Location with Emergency Contacts"
            variant="outline"
            size="small"
            icon="share-social-outline"
            onPress={handleShareLocation}
            style={{ marginTop: 10 }}
          />
        </View>

        {/* Emergency Services Buttons */}
        <View style={styles.servicesGrid}>
          {/* Police */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleTriggerSOS('Police Emergency Response', '112')}
            style={[styles.serviceCard, { backgroundColor: '#FEE2E2', borderColor: '#F87171' }]}
          >
            <View style={[styles.serviceIcon, { backgroundColor: '#EF4444' }]}>
              <Ionicons name="shield" size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.serviceName, { color: '#991B1B' }]}>Police Helpline</Text>
              <Text style={[styles.serviceDesc, { color: '#B91C1C' }]}>Call 112 • Instant Response</Text>
            </View>
            <Ionicons name="call" size={20} color="#EF4444" />
          </TouchableOpacity>

          {/* Ambulance */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleTriggerSOS('Medical Ambulance Care', '108')}
            style={[styles.serviceCard, { backgroundColor: '#FEF3C7', borderColor: '#FBBF24' }]}
          >
            <View style={[styles.serviceIcon, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="medkit" size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.serviceName, { color: '#92400E' }]}>Ambulance Service</Text>
              <Text style={[styles.serviceDesc, { color: '#B45309' }]}>Call 108 • 24/7 Emergency Care</Text>
            </View>
            <Ionicons name="call" size={20} color="#F59E0B" />
          </TouchableOpacity>

          {/* National Tourist Helpline */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleTriggerSOS('Ministry of Tourism Helpline', '1363')}
            style={[styles.serviceCard, { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' }]}
          >
            <View style={[styles.serviceIcon, { backgroundColor: '#3B82F6' }]}>
              <Ionicons name="headset" size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.serviceName, { color: '#1E40AF' }]}>National Tourist Helpline</Text>
              <Text style={[styles.serviceDesc, { color: '#1D4ED8' }]}>Call 1363 • Multilingual 24/7</Text>
            </View>
            <Ionicons name="call" size={20} color="#3B82F6" />
          </TouchableOpacity>

          {/* Nearest Hospital */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleTriggerSOS('King George Government Hospital', '+91 891 256 4891')}
            style={[styles.serviceCard, { backgroundColor: '#ECFDF5', borderColor: '#6EE7B7' }]}
          >
            <View style={[styles.serviceIcon, { backgroundColor: '#10B981' }]}>
              <Ionicons name="fitness" size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.serviceName, { color: '#065F46' }]}>Nearest Hospital Desk</Text>
              <Text style={[styles.serviceDesc, { color: '#047857' }]}>King George Hospital (2.1 km)</Text>
            </View>
            <Ionicons name="call" size={20} color="#10B981" />
          </TouchableOpacity>
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
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
  },
  distressCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  distressIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  distressTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  distressSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
  gpsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  gpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gpsTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  refreshBtn: {
    padding: 4,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  coordBox: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
  },
  coordLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  coordVal: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  servicesGrid: {
    gap: 12,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 12,
  },
  serviceIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
  },
  serviceDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});
