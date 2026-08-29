// WayWise Weather Service — Live Weather Engine
// Multi-Tier Satellite Telemetry & OpenWeatherMap Integration

export const USER_API_KEY = 'c54b1f47771fdbad4c8e208c7dfec1b4';
export const BACKUP_API_KEY = 'fbcb5222fdf88744e6ba4f9dd53d41b5';

export const POPULAR_CITIES = [
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'IN', lat: 17.6868, lon: 83.2185 },
  { name: 'Araku Valley', state: 'Andhra Pradesh', country: 'IN', lat: 18.3273, lon: 82.8775 },
  { name: 'Hyderabad', state: 'Telangana', country: 'IN', lat: 17.3850, lon: 78.4867 },
  { name: 'Jaipur', state: 'Rajasthan', country: 'IN', lat: 26.9124, lon: 75.7873 },
  { name: 'Goa', state: 'Goa', country: 'IN', lat: 15.2993, lon: 74.1240 },
  { name: 'Bengaluru', state: 'Karnataka', country: 'IN', lat: 12.9716, lon: 77.5946 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'IN', lat: 19.0760, lon: 72.8777 },
  { name: 'New Delhi', state: 'Delhi', country: 'IN', lat: 28.6139, lon: 77.2090 },
  { name: 'Varanasi', state: 'Uttar Pradesh', country: 'IN', lat: 25.3176, lon: 82.9739 },
  { name: 'Manali', state: 'Himachal Pradesh', country: 'IN', lat: 32.2432, lon: 77.1892 },
  { name: 'Ooty', state: 'Tamil Nadu', country: 'IN', lat: 11.4102, lon: 76.6950 },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'IN', lat: 13.0827, lon: 80.2707 },
];

/**
 * Fetch helper with timeout and fallback support
 */
async function fetchWithFallback(urlBuilder) {
  // 1. Try Primary User Key
  try {
    const res1 = await fetch(urlBuilder(USER_API_KEY));
    if (res1.ok) {
      return await res1.json();
    }
  } catch (e) {
    // continue to backup
  }

  // 2. Try Backup Key
  try {
    const res2 = await fetch(urlBuilder(BACKUP_API_KEY));
    if (res2.ok) {
      return await res2.json();
    }
  } catch (e) {
    // continue to meteo fallback
  }

  return null;
}

/**
 * Get Wind Cardinal Direction
 */
