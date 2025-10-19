# RFC-002: Firebase & Services Integration

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** L  
**Estimated Duration:** 1 semana  
**Dependencies:** RFC-001

---

## Resumen

Este RFC integra todos los servicios externos necesarios para Atlas Personal: Firebase (Authentication, Firestore, Storage, Cloud Functions), Mapbox SDK, RevenueCat para subscripciones, Sentry para error tracking, y Mixpanel para analytics. También incluye configuración de Firebase Security Rules y environment setup.

**Objetivo:** Al completar este RFC, todos los SDKs externos estarán integrados, configurados y listos para ser utilizados por features posteriores.

---

## Características Cubiertas

Este RFC habilita la infraestructura para:
- F-001 a F-009 (Authentication - habilitado por Firebase Auth)
- F-010 a F-017 (Map - habilitado por Mapbox)
- F-018 a F-032 (Pins - habilitado por Firestore + Storage)
- F-053 a F-061 (Subscription - habilitado por RevenueCat)
- F-074 a F-076 (Analytics - habilitado por Mixpanel + Sentry)

---

## Especificaciones Técnicas

### 1. Firebase Project Setup

#### 1.1 Crear Firebase Project

**Pasos manuales (a realizar en Firebase Console):**

1. Ir a https://console.firebase.google.com/
2. Crear nuevo proyecto: "Atlas Personal"
3. Habilitar Google Analytics (opcional para MVP)
4. Región: Seleccionar más cercana a target audience (ej: us-central1)

#### 1.2 Configurar Firebase Apps

**iOS App:**
1. Añadir iOS app en Firebase Console
2. Bundle ID: `com.atlaspersonal.app` (actualizar en Xcode)
3. Descargar `GoogleService-Info.plist`
4. Mover a `ios/AtlasPersonal/GoogleService-Info.plist`
5. Añadir al proyecto Xcode (asegurar que está en target)

**Android App:**
1. Añadir Android app en Firebase Console
2. Package name: `com.atlaspersonal.app`
3. Descargar `google-services.json`
4. Mover a `android/app/google-services.json`

#### 1.3 Instalar Firebase SDKs

**Dependencias:**
```bash
yarn add @react-native-firebase/app \
         @react-native-firebase/auth \
         @react-native-firebase/firestore \
         @react-native-firebase/storage \
         @react-native-firebase/functions \
         @react-native-firebase/analytics \
         @react-native-firebase/crashlytics \
         @react-native-firebase/performance
```

**iOS Pods:**
```bash
cd ios && pod install && cd ..
```

**Android configuration:** `android/build.gradle`
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

`android/app/build.gradle` (al final):
```gradle
apply plugin: 'com.google.gms.google-services'
```

#### 1.4 Firebase Configuration Service

**`src/services/firebase/config.ts`:**
```typescript
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import functions from '@react-native-firebase/functions';

export const initializeFirebase = () => {
  // Enable Firestore offline persistence
  firestore().settings({
    persistence: true,
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
  });

  // Enable emulators in development (optional)
  if (__DEV__) {
    // Uncomment to use emulators
    // firestore().useEmulator('localhost', 8080);
    // auth().useEmulator('http://localhost:9099');
    // storage().useEmulator('localhost', 9199);
    // functions().useEmulator('localhost', 5001);
  }

  return {
    firestore: firestore(),
    auth: auth(),
    storage: storage(),
    functions: functions(),
  };
};
```

#### 1.5 Firestore Security Rules

**`firestore.rules`:** (Subir a Firebase Console o deployar con Firebase CLI)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Pins collection
    match /pins/{pinId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.keys().hasAll(['userId', 'latitude', 'longitude', 'category', 'createdAt']);
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Collections collection
    match /collections/{collectionId} {
      allow read, write: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // FogState collection
    match /fogState/{userId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

**`storage.rules`:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.size < 10 * 1024 * 1024; // 10MB limit
    }
  }
}
```

### 2. Mapbox Integration

#### 2.1 Obtener Access Token

1. Crear cuenta en https://www.mapbox.com/
2. Generar access token en Account → Tokens
3. Scopes necesarios: `DOWNLOADS:READ`, `VISION:READ`

#### 2.2 Instalar Mapbox SDK

```bash
yarn add @rnmapbox/maps
```

**iOS Setup:** `ios/Podfile`
```ruby
pre_install do |installer|
  $RNMapboxMaps.pre_install(installer)
end

post_install do |installer|
  $RNMapboxMaps.post_install(installer)
end
```

```bash
cd ios && pod install && cd ..
```

**Android Setup:** `android/build.gradle`
```gradle
allprojects {
    repositories {
        maven {
            url 'https://api.mapbox.com/downloads/v2/releases/maven'
            authentication {
                basic(BasicAuthentication)
            }
            credentials {
                username = 'mapbox'
                password = project.hasProperty('MAPBOX_DOWNLOADS_TOKEN') ? 
                           project.property('MAPBOX_DOWNLOADS_TOKEN') : ''
            }
        }
    }
}
```

`android/gradle.properties`:
```
MAPBOX_DOWNLOADS_TOKEN=sk.ey...your_secret_token
```

#### 2.3 Mapbox Configuration

**`src/services/mapbox/config.ts`:**
```typescript
import Mapbox from '@rnmapbox/maps';
import {ENV} from '@/shared/config/env';

