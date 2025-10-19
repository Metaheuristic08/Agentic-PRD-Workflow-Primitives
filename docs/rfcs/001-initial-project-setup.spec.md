# RFC-001: Initial Project Setup

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** XL  
**Estimated Duration:** 1.5 semanas  
**Dependencies:** Ninguna

---

## Resumen

Este RFC establece la fundación técnica completa del proyecto Atlas Personal. Incluye la inicialización del proyecto React Native con TypeScript, configuración de tooling (linting, formatting, testing), estructura de carpetas según las reglas técnicas, y setup básico de CI/CD.

**Objetivo:** Al completar este RFC, el proyecto debe tener una base sólida y profesional sobre la cual construir todas las features posteriores.

---

## Características Cubiertas

Este RFC no implementa features de usuario directamente, pero habilita la infraestructura para:
- Todos los RFCs posteriores (001 es la base de todo)

---

## Especificaciones Técnicas

### 1. Inicialización del Proyecto

#### 1.1 React Native Setup

**Comando de inicialización:**
```bash
npx react-native@0.72.latest init AtlasPersonal --template react-native-template-typescript
cd AtlasPersonal
```

**Verificaciones post-init:**
- [ ] Proyecto compila en iOS (`yarn ios`)
- [ ] Proyecto compila en Android (`yarn android`)
- [ ] Metro bundler inicia correctamente (`yarn start`)

#### 1.2 Versiones de Tecnologías Core

Actualizar `package.json` con versiones específicas:

```json
{
  "name": "atlas-personal",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=18.0.0",
    "yarn": ">=1.22.0"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.7",
    "typescript": "5.2.2"
  }
}
```

### 2. Estructura de Carpetas

Crear la siguiente estructura según RULES.md:

```
atlas-personal/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── pr-checks.yml
├── android/                 # React Native Android native code
├── ios/                     # React Native iOS native code
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── screens/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── __tests__/
│   │   ├── pins/
│   │   │   └── ... (misma estructura)
│   │   ├── collections/
│   │   ├── map/
│   │   └── subscription/
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   └── constants/
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   └── types.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── rootReducer.ts
│   │   └── hooks.ts
│   ├── services/
│   │   ├── firebase/
│   │   ├── mapbox/
│   │   └── analytics/
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   └── es.json
│   │   └── index.ts
│   └── App.tsx
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── __tests__/
│   ├── setup.ts
│   └── testUtils.tsx
├── docs/
│   ├── PRD.md
│   ├── PRD-verified.md
│   ├── FEATURES.md
│   ├── RULES.md
│   ├── RFCS-overview.md
│   └── rfcs/
├── .env.example
├── .env
├── .eslintrc.js
├── .prettierrc.json
├── .gitignore
├── babel.config.js
├── tsconfig.json
├── jest.config.js
├── package.json
└── README.md
```

**Script para crear estructura:**

```bash
# Crear estructura de src/
mkdir -p src/{features/{auth,pins,collections,map,subscription}/{components,screens,hooks,services,types,__tests__},shared/{components,hooks,utils,types,constants},navigation,store,services/{firebase,mapbox,analytics},theme,i18n/locales}

# Crear archivos index básicos
touch src/features/auth/index.ts
touch src/shared/index.ts
touch src/navigation/index.ts
touch src/store/index.ts
touch src/theme/index.ts
touch src/i18n/index.ts

# Crear carpetas de assets
mkdir -p assets/{images,fonts,icons}

# Crear carpeta de tests
mkdir -p __tests__
```

### 3. Configuración de Tooling

#### 3.1 TypeScript Configuration

**`tsconfig.json`:**
```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2019", "es2020"],
    "allowJs": false,
    "jsx": "react-native",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"],
      "@navigation/*": ["src/navigation/*"],
      "@store/*": ["src/store/*"],
      "@theme/*": ["src/theme/*"],
      "@services/*": ["src/services/*"]
    }
  },
  "include": ["src/**/*", "__tests__/**/*"],
  "exclude": ["node_modules", "babel.config.js", "metro.config.js", "jest.config.js"]
}
```

**Habilitar path aliases en Metro:** `metro.config.js`

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: {
      '@': path.resolve(__dirname, 'src'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@navigation': path.resolve(__dirname, 'src/navigation'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@theme': path.resolve(__dirname, 'src/theme'),
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

#### 3.2 ESLint Configuration

**Instalar dependencias:**
```bash
yarn add --dev @react-native-community/eslint-config eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**`.eslintrc.js`:**
```javascript
module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
        'no-console': ['warn', {allow: ['warn', 'error']}],
        'react-hooks/exhaustive-deps': 'error',
        'prefer-const': 'error',
        'no-var': 'error',
      },
    },
  ],
};
```

**`.eslintignore`:**
```
node_modules/
coverage/
android/
ios/
*.config.js
```

#### 3.3 Prettier Configuration

**Instalar:**
```bash
yarn add --dev prettier
```

**`.prettierrc.json`:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "endOfLine": "lf"
}
```

