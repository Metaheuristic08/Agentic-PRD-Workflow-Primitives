# Plan de Implementación Secuencial (RFCs): Atlas Personal MVP

**Generado desde:** PRD-verified.md, FEATURES.md, RULES.md  
**Fecha:** October 2025  
**Timeline Total:** 15 semanas (3.5 meses)  
**Total de RFCs:** 15

---

## Resumen Ejecutivo

Este documento describe el plan de construcción de Atlas Personal MVP, desglosado en 15 unidades de trabajo secuenciales (RFCs). La implementación debe seguir **estrictamente** este orden numérico para evitar bloqueos por dependencias.

### Distribución por Fase

- **Fase 1: Foundation** (Semanas 1-4): RFCs 001-003
- **Fase 2: Core Features** (Semanas 5-10): RFCs 004-008
- **Fase 3: Collections & Views** (Semanas 9-10): RFCs 009-010
- **Fase 4: Monetization** (Semanas 11-12): RFCs 011-012
- **Fase 5: Polish & Launch** (Semanas 13-15): RFCs 013-015

---

## Grafo de Dependencias

```
RFC-001 (Project Setup)
    ↓
RFC-002 (Firebase & Services Integration) ← depende de 001
    ↓
RFC-003 (Authentication System) ← depende de 002
    ↓
    ├─→ RFC-004 (Map Integration & Navigation) ← depende de 003
    │       ↓
    │   RFC-005 (Pin Creation & Management) ← depende de 004
    │       ↓
    │   RFC-006 (Fog of War System) ← depende de 005
    │       ↓
    │   RFC-007 (Pin Display & Interactions) ← depende de 006
    │       ↓
    │   RFC-008 (Offline Mode & Sync) ← depende de 007
    │       ↓
    ├─→ RFC-009 (Collections System) ← depende de 005, 007
    │       ↓
    ├─→ RFC-010 (Timeline & Gallery Views) ← depende de 007
    │
    └─→ RFC-011 (Subscription System Integration) ← depende de 003
            ↓
        RFC-012 (Tier Limits & Upgrade Flow) ← depende de 011
            ↓
        RFC-013 (Onboarding & Settings) ← depende de 003, 012
            ↓
        RFC-014 (Analytics & Monitoring) ← depende de 001-013
            ↓
        RFC-015 (Testing, Polish & Launch Prep) ← depende de 001-014
```

---

## Listado de RFCs

| Orden | ID del RFC | Resumen | Features Implementadas | Complejidad | Duración Estimada | Dependencias |
|:------|:-----------|:--------|:----------------------|:------------|:------------------|:-------------|
| 1 | `001-initial-project-setup` | Configuración inicial React Native, estructura de folders, tooling, CI/CD básico | - | XL | 1.5 semanas | Ninguna |
| 2 | `002-firebase-services-integration` | Integración de Firebase (Auth, Firestore, Storage), Mapbox SDK, RevenueCat, Sentry, Mixpanel | - | L | 1 semana | RFC-001 |
| 3 | `003-authentication-system` | Sistema completo de autenticación (email, Google), Redux auth slice, screens | F-001 a F-009 | L | 1.5 semanas | RFC-002 |
| 4 | `004-map-integration-navigation` | Integración de Mapbox, navegación de mapa, estilos, clustering básico | F-010 a F-017 | XL | 2 semanas | RFC-003 |
| 5 | `005-pin-creation-management` | Sistema CRUD completo de pins, formularios, validación, storage de fotos | F-018 a F-032 | XL | 2.5 semanas | RFC-004 |
| 6 | `006-fog-of-war-system` | Implementación del sistema de niebla (overlay, clearing, persistencia, animaciones) | F-033 a F-038 | XL | 2 semanas | RFC-005 |
| 7 | `007-pin-display-interactions` | Visualización de pins en mapa, tap handlers, vistas de detalle, swipe navigation | F-013, F-015, F-030 | M | 1 semana | RFC-006 |
| 8 | `008-offline-mode-sync` | Modo offline, queue de sync, manejo de conflictos, indicadores de estado | F-032, F-066 a F-070 | XL | 1.5 semanas | RFC-007 |
| 9 | `009-collections-system` | Sistema completo de colecciones (CRUD, asociación pins, filtrado, visualización) | F-039 a F-048 | L | 1.5 semanas | RFC-005, RFC-007 |
| 10 | `010-timeline-gallery-views` | Vistas alternativas (Timeline cronológica, Gallery de fotos, búsqueda) | F-049 a F-052 | M | 1 semana | RFC-007 |
| 11 | `011-subscription-integration` | Integración de RevenueCat, pantalla de pricing, flujo de compra, restore purchases | F-053 a F-058 | L | 1.5 semanas | RFC-003 |
| 12 | `012-tier-limits-upgrade-flow` | Enforcement de límites free tier, modales de upgrade, downgrade handling | F-027, F-040, F-060, F-061 | M | 1 semana | RFC-011 |
| 13 | `013-onboarding-settings` | Onboarding de 3 slides, pantalla de Settings completa, perfil de usuario | F-007, F-062 a F-065, F-071 a F-073 | M | 1 semana | RFC-003, RFC-012 |
| 14 | `014-analytics-monitoring` | Integración completa de Mixpanel, Sentry, Firebase Performance, event tracking | F-074 a F-076 | M | 0.5 semanas | RFC-001 a RFC-013 |
| 15 | `015-testing-polish-launch` | Test suite completo (unit, integration, E2E), performance optimization, launch prep | - | XL | 2 semanas | RFC-001 a RFC-014 |

