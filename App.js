import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider } from './src/context/AuthContext';
import { TripProvider } from './src/context/TripContext';
import { BusinessProvider } from './src/context/BusinessContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function RootApp() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TripProvider>
              <BusinessProvider>
                <NotificationProvider>
                  <RootApp />
                </NotificationProvider>
              </BusinessProvider>
            </TripProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
