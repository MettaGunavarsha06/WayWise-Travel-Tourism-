import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Circle } from 'react-native-svg';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  getLiveTelemetry,
  POPULAR_CITIES,
} from '../../utils/weatherService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PINNED_STORAGE_KEY = '@waywise_pinned_weather_cities';

export const WeatherScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();

  // State
  const [selectedCity, setSelectedCity] = useState(POPULAR_CITIES[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unit, setUnit] = useState('metric'); // 'metric' (°C) | 'imperial' (°F)
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pinnedCities, setPinnedCities] = useState([
    'Visakhapatnam',
    'Araku Valley',
    'Hyderabad',
    'Jaipur',
    'Goa',
  ]);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Rotation animation for refresh button
  const spinValue = useRef(new Animated.Value(0)).current;

  // Load pinned cities from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem(PINNED_STORAGE_KEY).then((val) => {
      if (val) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPinnedCities(parsed);
          }
        } catch (e) {}
      }
    });
  }, []);

  // Fetch weather when city or unit changes
  const fetchWeather = useCallback(async (cityObj = selectedCity, unitMode = unit) => {
    setLoading(true);
    try {
      const data = await getLiveTelemetry({
        lat: cityObj?.lat,
        lon: cityObj?.lon,
        cityName: cityObj?.name,
        unit: unitMode,
      });
      setWeatherData(data);
    } catch (err) {
      console.warn('Weather fetch error', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCity, unit]);

  useEffect(() => {
    fetchWeather(selectedCity, unit);
  }, [selectedCity, unit, fetchWeather]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Animated.sequence([
      Animated.timing(spinValue, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(spinValue, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start();
    fetchWeather(selectedCity, unit);
  }, [selectedCity, unit, fetchWeather, spinValue]);

  // GPS Auto-Location
  const handleGPSLocation = async () => {
    setGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Please allow GPS access to detect weather at your exact current location.'
        );
        setGpsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      let detectedName = 'Current Location';

      try {
        const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverse && reverse.length > 0) {
          detectedName = reverse[0].city || reverse[0].district || reverse[0].subregion || 'Local GPS';
        }
      } catch (e) {}

      const gpsCityObj = {
        name: detectedName,
        lat: latitude,
        lon: longitude,
        state: 'Local Region',
        country: 'IN',
      };

      setSelectedCity(gpsCityObj);
      setSearchQuery('');
      setIsSearchOpen(false);
    } catch (err) {
      Alert.alert('GPS Error', 'Could not obtain GPS coordinates. Using Visakhapatnam fallback.');
    } finally {
      setGpsLoading(false);
    }
  };

  // Toggle Pinned City
  const togglePinCity = async (cityName) => {
    const isPinned = pinnedCities.includes(cityName);
    let updated;
    if (isPinned) {
      updated = pinnedCities.filter((c) => c !== cityName);
    } else {
      updated = [...pinnedCities, cityName];
    }
    setPinnedCities(updated);
    await AsyncStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(updated));
  };

  // Unit conversion helper
  const formatTemp = (val) => {
    if (val === undefined || val === null) return '--°';
    return `${Math.round(val)}°${unit === 'metric' ? 'C' : 'F'}`;
  };

  const formatWind = (val) => {
    if (val === undefined || val === null) return '--';
    return `${val} ${unit === 'metric' ? 'km/h' : 'mph'}`;
  };

  // Filter cities for search dropdown
  const filteredSearchCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // SVG Trajectory Curve for Hourly Forecast
  const renderHourlyTrajectory = () => {
    if (!weatherData?.hourly || weatherData.hourly.length === 0) return null;

    const points = weatherData.hourly.slice(0, 8);
    const svgWidth = Math.max(SCREEN_WIDTH - 32, points.length * 60);
    const svgHeight = 65;
    const paddingX = 30;
    const paddingY = 16;

    const temps = points.map((p) => p.temp);
    const minT = Math.min(...temps);
    const maxT = Math.max(...temps);
    const rangeT = Math.max(1, maxT - minT);

    const coords = points.map((p, i) => {
      const x = paddingX + (i * (svgWidth - 2 * paddingX)) / (points.length - 1);
      const y = paddingY + ((maxT - p.temp) / rangeT) * (svgHeight - 2 * paddingY);
      return { x, y, temp: p.temp, time: p.time };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    const areaPathD = `${pathD} L ${coords[coords.length - 1].x} ${svgHeight} L ${coords[0].x} ${svgHeight} Z`;

    return (
      <View style={[styles.trajectoryContainer, { backgroundColor: theme.cardSecondary }]}>
        <View style={styles.trajectoryHeader}>
          <Ionicons name="analytics-outline" size={14} color={theme.primary} />
          <Text style={[styles.trajectoryTitle, { color: theme.textSecondary }]}>
            24-Hour Temperature Progression Trajectory
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: svgWidth, height: svgHeight + 10 }}>
            <Svg width={svgWidth} height={svgHeight}>
              <Defs>
                <SvgGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={theme.primary} stopOpacity="0.35" />
                  <Stop offset="100%" stopColor={theme.primary} stopOpacity="0.0" />
                </SvgGradient>
              </Defs>
              <Path d={areaPathD} fill="url(#tempGradient)" />
              <Path d={pathD} fill="none" stroke={theme.primary} strokeWidth={2.5} />
              {coords.map((c, idx) => (
                <Circle
                  key={idx}
                  cx={c.x}
                  cy={c.y}
                  r={3.5}
                  fill={theme.card}
                  stroke={theme.primary}
                  strokeWidth={2}
                />
              ))}
            </Svg>
          </View>
        </ScrollView>
      </View>
    );
  };

  const isCurrentPinned = pinnedCities.includes(selectedCity.name);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Top App Header & Weather Engine Badge */}
      <View style={[styles.topBar, { borderBottomColor: theme.border }]}>
        <View style={styles.brandRow}>
          <View style={[styles.liveDot, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.brandTitle, { color: theme.text }]}>Weather</Text>
          <View style={[styles.engineBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.engineBadgeText, { color: theme.primary }]}>LIVE TELEMETRY</Text>
          </View>
        </View>

        <View style={styles.topRightControls}>
          {/* Unit Toggle °C / °F */}
          <TouchableOpacity
            style={[styles.unitToggle, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
            onPress={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
            activeOpacity={0.8}
          >
            <Text style={[styles.unitText, unit === 'metric' && { color: theme.primary, fontWeight: '700' }]}>
              °C
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11 }}>|</Text>
            <Text style={[styles.unitText, unit === 'imperial' && { color: theme.primary, fontWeight: '700' }]}>
              °F
            </Text>
          </TouchableOpacity>

          {/* Refresh Button */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}
            onPress={onRefresh}
          >
            <Ionicons name="refresh-outline" size={17} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        {/* Search Bar & GPS Auto-Location Button */}
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: theme.card, borderColor: isSearchOpen ? theme.primary : theme.border },
            ]}
          >
            <Ionicons name="search-outline" size={18} color={theme.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              value={searchQuery}
              onChangeText={(txt) => {
                setSearchQuery(txt);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search city, district, or heritage spot..."
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* GPS Auto Location Button */}
          <TouchableOpacity
            style={[styles.gpsBtn, { backgroundColor: theme.primary }]}
            onPress={handleGPSLocation}
            disabled={gpsLoading}
          >
            {gpsLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="navigate" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Autocomplete Search Dropdown */}
        {isSearchOpen && searchQuery.length > 0 && (
          <View style={[styles.searchDropdown, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {filteredSearchCities.length === 0 ? (
              <TouchableOpacity
                style={styles.searchResultItem}
                onPress={() => {
                  setSelectedCity({ name: searchQuery, lat: null, lon: null });
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
              >
                <Ionicons name="location-outline" size={16} color={theme.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.searchResultText, { color: theme.text }]}>Search "{searchQuery}"</Text>
              </TouchableOpacity>
            ) : (
              filteredSearchCities.map((c) => (
                <TouchableOpacity
                  key={c.name}
                  style={[styles.searchResultItem, { borderBottomColor: theme.borderLight }]}
                  onPress={() => {
                    setSelectedCity(c);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <Ionicons name="location-outline" size={16} color={theme.primary} style={{ marginRight: 8 }} />
                  <View>
                    <Text style={[styles.searchResultTitle, { color: theme.text }]}>{c.name}</Text>
                    <Text style={[styles.searchResultSub, { color: theme.textSecondary }]}>
                      {c.state}, {c.country}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Pinned Favorite Cities Horizontal Bar */}
        <View style={styles.pinnedSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pinnedScroll}>
            {pinnedCities.map((pCity) => {
              const isActive = selectedCity.name.toLowerCase() === pCity.toLowerCase();
              return (
                <TouchableOpacity
                  key={pCity}
                  style={[
                    styles.pinnedChip,
                    {
                      backgroundColor: isActive ? theme.primary : theme.card,
                      borderColor: isActive ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => {
                    const matched = POPULAR_CITIES.find((c) => c.name.toLowerCase() === pCity.toLowerCase());
                    setSelectedCity(matched || { name: pCity, lat: null, lon: null });
                  }}
                >
                  <Ionicons
                    name={isActive ? 'bookmark' : 'bookmark-outline'}
                    size={12}
                    color={isActive ? '#FFFFFF' : theme.textSecondary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.pinnedText, { color: isActive ? '#FFFFFF' : theme.text }]}>
                    {pCity}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Resolving live satellite &amp; OpenWeather telemetry...
            </Text>
          </View>
        ) : weatherData ? (
          <>
            {/* HERO CURRENT WEATHER CARD */}
            <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.heroTopRow}>
                <View>
                  <View style={styles.locationTitleRow}>
                    <Text style={[styles.cityName, { color: theme.text }]}>{weatherData.city}</Text>
                    <TouchableOpacity
                      onPress={() => togglePinCity(weatherData.city)}
                      style={styles.pinIconBtn}
                    >
                      <Ionicons
                        name={isCurrentPinned ? 'star' : 'star-outline'}
                        size={18}
                        color={isCurrentPinned ? '#F59E0B' : theme.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.citySub, { color: theme.textSecondary }]}>
                    {weatherData.state ? `${weatherData.state}, ` : ''}{weatherData.country} • Updated {weatherData.lastUpdated}
                  </Text>
                </View>

                {/* Weather Condition Icon */}
                <View style={[styles.weatherIconCircle, { backgroundColor: theme.primaryLight }]}>
                  <Ionicons name={weatherData.iconName} size={38} color={theme.primary} />
                </View>
              </View>

              {/* Main Temp & Condition */}
              <View style={styles.tempSection}>
                <Text style={[styles.tempDisplay, { color: theme.text }]}>
                  {formatTemp(weatherData.temperature)}
                </Text>
                <View style={styles.tempMetaColumn}>
                  <Text style={[styles.weatherDesc, { color: theme.primary }]}>
                    {weatherData.weatherDescription}
                  </Text>
                  <Text style={[styles.feelsLikeText, { color: theme.textSecondary }]}>
                    Feels like {formatTemp(weatherData.feelsLike)} • H: {formatTemp(weatherData.tempMax)} L: {formatTemp(weatherData.tempMin)}
                  </Text>
                </View>
              </View>

              {/* Live Travel Suitability Banner */}
              <View
                style={[
                  styles.suitabilityBanner,
                  {
                    backgroundColor: weatherData.outdoorScore >= 80 ? 'rgba(16, 185, 129, 0.14)' : 'rgba(245, 158, 11, 0.14)',
                    borderColor: weatherData.outdoorScore >= 80 ? '#10B981' : '#F59E0B',
                  },
                ]}
              >
                <Ionicons
                  name={weatherData.outdoorScore >= 80 ? 'checkmark-circle' : 'alert-circle'}
                  size={16}
                  color={weatherData.outdoorScore >= 80 ? '#10B981' : '#F59E0B'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.suitabilityText,
                    { color: weatherData.outdoorScore >= 80 ? '#10B981' : '#F59E0B' },
                  ]}
                >
                  {weatherData.outdoorScore}% Tourism Suitability Score • {weatherData.outdoorScore >= 80 ? 'Optimal Outdoor Travel' : 'Weather Attention Recommended'}
                </Text>
              </View>
            </View>

            {/* HOURLY FORECAST (24-HOUR TRAJECTORY) */}
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={17} color={theme.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Hourly Forecast &amp; Trajectory</Text>
              </View>

              {renderHourlyTrajectory()}

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyScroll}>
                {weatherData.hourly.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.hourlyCard,
                      { backgroundColor: theme.card, borderColor: theme.border },
                    ]}
                  >
                    <Text style={[styles.hourlyTime, { color: theme.textSecondary }]}>{item.time}</Text>
                    <Ionicons name={item.icon} size={22} color={theme.primary} style={{ marginVertical: 6 }} />
                    <Text style={[styles.hourlyTemp, { color: theme.text }]}>{formatTemp(item.temp)}</Text>
                    {item.pop > 0 ? (
                      <View style={styles.hourlyPopRow}>
                        <Ionicons name="water" size={10} color="#3B82F6" />
                        <Text style={styles.hourlyPopText}>{item.pop}%</Text>
                      </View>
                    ) : (
                      <Text style={[styles.hourlyWindText, { color: theme.textMuted }]}>
                        {item.windSpeed} km/h
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* 7-DAY OUTLOOK (DAILY FORECAST) */}
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <Ionicons name="calendar-outline" size={17} color={theme.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>7-Day Weather Outlook</Text>
              </View>

              <View style={[styles.dailyCardWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {weatherData.daily.map((d, index) => (
                  <View
                    key={d.id}
                    style={[
                      styles.dailyRow,
                      index !== weatherData.daily.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.borderLight },
                    ]}
                  >
                    <View style={styles.dailyDayCol}>
                      <Text style={[styles.dailyDayName, { color: theme.text }]}>{d.day}</Text>
                      <Text style={[styles.dailyDateStr, { color: theme.textSecondary }]}>{d.date}</Text>
                    </View>

                    <View style={styles.dailyIconCol}>
                      <Ionicons name={d.icon} size={20} color={theme.primary} />
                      <Text style={[styles.dailyCondition, { color: theme.textSecondary }]} numberOfLines={1}>
                        {d.condition}
                      </Text>
                    </View>

                    {/* Progress Temperature Range Bar */}
                    <View style={styles.dailyTempRangeCol}>
                      <Text style={[styles.dailyMinTemp, { color: theme.textSecondary }]}>
                        {formatTemp(d.minTemp)}
                      </Text>
                      <View style={[styles.tempBarTrack, { backgroundColor: theme.cardSecondary }]}>
                        <View
                          style={[
                            styles.tempBarFill,
                            {
                              backgroundColor: theme.primary,
                              width: `${Math.min(100, Math.max(30, (d.maxTemp - d.minTemp) * 8))}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.dailyMaxTemp, { color: theme.text }]}>
                        {formatTemp(d.maxTemp)}
                      </Text>
                    </View>

                    {/* Rain probability */}
                    <View style={styles.dailyPopCol}>
                      <Ionicons name="umbrella-outline" size={12} color="#3B82F6" />
                      <Text style={styles.dailyPopText}>{d.pop}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* ATMOSPHERIC TELEMETRY BENTO GRID */}
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <Ionicons name="speedometer-outline" size={17} color={theme.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Atmospheric Telemetry &amp; Metrics</Text>
              </View>

              <View style={styles.bentoGrid}>
                {/* Wind Card */}
                <View style={[styles.bentoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.bentoHeaderRow}>
                    <Ionicons name="navigate-outline" size={16} color={theme.primary} />
                    <Text style={[styles.bentoLabel, { color: theme.textSecondary }]}>Wind Velocity</Text>
                  </View>
                  <Text style={[styles.bentoMainVal, { color: theme.text }]}>
                    {formatWind(weatherData.windSpeed)}
                  </Text>
                  <Text style={[styles.bentoSubVal, { color: theme.primary }]}>
                    Heading: {weatherData.windDirection} ({weatherData.windDeg}°)
                  </Text>
                </View>

                {/* Humidity Card */}
                <View style={[styles.bentoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.bentoHeaderRow}>
                    <Ionicons name="water-outline" size={16} color="#3B82F6" />
                    <Text style={[styles.bentoLabel, { color: theme.textSecondary }]}>Humidity</Text>
                  </View>
                  <Text style={[styles.bentoMainVal, { color: theme.text }]}>{weatherData.humidity}%</Text>
                  <Text style={[styles.bentoSubVal, { color: '#3B82F6' }]}>
                    {weatherData.humidity > 75 ? 'Humid' : weatherData.humidity < 40 ? 'Dry' : 'Comfortable'}
                  </Text>
                </View>

                {/* UV Index Card */}
                <View style={[styles.bentoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.bentoHeaderRow}>
                    <Ionicons name="sunny-outline" size={16} color={weatherData.uvInfo.color} />
                    <Text style={[styles.bentoLabel, { color: theme.textSecondary }]}>UV Radiation</Text>
                  </View>
                  <Text style={[styles.bentoMainVal, { color: weatherData.uvInfo.color }]}>
                    {weatherData.uvIndex} <Text style={{ fontSize: 13 }}>/ 11+</Text>
                  </Text>
                  <Text style={[styles.bentoSubVal, { color: weatherData.uvInfo.color }]}>
                    {weatherData.uvInfo.level} Risk
                  </Text>
                </View>

                {/* Pressure Card */}
                <View style={[styles.bentoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.bentoHeaderRow}>
                    <Ionicons name="swap-vertical-outline" size={16} color={theme.textSecondary} />
                    <Text style={[styles.bentoLabel, { color: theme.textSecondary }]}>Air Pressure</Text>
                  </View>
                  <Text style={[styles.bentoMainVal, { color: theme.text }]}>{weatherData.pressure} hPa</Text>
                  <Text style={[styles.bentoSubVal, { color: theme.textSecondary }]}>Sea Level Stable</Text>
                </View>

                {/* Visibility Card */}
                <View style={[styles.bentoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.bentoHeaderRow}>
                    <Ionicons name="eye-outline" size={16} color={theme.textSecondary} />
                    <Text style={[styles.bentoLabel, { color: theme.textSecondary }]}>Horizon Visibility</Text>
                  </View>
                  <Text style={[styles.bentoMainVal, { color: theme.text }]}>{weatherData.visibility} km</Text>
                  <Text style={[styles.bentoSubVal, { color: theme.textSecondary }]}>
                    {weatherData.visibility >= 10 ? 'Optimal Clarity' : 'Hazy Conditions'}
                  </Text>
                </View>

                {/* Next 60 Mins Precipitation */}
                <View style={[styles.bentoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.bentoHeaderRow}>
                    <Ionicons name="rainy-outline" size={16} color="#3B82F6" />
                    <Text style={[styles.bentoLabel, { color: theme.textSecondary }]}>Next 60 Mins</Text>
                  </View>
                  <Text style={[styles.bentoMainVal, { color: theme.text }]}>
                    {weatherData.humidity > 80 ? 'Light Risk' : 'Clear'}
                  </Text>
                  <Text style={[styles.bentoSubVal, { color: '#3B82F6' }]}>Rain Rate: 0.0 mm/h</Text>
                </View>
              </View>
            </View>

            {/* AIR QUALITY (AQI) POLLUTANT TELEMETRY */}
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <Ionicons name="leaf-outline" size={17} color={weatherData.aqi.color} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Air Quality Index (AQI)</Text>
              </View>

              <View style={[styles.aqiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.aqiTopRow}>
                  <View>
                    <View style={styles.aqiBadgeRow}>
                      <View style={[styles.aqiPill, { backgroundColor: weatherData.aqi.bg }]}>
                        <Text style={[styles.aqiPillText, { color: weatherData.aqi.color }]}>
                          AQI: {weatherData.aqi.label}
                        </Text>
                      </View>
                      <Text style={[styles.aqiScoreText, { color: theme.text }]}>
                        Index {weatherData.aqi.score}
                      </Text>
                    </View>
                    <Text style={[styles.aqiDescText, { color: theme.textSecondary }]}>
                      {weatherData.aqi.desc}
                    </Text>
                  </View>
                </View>

                {/* Pollutant Breakdown Meters */}
                <View style={styles.pollutantsGrid}>
                  {[
                    { key: 'PM2.5', val: weatherData.pollutants.pm2_5, unit: 'µg/m³' },
                    { key: 'PM10', val: weatherData.pollutants.pm10, unit: 'µg/m³' },
                    { key: 'NO2', val: weatherData.pollutants.no2, unit: 'µg/m³' },
                    { key: 'O3', val: weatherData.pollutants.o3, unit: 'µg/m³' },
                    { key: 'CO', val: weatherData.pollutants.co, unit: 'µg/m³' },
                    { key: 'SO2', val: weatherData.pollutants.so2, unit: 'µg/m³' },
                  ].map((p) => (
                    <View key={p.key} style={[styles.pollutantBox, { backgroundColor: theme.cardSecondary }]}>
                      <Text style={[styles.pollutantKey, { color: theme.textSecondary }]}>{p.key}</Text>
                      <Text style={[styles.pollutantVal, { color: theme.text }]}>{p.val}</Text>
                      <Text style={[styles.pollutantUnit, { color: theme.textMuted }]}>{p.unit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* SOLAR CYCLE & DAY PROGRESSION */}
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sunny" size={17} color="#F59E0B" style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Solar Cycle &amp; Daylight</Text>
              </View>

              <View style={[styles.solarCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.solarTimesRow}>
                  <View style={styles.solarItem}>
                    <Ionicons name="sunny-outline" size={20} color="#F59E0B" />
                    <Text style={[styles.solarLabel, { color: theme.textSecondary }]}>Sunrise</Text>
                    <Text style={[styles.solarTime, { color: theme.text }]}>{weatherData.sunrise}</Text>
                  </View>

                  <View style={styles.solarItem}>
                    <Ionicons name="moon-outline" size={20} color="#6366F1" />
                    <Text style={[styles.solarLabel, { color: theme.textSecondary }]}>Sunset</Text>
                    <Text style={[styles.solarTime, { color: theme.text }]}>{weatherData.sunset}</Text>
                  </View>
                </View>

                {/* Day Progress Arc */}
                <View style={styles.dayProgressWrap}>
                  <View style={[styles.dayProgressTrack, { backgroundColor: theme.cardSecondary }]}>
                    <View
                      style={[
                        styles.dayProgressFill,
                        { backgroundColor: '#F59E0B', width: `${weatherData.dayProgressPct}%` },
                      ]}
                    />
                  </View>
                  <Text style={[styles.dayProgressSub, { color: theme.textSecondary }]}>
                    {weatherData.dayProgressPct}% of today's solar daylight elapsed
                  </Text>
                </View>
              </View>
            </View>

            {/* WAYWISE TRAVEL & TOURISM WEATHER ADVISORY */}
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <Ionicons name="compass-outline" size={17} color={theme.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>WayWise Tourist Weather Advisory</Text>
              </View>

              <View style={[styles.travelCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {weatherData.tourismTips.map((tip, idx) => (
                  <View key={idx} style={styles.tipRow}>
                    <Text style={[styles.tipText, { color: theme.text }]}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  brandTitle: {
    fontSize: 17,
    fontFamily: 'Manrope_700Bold',
  },
  engineBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  engineBadgeText: {
    fontSize: 9,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: 0.5,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unitText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    color: '#888888',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
    height: '100%',
  },
  gpsBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchDropdown: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchResultTitle: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
  },
  searchResultSub: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
  },
  searchResultText: {
    fontSize: 13,
    fontFamily: 'Manrope_500Medium',
  },

  // Pinned Chips
  pinnedSection: {
    marginBottom: 14,
  },
  pinnedScroll: {
    gap: 8,
  },
  pinnedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pinnedText: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
  },

  loadingBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
  },

  // Hero Card
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cityName: {
    fontSize: 22,
    fontFamily: 'Manrope_700Bold',
  },
  pinIconBtn: {
    padding: 2,
  },
  citySub: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginTop: 2,
  },
  weatherIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  tempDisplay: {
    fontSize: 48,
    fontFamily: 'Manrope_800ExtraBold',
    lineHeight: 52,
  },
  tempMetaColumn: {
    flex: 1,
  },
  weatherDesc: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 2,
  },
  feelsLikeText: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 16,
  },
  suitabilityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  suitabilityText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_600SemiBold',
    flex: 1,
  },

  // Sections
  sectionWrap: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
  },

  // Hourly Trajectory
  trajectoryContainer: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  trajectoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  trajectoryTitle: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },
  hourlyScroll: {
    gap: 8,
  },
  hourlyCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 70,
  },
  hourlyTime: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  hourlyTemp: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
  },
  hourlyPopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  hourlyPopText: {
    fontSize: 10,
    fontFamily: 'Manrope_600SemiBold',
    color: '#3B82F6',
  },
  hourlyWindText: {
    fontSize: 9.5,
    fontFamily: 'Manrope_400Regular',
    marginTop: 4,
  },

  // 7-Day Outlook
  dailyCardWrap: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  dailyDayCol: {
    width: 75,
  },
  dailyDayName: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  dailyDateStr: {
    fontSize: 10.5,
    fontFamily: 'Manrope_400Regular',
  },
  dailyIconCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dailyCondition: {
    fontSize: 11.5,
    fontFamily: 'Manrope_500Medium',
    flex: 1,
  },
  dailyTempRangeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 105,
  },
  dailyMinTemp: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
  tempBarTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  tempBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  dailyMaxTemp: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
  dailyPopCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    width: 45,
    justifyContent: 'flex-end',
  },
  dailyPopText: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
    color: '#3B82F6',
  },

  // Bento Grid
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bentoCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  bentoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  bentoLabel: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
  bentoMainVal: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 2,
  },
  bentoSubVal: {
    fontSize: 11,
    fontFamily: 'Manrope_600SemiBold',
  },

  // AQI Card
  aqiCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  aqiTopRow: {
    marginBottom: 12,
  },
  aqiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  aqiPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aqiPillText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
  aqiScoreText: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
  },
  aqiDescText: {
    fontSize: 11.5,
    fontFamily: 'Manrope_400Regular',
  },
  pollutantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pollutantBox: {
    flex: 1,
    minWidth: (SCREEN_WIDTH - 76) / 3,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  pollutantKey: {
    fontSize: 10,
    fontFamily: 'Manrope_600SemiBold',
  },
  pollutantVal: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
    marginVertical: 1,
  },
  pollutantUnit: {
    fontSize: 8.5,
    fontFamily: 'Manrope_400Regular',
  },

  // Solar Card
  solarCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  solarTimesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  solarItem: {
    alignItems: 'center',
  },
  solarLabel: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
    marginTop: 4,
  },
  solarTime: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    marginTop: 2,
  },
  dayProgressWrap: {
    marginTop: 4,
  },
  dayProgressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  dayProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  dayProgressSub: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    textAlign: 'center',
  },

  // Travel Card
  travelCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    lineHeight: 18,
  },
});
