# Listado de Características del Producto: Atlas Personal

**Generado desde:** PRD-verified.md  
**Fecha:** October 2025  
**Versión:** MVP 1.0

---

## Resumen Ejecutivo

- **Total de Características:** 62
- **Must Have (M):** 28 características
- **Should Have (S):** 18 características
- **Could Have (C):** 12 características
- **Won't Have (W):** 4 características (documentadas para futuras versiones)

**Complejidad Total Estimada:**
- Small (S): 15 características
- Medium (M): 28 características
- Large (L): 15 características
- Extra Large (XL): 4 características

**Estrategia de Implementación:**
Este desglose prioriza un MVP robusto que demuestre el valor único de Atlas Personal: la documentación geográfica de memorias con gamificación mediante el sistema de fog of war. Todas las características "Must Have" constituyen el producto mínimo viable funcional.

---

## Categoría 1: Autenticación y Gestión de Usuarios

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-001** | Registro de usuario con email/contraseña | - **DADO** un nuevo usuario, **CUANDO** ingresa email válido y contraseña (min 8 caracteres), **ENTONCES** se crea cuenta en Firebase Auth<br>- Validación de email enviada<br>- Cuenta creada en <3 segundos | Must Have | S |
| **F-002** | Registro con Google Sign-In | - **DADO** un nuevo usuario, **CUANDO** selecciona "Sign in with Google", **ENTONCES** se autentica con OAuth y se crea cuenta<br>- Permisos solicitados: email, nombre, foto perfil | Must Have | S |
| **F-003** | Inicio de sesión con email/contraseña | - **DADO** un usuario registrado, **CUANDO** ingresa credenciales correctas, **ENTONCES** accede a la app<br>- Token de sesión Firebase generado<br>- Redirección a mapa principal | Must Have | S |
| **F-004** | Inicio de sesión con Google | - **DADO** un usuario registrado con Google, **CUANDO** selecciona "Sign in with Google", **ENTONCES** accede con OAuth<br>- Session persistente entre cierres de app | Must Have | S |
| **F-005** | Cierre de sesión | - **DADO** un usuario autenticado, **CUANDO** selecciona "Logout", **ENTONCES** se invalida token y vuelve a pantalla de login<br>- Datos locales conservados para re-login | Must Have | S |
| **F-006** | Recuperación de contraseña | - **DADO** un usuario que olvidó contraseña, **CUANDO** solicita reset, **ENTONCES** recibe email con link temporal<br>- Link válido por 24 horas | Should Have | S |
| **F-007** | Perfil de usuario básico | - **DADO** un usuario autenticado, **CUANDO** accede a perfil, **ENTONCES** ve: nombre, email, foto, fecha registro<br>- Puede editar nombre y foto | Should Have | M |
| **F-008** | Eliminación de cuenta | - **DADO** un usuario, **CUANDO** solicita eliminar cuenta, **ENTONCES** muestra confirmación con advertencia<br>- Al confirmar: todos los datos (pins, fotos, colecciones) eliminados en 7 días<br>- Email de confirmación enviado con opción de undo (7 días) | Must Have | M |
| **F-009** | Exportación de datos de usuario | - **DADO** un usuario, **CUANDO** solicita exportar datos, **ENTONCES** genera archivo JSON con todos pins, colecciones, metadatos<br>- Link de descarga válido 24 horas<br>- Cumplimiento GDPR | Must Have | M |

---

