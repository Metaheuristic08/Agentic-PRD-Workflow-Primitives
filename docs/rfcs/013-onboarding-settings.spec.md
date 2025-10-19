# RFC-013: Onboarding & Settings

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** M  
**Estimated Duration:** 1 semana  
**Dependencies:** RFC-003, RFC-012

---

## Resumen

Este RFC implementa la experiencia de onboarding con 3 slides introductorias, pantalla de Settings completa con perfil de usuario, selección de idioma (ES/EN), tema (Light/Dark/Auto), links legales, y flujos de eliminación de cuenta y exportación de datos.

**Objetivo:** Nuevos usuarios entienden la app rápidamente con onboarding, y todos los usuarios pueden configurar preferencias y gestionar su cuenta desde Settings.

---

## Características Cubiertas

- **F-007:** Perfil de usuario básico
- **F-062:** Pantalla de Settings
- **F-063:** Selección de idioma (ES/EN)
- **F-064:** Selección de tema (Dark Mode)
- **F-065:** Política de privacidad y Términos de servicio
- **F-071:** Onboarding de 3 slides para nuevos usuarios
- **F-072:** Tooltips contextuales en primera interacción
- **F-073:** Pantalla de "empty state" motivacional

---

## Especificaciones Técnicas

### 1. Onboarding Slides

**`src/features/onboarding/screens/OnboardingScreen.tsx`:**
```typescript
import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    id: '1',
    icon: 'map',
    title: 'Bienvenido a Atlas Personal',
    description: 'El mapa de tu vida. Documenta tus experiencias en un atlas interactivo.',
  },
  {
    id: '2',
    icon: 'cloud',
    title: 'Fog of War',
    description: 'Despeja la niebla creando pins. Cada memoria revela más del mundo.',
  },
  {
    id: '3',
    icon: 'collections',
    title: 'Organiza tus Memorias',
    description: 'Crea colecciones temáticas y revive tus aventuras en cualquier momento.',
  },
];

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDone = async () => {
    await AsyncStorage.setItem('@onboarding_completed', 'true');
    navigation.replace('Main');
  };

  const handleSkip = handleDone;

  const renderSlide = ({item, index}: any) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={80} color="#007AFF" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Saltar</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.pagination}>
        {ONBOARDING_SLIDES.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={currentIndex === ONBOARDING_SLIDES.length - 1 ? handleDone : handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Comenzar' : 'Siguiente'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: '#007AFF',
    fontSize: 16,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCC',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#007AFF',
    width: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    marginHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
```

### 2. Settings Screen

**`src/features/settings/screens/SettingsScreen.tsx`:**
```typescript
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '@/store';
import {signOut, deleteAccount, updateUserProfile} from '@/features/auth/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {user, userProfile} = useSelector((state: RootState) => state.auth);

  const [language, setLanguage] = useState(userProfile?.settings.language || 'es');
  const [theme, setTheme] = useState(userProfile?.settings.theme || 'auto');

  const handleSignOut = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          await dispatch(signOut());
          navigation.replace('Auth');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción es permanente. Todos tus datos serán eliminados en 7 días. ¿Continuar?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (user) {
              await dispatch(deleteAccount(user.uid));
              navigation.replace('Auth');
            }
          },
        },
      ]
    );
  };

  const SettingRow = ({icon, title, onPress, rightComponent}: any) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#666" />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {rightComponent || <Icon name="chevron-right" size={24} color="#CCC" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile */}
      <View style={styles.profileSection}>
        {userProfile?.profilePhoto ? (
          <Image source={{uri: userProfile.profilePhoto}} style={styles.profilePhoto} />
        ) : (
          <View style={styles.profilePhotoPlaceholder}>
            <Icon name="person" size={40} color="#999" />
          </View>
        )}
        <Text style={styles.profileName}>{userProfile?.displayName || 'Usuario'}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </View>

      {/* Subscription */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suscripción</Text>
        <SettingRow
          icon="star"
          title={
            userProfile?.subscriptionStatus === 'pro' ? 'Atlas Pro Activo' : 'Actualizar a Pro'
          }
          onPress={() => navigation.navigate('Pricing')}
        />
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <SettingRow icon="language" title="Idioma" onPress={() => {}} rightComponent={
          <Text style={styles.settingValue}>{language === 'es' ? 'Español' : 'English'}</Text>
        } />
        <SettingRow icon="dark-mode" title="Tema" onPress={() => {}} rightComponent={
          <Text style={styles.settingValue}>
            {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Oscuro' : 'Auto'}
          </Text>
        } />
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <SettingRow icon="privacy-tip" title="Política de Privacidad" onPress={() => {}} />
        <SettingRow icon="description" title="Términos de Servicio" onPress={() => {}} />
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <SettingRow icon="exit-to-app" title="Cerrar Sesión" onPress={handleSignOut} />
        <SettingRow icon="delete-forever" title="Eliminar Cuenta" onPress={handleDeleteAccount} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Atlas Personal v1.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profilePhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});

export default SettingsScreen;
```

---

## Criterios de Aceptación Técnicos

### ✅ Onboarding
- [ ] Shows on first app open
- [ ] 3 slides with clear messaging
- [ ] Skip button available
- [ ] Saved to AsyncStorage after completion
- [ ] Never shown again after completion

### ✅ Settings
- [ ] Profile section shows user info
- [ ] Can navigate to subscription
- [ ] Language selection works
- [ ] Theme selection works
- [ ] Legal links open WebViews
- [ ] Sign out confirmation works
- [ ] Delete account confirmation works

### ✅ Tests
- [ ] Component tests: Onboarding, Settings
- [ ] E2E test: Complete onboarding → create first pin

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| OnboardingScreen | 6 horas |
| SettingsScreen | 8 horas |
| Language switcher | 3 horas |
| Theme switcher | 3 horas |
| Legal pages (WebView) | 2 horas |
| Testing | 4 horas |
| **TOTAL** | **~26 horas (~1 semana)** |

---

## Próximo RFC

**RFC-014: Analytics & Monitoring**  
Depende de: RFC-001 through RFC-013

---

**¡Experiencia completa desde onboarding hasta configuración!** ⚙️
