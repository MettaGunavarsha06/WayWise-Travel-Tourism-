export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const generateTripId = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 'ST2026';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Calculate Haversine distance in km
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// Returns dynamic greeting based on time of day (morning, afternoon, evening)
export const getTimeBasedGreeting = (t, userName = 'Gunavarsha') => {
  const hour = new Date().getHours();
  let key = 'goodMorning';
  let fallback = 'Good morning';

  if (hour >= 5 && hour < 12) {
    key = 'goodMorning';
    fallback = 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    key = 'goodAfternoon';
    fallback = 'Good afternoon';
  } else {
    key = 'goodEvening';
    fallback = 'Good evening';
  }

  const prefix = (t && typeof t === 'function' ? t(key) : null) || fallback;
  return `${prefix}, ${userName}`;
};