---

## Detalles de Implementación por Fase

### **FASE 1: Foundation (Semanas 1-4)**

#### RFC-001: Initial Project Setup
**Objetivo:** Crear la base técnica del proyecto  
**Entregables:**
- React Native 0.72 inicializado con TypeScript
- Estructura de carpetas según RULES.md
- ESLint + Prettier configurados
- Husky + lint-staged para pre-commit hooks
- GitHub Actions CI básico (lint, typecheck)
- `package.json` con todas las dependencias
- README con setup instructions

#### RFC-002: Firebase & Services Integration
**Objetivo:** Integrar todos los servicios externos  
**Entregables:**
- Firebase project configurado (Auth, Firestore, Storage, Functions)
- Firestore security rules implementadas
- Mapbox SDK integrado (iOS + Android)
- RevenueCat configurado
- Sentry SDK integrado
- Mixpanel SDK integrado
- Environment variables setup (.env)

#### RFC-003: Authentication System
**Objetivo:** Sistema completo de autenticación funcional  
**Entregables:**
- Screens: Login, Signup, ForgotPassword
- Redux auth slice con async thunks
- Firebase Auth service layer
- Email/password auth flow
- Google Sign-In flow
- Session persistence
- Protected routes en Navigation
- Tests: Unit + Integration

---

### **FASE 2: Core Features (Semanas 5-10)**

#### RFC-004: Map Integration & Navigation
**Objetivo:** Mapa interactivo funcional  
**Entregables:**
- MapScreen con Mapbox GL integrado
- Controles de navegación (zoom, pan, rotate)
- Toggle Standard/Satellite views
- "My Location" button
- Map state persistence (Redux)
- Performance optimization (60 fps)
- Tests: Component + Integration

#### RFC-005: Pin Creation & Management
**Objetivo:** CRUD completo de pins  
**Entregables:**
- Pin creation form (PinCreateScreen)
- Photo picker integration (camera + gallery)
- Image upload to Firebase Storage
- Firestore pin document creation
- Pin edit screen
- Pin delete with confirmation
- Validation con Zod
- Redux pins slice
- pinsService layer
- Tests: Unit + Integration + E2E (create pin flow)

#### RFC-006: Fog of War System
**Objetivo:** Gamificación mediante fog clearing  
**Entregables:**
- Fog overlay layer en Mapbox
- Algoritmo de clearing (50km radius)
- FogState en Firestore
- Animación de clearing (1 segundo)
- Cálculo de % revelado
- Persistencia de fog state
- Milestone celebrations (opcional)
- Tests: Unit (algoritmo) + Integration

