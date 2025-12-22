# 🏗️ Patrón de Diseño: Webhook Service

## 📋 Resumen

Se implementó un **patrón de diseño** centralizado para estandarizar el envío de webhooks en todas las landing pages.

---

## 🎯 Patrones Implementados

### 1. **Service Pattern**
**Ubicación:** `src/services/webhookService.js`

Centraliza toda la lógica de negocio relacionada con webhooks:
- Envío HTTP
- Manejo de errores
- Timeouts
- Tracking de conversiones

### 2. **Factory Pattern**
**Función:** `createWebhookPayload()`

Crea payloads estandarizados para evitar inconsistencias:
```javascript
const payload = createWebhookPayload(formData, 'HIFU 12D', 'hifu-landing', utmData);
// Resultado consistente en todas las landings
```

### 3. **Strategy Pattern**
**Función:** `trackConversionEvents()`

Maneja el tracking de conversiones para múltiples plataformas:
- TikTok Pixel
- Meta Pixel
- Valores por tratamiento

---

## 📦 Estructura del Servicio

```
src/services/webhookService.js
├── WEBHOOK_CONFIG          # Configuración centralizada
├── CONVERSION_VALUES       # Valores por tratamiento
├── createWebhookPayload()  # Factory de payloads
├── trackConversionEvents() # Strategy de tracking
├── sendToWebhook()         # Servicio de envío
├── handleFormSubmission()  # Helper completo
├── TRATAMIENTOS           # Constantes de tratamientos
└── LANDINGS               # Constantes de landings
```

---

## ✅ Beneficios

### **1. DRY (Don't Repeat Yourself)**
- ❌ Antes: 75+ líneas duplicadas en cada landing
- ✅ Ahora: 15 líneas llamando al servicio

### **2. Single Responsibility**
Cada función tiene un propósito único:
- `createWebhookPayload()` → Solo crea payloads
- `sendToWebhook()` → Solo envía HTTP
- `trackConversionEvents()` → Solo trackea conversiones

### **3. Open/Closed Principle**
Fácil agregar nuevos tratamientos sin modificar código:
```javascript
// Agregar nuevo tratamiento:
export const TRATAMIENTOS = {
  // ... existentes
  NUEVO_TRATAMIENTO: 'Nombre Tratamiento'
};

export const CONVERSION_VALUES = {
  // ... existentes
  'Nombre Tratamiento': 250
};
```

### **4. Testeable**
Lógica separada facilita unit testing:
```javascript
// Fácil de testear
test('createWebhookPayload formatea whatsapp correctamente', () => {
  const payload = createWebhookPayload(
    { whatsapp: '987654321', ... },
    'HIFU 12D'
  );
  expect(payload.whatsapp).toBe('+51987654321');
});
```

### **5. Mantenible**
Cambios en un solo lugar:
- Cambiar endpoint? → Solo modificar `WEBHOOK_CONFIG.endpoint`
- Cambiar timeout? → Solo modificar `WEBHOOK_CONFIG.timeout`
- Cambiar valor de conversión? → Solo modificar `CONVERSION_VALUES`

---

## 🔄 Migración

### **Antes (Código Duplicado)**
```javascript
const handleSubmit = async (event) => {
  event.preventDefault();
  // ... validación ...

  setIsSubmitting(true);
  const payload = {
    nombre: formData.nombre,
    whatsapp: `+51${formData.whatsapp}`,
    email: formData.email,
    tratamiento: 'HIFU 12D',
    ...utmData
  };

  const webhookUrl = 'https://dermica-pro-n8n...';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      // TikTok Pixel
      trackSubmitForm({ ... });
      // Meta Pixel
      trackLead({ ... });

      setModal({ type: 'success', ... });
      // ... más código ...
    }
  } catch (error) {
    setModal({ type: 'error', ... });
  } finally {
    setIsSubmitting(false);
  }
};
```