## Categoría 2: Sistema de Mapas Interactivo

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-010** | Integración de Mapbox GL | - **DADO** la app se inicia, **CUANDO** usuario accede al mapa, **ENTONCES** se carga Mapbox GL en <2 segundos (4G)<br>- Soporte de zoom levels 0-20<br>- Rendimiento 60 fps durante navegación | Must Have | L |
| **F-011** | Navegación de mapa (pan, zoom) | - **DADO** el mapa está cargado, **CUANDO** usuario hace gestos touch, **ENTONCES**:<br>- Pinch zoom funciona suavemente<br>- Pan con un dedo<br>- Doble tap para zoom in<br>- Rotación con dos dedos | Must Have | M |
| **F-012** | Cambio entre vistas de mapa (Standard/Satellite) | - **DADO** el mapa está visible, **CUANDO** usuario selecciona estilo, **ENTONCES** cambia entre Standard y Satellite<br>- Transición suave <500ms<br>- Configuración guardada en preferencias | Must Have | S |
| **F-013** | Visualización de pines en mapa | - **DADO** usuario tiene pins creados, **CUANDO** ve el mapa, **ENTONCES** todos los pins se muestran en ubicaciones correctas<br>- Iconos de categoría visibles<br>- Clustering cuando >50 pins en viewport | Must Have | M |
| **F-014** | Clustering de pines | - **DADO** múltiples pins en área pequeña, **CUANDO** usuario hace zoom out, **ENTONCES** pins se agrupan con badge de conteo<br>- Zoom in expande clusters<br>- Tap en cluster hace zoom a esa región | Should Have | L |
| **F-015** | Tap en pin para ver detalles rápidos | - **DADO** pins visibles en mapa, **CUANDO** usuario toca un pin, **ENTONCES** aparece callout con miniatura de foto, título y categoría<br>- Tap en callout abre vista detallada completa | Must Have | M |
| **F-016** | Centrar mapa en ubicación actual | - **DADO** permisos de ubicación concedidos, **CUANDO** usuario toca botón "Mi ubicación", **ENTONCES** mapa se centra en GPS actual<br>- Animación suave de transición | Should Have | S |
| **F-017** | Persistencia de región de mapa vista | - **DADO** usuario navega el mapa, **CUANDO** cierra y reabre app, **ENTONCES** mapa se abre en la última región vista<br>- Zoom level también persistido | Should Have | S |

---