#### RFC-007: Pin Display & Interactions
**Objetivo:** Visualización y navegación de pins  
**Entregables:**
- Pin markers en mapa con iconos de categoría
- Pin clustering (>50 pins)
- Tap handler → Pin detail view
- PinDetailScreen con fullscreen photo
- Swipe navigation entre pins
- Edit/Delete buttons en detail
- Tests: Component + E2E

#### RFC-008: Offline Mode & Sync
**Objetivo:** Funcionalidad offline robusta  
**Entregables:**
- Redux Persist configurado
- SQLite local database
- Sync queue para operaciones offline
- Indicador de conexión
- Auto-sync al reconectar
- Compresión de imágenes (Cloud Function)
- Tests: Integration (sync scenarios)

---

### **FASE 3: Collections & Views (Semanas 9-10)**

#### RFC-009: Collections System
**Objetivo:** Sistema completo de colecciones temáticas  
**Entregables:**
- CollectionsScreen (lista de colecciones)
- Collection creation modal
- CollectionDetailScreen
- Pin selection mode (add/remove pins)
- Filtered map view por colección
- Route visualization (líneas conectando pins)
- Firestore collections schema
- Redux collections slice
- Tests: Unit + Integration + E2E

#### RFC-010: Timeline & Gallery Views
**Objetivo:** Vistas alternativas para explorar pins  
**Entregables:**
- TimelineScreen (lista cronológica)
- GalleryScreen (grid de fotos 3 columnas)
- SearchBar con filtrado por título
- Infinite scroll en Timeline
- Lazy loading en Gallery
- Tests: Component + Performance

---

### **FASE 4: Monetization (Semanas 11-12)**

#### RFC-011: Subscription Integration
**Objetivo:** Sistema de suscripción funcional  
**Entregables:**
- RevenueCat products configurados
- PricingScreen con benefits
- Purchase flow (iOS StoreKit, Android Play Billing)
- Receipt validation (RevenueCat)
- Restore purchases
- User subscription status en Redux
- Error handling (payment failures)
- Tests: Integration (mock purchases)

#### RFC-012: Tier Limits & Upgrade Flow
**Objetivo:** Enforcement de freemium limits  
**Entregables:**
- Server-side limit checks (Cloud Functions)
- Upgrade modals (at 100 pins, 3 collections)
- Pro feature badges en UI
- Downgrade handling (subscription expiry)
- Grace period logic (7 días)
- Email notifications (subscription events)
- Tests: Integration (limit scenarios)

---

### **FASE 5: Polish & Launch (Semanas 13-15)**

#### RFC-013: Onboarding & Settings
**Objetivo:** First-run experience y configuración  
**Entregables:**
- OnboardingScreen (3 slides, skippable)
- SettingsScreen completo
- User profile edit
- Language selector (ES/EN)
- Theme selector (Light/Dark/Auto)
- Privacy policy & Terms (WebView)
- Account deletion flow
- Data export functionality
- Tests: E2E (onboarding flow)

#### RFC-014: Analytics & Monitoring
**Objetivo:** Observability completa  
**Entregables:**
- Mixpanel event tracking (taxonomía completa)
- Sentry error tracking configurado
- Firebase Performance monitoring
- Analytics helper utilities
- Privacy-compliant tracking (no PII)
- Dashboard setup (Mixpanel + Sentry)
- Tests: Unit (event firing)

#### RFC-015: Testing, Polish & Launch Prep
**Objetivo:** QA completo y preparación para launch  
**Entregables:**
- Test coverage ≥85% (unit + integration)
- E2E test suite completo (Detox)
  - Happy paths: Signup → Create pin → Create collection → Upgrade
  - Error scenarios
- Performance optimization
  - Bundle size <50MB (iOS), <40MB (Android)
  - Cold start <3 segundos
  - Map load <2 segundos
