# RFC-004: Map Integration & Navigation

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** XL  
**Estimated Duration:** 2 semanas  
**Dependencies:** RFC-001, RFC-002, RFC-003

---

## Resumen

Este RFC implementa la integración completa de Mapbox GL en Atlas Personal, incluyendo navegación interactiva del mapa (zoom, pan, rotate), cambio de estilos (standard/satellite), clustering de pins, botón "Mi ubicación", y persistencia del estado del mapa. Este es el componente visual principal de la aplicación.

**Objetivo:** Usuarios pueden navegar un mapa mundial interactivo de forma fluida (60 fps), cambiar estilos visuales, y el mapa recuerda la última ubicación vista.

---

## Características Cubiertas

- **F-010:** Integración de Mapbox GL
- **F-011:** Navegación de mapa (pan, zoom)
- **F-012:** Cambio entre vistas de mapa (Standard/Satellite)
- **F-013:** Visualización de pines en mapa
- **F-014:** Clustering de pines
- **F-015:** Tap en pin para ver detalles rápidos
- **F-016:** Centrar mapa en ubicación actual
- **F-017:** Persistencia de región de mapa vista

---

## Especificaciones Técnicas

### 1. Map State Management

#### 1.1 Map Types

**`src/features/map/types/map.ts`:**
```typescript
export interface MapRegion {
  latitude: number;
  longitude: number;
  zoomLevel: number;
  bearing: number; // 0-360 degrees
  pitch: number; // 0-60 degrees
}

export interface MapStyle {
  name: 'standard' | 'satellite';
  uri: string;
}

export interface MapState {
  currentRegion: MapRegion | null;
  currentStyle: MapStyle;
  isMapReady: boolean;
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  followUserLocation: boolean;
}

export const MAP_STYLES: Record<string, MapStyle> = {
  standard: {
    name: 'standard',
    uri: 'mapbox://styles/mapbox/streets-v12',
  },
  satellite: {
    name: 'satellite',
    uri: 'mapbox://styles/mapbox/satellite-streets-v12',
  },
};

export const DEFAULT_REGION: MapRegion = {
  latitude: 20,
  longitude: 0,
  zoomLevel: 2,
  bearing: 0,
  pitch: 0,
};
```

### 2. Redux Map Slice

**`src/features/map/mapSlice.ts`:**
```typescript
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MapState, MapRegion, MapStyle, MAP_STYLES, DEFAULT_REGION} from './types/map';

const initialState: MapState = {
  currentRegion: DEFAULT_REGION,
  currentStyle: MAP_STYLES.standard,
  isMapReady: false,
  userLocation: null,
  followUserLocation: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapRegion: (state, action: PayloadAction<MapRegion>) => {
      state.currentRegion = action.payload;
    },
    setMapStyle: (state, action: PayloadAction<'standard' | 'satellite'>) => {
      state.currentStyle = MAP_STYLES[action.payload];
    },
    setMapReady: (state, action: PayloadAction<boolean>) => {
      state.isMapReady = action.payload;
    },
    setUserLocation: (
      state,
      action: PayloadAction<{latitude: number; longitude: number} | null>
    ) => {
      state.userLocation = action.payload;
    },
    setFollowUserLocation: (state, action: PayloadAction<boolean>) => {
      state.followUserLocation = action.payload;
    },
    centerOnUser: state => {
      if (state.userLocation) {
        state.currentRegion = {
          ...state.currentRegion!,
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
          zoomLevel: 15,
        };
        state.followUserLocation = true;
      }
    },
  },
});

export const {
  setMapRegion,
  setMapStyle,
  setMapReady,
  setUserLocation,
  setFollowUserLocation,
  centerOnUser,
} = mapSlice.actions;

export default mapSlice.reducer;
```

### 3. MapScreen Component