## Categoría 3: Creación y Gestión de Pines

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-018** | Creación de pin mediante tap en mapa | - **DADO** usuario toca ubicación en mapa, **CUANDO** mantiene presionado, **ENTONCES** aparece marcador de pin temporal<br>- Al soltar, se abre formulario de creación | Must Have | M |
| **F-019** | Selección de foto desde galería | - **DADO** usuario está creando pin, **CUANDO** selecciona "Agregar foto", **ENTONCES** abre galería nativa del dispositivo<br>- Puede seleccionar 1 foto (max 10MB)<br>- Preview de foto en formulario | Must Have | M |
| **F-020** | Captura de foto con cámara | - **DADO** usuario está creando pin, **CUANDO** selecciona "Tomar foto", **ENTONCES** abre cámara nativa<br>- Foto capturada se agrega a pin<br>- GPS metadata extraído si disponible | Must Have | M |
| **F-021** | Ingreso de título de pin | - **DADO** formulario de pin, **CUANDO** usuario escribe título, **ENTONCES** acepta hasta 100 caracteres<br>- Campo opcional pero recomendado<br>- Placeholder: "Ej: El atardecer perfecto en la playa" | Must Have | S |
| **F-022** | Ingreso de nota/descripción de pin | - **DADO** formulario de pin, **CUANDO** usuario escribe nota, **ENTONCES** acepta hasta 2000 caracteres<br>- Campo opcional<br>- Multiline text area | Must Have | S |
| **F-023** | Selección de categoría de pin | - **DADO** formulario de pin, **CUANDO** usuario selecciona categoría, **ENTONCES** muestra 8 opciones predefinidas con iconos<br>- Categoría default: "Personal Milestone"<br>- Icono de categoría se muestra en mapa | Must Have | S |
| **F-024** | Selección/edición de fecha del pin | - **DADO** formulario de pin, **CUANDO** usuario toca fecha, **ENTONCES** abre date picker<br>- Default: fecha actual<br>- Permite fechas pasadas (no futuras)<br>- Formato según locale del usuario | Should Have | M |
| **F-025** | Ajuste manual de ubicación de pin | - **DADO** formulario de pin abierto, **CUANDO** usuario toca "Cambiar ubicación", **ENTONCES** permite drag del pin en mapa<br>- Útil para fotos sin GPS o corrección de ubicación | Must Have | M |
| **F-026** | Guardado de pin | - **DADO** formulario completo, **CUANDO** usuario toca "Guardar", **ENTONCES**:<br>- Foto sube a Firebase Storage (background)<br>- Metadata guarda en Firestore<br>- Pin aparece en mapa inmediatamente<br>- Fog clearing se activa<br>- Operación completa en <5 segundos | Must Have | L |
| **F-027** | Validación de límites tier gratuito (100 pins) | - **DADO** usuario gratuito con 100 pins, **CUANDO** intenta crear pin 101, **ENTONCES** muestra modal de upgrade<br>- Opción de continuar bloqueada<br>- CTA claro a subscripción Pro | Must Have | M |
| **F-028** | Edición de pin existente | - **DADO** pin existente, **CUANDO** usuario selecciona "Editar", **ENTONCES** abre formulario pre-llenado<br>- Puede cambiar: foto, título, nota, categoría, fecha, ubicación<br>- Cambios guardados inmediatamente | Must Have | M |
| **F-029** | Eliminación de pin | - **DADO** pin existente, **CUANDO** usuario selecciona "Eliminar", **ENTONCES** muestra confirmación<br>- Al confirmar: pin eliminado de Firestore, foto eliminada de Storage<br>- Pin removido de todas las colecciones<br>- Acción irreversible | Must Have | M |
| **F-030** | Vista detallada de pin | - **DADO** usuario toca un pin, **CUANDO** accede a detalles, **ENTONCES** ve:<br>- Foto en fullscreen (tap para ampliar)<br>- Título, nota, categoría, fecha<br>- Nombre de ubicación (geocoding reverso)<br>- Botones: Editar, Eliminar, Compartir (v2) | Must Have | M |
| **F-031** | Manejo de fotos sin GPS | - **DADO** foto sin metadata GPS, **CUANDO** usuario la selecciona, **ENTONCES** permite selección manual de ubicación en mapa<br>- Mensaje claro: "Esta foto no tiene ubicación, selecciona en el mapa" | Must Have | S |
| **F-032** | Queue de upload offline | - **DADO** usuario sin conexión, **CUANDO** crea pin con foto, **ENTONCES**:<br>- Pin guarda localmente<br>- Foto en queue de upload<br>- Indicador de "pendiente sincronización"<br>- Auto-sync al reconectar | Must Have | L |

---

## Categoría 4: Sistema de Fog of War (Gamificación)

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-033** | Overlay de niebla inicial en mapa | - **DADO** nuevo usuario, **CUANDO** abre mapa por primera vez, **ENTONCES** ve mundo cubierto con fog opacity 80%<br>- Fog es layer visual sobre Mapbox<br>- Performance sin degradación | Must Have | L |
| **F-034** | Clearing de fog al crear pin | - **DADO** usuario crea pin, **CUANDO** pin se guarda, **ENTONCES** fog se despeja en radio de 50km circular<br>- Animación smooth de 1 segundo<br>- Fog clearing es permanente | Must Have | XL |
| **F-035** | Cálculo de porcentaje de mundo revelado | - **DADO** fog clearing ocurre, **CUANDO** se actualiza, **ENTONCES** calcula % total de fog despejado<br>- Visible en perfil de usuario<br>- Actualización en tiempo real | Should Have | M |
| **F-036** | Persistencia de estado de fog | - **DADO** usuario ha despejado fog, **CUANDO** cierra y reabre app, **ENTONCES** fog state se restaura desde Firestore<br>- No re-fog de áreas ya reveladas | Must Have | M |
| **F-037** | Animación de celebración en milestones | - **DADO** usuario alcanza hito (10%, 25%, 50% fog revelado), **CUANDO** ocurre, **ENTONCES** muestra animación de confeti<br>- Haptic feedback<br>- Notificación push (opcional) | Could Have | M |
| **F-038** | Indicador visual de progreso de fog | - **DADO** usuario en perfil, **CUANDO** ve estadísticas, **ENTONCES** muestra barra de progreso y porcentaje<br>- Comparación con usuarios promedio (opcional) | Could Have | S |

