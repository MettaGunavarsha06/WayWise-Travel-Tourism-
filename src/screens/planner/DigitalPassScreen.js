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
    Alert.alert('Pass Shared', `WayWise Digital Pass #${trip?.id || 'WW2026'} shared successfully.`);
  };

  const handleDownload = () => {
    Alert.alert('Pass Saved', 'Digital Pass saved offline to device for seamless entry.');
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
              <Text style={styles.passBrand}>WAYWISE DIGITAL PASS</Text>
              <Text style={styles.passGov}>Smart India Hackathon 2026</Text>
            </View>
            <View style={styles.validPill}>
              <Text style={styles.validText}>● ACTIVE</Text>
            </View>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrContainer}>
            <QRCodeView
              size={150}
              value={`WAYWISE:${trip?.id || 'WW2026VIZAG'}:${user?.name || 'Gunavarsha'}`}
              bgColor="#FFFFFF"
              color="#0F172A"
            />
            <Text style={styles.tripIdCode}>PASS ID: {trip?.id || 'WW2026-081'}</Text>
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
            <Text style={styles.securityTag}>Verified by Tourism Authority</Text>
          </View>
        </View>

        {/* Pass Benefits */}
        <View style={[styles.benefitsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.benefitsTitle, { color: theme.text }]}>Passholder Privileges</Text>

          <View style={styles.benefitItem}>
            <Ionicons name="flash-outline" size={18} color={theme.primary} />
            <Text style={[styles.benefitText, { color: theme.textSecondary }]}>
              Express contactless QR scan entry at heritage monuments and museums.
            </Text>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="pricetag-outline" size={18} color={theme.primary} />
            <Text style={[styles.benefitText, { color: theme.textSecondary }]}>
              10% privilege discount at verified community artisan craft guilds.
            </Text>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="bus-outline" size={18} color={theme.primary} />
            <Text style={[styles.benefitText, { color: theme.textSecondary }]}>
              Integrated boarding validation across all local green transit corridors.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <Button
            title="Download Pass"
            variant="primary"
            size="medium"
            icon="download-outline"
            onPress={handleDownload}
            style={styles.actionBtn}
          />
          <Button
            title="Share Pass"
            variant="outline"
            size="medium"
            icon="share-outline"
            onPress={handleShare}
            style={styles.actionBtn}
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
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
  },
  scrollContent: {
    padding: 16,
  },
  passCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 18,
    paddingBottom: 14,
  },
  passBrand: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: 0.6,
  },
  passGov: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  validPill: {
    backgroundColor: 'rgba(22, 163, 74, 0.25)',
    borderWidth: 1,
    borderColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  validText: {
    color: '#4ADE80',
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  tripIdCode: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: 1,
    marginTop: 10,
  },
  cutoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    position: 'relative',
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
    marginHorizontal: 4,
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
    padding: 18,
    gap: 12,
  },
  fieldCol: {
    width: '47%',
  },
  fieldLabel: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
  },
  passFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  securityTag: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  benefitsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 6,
  },
  benefitText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 18,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
});
