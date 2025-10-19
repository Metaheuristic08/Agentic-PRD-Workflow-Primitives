# RFC-014: Analytics & Monitoring

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** M  
**Estimated Duration:** 0.5 semanas  
**Dependencies:** RFC-001 through RFC-013

---

## Resumen

Este RFC implementa observability completa con Mixpanel para event tracking, Sentry para crash reporting, y Firebase Performance para métricas de rendimiento. Incluye taxonomía de eventos, privacy-compliant tracking, y dashboards configurados.

**Objetivo:** Equipo tiene visibilidad completa de uso, errores, y performance para tomar decisiones data-driven y detectar issues rápidamente.

---

## Características Cubiertas

- **F-074:** Integración de Mixpanel para event tracking
- **F-075:** Integración de Sentry para crash reporting
- **F-076:** Firebase Performance Monitoring

---

## Especificaciones Técnicas

### 1. Event Tracking Implementation

**`src/shared/utils/analytics.ts`:**
```typescript
import {trackEvent as mixpanelTrack, identifyUser} from '@/services/analytics/mixpanel';
import {Platform} from 'react-native';

export interface EventProperties {
  [key: string]: string | number | boolean | null;
}

export function trackEvent(eventName: string, properties?: EventProperties): void {
  const enrichedProperties = {
    ...properties,
    platform: Platform.OS,
    timestamp: new Date().toISOString(),
  };

  mixpanelTrack(eventName, enrichedProperties);

  if (__DEV__) {
    console.log('[Analytics]', eventName, enrichedProperties);
  }
}

export {identifyUser};
```

### 2. Event Taxonomy (Per PRD)

**User Lifecycle:**
- `user_signup` (method: email | google)
- `user_login` (method: email | google)
- `user_logout`
- `subscription_started` (tier, price, trial)
- `subscription_cancelled`
- `account_deleted`

**Core Features:**
- `pin_created` (category, has_photo, has_note, location_method)
- `pin_edited` (changed_fields)
- `pin_deleted`
- `collection_created`
- `collection_edited`
- `collection_deleted`
- `pin_added_to_collection`
- `pin_removed_from_collection`

**Engagement:**
- `map_interaction` (zoom_level, region)
- `fog_cleared` (percentage_total)
- `pin_viewed` (from: map | timeline | search | collection)
- `photo_fullscreen`
- `timeline_viewed`
- `search_performed` (query, results_count)

**Subscription Funnel:**
- `upgrade_prompt_shown` (trigger)
- `upgrade_prompt_clicked`
- `pricing_screen_viewed`
- `purchase_initiated`
- `purchase_completed`
- `purchase_failed` (error_reason)
- `restore_purchases_tapped`

**Performance:**
- `app_launched`
- `app_backgrounded`
- `map_load_time` (duration_ms)
- `pin_upload_time` (duration_ms, file_size_mb)

### 3. Crash Reporting

Already integrated in RFC-002. Additional configuration:

**`src/services/monitoring/crashReporter.ts`:**
```typescript
import * as Sentry from '@sentry/react-native';

export function setUserContext(userId: string, email: string): void {
  Sentry.setUser({
    id: userId,
    email,
  });
}

export function clearUserContext(): void {
  Sentry.setUser(null);
}

export function addBreadcrumb(message: string, category: string, data?: any): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
  });
}

export function captureException(error: Error, context?: any): void {
  Sentry.captureException(error, {
    extra: context,
  });
}
```

### 4. Performance Monitoring

**`src/services/monitoring/performance.ts`:**
```typescript
import perf from '@react-native-firebase/perf';

export async function measureScreenLoad(screenName: string): Promise<() => void> {
  const trace = await perf().startTrace(`screen_${screenName}_load`);

  return () => {
    trace.stop();
  };
}

export async function measureAsyncOperation(
  operationName: string,
  operation: () => Promise<any>
): Promise<any> {
  const trace = await perf().startTrace(operationName);

  try {
    const result = await operation();
    trace.stop();
    return result;
  } catch (error) {
    trace.stop();
    throw error;
  }
}
```

---

## Criterios de Aceptación Técnicos

### ✅ Mixpanel
- [ ] All events from taxonomy tracked
- [ ] User identification on login
- [ ] No PII tracked (email redacted in events)
- [ ] Events visible in Mixpanel dashboard
- [ ] Funnels configured (signup, subscription)

### ✅ Sentry
- [ ] Crashes captured automatically
- [ ] Errors with stack traces
- [ ] User context attached
- [ ] Breadcrumbs for debugging
- [ ] Alerts configured for critical errors

### ✅ Firebase Performance
- [ ] Screen load times measured
- [ ] Network requests tracked
- [ ] App startup time measured
- [ ] Custom traces for key operations
- [ ] Alerts configured for degradation

### ✅ Tests
- [ ] Unit tests: analytics utilities
- [ ] Integration tests: Event firing
- [ ] Verify events in Mixpanel (manual QA)

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Analytics utilities | 2 horas |
| Event instrumentation (all features) | 8 horas |
| Crash reporting setup | 2 horas |
| Performance monitoring | 3 horas |
| Dashboard configuration | 3 horas |
| Testing | 2 horas |
| **TOTAL** | **~20 horas (~0.5 semanas)** |

---

## Próximo RFC

**RFC-015: Testing, Polish & Launch Prep**  
Depende de: RFC-001 through RFC-014

---

**¡Observabilidad completa para data-driven decisions!** 📊
