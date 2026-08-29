import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * RealLeafletMap - State-of-the-Art Interactive Real Map Engine
 * Renders real OpenStreetMap, CartoDB, and Satellite tiles with custom unique pins
 */
export const RealLeafletMap = ({
  userLocation,
  places = [],
  selectedPlace = null,
  onSelectPlace,
  mapType = 'standard', // 'standard' | 'satellite' | 'dark' | 'terrain'
  showRoute = true,
  isDarkMode = false,
}) => {
  const webViewRef = useRef(null);

  const centerLat = selectedPlace?.coords?.latitude || userLocation?.latitude || 17.7120;
  const centerLng = selectedPlace?.coords?.longitude || userLocation?.longitude || 83.3240;

  // Generate HTML for the Leaflet Map
  const generateMapHtml = () => {
    const placesJson = JSON.stringify(places);
    const userLocationJson = JSON.stringify(userLocation || { latitude: 17.7120, longitude: 83.3240 });
    const selectedPlaceJson = JSON.stringify(selectedPlace || null);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; overflow: hidden; background: #0F172A; }
    
    /* Custom User Pulse Marker */
    .user-pulse-container {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-pulse-beacon {
      position: absolute;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(37, 99, 235, 0.35);
      animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }
    .user-pulse-dot {
      position: relative;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #2563EB;
      border: 2.5px solid #FFFFFF;
      box-shadow: 0 0 10px rgba(37, 99, 235, 0.8);
      z-index: 2;
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.6); opacity: 0.9; }
      100% { transform: scale(1.6); opacity: 0; }
    }

    /* Custom Unique Place Pin */
    .place-pin-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transform: translate(-50%, -100%);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .place-pin-wrap.selected {
      z-index: 1000 !important;
      transform: translate(-50%, -100%) scale(1.25);
    }
    .place-pin-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 17px;
      background: #FFFFFF;
      border: 2.5px solid #2563EB;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-size: 16px;
      position: relative;
    }
    .place-pin-badge.selected {
      border-color: #FFFFFF !important;
      box-shadow: 0 0 0 4px #2563EB, 0 8px 18px rgba(0,0,0,0.4);
    }
    .place-pin-tip {
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 7px solid #2563EB;
      margin-top: -1px;
    }
    .place-distance-tag {
      background: rgba(15, 23, 42, 0.85);
      color: #FFFFFF;
      font-size: 9px;
      font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 1px 5px;
      border-radius: 8px;
      margin-top: 2px;
      white-space: nowrap;
      border: 1px solid rgba(255,255,255,0.2);
    }

    /* Custom Map Controls */
    .leaflet-bar {
      border: none !important;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
      border-radius: 12px !important;
      overflow: hidden;
    }
    .leaflet-bar a {
      background: rgba(255, 255, 255, 0.95) !important;
      color: #0F172A !important;
      border-bottom: 1px solid #E2E8F0 !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    var currentPlaces = ${placesJson};
    var currentUserLocation = ${userLocationJson};
    var currentSelectedPlace = ${selectedPlaceJson};
    var mapType = '${mapType}';
    var isDarkMode = ${isDarkMode ? 'true' : 'false'};

    // Map Tile URL Definitions
    var tileLayers = {
      standard: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
    };

    var chosenTile = tileLayers[mapType] || (isDarkMode ? tileLayers.dark : tileLayers.standard);

    // Initialize Leaflet Map
    var initialLat = currentSelectedPlace ? currentSelectedPlace.coords.latitude : currentUserLocation.latitude;
    var initialLng = currentSelectedPlace ? currentSelectedPlace.coords.longitude : currentUserLocation.longitude;

    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([initialLat, initialLng], 14);

    // Add Tiles
    var activeTileLayer = L.tileLayer(chosenTile, {
      maxZoom: 19,
      subdomains: 'abcd',
      crossOrigin: true
    }).addTo(map);

    // Add Zoom Control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Markers layer group
    var markersGroup = L.layerGroup().addTo(map);
    var routeLayer = null;

    // Send Message to React Native
    function notifyRN(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } else if (window.parent) {
        window.parent.postMessage(JSON.stringify(data), '*');
      }
    }

    // Render User Location Pulsing Dot
    function renderUserLocation() {
      if (!currentUserLocation) return;

      var userIcon = L.divIcon({
        className: 'user-pulse-div',
        html: '<div class="user-pulse-container"><div class="user-pulse-beacon"></div><div class="user-pulse-dot"></div></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      L.marker([currentUserLocation.latitude, currentUserLocation.longitude], {
        icon: userIcon,
        zIndexOffset: 500
      }).addTo(map);

      // Accuracy circle
      L.circle([currentUserLocation.latitude, currentUserLocation.longitude], {
        radius: 120,
        color: '#2563EB',
        fillColor: '#3B82F6',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(map);
    }

    // Render Place Markers
    function renderPlaceMarkers() {
      markersGroup.clearLayers();

      currentPlaces.forEach(function(place) {
        var isSelected = currentSelectedPlace && currentSelectedPlace.id === place.id;
        var sym = place.symbolConfig || { symbol: '📍', color: '#2563EB', bg: '#EFF6FF' };

        var html = '<div class="place-pin-wrap ' + (isSelected ? 'selected' : '') + '">' +
          '<div class="place-pin-badge ' + (isSelected ? 'selected' : '') + '" style="border-color: ' + sym.color + '; background: ' + (isSelected ? sym.color : sym.bg) + ';">' +
            sym.symbol +
          '</div>' +
          '<div class="place-pin-tip" style="border-top-color: ' + sym.color + ';"></div>' +
          '<div class="place-distance-tag">' + (place.distanceKm || 0) + ' km</div>' +
        '</div>';

        var customIcon = L.divIcon({
          className: 'custom-place-marker',
          html: html,
          iconSize: [60, 50],
          iconAnchor: [30, 45]
        });

        var marker = L.marker([place.coords.latitude, place.coords.longitude], {
          icon: customIcon,
          zIndexOffset: isSelected ? 900 : 100
        });

        marker.on('click', function() {
          notifyRN({ type: 'SELECT_PLACE', placeId: place.id });
        });

        markersGroup.addLayer(marker);
      });
    }

    // Draw route line from User to Selected Place
    function drawRouteLine() {
      if (routeLayer) {
        map.removeLayer(routeLayer);
        routeLayer = null;
      }

      if (!currentSelectedPlace || !currentUserLocation) return;

      var start = [currentUserLocation.latitude, currentUserLocation.longitude];
      var end = [currentSelectedPlace.coords.latitude, currentSelectedPlace.coords.longitude];

      // Mid-arc curve for realistic path
      var midLat = (start[0] + end[0]) / 2 + 0.0008;
      var midLng = (start[1] + end[1]) / 2 - 0.0008;

      routeLayer = L.polyline([start, [midLat, midLng], end], {
        color: '#2563EB',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 6',
        lineCap: 'round'
      }).addTo(map);
    }

    // Initialize all layers
    renderUserLocation();
    renderPlaceMarkers();
    drawRouteLine();

    // Listen for messages from React Native
    window.addEventListener('message', function(event) {
      try {
        var data = JSON.parse(event.data);
        if (data.type === 'PAN_TO') {
          map.flyTo([data.lat, data.lng], data.zoom || 15, { duration: 1.2 });
        }
      } catch (e) {}
    });

  </script>
</body>
</html>
    `;
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SELECT_PLACE' && onSelectPlace) {
        const found = places.find((p) => p.id === data.placeId);
        if (found) {
          onSelectPlace(found);
        }
      }
    } catch (e) {
      console.warn('Error parsing map message:', e);
    }
  };

  // On Web: Render standard responsive iframe with full interactivity
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          title="Interactive Smart Tourism Real Map"
          srcDoc={generateMapHtml()}
          style={{ width: '100%', height: '100%', border: 'none' }}
          onLoad={(e) => {
            window.addEventListener('message', (msg) => {
              try {
                const data = JSON.parse(msg.data);
                if (data.type === 'SELECT_PLACE' && onSelectPlace) {
                  const found = places.find((p) => p.id === data.placeId);
                  if (found) onSelectPlace(found);
                }
              } catch (err) {}
            });
          }}
        />
      </View>
    );
  }

  // On Native Mobile: Render GPU-accelerated WebView
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: generateMapHtml() }}
        style={styles.webView}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  webView: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});
