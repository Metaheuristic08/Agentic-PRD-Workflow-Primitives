# RFC-010: Timeline & Gallery Views

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** M  
**Estimated Duration:** 1 semana  
**Dependencies:** RFC-007

---

## Resumen

Este RFC implementa vistas alternativas para explorar pins: Timeline cronológica con agrupación por mes/año, Gallery de fotos en grid, y búsqueda por título con filtrado en tiempo real. Estas vistas complementan la vista de mapa principal.

**Objetivo:** Usuarios pueden explorar sus pins cronológicamente en Timeline, visualmente en Gallery, y buscar pins específicos por título.

---

## Características Cubiertas

- **F-049:** Vista Timeline cronológica de pins
- **F-050:** Vista Gallery de fotos
- **F-051:** Swipe entre pins en vista detallada
- **F-052:** Búsqueda de pins por título

---

## Especificaciones Técnicas

### 1. Timeline Screen

**`src/features/pins/screens/TimelineScreen.tsx`:**
```typescript
import React, {useMemo} from 'react';
import {View, Text, StyleSheet, SectionList, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '@/store';
import {Pin} from '../types/pin';
import {getCategoryColor} from '../utils/categoryUtils';
import {format} from 'date-fns';
import {es} from 'date-fns/locale';

interface TimelineSection {
  title: string;
  data: Pin[];
}

const TimelineScreen: React.FC = () => {
  const navigation = useNavigation();
  const pins = useSelector((state: RootState) => state.pins.items);

  // Group pins by month/year
  const sections = useMemo(() => {
    const grouped: Record<string, Pin[]> = {};

    pins.forEach(pin => {
      const key = format(pin.displayDate, 'MMMM yyyy', {locale: es});
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(pin);
    });

    return Object.entries(grouped)
      .map(([title, data]) => ({
        title,
        data: data.sort((a, b) => b.displayDate.getTime() - a.displayDate.getTime()),
      }))
      .sort((a, b) => {
        const dateA = a.data[0].displayDate;
        const dateB = b.data[0].displayDate;
        return dateB.getTime() - dateA.getTime();
      });
  }, [pins]);

  const renderItem = ({item}: {item: Pin}) => (
    <TouchableOpacity
      style={styles.timelineItem}
      onPress={() => navigation.navigate('PinDetail', {pinId: item.id})}>
      {item.thumbnailURL && (
        <Image source={{uri: item.thumbnailURL}} style={styles.thumbnail} />
      )}
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={[styles.categoryDot, {backgroundColor: getCategoryColor(item.category)}]} />
          <Text style={styles.itemTitle}>{item.title || 'Sin título'}</Text>
        </View>
        <Text style={styles.itemDate}>
          {format(item.displayDate, 'd MMMM yyyy', {locale: es})}
        </Text>
        {item.note && (
          <Text style={styles.itemNote} numberOfLines={2}>
            {item.note}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({section}: {section: TimelineSection}) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} pins</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay pins para mostrar</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  sectionCount: {
    fontSize: 14,
    color: '#666',
  },
  timelineItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
  },
  itemContent: {
    flex: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  itemDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemNote: {
    fontSize: 14,
    color: '#999',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});

export default TimelineScreen;
```

### 2. Gallery Screen

**`src/features/pins/screens/GalleryScreen.tsx`:**
```typescript
import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '@/store';

const {width} = Dimensions.get('window');
const ITEM_SIZE = width / 3 - 8; // 3 columns with gaps

const GalleryScreen: React.FC = () => {
  const navigation = useNavigation();
  const pins = useSelector((state: RootState) => state.pins.items);

  // Filter only pins with photos
  const pinsWithPhotos = pins.filter(pin => pin.thumbnailURL);

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => navigation.navigate('PinDetail', {pinId: item.id})}>
      <Image source={{uri: item.thumbnailURL}} style={styles.gridImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pinsWithPhotos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 4,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 2,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
});

export default GalleryScreen;
```

### 3. Search Component

**`src/features/pins/components/PinSearchBar.tsx`:**
```typescript
import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '@/store';
import {Pin} from '../types/pin';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PinSearchBar: React.FC = () => {
  const navigation = useNavigation();
  const pins = useSelector((state: RootState) => state.pins.items);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Pin[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = pins.filter(pin =>
      pin.title?.toLowerCase().includes(query) || pin.note?.toLowerCase().includes(query)
    );

    setSearchResults(results);
    setShowResults(true);
  }, [searchQuery, pins]);

  const handleSelectPin = (pinId: string) => {
    setShowResults(false);
    setSearchQuery('');
    navigation.navigate('PinDetail', {pinId});
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Buscar pins..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => searchQuery.length > 0 && setShowResults(true)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {showResults && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectPin(item.id)}>
                <Text style={styles.resultTitle}>{item.title || 'Sin título'}</Text>
                {item.note && (
                  <Text style={styles.resultNote} numberOfLines={1}>
                    {item.note}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyResults}>
                <Text style={styles.emptyText}>No se encontraron resultados</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resultNote: {
    fontSize: 14,
    color: '#666',
  },
  emptyResults: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default PinSearchBar;
```

---

## Criterios de Aceptación Técnicos

### ✅ Timeline View
- [ ] Pins grouped by month/year
- [ ] Chronological order (newest first)
- [ ] Section headers sticky
- [ ] Infinite scroll performance

### ✅ Gallery View
- [ ] 3-column grid layout
- [ ] Only pins with photos shown
- [ ] Lazy loading images
- [ ] Tap opens pin detail

### ✅ Search
- [ ] Search as you type
- [ ] Results in <500ms
- [ ] Search title and notes
- [ ] Highlight matches (optional)

### ✅ Tests
- [ ] Component tests: Timeline, Gallery, Search
- [ ] Performance tests: Large pin sets (1000+)
- [ ] E2E test: Search → select result → view detail

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| TimelineScreen | 8 horas |
| GalleryScreen | 6 horas |
| PinSearchBar | 6 horas |
| Testing | 6 horas |
| **TOTAL** | **~26 horas (~1 semana)** |

---

## Próximo RFC

**RFC-011: Subscription Integration**  
Depende de: RFC-003

---

**¡Vistas alternativas para explorar memorias de múltiples formas!** 🖼️📅
