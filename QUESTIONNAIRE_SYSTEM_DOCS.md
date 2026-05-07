## 📋 Documentación: Sistema de Cuestionarios de Postulación en Dos Pasos

### 🎯 Descripción General

El sistema implementa un flujo de dos pasos para las postulaciones laborales:

1. **Paso 1: Formulario de Postulación**
   - Usuario llena datos personales (nombre, apellido, teléfono, email, DNI, CV, país, ciudad)
   - Validación en tiempo real de todos los campos

2. **Paso 2: Cuestionario Dinámico**
   - Modal interactivo específico del puesto
   - Preguntas personalizadas según el rol
   - Validación de respuestas antes de enviar

3. **Paso 3: Envío Integrado**
   - Se envía todo (formulario + cuestionario) a n8n en un solo payload
   - Las respuestas se guardan como JSON stringificado

---

## 🏗️ Arquitectura Técnica

### Componentes Creados

#### 1. **QuestionnaireModal** (`src/components/QuestionnaireModal.jsx`)

Modal reutilizable que muestra un cuestionario paso a paso.

**Props:**

```javascript
{
  isOpen: boolean,           // Controla visibilidad
  questionnaire: object,      // Datos del cuestionario
  isSubmitting: boolean,      // Estado de envío
  onClose: function,          // Callback al cerrar
  onSubmit: function          // Callback al enviar respuestas
}
```

**Características:**

- Navegación por pasos (Anterior/Siguiente)
- Barra de progreso
- Validación por pregunta
- Soporte para 3 tipos de preguntas:
  - `text` - Entrada de texto
  - `select` - Dropdown de opciones
  - `checkbox` - Múltiples opciones seleccionables

#### 2. **Hook useApplicationFlow** (`src/hooks/useApplicationFlow.js`)

Hook personalizado que gestiona el flujo de dos pasos.

**Funciones Principales:**

```javascript
// Avanzar al cuestionario desde el formulario
proceedToQuestionnaire(formData, nombrePuesto) → boolean

// Enviar postulación con cuestionario a webhook
submitApplication(answers, webhookUrl) → Promise<{success, error?}>

// Reiniciar el flujo
resetFlow() → void

// Volver al formulario para editar
backToApplication() → void
```

**Estado Retornado:**

```javascript
{
  applicationStep: 1|2|3,      // 1=form, 2=questionnaire, 3=enviando
  postulationData: object,     // Datos del formulario guardados
  questionnaireAnswers: object // Respuestas guardadas después de envío
}
```

#### 3. **Cuestionarios Dinámicos** (`src/data/questionnairesData.js`)

Configuración de preguntas específicas por puesto.

**Puestos Disponibles:**

1. **Editor de Videos** (5 preguntas)
   - Experiencia en edición
   - Software principal
   - URL de portafolio
   - Disponibilidad horaria
   - Especialidades (checkbox múltiple)

2. **Especialista en Tratamientos Láser** (5 preguntas)
   - Años de experiencia
   - Certificaciones (checkbox múltiple)
   - Tipos de tratamiento (checkbox múltiple)
   - Disponibilidad
   - Motivación

3. **Practicante - Editor de Videos** (5 preguntas)
   - Experiencia previa
   - Software conocidos
   - Razón de la practicantía
   - Disponibilidad semanal
   - Disposición de aprender

4. **Practicante - Filmmaker** (5 preguntas)
   - Experiencia previa en filmmaking
   - Habilidades de cinematografía (checkbox múltiple)
   - Disponibilidad para rodajes
   - Equipo propio
   - Motivación

5. **Asesor Comercial** (5 preguntas)
   - Años en ventas
   - Sector de experiencia
   - Habilidades clave (checkbox múltiple)
   - Modalidad de trabajo
   - Mejor logro de ventas

---

## 📁 Landing Pages Actualizada

### Archivos Modificados

```
src/pages/
├── EditorVideoPostulacionPage.jsx                    ✅ Actualizado
├── EspecialistaLaserPostulacionPage.jsx             ✅ Actualizado
├── PracticantesEditorVideoPostulacionPage.jsx       ✅ Actualizado
├── PracticantesFilmmakerPostulacionPage.jsx         ✅ Actualizado
└── VendedorPostulacionPage.jsx                       ✅ Actualizado
```

