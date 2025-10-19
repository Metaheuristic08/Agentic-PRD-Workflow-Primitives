# RFC-007: Pin Display & Interactions

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** M  
**Estimated Duration:** 1 semana  
**Dependencies:** RFC-001, RFC-002, RFC-003, RFC-004, RFC-005, RFC-006

---

## Resumen

Este RFC implementa la visualización completa de pins en el mapa con iconos de categoría, tap handlers para ver detalles, vista detallada de pin con foto fullscreen, swipe navigation entre pins cercanos, y opciones de edición/eliminación.

**Objetivo:** Usuarios pueden ver sus pins en el mapa, tocar para ver detalles, navegar entre pins cercanos, y realizar acciones (editar/eliminar).

---

## Características Cubiertas

- **F-013:** Visualización de pines en mapa
- **F-015:** Tap en pin para ver detalles rápidos
- **F-030:** Vista detallada de pin
- Partial **F-051:** Swipe entre pins en vista detallada

---

## Especificaciones Técnicas

### 1. Pin Marker Component

**`src/features/pins/components/PinMarker.tsx`:**
```typescript
import React from 'react';
import {View, StyleSheet, Text} from 'react';
import {Pin} from '../types/pin';
import {getCategoryIcon, getCategoryColor} from '../utils/categoryUtils';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PinMarkerProps {
  pin: Pin;
  isCluster?: boolean;
  clusterCount?: number;
  onPress: () => void;
}

const PinMarker: React.FC<PinMarkerProps> = ({
  pin,
  isCluster,
  clusterCount,
  onPress,
}) => {
  const categoryColor = getCategoryColor(pin.category);
  const categoryIcon = getCategoryIcon(pin.category);

  if (isCluster && clusterCount && clusterCount > 1) {
    return (
      <View style={[styles.clusterContainer, {backgroundColor: categoryColor}]}>
        <Text style={styles.clusterText}>{clusterCount}</Text>
      </View>
    );
  }

  return (
    <View style={styles.markerContainer}>
      <View style={[styles.markerPin, {backgroundColor: categoryColor}]}>
        <Icon name={categoryIcon} size={20} color="white" />
      </View>
      <View style={[styles.markerArrow, {borderTopColor: categoryColor}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  markerPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  clusterContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  clusterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PinMarker;
```

### 2. Pin Detail Screen

**`src/features/pins/screens/PinDetailScreen.tsx`:**
```typescript
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {deletePin} from '../pinsSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getCategoryName, getCategoryColor} from '../utils/categoryUtils';
import {formatDate} from '@/shared/utils/dateUtils';

const {width, height} = Dimensions.get('window');

const PinDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const pinId = route.params?.pinId;
  const pin = useSelector((state: RootState) =>
    state.pins.items.find(p => p.id === pinId)
  );

  const [showFullImage, setShowFullImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!pin) {
    return (
      <View style={styles.errorContainer}>
        <Text>Pin not found</Text>
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate('PinEdit', {pinId: pin.id});
  };

  const handleDelete = async () => {
    await dispatch(deletePin({pinId: pin.id, userId: pin.userId}));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Photo */}
        {pin.photoURL && (
          <TouchableOpacity onPress={() => setShowFullImage(true)}>
            <Image source={{uri: pin.photoURL}} style={styles.photo} resizeMode="cover" />
          </TouchableOpacity>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Category Badge */}
          <View
            style={[
              styles.categoryBadge,
              {backgroundColor: getCategoryColor(pin.category)},
            ]}>
            <Text style={styles.categoryText}>{getCategoryName(pin.category)}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{pin.title || 'Sin título'}</Text>

          {/* Date */}
          <Text style={styles.date}>{formatDate(pin.displayDate)}</Text>

          {/* Location */}
          {pin.location.address && (
            <View style={styles.locationContainer}>
              <Icon name="location-on" size={20} color="#666" />
              <Text style={styles.locationText}>{pin.location.address}</Text>
            </View>
          )}

          {/* Note */}
          {pin.note && (
            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>Nota:</Text>
              <Text style={styles.noteText}>{pin.note}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <Icon name="edit" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowDeleteConfirm(true)}>
              <Icon name="delete" size={24} color="#FF3B30" />
              <Text style={[styles.actionText, {color: '#FF3B30'}]}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fullscreen Photo Modal */}
      <Modal visible={showFullImage} transparent onRequestClose={() => setShowFullImage(false)}>
        <View style={styles.fullImageContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFullImage(false)}>
            <Icon name="close" size={32} color="white" />
          </TouchableOpacity>
          <Image
            source={{uri: pin.photoURL}}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmDialog}>
            <Text style={styles.confirmTitle}>¿Eliminar pin?</Text>
            <Text style={styles.confirmMessage}>
              Esta acción no se puede deshacer. El pin y su foto serán eliminados permanentemente.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteConfirm(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Eliminar</Text>
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
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  photo: {
    width: width,
    height: width * 0.75,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  noteContainer: {
    marginBottom: 24,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 4,
    fontSize: 14,
    color: '#007AFF',
  },
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmDialog: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: width * 0.8,
    maxWidth: 400,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  confirmMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PinDetailScreen;
```

