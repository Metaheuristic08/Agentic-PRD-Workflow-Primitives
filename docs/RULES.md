# Constitución Técnica del Proyecto: Atlas Personal

**Versión:** 1.0  
**Fecha:** October 2025  
**Propósito:** Este documento establece las reglas, estándares y mejores prácticas para el desarrollo de Atlas Personal. Todo el código, ya sea generado por humanos o por IA, debe adherirse estrictamente a estas directrices.

---

## 1. Stack Tecnológico

### 1.1 Tecnologías Core

| Tecnología | Versión | Justificación | Notas |
|:-----------|:--------|:--------------|:------|
| **React Native** | `0.72.x` | Cross-platform iOS/Android con una única codebase | Actualizar a stable releases, no canary |
| **TypeScript** | `5.2.x` | Type safety, mejor DX, menos bugs | Strict mode habilitado |
| **Node.js** | `18.x LTS` | Runtime para tools y scripts | Usar versiones LTS únicamente |
| **Yarn** | `1.22.x` | Gestor de paquetes consistente | Lockfile commiteado siempre |

### 1.2 Backend & Servicios

| Servicio | Versión/Plan | Propósito |
|:---------|:-------------|:----------|
| **Firebase Authentication** | Latest SDK | User auth (Email, Google) |
| **Firebase Firestore** | Latest SDK | NoSQL database para pins, collections, users |
| **Firebase Storage** | Latest SDK | Photo/video blob storage |
| **Firebase Cloud Functions** | Node.js 18 | Image compression, webhooks |
| **Firebase Hosting** | Latest | Privacy policy, terms of service |
| **Mapbox GL Native** | `10.x` | Map rendering engine |
| **RevenueCat** | Latest SDK | In-app subscription management |
| **Mixpanel** | Latest SDK | Analytics event tracking |
| **Sentry** | `5.x` | Error tracking & crash reporting |

### 1.3 Librerías Principales

| Librería | Versión | Propósito |
|:---------|:--------|:----------|
| `@react-navigation/native` | `6.x` | App navigation |
| `redux` + `@reduxjs/toolkit` | `2.x` + `1.9.x` | State management |
| `redux-persist` | `6.x` | Persist Redux state |
| `react-native-maps` | Latest | Mapbox wrapper |
| `react-native-image-picker` | Latest | Photo selection |
| `react-native-fast-image` | Latest | Image caching |
| `@react-native-firebase/*` | Latest | Firebase SDK suite |
| `react-native-purchases` | Latest | RevenueCat SDK |
| `i18next` + `react-i18next` | Latest | Internationalization |

### 1.4 Herramientas de Desarrollo

| Herramienta | Versión | Propósito |
|:------------|:--------|:----------|
| **ESLint** | `8.x` | Linting JavaScript/TypeScript |
| **Prettier** | `3.x` | Code formatting |
| **Jest** | `29.x` | Unit testing framework |
| **React Native Testing Library** | Latest | Component testing |
| **Detox** | Latest | E2E testing (iOS/Android) |
| **Husky** | `8.x` | Git hooks |
| **lint-staged** | Latest | Pre-commit linting |

---

## 2. Principios de Arquitectura

### 2.1 Arquitectura General

**Patrón:** Feature-Based Modular Architecture  
**Justificación:** Escalabilidad, separación de concerns, facilita testing y mantenimiento

```
src/
├── features/          # Feature modules (pins, collections, auth, etc.)
│   ├── auth/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── __tests__/
│   ├── pins/
│   ├── collections/
│   └── map/
├── shared/           # Shared utilities, components, types
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── constants/
├── navigation/       # Navigation configuration
├── store/            # Redux store configuration
├── services/         # External service wrappers (Firebase, Mapbox, etc.)
├── theme/            # Design system (colors, typography, spacing)
└── App.tsx           # Root component
```

### 2.2 Principios de Diseño de Software (OBLIGATORIOS)

