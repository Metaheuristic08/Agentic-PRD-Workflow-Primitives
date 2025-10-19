# RFC-015: Testing, Polish & Launch Prep

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** XL  
**Estimated Duration:** 2 semanas  
**Dependencies:** RFC-001 through RFC-014

---

## Resumen

Este RFC final asegura que Atlas Personal MVP esté 100% listo para launch: test suite completo (unit, integration, E2E), optimización de performance, assets de App Store, beta testing, y release builds. Es el checkpoint de calidad final antes del lanzamiento público.

**Objetivo:** App testeada exhaustivamente, optimizada, con assets completos, beta-validated, y lista para App Store/Play Store submission.

---

## Especificaciones Técnicas

### 1. Test Suite Completo

#### 1.1 Unit Tests (Target: 85% coverage)

**Key areas to test:**
- Services: authService, pinsService, collectionsService, subscriptionService
- Utilities: validation, categoryUtils, imageUtils, dateUtils, clustering
- Redux reducers (isolated from async logic)

**Example:**
```typescript
// __tests__/features/pins/utils/validation.test.ts
describe('validateCreatePin', () => {
  it('should validate valid pin data', () => {
    const data = {
      title: 'Test Pin',
      note: 'Test note',
      category: PinCategory.FOOD_DRINK,
      location: {latitude: 40, longitude: -3},
      displayDate: new Date(),
    };

    expect(() => validateCreatePin(data)).not.toThrow();
  });

  it('should throw on future displayDate', () => {
    const data = {
      // ... other fields
      displayDate: new Date(Date.now() + 86400000), // Tomorrow
    };

    expect(() => validateCreatePin(data)).toThrow('Display date cannot be in the future');
  });
});
```

#### 1.2 Integration Tests

**Focus areas:**
- Redux slices with async thunks
- Firebase service integration (with mocks)
- Offline sync flow
- Subscription flow (with RevenueCat mock)

#### 1.3 E2E Tests (Detox)

**Critical user journeys:**
1. **Signup → Create First Pin:**
   - Sign up with email
   - Complete onboarding
   - Create pin with photo
   - Verify fog clears
   - Verify pin visible on map

2. **Create Collection → Add Pins:**
   - Navigate to Collections
   - Create new collection
   - Add existing pins
   - View filtered map

3. **Upgrade to Pro:**
   - Reach free tier limit
   - See upgrade modal
   - Navigate to pricing
   - (Sandbox) Complete purchase
   - Verify Pro status

4. **Search & View Pin:**
   - Search for pin by title
   - Select from results
   - View detail screen
   - Navigate back to map

5. **Delete Account:**
   - Navigate to settings
   - Delete account
   - Confirm deletion
   - Verify logout

### 2. Performance Optimization

#### 2.1 Bundle Size

**Target:** <50MB (iOS), <40MB (Android)

**Optimizations:**
- Code splitting where possible
- Remove unused dependencies
- Enable Hermes engine
- Proguard/R8 for Android
- Strip debug symbols in release

**Commands:**
```bash
# iOS bundle analysis
npx react-native-bundle-visualizer

# Android bundle analysis
cd android && ./gradlew app:bundleRelease --scan
```

#### 2.2 Runtime Performance

**Targets:**
- Cold start: <3 seconds
- Map load: <2 seconds
- Pin creation: <5 seconds
- Frame rate: >50 fps during interaction

**Optimizations:**
- Memoize expensive calculations
- Optimize FlatList rendering
- Lazy load images
- Debounce search input
- Use react-native-fast-image for caching

#### 2.3 Memory

**Target:** <200MB with 1000 pins

**Monitor:**
- Xcode Instruments (iOS)
- Android Studio Profiler (Android)
- Fix memory leaks in navigation

### 3. App Store Assets

#### 3.1 Screenshots

**iOS (Required sizes):**
- 6.5" iPhone (1284 x 2778) - iPhone 14 Pro Max
- 5.5" iPhone (1242 x 2208) - iPhone 8 Plus

**Screens to capture:**
1. Map with pins and fog
2. Pin detail view
3. Collections list
4. Timeline view
5. Pricing screen (Pro)

#### 3.2 App Icon

**Requirements:**
- 1024x1024 PNG (no transparency)
- Rounded corners applied by OS
- Clear, recognizable at small sizes

**Design:**
- Map pin icon
- Atlas/globe imagery
- Brand colors: Blue/Gold

#### 3.3 App Description

**English:**
```
Atlas Personal - The Map of Your Life

Transform your memories into an interactive atlas. Atlas Personal helps you document life experiences geographically, creating a beautiful visual story of your journey.

KEY FEATURES:
• Create memory pins with photos and notes
• Discover the world through the "fog of war" mechanic
• Organize memories into thematic collections
• View your life timeline chronologically
• Private and secure - your memories are yours alone

ATLAS PRO:
• Unlimited pins and collections
• Premium map styles
• Custom pin icons
• High-quality exports
• Priority support

Start mapping your life today!
```

