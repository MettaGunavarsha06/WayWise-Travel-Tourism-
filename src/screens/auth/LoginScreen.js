import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { login, loginAsGuest, loginAsAdmin } = useAuth();

  const [email, setEmail] = useState('gunavarsha@sih2026.gov.in');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(email, password);
    }, 400);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="compass" size={32} color={theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Welcome to SmartTour</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Smart India Hackathon 2026 • AI Tourism Ecosystem
            </Text>
          </View>

          {/* Form */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              icon="mail-outline"
              keyboardType="email-address"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              icon="lock-closed-outline"
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <Button
              title="Sign In"
              variant="primary"
              size="large"
              loading={loading}
              onPress={handleLogin}
              style={styles.signInBtn}
            />

            <View style={styles.dividerRow}>
              <View style={[styles.line, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textMuted }]}>OR</Text>
              <View style={[styles.line, { backgroundColor: theme.border }]} />
            </View>

            {/* Google Login UI */}
            <Button
              title="Continue with Google"
              variant="outline"
              icon="logo-google"
              onPress={() => login('gunavarsha@gmail.com', 'demo')}
              style={styles.googleBtn}
            />

            {/* Quick Guest & Admin Access for Hackathon Judges */}
            <View style={styles.demoButtonGroup}>
              <Button
                title="Continue as Guest"
                variant="ghost"
                icon="person-outline"
                onPress={loginAsGuest}
                style={styles.guestBtn}
              />

              <Button
                title="🏛️ Tourism Authority Admin Demo"
                variant="secondary"
                size="small"
                onPress={loginAsAdmin}
                style={styles.adminBtn}
              />
            </View>
          </View>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.signUpText, { color: theme.primary }]}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  signInBtn: {
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  googleBtn: {
    marginBottom: 12,
  },
  demoButtonGroup: {
    gap: 8,
    marginTop: 4,
  },
  guestBtn: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adminBtn: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
  },
  signUpText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