#### SOLID Principles
- **S**ingle Responsibility: Cada módulo/componente tiene UNA responsabilidad
- **O**pen/Closed: Abierto a extensión, cerrado a modificación
- **L**iskov Substitution: Subtipos deben ser sustituibles
- **I**nterface Segregation: Interfaces pequeñas y específicas
- **D**ependency Inversion: Depender de abstracciones, no concreciones

#### Otros Principios
- **DRY (Don't Repeat Yourself):** Extraer lógica repetida a utilidades/hooks
- **KISS (Keep It Simple, Stupid):** Preferir soluciones simples y directas
- **YAGNI (You Aren't Gonna Need It):** No implementar features especulativos
- **Separation of Concerns:** UI, lógica de negocio y data access separados

### 2.3 Patrones Arquitectónicos Específicos

#### State Management
- **Redux Toolkit:** Para state global (user, pins, collections)
- **React Context:** SOLO para theming y i18n (no para business logic)
- **Local State (useState):** Para UI state temporal (modals, forms)
- **Server State:** React Query/SWR NO usado en MVP (Firebase handles caching)

**Regla de Oro:** Si el state se necesita en >2 screens no relacionadas, va a Redux. Si es local a un feature, queda en local state.

#### Component Patterns
- **Container/Presentational:** Separar lógica (container) de UI (presentational)
- **Custom Hooks:** Extraer lógica reutilizable a hooks (ej. `useAuth`, `usePins`)
- **Composition over Inheritance:** Usar composición de componentes

#### Data Flow
```
User Action → Dispatch Redux Action → Thunk/Saga → Firebase Service → Update Redux State → Re-render Component
```

---

## 3. Estándares de Código

### 3.1 Nomenclatura (OBLIGATORIO)

| Elemento | Convención | Ejemplo | Notas |
|:---------|:-----------|:--------|:------|
| Variables | `camelCase` | `const userName = ...` | Descriptivas, no abreviar |
| Constants | `UPPER_SNAKE_CASE` | `const MAX_PIN_COUNT = 100` | Solo para valores inmutables |
| Functions | `camelCase` | `function createPin() {}` | Verbos o frases verbales |
| React Components | `PascalCase` | `function PinCard() {}` | Sustantivos |
| TypeScript Types | `PascalCase` | `type PinData = {...}` | |
| Interfaces | `PascalCase` con `I` prefix | `interface IUserService` | Solo para abstracciones |
| Enums | `PascalCase` | `enum PinCategory` | Valores en UPPER_SNAKE_CASE |
| Archivos (Components) | `PascalCase.tsx` | `PinCard.tsx` | Match component name |
| Archivos (Utilities) | `camelCase.ts` | `dateUtils.ts` | |
| Folders | `kebab-case` o `camelCase` | `pin-detail/` o `pinDetail/` | Consistencia en todo el proyecto |
| Redux Actions | `UPPER_SNAKE_CASE` | `CREATE_PIN_REQUEST` | Con feature prefix |
| Test Files | `*.test.tsx` | `PinCard.test.tsx` | Mismo nombre que archivo testeado |

**Ejemplos Completos:**
```typescript
// ✅ CORRECTO
const userProfileData: UserProfile = getUserProfile();
const MAX_UPLOAD_SIZE_MB = 10;
function calculateFogPercentage(regions: Region[]): number { ... }
enum PinCategory { FOOD_DRINK = 'FOOD_DRINK', ADVENTURE = 'ADVENTURE' }
interface IAuthService { login(email: string): Promise<User>; }

// ❌ INCORRECTO
const usrProf = ...;  // Abreviación
const maxUploadSize = 10;  // Debería ser UPPER_SNAKE_CASE
function calc_fog(r) { ... }  // snake_case, param no descriptivo
```

### 3.2 Formato de Código

**Herramienta:** Prettier con configuración estándar

`.prettierrc.json`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

**ESLint:** Configuración basada en `@react-native-community`

`.eslintrc.js` (reglas adicionales):
```javascript
module.exports = {
  extends: '@react-native-community',
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react-hooks/exhaustive-deps': 'error',
    'prefer-const': 'error',
  },
};
```

**Pre-commit Hook (Husky + lint-staged):**
```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

### 3.3 Estructura de Archivos

#### Componente React
```typescript
// PinCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Pin } from '@/shared/types';

interface PinCardProps {
  pin: Pin;
  onPress: (pin: Pin) => void;
}

export const PinCard: React.FC<PinCardProps> = ({ pin, onPress }) => {
  return (
    <View style={styles.container}>
      {/* Component JSX */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { /* styles */ },
});
```

#### Redux Slice
```typescript
// features/pins/pinsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Pin } from '@/shared/types';
import { pinsService } from './services/pinsService';

interface PinsState {
  items: Pin[];
  loading: boolean;
  error: string | null;
}

export const fetchPins = createAsyncThunk('pins/fetch', async (userId: string) => {
  return await pinsService.fetchUserPins(userId);
});

const pinsSlice = createSlice({
  name: 'pins',
  initialState: { items: [], loading: false, error: null } as PinsState,
  reducers: { /* sync actions */ },
  extraReducers: builder => {
    builder
      .addCase(fetchPins.pending, state => { state.loading = true; })
      .addCase(fetchPins.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  },
});

export default pinsSlice.reducer;
```

#### Service Layer
```typescript
// features/pins/services/pinsService.ts
import firestore from '@react-native-firebase/firestore';
import { Pin, CreatePinDTO } from '@/shared/types';

class PinsService {
  private collection = firestore().collection('pins');

  async fetchUserPins(userId: string): Promise<Pin[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pin));
  }

  async createPin(data: CreatePinDTO): Promise<Pin> {
    const docRef = await this.collection.add(data);
    return { id: docRef.id, ...data } as Pin;
  }

  // ... más métodos
}

export const pinsService = new PinsService();
```

---

## 4. Estándares de Calidad

### 4.1 Testing Strategy

**Pirámide de Testing:**
```
        /\
       /E2E\       10% - Detox (critical user journeys)
      /------\
     /  INT   \    20% - Integration (Redux + Firebase)
    /----------\
   /   UNIT     \  70% - Jest + RTL (components, utils, hooks)
  /--------------\
```

#### Cobertura Mínima (Enforced en CI)
- **Unit Tests:** ≥85% coverage (statements, branches, functions)
- **Integration Tests:** Todos los Redux slices y servicios Firebase
- **E2E Tests:** 5 flujos críticos (signup, create pin, create collection, upgrade, delete account)

#### Naming & Organization
```typescript
// PinCard.test.tsx
describe('PinCard', () => {
  describe('when pin has photo', () => {
    it('should render photo image', () => { /* test */ });
    it('should call onPress when tapped', () => { /* test */ });
  });

  describe('when pin has no photo', () => {
    it('should render placeholder', () => { /* test */ });
  });
});
```

#### Test File Structure
- Ubicación: Mismo directorio que archivo testeado, sufijo `.test.tsx`
- Alternativa: `__tests__/` folder dentro del feature module

#### Mocking
- Firebase: Usar `@react-native-firebase/firestore` mock en setup
- Navigation: Mock `@react-navigation` con jest
- AsyncStorage: Usar `@react-native-async-storage/async-storage/jest/async-storage-mock`

### 4.2 Manejo de Errores

#### Error Boundary (React)
```typescript
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }
  render() {
    return this.state.hasError ? <ErrorScreen /> : this.props.children;
  }
}
```

#### API Errors (Firebase)
```typescript
try {
  await pinsService.createPin(data);
} catch (error) {
  if (error.code === 'permission-denied') {
    showErrorToast('No tienes permisos para realizar esta acción');
  } else if (error.code === 'unavailable') {
    showErrorToast('Sin conexión. Verifica tu internet.');
  } else {
    Sentry.captureException(error);
    showErrorToast('Error inesperado. Por favor intenta nuevamente.');
  }
}
```

#### Estructura de Error Estandarizada
```typescript
interface AppError {
  code: string;           // 'AUTH_FAILED', 'PIN_CREATION_FAILED'
  message: string;        // User-friendly message
  originalError?: Error;  // Original error object
  metadata?: Record<string, any>;
}

