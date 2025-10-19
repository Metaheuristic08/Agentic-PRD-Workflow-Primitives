# RFC-009: Collections System

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** L  
**Estimated Duration:** 1.5 semanas  
**Dependencies:** RFC-005, RFC-007

---

## Resumen

Este RFC implementa el sistema completo de colecciones temáticas, permitiendo a usuarios agrupar pins relacionados en colecciones nombradas, visualizar colecciones como rutas en el mapa, agregar/remover pins, y gestionar colecciones (CRUD operations).

**Objetivo:** Usuarios pueden crear colecciones para organizar pins temáticamente (ej: "Viaje Italia 2023", "Mejores cafés"), ver pins filtrados por colección, y visualizar rutas conectando pins.

---

## Características Cubiertas

- **F-039:** Creación de colección
- **F-040:** Validación de límite tier gratuito (3 colecciones)
- **F-041:** Agregar pin existente a colección
- **F-042:** Remover pin de colección
- **F-043:** Vista filtrada de colección en mapa
- **F-044:** Visualización de ruta entre pins de colección
- **F-045:** Edición de nombre de colección
- **F-046:** Eliminación de colección
- **F-047:** Lista de colecciones con conteo de pins
- **F-048:** Ordenamiento de colecciones

---

## Especificaciones Técnicas

### 1. Collection Types

**`src/features/collections/types/collection.ts`:**
```typescript
export interface Collection {
  id: string;
  userId: string;
  name: string;
  color: string; // Hex color
  pinIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCollectionDTO {
  name: string;
}

export interface UpdateCollectionDTO {
  name?: string;
  pinIds?: string[];
}

export interface CollectionState {
  items: Collection[];
  selectedCollectionId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const COLLECTION_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B195',
  '#C06C84',
];
```

### 2. Collection Service

**`src/features/collections/services/collectionsService.ts`:**
```typescript
import firestore from '@react-native-firebase/firestore';
import {Collection, CreateCollectionDTO, UpdateCollectionDTO} from '../types/collection';
import {COLLECTION_COLORS} from '../types/collection';
import {logger} from '@/shared/utils/logger';

class CollectionsService {
  private collection = firestore().collection('collections');

  async fetchUserCollections(userId: string): Promise<Collection[]> {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => this.mapDocToCollection(doc));
    } catch (error) {
      logger.error('Error fetching collections', error as Error, {userId});
      throw error;
    }
  }

  async createCollection(userId: string, data: CreateCollectionDTO): Promise<Collection> {
    try {
      // Validate collection count for free tier
      const existingCollections = await this.fetchUserCollections(userId);
      // Note: Free tier limit check moved to Redux thunk

      // Assign random color
      const color = COLLECTION_COLORS[Math.floor(Math.random() * COLLECTION_COLORS.length)];

      const docRef = await this.collection.add({
        userId,
        name: data.name,
        color,
        pinIds: [],
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      logger.info('Collection created', {collectionId: docRef.id, userId, name: data.name});

      return this.getCollectionById(docRef.id);
    } catch (error) {
      logger.error('Error creating collection', error as Error, {userId});
      throw error;
    }
  }

  async updateCollection(
    collectionId: string,
    userId: string,
    data: UpdateCollectionDTO
  ): Promise<Collection> {
    try {
      const updateData: any = {
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (data.name !== undefined) updateData.name = data.name;
      if (data.pinIds !== undefined) updateData.pinIds = data.pinIds;

      await this.collection.doc(collectionId).update(updateData);

      logger.info('Collection updated', {collectionId, userId});

      return this.getCollectionById(collectionId);
    } catch (error) {
      logger.error('Error updating collection', error as Error, {collectionId, userId});
      throw error;
    }
  }

  async deleteCollection(collectionId: string, userId: string): Promise<void> {
    try {
      const collection = await this.getCollectionById(collectionId);

      if (collection.userId !== userId) {
        throw new Error('Unauthorized: Cannot delete collection of another user');
      }

      await this.collection.doc(collectionId).delete();

      logger.info('Collection deleted', {collectionId, userId});
    } catch (error) {
      logger.error('Error deleting collection', error as Error, {collectionId, userId});
      throw error;
    }
  }

  async addPinToCollection(collectionId: string, pinId: string): Promise<Collection> {
    try {
      const collection = await this.getCollectionById(collectionId);

      if (!collection.pinIds.includes(pinId)) {
        const updatedPinIds = [...collection.pinIds, pinId];
        await this.collection.doc(collectionId).update({
          pinIds: updatedPinIds,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      logger.info('Pin added to collection', {collectionId, pinId});

      return this.getCollectionById(collectionId);
    } catch (error) {
      logger.error('Error adding pin to collection', error as Error, {collectionId, pinId});
      throw error;
    }
  }

  async removePinFromCollection(collectionId: string, pinId: string): Promise<Collection> {
    try {
      const collection = await this.getCollectionById(collectionId);
      const updatedPinIds = collection.pinIds.filter(id => id !== pinId);

      await this.collection.doc(collectionId).update({
        pinIds: updatedPinIds,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      logger.info('Pin removed from collection', {collectionId, pinId});

      return this.getCollectionById(collectionId);
    } catch (error) {
      logger.error('Error removing pin from collection', error as Error, {collectionId, pinId});
      throw error;
    }
  }

  async getCollectionById(collectionId: string): Promise<Collection> {
    const doc = await this.collection.doc(collectionId).get();
    if (!doc.exists) {
      throw new Error(`Collection ${collectionId} not found`);
    }
    return this.mapDocToCollection(doc);
  }

  private mapDocToCollection(doc: firestore.QueryDocumentSnapshot): Collection {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      name: data.name,
      color: data.color,
      pinIds: data.pinIds || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const collectionsService = new CollectionsService();
```