**`src/features/map/screens/MapScreen.tsx`:**
```typescript
import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {
  setMapRegion,
  setMapReady,
  setUserLocation,
  setFollowUserLocation,
} from '../mapSlice';
import MapControls from '../components/MapControls';
import {requestLocationPermission} from '../utils/permissions';

const MapScreen: React.FC = () => {
  const dispatch = useDispatch();
  const cameraRef = useRef<Mapbox.Camera>(null);
  const mapRef = useRef<Mapbox.MapView>(null);

  const {currentRegion, currentStyle, followUserLocation} = useSelector(
    (state: RootState) => state.map
  );
  const pins = useSelector((state: RootState) => state.pins.items);

  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  useEffect(() => {
    // Request location permission on mount
    requestLocationPermission().then(granted => {
      setLocationPermissionGranted(granted);
    });
  }, []);

  const handleRegionChange = (feature: any) => {
    if (!followUserLocation) {
      const {geometry, properties} = feature;
      dispatch(
        setMapRegion({
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
          zoomLevel: properties.zoomLevel || 2,
          bearing: properties.heading || 0,
          pitch: properties.pitch || 0,
        })
      );
    }
  };

  const handleUserLocationUpdate = (location: Mapbox.Location) => {
    dispatch(
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    );
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={currentStyle.uri}
        onDidFinishLoadingMap={() => dispatch(setMapReady(true))}
        onRegionDidChange={handleRegionChange}
        compassEnabled={true}
        scaleBarEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}>
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={currentRegion?.zoomLevel || 2}
          centerCoordinate={[
            currentRegion?.longitude || 0,
            currentRegion?.latitude || 20,
          ]}
          animationDuration={300}
          followUserLocation={followUserLocation}
        />

        {locationPermissionGranted && (
          <Mapbox.UserLocation
            visible={true}
            onUpdate={handleUserLocationUpdate}
            showsUserHeadingIndicator={true}
          />
        )}

        {/* Pin markers will be added here by RFC-007 */}
        {pins.map(pin => (
          <Mapbox.PointAnnotation
            key={pin.id}
            id={pin.id}
            coordinate={[pin.location.longitude, pin.location.latitude]}>
            <View style={styles.markerContainer}>
              {/* Pin marker UI */}
            </View>
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>

      <MapControls cameraRef={cameraRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MapScreen;
```

### 4. Map Controls Component

**`src/features/map/components/MapControls.tsx`:**
```typescript
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {setMapStyle, centerOnUser} from '../mapSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MapControlsProps {
  cameraRef: React.RefObject<any>;
}

const MapControls: React.FC<MapControlsProps> = ({cameraRef}) => {
  const dispatch = useDispatch();
  const {currentStyle, userLocation} = useSelector((state: RootState) => state.map);

  const toggleMapStyle = () => {
    const newStyle = currentStyle.name === 'standard' ? 'satellite' : 'standard';
    dispatch(setMapStyle(newStyle));
  };

  const handleZoomIn = () => {
    cameraRef.current?.zoomTo(1);
  };

  const handleZoomOut = () => {
    cameraRef.current?.zoomTo(-1);
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      dispatch(centerOnUser());
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Style Toggle */}
      <TouchableOpacity style={styles.button} onPress={toggleMapStyle}>
        <Icon name="layers" size={24} color="#333" />
      </TouchableOpacity>

      {/* Zoom Controls */}
      <View style={styles.zoomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleZoomIn}>
          <Icon name="add" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleZoomOut}>
          <Icon name="remove" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Center on User */}
      {userLocation && (
        <TouchableOpacity style={styles.button} onPress={handleCenterOnUser}>
          <Icon name="my-location" size={24} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: 100,
    gap: 12,
  },
  zoomContainer: {
    gap: 4,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MapControls;
```

### 5. Pin Clustering

**`src/features/map/utils/clustering.ts`:**
```typescript
import {Pin} from '@/features/pins/types/pin';

export interface ClusterPoint {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  pins: Pin[];
}

/**
 * Simple clustering algorithm based on distance threshold
 * For production, consider using supercluster library
 */
export function clusterPins(
  pins: Pin[],
  zoomLevel: number,
  viewportBounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }
): ClusterPoint[] {
  // Clustering only needed when zoomed out
  if (zoomLevel > 10) {
    // Show individual pins at high zoom levels
    return pins
      .filter(pin => isPinInViewport(pin, viewportBounds))
      .map(pin => ({
        id: pin.id,
        latitude: pin.location.latitude,
        longitude: pin.location.longitude,
        count: 1,
        pins: [pin],
      }));
  }

  // Calculate distance threshold based on zoom level
  const threshold = getClusterThreshold(zoomLevel);

  const clusters: ClusterPoint[] = [];
  const processed = new Set<string>();

  pins.forEach(pin => {
    if (processed.has(pin.id) || !isPinInViewport(pin, viewportBounds)) {
      return;
    }

    const cluster: ClusterPoint = {
      id: `cluster-${pin.id}`,
      latitude: pin.location.latitude,
      longitude: pin.location.longitude,
      count: 1,
      pins: [pin],
    };

    processed.add(pin.id);

    // Find nearby pins
    pins.forEach(otherPin => {
      if (processed.has(otherPin.id)) {
        return;
      }

      const distance = getDistance(
        pin.location.latitude,
        pin.location.longitude,
        otherPin.location.latitude,
        otherPin.location.longitude
      );

      if (distance < threshold) {
        cluster.count++;
        cluster.pins.push(otherPin);
        cluster.latitude =
          (cluster.latitude * (cluster.count - 1) + otherPin.location.latitude) /
          cluster.count;
        cluster.longitude =
          (cluster.longitude * (cluster.count - 1) + otherPin.location.longitude) /
          cluster.count;
        processed.add(otherPin.id);
      }
    });

    clusters.push(cluster);
  });

  return clusters;
}

function getClusterThreshold(zoomLevel: number): number {
  // Distance in kilometers
  const baseThreshold = 100;
  return baseThreshold / Math.pow(2, zoomLevel);
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Haversine formula
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function isPinInViewport(
  pin: Pin,
  bounds: {minLat: number; maxLat: number; minLng: number; maxLng: number}
): boolean {
  return (
    pin.location.latitude >= bounds.minLat &&
    pin.location.latitude <= bounds.maxLat &&
    pin.location.longitude >= bounds.minLng &&
    pin.location.longitude <= bounds.maxLng
  );
}
```