function createAppError(code: string, message: string, original?: Error): AppError {
  return { code, message, originalError: original };
}
```

### 4.3 Logging

#### Niveles de Log
- **DEBUG:** Información detallada para debugging (solo en dev)
- **INFO:** Eventos normales del sistema (user login, pin created)
- **WARN:** Situaciones inesperadas pero recuperables (retry de network)
- **ERROR:** Errores que impiden funcionalidad (crash, data loss)

#### Implementación
```typescript
// shared/utils/logger.ts
import { Sentry } from '@sentry/react-native';

class Logger {
  debug(message: string, meta?: Record<string, any>) {
    if (__DEV__) console.log(`[DEBUG] ${message}`, meta);
  }

  info(message: string, meta?: Record<string, any>) {
    console.info(`[INFO] ${message}`, meta);
    // Opcional: enviar a analytics
  }

  warn(message: string, meta?: Record<string, any>) {
    console.warn(`[WARN] ${message}`, meta);
    Sentry.captureMessage(message, { level: 'warning', extra: meta });
  }

  error(message: string, error?: Error, meta?: Record<string, any>) {
    console.error(`[ERROR] ${message}`, error, meta);
    Sentry.captureException(error || new Error(message), { extra: meta });
  }
}

export const logger = new Logger();
```

#### Uso
```typescript
logger.info('User created pin', { pinId, category, hasPhoto: !!photo });
logger.error('Pin creation failed', error, { userId, attemptCount });
```

---

## 5. Seguridad

### 5.1 OWASP Top 10 Mitigations

| Vulnerabilidad | Mitigación |
|:--------------|:-----------|
| **Injection** | Firebase SDK maneja queries, no SQL raw. Validar inputs con Joi/Zod. |
| **Broken Auth** | Firebase Auth con OAuth. No custom auth logic. Session tokens refresh automático. |
| **Sensitive Data Exposure** | HTTPS enforced. No guardar secrets en código. Usar Firebase Config para API keys. |
| **XML External Entities (XXE)** | N/A (no XML parsing) |
| **Broken Access Control** | Firestore Security Rules server-side. Verificar userId en todas las queries. |
| **Security Misconfiguration** | Minimal permissions (location, camera). No debug logs en producción. |
| **XSS** | React escapa output automáticamente. Cuidado con dangerouslySetInnerHTML (no usar). |
| **Insecure Deserialization** | N/A (JSON only, no deserialización custom) |
| **Using Components with Known Vulnerabilities** | `npm audit` en CI. Dependabot enabled. |
| **Insufficient Logging & Monitoring** | Sentry para crashes. Mixpanel para eventos. Firebase Performance. |

### 5.2 Firebase Security Rules (Firestore)

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Pins: Solo lectura/escritura del owner
    match /pins/{pinId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Collections: Solo lectura/escritura del owner
    match /collections/{collectionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Users: Solo puede leer/escribir su propio documento
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5.3 Validación de Inputs

**Librería:** Zod para validación TypeScript-first

```typescript
import { z } from 'zod';