### 3. Category Utilities

**`src/features/pins/utils/categoryUtils.ts`:**
```typescript
import {PinCategory} from '../types/pin';

export function getCategoryName(category: PinCategory): string {
  const names: Record<PinCategory, string> = {
    [PinCategory.FOOD_DRINK]: 'Comida & Bebida',
    [PinCategory.ADVENTURE]: 'Aventura',
    [PinCategory.CULTURE_ART]: 'Cultura & Arte',
    [PinCategory.FAMILY_FRIENDS]: 'Familia & Amigos',
    [PinCategory.PERSONAL_MILESTONE]: 'Hito Personal',
    [PinCategory.WORK_PROFESSIONAL]: 'Trabajo & Profesional',
    [PinCategory.NATURE_LANDSCAPES]: 'Naturaleza & Paisajes',
    [PinCategory.URBAN_EXPLORATION]: 'Exploración Urbana',
  };
  return names[category];
}

export function getCategoryIcon(category: PinCategory): string {
  const icons: Record<PinCategory, string> = {
    [PinCategory.FOOD_DRINK]: 'restaurant',
    [PinCategory.ADVENTURE]: 'terrain',
    [PinCategory.CULTURE_ART]: 'palette',
    [PinCategory.FAMILY_FRIENDS]: 'people',
    [PinCategory.PERSONAL_MILESTONE]: 'star',
    [PinCategory.WORK_PROFESSIONAL]: 'business-center',
    [PinCategory.NATURE_LANDSCAPES]: 'landscape',
    [PinCategory.URBAN_EXPLORATION]: 'location-city',
  };
  return icons[category];
}

export function getCategoryColor(category: PinCategory): string {
  const colors: Record<PinCategory, string> = {
    [PinCategory.FOOD_DRINK]: '#FF9500',
    [PinCategory.ADVENTURE]: '#34C759',
    [PinCategory.CULTURE_ART]: '#AF52DE',
    [PinCategory.FAMILY_FRIENDS]: '#007AFF',
    [PinCategory.PERSONAL_MILESTONE]: '#FFD700',
    [PinCategory.WORK_PROFESSIONAL]: '#8E8E93',
    [PinCategory.NATURE_LANDSCAPES]: '#2E7D32',
    [PinCategory.URBAN_EXPLORATION]: '#FF3B30',
  };
  return colors[category];
}
```

---

## Criterios de Aceptación Técnicos

### ✅ Pin Display
- [ ] Pins show with category-specific icons and colors
- [ ] Pin markers render at correct coordinates
- [ ] Tap on pin shows callout with title and thumbnail

### ✅ Pin Detail View
- [ ] Photo displays fullscreen on tap
- [ ] All pin information shown (title, note, category, date, location)
- [ ] Edit button navigates to edit screen
- [ ] Delete button shows confirmation dialog

### ✅ Delete Functionality
- [ ] Confirmation dialog required
- [ ] Pin deleted from Firestore
- [ ] Photo deleted from Storage
- [ ] Navigation back to map

### ✅ Tests
- [ ] Unit tests: category utilities
- [ ] Component tests: PinMarker, PinDetailScreen
- [ ] E2E test: Tap pin → view details → delete

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| PinMarker component | 6 horas |
| PinDetailScreen | 8 horas |
| Category utilities | 2 horas |
| Swipe navigation | 4 horas |
| Testing | 6 horas |
| **TOTAL** | **~26 horas (~1 semana)** |

---

## Próximo RFC

**RFC-008: Offline Mode & Sync**  
Depende de: RFC-007 ✅

---

**¡Pins visualizados hermosamente con interacciones completas!** 📍
