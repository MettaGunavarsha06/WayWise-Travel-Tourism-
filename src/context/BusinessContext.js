import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialBusinesses } from '../data/businesses';

const BIZ_STORAGE_KEY = '@smarttour_businesses_data';

const BusinessContext = createContext({
  businesses: [],
  registerBusiness: () => {},
  getBusinessesByDestination: () => {},
  getBusinessesByCategory: () => {},
});

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState(initialBusinesses);

  useEffect(() => {
    loadSavedBusinesses();
  }, []);

  const loadSavedBusinesses = async () => {
    try {
      const saved = await AsyncStorage.getItem(BIZ_STORAGE_KEY);
      if (saved) {
        setBusinesses(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Error loading businesses', e);
    }
  };

  const registerBusiness = async (newBizData) => {
    const newEntry = {
      id: `biz_custom_${Date.now()}`,
      destinationId: newBizData.destinationId || 'dest_vizag',
      destinationName: newBizData.destinationName || 'Visakhapatnam',
      name: newBizData.name,
      category: newBizData.category || 'Handicrafts',
      image: newBizData.image || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 1,
      location: newBizData.location || 'Local Community Corridor',
      priceRange: newBizData.priceRange || '₹300 - ₹1,500',
      priceValue: Number(newBizData.priceValue) || 300,
      description: newBizData.description || 'Locally verified tourism artisan and hospitality provider.',
      phone: newBizData.phone || '+91 99000 11223',
      contactPerson: newBizData.contactPerson || 'Vendor Lead',
      verified: true,
      ecoFriendly: true,
      addedByUser: true,
      registeredAt: new Date().toLocaleDateString(),
    };

    const updated = [newEntry, ...businesses];
    setBusinesses(updated);
    try {
      await AsyncStorage.setItem(BIZ_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving new business', e);
    }
    return newEntry;
  };

  const getBusinessesByDestination = (destId) => {
    return businesses.filter((b) => !destId || b.destinationId === destId);
  };

  const getBusinessesByCategory = (category) => {
    if (!category || category === 'All') return businesses;
    return businesses.filter((b) => b.category.toLowerCase() === category.toLowerCase());
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        registerBusiness,
        getBusinessesByDestination,
        getBusinessesByCategory,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinesses = () => useContext(BusinessContext);
