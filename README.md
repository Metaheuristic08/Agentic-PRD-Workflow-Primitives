### ¿Flujo de Trabajo Agéntico para Desarrollo de Software?

Así es.

#### Visión General

Cree este repositorio para sistematizar y "profesionalizar" el uso de IA en el desarrollo de software. No es solo una colección de prompts; es un sistema de desarrollo potenciado por Inteligencia Artificial.

En lugar de tener conversaciones desestructuradas con una IA, este flujo te permite actuar como un orquestador, guiando a un equipo de agentes especializados para construir un producto de forma predecible y fiable.

Desde hace un tiempo he estado utilizando este marco para desarrollar y ojalá pueda ser útil para ti también.

#### Requisitos Previos

1.  **Un Asistente de IA:** Necesitas una herramienta que pueda ejecutar estos prompts, como **Cursor**, **Copilot Chat en VS Code**, o cualquier otro asistente avanzado que te **PERMITA** adjuntar/llamar archivos (`@` o `#`) o pegar grandes bloques de texto como contexto.
2.  **El Repositorio:** Clona o descarga el repositorio a tu gusto.
3.  **Una Idea** .

---

### Flujo de Trabajo Principal: De la Idea al Plan de Implementación

Este es el camino principal que seguirás el 90% del tiempo. Es un proceso secuencial donde la salida de un agente se convierte en la entrada del siguiente.

<div align="center">
  <pre>
  01. Crear PRD ──▶ 02. Verificar PRD ──▶ 03. Extraer Features ──▶ 04. Crear Reglas ──▶ 05. Generar RFCs
  </pre>
</div>

#### **Paso 0: Preparación**

1.  Abre el repositorio en tu editor de código.
2.  Familiarízate con la estructura de carpetas y archivos.

#### **Paso 1: La Idea Inicial → Crear el PRD**

*   **Tu Objetivo:** Convertir tu idea vaga en un primer borrador de un Documento de Requisitos del Producto (PRD).
*   **Tu Acción:**
    1.  Abre el archivo `prompts/01-create-prd.prompt.md`.
    2.  Copia **todo** su contenido o menciona el archivo `prompts/01-create-prd.prompt.md`.
    3.  Pégalo o menciona el archivo en tu asistente de IA.
    4.  El agente se presentará y te hará la primera ronda de preguntas. **Responde a sus preguntas de la forma más detallada posible.**
    5.  Después de 2-3 rondas, el agente te pedirá validación para continuar. Dale el visto bueno.
*   **Resultado del Agente:** Creará el archivo `docs/PRD.md`.

#### **Paso 2: Aseguramiento de Calidad → Verificar el PRD**

*   **Tu Objetivo:** Revisar el PRD en busca de huecos, ambigüedades y riesgos. Es como hacer una revisión de código, pero para los requisitos.
*   **Tu Acción:**
    1.  Abre `prompts/02-verify-prd.prompt.md` y copia su contenido.
    2.  Pégalo o menciona el archivo en una **nueva sesión** con tu asistente de IA.
    3.  El prompt le pedirá al agente que revise el PRD. **Asegúrate** de que el agente tenga el contexto del archivo `docs/PRD.md` (usando `@docs/PRD.md` o `#docs/PRD.md` en Cursor/Copilot, o pegando su contenido).
*   **Resultado del Agente:** Creará dos archivos: `docs/PRD-review-summary.md` (un resumen para ti) y `docs/PRD-verified.md` (la versión mejorada y oficial que usaremos a partir de ahora).

#### **Paso 3: Desglose Funcional → Extraer Features**

*   **Tu Objetivo:** Traducir el PRD verificado en una lista de características priorizadas y accionables.
*   **Tu Acción:**
    1.  Copia o menciona el contenido de `prompts/03-extract-features.prompt.md`.
    2.  Pégalo o menciona el archivo en una nueva sesión y dale el contexto del archivo `docs/PRD-verified.md`.
*   **Resultado del Agente:** Creará el archivo `docs/FEATURES.md` con una tabla de todas las características del producto.