---

## Categoría 5: Sistema de Colecciones Temáticas

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-039** | Creación de colección | - **DADO** usuario en tab "Colecciones", **CUANDO** toca "+", **ENTONCES** abre diálogo para nombrar colección<br>- Máximo 50 caracteres<br>- Color auto-asignado de paleta<br>- Creación instantánea (<1 segundo) | Must Have | S |
| **F-040** | Validación de límite tier gratuito (3 colecciones) | - **DADO** usuario gratuito con 3 colecciones, **CUANDO** intenta crear colección 4, **ENTONCES** muestra modal de upgrade<br>- Opción bloqueada<br>- CTA a Pro | Must Have | S |
| **F-041** | Agregar pin existente a colección | - **DADO** colección existente, **CUANDO** usuario selecciona "Editar colección", **ENTONCES** entra en modo selección de pins<br>- Puede seleccionar múltiples pins<br>- Pins ya en colección marcados con checkmark<br>- Relación many-to-many (pin puede estar en múltiples colecciones) | Must Have | M |
| **F-042** | Remover pin de colección | - **DADO** pin en colección, **CUANDO** usuario selecciona "Remover de colección", **ENTONCES** pin sale de colección<br>- Pin NO se elimina, solo asociación<br>- Confirmación no requerida (acción reversible) | Must Have | S |
| **F-043** | Vista filtrada de colección en mapa | - **DADO** usuario selecciona colección, **CUANDO** toca "Ver en mapa", **ENTONCES**:<br>- Solo pins de esa colección visibles<br>- Otros pins ocultos<br>- Toggle para mostrar/ocultar filtro | Must Have | M |
| **F-044** | Visualización de ruta entre pins de colección | - **DADO** colección con 2+ pins, **CUANDO** vista filtrada activa, **ENTONCES** dibuja línea conectando pins<br>- Orden: cronológico por fecha de pin<br>- Color de línea: color de colección | Should Have | L |
| **F-045** | Edición de nombre de colección | - **DADO** colección existente, **CUANDO** usuario selecciona "Renombrar", **ENTONCES** permite editar nombre<br>- Validación: 1-50 caracteres<br>- Guardado inmediato | Should Have | S |
| **F-046** | Eliminación de colección | - **DADO** colección existente, **CUANDO** usuario selecciona "Eliminar", **ENTONCES** muestra confirmación<br>- Al confirmar: colección eliminada, pins conservados<br>- Acción irreversible | Must Have | S |
| **F-047** | Lista de colecciones con conteo de pins | - **DADO** usuario en tab "Colecciones", **CUANDO** ve lista, **ENTONCES** muestra:<br>- Nombre de colección<br>- Color visual<br>- Número de pins<br>- Fecha de creación | Must Have | S |
| **F-048** | Ordenamiento de colecciones | - **DADO** usuario tiene múltiples colecciones, **CUANDO** ve lista, **ENTONCES** ordenadas por fecha de creación (más reciente primero)<br>- Opción de ordenar alfabéticamente (Could Have) | Should Have | S |

---

