# RFC-008: Offline Mode & Sync

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** XL  
**Estimated Duration:** 1.5 semanas  
**Dependencies:** RFC-001 through RFC-007

---

## Resumen

Este RFC implementa funcionalidad offline robusta para Atlas Personal, permitiendo a usuarios crear/editar pins sin conexión con sincronización automática al reconectar, compresión de imágenes, queue de operaciones offline, y manejo de conflictos con estrategia last-write-wins.

**Objetivo:** La app funciona sin conexión, cambios se sincronizan automáticamente, y usuarios ven indicadores claros del estado de sincronización.

---

## Características Cubiertas

- **F-032:** Queue de upload offline
- **F-066:** Compresión automática de imágenes
- **F-067:** Caching de tiles de mapa
- **F-068:** Modo offline básico
- **F-069:** Indicador de estado de sincronización
- **F-070:** Manejo de conflictos de sync

---

## Especificaciones Técnicas

### 1. Offline Types

**`src/features/offline/types/sync.ts`:**
```typescript
export enum SyncOperationType {
  CREATE_PIN = 'CREATE_PIN',
  UPDATE_PIN = 'UPDATE_PIN',
  DELETE_PIN = 'DELETE_PIN',
  CREATE_COLLECTION = 'CREATE_COLLECTION',
  UPDATE_COLLECTION = 'UPDATE_COLLECTION',
  DELETE_COLLECTION = 'DELETE_COLLECTION',
}

export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  payload: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  error?: string;
}

export interface OfflineState {
  isOnline: boolean;
  syncQueue: SyncOperation[];
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingCount: number;
}
```

### 2. Sync Service

**`src/features/offline/services/syncService.ts`:**
```typescript
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SyncOperation, SyncOperationType} from '../types/sync';
import {pinsService} from '@/features/pins/services/pinsService';
import {logger} from '@/shared/utils/logger';

const SYNC_QUEUE_KEY = '@sync_queue';
const MAX_RETRY_COUNT = 3;

class SyncService {
  private syncQueue: SyncOperation[] = [];
  private isSyncing = false;
  private onlineListener: any = null;

  async initialize() {
    // Load persisted queue
    await this.loadQueue();

    // Listen to network changes
    this.onlineListener = NetInfo.addEventListener(state => {
      if (state.isConnected && this.syncQueue.length > 0) {
        this.syncAll();
      }
    });
  }

  async addToQueue(type: SyncOperationType, payload: any): Promise<string> {
    const operation: SyncOperation = {
      id: `${Date.now()}_${Math.random()}`,
      type,
      payload,
      timestamp: new Date(),
      retryCount: 0,
      status: 'pending',
    };

    this.syncQueue.push(operation);
    await this.saveQueue();

    logger.info('Operation added to sync queue', {type, operationId: operation.id});

    // Try to sync immediately if online
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      this.syncAll();
    }

    return operation.id;
  }

  async syncAll(): Promise<void> {
    if (this.isSyncing || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;

    logger.info('Starting sync', {queueSize: this.syncQueue.length});

    const pendingOps = this.syncQueue.filter(op => op.status === 'pending');

    for (const operation of pendingOps) {
      try {
        await this.syncOperation(operation);
        operation.status = 'synced';
        this.removeFromQueue(operation.id);
      } catch (error: any) {
        operation.retryCount++;
        operation.error = error.message;

        if (operation.retryCount >= MAX_RETRY_COUNT) {
          operation.status = 'failed';
          logger.error('Operation failed after max retries', error, {
            operationId: operation.id,
            type: operation.type,
          });
        } else {
          operation.status = 'pending';
          logger.warn('Operation failed, will retry', {
            operationId: operation.id,
            retryCount: operation.retryCount,
          });
        }
      }
    }

    await this.saveQueue();
    this.isSyncing = false;

    logger.info('Sync completed', {remaining: this.syncQueue.length});
  }

  private async syncOperation(operation: SyncOperation): Promise<void> {
    operation.status = 'syncing';

    switch (operation.type) {
      case SyncOperationType.CREATE_PIN:
        await pinsService.createPin(operation.payload.userId, operation.payload.data);
        break;

      case SyncOperationType.UPDATE_PIN:
        await pinsService.updatePin(
          operation.payload.pinId,
          operation.payload.userId,
          operation.payload.data
        );
        break;

      case SyncOperationType.DELETE_PIN:
        await pinsService.deletePin(operation.payload.pinId, operation.payload.userId);
        break;

      // Add other operation types...

      default:
        throw new Error(`Unknown sync operation type: ${operation.type}`);
    }
  }

  private removeFromQueue(operationId: string): void {
    this.syncQueue = this.syncQueue.filter(op => op.id !== operationId);
  }

  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(this.syncQueue));
    } catch (error) {
      logger.error('Error saving sync queue', error as Error);
    }
  }

  private async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      if (stored) {
        this.syncQueue = JSON.parse(stored).map((op: any) => ({
          ...op,
          timestamp: new Date(op.timestamp),
        }));
        logger.info('Sync queue loaded', {size: this.syncQueue.length});
      }
    } catch (error) {
      logger.error('Error loading sync queue', error as Error);
    }
  }

  getPendingCount(): number {
    return this.syncQueue.filter(op => op.status === 'pending').length;
  }

  getFailedOperations(): SyncOperation[] {
    return this.syncQueue.filter(op => op.status === 'failed');
  }

  async clearFailedOperations(): Promise<void> {
    this.syncQueue = this.syncQueue.filter(op => op.status !== 'failed');
    await this.saveQueue();
  }

  dispose() {
    if (this.onlineListener) {
      this.onlineListener();
    }
  }
}

export const syncService = new SyncService();
```

