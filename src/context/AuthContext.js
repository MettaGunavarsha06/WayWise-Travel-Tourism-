import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@waywise_auth_user';

const defaultTouristUser = {
  id: 'usr_gunavarsha',
  name: 'Gunavarsha',
  email: 'gunavarsha@sih2026.gov.in',
  phone: '+91 98480 99887',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  role: 'tourist', // tourist | authority_admin
  ecoPoints: 520,
  ecoBadge: 'Eco Champion',
  savedDestinations: ['dest_vizag', 'dest_araku', 'dest_goa', 'dest_jaipur'],
};

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  role: 'tourist',
  login: () => {},
  register: () => {},
  loginAsGuest: () => {},
  loginAsAdmin: () => {},
  toggleRole: () => {},
  logout: () => {},
  updateUserPreferences: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultTouristUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [role, setRole] = useState('tourist');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(parsed.role || 'tourist');
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('Error loading auth user', e);
    }
  };

  const login = async (email, password) => {
    const loggedUser = {
      ...defaultTouristUser,
      email: email || defaultTouristUser.email,
      name: email?.split('@')[0] || 'Gunavarsha',
    };
    setUser(loggedUser);
    setRole('tourist');
    setIsAuthenticated(true);
    setIsGuest(false);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
  };

  const register = async ({ name, email, phone }) => {
    const newUser = {
      ...defaultTouristUser,
      name: name || 'Gunavarsha',
      email: email || 'user@smarttour.in',
      phone: phone || '+91 98480 00000',
    };
    setUser(newUser);
    setRole('tourist');
    setIsAuthenticated(true);
    setIsGuest(false);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
  };

  const loginAsGuest = () => {
    const guestUser = {
      ...defaultTouristUser,
      name: 'Guest Traveler',
      email: 'guest@smarttour.in',
    };
    setUser(guestUser);
    setRole('tourist');
    setIsAuthenticated(true);
    setIsGuest(true);
  };

  const loginAsAdmin = () => {
    const adminUser = {
      id: 'admin_tourism_dept',
      name: 'Tourism Officer',
      email: 'officer@aptourism.gov.in',
      role: 'authority_admin',
      badge: 'Tourism Authority Administrator',
    };
    setUser(adminUser);
    setRole('authority_admin');
    setIsAuthenticated(true);
    setIsGuest(false);
  };

  const toggleRole = () => {
    const newRole = role === 'tourist' ? 'authority_admin' : 'tourist';
    setRole(newRole);
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    setRole('tourist');
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUserPreferences = (updatedData) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isGuest,
        role,
        login,
        register,
        loginAsGuest,
        loginAsAdmin,
        toggleRole,
        logout,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