**Spanish:**
```
Atlas Personal - El Mapa de Tu Vida

Transforma tus memorias en un atlas interactivo. Atlas Personal te ayuda a documentar experiencias de vida geográficamente, creando una hermosa historia visual de tu viaje.

CARACTERÍSTICAS CLAVE:
• Crea pins de memoria con fotos y notas
• Descubre el mundo con la mecánica "fog of war"
• Organiza memorias en colecciones temáticas
• Visualiza tu línea de tiempo de vida cronológicamente
• Privado y seguro - tus memorias son solo tuyas

ATLAS PRO:
• Pins y colecciones ilimitados
• Estilos premium de mapa
• Iconos personalizados
• Exportaciones de alta calidad
• Soporte prioritario

¡Comienza a mapear tu vida hoy!
```

### 4. Beta Testing

#### 4.1 TestFlight (iOS)

**Setup:**
1. Create App Store Connect app
2. Upload build via Xcode/Fastlane
3. Add 50-100 external testers
4. Enable crash reporting

**Testing period:** 1 week

**Collect:**
- Crash reports
- User feedback via in-app form
- Mixpanel event data
- App Store rating (pre-release)

#### 4.2 Google Play Internal Testing (Android)

**Setup:**
1. Create Google Play Console app
2. Upload AAB
3. Add internal testers (email list)

**Testing period:** 1 week (parallel with iOS)

#### 4.3 Feedback Collection

**In-app feedback form:**
- Rate your experience (1-5 stars)
- What did you like?
- What needs improvement?
- Would you recommend? (NPS)

### 5. Release Checklist

**Pre-Submission:**
- [ ] All tests passing (unit, integration, E2E)
- [ ] Coverage ≥85%
- [ ] No console.errors or warnings
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] App Store/Play Store assets ready
- [ ] In-app purchase products configured
- [ ] Firebase production project configured
- [ ] Sentry production project configured
- [ ] Mixpanel production project configured
- [ ] API keys rotated to production
- [ ] Beta testing completed
- [ ] Critical bugs fixed

**iOS Submission:**
- [ ] Xcode archive created
- [ ] Uploaded to App Store Connect
- [ ] Metadata filled (EN/ES)
- [ ] Screenshots uploaded
- [ ] App Store review notes added
- [ ] Export compliance declared
- [ ] Submitted for review

**Android Submission:**
- [ ] Release AAB generated
- [ ] Uploaded to Play Console
- [ ] Metadata filled (EN/ES)
- [ ] Screenshots uploaded
- [ ] Content rating questionnaire completed
- [ ] Privacy policy link added
- [ ] Submitted for review

**Post-Submission:**
- [ ] Monitor App Store/Play Store review status
- [ ] Prepare marketing materials
- [ ] Setup support email (support@atlaspersonal.com)
- [ ] Prepare launch announcement
- [ ] Monitor crash reports day 1
- [ ] Collect early user feedback

---

## Criterios de Aceptación Técnicos

### ✅ Testing
- [ ] Unit test coverage ≥85%
- [ ] All critical E2E flows passing
- [ ] No flaky tests
- [ ] CI/CD pipeline green

### ✅ Performance
- [ ] Bundle size within limits
- [ ] Cold start <3 seconds
- [ ] Frame rate >50 fps
- [ ] No memory leaks

### ✅ Assets
- [ ] All screenshots captured
- [ ] App icon finalized
- [ ] Descriptions written (EN/ES)
- [ ] Legal documents published

### ✅ Beta Testing
- [ ] 50+ testers recruited
- [ ] 1 week testing completed
- [ ] Critical bugs fixed
- [ ] Feedback incorporated

### ✅ Launch
- [ ] Apps submitted to stores
- [ ] Monitoring dashboards live
- [ ] Support infrastructure ready

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Unit tests (complete coverage) | 20 horas |
| Integration tests | 12 horas |
| E2E tests (5 flows) | 16 horas |
| Performance optimization | 12 horas |
| Bundle size optimization | 6 horas |
| App Store assets creation | 8 horas |
| Beta testing setup | 4 horas |
| Beta testing period | 1 semana |
| Bug fixes from beta | 12 horas |
| Release builds | 4 horas |
| Store submissions | 4 horas |
| **TOTAL** | **~80 horas (~2 semanas)** |

---

## Post-Launch (Week 1)

**Monitor:**
- Crash-free rate (target >99%)
- App Store rating
- Download count
- DAU/MAU
- Subscription conversion
- Critical user feedback

**Be ready to:**
- Hot-fix critical bugs
- Respond to App Store reviews
- Adjust marketing message based on data
- Plan v1.1 features based on feedback

---

**¡LISTO PARA LANZAMIENTO! 🚀**

**Conclusión:**
Con la finalización de este RFC-015, el MVP de Atlas Personal está completamente especificado, testeado, optimizado y listo para llegar a las manos de usuarios reales. 

**Próximos pasos después del launch:**
1. Monitorear métricas de éxito (definidas en PRD)
2. Recopilar feedback de usuarios early adopters
3. Iterar basado en datos
4. Planificar v1.1 con features de la lista "Could Have" del PRD