#### **Paso 4: La Constitución Técnica → Crear las Reglas**

*   **Tu Objetivo:** Establecer las reglas técnicas y de calidad que guiarán toda la implementación.
*   **Tu Acción:**
    1.  Copia o menciona el contenido de `prompts/04-create-rules.prompt.md`.
    2.  Pégalo o menciona el archivo en una nueva sesión.
    3.  **Importante:** Este agente necesita dos archivos de contexto. Provéele `docs/PRD-verified.md` y `docs/FEATURES.md`.
*   **Resultado del Agente:** Creará el archivo `docs/RULES.md`.

#### **Paso 5: El Plan Maestro → Generar los RFCs**

*   **Tu Objetivo:** Crear el plan de construcción detallado y secuencial. Este es el resultado final de la fase de planificación.
*   **Tu Acción:**
    1.  Copia o menciona el contenido de `prompts/05-generate-rfcs.prompt.md`.
    2.  Pégalo o menciona el archivo en una nueva sesión.
    3.  **Importante:** Este es el agente más complejo y necesita tres archivos de contexto: `docs/PRD-verified.md`, `docs/FEATURES.md` y `docs/RULES.md`.
*   **Resultado del Agente:**
    *   Creará la carpeta `docs/rfcs/`.
    *   Poblará esa carpeta con múltiples archivos `.spec.md`, uno por cada unidad de trabajo.
    *   Creará el archivo `docs/RFCS-overview.md` que es tu mapa de ruta para la implementación.

---

### Flujo de Trabajo de Implementación

Hora de construir.

1.  **Consulta el Atlas:** Abre `docs/RFCS-overview.md` y mira la tabla. La implementación se hace **estrictamente en orden numérico**.
2.  **Prepara el Prompt de Implementación:**
    *   Abre `templates/implementation-template.prompt.md`.
    *   Copia su contenido a un nuevo archivo o a tu editor de texto.
    *   Reemplaza los placeholders `[ID]` y `[Title]` con los datos del **primer RFC** que vas a implementar (ej. `001` y `initial-project-setup`).
3.  **Ejecuta el Agente de Implementación:**
    *   Pega tu prompt de implementación ya preparado en una nueva sesión de IA.
    *   Dale todo el contexto necesario: `PRD-verified.md`, `FEATURES.md`, `RULES.md`, y lo más importante, el archivo `.spec.md` específico que estás implementando (ej. `docs/rfcs/001-initial-project-setup.spec.md`).
    *   El agente te presentará un plan de código. Apruébalo.
    *   El agente generará el código.
4.  **Revisa e Integra:** Revisa el código generado, pruébalo e intégralo a tu proyecto.
5.  **Repite:** Vuelve al paso 1 y continúa con el siguiente RFC en la secuencia (`002`, `003`, etc.).

---

### Flujo de Trabajo de Mantenimiento

¿Qué pasa si se necesita un cambio a mitad del proyecto?

1.  **Que no cunda el pánico:** No modifiques los documentos existentes directamente.
2.  **Ejecuta el Agente de Cambio:**
    *   Copia el contenido de `prompts/06-manage-prd-change.prompt.md`.
    *   Pégalo en una nueva sesión.
    *   Dale como contexto todos los documentos de planificación (`PRD-verified.md`, `FEATURES.md`, `RULES.md`, `RFCS-overview.md`).
    *   En el mismo prompt, **describe el cambio solicitado** de la forma más clara posible.
3.  **Analiza el Reporte:** El agente generará `docs/change-analysis-report.md`. Este documento te dirá el impacto del cambio y te dará una recomendación estratégica sobre cómo y cuándo integrarlo.
4.  **Toma una Decisión:** Usa el reporte para decidir si el cambio se implementa ahora, se pospone, o se descarta.

Con este sistema, dejas de "chatear" y empiezas a digerir información para lograr un resultado complejo de manera estructurada y profesional.

Suerte y feliz coding. :)!.

Hecho con ❤️ por [@1toe](https://github.com/1toe) por un mejor desarrollo de software.