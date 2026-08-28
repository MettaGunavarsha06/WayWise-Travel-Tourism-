import React, { useState, useEffect } from 'react';
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
      `EMERGENCY DISPATCH: ${serviceName}`,
      `Calling ${number}...\n\nYour Live GPS Coordinates:\nLat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}\n\n(Simulated Emergency Call)`,
      [
        { text: 'Cancel Call', style: 'cancel' },
        { text: 'Confirm Dispatch', onPress: () => Alert.alert('Emergency Broadcasted', 'Nearest response units have received your distress coordinates.') }
      ]
    );
  };

  const handleShareLocation = () => {
    Alert.alert(
      'Location Broadcasted',
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
        <Text style={[styles.headerTitle, { color: theme.error }]}>Emergency Safety Hub</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Distress Card */}
        <View style={[styles.distressCard, { backgroundColor: theme.errorLight, borderColor: theme.error }]}>
          <View style={styles.distressIconBox}>
            <Ionicons name="warning" size={28} color={theme.error} />
          </View>
          <Text style={[styles.distressTitle, { color: theme.error }]}>
            Immediate Emergency Assistance
          </Text>
          <Text style={[styles.distressSubtitle, { color: '#7F1D1D' }]}>
            In case of medical, safety, or accident emergencies, tap below. Your live GPS coordinates will be shared with emergency dispatchers.
          </Text>
        </View>

        {/* Live GPS Coordinates Card */}
        <View style={[styles.gpsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.gpsHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="navigate-circle-outline" size={20} color={theme.primary} />
              <Text style={[styles.gpsTitle, { color: theme.text }]}>Live GPS Coordinates</Text>
            </View>
            <TouchableOpacity onPress={fetchLocation} style={styles.refreshBtn}>
              <Ionicons name="refresh-outline" size={16} color={theme.primary} />
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

        {/* One-Tap Emergency Call Triggers */}
        <View style={styles.triggersSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>One-Tap Helplines</Text>

          {[
            { name: 'National Emergency', number: '112', desc: 'Police, Fire, Ambulance Universal Response', icon: 'shield-outline', color: '#DC2626' },
            { name: 'National Tourist Helpline', number: '1363', desc: '24/7 Multilingual Travel Assistance & Grievance', icon: 'call-outline', color: '#D97706' },
            { name: 'Medical & Ambulance Service', number: '108', desc: 'Free Emergency Ambulance & Paramedics', icon: 'medkit-outline', color: '#059669' },
            { name: 'Women Travel Safety Helpline', number: '1091', desc: 'Immediate Support for Solo & Female Travelers', icon: 'heart-outline', color: '#9333EA' },
          ].map((srv, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.85}
              onPress={() => handleTriggerSOS(srv.name, srv.number)}
              style={[styles.serviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View style={[styles.serviceIcon, { backgroundColor: srv.color + '15' }]}>
                <Ionicons name={srv.icon} size={22} color={srv.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.serviceTitleRow}>
                  <Text style={[styles.serviceName, { color: theme.text }]}>{srv.name}</Text>
                  <Text style={[styles.serviceNumber, { color: srv.color }]}>{srv.number}</Text>
                </View>
                <Text style={[styles.serviceDesc, { color: theme.textSecondary }]}>{srv.desc}</Text>
              </View>
            </TouchableOpacity>
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
  distressCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  distressIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  distressTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  distressSubtitle: {
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
    textAlign: 'center',
  },
  gpsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
  },
  gpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gpsTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
  },
  refreshBtn: {
    padding: 4,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  coordBox: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
  },
  coordLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.5,
  },
  coordVal: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginTop: 2,
  },
  triggersSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 2,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
  },
  serviceNumber: {
    fontSize: 15,
    fontFamily: 'Manrope_800ExtraBold',
  },
  serviceDesc: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 16,
  },
});
