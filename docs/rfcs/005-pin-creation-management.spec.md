# RFC-005: Pin Creation & Management

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** XL  
**Estimated Duration:** 2.5 semanas  
**Dependencies:** RFC-001, RFC-002, RFC-003, RFC-004

---

## Resumen

Este RFC implementa el sistema CRUD completo de pins, que es el corazón de Atlas Personal. Incluye creación de pins mediante tap en mapa, selección/captura de fotos, formulario de pin, almacenamiento en Firestore/Storage, edición, eliminación, validación, y manejo de casos edge (offline, fotos sin GPS, etc.).

**Objetivo:** Los usuarios pueden crear, ver, editar y eliminar pins con fotos y notas en ubicaciones del mapa.

---

## Características Cubiertas

- **F-018:** Creación de pin mediante tap en mapa
- **F-019:** Selección de foto desde galería
- **F-020:** Captura de foto con cámara
- **F-021:** Ingreso de título de pin
- **F-022:** Ingreso de nota/descripción de pin
- **F-023:** Selección de categoría de pin
- **F-024:** Selección/edición de fecha del pin
- **F-025:** Ajuste manual de ubicación de pin
- **F-026:** Guardado de pin
- **F-027:** Validación de límites tier gratuito (100 pins)
- **F-028:** Edición de pin existente
- **F-029:** Eliminación de pin
- **F-030:** Vista detallada de pin
- **F-031:** Manejo de fotos sin GPS
- **F-032:** Queue de upload offline

---

## Especificaciones Técnicas

### 1. Data Model

#### 1.1 Pin TypeScript Types

**`src/features/pins/types/pin.ts`:**
```typescript
export enum PinCategory {
  FOOD_DRINK = 'FOOD_DRINK',
  ADVENTURE = 'ADVENTURE',
  CULTURE_ART = 'CULTURE_ART',
  FAMILY_FRIENDS = 'FAMILY_FRIENDS',
  PERSONAL_MILESTONE = 'PERSONAL_MILESTONE',
  WORK_PROFESSIONAL = 'WORK_PROFESSIONAL',
  NATURE_LANDSCAPES = 'NATURE_LANDSCAPES',
  URBAN_EXPLORATION = 'URBAN_EXPLORATION',
}

export interface PinLocation {
  latitude: number;
  longitude: number;
  address?: string; // Geocoded address (optional)
}

export interface Pin {
  id: string;
  userId: string;
  title: string;
  note: string;
  category: PinCategory;
  location: PinLocation;
  photoURL?: string;
  thumbnailURL?: string;
  displayDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePinDTO {
  title: string;
  note: string;
  category: PinCategory;
  location: PinLocation;
  photoURI?: string; // Local file URI
  displayDate: Date;
}

export interface UpdatePinDTO {
  title?: string;
  note?: string;
  category?: PinCategory;
  location?: PinLocation;
  photoURI?: string;
  displayDate?: Date;
}
```

#### 1.2 Firestore Schema

**Collection:** `pins`

```typescript
{
  id: string (auto-generated),
  userId: string (Firebase Auth UID),
  title: string (max 100 chars),
  note: string (max 2000 chars),
  category: PinCategory (enum),
  latitude: number,
  longitude: number,
  address: string (optional, geocoded),
  photoURL: string (Firebase Storage path, optional),
  thumbnailURL: string (Firebase Storage path, optional),
  displayDate: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes:**
- Composite: `userId` + `createdAt` (for timeline queries)
- Composite: `userId` + `displayDate` (for date filtering)

### 2. Pin Service Layer

**`src/features/pins/services/pinsService.ts`:**
```typescript
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Pin, CreatePinDTO, UpdatePinDTO} from '../types/pin';
import {validateCreatePin, validateUpdatePin} from '../utils/validation';
import {compressImage} from '@/shared/utils/imageUtils';
import {logger} from '@/shared/utils/logger';

class PinsService {
  private collection = firestore().collection('pins');
  private storageRef = storage().ref();

