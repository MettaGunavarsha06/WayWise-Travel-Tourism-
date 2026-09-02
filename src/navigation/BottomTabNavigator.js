import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { HomeScreen } from '../screens/home/HomeScreen';
import { WeatherScreen } from '../screens/weather/WeatherScreen';
import { MyTripsScreen } from '../screens/planner/MyTripsScreen';
import { SmartMapScreen } from '../screens/map/SmartMapScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { getLiveTelemetry } from '../utils/weatherService';

const TABS = [
  { key: 'HomeTab', name: 'Home', Component: HomeScreen },
  { key: 'WeatherTab', name: 'Climate', Component: WeatherScreen },
  { key: 'TripsTab', name: 'Trips', Component: MyTripsScreen },
  { key: 'MapTab', name: 'Map', Component: SmartMapScreen },
  { key: 'ProfileTab', name: 'Profile', Component: ProfileScreen },
];

const TAB_BAR_MARGIN = 24;
const TAB_BAR_PADDING = 6;
const PILL_SIZE = 46;

// Memoized Screen Page to prevent massive multi-screen re-renders during swiping and tab switching
const TabScreenItem = React.memo(({ ScreenComponent, navigation, screenWidth }) => {
  return (
    <View style={[styles.screenPage, { width: screenWidth }]}>
      {ScrollView.Context ? (
        <ScrollView.Context.Provider value={null}>
          <ScreenComponent navigation={navigation} />
        </ScrollView.Context.Provider>
      ) : (
        <ScreenComponent navigation={navigation} />
      )}
    </View>
  );
});

