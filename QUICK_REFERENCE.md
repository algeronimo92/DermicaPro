# 🗺️ Índice de Referencia Rápida - Sistema de Cuestionarios

## 📍 ¿Dónde encuentro...?

### 🎨 El Modal del Cuestionario

**Archivo:** `src/components/QuestionnaireModal.jsx`

- Modal interactivo paso a paso
- Barra de progreso
- Botones: Anterior/Siguiente/Enviar

### ❓ Las Preguntas de cada Puesto

**Archivo:** `src/data/questionnairesData.js`

- 5 puestos × 5 preguntas cada uno
- Tipos: text, select, checkbox
- Función: `getQuestionnaire(nombrePuesto)`
- Función: `validateQuestionnaireAnswers(questionnaire, answers)`

### 🔄 El Estado del Flujo

**Archivo:** `src/hooks/useApplicationFlow.js`

- Hook personalizado que gestiona: Paso 1 → 2 → 3
- Funciones:
  - `proceedToQuestionnaire(formData, nombrePuesto)` → pasar al cuestionario
  - `submitApplication(answers, webhookUrl)` → enviar todo
  - `resetFlow()` → reiniciar
  - `backToApplication()` → volver al formulario

### 📨 El Webhook Service

**Archivo:** `src/services/webhookService.js`

- Nueva función: `sendApplicationWithQuestionnaire(formData, webhookUrl)`
- Maneja timeout de 15 segundos
- Retorna: `{success: boolean, error?: string}`

### 🏢 Las Landing Pages

**Archivos:**

```
src/pages/EditorVideoPostulacionPage.jsx
src/pages/EspecialistaLaserPostulacionPage.jsx
src/pages/PracticantesEditorVideoPostulacionPage.jsx
src/pages/PracticantesFilmmakerPostulacionPage.jsx
src/pages/VendedorPostulacionPage.jsx
```

Cada una contiene:

- `NOMBRE_PUESTO` - Nombre del rol
- `WEBHOOK_URL` - Endpoint de n8n
- `handleSubmit` - Valida formulario y procede al cuestionario
- `handleQuestionnaireSubmit` - Envía todo a n8n
- `QuestionnaireModal` - Renderizado en JSX

---

## 🔍 Para Encontrar Código Específico

### Si quiero... modificar una pregunta

1. Abre: `src/data/questionnairesData.js`
2. Busca el puesto en `QUESTIONNAIRES`
3. Edita el objeto de la pregunta
4. Guardar y recargar navegador

### Si quiero... agregar nuevo tipo de pregunta

1. Abre: `src/components/QuestionnaireModal.jsx`
2. Busca `const renderQuestion = () => {`
3. Agrega nuevo `case` en el switch
4. Actualiza también `questionnairesData.js` con ejemplo

### Si quiero... cambiar el mensaje de error

1. Busca en el archivo de landing page correspondiente
2. Modifica el texto en el modal de error
3. O busca en `QuestionnaireModal.jsx` para errores generales

### Si quiero... agregar validación de respuesta

1. Abre: `src/data/questionnairesData.js`
2. Busca: `export const validateQuestionnaireAnswers`
3. Agrega lógica de validación personalizada

### Si quiero... cambiar la URL del webhook

1. Busca en cada archivo landing page: `const WEBHOOK_URL = '...'`
2. Actualiza el valor (5 lugares diferentes)
3. O centraliza en un config file

### Si quiero... agregar nuevo campo al formulario

1. Abre landing page correspondiente
2. Busca `useState({ ... })` - agregar campo ahí
3. Agregar input en JSX
4. Agregar validación en `validateField()`
5. Agregar al FormData en `handleQuestionnaireSubmit()`

---

## 📌 Constantes Importantes

### NOMBRE_PUESTO (en cada landing page)

```javascript
const NOMBRE_PUESTO = "Editor de Videos"; // Cambiar según landing
```

### WEBHOOK_URL (en cada landing page)

```javascript
const WEBHOOK_URL =
  "https://n8n.dermicapro.online/webhook-test/cc4dda80-a015-463b-b922-d04c2fa42d8e";
```

### Tipos de Preguntas (questionnairesData.js)

```javascript
type: "text"; // Input de texto
type: "select"; // Dropdown de opciones
type: "checkbox"; // Multiple select
```

### Estados del Flujo (useApplicationFlow.js)

```javascript
applicationStep = 1; // Formulario
applicationStep = 2; // Cuestionario
applicationStep = 3; // Enviando
```