const CreatePinSchema = z.object({
  title: z.string().max(100),
  note: z.string().max(2000),
  category: z.enum(['FOOD_DRINK', 'ADVENTURE', /* ... */]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  photoURL: z.string().url().optional(),
});

type CreatePinDTO = z.infer<typeof CreatePinSchema>;

function validateCreatePin(data: unknown): CreatePinDTO {
  return CreatePinSchema.parse(data); // Throws si inválido
}
```

---

## 6. Performance

### 6.1 Budgets

| Métrica | Target | Enforcement |
|:--------|:-------|:------------|
| App Bundle Size (iOS) | <50 MB | CI warning >40MB, fail >50MB |
| App Bundle Size (Android) | <40 MB | CI warning >35MB, fail >40MB |
| Cold Start Time | <3 seconds | Performance monitoring alert |
| Map Load Time | <2 seconds | Performance monitoring alert |
| Pin Creation Time | <5 seconds | Analytics tracking |
| Frame Rate | 60 fps | No drops below 50fps during navigation |

### 6.2 Optimizaciones Obligatorias

#### Imágenes
- Usar `react-native-fast-image` para caching automático
- Lazy load imágenes fuera de viewport
- Compresión server-side (Cloud Function) a 2MB max
- Thumbnails (400px) para listados, fullsize solo en detail view

#### Listas
```typescript
// ✅ CORRECTO: FlatList con optimizaciones
<FlatList
  data={pins}
  renderItem={({ item }) => <PinCard pin={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={21}
  initialNumToRender={10}
  getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
/>

// ❌ INCORRECTO: ScrollView con .map()
<ScrollView>
  {pins.map(pin => <PinCard key={pin.id} pin={pin} />)}
</ScrollView>
```

#### Memoization
```typescript
// Componentes pesados
export const PinCard = React.memo(({ pin, onPress }) => { /* ... */ });

// Callbacks
const handlePress = useCallback((pin: Pin) => { /* ... */ }, []);

// Computed values
const sortedPins = useMemo(() => pins.sort(...), [pins]);
```

### 6.3 Bundle Splitting

- Code splitting por route NO usado en React Native (nativo bundle ya pequeño)
- Lazy loading de screens SI usado con React Navigation
- Hermes engine habilitado (iOS + Android) para mejor startup

---

## 7. Directrices para Agentes de IA

### 7.1 Reglas de Oro

#### 1. **Claridad sobre Velocidad**
- **Regla:** Si un requisito es ambiguo, DETENTE y pide clarificación
- **No hacer:** Asumir intención o inventar funcionalidad
- **Hacer:** Preguntar específicamente qué falta o es ambiguo

#### 2. **Código Completo y Funcional**
- **Regla:** El código entregado debe estar 100% completo y funcional
- **No hacer:** Dejar `// TODO:`, `// FIXME:`, `// Implement later`
- **No hacer:** Entregar código parcial con comentarios "esto falta"
- **Hacer:** Si algo es muy complejo, partir en subtareas más pequeñas

#### 3. **Zero Assumptions sobre Seguridad**
- **Regla:** Aplicar SIEMPRE best practices de seguridad OWASP
- **Hacer:** Validar TODOS los inputs de usuario
- **Hacer:** Verificar permisos antes de operaciones sensibles
- **Hacer:** Nunca hardcodear secrets, API keys, passwords
- **Hacer:** Usar HTTPS, encryption at rest, secure tokens

#### 4. **Testing is NOT Optional**
- **Regla:** Todo código nuevo requiere tests
- **Hacer:** Unit tests para utils, hooks, services
- **Hacer:** Component tests para React components
- **Hacer:** Integration tests para Redux slices
- **No entregar:** Código sin tests (excepto UI styling puro)

#### 5. **Follow the Architecture**
- **Regla:** No crear arquitecturas paralelas o atajos
- **Hacer:** Usar Redux para state global, no Context API
- **Hacer:** Seguir estructura de folders definida
- **Hacer:** Usar service layer para Firebase, no llamadas directas desde componentes

#### 6. **TypeScript Strict Mode**
- **Regla:** No usar `any` excepto en casos muy justificados
- **Hacer:** Definir types/interfaces para todos los objetos
- **Hacer:** Usar generics cuando aplique
- **No hacer:** Usar `@ts-ignore` sin comentario explicativo

#### 7. **Accessibility by Default**
- **Regla:** Todos los componentes interactivos deben ser accesibles
- **Hacer:** `accessibilityLabel` en buttons, touchables
- **Hacer:** Touch targets mínimo 44x44 points
- **Hacer:** Color contrast ratio 4.5:1 mínimo

#### 8. **Performance Awareness**
- **Regla:** Considerar performance en toda implementación
- **Hacer:** Memoizar componentes pesados con `React.memo`
- **Hacer:** Usar `FlatList` para listas, nunca `ScrollView` + `.map()`
- **Hacer:** Debounce/throttle para eventos frecuentes (search, scroll)

### 7.2 Checklist Pre-Entrega

Antes de marcar una tarea como completa, verificar:

- [ ] ✅ Código sigue naming conventions
- [ ] ✅ Prettier y ESLint pasan sin warnings
- [ ] ✅ Tests escritos y pasando (coverage ≥85%)
- [ ] ✅ No console.logs (solo en dev con `if (__DEV__)`)
- [ ] ✅ No TODOs ni FIXMEs
- [ ] ✅ TypeScript strict checks pasan
- [ ] ✅ Inputs validados con Zod
- [ ] ✅ Errors manejados y loggeados
- [ ] ✅ Componentes memoizados si re-renders frecuentes
- [ ] ✅ Accessibility labels agregados
- [ ] ✅ Documentación inline (JSDoc) en funciones complejas

---

## 8. Git & Workflow

### 8.1 Commits

**Formato:** Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Nueva feature (mapea a MINOR en semver)
- `fix`: Bug fix (mapea a PATCH)
- `docs`: Documentación
- `style`: Formatting, missing semi-colons, etc.
- `refactor`: Code change que no es fix ni feature
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Tooling, deps update

**Ejemplos:**
```
feat(pins): add photo upload to pin creation
fix(auth): resolve Google Sign-In crash on iOS
docs(readme): update setup instructions
refactor(map): extract fog clearing logic to custom hook
```

### 8.2 Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features (`feature/pin-creation`)
- `fix/*`: Bug fixes (`fix/login-crash`)
- `release/*`: Release preparation (`release/1.0.0`)

**Flow:** feature branch → develop → release → main

### 8.3 Pull Requests

**Requerimientos para merge:**
- [ ] CI green (lint, tests, build pasan)
- [ ] Code coverage no disminuye
- [ ] 1+ code review aprobado
- [ ] No merge conflicts
- [ ] Branch actualizado con base

**Template:**
```markdown
## Descripción
[Describe los cambios]

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Refactor
- [ ] Performance

## Testing
- [ ] Unit tests agregados/actualizados
- [ ] Manual testing realizado
- [ ] E2E tests actualizados (si aplica)

## Screenshots (si aplica)
[Adjuntar screenshots de UI changes]
```

---

## 9. CI/CD

### 9.1 Pipeline Steps

#### On Pull Request
1. **Lint:** ESLint + Prettier check
2. **Type Check:** `tsc --noEmit`
3. **Unit Tests:** Jest con coverage report
4. **Bundle Size Check:** Warn si >threshold
5. **Security Audit:** `npm audit`

#### On Merge to Develop
6. **Integration Tests:** Redux + Firebase mocks
7. **Build iOS/Android:** Verificar que compila
8. **E2E Tests:** Detox en simulator

#### On Release
9. **Full Test Suite:** Unit + Integration + E2E
10. **Build Release Bundles:** iOS IPA + Android APK
11. **Deploy to TestFlight/Internal Testing:** Beta distribution
12. **Smoke Tests:** Automated basic flow testing

### 9.2 Environment Variables

**Nunca commitear:**
```
# ❌ NO HACER
FIREBASE_API_KEY=AIzaSy...
MAPBOX_TOKEN=pk.eyJ1...
```

**Hacer:**
```
# .env.example (commiteado)
FIREBASE_API_KEY=
MAPBOX_TOKEN=
MIXPANEL_TOKEN=

# .env (en .gitignore, local)
FIREBASE_API_KEY=actual_key
MAPBOX_TOKEN=actual_token

# CI/CD
Usar secrets management (GitHub Secrets, Firebase Config)
```

---

## 10. Documentación

### 10.1 Código

**JSDoc para funciones públicas:**
```typescript
/**
 * Calculates the percentage of fog cleared on the world map.
 * @param regions - Array of cleared circular regions with lat/lon/radius
 * @returns Percentage of total world surface area cleared (0-100)
 */
export function calculateFogPercentage(regions: ClearedRegion[]): number {
  // Implementation
}
```

**README en cada feature:**
```markdown
# Feature: Pin Management

## Estructura
- `components/`: React components
- `screens/`: Full screens
- `hooks/`: Custom hooks (usePins, usePinForm)
- `services/`: Firebase service layer
- `types/`: TypeScript types

## Uso
```typescript
import { usePins } from '@/features/pins/hooks/usePins';
```
```

### 10.2 Cambios Breaking

**Documentar en CHANGELOG.md:**
```markdown
# Changelog

## [1.1.0] - 2025-11-15

### Added
- Dark mode support (F-064)
- Pin search by title (F-052)

### Changed
- **BREAKING:** PinCard component now requires `onPress` prop

### Fixed
- Map zoom crash on Android 11
```

---

## 11. Deployment

### 11.1 Versioning

**Semántica:** `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes (API incompatible)
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

**Ejemplo:** `1.0.0` → `1.1.0` (new feature) → `1.1.1` (bug fix)

### 11.2 Release Checklist

Pre-Release:
- [ ] Changelog actualizado
- [ ] Version bump en `package.json`, `ios/Info.plist`, `android/app/build.gradle`
- [ ] All tests passing
- [ ] Smoke test en devices físicos (iOS + Android)
- [ ] Privacy policy actualizada (si aplica)

Release:
- [ ] Tag git: `git tag -a v1.0.0 -m "Release 1.0.0"`
- [ ] Build & upload a TestFlight / Google Play Internal Testing
- [ ] Beta testing (50-100 users, 3-7 días)
- [ ] Resolve critical bugs
- [ ] Submit to App Store / Play Store
- [ ] Monitor crash reports first 24h

---

## 12. Maintenance

### 12.1 Dependency Updates

- **Frecuencia:** Mensual para patches, quarterly para minors
- **Process:**
  1. `npm outdated` para revisar
  2. Update en feature branch
  3. Run full test suite
  4. Manual testing crítico
  5. Merge si green

### 12.2 Tech Debt

- **Track:** Issues con label `tech-debt`
- **Allocate:** 20% de sprint capacity a refactors
- **Priorize:** Debt que bloquea nuevas features primero

---

## Apéndice: Quick Reference

### Commands Cheat Sheet

```bash
# Development
yarn install              # Instalar deps
yarn start                # Metro bundler
yarn ios                  # Run iOS simulator
yarn android              # Run Android emulator

# Quality
yarn lint                 # ESLint check
yarn lint:fix             # Auto-fix lint issues
yarn format               # Prettier check
yarn format:fix           # Auto-format code
yarn typecheck            # TypeScript check

# Testing
yarn test                 # Run Jest tests
yarn test:watch           # Watch mode
yarn test:coverage        # With coverage report
yarn test:e2e:ios         # Detox E2E iOS
yarn test:e2e:android     # Detox E2E Android

# Build
yarn build:ios            # Build iOS
yarn build:android        # Build Android
```

### Key Files

- `src/App.tsx`: Root component
- `src/navigation/RootNavigator.tsx`: Navigation config
- `src/store/index.ts`: Redux store
- `src/theme/index.ts`: Design tokens
- `firebase.json`: Firebase config
- `.env`: Environment variables (local)

---

**FIN DEL DOCUMENTO**

Este documento es vinculante para todo desarrollo en Atlas Personal. Desviaciones requieren aprobación del Technical Lead y deben documentarse como ADR (Architecture Decision Record).

**Siguiente paso:** Utilizar este documento junto con `PRD-verified.md` y `FEATURES.md` como entrada para `05-generate-rfcs.prompt.md` para desglosar el proyecto en RFCs implementables.