### 6. Location Permissions

**`src/features/map/utils/permissions.ts`:**
```typescript
import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    // iOS permissions are handled in Info.plist
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Atlas Personal Location Permission',
        message: 'Atlas Personal necesita acceso a tu ubicación para mostrar tu posición en el mapa',
        buttonNeutral: 'Pregúntame después',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Error requesting location permission:', err);
    return false;
  }
}

export function getCurrentLocation(): Promise<{latitude: number; longitude: number}> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
    );
  });
}
```

---

## Criterios de Aceptación Técnicos

### ✅ Map Display
- [ ] Map renders with default world view
- [ ] Map loads in <2 seconds on 4G
- [ ] Map maintains 60 fps during pan/zoom
- [ ] No crashes or freezes during interaction

### ✅ Navigation
- [ ] User can pan map with touch
- [ ] User can zoom with pinch gesture
- [ ] User can double-tap to zoom in
- [ ] User can rotate map with two-finger rotate
- [ ] Compass visible and functional

### ✅ Map Styles
- [ ] Can toggle between standard and satellite
- [ ] Style changes smoothly (<500ms)
- [ ] User preference persisted

### ✅ User Location
- [ ] Location permission requested correctly
- [ ] User location shown if permission granted
- [ ] "My Location" button centers on user
- [ ] User heading indicator rotates with device

### ✅ Pin Display
- [ ] Pins render at correct coordinates
- [ ] Pins visible when zoomed in
- [ ] Clustering works when zoomed out (>50 pins)
- [ ] Cluster count badge shows correct number

### ✅ State Persistence
- [ ] Last viewed region restored on app restart
- [ ] Map style preference persisted
- [ ] Works offline with cached tiles

### ✅ Performance
- [ ] Frame rate >50 fps during interaction
- [ ] Memory usage <200MB with 1000 pins
- [ ] Tile caching reduces data usage

### ✅ Tests
- [ ] Unit tests: clustering algorithm
- [ ] Unit tests: location utilities
- [ ] Integration tests: Redux map slice
- [ ] E2E test: Map navigation flow

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Map types and Redux slice | 4 horas |
| MapScreen component | 8 horas |
| MapControls component | 4 horas |
| Location permissions | 3 horas |
| Pin clustering algorithm | 6 horas |
| Map style switching | 2 horas |
| State persistence | 3 horas |
| Performance optimization | 6 horas |
| Testing | 10 horas |
| Bug fixes and polish | 6 horas |
| **TOTAL** | **~52 horas (~2 semanas)** |

---

## Notas de Implementación

### iOS Configuration

**`ios/Info.plist`:**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Atlas Personal usa tu ubicación para mostrarte dónde estás en el mapa</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Atlas Personal usa tu ubicación para mostrarte dónde estás en el mapa</string>
```

### Android Configuration

**`android/app/src/main/AndroidManifest.xml`:**
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### Performance Optimization

1. **Tile Caching:**
   - Cache tiles for 30 days
   - Reduce network requests
   - Enable offline map viewing

2. **Pin Clustering:**
   - Start clustering at zoom level <10
   - Use efficient distance calculation
   - Update clusters on region change debounced (300ms)

3. **Rendering:**
   - Use `removeClippedSubviews` on FlatLists
   - Memoize pin marker components
   - Lazy load pin details

---

## Próximo RFC

**RFC-005: Pin Creation & Management**  
Depende de: RFC-001 ✅, RFC-002 ✅, RFC-003 ✅, RFC-004 ✅

---

**¡Mapa interactivo listo para mostrar el mundo del usuario!** 🗺️