### 3. Redux Collections Slice

**`src/features/collections/collectionsSlice.ts`:**
```typescript
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {CollectionState, Collection, CreateCollectionDTO} from './types/collection';
import {collectionsService} from './services/collectionsService';
import {RootState} from '@/store';

const initialState: CollectionState = {
  items: [],
  selectedCollectionId: null,
  isLoading: false,
  error: null,
};

export const fetchCollections = createAsyncThunk(
  'collections/fetch',
  async (userId: string, {rejectWithValue}) => {
    try {
      return await collectionsService.fetchUserCollections(userId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCollection = createAsyncThunk(
  'collections/create',
  async (
    {userId, data}: {userId: string; data: CreateCollectionDTO},
    {getState, rejectWithValue}
  ) => {
    try {
      const state = getState() as RootState;
      const userProfile = state.auth.userProfile;

      // Check free tier limit
      if (userProfile?.subscriptionStatus === 'free') {
        if (state.collections.items.length >= 3) {
          return rejectWithValue(
            'Has alcanzado el límite de 3 colecciones. Actualiza a Pro para crear más.'
          );
        }
      }

      return await collectionsService.createCollection(userId, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCollection = createAsyncThunk(
  'collections/update',
  async (
    {collectionId, userId, data}: {collectionId: string; userId: string; data: any},
    {rejectWithValue}
  ) => {
    try {
      return await collectionsService.updateCollection(collectionId, userId, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCollection = createAsyncThunk(
  'collections/delete',
  async ({collectionId, userId}: {collectionId: string; userId: string}, {rejectWithValue}) => {
    try {
      await collectionsService.deleteCollection(collectionId, userId);
      return collectionId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPinToCollection = createAsyncThunk(
  'collections/addPin',
  async ({collectionId, pinId}: {collectionId: string; pinId: string}, {rejectWithValue}) => {
    try {
      return await collectionsService.addPinToCollection(collectionId, pinId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removePinFromCollection = createAsyncThunk(
  'collections/removePin',
  async ({collectionId, pinId}: {collectionId: string; pinId: string}, {rejectWithValue}) => {
    try {
      return await collectionsService.removePinFromCollection(collectionId, pinId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    selectCollection: (state, action: PayloadAction<string | null>) => {
      state.selectedCollectionId = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch
    builder
      .addCase(fetchCollections.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create
    builder
      .addCase(createCollection.pending, state => {
        state.isLoading = true;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.isLoading = false;
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update
    builder.addCase(updateCollection.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    // Delete
    builder.addCase(deleteCollection.fulfilled, (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload);
      if (state.selectedCollectionId === action.payload) {
        state.selectedCollectionId = null;
      }
    });

    // Add/Remove Pin
    builder
      .addCase(addPinToCollection.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removePinFromCollection.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const {selectCollection, clearError} = collectionsSlice.actions;
export default collectionsSlice.reducer;
```