---

## 🔗 Flujo de Datos

```
Landing Page
├── useState: formData, errors, isSubmitting, ...
├── Handler: handleSubmit()
│   └── Valida → proceedToQuestionnaire() → applicationStep = 2
│
└── Handler: handleQuestionnaireSubmit(answers)
    └── Construye FormData → fetch(WEBHOOK_URL) → n8n
```

---

## 🧪 Para Pruebas

### Ver errores de consola

```javascript
// En QuestionnaireModal.jsx
console.log("Respuestas:", answers);

// En useApplicationFlow.js
console.log("✓ Datos validados. Procediendo al cuestionario...");
console.log("📤 Enviando postulación completa a:", webhookUrl);
```

### Simular respuesta exitosa

```javascript
// En DevTools → Network
// Buscar POST a webhook URL
// Verificar Status: 200
// Ver payload en Request
```

### Agregar console.log para debugging

```javascript
// En handleQuestionnaireSubmit
console.log("📊 FormData antes enviar:", formDataPayload);
for (let [key, value] of formDataPayload.entries()) {
  console.log(key, value);
}
```

---

## 📂 Estructura de Archivos Completa

```
src/
├── components/
│   ├── QuestionnaireModal.jsx          ← Modal paso a paso
│   ├── FloatingWhatsAppButton.jsx
│   ├── GeminiSkinAdvisor.jsx
│   ├── Navbar.jsx
│   └── ...
│
├── data/
│   ├── questionnairesData.js           ← 5 puestos × 5 preguntas
│   ├── treatmentsData.js
│   └── ...
│
├── hooks/
│   └── useApplicationFlow.js           ← Gestiona flujo
│
├── services/
│   └── webhookService.js               ← Envío a n8n
│
└── pages/
    ├── EditorVideoPostulacionPage.jsx  ← Landing actualizado
    ├── EspecialistaLaserPostulacionPage.jsx
    ├── PracticantesEditorVideoPostulacionPage.jsx
    ├── PracticantesFilmmakerPostulacionPage.jsx
    ├── VendedorPostulacionPage.jsx
    └── ...
```

---

## ⌨️ Comandos Útiles

```bash
# Compilar proyecto
npm run build

# Iniciar dev server
npm start

# Buscar errores de sintaxis
npm run lint

# Ejecutar tests (si existen)
npm test

# Ver cambios en git
git status
git diff src/pages/EditorVideoPostulacionPage.jsx
```

---

## 🎯 Cambios por Landing Page

Cada archivo siguió este patrón de cambios:

### 1️⃣ Importaciones

```javascript
+ import QuestionnaireModal from '../components/QuestionnaireModal';
+ import { getQuestionnaire } from '../data/questionnairesData';
+ import useApplicationFlow from '../hooks/useApplicationFlow';
```

### 2️⃣ Hook

```javascript
+ const { applicationStep, proceedToQuestionnaire, ... } = useApplicationFlow();
+ const questionnaire = getQuestionnaire(NOMBRE_PUESTO);
```

### 3️⃣ handleSubmit

```javascript
-(
  // Envío directo a n8n
  +(
    // Procede al cuestionario
    (+proceedToQuestionnaire(applicationDataWithTracking, NOMBRE_PUESTO))
  )
);
```

### 4️⃣ Nueva función

```javascript
+ const handleQuestionnaireSubmit = async (answers) => { ... }
```

### 5️⃣ Modal en JSX

```javascript
+ {applicationStep === 2 && questionnaire && (
+   <QuestionnaireModal ... />
+ )}
```

### 6️⃣ Botón

```javascript
- {isSubmitting ? 'Enviando...' : 'Enviar mi postulación'}
+ {isSubmitting ? 'Procesando...' : '→ Siguiente: Cuestionario'}
```

---

## 🚀 Quick Start

**Para probar el sistema:**

1. Navega a cualquier landing page
2. Llena el formulario
3. Click "→ Siguiente: Cuestionario"
4. Responde 5 preguntas
5. Click "Enviar Postulación"
6. Ver modal de éxito

**Para modificar:**

1. Abre `src/data/questionnairesData.js`
2. Edita preguntas
3. Guardar y F5

**Para agregar nuevo puesto:**

1. Agregar entrada en `questionnairesData.js`
2. Crear nueva landing page (copiar existente)
3. Cambiar `NOMBRE_PUESTO`
4. Agregar ruta en `App.jsx`

---

**Última actualización:** Mayo 2026
