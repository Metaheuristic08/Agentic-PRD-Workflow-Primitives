# RFC-006: Fog of War System

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** XL  
**Estimated Duration:** 2 semanas  
**Dependencies:** RFC-001, RFC-002, RFC-003, RFC-004, RFC-005

---

## Resumen

Este RFC implementa el sistema de gamificación "Fog of War" que cubre el mapa con una niebla semi-transparente que se despeja cuando el usuario crea pins. Es una feature única de Atlas Personal que motiva la exploración y documentación de experiencias.

**Objetivo:** El mapa inicia cubierto con fog (80% opacity) que se despeja en círculos de 50km cuando se crean pins, revelando progresivamente el mundo del usuario.

---

## Características Cubiertas

- **F-033:** Overlay de niebla inicial en mapa
- **F-034:** Clearing de fog al crear pin
- **F-035:** Cálculo de porcentaje de mundo revelado
- **F-036:** Persistencia de estado de fog
- **F-037:** Animación de celebración en milestones
- **F-038:** Indicador visual de progreso de fog

---

## Especificaciones Técnicas

### 1. Fog State Types

**`src/features/fog/types/fog.ts`:**
```typescript
export interface ClearedRegion {
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  clearedAt: Date;
  pinId: string; // Associated pin
}

export interface FogState {
  userId: string;
  revealedRegions: ClearedRegion[];
  totalPercentageRevealed: number;
  lastUpdated: Date;
}

export interface FogStateRedux {
  clearedRegions: ClearedRegion[];
  percentageRevealed: number;
  isCalculating: boolean;
  milestones: FogMilestone[];
}

export interface FogMilestone {
  percentage: number;
  reached: boolean;
  reachedAt: Date | null;
}

export const FOG_MILESTONES = [10, 25, 50, 75, 90, 100];
export const FOG_CLEAR_RADIUS_KM = 50;
export const FOG_OPACITY = 0.8;
```

### 2. Fog Service

**`src/features/fog/services/fogService.ts`:**
```typescript
import firestore from '@react-native-firebase/firestore';
import {FogState, ClearedRegion} from '../types/fog';
import {logger} from '@/shared/utils/logger';

const EARTH_SURFACE_AREA_KM2 = 510_072_000; // Earth surface area

class FogService {
  private collection = firestore().collection('fogState');

  async getFogState(userId: string): Promise<FogState | null> {
    try {
      const doc = await this.collection.doc(userId).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;
      return {
        userId,
        revealedRegions: data.revealedRegions.map((r: any) => ({
          ...r,
          clearedAt: r.clearedAt.toDate(),
        })),
        totalPercentageRevealed: data.totalPercentageRevealed,
        lastUpdated: data.lastUpdated.toDate(),
      };
    } catch (error) {
      logger.error('Error fetching fog state', error as Error, {userId});
      throw error;
    }
  }

  async clearFogAt(
    userId: string,
    latitude: number,
    longitude: number,
    pinId: string
  ): Promise<FogState> {
    try {
      const currentState = await this.getFogState(userId);
      
      const newRegion: ClearedRegion = {
        latitude,
        longitude,
        radius: 50, // 50km radius
        clearedAt: new Date(),
        pinId,
      };

      const allRegions = currentState
        ? [...currentState.revealedRegions, newRegion]
        : [newRegion];

      const percentage = this.calculateRevealedPercentage(allRegions);

      const updatedState: FogState = {
        userId,
        revealedRegions: allRegions,
        totalPercentageRevealed: percentage,
        lastUpdated: new Date(),
      };

      await this.collection.doc(userId).set({
        userId,
        revealedRegions: allRegions.map(r => ({
          ...r,
          clearedAt: firestore.Timestamp.fromDate(r.clearedAt),
        })),
        totalPercentageRevealed: percentage,
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      });

      logger.info('Fog cleared', {
        userId,
        latitude,
        longitude,
        newPercentage: percentage,
      });

      return updatedState;
    } catch (error) {
      logger.error('Error clearing fog', error as Error, {userId});
      throw error;
    }
  }

  private calculateRevealedPercentage(regions: ClearedRegion[]): number {
    if (regions.length === 0) return 0;

    // Simplified calculation - actual implementation would account for overlapping circles
    const totalAreaRevealed = regions.reduce((sum, region) => {
      const areaKm2 = Math.PI * Math.pow(region.radius, 2);
      return sum + areaKm2;
    }, 0);

    const percentage = (totalAreaRevealed / EARTH_SURFACE_AREA_KM2) * 100;
    
    // Cap at 100%
    return Math.min(percentage, 100);
  }
}

export const fogService = new FogService();
```

### 3. Fog Overlay Component