**`.prettierignore`:**
```
node_modules/
coverage/
android/
ios/
*.config.js
```

#### 3.4 Git Hooks (Husky + lint-staged)

**Instalar:**
```bash
yarn add --dev husky lint-staged
npx husky install
npm pkg set scripts.prepare="husky install"
```

**Crear hook:**
```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

**`package.json` (añadir):**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### 4. Testing Setup

#### 4.1 Jest Configuration

**Instalar dependencias:**
```bash
yarn add --dev jest @testing-library/react-native @testing-library/jest-native react-test-renderer @types/jest
```

**`jest.config.js`:**
```javascript
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts', '@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/types/**',
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
  },
};
```

**`__tests__/setup.ts`:**
```typescript
import 'react-native-gesture-handler/jestSetup';

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Setup global test utilities
global.console = {
  ...console,
  error: jest.fn(), // Suppress error logs in tests
  warn: jest.fn(),  // Suppress warning logs in tests
};
```

**`__tests__/testUtils.tsx`:**
```typescript
import React, {ReactElement} from 'react';
import {render, RenderOptions} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {configureStore} from '@reduxjs/toolkit';

// Create a mock store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      // Add reducers as they're created
    },
    preloadedState: initialState,
  });
};

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({children}) => {
  const store = createMockStore();
  return (
    <Provider store={store}>
      <NavigationContainer>{children}</NavigationContainer>
    </Provider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, {wrapper: AllTheProviders, ...options});

export * from '@testing-library/react-native';
export {customRender as render};
```

#### 4.2 Scripts en package.json

Añadir los siguientes scripts:

```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --check \"src/**/*.{ts,tsx,json}\"",
    "format:fix": "prettier --write \"src/**/*.{ts,tsx,json}\"",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf node_modules && yarn install",
    "clean:android": "cd android && ./gradlew clean && cd ..",
    "clean:ios": "cd ios && rm -rf build && pod install && cd .."
  }
}
```

### 5. CI/CD Setup (GitHub Actions)

#### 5.1 PR Checks Workflow

**`.github/workflows/pr-checks.yml`:**
```yaml
name: PR Checks

on:
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Run ESLint
        run: yarn lint
      
      - name: Run Prettier
        run: yarn format
      
      - name: TypeScript check
        run: yarn typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Run tests with coverage
        run: yarn test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: false

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '11'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Build Android
        run: cd android && ./gradlew assembleDebug --no-daemon
```

#### 5.2 Main CI Workflow

**`.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  push:
    branches: [main, develop]

jobs:
  full-ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Lint, Format, TypeCheck
        run: |
          yarn lint
          yarn format
          yarn typecheck
      
      - name: Run tests
        run: yarn test:coverage
      
      - name: Check bundle size
        run: |
          # Add bundle size check script here
          echo "Bundle size check placeholder"
```

### 6. Environment Variables Setup

**`.env.example` (commitear):**
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

# RevenueCat
REVENUECAT_API_KEY=

# Sentry
SENTRY_DSN=

# Mixpanel
MIXPANEL_TOKEN=
```

**`.env` (en .gitignore):**
```
# Actual values - NO COMMITEAR
FIREBASE_API_KEY=actual_key_here
MAPBOX_ACCESS_TOKEN=actual_token_here
# ... etc
```

**Instalar react-native-config:**
```bash
yarn add react-native-config
cd ios && pod install && cd ..
```

**Configurar en código:** `src/shared/config/env.ts`
```typescript
import Config from 'react-native-config';

export const ENV = {
  FIREBASE_API_KEY: Config.FIREBASE_API_KEY || '',
  FIREBASE_AUTH_DOMAIN: Config.FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_PROJECT_ID: Config.FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: Config.FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSAGING_SENDER_ID: Config.FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_APP_ID: Config.FIREBASE_APP_ID || '',
  MAPBOX_ACCESS_TOKEN: Config.MAPBOX_ACCESS_TOKEN || '',
  REVENUECAT_API_KEY: Config.REVENUECAT_API_KEY || '',
  SENTRY_DSN: Config.SENTRY_DSN || '',
  MIXPANEL_TOKEN: Config.MIXPANEL_TOKEN || '',
};
```

### 7. Git Configuration

**`.gitignore` (añadir además de lo default):**
```
# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Coverage
coverage/

# Build outputs
build/
dist/

# Detox
.detoxrc.json

# Misc
*.log
```

