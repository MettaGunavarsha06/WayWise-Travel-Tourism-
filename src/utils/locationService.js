import * as Location from 'expo-location';

// Default mock coordinates (Visakhapatnam Beach Road)
export const DEFAULT_COORDINATES = {
  latitude: 17.7120,
  longitude: 83.3240,
  city: 'Visakhapatnam',
  state: 'Andhra Pradesh',
};

export const getCurrentUserLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        success: false,
        coords: DEFAULT_COORDINATES,
        message: 'Location permission not granted, using current destination coordinates.',
      };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      success: true,
      coords: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      message: 'Live location fetched successfully.',
    };
  } catch (error) {
    return {
      success: false,
      coords: DEFAULT_COORDINATES,
      message: 'Using demo destination coordinates.',
    };
  }
};