### 4. Collections List Screen

**`src/features/collections/screens/CollectionsListScreen.tsx`:**
```typescript
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {createCollection, deleteCollection, selectCollection} from '../collectionsSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CollectionsListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {items: collections, isLoading} = useSelector((state: RootState) => state.collections);
  const user = useSelector((state: RootState) => state.auth.user);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleCreateCollection = async () => {
    if (newCollectionName.trim() && user) {
      await dispatch(
        createCollection({
          userId: user.uid,
          data: {name: newCollectionName.trim()},
        })
      );
      setNewCollectionName('');
      setShowCreateModal(false);
    }
  };

  const handleSelectCollection = (collectionId: string) => {
    dispatch(selectCollection(collectionId));
    // Navigate to map with collection filter
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={collections}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.collectionCard}
            onPress={() => handleSelectCollection(item.id)}>
            <View style={[styles.colorIndicator, {backgroundColor: item.color}]} />
            <View style={styles.collectionInfo}>
              <Text style={styles.collectionName}>{item.name}</Text>
              <Text style={styles.pinCount}>{item.pinIds.length} pins</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tienes colecciones aún</Text>
            <Text style={styles.emptySubtext}>
              Crea tu primera colección para organizar tus pins
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowCreateModal(true)}>
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Colección</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la colección"
              value={newCollectionName}
              onChangeText={setNewCollectionName}
              maxLength={50}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text style={styles.cancelButton}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateCollection}>
                <Text style={styles.createButton}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pinCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  },
  cancelButton: {
    fontSize: 16,
    color: '#999',
  },
  createButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default CollectionsListScreen;
```

---

## Criterios de Aceptación Técnicos

### ✅ Collection CRUD
- [ ] User can create collection with name
- [ ] User can rename collection
- [ ] User can delete collection (pins preserved)
- [ ] Free tier limited to 3 collections

### ✅ Pin Association
- [ ] User can add pin to collection(s)
- [ ] User can remove pin from collection
- [ ] Pin can be in multiple collections
- [ ] Collection shows correct pin count

### ✅ Collection Viewing
- [ ] Collections list shows all user collections
- [ ] Tap collection filters map to show only those pins
- [ ] Route line connects pins chronologically
- [ ] Collection color consistent throughout

### ✅ Tests
- [ ] Unit tests: collectionsService
- [ ] Integration tests: Redux slice
- [ ] E2E test: Create collection → add pins → view on map

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Types and models | 2 horas |
| collectionsService | 8 horas |
| Redux collections slice | 6 horas |
| CollectionsListScreen | 8 horas |
| Collection filter/route visualization | 8 horas |
| Free tier limit enforcement | 3 horas |
| Testing | 10 horas |
| **TOTAL** | **~45 horas (~1.5 semanas)** |

---

## Próximo RFC

**RFC-010: Timeline & Gallery Views**  
Depende de: RFC-007

---

**¡Sistema de colecciones para organización temática perfecta!** 📚
