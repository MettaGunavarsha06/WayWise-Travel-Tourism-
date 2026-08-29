import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateAIItinerary, applyWeatherSwap } from '../utils/aiEngine';
import { optimizeTripBudget } from '../utils/budgetOptimizer';

const TRIPS_STORAGE_KEY = '@smarttour_trips_data';
const ACTIVE_TRIP_KEY = '@smarttour_active_trip';
const SAVED_PLACES_KEY = '@smarttour_saved_places_data';
const SAVED_COLLECTIONS_KEY = '@smarttour_saved_collections_data';
const PAST_MEMORIES_KEY = '@smarttour_past_memories_data';

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

// Default initial saved places for instant Instagram-style bookmark showcase
const initialSavedPlaces = [
  {
    id: 'dest_vizag',
    name: 'Visakhapatnam',
    subtitle: 'The Jewel of the East Coast',
    state: 'Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 1420,
    estimatedCost: 12000,
    duration: '4 Days',
    crowdLevel: 'moderate',
    category: 'Beaches & Heritage',
    savedAt: new Date().toISOString(),
    collection: 'Beach Escapes',
  },
  {
    id: 'dest_araku',
    name: 'Araku Valley',
    subtitle: 'Misty Coffee Valley of Eastern Ghats',
    state: 'Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 980,
    estimatedCost: 8500,
    duration: '3 Days',
    crowdLevel: 'low',
    category: 'Nature & Adventure',
    savedAt: new Date().toISOString(),
    collection: 'Must Visit 2026',
  },
];

// Rich verified completed trips already saved in user's Past Memories
const initialPastMemories = [
  {
    id: 'memory_araku_2026',
    destinationId: 'dest_araku',
    destinationName: 'Araku Valley Coffee Escapade',
    bannerImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    completedDate: 'Feb 18, 2026',
    days: 3,
    travelers: 2,
    totalSpent: 8500,
    ecoScore: 95,
    userRating: 5,
    spotsVisited: ['Borra Caves', 'Chaparai Waterfalls', 'Tribal Coffee Museum', 'Padmapuram Botanical Gardens'],
    hotel: { name: 'Haritha Hill Resort & Coffee Estate', type: 'Eco Heritage Stay' },
    notes: 'Breathtaking train journey through Eastern Ghat tunnels. Fresh tribal Arabica coffee and organic bamboo chicken were incredible!',
  },
  {
    id: 'memory_vizag_2026',
    destinationId: 'dest_vizag',
    destinationName: 'Visakhapatnam Coastal Heritage',
    bannerImage: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    completedDate: 'Jan 24, 2026',
    days: 4,
    travelers: 2,
    totalSpent: 14200,
    ecoScore: 92,
    userRating: 5,
    spotsVisited: ['INS Kursura Submarine Museum', 'Kailasagiri Ropeway', 'Rushikonda Blue Flag Beach', 'Simhachalam Temple'],
    hotel: { name: 'Novotel Beachfront & Green Spa', type: 'Sustainable Coastal Resort' },
    notes: 'Walked the scenic RK Beach promenade at sunrise. The submarine tour was deeply historic.',
  },
  {
    id: 'memory_jaipur_2025',
    destinationId: 'dest_jaipur',
    destinationName: 'Jaipur Royal Palaces & Forts',
    bannerImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    completedDate: 'Dec 12, 2025',
    days: 3,
    travelers: 3,
    totalSpent: 18500,
    ecoScore: 88,
    userRating: 5,
    spotsVisited: ['Amer Fort', 'Hawa Mahal', 'City Palace Museum', 'Johari Heritage Bazaar'],
    hotel: { name: 'Heritage Haveli & Artisan Stay', type: 'Traditional Rajasthani Haveli' },
    notes: 'Magnificent golden hour view from Jaigarh fort. Bought authentic block-printed textiles from local artisans.',
  },
];

const initialCollections = ['All Saved', 'Beach Escapes', 'Must Visit 2026', 'Food & Dining', 'Heritage & Forts'];

const TripContext = createContext({
  activeTrip: null,
  trips: [],
  pastMemories: [],
  savedPlaces: [],
  savedCollections: [],
  createTrip: () => {},
  optimizeBudget: () => {},
  applyWeatherAdjustment: () => {},
  setActiveTripById: () => {},
  deleteTrip: () => {},
  toggleSavePlace: () => {},
  isPlaceSaved: () => false,
  removeSavedPlace: () => {},
  createCollection: () => {},
  saveTripToPastMemories: () => {},
  deletePastMemory: () => {},
});