## Categoría 6: Vistas Alternativas (Timeline, Gallery)

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-049** | Vista Timeline cronológica de pins | - **DADO** usuario selecciona tab "Timeline", **CUANDO** accede, **ENTONCES** ve lista de pins ordenados por fecha (más reciente primero)<br>- Agrupados por mes/año<br>- Headers de fecha<br>- Infinite scroll | Should Have | M |
| **F-050** | Vista Gallery de fotos | - **DADO** usuario selecciona tab "Gallery", **CUANDO** accede, **ENTONCES** ve grid de fotos (3 columnas)<br>- Solo fotos, sin pins sin foto<br>- Tap en foto abre vista detallada<br>- Lazy loading | Should Have | M |
| **F-051** | Swipe entre pins en vista detallada | - **DADO** usuario en vista detallada de pin, **CUANDO** hace swipe left/right, **ENTONCES** navega a siguiente/anterior pin<br>- Orden: por proximidad geográfica (5km radius)<br>- Fallback: cronológico | Should Have | M |
| **F-052** | Búsqueda de pins por título | - **DADO** usuario en pantalla principal, **CUANDO** escribe en barra de búsqueda, **ENTONCES** filtra pins por coincidencia en título<br>- Search as you type<br>- Resultados en <500ms<br>- Highlight de matches | Should Have | M |

---

## Categoría 7: Sistema de Suscripción (Freemium to Pro)

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-053** | Integración de RevenueCat SDK | - **DADO** app instalada, **CUANDO** inicia, **ENTONCES** RevenueCat inicializado con API key<br>- Identificación de usuario sincronizada<br>- Receipt validation automática | Must Have | M |
| **F-054** | Pantalla de pricing/benefits Pro | - **DADO** usuario toca "Upgrade to Pro", **CUANDO** accede, **ENTONCES** ve:<br>- Lista de beneficios Pro<br>- Precio: $24.99/año (localized)<br>- Opción de free trial 7 días<br>- Botón "Subscribe Now"<br>- "Restore Purchases" link | Must Have | M |
| **F-055** | Flujo de compra de subscripción | - **DADO** usuario selecciona "Subscribe", **CUANDO** procede, **ENTONCES**:<br>- StoreKit (iOS) / Google Play Billing (Android) se activa<br>- Autenticación biométrica solicitada<br>- Purchase procesado<br>- RevenueCat valida receipt<br>- Status de usuario actualizado a "pro" | Must Have | L |
| **F-056** | Activación inmediata de features Pro | - **DADO** compra completada, **CUANDO** transaction finaliza, **ENTONCES**:<br>- Límites de pins/colecciones removidos inmediatamente<br>- Animación de celebración "Welcome to Pro"<br>- Redirect a pantalla de origen | Must Have | M |
| **F-057** | Manejo de errores de pago | - **DADO** error en payment (network, card declined, etc.), **CUANDO** ocurre, **ENTONCES**:<br>- Mensaje de error específico mostrado<br>- Opción de reintentar<br>- Link a soporte si problema persiste | Must Have | M |
| **F-058** | Restore Purchases | - **DADO** usuario reinstala app o cambia dispositivo, **CUANDO** selecciona "Restore Purchases", **ENTONCES**:<br>- RevenueCat verifica receipts existentes<br>- Si válido: usuario upgradeado a Pro<br>- Si no: mensaje "No active subscriptions found" | Must Have | M |
| **F-059** | Visualización de estado de subscripción | - **DADO** usuario Pro en Settings, **CUANDO** ve sección "Subscription", **ENTONCES** muestra:<br>- Plan actual: "Atlas Pro"<br>- Fecha de renovación<br>- Método de pago<br>- Link a "Manage Subscription" (lleva a App Store/Play Store) | Should Have | S |
| **F-060** | Enforcement de downgrade al expirar subscripción | - **DADO** subscripción Pro expira (no renueva), **CUANDO** ocurre, **ENTONCES**:<br>- Grace period: 7 días sin cambios<br>- Después: pins >100 en read-only, colecciones >3 archivadas<br>- Email notification 7 días antes, 1 día antes, al expirar | Must Have | L |
| **F-061** | Indicadores visuales de features Pro | - **DADO** usuario gratuito, **CUANDO** ve features locked, **ENTONCES** muestra badge "Pro"<br>- Tap en feature: redirect a pricing screen<br>- Ejemplo: estilos de mapa premium, iconos custom | Could Have | S |