- App Store assets
  - Screenshots (todas las screens principales)
  - App description (ES + EN)
  - Privacy policy final
  - App icon finalizado
- Beta testing
  - TestFlight build (iOS)
  - Internal testing (Android)
  - 50-100 beta testers
  - Feedback collection y bug fixes
- Release builds
  - iOS: Archive + upload to App Store
  - Android: APK/AAB + upload to Play Store

---

## Estrategia de Implementación

### Orden de Ejecución ESTRICTO

1. **Nunca** comenzar un RFC sin haber completado sus dependencias
2. **Siempre** verificar que todos los tests del RFC anterior pasan
3. **Validar** cada RFC con testing manual antes de proceder

### Uso de la Plantilla de Implementación

Para implementar cada RFC:

1. Abrir `templates/implementation-template.prompt.md`
2. Reemplazar placeholders:
   - `[ID]`: Número del RFC (ej: `001`)
   - `[Title]`: Título del RFC (ej: `initial-project-setup`)
3. Adjuntar contexto:
   - `docs/PRD-verified.md`
   - `docs/FEATURES.md`
   - `docs/RULES.md`
   - `docs/rfcs/[ID]-[title].spec.md` (el RFC específico)
4. Ejecutar el agente de implementación
5. Revisar código generado
6. Ejecutar tests
7. Commit y continuar con siguiente RFC

### Checkpoints de Calidad

Después de completar cada fase:

- **Post-Fase 1:** Verificar que setup es correcto, CI pasa, puede compilar
- **Post-Fase 2:** Smoke test de flujo completo (signup → create pin → see on map with fog)
- **Post-Fase 3:** Test de flujo collections y vistas alternativas
- **Post-Fase 4:** Test de subscription flow end-to-end
- **Post-Fase 5:** Full QA pass, performance testing, beta testing

---

## Métricas de Progreso

### Por RFC
- [ ] Spec file leído y comprendido
- [ ] Código implementado según RULES.md
- [ ] Tests escritos (coverage ≥85%)
- [ ] CI passing (lint, typecheck, tests)
- [ ] Manual testing exitoso
- [ ] Code review aprobado (si aplica)
- [ ] Merged a develop branch

### Por Fase
- [ ] Todos los RFCs de la fase completados
- [ ] Checkpoint de calidad pasado
- [ ] Demo funcional grabado
- [ ] Retrospectiva de fase (learnings)

### Global
- [ ] 15/15 RFCs completados
- [ ] App funcionando end-to-end
- [ ] Todos los Must-Have features implementados
- [ ] Test coverage ≥85%
- [ ] Performance budgets cumplidos
- [ ] App enviada a stores

---

## Notas Importantes

### Gestión de Riesgos

**Riesgo Alto Identificado en RFCs:**
- **RFC-006 (Fog of War):** Alta complejidad algorítmica. Si toma >2 semanas, considerar simplificación (fog clearing rectangular en vez de circular).
- **RFC-008 (Offline Mode):** Sincronización compleja. Implementar last-write-wins primero, conflictos avanzados en v1.1.
- **RFC-015 (Testing):** Bottleneck común. Paralelizar testing con implementación de RFCs finales.

### Decisiones Arquitectónicas (ADRs)

Durante implementación, documentar decisiones importantes:
- **ADR-001:** ¿Por qué React Native vs nativo?
- **ADR-002:** ¿Por qué Mapbox vs Google Maps?
- **ADR-003:** ¿Estrategia de caching de tiles de mapa?
- **ADR-004:** ¿Algoritmo exacto de fog clearing?

Guardar en `docs/adrs/`

---

## Próximos Pasos

1. **Revisar este documento** con el equipo completo
2. **Leer RFC-001** en detalle
3. **Configurar entorno de desarrollo** (macOS con Xcode, Android Studio)
4. **Ejecutar implementación de RFC-001** usando `templates/implementation-template.prompt.md`
5. **Iterar** siguiendo el orden secuencial

---

**¡Éxito en la implementación de Atlas Personal MVP!** 🗺️✨

*Último update: October 2025*
