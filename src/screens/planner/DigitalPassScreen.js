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
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { QRCodeView } from '../../components/QRCodeView';
import { EcoScoreBadge } from '../../components/EcoScoreBadge';
import { Button } from '../../components/Button';

export const DigitalPassScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { activeTrip } = useTrips();

  const trip = route?.params?.trip || activeTrip;

  const handleShare = () => {
    Alert.alert('Pass Shared', `Digital Tourism Pass #${trip?.id || 'ST2026'} shared via QR link.`);
  };

  const handleDownload = () => {
    Alert.alert('Pass Saved', 'Digital Pass saved offline to device wallet for seamless entry.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.topBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.text }]}>Digital Tourism Pass</Text>
        <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
          <Ionicons name="share-social-outline" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Pass Card */}
        <View style={[styles.passCard, { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
          {/* Top Notch Brand Header */}
          <View style={styles.passHeader}>
            <View>
              <Text style={styles.passBrand}>SMARTTOUR PASS</Text>
              <Text style={styles.passGov}>Smart India Hackathon 2026</Text>
            </View>
            <View style={styles.validPill}>
              <Text style={styles.validText}>● VALID</Text>
            </View>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrContainer}>
            <QRCodeView
              size={150}
              value={`SMARTTOUR:${trip?.id || 'ST2026VIZAG'}:${user?.name || 'Gunavarsha'}`}
              bgColor="#FFFFFF"
              color="#0F172A"
            />
            <Text style={styles.tripIdCode}>TRIP ID: {trip?.id || 'ST2026XXXX'}</Text>
          </View>

          {/* Dotted Cutout Line */}
          <View style={styles.cutoutRow}>
            <View style={[styles.circleCutoutLeft, { backgroundColor: theme.background }]} />
            <View style={styles.dottedLine} />
            <View style={[styles.circleCutoutRight, { backgroundColor: theme.background }]} />
          </View>

          {/* Pass Fields Grid */}
          <View style={styles.fieldsGrid}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>TRAVELLER</Text>
              <Text style={styles.fieldValue}>{user?.name || 'Gunavarsha'}</Text>
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>DESTINATION</Text>
              <Text style={styles.fieldValue}>{trip?.destinationName || 'Visakhapatnam'}</Text>
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>DURATION</Text>
              <Text style={styles.fieldValue}>{trip?.days || 4} Days</Text>
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>HOTEL</Text>
              <Text style={styles.fieldValue} numberOfLines={1}>
                {trip?.hotel?.name || 'Bay Breeze Resort'}
              </Text>
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>TRANSPORT</Text>
              <Text style={styles.fieldValue} numberOfLines={1}>
                {trip?.transport?.name?.split('(')[0] || 'Express Rail'}
              </Text>
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>ATTRACTIONS</Text>
              <Text style={styles.fieldValue}>5 Included Passes</Text>
            </View>
          </View>

          <View style={styles.passFooter}>
            <EcoScoreBadge score={trip?.ecoScore || 88} />
            <Text style={styles.securityTag}>🔒 Secured by Tourism Authority</Text>
          </View>
        </View>

        {/* Pass Benefits */}
        <View style={[styles.benefitsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.benefitsTitle, { color: theme.text }]}>🎁 Passholder Benefits & Perks</Text>

          <View style={styles.benefitItem}>
            <Ionicons name="flash-outline" size={18} color={theme.primary} />
            <Text style={[styles.benefitText, { color: theme.textSecondary }]}>
              Express QR scan entry at INS Kursura Submarine & Borra Caves.
            </Text>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="pricetag-outline" size={18} color={theme.primary} />
            <Text style={[styles.benefitText, { color: theme.textSecondary }]}>
              10% instant discount at verified Etikoppaka lacquer craft guilds.
            </Text>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="bus-outline" size={18} color={theme.primary} />
            <Text style={[styles.benefitText, { color: theme.textSecondary }]}>
              Unlimited hop-on access to city beach road Electric Transit Shuttles.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <Button
            title="Download Pass"
            variant="primary"
            size="large"
            icon="download-outline"
            onPress={handleDownload}
            style={{ flex: 1 }}
          />
          <Button
            title="Share"
            variant="outline"
            size="large"
            icon="share-outline"
            onPress={handleShare}
            style={{ flex: 0.8 }}
          />
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
  passCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  passBrand: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  passGov: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  validPill: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  validText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  tripIdCode: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 10,
  },
  cutoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -20,
    marginVertical: 16,
  },
  circleCutoutLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -12,
  },
  dottedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  circleCutoutRight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: -12,
  },
  fieldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 16,
  },
  fieldCol: {
    width: '47%',
  },
  fieldLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  passFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 14,
  },
  securityTag: {
    color: '#64748B',
    fontSize: 10,
  },
  benefitsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