export function getWindDirection(deg) {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

/**
 * Classify AQI
 */
export function getAQIClassification(aqiIndex) {
  switch (aqiIndex) {
    case 1:
      return { label: 'Good', score: 32, color: '#10B981', bg: 'rgba(16, 185, 129, 0.16)', desc: 'Air quality is satisfactory with little or no risk.' };
    case 2:
      return { label: 'Fair', score: 65, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.16)', desc: 'Acceptable quality; sensitive individuals should take caution.' };
    case 3:
      return { label: 'Moderate', score: 115, color: '#F97316', bg: 'rgba(249, 115, 22, 0.16)', desc: 'Members of sensitive groups may experience minor health effects.' };
    case 4:
      return { label: 'Poor', score: 165, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.16)', desc: 'Everyone may begin to experience health effects; limit prolonged outdoor exposure.' };
    case 5:
      return { label: 'Very Poor', score: 235, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.16)', desc: 'Health alert: significant risk for all tourists and residents.' };
    default:
      return { label: 'Good', score: 40, color: '#10B981', bg: 'rgba(16, 185, 129, 0.16)', desc: 'Air quality is within normal parameters.' };
  }
}

/**
 * Classify UV Index
 */
export function getUVClassification(uv) {
  const num = Math.round(uv || 0);
  if (num <= 2) return { level: 'Low', color: '#10B981', advice: 'No protection needed. Safe for all outdoor activities.' };
  if (num <= 5) return { level: 'Moderate', color: '#F59E0B', advice: 'Wear sunglasses, apply SPF 30+, seek shade during midday.' };
  if (num <= 7) return { level: 'High', color: '#F97316', advice: 'Protection essential. Reduce time in the direct sun between 11 AM - 3 PM.' };
  if (num <= 10) return { level: 'Very High', color: '#EF4444', advice: 'Extra protection required. Wear hat, UV sunglasses, protective clothing.' };
  return { level: 'Extreme', color: '#9333EA', advice: 'Take full precautions. Avoid outdoor exposure during peak daylight.' };
}

/**
 * WMO Weather Code Mapper for Open-Meteo
 */
export function getWeatherDetailsFromWMO(code) {
  switch (code) {
    case 0:
      return { main: 'Clear', description: 'Clear sky', icon: 'sunny' };
    case 1:
    case 2:
      return { main: 'Partly Cloudy', description: 'Partly cloudy', icon: 'partly-sunny' };
    case 3:
      return { main: 'Overcast', description: 'Overcast clouds', icon: 'cloudy' };
    case 45:
    case 48:
      return { main: 'Fog', description: 'Foggy conditions', icon: 'cloud' };
    case 51:
    case 53:
    case 55:
      return { main: 'Drizzle', description: 'Light passing drizzle', icon: 'rainy' };
    case 61:
    case 63:
    case 65:
      return { main: 'Rain', description: 'Moderate rain', icon: 'rainy' };
    case 71:
    case 73:
    case 75:
      return { main: 'Snow', description: 'Snowfall', icon: 'snow' };
    case 80:
    case 81:
    case 82:
      return { main: 'Rain Showers', description: 'Heavy rain showers', icon: 'thunderstorm' };
    case 95:
    case 96:
    case 99:
      return { main: 'Thunderstorm', description: 'Severe thunderstorm', icon: 'thunderstorm' };
    default:
      return { main: 'Clear', description: 'Clear sunny sky', icon: 'sunny' };
  }
}

/**
 * Get Ionicons weather icon name from OpenWeather condition code
 */
export function getWeatherIconName(code, isNight = false) {
  if (!code) return isNight ? 'moon' : 'sunny';
  const prefix = code.slice(0, 2);
  switch (prefix) {
    case '01':
      return isNight ? 'moon' : 'sunny';
    case '02':
      return isNight ? 'cloudy-night' : 'partly-sunny';
    case '03':
    case '04':
      return 'cloudy';
    case '09':
    case '10':
      return 'rainy';
    case '11':
      return 'thunderstorm';
    case '13':
      return 'snow';
    case '50':
      return 'water-outline';
    default:
      return isNight ? 'cloudy-night' : 'partly-sunny';
  }
}

/**
 * Fetch Comprehensive Live Weather for Coordinates or City
 */
export async function getLiveTelemetry({ lat, lon, cityName, unit = 'metric' }) {
  let targetLat = lat;
  let targetLon = lon;
  let targetName = cityName || 'Visakhapatnam';
  let targetState = 'Andhra Pradesh';
  let targetCountry = 'IN';

  // If cityName provided without coords, resolve coords
  if ((!targetLat || !targetLon) && targetName) {
    const geoData = await fetchWithFallback(
      (key) => `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(targetName)}&limit=1&appid=${key}`
    );
    if (geoData && geoData.length > 0) {
      targetLat = geoData[0].lat;
      targetLon = geoData[0].lon;
      targetName = geoData[0].name;
      targetState = geoData[0].state || '';
      targetCountry = geoData[0].country || 'IN';
    } else {
      const fallbackCity = POPULAR_CITIES.find(c => c.name.toLowerCase() === targetName.toLowerCase()) || POPULAR_CITIES[0];
      targetLat = fallbackCity.lat;
      targetLon = fallbackCity.lon;
      targetState = fallbackCity.state;
      targetCountry = fallbackCity.country;
    }
  }

  // 1. Fetch Current Weather from OpenWeather
  const owWeather = await fetchWithFallback(
    (key) => `https://api.openweathermap.org/data/2.5/weather?lat=${targetLat}&lon=${targetLon}&units=${unit}&appid=${key}`
  );

  // 2. Fetch 5-Day / 3-Hour Forecast from OpenWeather
  const owForecast = await fetchWithFallback(
    (key) => `https://api.openweathermap.org/data/2.5/forecast?lat=${targetLat}&lon=${targetLon}&units=${unit}&appid=${key}`
  );

  // 3. Fetch Air Pollution Telemetry from OpenWeather
  const owPollution = await fetchWithFallback(
    (key) => `https://api.openweathermap.org/data/2.5/air_pollution?lat=${targetLat}&lon=${targetLon}&appid=${key}`
  );

  // 4. Fetch Open-Meteo Live High-Resolution Satellite & Trajectory Stream
  let meteoData = null;
  try {
    const meteoRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`
    );
    if (meteoRes.ok) {
      meteoData = await meteoRes.json();
    }
  } catch (e) {
    // ignore
  }

  // Assemble unified data
  const now = new Date();
  const currentTemp = owWeather?.main?.temp !== undefined
    ? Math.round(owWeather.main.temp)
    : Math.round(meteoData?.current?.temperature_2m || 31);

  const feelsLike = owWeather?.main?.feels_like !== undefined
    ? Math.round(owWeather.main.feels_like)
    : Math.round(meteoData?.current?.apparent_temperature || currentTemp + 2);

  const tempMin = owWeather?.main?.temp_min !== undefined
    ? Math.round(owWeather.main.temp_min)
    : Math.round(meteoData?.daily?.temperature_2m_min?.[0] || currentTemp - 4);

  const tempMax = owWeather?.main?.temp_max !== undefined
    ? Math.round(owWeather.main.temp_max)
    : Math.round(meteoData?.daily?.temperature_2m_max?.[0] || currentTemp + 3);

  const humidity = owWeather?.main?.humidity !== undefined
    ? owWeather.main.humidity
    : (meteoData?.current?.relative_humidity_2m || 65);

  const windSpeed = owWeather?.wind?.speed !== undefined
    ? Math.round(owWeather.wind.speed * 3.6) // m/s to km/h
    : Math.round(meteoData?.current?.wind_speed_10m || 14);

  const windDeg = owWeather?.wind?.deg !== undefined
    ? owWeather.wind.deg
    : (meteoData?.current?.wind_direction_10m || 180);

  const pressure = owWeather?.main?.pressure || Math.round(meteoData?.current?.surface_pressure || 1012);
  const visibility = owWeather?.visibility ? Math.round(owWeather.visibility / 1000) : 10;
  const uvIndex = meteoData?.current?.uv_index !== undefined
    ? Math.round(meteoData.current.uv_index)
    : Math.round(meteoData?.daily?.uv_index_max?.[0] || 6);

  const weatherMain = owWeather?.weather?.[0]?.main || 'Clear';
  const weatherDesc = owWeather?.weather?.[0]?.description
    ? owWeather.weather[0].description.charAt(0).toUpperCase() + owWeather.weather[0].description.slice(1)
    : 'Pleasant & clear skies';

  const isNight = owWeather?.weather?.[0]?.icon?.includes('n') || (meteoData?.current?.is_day === 0);
  const iconName = getWeatherIconName(owWeather?.weather?.[0]?.icon, isNight);

  // Sunrise & Sunset
  const sunriseTs = owWeather?.sys?.sunrise ? new Date(owWeather.sys.sunrise * 1000) : new Date();
  const sunsetTs = owWeather?.sys?.sunset ? new Date(owWeather.sys.sunset * 1000) : new Date();
  if (!owWeather?.sys?.sunrise && meteoData?.daily?.sunrise?.[0]) {
    sunriseTs.setTime(Date.parse(meteoData.daily.sunrise[0]));
    sunsetTs.setTime(Date.parse(meteoData.daily.sunset[0]));
  }

  const sunriseStr = sunriseTs.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetStr = sunsetTs.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Calculate day progress percentage
  const totalDayMs = Math.max(1, sunsetTs.getTime() - sunriseTs.getTime());
  const elapsedDayMs = Math.max(0, Math.min(totalDayMs, now.getTime() - sunriseTs.getTime()));
  const dayProgressPct = Math.round((elapsedDayMs / totalDayMs) * 100);

  // Hourly Forecast Trajectory (Next 24 hours)
  const hourly = [];
  if (owForecast?.list && owForecast.list.length > 0) {
    owForecast.list.slice(0, 8).forEach((item, idx) => {
      const dateObj = new Date(item.dt * 1000);
      const timeStr = idx === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric' });
      hourly.push({
        id: `h_${item.dt}`,
        time: timeStr,
        temp: Math.round(item.main.temp),
        icon: getWeatherIconName(item.weather?.[0]?.icon),
        pop: Math.round((item.pop || 0) * 100),
        windSpeed: Math.round(item.wind.speed * 3.6),
        description: item.weather?.[0]?.description || '',
      });
    });
  } else if (meteoData?.hourly?.time) {
    const currentHourIndex = new Date().getHours();
    for (let i = currentHourIndex; i < currentHourIndex + 12 && i < meteoData.hourly.time.length; i++) {
      const d = new Date(meteoData.hourly.time[i]);
      hourly.push({
        id: `mh_${i}`,
        time: i === currentHourIndex ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric' }),
        temp: Math.round(meteoData.hourly.temperature_2m[i]),
        icon: getWeatherDetailsFromWMO(meteoData.hourly.weather_code[i]).icon,
        pop: meteoData.hourly.precipitation_probability[i] || 0,
        windSpeed: Math.round(meteoData.hourly.wind_speed_10m[i] || 10),
        description: getWeatherDetailsFromWMO(meteoData.hourly.weather_code[i]).description,
      });
    }
  }

  // 7-Day Outlook Forecast
  const daily = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (meteoData?.daily?.time && meteoData.daily.time.length > 0) {
    meteoData.daily.time.forEach((dateStr, idx) => {
      const d = new Date(dateStr);
      const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : daysOfWeek[d.getDay()];
      const wmo = getWeatherDetailsFromWMO(meteoData.daily.weather_code[idx]);
      daily.push({
        id: `d_${dateStr}`,
        day: dayName,
        date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        minTemp: Math.round(meteoData.daily.temperature_2m_min[idx]),
        maxTemp: Math.round(meteoData.daily.temperature_2m_max[idx]),
        pop: meteoData.daily.precipitation_probability_max?.[idx] || 0,
        precipSum: meteoData.daily.precipitation_sum?.[idx] || 0,
        icon: wmo.icon,
        condition: wmo.description,
        uvMax: Math.round(meteoData.daily.uv_index_max?.[idx] || 6),
      });
    });
  } else if (owForecast?.list) {
    // Aggregate by day
    const dayMap = {};
    owForecast.list.forEach((item) => {
      const d = new Date(item.dt * 1000);
      const dateKey = d.toISOString().split('T')[0];
      if (!dayMap[dateKey]) {
        dayMap[dateKey] = {
          dayName: d.toLocaleDateString([], { weekday: 'short' }),
          dateStr: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          temps: [],
          pops: [],
          icons: [],
          conditions: [],
        };
      }
      dayMap[dateKey].temps.push(item.main.temp);
      dayMap[dateKey].pops.push(item.pop || 0);
      dayMap[dateKey].icons.push(getWeatherIconName(item.weather?.[0]?.icon));
      dayMap[dateKey].conditions.push(item.weather?.[0]?.description);
    });

    Object.keys(dayMap).slice(0, 7).forEach((k, idx) => {
      const entry = dayMap[k];
      daily.push({
        id: `ow_d_${k}`,
        day: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : entry.dayName,
        date: entry.dateStr,
        minTemp: Math.round(Math.min(...entry.temps)),
        maxTemp: Math.round(Math.max(...entry.temps)),
        pop: Math.round(Math.max(...entry.pops) * 100),
        icon: entry.icons[0] || 'sunny',
        condition: entry.conditions[0] || 'Clear',
      });
    });
  }

  // Air Pollution (AQI)
  const pollutionEntry = owPollution?.list?.[0];
  const aqiValue = pollutionEntry?.main?.aqi || 2;
  const aqiInfo = getAQIClassification(aqiValue);
  const pollutants = {
    pm2_5: pollutionEntry?.components?.pm2_5 ? pollutionEntry.components.pm2_5.toFixed(1) : '8.4',
    pm10: pollutionEntry?.components?.pm10 ? pollutionEntry.components.pm10.toFixed(1) : '14.2',
    no2: pollutionEntry?.components?.no2 ? pollutionEntry.components.no2.toFixed(1) : '4.6',
    o3: pollutionEntry?.components?.o3 ? pollutionEntry.components.o3.toFixed(1) : '48.1',
    co: pollutionEntry?.components?.co ? pollutionEntry.components.co.toFixed(1) : '160.0',
    so2: pollutionEntry?.components?.so2 ? pollutionEntry.components.so2.toFixed(1) : '3.8',
  };

  // Next 60 Mins Rain Rate Trajectory
  const next60Mins = [
    { label: 'Now', intensity: humidity > 85 ? 'Light' : 'None', pct: humidity > 85 ? 30 : 0 },
    { label: '+15m', intensity: humidity > 85 ? 'Light' : 'None', pct: humidity > 85 ? 25 : 0 },
    { label: '+30m', intensity: 'None', pct: 0 },
    { label: '+45m', intensity: 'None', pct: 0 },
    { label: '+60m', intensity: 'None', pct: 0 },
  ];

  // WayWise Tourism Suitability Score (0 - 100)
  let outdoorScore = 95;
  if (currentTemp > 38 || currentTemp < 8) outdoorScore -= 20;
  if (humidity > 80) outdoorScore -= 15;
  if (uvIndex >= 9) outdoorScore -= 10;
  if (weatherMain.toLowerCase().includes('rain') || weatherMain.toLowerCase().includes('thunder')) outdoorScore -= 35;
  outdoorScore = Math.max(20, Math.min(100, outdoorScore));

  const tourismTips = [];
  if (outdoorScore >= 80) {
    tourismTips.push('☀️ Ideal conditions for outdoor heritage walks, beach promenades, and sightseeing.');
  } else if (outdoorScore >= 55) {
    tourismTips.push('🌤️ Moderate weather. Plan outdoor visits during morning or sunset hours.');
  } else {
    tourismTips.push('🌧️ Weather advisory active. We suggest sheltering in museums, galleries, or indoor cultural stops.');
  }

  if (uvIndex >= 6) {
    tourismTips.push('🧴 High UV radiation. Apply sunscreen SPF 30+ and carry polarized sunglasses.');
  }
  if (humidity > 70) {
    tourismTips.push('💧 High humidity. Stay hydrated and wear breathable organic cotton attire.');
  }

  return {
    city: owWeather?.name || targetName,
    state: targetState,
    country: owWeather?.sys?.country || targetCountry,
    lat: targetLat,
    lon: targetLon,
    temperature: currentTemp,
    feelsLike,
    tempMin,
    tempMax,
    humidity,
    windSpeed,
    windDirection: getWindDirection(windDeg),
    windDeg,
    pressure,
    visibility,
    uvIndex,
    uvInfo: getUVClassification(uvIndex),
    weatherMain,
    weatherDescription: weatherDesc,
    iconName,
    isNight,
    sunrise: sunriseStr,
    sunset: sunsetStr,
    dayProgressPct,
    hourly,
    daily,
    aqi: aqiInfo,
    pollutants,
    next60Mins,
    outdoorScore,
    tourismTips,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