### **Después (Usando Servicio)**
```javascript
import { handleFormSubmission, TRATAMIENTOS, LANDINGS } from '../services/webhookService';

const handleSubmit = async (event) => {
  event.preventDefault();
  // ... validación ...

  await handleFormSubmission({
    formData,
    tratamiento: TRATAMIENTOS.HIFU,
    landing: LANDINGS.HIFU,
    utmData,
    onSuccess: () => {
      setModal({ type: 'success', ... });
      setFormData({ nombre: '', whatsapp: '', email: '' });
      setErrors({});
    },
    onError: (errorMessage) => {
      setModal({ type: 'error', message: errorMessage });
    },
    setIsSubmitting
  });
};
```

**Reducción:** 75 líneas → 15 líneas (80% menos código)

---

## 📊 Estado Actual

### **✅ Refactorizadas**
- [x] HifuLandingPage.jsx
- [x] BotoxLandingPage.jsx
- [x] webhookService.js (creado)

### **⏳ Pendientes**
- [ ] HollywoodPeelPage.jsx
- [ ] ReservasLandingPage.jsx
- [ ] HifuReservasPage.jsx
- [ ] BotoxReservasPage.jsx
- [ ] HollywoodPeelReservasPage.jsx

---

## 🚀 Cómo Usar

### **1. Importar el servicio**
```javascript
import {
  handleFormSubmission,
  TRATAMIENTOS,
  LANDINGS
} from '../services/webhookService';
```

### **2. Reemplazar handleSubmit**
```javascript
const handleSubmit = async (event) => {
  event.preventDefault();

  const validationErrors = validar(formData);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    await handleFormSubmission({
      formData,
      tratamiento: TRATAMIENTOS.NOMBRE_TRATAMIENTO,
      landing: LANDINGS.NOMBRE_LANDING, // opcional
      utmData,
      onSuccess: () => { /* ... */ },
      onError: (errorMessage) => { /* ... */ },
      setIsSubmitting
    });
  }
};
```

### **3. Constantes Disponibles**
```javascript
// Tratamientos
TRATAMIENTOS.HIFU            // 'HIFU 12D'
TRATAMIENTOS.BOTOX           // 'Botox'
TRATAMIENTOS.HOLLYWOOD_PEEL  // 'Hollywood Peel'
TRATAMIENTOS.CONSULTA        // 'Consulta General'

// Landings
LANDINGS.HIFU                // 'hifu-landing'
LANDINGS.BOTOX               // 'botox-landing'
LANDINGS.HIFU_RESERVAS       // 'hf-reservas'
// ... etc
```

---

## 🎨 Arquitectura

```
┌─────────────────────────────────────────────────┐
│          Landing Pages (UI Layer)               │
│  HifuLandingPage │ BotoxLandingPage │ etc...    │
└────────────────────┬────────────────────────────┘
                     │ usa
                     ▼
┌─────────────────────────────────────────────────┐
│      webhookService.js (Business Logic)         │
│  ┌──────────────────────────────────────────┐   │
│  │ handleFormSubmission()                    │   │
│  │  ├─ createWebhookPayload() (Factory)     │   │
│  │  ├─ sendToWebhook() (Service)            │   │
│  │  └─ trackConversionEvents() (Strategy)   │   │
│  └──────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────┘
                     │ usa
                     ▼
┌─────────────────────────────────────────────────┐
│     External Services (Integration Layer)       │
│  n8n Webhook │ Meta Pixel │ TikTok Pixel        │
└─────────────────────────────────────────────────┘
```

---

## 📝 Notas

- **Timeout:** 10 segundos por defecto (configurable)
- **Retry:** No implementado (puede agregarse fácilmente)
- **Logging:** Console.log en desarrollo (puede agregarse logger profesional)
- **Error Handling:** Maneja timeout, network errors y server errors

---

## 🔜 Mejoras Futuras

1. **Retry con exponential backoff** para casos de error temporal
2. **Queue system** para envíos offline (PWA)
3. **Logging service** profesional (Sentry, LogRocket)
4. **A/B Testing** integrado en el servicio
5. **Validation service** centralizado
6. **Analytics service** para métricas unificadas

---

✅ **Conclusión:** El patrón Service centraliza comportamiento, reduce duplicación, facilita testing y hace el código más mantenible.