### 3. Image Compression

**`src/shared/utils/imageUtils.ts`:**
```typescript
import ImageResizer from 'react-native-image-resizer';
import {logger} from './logger';

export interface CompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number; // 0-1
}

export async function compressImage(
  uri: string,
  options: CompressionOptions
): Promise<{uri: string; size: number}> {
  try {
    const result = await ImageResizer.createResizedImage(
      uri,
      options.maxWidth,
      options.maxHeight,
      'JPEG',
      options.quality * 100,
      0, // rotation
      undefined, // outputPath
      false, // keepMeta
      {mode: 'contain'}
    );

    logger.info('Image compressed', {
      originalUri: uri,
      newUri: result.uri,
      size: result.size,
    });

    return {
      uri: result.uri,
      size: result.size,
    };
  } catch (error) {
    logger.error('Error compressing image', error as Error, {uri});
    throw error;
  }
}
```

### 4. Redux Offline Slice

**`src/features/offline/offlineSlice.ts`:**
```typescript
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';
import {OfflineState} from './types/sync';
import {syncService} from './services/syncService';

const initialState: OfflineState = {
  isOnline: true,
  syncQueue: [],
  isSyncing: false,
  lastSyncTime: null,
  pendingCount: 0,
};

export const initializeOfflineMode = createAsyncThunk('offline/initialize', async () => {
  await syncService.initialize();
  const netInfo = await NetInfo.fetch();
  return {isOnline: netInfo.isConnected || false};
});

export const syncAllOperations = createAsyncThunk('offline/syncAll', async () => {
  await syncService.syncAll();
  return {
    pendingCount: syncService.getPendingCount(),
    lastSyncTime: new Date(),
  };
});

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    updatePendingCount: (state, action: PayloadAction<number>) => {
      state.pendingCount = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initializeOfflineMode.fulfilled, (state, action) => {
        state.isOnline = action.payload.isOnline;
      })
      .addCase(syncAllOperations.pending, state => {
        state.isSyncing = true;
      })
      .addCase(syncAllOperations.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.pendingCount = action.payload.pendingCount;
        state.lastSyncTime = action.payload.lastSyncTime;
      })
      .addCase(syncAllOperations.rejected, state => {
        state.isSyncing = false;
      });
  },
});

export const {setOnlineStatus, updatePendingCount} = offlineSlice.actions;
export default offlineSlice.reducer;
```

### 5. Offline Indicator Component

**`src/features/offline/components/OfflineIndicator.tsx`:**
```typescript
import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OfflineIndicator: React.FC = () => {
  const {isOnline, isSyncing, pendingCount} = useSelector(
    (state: RootState) => state.offline
  );

  if (isOnline && !isSyncing && pendingCount === 0) {
    return null;
  }

  return (
    <View style={[styles.container, !isOnline && styles.offline]}>
      {!isOnline ? (
        <>
          <Icon name="cloud-off" size={16} color="white" />
          <Text style={styles.text}>Sin conexión</Text>
        </>
      ) : isSyncing ? (
        <>
          <ActivityIndicator size="small" color="white" />
          <Text style={styles.text}>Sincronizando...</Text>
        </>
      ) : pendingCount > 0 ? (
        <>
          <Icon name="cloud-upload" size={16} color="white" />
          <Text style={styles.text}>{pendingCount} pendiente(s)</Text>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  offline: {
    backgroundColor: '#FF9800',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OfflineIndicator;
```

---

## Criterios de Aceptación Técnicos

### ✅ Offline Mode
- [ ] App detects online/offline status
- [ ] Offline indicator shows when disconnected
- [ ] Users can create/edit pins offline
- [ ] Changes queued for sync

### ✅ Sync
- [ ] Auto-sync when connection restored
- [ ] Sync progress shown
- [ ] Failed operations retry up to 3 times
- [ ] Sync queue persisted across app restarts

### ✅ Image Compression
- [ ] Images compressed to 2MB max
- [ ] Thumbnails generated at 400px
- [ ] Compression in background
- [ ] Original quality for Pro users

### ✅ Conflict Handling
- [ ] Last-write-wins strategy
- [ ] Conflicts logged
- [ ] No data loss

### ✅ Tests
- [ ] Unit tests: syncService
- [ ] Integration tests: offline slice
- [ ] E2E test: Create pin offline → sync online

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Sync types and models | 3 horas |
| syncService implementation | 10 horas |
| Image compression | 4 horas |
| Redux offline slice | 4 horas |
| OfflineIndicator component | 3 horas |
| Network detection | 3 horas |
| Conflict handling | 6 horas |
| Testing | 10 horas |
| **TOTAL** | **~43 horas (~1.5 semanas)** |

---

## Próximo RFC

**RFC-009: Collections System**  
Depende de: RFC-005, RFC-007

---

**¡Modo offline robusto para experiencia fluida sin conexión!** 📶