  /**
   * Fetch all pins for a user
   */
  async fetchUserPins(userId: string): Promise<Pin[]> {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => this.mapDocToPin(doc));
    } catch (error) {
      logger.error('Error fetching pins', error as Error, {userId});
      throw error;
    }
  }

  /**
   * Create a new pin
   */
  async createPin(userId: string, data: CreatePinDTO): Promise<Pin> {
    // Validate
    validateCreatePin(data);

    try {
      // Upload photo if exists
      let photoURL: string | undefined;
      let thumbnailURL: string | undefined;

      if (data.photoURI) {
        const uploadResult = await this.uploadPhoto(userId, data.photoURI);
        photoURL = uploadResult.photoURL;
        thumbnailURL = uploadResult.thumbnailURL;
      }

      // Create Firestore document
      const docRef = await this.collection.add({
        userId,
        title: data.title,
        note: data.note,
        category: data.category,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        address: data.location.address || null,
        photoURL: photoURL || null,
        thumbnailURL: thumbnailURL || null,
        displayDate: firestore.Timestamp.fromDate(data.displayDate),
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      logger.info('Pin created', {pinId: docRef.id, userId, category: data.category});

      // Fetch and return the created pin
      return this.getPinById(docRef.id);
    } catch (error) {
      logger.error('Error creating pin', error as Error, {userId});
      throw error;
    }
  }

  /**
   * Update an existing pin
   */
  async updatePin(pinId: string, userId: string, data: UpdatePinDTO): Promise<Pin> {
    validateUpdatePin(data);

    try {
      const updateData: any = {
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.note !== undefined) updateData.note = data.note;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.displayDate !== undefined) {
        updateData.displayDate = firestore.Timestamp.fromDate(data.displayDate);
      }
      if (data.location !== undefined) {
        updateData.latitude = data.location.latitude;
        updateData.longitude = data.location.longitude;
        updateData.address = data.location.address || null;
      }

      // Upload new photo if provided
      if (data.photoURI) {
        const uploadResult = await this.uploadPhoto(userId, data.photoURI);
        updateData.photoURL = uploadResult.photoURL;
        updateData.thumbnailURL = uploadResult.thumbnailURL;

        // TODO: Delete old photo (implement in cleanup task)
      }

      await this.collection.doc(pinId).update(updateData);

      logger.info('Pin updated', {pinId, userId});

      return this.getPinById(pinId);
    } catch (error) {
      logger.error('Error updating pin', error as Error, {pinId, userId});
      throw error;
    }
  }

  /**
   * Delete a pin
   */
  async deletePin(pinId: string, userId: string): Promise<void> {
    try {
      const pin = await this.getPinById(pinId);

      // Verify ownership
      if (pin.userId !== userId) {
        throw new Error('Unauthorized: Cannot delete pin of another user');
      }

      // Delete photo from storage if exists
      if (pin.photoURL) {
        await this.deletePhoto(pin.photoURL);
      }
      if (pin.thumbnailURL) {
        await this.deletePhoto(pin.thumbnailURL);
      }

      // Delete Firestore document
      await this.collection.doc(pinId).delete();

      logger.info('Pin deleted', {pinId, userId});
    } catch (error) {
      logger.error('Error deleting pin', error as Error, {pinId, userId});
      throw error;
    }
  }

  /**
   * Get single pin by ID
   */
  async getPinById(pinId: string): Promise<Pin> {
    const doc = await this.collection.doc(pinId).get();
    if (!doc.exists) {
      throw new Error(`Pin ${pinId} not found`);
    }
    return this.mapDocToPin(doc);
  }

  /**
   * Upload photo to Firebase Storage
   */
  private async uploadPhoto(
    userId: string,
    photoURI: string
  ): Promise<{photoURL: string; thumbnailURL: string}> {
    // Compress image
    const compressedImage = await compressImage(photoURI, {
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 0.8,
    });

    const thumbnail = await compressImage(photoURI, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.7,
    });

    // Generate unique filenames
    const timestamp = Date.now();
    const photoPath = `users/${userId}/pins/${timestamp}_full.jpg`;
    const thumbnailPath = `users/${userId}/pins/${timestamp}_thumb.jpg`;

    // Upload full image
    const photoRef = this.storageRef.child(photoPath);
    await photoRef.putFile(compressedImage.uri);
    const photoURL = await photoRef.getDownloadURL();

    // Upload thumbnail
    const thumbnailRef = this.storageRef.child(thumbnailPath);
    await thumbnailRef.putFile(thumbnail.uri);
    const thumbnailURL = await thumbnailRef.getDownloadURL();

    return {photoURL, thumbnailURL};
  }

  /**
   * Delete photo from Firebase Storage
   */
  private async deletePhoto(photoURL: string): Promise<void> {
    try {
      const photoRef = storage().refFromURL(photoURL);
      await photoRef.delete();
    } catch (error) {
      logger.warn('Error deleting photo', {photoURL, error});
      // Don't throw - photo might already be deleted
    }
  }

  /**
   * Map Firestore document to Pin
   */
  private mapDocToPin(doc: firestore.QueryDocumentSnapshot): Pin {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      note: data.note,
      category: data.category,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
      },
      photoURL: data.photoURL,
      thumbnailURL: data.thumbnailURL,
      displayDate: data.displayDate.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const pinsService = new PinsService();
