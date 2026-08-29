import * as Location from 'expo-location';

// Default mock coordinates (Visakhapatnam Beach Road)
export const DEFAULT_COORDINATES = {
  latitude: 17.7120,
  longitude: 83.3240,
  city: 'Visakhapatnam',
  state: 'Andhra Pradesh',
  country: 'India',
};

export const PRESET_CITIES = [
  { id: 'vizag', name: 'Visakhapatnam (Beach Road)', latitude: 17.7120, longitude: 83.3240, state: 'Andhra Pradesh' },
  { id: 'araku', name: 'Araku Valley (Coffee Hills)', latitude: 18.3273, longitude: 82.8775, state: 'Andhra Pradesh' },
  { id: 'hyderabad', name: 'Hyderabad (Charminar/HiTech)', latitude: 17.3850, longitude: 78.4867, state: 'Telangana' },
  { id: 'bangalore', name: 'Bengaluru (MG Road/Indiranagar)', latitude: 12.9716, longitude: 77.5946, state: 'Karnataka' },
  { id: 'jaipur', name: 'Jaipur (Pink City / Hawa Mahal)', latitude: 26.9124, longitude: 75.7873, state: 'Rajasthan' },
  { id: 'delhi', name: 'New Delhi (Connaught Place/India Gate)', latitude: 28.6139, longitude: 77.2090, state: 'Delhi' },
  { id: 'mumbai', name: 'Mumbai (Marine Drive / Colaba)', latitude: 18.9220, longitude: 72.8347, state: 'Maharashtra' },
  { id: 'goa', name: 'Goa (Calangute / Panaji)', latitude: 15.4989, longitude: 73.8278, state: 'Goa' },
  { id: 'tirupati', name: 'Tirupati (Temple Sanctuary)', latitude: 13.6288, longitude: 79.4192, state: 'Andhra Pradesh' },
];

/**
 * Checks current location permission status without requesting
 */
export const checkLocationPermission = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return {
      granted: status === 'granted',
      status,
    };
  } catch (error) {
    return { granted: false, status: 'undetermined' };
  }
};

/**
 * Requests location permission and fetches user's real GPS position
 */
export const requestAndGetUserLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      return {
        success: false,
        isDemo: true,
        permissionDenied: true,
        coords: DEFAULT_COORDINATES,
        cityName: DEFAULT_COORDINATES.city,
        message: 'Location permission was denied. Showing demo location.',
      };
    }

    // High accuracy position
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 10000,
    });

    let cityName = 'Current Location';
    let addressDetails = {};

    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        cityName = place.city || place.subregion || place.name || place.region || 'Current Location';
        addressDetails = {
          city: place.city,
          district: place.district || place.subregion,
          state: place.region,
          country: place.country,
          postalCode: place.postalCode,
          street: place.street,
        };
      }
    } catch (geoError) {
      console.warn('Reverse geocoding not available:', geoError.message);
    }

    return {
      success: true,
      isDemo: false,
      permissionDenied: false,
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      },
      cityName,
      addressDetails,
      message: 'Live GPS location connected successfully.',
    };
  } catch (error) {
    console.warn('GPS location request error:', error.message);
    return {
      success: false,
      isDemo: true,
      permissionDenied: false,
      coords: DEFAULT_COORDINATES,
      cityName: DEFAULT_COORDINATES.city,
      message: 'Could not fetch GPS. Using default city coordinates.',
    };
  }
};

/**
 * Backward compatible helper
 */
export const getCurrentUserLocation = async () => {
  return requestAndGetUserLocation();
};