export const initializeMapbox = () => {
  Mapbox.setAccessToken(ENV.MAPBOX_ACCESS_TOKEN);
  
  // Enable telemetry (optional, for Mapbox analytics)
  Mapbox.setTelemetryEnabled(__DEV__ ? false : true);
  
  // Set connected status (for offline mode)
  Mapbox.setConnected(true);
};
```

### 3. RevenueCat Integration

#### 3.1 RevenueCat Project Setup

1. Crear cuenta en https://www.revenuecat.com/
2. Crear proyecto "Atlas Personal"
3. Configurar apps:
   - iOS: Bundle ID `com.atlaspersonal.app`
   - Android: Package name `com.atlaspersonal.app`
4. Crear productos:
   - `atlas_pro_annual`: $24.99/year
   - `atlas_pro_monthly`: $2.99/month (opcional)

#### 3.2 Instalar SDK

```bash
yarn add react-native-purchases
```

**iOS:** `cd ios && pod install && cd ..`

**Android:** Auto-link funciona automáticamente

#### 3.3 RevenueCat Configuration

**`src/services/subscription/config.ts`:**
```typescript
import Purchases from 'react-native-purchases';
import {ENV} from '@/shared/config/env';
import {Platform} from 'react-native';

export const initializeRevenueCat = async () => {
  if (Platform.OS === 'ios') {
    await Purchases.configure({apiKey: ENV.REVENUECAT_IOS_API_KEY});
  } else if (Platform.OS === 'android') {
    await Purchases.configure({apiKey: ENV.REVENUECAT_ANDROID_API_KEY});
  }

  // Enable debug logs in development
  if (__DEV__) {
    Purchases.setDebugLogsEnabled(true);
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const purchaserInfo = await Purchases.getCustomerInfo();
    const isPro = purchaserInfo.entitlements.active['pro'] !== undefined;
    return {isPro, purchaserInfo};
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return {isPro: false, purchaserInfo: null};
  }
};
```

### 4. Sentry Integration

#### 4.1 Crear Proyecto Sentry

1. Crear cuenta en https://sentry.io/
2. Crear proyecto "Atlas Personal" (React Native)
3. Copiar DSN

#### 4.2 Instalar SDK

```bash
yarn add @sentry/react-native
npx @sentry/wizard -i reactNative -p ios android
```

#### 4.3 Sentry Configuration

**`src/services/monitoring/sentry.ts`:**
```typescript
import * as Sentry from '@sentry/react-native';
import {ENV} from '@/shared/config/env';

export const initializeSentry = () => {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    enabled: !__DEV__, // Only in production
    tracesSampleRate: 0.2, // 20% of transactions
    beforeSend(event) {
      // Don't send events in dev
      if (__DEV__) return null;
      return event;
    },
    integrations: [
      new Sentry.ReactNativeTracing({
        tracingOrigins: ['localhost', 'firebaseio.com', 'mapbox.com'],
      }),
    ],
  });
};

export const logError = (error: Error, context?: Record<string, any>) => {
  if (__DEV__) {
    console.error('[Sentry]', error, context);
  } else {
    Sentry.captureException(error, {extra: context});
  }
};
```

### 5. Mixpanel Integration

#### 5.1 Crear Proyecto Mixpanel

1. Crear cuenta en https://mixpanel.com/
2. Crear proyecto "Atlas Personal"
3. Copiar Project Token

#### 5.2 Instalar SDK

```bash
yarn add mixpanel-react-native
```

**iOS:** `cd ios && pod install && cd ..`

#### 5.3 Mixpanel Configuration

**`src/services/analytics/mixpanel.ts`:**
```typescript
import {Mixpanel} from 'mixpanel-react-native';
import {ENV} from '@/shared/config/env';

let mixpanel: Mixpanel | null = null;

export const initializeMixpanel = async () => {
  mixpanel = await Mixpanel.init(ENV.MIXPANEL_TOKEN);
  
  // Enable in both dev and prod (different projects)
  if (__DEV__) {
    console.log('[Mixpanel] Initialized in development mode');
  }
  
  return mixpanel;
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!mixpanel) {
    console.warn('[Mixpanel] Not initialized yet');
    return;
  }
  
  mixpanel.track(eventName, properties);
  if (__DEV__) {
    console.log('[Mixpanel Event]', eventName, properties);
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (!mixpanel) return;
  
  mixpanel.identify(userId);
  if (traits) {
    mixpanel.getPeople().set(traits);
  }
};
```

### 6. App Initialization

**`src/App.tsx`:**
```typescript
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Provider} from 'react-redux';
import {store} from '@/store';
import {initializeFirebase} from '@/services/firebase/config';
import {initializeMapbox} from '@/services/mapbox/config';
import {initializeRevenueCat} from '@/services/subscription/config';
import {initializeSentry} from '@/services/monitoring/sentry';
import {initializeMixpanel} from '@/services/analytics/mixpanel';