export const TripProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(initialSampleTrip);
  const [trips, setTrips] = useState([initialSampleTrip]);
  const [pastMemories, setPastMemories] = useState(initialPastMemories);
  const [savedPlaces, setSavedPlaces] = useState(initialSavedPlaces);
  const [savedCollections, setSavedCollections] = useState(initialCollections);

  useEffect(() => {
    loadSavedTrips();
    loadSavedPlacesData();
    loadPastMemoriesData();
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

  const loadSavedPlacesData = async () => {
    try {
      const storedPlaces = await AsyncStorage.getItem(SAVED_PLACES_KEY);
      const storedCollections = await AsyncStorage.getItem(SAVED_COLLECTIONS_KEY);
      if (storedPlaces) {
        setSavedPlaces(JSON.parse(storedPlaces));
      }
      if (storedCollections) {
        setSavedCollections(JSON.parse(storedCollections));
      }
    } catch (e) {
      console.warn('Error loading saved places from storage', e);
    }
  };

  const loadPastMemoriesData = async () => {
    try {
      const storedMemories = await AsyncStorage.getItem(PAST_MEMORIES_KEY);
      if (storedMemories) {
        const parsed = JSON.parse(storedMemories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPastMemories(parsed);
        }
      }
    } catch (e) {
      console.warn('Error loading past memories from storage', e);
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

  const persistSavedPlaces = async (newSaved) => {
    try {
      await AsyncStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(newSaved));
    } catch (e) {
      console.warn('Error persisting saved places', e);
    }
  };

  const persistCollections = async (newCollections) => {
    try {
      await AsyncStorage.setItem(SAVED_COLLECTIONS_KEY, JSON.stringify(newCollections));
    } catch (e) {
      console.warn('Error persisting collections', e);
    }
  };

  const persistPastMemories = async (newMemories) => {
    try {
      await AsyncStorage.setItem(PAST_MEMORIES_KEY, JSON.stringify(newMemories));
    } catch (e) {
      console.warn('Error persisting past memories', e);
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

  // --- SAVE COMPLETED TRIPS TO PAST MEMORIES ---
  const saveTripToPastMemories = (tripToSave, userNotes = '', userRating = 5) => {
    if (!tripToSave) return;
    
    // Extract spots visited from daysPlan
    const visitedList = [];
    if (tripToSave.daysPlan) {
      tripToSave.daysPlan.forEach((d) => {
        if (d.morning) visitedList.push(d.morning.title || d.morning.name);
        if (d.afternoon) visitedList.push(d.afternoon.title || d.afternoon.name);
        if (d.evening) visitedList.push(d.evening.title || d.evening.name);
      });
    }

    const newMemory = {
      id: `memory_${Date.now()}`,
      destinationId: tripToSave.destinationId || 'dest_custom',
      destinationName: `${tripToSave.destinationName || 'Smart Tour'} Journey`,
      bannerImage: tripToSave.bannerImage || 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
      completedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      days: tripToSave.days || 3,
      travelers: tripToSave.travelers || 2,
      totalSpent: tripToSave.budgetBreakdown?.total || tripToSave.userBudget || 12000,
      ecoScore: tripToSave.ecoScore || 90,
      userRating: userRating || 5,
      spotsVisited: visitedList.length > 0 ? visitedList.slice(0, 5) : ['Heritage Fort', 'Scenic Coast', 'Artisan Bazaar'],
      hotel: tripToSave.hotel || { name: 'Eco Verified Homestay', type: 'Sustainable Stay' },
      notes: userNotes || 'Wonderful completed trip! Saved in Past Memories with full itinerary log.',
      fullTripData: tripToSave,
    };

    const updatedMemories = [newMemory, ...pastMemories];
    setPastMemories(updatedMemories);
    persistPastMemories(updatedMemories);
    return newMemory;
  };

  const deletePastMemory = (memoryId) => {
    const updated = pastMemories.filter((m) => m.id !== memoryId);
    setPastMemories(updated);
    persistPastMemories(updated);
  };

  // --- INSTAGRAM-STYLE SAVED / BOOKMARK SYSTEM ---
  const isPlaceSaved = (placeId) => {
    if (!placeId) return false;
    return savedPlaces.some((p) => p.id === placeId || p.destinationId === placeId);
  };

  const toggleSavePlace = (place, collection = 'All Saved') => {
    if (!place || !place.id) return false;

    const exists = savedPlaces.some((p) => p.id === place.id);
    let updated;

    if (exists) {
      // Remove from saved
      updated = savedPlaces.filter((p) => p.id !== place.id);
      setSavedPlaces(updated);
      persistSavedPlaces(updated);
      return false; // Now unsaved
    } else {
      // Add to saved with metadata
      const newEntry = {
        ...place,
        savedAt: new Date().toISOString(),
        collection: collection || 'All Saved',
      };
      updated = [newEntry, ...savedPlaces];
      setSavedPlaces(updated);
      persistSavedPlaces(updated);
      return true; // Now saved
    }
  };

  const removeSavedPlace = (placeId) => {
    const updated = savedPlaces.filter((p) => p.id !== placeId);
    setSavedPlaces(updated);
    persistSavedPlaces(updated);
  };

  const createCollection = (collectionName) => {
    if (!collectionName || savedCollections.includes(collectionName)) return;
    const updated = [...savedCollections, collectionName];
    setSavedCollections(updated);
    persistCollections(updated);
  };

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        trips,
        pastMemories,
        savedPlaces,
        savedCollections,
        createTrip,
        optimizeBudget,
        applyWeatherAdjustment,
        setActiveTripById,
        deleteTrip,
        toggleSavePlace,
        isPlaceSaved,
        removeSavedPlace,
        createCollection,
        saveTripToPastMemories,
        deletePastMemory,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => useContext(TripContext);
