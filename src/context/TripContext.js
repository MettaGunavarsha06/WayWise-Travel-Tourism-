import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateAIItinerary, applyWeatherSwap } from '../utils/aiEngine';
import { optimizeTripBudget } from '../utils/budgetOptimizer';

const TRIPS_STORAGE_KEY = '@smarttour_trips_data';
const ACTIVE_TRIP_KEY = '@smarttour_active_trip';

// Initial pre-loaded sample trip for instant judge demo
const initialSampleTrip = generateAIItinerary({
  destinationId: 'dest_vizag',
  destinationName: 'Visakhapatnam',
  days: 4,
  travelers: 2,
  totalBudget: 15000,
  interests: ['Nature', 'History', 'Beaches', 'Culture', 'Food'],
  travelPreference: 'Comfortable',
});

const TripContext = createContext({
  activeTrip: null,
  trips: [],
  createTrip: () => {},
  optimizeBudget: () => {},
  applyWeatherAdjustment: () => {},
  setActiveTripById: () => {},
  deleteTrip: () => {},
});

export const TripProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(initialSampleTrip);
  const [trips, setTrips] = useState([initialSampleTrip]);

  useEffect(() => {
    loadSavedTrips();
  }, []);

  const loadSavedTrips = async () => {
    try {
      const savedTrips = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      const savedActive = await AsyncStorage.getItem(ACTIVE_TRIP_KEY);
      if (savedTrips) {
        const parsed = JSON.parse(savedTrips);
        setTrips(parsed);
      }
      if (savedActive) {
        setActiveTrip(JSON.parse(savedActive));
      }
    } catch (e) {
      console.warn('Error loading trips from storage', e);
    }
  };

  const persistTrips = async (newTrips, newActive) => {
    try {
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(newTrips));
      if (newActive) {
        await AsyncStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(newActive));
      }
    } catch (e) {
      console.warn('Error saving trips', e);
    }
  };

  const createTrip = (wizardData) => {
    const newTrip = generateAIItinerary(wizardData);
    const updatedTrips = [newTrip, ...trips];
    setActiveTrip(newTrip);
    setTrips(updatedTrips);
    persistTrips(updatedTrips, newTrip);
    return newTrip;
  };

  const optimizeBudget = () => {
    if (!activeTrip) return;
    const optimized = optimizeTripBudget(activeTrip);
    setActiveTrip(optimized);
    const updatedTrips = trips.map((t) => (t.id === optimized.id ? optimized : t));
    setTrips(updatedTrips);
    persistTrips(updatedTrips, optimized);
    return optimized;
  };

  const applyWeatherAdjustment = () => {
    if (!activeTrip) return;
    const adjusted = applyWeatherSwap(activeTrip);
    setActiveTrip(adjusted);
    const updatedTrips = trips.map((t) => (t.id === adjusted.id ? adjusted : t));
    setTrips(updatedTrips);
    persistTrips(updatedTrips, adjusted);
    return adjusted;
  };

  const setActiveTripById = (tripId) => {
    const found = trips.find((t) => t.id === tripId);
    if (found) {
      setActiveTrip(found);
      AsyncStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(found)).catch(() => {});
    }
  };

  const deleteTrip = (tripId) => {
    const updated = trips.filter((t) => t.id !== tripId);
    setTrips(updated);
    if (activeTrip?.id === tripId) {
      const nextActive = updated[0] || null;
      setActiveTrip(nextActive);
      persistTrips(updated, nextActive);
    } else {
      persistTrips(updated, activeTrip);
    }
  };

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        trips,
        createTrip,
        optimizeBudget,
        applyWeatherAdjustment,
        setActiveTripById,
        deleteTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => useContext(TripContext);