---

## Categoría 8: Configuración y Preferencias

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-062** | Pantalla de Settings | - **DADO** usuario autenticado, **CUANDO** accede a Settings, **ENTONCES** ve opciones:<br>- Perfil (nombre, foto, email)<br>- Subscripción<br>- Idioma<br>- Tema (Light/Dark/Auto)<br>- Privacidad<br>- Acerca de (versión, términos, privacidad)<br>- Logout<br>- Eliminar cuenta | Must Have | M |
| **F-063** | Selección de idioma (ES/EN) | - **DADO** usuario en Settings, **CUANDO** cambia idioma, **ENTONCES**:<br>- UI se actualiza inmediatamente<br>- Preferencia guardada<br>- App reinicio NO requerido | Must Have | M |
| **F-064** | Selección de tema (Dark Mode) | - **DADO** usuario en Settings, **CUANDO** cambia tema, **ENTONCES**:<br>- Opciones: Light, Dark, System Default<br>- Cambio inmediato en toda la app<br>- Mapa cambia a estilo oscuro si Dark Mode | Could Have | M |
| **F-065** | Política de privacidad y Términos de servicio | - **DADO** usuario en Settings o registro, **CUANDO** toca links legales, **ENTONCES** abre WebView con documentos<br>- Documentos hosteados en Firebase Hosting<br>- Versión y fecha visible | Must Have | S |

---

## Categoría 9: Performance, Offline & Sync

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-066** | Compresión automática de imágenes | - **DADO** usuario sube foto, **CUANDO** foto >2MB, **ENTONCES**:<br>- Compresión automática a 2MB max (JPEG quality 80%)<br>- Resize a 2048px max dimension<br>- Thumbnail generado (400px) para mapa<br>- Proceso en background (Cloud Function) | Must Have | L |
| **F-067** | Caching de tiles de mapa | - **DADO** usuario navega mapa, **CUANDO** tiles se descargan, **ENTONCES** se cachean localmente<br>- Cache TTL: 30 días<br>- Mejora performance en áreas revisitadas | Should Have | M |
| **F-068** | Modo offline básico | - **DADO** usuario sin conexión, **CUANDO** usa app, **ENTONCES**:<br>- Puede ver pins/colecciones ya cargados<br>- Puede crear pins (guardados localmente)<br>- Indicador de "Offline" visible<br>- Auto-sync al reconectar | Must Have | XL |
| **F-069** | Indicador de estado de sincronización | - **DADO** datos pendientes de sync, **CUANDO** usuario ve app, **ENTONCES** muestra:<br>- Badge de "syncing" o "X items pending"<br>- Progress durante sync<br>- Confirmación al completar | Should Have | M |
| **F-070** | Manejo de conflictos de sync | - **DADO** mismo pin editado offline y online, **CUANDO** sync ocurre, **ENTONCES**:<br>- Last-write-wins strategy (más reciente gana)<br>- Log de conflicto para debugging | Could Have | L |

---

## Categoría 10: Onboarding & Ayuda

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-071** | Onboarding de 3 slides para nuevos usuarios | - **DADO** usuario abre app por primera vez, **CUANDO** completa registro, **ENTONCES** ve 3 slides:<br>1. Welcome + concepto de Atlas Personal<br>2. Explicación de fog of war<br>3. CTA "Crea tu primer pin"<br>- Skippable<br>- Duración total: <30 segundos | Must Have | M |
| **F-072** | Tooltips contextuales en primera interacción | - **DADO** nuevo usuario, **CUANDO** ve mapa por primera vez, **ENTONCES** tooltip sugiere "Tap anywhere to create your first memory"<br>- Tooltip desaparece después de primera interacción<br>- No intrusivo | Should Have | S |
| **F-073** | Pantalla de "empty state" motivacional | - **DADO** usuario sin pins, **CUANDO** ve mapa vacío, **ENTONCES** muestra ilustración y mensaje motivacional<br>- "Start building your personal atlas"<br>- CTA claro para crear primer pin | Could Have | S |