export const BottomTabNavigator = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage?.() || { t: (k) => k };
  const insets = useSafeAreaInsets();

  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  const [climateType, setClimateType] = useState('cloud');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const pillScale = useRef(new Animated.Value(1)).current;

  // Window dimension listener
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => sub?.remove?.();
  }, []);

  const screenWidth = dimensions.width;

  useEffect(() => {
    let isMounted = true;
    const loadClimateStatus = async () => {
      try {
        const data = await getLiveTelemetry({ lat: 17.6868, lon: 83.2185 });
        if (data && isMounted) {
          const rawIcon = (data.iconName || '').toLowerCase();
          if (rawIcon.includes('rain')) {
            setClimateType('rainy');
          } else if (rawIcon.includes('thunder')) {
            setClimateType('thunderstorm');
          } else if (rawIcon.includes('snow')) {
            setClimateType('snow');
          } else if (rawIcon.includes('sunny') && !rawIcon.includes('partly')) {
            setClimateType('sunny');
          } else if (rawIcon.includes('partly')) {
            setClimateType('partly-sunny');
          } else {
            setClimateType('cloud');
          }
        }
      } catch (e) {
        if (isMounted) setClimateType('cloud');
      }
    };

    loadClimateStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const goToTab = useCallback((index) => {
    const targetIndex = Math.max(0, Math.min(index, TABS.length - 1));
    setActiveTabIndex(targetIndex);

    // Instant tactile feedback on pill
    Animated.sequence([
      Animated.timing(pillScale, {
        toValue: 0.88,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(pillScale, {
        toValue: 1,
        friction: 5,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();

    // Smooth native scroll to target screen
    scrollViewRef.current?.scrollTo({
      x: targetIndex * screenWidth,
      animated: true,
    });
  }, [screenWidth, pillScale]);

  // Stable navigation object that NEVER triggers child re-renders
  const goToTabRef = useRef(goToTab);
  goToTabRef.current = goToTab;

  const setScrollEnabledRef = useRef(setIsScrollEnabled);
  setScrollEnabledRef.current = setIsScrollEnabled;

  const tabNavigation = useMemo(() => {
    return {
      ...navigation,
      navigate: (screenName, params) => {
        const tabIdx = TABS.findIndex((t) => t.key === screenName);
        if (tabIdx !== -1) {
          goToTabRef.current(tabIdx);
        } else {
          navigation?.navigate(screenName, params);
        }
      },
      setTabScrollEnabled: (enabled) => {
        setScrollEnabledRef.current(enabled);
      },
    };
  }, [navigation]);

  const onMomentumScrollEnd = useCallback((e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / screenWidth);
    if (newIndex >= 0 && newIndex < TABS.length && newIndex !== activeTabIndex) {
      setActiveTabIndex(newIndex);
    }
  }, [screenWidth, activeTabIndex]);

  const getClimateIcon = (focused) => {
    if (climateType === 'rainy') return focused ? 'rainy' : 'rainy-outline';
    if (climateType === 'thunderstorm') return focused ? 'thunderstorm' : 'thunderstorm-outline';
    if (climateType === 'snow') return focused ? 'snow' : 'snow-outline';
    if (climateType === 'sunny') return focused ? 'sunny' : 'sunny-outline';
    if (climateType === 'partly-sunny') return focused ? 'partly-sunny' : 'partly-sunny-outline';
    return focused ? 'cloud' : 'cloud-outline';
  };

  const getTabIcon = (tabKey, focused) => {
    switch (tabKey) {
      case 'HomeTab':
        return focused ? 'home' : 'home-outline';
      case 'WeatherTab':
        return getClimateIcon(focused);
      case 'TripsTab':
        return focused ? 'albums' : 'albums-outline';
      case 'MapTab':
        return focused ? 'map' : 'map-outline';
      case 'ProfileTab':
        return focused ? 'person' : 'person-outline';
      default:
        return 'ellipse-outline';
    }
  };

  // Dimensions for bottom bar floating capsule
  const usableWidth = screenWidth - (TAB_BAR_MARGIN * 2) - (TAB_BAR_PADDING * 2);
  const tabWidth = usableWidth / TABS.length;
  const pillLeftOffset = TAB_BAR_PADDING + (tabWidth - PILL_SIZE) / 2;

  // Real-time 60fps native pill translation tracking swipe gesture 1:1
  const indicatorTranslateX = scrollX.interpolate({
    inputRange: TABS.map((_, i) => i * screenWidth),
    outputRange: TABS.map((_, i) => pillLeftOffset + i * tabWidth),
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* 100% Fluid 60/120fps Horizontal Swipe Pager with gesture support */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        decelerationRate="normal"
        directionalLockEnabled={true}
        nestedScrollEnabled={true}
        scrollEnabled={isScrollEnabled}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.slidingTrack}
        contentContainerStyle={{ width: screenWidth * TABS.length }}
      >
        {TABS.map((tab) => (
          <TabScreenItem
            key={tab.key}
            ScreenComponent={tab.Component}
            navigation={tabNavigation}
            screenWidth={screenWidth}
          />
        ))}
      </Animated.ScrollView>

      {/* Floating Liquid Glass Bottom Navigation Bar */}
      <View
        style={[
          styles.customTabBar,
          {
            bottom: insets.bottom > 0 ? insets.bottom + 8 : 18,
            backgroundColor: isDark ? 'rgba(22, 25, 33, 0.94)' : 'rgba(255, 255, 255, 0.94)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          },
        ]}
      >
        {/* Real-time Sliding Active Capsule Indicator */}
        <Animated.View
          style={[
            styles.activeIndicatorPill,
            {
              backgroundColor: isDark ? '#FFFFFF' : (theme.primary || '#2563EB'),
              transform: [
                { translateX: indicatorTranslateX },
                { scale: pillScale },
              ],
            },
          ]}
        />

        {/* Tab Items */}
        {TABS.map((tab, index) => {
          const isSelected = activeTabIndex === index;
          const activeIconName = getTabIcon(tab.key, true);
          const inactiveIconName = getTabIcon(tab.key, false);

          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
              onPress={() => goToTab(index)}
              style={styles.tabItem}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isSelected ? activeIconName : inactiveIconName}
                  size={22}
                  color={
                    isSelected
                      ? (isDark ? '#111216' : '#FFFFFF')
                      : (isDark ? '#8E95A5' : '#64748B')
                  }
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  slidingTrack: {
    flex: 1,
  },
  screenPage: {
    flex: 1,
    height: '100%',
  },
  customTabBar: {
    position: 'absolute',
    left: TAB_BAR_MARGIN,
    right: TAB_BAR_MARGIN,
    height: 64,
    borderRadius: 36,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 16,
    paddingHorizontal: TAB_BAR_PADDING,
    zIndex: 100,
  },
  activeIndicatorPill: {
    position: 'absolute',
    top: 9,
    left: 0,
    width: PILL_SIZE,
    height: PILL_SIZE,
    borderRadius: PILL_SIZE / 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  tabItem: {
    flex: 1,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconContainer: {
    width: PILL_SIZE,
    height: PILL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
