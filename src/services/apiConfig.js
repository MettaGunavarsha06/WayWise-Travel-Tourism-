import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Current machine LAN IP for seamless physical device connectivity over local Wi-Fi
const FALLBACK_LAN_IP = '172.16.129.176';
const BACKEND_PORT = 5000;

/**
 * Automatically determine the backend server URL based on the current platform and network environment.
 * Never stores or exposes the API key on the client side.
 */
export const getBackendBaseUrl = () => {
  // Web browser environment
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location?.hostname) {
      return `http://${window.location.hostname}:${BACKEND_PORT}`;
    }
    return `http://localhost:${BACKEND_PORT}`;
  }

  // 1. Try extracting host IP from all known Expo runtime properties (SDK 50, 51, 52, 53, 54)
  const candidateHosts = [
    Constants.expoGoConfig?.debuggerHost,
    Constants.expoConfig?.hostUri,
    Constants.manifest?.debuggerHost,
    Constants.manifest2?.extra?.expoGo?.debuggerHost,
    Constants.manifest2?.extra?.expoClient?.hostUri,
    Constants.linkingUri,
    Constants.experienceUrl,
  ];

  for (const host of candidateHosts) {
    if (typeof host === 'string' && host.trim().length > 0) {
      // Look for IPv4 address in the string (e.g., 192.168.x.x or 172.16.x.x or 10.x.x.x)
      const ipMatch = host.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
      if (ipMatch && ipMatch[1]) {
        return `http://${ipMatch[1]}:${BACKEND_PORT}`;
      }
    }
  }

  // 2. Default to active LAN IP for physical phones connecting to the dev machine
  return `http://${FALLBACK_LAN_IP}:${BACKEND_PORT}`;
};