**`src/features/fog/components/FogOverlay.tsx`:**
```typescript
import React, {useEffect, useMemo} from 'react';
import {useSelector} from 'react-redux';
import Mapbox from '@rnmapbox/maps';
import {RootState} from '@/store';
import {FOG_OPACITY} from '../types/fog';

const FogOverlay: React.FC = () => {
  const {clearedRegions} = useSelector((state: RootState) => state.fog);
  const {isMapReady} = useSelector((state: RootState) => state.map);

  // Generate GeoJSON for fog layer
  const fogGeoJSON = useMemo(() => {
    // World polygon covering entire earth
    const worldPolygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-180, 90],
            [180, 90],
            [180, -90],
            [-180, -90],
            [-180, 90],
          ],
        ],
      },
    };

    // Cleared circles as "holes"
    const clearedCircles = clearedRegions.map(region => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [createCircle(region.latitude, region.longitude, region.radius)],
      },
    }));

    return {
      type: 'FeatureCollection',
      features: [worldPolygon, ...clearedCircles],
    };
  }, [clearedRegions]);

  if (!isMapReady) return null;

  return (
    <Mapbox.ShapeSource id="fogSource" shape={fogGeoJSON}>
      <Mapbox.FillLayer
        id="fogLayer"
        style={{
          fillColor: '#000000',
          fillOpacity: FOG_OPACITY,
        }}
      />
    </Mapbox.ShapeSource>
  );
};

// Helper to create circle coordinates
function createCircle(
  lat: number,
  lng: number,
  radiusKm: number,
  points: number = 64
): number[][] {
  const coords: number[][] = [];
  const distanceX = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusKm / 110.574;

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * (2 * Math.PI);
    const dx = distanceX * Math.cos(angle);
    const dy = distanceY * Math.sin(angle);
    coords.push([lng + dx, lat + dy]);
  }

  coords.push(coords[0]); // Close the circle
  return coords;
}

export default FogOverlay;
```

### 4. Redux Fog Slice

**`src/features/fog/fogSlice.ts`:**
```typescript
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {FogStateRedux, ClearedRegion, FOG_MILESTONES} from './types/fog';
import {fogService} from './services/fogService';
import {trackEvent} from '@/services/analytics/mixpanel';

const initialState: FogStateRedux = {
  clearedRegions: [],
  percentageRevealed: 0,
  isCalculating: false,
  milestones: FOG_MILESTONES.map(p => ({percentage: p, reached: false, reachedAt: null})),
};

export const loadFogState = createAsyncThunk(
  'fog/load',
  async (userId: string, {rejectWithValue}) => {
    try {
      const fogState = await fogService.getFogState(userId);
      return fogState;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearFogAtLocation = createAsyncThunk(
  'fog/clearAt',
  async (
    {
      userId,
      latitude,
      longitude,
      pinId,
    }: {
      userId: string;
      latitude: number;
      longitude: number;
      pinId: string;
    },
    {rejectWithValue}
  ) => {
    try {
      const updatedState = await fogService.clearFogAt(userId, latitude, longitude, pinId);
      return updatedState;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const fogSlice = createSlice({
  name: 'fog',
  initialState,
  reducers: {
    checkMilestones: state => {
      state.milestones.forEach(milestone => {
        if (!milestone.reached && state.percentageRevealed >= milestone.percentage) {
          milestone.reached = true;
          milestone.reachedAt = new Date();
          
          // Track milestone
          trackEvent('fog_milestone_reached', {
            percentage: milestone.percentage,
          });
        }
      });
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadFogState.pending, state => {
        state.isCalculating = true;
      })
      .addCase(loadFogState.fulfilled, (state, action) => {
        if (action.payload) {
          state.clearedRegions = action.payload.revealedRegions;
          state.percentageRevealed = action.payload.totalPercentageRevealed;
        }
        state.isCalculating = false;
      })
      .addCase(loadFogState.rejected, state => {
        state.isCalculating = false;
      });

    builder
      .addCase(clearFogAtLocation.pending, state => {
        state.isCalculating = true;
      })
      .addCase(clearFogAtLocation.fulfilled, (state, action) => {
        state.clearedRegions = action.payload.revealedRegions;
        state.percentageRevealed = action.payload.totalPercentageRevealed;
        state.isCalculating = false;
      })
      .addCase(clearFogAtLocation.rejected, state => {
        state.isCalculating = false;
      });
  },
});

export const {checkMilestones} = fogSlice.actions;
export default fogSlice.reducer;
```

---

## Criterios de Aceptación Técnicos

### ✅ Initial Fog Display
- [ ] Map covered with 80% opacity fog on first load
- [ ] Fog layer renders without performance degradation
- [ ] Fog persists across app restarts

### ✅ Fog Clearing
- [ ] Fog clears in 50km circle when pin created
- [ ] Clearing animation smooth (1 second)
- [ ] Multiple cleared regions combine correctly
- [ ] Cleared regions saved to Firestore

### ✅ Percentage Calculation
- [ ] Percentage calculated correctly
- [ ] Displayed in user stats
- [ ] Updates in real-time
- [ ] Caps at 100%

### ✅ Milestones
- [ ] Milestones tracked (10%, 25%, 50%, 75%, 90%, 100%)
- [ ] Celebration animation on milestone
- [ ] Haptic feedback on milestone
- [ ] Analytics event fired

### ✅ Performance
- [ ] No frame drops during clearing animation
- [ ] Fog calculations in <100ms
- [ ] Works with 100+ cleared regions

### ✅ Tests
- [ ] Unit tests: percentage calculation
- [ ] Integration tests: fog service
- [ ] E2E test: Create pin → fog clears

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Fog types and models | 3 horas |
| fogService implementation | 8 horas |
| Fog calculation algorithm | 6 horas |
| FogOverlay component | 8 horas |
| Redux fog slice | 4 horas |
| Clearing animation | 6 horas |
| Milestone system | 4 horas |
| Testing | 10 horas |
| Performance optimization | 6 horas |
| **TOTAL** | **~55 horas (~2 semanas)** |

---

## Próximo RFC

**RFC-007: Pin Display & Interactions**  
Depende de: RFC-001 ✅, RFC-002 ✅, RFC-003 ✅, RFC-004 ✅, RFC-005 ✅, RFC-006 ✅

---

**¡Sistema de gamificación único y motivador!** 🌫️✨