### Cambios en Cada Landing Page

**Importaciones Añadidas:**

```javascript
import QuestionnaireModal from "../components/QuestionnaireModal";
import { getQuestionnaire } from "../data/questionnairesData";
import useApplicationFlow from "../hooks/useApplicationFlow";
```

**Hook Inicializado:**

```javascript
const {
  applicationStep,
  proceedToQuestionnaire,
  submitApplication,
  resetFlow,
  backToApplication,
} = useApplicationFlow();

const questionnaire = getQuestionnaire(NOMBRE_PUESTO);
```

**handleSubmit Modificado:**

- Ya no envía directamente a n8n
- Valida datos del formulario
- Llama a `proceedToQuestionnaire()` para pasar al cuestionario
- Muestra modal de error si hay problemas

**Nuevo handleQuestionnaireSubmit:**

- Construye FormData con datos de postulación + respuestas
- Envía todo integrado a n8n
- Maneja éxito/error

**Modal Agregado en JSX:**

```javascript
{
  applicationStep === 2 && questionnaire && (
    <QuestionnaireModal
      isOpen={applicationStep === 2}
      questionnaire={questionnaire}
      isSubmitting={isSubmitting}
      onClose={backToApplication}
      onSubmit={handleQuestionnaireSubmit}
    />
  );
}
```

**Botón de Envío Actualizado:**

```javascript
// Antes:
{
  isSubmitting ? "Enviando postulación..." : "Enviar mi postulación";
}

// Ahora:
{
  isSubmitting ? "Procesando..." : "→ Siguiente: Cuestionario";
}
```

---

## 🔗 Integración con n8n Webhook

### Payload Enviado a n8n

```json
{
  "FormData": {
    "nombre": "string",
    "apellido": "string",
    "telefono": "+51987654321",
    "email": "usuario@mail.com",
    "dni": "12345678",
    "ciudad": "string",
    "país": "string",
    "curriculum": "File",
    "puesto": "string",
    "landing_url": "string",
    "timestamp": "ISO 8601",
    "respuestas_cuestionario": "JSON string",
    "ttclid": "string (opcional)",
    "fbclid": "string (opcional)",
    "utm_source": "string (opcional)",
    "utm_medium": "string (opcional)",
    "utm_campaign": "string (opcional)"
  }
}
```

### Estructura de respuestas_cuestionario

```json
{
  "experiencia_edicion": "2-5 años",
  "software_principal": "Adobe Premiere Pro",
  "portafolio_url": "https://youtube.com/@ejemplo",
  "disponibilidad": "Tiempo completo",
  "especialidad": ["Edición de reels", "Motion graphics"]
}
```

---

## 🎨 Flujo Visual del Usuario

```
┌─────────────────────────────┐
│  Landing Page Inicial       │
│  (Hero + Información)       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Formulario de Postulación  │
│  - Nombre, Email, DNI       │
│  - Teléfono, CV             │
│  - País, Ciudad             │
│                             │
│  [→ Siguiente: Cuestionario]│
└──────────┬──────────────────┘
           │
      ┌────▼────┐
      │ Validar │ ❌ Errores → Mostrar validación
      └────┬────┘
           │ ✅ OK
           ▼
┌─────────────────────────────┐
│  QuestionnaireModal         │
│  Step 1 of 5: Pregunta 1    │
│                             │
│  [← Atrás] [Siguiente →]   │
│  Progress: ████░░░░░ 20%   │
└─────┬───────────┬───────────┘
      │           │
      │ ← Atrás   │ Siguiente →
      │           │
      ▼           ▼
   (editar)    (más preguntas)
      ▲           │
      │ (steps 2-4 similares)
      │           │
      └─────┬─────┘
            ▼
┌─────────────────────────────┐
│  QuestionnaireModal         │
│  Step 5 of 5: Última Pregunta│
│                             │
│  [← Atrás] [Enviar ✓]      │
│  Progress: █████████ 100%  │
└──────────┬──────────────────┘
           │
      ┌────▼────┐
      │ Validar │ ❌ Vacía → Error
      └────┬────┘
           │ ✅ OK
           ▼
┌─────────────────────────────┐
│  Enviando a n8n...          │
│  ⏳ Procesando...           │
└──────────┬──────────────────┘
           │
      ┌────▼────┐
      │ Respuesta│
      └─┬───────┬┘
    ✅  │       │  ❌
        ▼       ▼
    ┌─────┐  ┌────────┐
    │Éxito│  │Error   │
    └─────┘  └────────┘
```