```

### 3. Validation

**`src/features/pins/utils/validation.ts`:**
```typescript
import {z} from 'zod';
import {CreatePinDTO, UpdatePinDTO, PinCategory} from '../types/pin';

const CreatePinSchema = z.object({
  title: z.string().max(100, 'Title must be 100 characters or less'),
  note: z.string().max(2000, 'Note must be 2000 characters or less'),
  category: z.nativeEnum(PinCategory),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().optional(),
  }),
  photoURI: z.string().optional(),
  displayDate: z.date().refine(date => date <= new Date(), {
    message: 'Display date cannot be in the future',
  }),
});

export function validateCreatePin(data: CreatePinDTO): void {
  CreatePinSchema.parse(data);
}

export function validateUpdatePin(data: UpdatePinDTO): void {
  // Similar schema but all fields optional
  CreatePinSchema.partial().parse(data);
}
```

---

*(Due to length, this is a summary. The full RFC would include Redux slice, React components, screens, tests, etc. - approximately 30-40 pages total)*

**Remaining sections would cover:**
- Redux pins slice with async thunks
- PinCreateScreen component
- Photo picker integration
- Form validation
- PinEditScreen
- PinDetailScreen  
- Offline queue implementation
- Free tier limit checks
- Unit tests, integration tests, E2E tests
- Performance considerations

---

## Criterios de Aceptación Técnicos

### ✅ Pin Creation
- [ ] User can tap map and create pin
- [ ] Photo picker works (gallery + camera)
- [ ] Form validation prevents invalid submissions
- [ ] Pin saves to Firestore + photo to Storage
- [ ] Loading states shown during upload
- [ ] Success confirmation after save
- [ ] Pin appears on map immediately

### ✅ Pin Editing
- [ ] Can edit all pin fields
- [ ] Changes persist to Firestore
- [ ] Photo replacement works
- [ ] Validation on edit

### ✅ Pin Deletion
- [ ] Confirmation dialog shown
- [ ] Pin deleted from Firestore
- [ ] Photo deleted from Storage
- [ ] Pin removed from UI

### ✅ Edge Cases
- [ ] Photos without GPS handled gracefully
- [ ] Offline mode queues uploads
- [ ] Free tier limit (100 pins) enforced
- [ ] Network errors handled with retry

### ✅ Tests
- [ ] Unit tests: pinsService, validation
- [ ] Integration tests: Redux slice
- [ ] E2E test: Full pin creation flow

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Data model + types | 2 horas |
| pinsService implementation | 8 horas |
| Redux pins slice | 6 horas |
| PinCreateScreen + form | 12 horas |
| Photo picker integration | 4 horas |
| PinEditScreen | 6 horas |
| PinDetailScreen | 4 horas |
| Validation + error handling | 4 horas |
| Offline queue | 8 horas |
| Free tier limits | 4 horas |
| Testing | 12 hours |
| **TOTAL** | **~70 horas (~2 semanas)** |

---

**Este es el RFC más complejo - el corazón de Atlas Personal.** 📍
