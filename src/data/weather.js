export const weatherData = {
  dest_vizag: {
    city: 'Visakhapatnam',
    temp: '29°C',
    condition: 'Partly Cloudy',
    icon: 'partly-sunny',
    humidity: '72%',
    wind: '14 km/h',
    rainProbability: 20,
    forecast: [
      { day: 'Today', temp: '29°C', condition: 'Sunny & Coastal Breeze', icon: 'sunny', rainProb: 10, alert: null },
      { day: 'Tomorrow', temp: '25°C', condition: 'Heavy Coastal Rains', icon: 'rainy', rainProb: 85, alert: '🌧️ Heavy rain expected tomorrow from 11:00 AM. Outdoor beaches & hilltop parks may be slippery. SmartTour suggests switching to Submarine & Aircraft Museums.' },
      { day: 'Day 3', temp: '27°C', condition: 'Scattered Showers', icon: 'cloudy', rainProb: 40, alert: null },
      { day: 'Day 4', temp: '30°C', condition: 'Clear Sky', icon: 'sunny', rainProb: 15, alert: null },
    ]
  },
  dest_araku: {
    city: 'Araku Valley',
    temp: '21°C',
    condition: 'Misty & Pleasant',
    icon: 'cloud',
    humidity: '65%',
    wind: '8 km/h',
    rainProbability: 15,
    forecast: [
      { day: 'Today', temp: '22°C', condition: 'Cool Fog', icon: 'cloud', rainProb: 10, alert: null },
      { day: 'Tomorrow', temp: '20°C', condition: 'Gentle Drizzle', icon: 'rainy', rainProb: 60, alert: '🌧️ Moderate mountain showers tomorrow. We suggest Borra Caves and Tribal Museum instead of Katiki trek.' },
      { day: 'Day 3', temp: '23°C', condition: 'Sunny & Crisp', icon: 'sunny', rainProb: 10, alert: null },
    ]
  },
  dest_tirupati: {
    city: 'Tirupati',
    temp: '31°C',
    condition: 'Sunny',
    icon: 'sunny',
    humidity: '58%',
    wind: '10 km/h',
    rainProbability: 5,
    forecast: [
      { day: 'Today', temp: '31°C', condition: 'Sunny & Clear', icon: 'sunny', rainProb: 5, alert: null },
      { day: 'Tomorrow', temp: '32°C', condition: 'Hot & Clear', icon: 'sunny', rainProb: 10, alert: null },
      { day: 'Day 3', temp: '30°C', condition: 'Mild Breeze', icon: 'partly-sunny', rainProb: 15, alert: null },
    ]
  },
  dest_goa: {
    city: 'South Goa',
    temp: '28°C',
    condition: 'Breezy & Sunny',
    icon: 'sunny',
    humidity: '68%',
    wind: '18 km/h',
    rainProbability: 25,
    forecast: [
      { day: 'Today', temp: '28°C', condition: 'Sunny Beach Weather', icon: 'sunny', rainProb: 20, alert: null },
      { day: 'Tomorrow', temp: '27°C', condition: 'Passing Showers', icon: 'rainy', rainProb: 70, alert: '🌧️ Afternoon downpour forecasted. Great day for Old Goa indoor cathedrals & Portuguese museums.' },
      { day: 'Day 3', temp: '29°C', condition: 'Clear', icon: 'sunny', rainProb: 15, alert: null },
      { day: 'Day 4', temp: '29°C', condition: 'Pleasant', icon: 'partly-sunny', rainProb: 20, alert: null },
    ]
  },
};

export const defaultWeather = {
  temp: '28°C',
  condition: 'Pleasant Coastal Weather',
  icon: 'partly-sunny',
  humidity: '65%',
  rainAlert: false,
};
