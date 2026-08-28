import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

import { BottomTabNavigator } from './BottomTabNavigator';
import { DestinationDetailScreen } from '../screens/home/DestinationDetailScreen';
import { TripPlannerWizardScreen } from '../screens/planner/TripPlannerWizardScreen';
import { ItineraryDetailScreen } from '../screens/planner/ItineraryDetailScreen';
import { BudgetOptimizerScreen } from '../screens/planner/BudgetOptimizerScreen';
import { DigitalPassScreen } from '../screens/planner/DigitalPassScreen';
import { MyTripsScreen } from '../screens/planner/MyTripsScreen';

import { ExploreScreen } from '../screens/explore/ExploreScreen';
import { HotelsScreen } from '../screens/explore/HotelsScreen';
import { HotelDetailScreen } from '../screens/explore/HotelDetailScreen';
import { TransportScreen } from '../screens/explore/TransportScreen';
import { HiddenGemsScreen } from '../screens/explore/HiddenGemsScreen';
import { LocalBusinessScreen } from '../screens/explore/LocalBusinessScreen';
import { RegisterBusinessScreen } from '../screens/explore/RegisterBusinessScreen';

import { SmartMapScreen } from '../screens/map/SmartMapScreen';
import { AIAssistantScreen } from '../screens/assistant/AIAssistantScreen';
import { EmergencySOSScreen } from '../screens/emergency/EmergencySOSScreen';
import { FeedbackScreen } from '../screens/profile/FeedbackScreen';
import { NotificationsScreen } from '../screens/profile/NotificationsScreen';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { theme } = useTheme();
  const { isAuthenticated, role } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : role === 'authority_admin' ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} />
            <Stack.Screen name="TripPlannerWizard" component={TripPlannerWizardScreen} />
            <Stack.Screen name="ItineraryDetail" component={ItineraryDetailScreen} />
            <Stack.Screen name="BudgetOptimizer" component={BudgetOptimizerScreen} />
            <Stack.Screen name="DigitalPass" component={DigitalPassScreen} />
            <Stack.Screen name="MyTrips" component={MyTripsScreen} />

            <Stack.Screen name="Explore" component={ExploreScreen} />
            <Stack.Screen name="Hotels" component={HotelsScreen} />
            <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
            <Stack.Screen name="Transport" component={TransportScreen} />
            <Stack.Screen name="HiddenGems" component={HiddenGemsScreen} />
            <Stack.Screen name="LocalBusiness" component={LocalBusinessScreen} />
            <Stack.Screen name="RegisterBusiness" component={RegisterBusinessScreen} />

            <Stack.Screen name="SmartMap" component={SmartMapScreen} />
            <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
            <Stack.Screen name="EmergencySOS" component={EmergencySOSScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />

            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