---

## Categoría 11: Analytics & Monitoring

| ID | Característica | Criterios de Aceptación | Prioridad (MoSCoW) | Complejidad |
|:---|:--------------|:------------------------|:-------------------|:------------|
| **F-074** | Integración de Mixpanel para event tracking | - **DADO** usuario interactúa con app, **CUANDO** realiza acciones clave, **ENTONCES** eventos enviados a Mixpanel<br>- Ver taxonomía de eventos en PRD Appendix<br>- No tracking de PII | Must Have | M |
| **F-075** | Integración de Sentry para crash reporting | - **DADO** app en producción, **CUANDO** crash ocurre, **ENTONCES** stack trace enviado a Sentry<br>- Incluye: device info, OS version, app version<br>- No incluye: user photos, notes, personal data | Must Have | S |
| **F-076** | Firebase Performance Monitoring | - **DADO** app en uso, **CUANDO** screens cargan, **ENTONCES** métricas enviadas a Firebase:<br>- Screen load times<br>- Network request durations<br>- App startup time | Should Have | S |

---

## Won't Have (Fuera de Scope para MVP)

| ID | Característica | Razón de Exclusión | Consideración Futura |
|:---|:--------------|:-------------------|:---------------------|
| **W-001** | Múltiples fotos por pin | Complejidad técnica y de UI excesiva para MVP | v1.2 - Photo carousel |
| **W-002** | Colecciones colaborativas (compartir con amigos) | Requiere backend de sharing y notificaciones complejas | v1.3 - Social features |
| **W-003** | Exportación de mapas en alta calidad (posters) | Feature premium, requiere rendering server-side | v1.1 - Pro feature |
| **W-004** | Búsqueda full-text en notas de pins | Complejidad de indexación y performance | v1.2 - Advanced search |

---

## Notas de Implementación

### Secuencia Recomendada de Desarrollo (Por Fase)

**Fase 1: Foundation (Semanas 1-4)**
- F-001 a F-009: Autenticación completa
- F-010 a F-012: Mapa básico funcional
- F-062, F-063, F-065: Settings básicos

**Fase 2: Core Features (Semanas 5-10)**
- F-018 a F-032: Sistema completo de pins
- F-033 a F-038: Fog of war
- F-066, F-068: Performance básica

**Fase 3: Collections & Views (Semanas 7-10)**
- F-039 a F-048: Sistema de colecciones
- F-049 a F-052: Vistas alternativas

**Fase 4: Monetization (Semanas 11-12)**
- F-053 a F-061: Subscripción completa

**Fase 5: Polish (Semanas 13-14)**
- F-071 a F-073: Onboarding
- F-074 a F-076: Analytics
- F-067, F-069, F-070: Sync avanzado
- F-064: Dark mode (si tiempo permite)

### Dependencias Técnicas Críticas

1. **F-010 (Mapbox)** es blocker para F-013, F-015, F-033, F-043
2. **F-001-F-005 (Auth)** son blocker para todo lo demás
3. **F-018-F-026 (Pin creation)** son blocker para F-033 (fog of war)
4. **F-053 (RevenueCat)** es blocker para F-054 a F-061

### Riesgos de Scope Creep

- **Cuidado con:** Permitir edición manual de fog clearing (fuera de scope)
- **Cuidado con:** Features sociales no planificadas
- **Cuidado con:** Personalización excesiva de UI en tier gratuito

---

**Siguiente Paso:** Utilizar este documento junto con `PRD-verified.md` como entrada para `04-create-rules.prompt.md` para establecer las reglas técnicas y de calidad del proyecto.