// Initialize services immediately (outside component)
initializeSentry();

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize all services
        initializeFirebase();
        initializeMapbox();
        await initializeRevenueCat();
        await initializeMixpanel();

        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        // Still set ready to avoid infinite loading
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      {/* Navigation will be added in RFC-003 */}
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Atlas Personal</Text>
      </View>
    </Provider>
  );
};

export default App;
```

### 7. Environment Variables Update

**Actualizar `.env.example`:**
```
# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Mapbox
MAPBOX_ACCESS_TOKEN=
MAPBOX_DOWNLOADS_TOKEN=

# RevenueCat
REVENUECAT_IOS_API_KEY=
REVENUECAT_ANDROID_API_KEY=

# Sentry
SENTRY_DSN=

# Mixpanel
MIXPANEL_TOKEN=
```

---

## Criterios de Aceptación Técnicos

### ✅ Firebase
- [ ] Firebase initialized en App.tsx sin errores
- [ ] Firestore rules deployadas
- [ ] Storage rules deployadas
- [ ] Puede escribir/leer documento de prueba en Firestore desde app
- [ ] `GoogleService-Info.plist` y `google-services.json` en lugar correcto

### ✅ Mapbox
- [ ] Mapbox SDK integrado (iOS + Android)
- [ ] Access token configurado correctamente
- [ ] Puede renderizar mapa básico (test simple)

### ✅ RevenueCat
- [ ] SDK inicializado sin errores
- [ ] Puede obtener subscription status (aunque sea vacío)
- [ ] Productos configurados en RevenueCat dashboard

### ✅ Sentry
- [ ] SDK inicializado
- [ ] Test error enviado y visible en Sentry dashboard
- [ ] Solo activo en production (no en dev)

### ✅ Mixpanel
- [ ] SDK inicializado
- [ ] Test event enviado y visible en Mixpanel
- [ ] User identification funciona

### ✅ General
- [ ] App compila en iOS sin warnings de dependencias
- [ ] App compila en Android sin warnings de dependencias
- [ ] No hay crashes al abrir app
- [ ] Environment variables funcionan correctamente

---

## Tests a Implementar

**`__tests__/services/firebase.test.ts`:**
```typescript
import {initializeFirebase} from '@/services/firebase/config';

describe('Firebase Configuration', () => {
  it('should initialize Firebase services', () => {
    const services = initializeFirebase();
    expect(services.firestore).toBeDefined();
    expect(services.auth).toBeDefined();
    expect(services.storage).toBeDefined();
    expect(services.functions).toBeDefined();
  });
});
```

**`__tests__/App.test.tsx` (actualizar):**
```typescript
import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import App from '../src/App';

// Mock all services
jest.mock('@/services/firebase/config');
jest.mock('@/services/mapbox/config');
jest.mock('@/services/subscription/config');
jest.mock('@/services/monitoring/sentry');
jest.mock('@/services/analytics/mixpanel');

describe('App Initialization', () => {
  it('should render after services initialize', async () => {
    const {getByText} = render(<App />);
    await waitFor(() => {
      expect(getByText('Atlas Personal')).toBeTruthy();
    });
  });
});
```

---

## Notas de Implementación

### Orden de Inicialización

1. **Sentry primero:** Para capturar errores de inicialización de otros servicios
2. **Firebase:** Core service, muchos features dependen
3. **Mapbox:** Puede ser async o sync
4. **RevenueCat:** Async, puede tomar tiempo
5. **Mixpanel:** Async, para analytics

### Troubleshooting

**Firebase iOS:** Si falla, verificar que `GoogleService-Info.plist` esté en Build Phases → Copy Bundle Resources

**Mapbox Android:** Si falla build, verificar que `MAPBOX_DOWNLOADS_TOKEN` esté en `gradle.properties`

**RevenueCat:** En sandbox testing, usar test users de App Store Connect

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Firebase project + apps setup | 1.5 horas |
| Firebase SDK integration | 2 horas |
| Firestore/Storage rules | 1 hora |
| Mapbox integration | 2 horas |
| RevenueCat integration | 1.5 horas |
| Sentry integration | 1 hora |
| Mixpanel integration | 1 hora |
| App initialization logic | 1 hora |
| Testing | 2 horas |
| **TOTAL** | **~13 horas (~1.5 días)** |

---

## Próximo RFC

**RFC-003: Authentication System**  
Depende de: RFC-001 ✅, RFC-002 ✅

---

**Con este RFC, toda la infraestructura externa está lista. Siguiente: construir features!** 🔥