### 8. Documentation

#### 8.1 README.md

Actualizar con instrucciones de setup:

```markdown
# Atlas Personal

El Mapa de Tu Vida - A personal memory atlas mobile application.

## Prerequisites

- Node.js 18+
- Yarn 1.22+
- React Native CLI
- Xcode 14+ (for iOS)
- Android Studio (for Android)

## Setup

1. Clone the repository
```bash
git clone <repo-url>
cd atlas-personal
```

2. Install dependencies
```bash
yarn install
```

3. iOS setup
```bash
cd ios && pod install && cd ..
```

4. Configure environment variables
```bash
cp .env.example .env
# Edit .env with actual values
```

5. Run the app
```bash
# iOS
yarn ios

# Android
yarn android
```

## Development

```bash
# Start Metro bundler
yarn start

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Check code quality
yarn lint
yarn typecheck
yarn format
```

## Project Structure

See `docs/RULES.md` for detailed architecture and coding standards.

## Documentation

- [PRD (Product Requirements Document)](docs/PRD-verified.md)
- [Features List](docs/FEATURES.md)
- [Technical Rules](docs/RULES.md)
- [RFCs Overview](docs/RFCS-overview.md)

## License

Proprietary - All Rights Reserved
```

---

## Criterios de Aceptación Técnicos

Al finalizar este RFC, el proyecto debe cumplir con:

### ✅ Compilación
- [ ] `yarn ios` compila sin errores en Xcode Simulator
- [ ] `yarn android` compila sin errores en Android Emulator
- [ ] Metro bundler inicia sin warnings críticos

### ✅ Calidad de Código
- [ ] `yarn lint` pasa sin errores
- [ ] `yarn format` muestra código ya formateado
- [ ] `yarn typecheck` pasa sin errores de TypeScript
- [ ] Pre-commit hooks funcionan (lint-staged + husky)

### ✅ Testing
- [ ] `yarn test` ejecuta test suite (aunque sea solo 1 test básico)
- [ ] Coverage reporting funciona
- [ ] Test utilities (testUtils.tsx) creados y funcionales

### ✅ CI/CD
- [ ] GitHub Actions workflows creados
- [ ] PR checks pasan en GitHub (cuando se crea PR de prueba)
- [ ] Badge de CI visible en README (opcional)

### ✅ Estructura
- [ ] Todas las carpetas de `src/` creadas según spec
- [ ] Path aliases (`@/`, `@features/`, etc.) funcionan
- [ ] Environment variables setup completado

### ✅ Documentación
- [ ] README actualizado con instrucciones claras
- [ ] .env.example con todos los keys necesarios
- [ ] Comentarios inline en configs (tsconfig, jest, etc.)

---

## Tests a Implementar

### Test Básico de Sanity

**`__tests__/App.test.tsx`:**
```typescript
import React from 'react';
import {render} from './testUtils';
import App from '../src/App';

describe('App', () => {
  it('should render without crashing', () => {
    const {getByText} = render(<App />);
    // Buscar algún texto que exista en la app inicial
    expect(getByText(/atlas personal/i)).toBeTruthy();
  });
});
```

---

## Notas de Implementación

### Herramientas Recomendadas

- **IDE:** Visual Studio Code con extensiones:
  - ESLint
  - Prettier
  - TypeScript
  - React Native Tools
  
- **Debugging:** 
  - React Native Debugger
  - Flipper (para network, Redux, etc.)

### Troubleshooting Común

**Problema:** Metro bundler no encuentra módulos después de instalar deps  
**Solución:** `yarn start --reset-cache`

**Problema:** iOS build falla después de cambios en Podfile  
**Solución:** `cd ios && pod deintegrate && pod install && cd ..`

**Problema:** Android build falla con "SDK location not found"  
**Solución:** Crear `android/local.properties` con `sdk.dir=/path/to/Android/sdk`

---

## Tiempo Estimado por Tarea

| Tarea | Tiempo |
|:------|:-------|
| Inicialización React Native | 30 min |
| Estructura de carpetas | 30 min |
| TypeScript config | 1 hora |
| ESLint + Prettier | 1 hora |
| Jest setup | 1.5 horas |
| Git hooks (Husky) | 30 min |
| CI/CD workflows | 2 horas |
| Environment variables | 1 hora |
| Documentación | 1 hora |
| Testing y debugging | 2 horas |
| **TOTAL** | **~11 horas (~1.5 días)** |

---

## Próximo RFC

**RFC-002: Firebase & Services Integration**  
Depende de: RFC-001 ✅

---

**¡Este es el cimiento del proyecto! Ejecutar con cuidado y validar cada paso.** 🚀