---

## ✅ Seguridad

### Protecciones Implementadas

1. **Validación Frontend:** Todos los campos se validan antes de avanzar
2. **Preguntas Requeridas:** No se puede enviar sin responder todas
3. **Tipos de Datos:**
   - Emails validados con regex
   - Teléfonos con 9 dígitos exactos
   - DNI con 8 dígitos exactos
   - Archivos PDF máximo 5MB
4. **Timeout:** 15 segundos para timeout de envío
5. **Tracking:** Se capturan UTM parameters y click IDs

### Datos Enviados a n8n

Los datos que llegan a n8n se pueden procesar para:

- Guardar en base de datos
- Enviar email de confirmación
- Enviar mensaje WhatsApp automático
- Agregar a CRM
- Generar reporte

---

## 🛠️ Extensión Futura

### Agregar Nuevo Puesto

1. **En `questionnairesData.js`:**

```javascript
export const QUESTIONNAIRES = {
  "Nuevo Puesto": {
    title: "Cuestionario - Nuevo Puesto",
    description: "Responde...",
    questions: [
      {
        id: "pregunta_1",
        type: "select", // o 'text', 'checkbox'
        question: "¿Tu pregunta?",
        options: ["Opción 1", "Opción 2"],
      },
    ],
  },
};
```

2. **Crear Nueva Landing Page:**

```javascript
const NOMBRE_PUESTO = "Nuevo Puesto";
// Importar QuestionnaireModal, useApplicationFlow, getQuestionnaire
// Seguir el mismo patrón que EditorVideoPostulacionPage.jsx
```

3. **Agregar Ruta en App.jsx:**

```javascript
<Route
  path="/nuevo-puesto-postulacion"
  element={<NuevoPuestoPostulacionPage />}
/>
```

---

## 📊 Monitoreo

### Métricas a Rastrear

1. **Tasa de Abandono por Paso:**
   - % de usuarios que llena Formulario
   - % de usuarios que completa Cuestionario
   - % de usuarios que confirma envío

2. **Campos que Generan Errores:**
   - Preguntas donde más usuarios se "atascan"

3. **Tiempo Promedio:**
   - Tiempo en formulario
   - Tiempo en cuestionario
   - Tiempo total de postulación

4. **Postulaciones por Fuente:**
   - Tracking de UTM parameters
   - Conversiones por campaña
   - Click IDs (TikTok, Facebook)

---

## 🚀 Deployment

### Archivos Nuevos a Deployar

```
✅ src/components/QuestionnaireModal.jsx       (Nuevo)
✅ src/data/questionnairesData.js              (Nuevo)
✅ src/hooks/useApplicationFlow.js             (Nuevo)
✅ src/services/webhookService.js              (Modificado)
✅ src/pages/EditorVideoPostulacionPage.jsx    (Modificado)
✅ src/pages/EspecialistaLaserPostulacionPage.jsx (Modificado)
✅ src/pages/PracticantesEditorVideoPostulacionPage.jsx (Modificado)
✅ src/pages/PracticantesFilmmakerPostulacionPage.jsx (Modificado)
✅ src/pages/VendedorPostulacionPage.jsx       (Modificado)
```

### Verificación Pre-Deploy

```bash
# Build del proyecto
npm run build

# Verificar que no haya errores
npm test (si existen tests)

# Deploy
npm run deploy
```

---

## 📞 Soporte

Para agregar nuevas preguntas o puestos, modificar el flujo, o reportar errores, contacta al equipo de desarrollo.

---

**Última actualización:** Mayo 2026  
**Versión:** 2.0 (Con Cuestionarios)  
**Estado:** ✅ Producción
