## 🧪 Pruebas Técnicas - Sistema de Cuestionarios

### Pre-Requisitos

- [ ] Node.js instalado
- [ ] npm o yarn disponible
- [ ] Proyecto compilando sin errores

---

## 1️⃣ Pruebas de Compilación

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Compilar el proyecto
npm run build

# Resultado esperado:
# ✅ No hay errores de sintaxis
# ✅ No hay warnings de importaciones no usadas
# ✅ Bundle se genera correctamente
```

---

## 2️⃣ Pruebas de Importaciones

### En cada landing page actualizada, verificar:

```javascript
// ✅ Estas líneas deben existir sin errores
import QuestionnaireModal from "../components/QuestionnaireModal";
import { getQuestionnaire } from "../data/questionnairesData";
import useApplicationFlow from "../hooks/useApplicationFlow";

// ✅ El hook debe inicializarse
const {
  applicationStep,
  proceedToQuestionnaire,
  submitApplication,
  resetFlow,
  backToApplication,
} = useApplicationFlow();

// ✅ El cuestionario debe cargarse
const questionnaire = getQuestionnaire(NOMBRE_PUESTO);
```

**Validación:** Abre DevTools (F12) y no debe haber errores en la consola.

---

## 3️⃣ Pruebas Unitarias - QuestionnaireModal

```javascript
// src/components/__tests__/QuestionnaireModal.test.jsx (crear este archivo)

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionnaireModal from "../QuestionnaireModal";
import { QUESTIONNAIRES } from "../../data/questionnairesData";

describe("QuestionnaireModal", () => {
  test("Renderiza el modal cuando isOpen es true", () => {
    render(
      <QuestionnaireModal
        isOpen={true}
        questionnaire={QUESTIONNAIRES["Editor de Videos"]}
        isSubmitting={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(
      screen.getByText("Cuestionario - Editor de Videos"),
    ).toBeInTheDocument();
  });

  test("No renderiza el modal cuando isOpen es false", () => {
    const { container } = render(
      <QuestionnaireModal
        isOpen={false}
        questionnaire={QUESTIONNAIRES["Editor de Videos"]}
        isSubmitting={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  test("Muestra la primera pregunta inicialmente", () => {
    render(
      <QuestionnaireModal
        isOpen={true}
        questionnaire={QUESTIONNAIRES["Editor de Videos"]}
        isSubmitting={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(
      screen.getByText(/¿Cuántos años de experiencia/),
    ).toBeInTheDocument();
  });

  test("Avanza a siguiente pregunta", () => {
    render(
      <QuestionnaireModal
        isOpen={true}
        questionnaire={QUESTIONNAIRES["Editor de Videos"]}
        isSubmitting={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />,
    );

    // Seleccionar respuesta
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Menos de 1 año" } });

    // Click siguiente
    const siguienteButton = screen.getByText("Siguiente");
    fireEvent.click(siguienteButton);

    // Verificar que cambió la pregunta
    expect(screen.getByText(/¿Cuál es tu software/)).toBeInTheDocument();
  });
});
```

**Ejecutar:**

```bash
npm test -- QuestionnaireModal.test.jsx
```

---

## 4️⃣ Pruebas Unitarias - Hook useApplicationFlow

```javascript
// src/hooks/__tests__/useApplicationFlow.test.js

import { renderHook, act } from "@testing-library/react";
import useApplicationFlow from "../useApplicationFlow";
import { getQuestionnaire } from "../../data/questionnairesData";

describe("useApplicationFlow", () => {
  test("Estado inicial debe ser paso 1", () => {
    const { result } = renderHook(() => useApplicationFlow());
    expect(result.current.applicationStep).toBe(1);
  });

  test("proceedToQuestionnaire avanza a paso 2", () => {
    const { result } = renderHook(() => useApplicationFlow());

    act(() => {
      const success = result.current.proceedToQuestionnaire(
        { nombre: "Juan" },
        "Editor de Videos",
      );
    });

    expect(result.current.applicationStep).toBe(2);
  });

  test("proceedToQuestionnaire retorna false si puesto inválido", () => {
    const { result } = renderHook(() => useApplicationFlow());

    let success = false;
    act(() => {
      success = result.current.proceedToQuestionnaire(
        { nombre: "Juan" },
        "Puesto Inexistente",
      );
    });

    expect(success).toBe(false);
    expect(result.current.applicationStep).toBe(1);
  });

  test("resetFlow vuelve a estado inicial", () => {
    const { result } = renderHook(() => useApplicationFlow());

    act(() => {
      result.current.proceedToQuestionnaire(
        { nombre: "Juan" },
        "Editor de Videos",
      );
    });

    expect(result.current.applicationStep).toBe(2);

    act(() => {
      result.current.resetFlow();
    });

    expect(result.current.applicationStep).toBe(1);
  });

  test("backToApplication vuelve a paso 1", () => {
    const { result } = renderHook(() => useApplicationFlow());

    act(() => {
      result.current.proceedToQuestionnaire(
        { nombre: "Juan" },
        "Editor de Videos",
      );
    });

    act(() => {
      result.current.backToApplication();
    });

    expect(result.current.applicationStep).toBe(1);
  });
});
```

**Ejecutar:**

```bash
npm test -- useApplicationFlow.test.js
```

---

## 5️⃣ Pruebas Manuales - Editor Video

### Flujo 1: Éxito Completo

```
1. ✅ Navegar a: http://localhost:3000/editor-video-postulacion
2. ✅ Completar formulario:
   - Nombre: Juan
   - Apellido: Pérez
   - Teléfono: 987654321
   - Email: juan@mail.com
   - DNI: 12345678
   - País: Perú
   - Ciudad: Lima
   - CV: Seleccionar archivo PDF
3. ✅ Click en "→ Siguiente: Cuestionario"
   - Esperado: Se abre modal del cuestionario
4. ✅ Responder pregunta 1: "2-5 años"
5. ✅ Click "Siguiente"
   - Esperado: Va a pregunta 2
6. ✅ Responder pregunta 2: "Adobe Premiere Pro"
7. ✅ Click "Siguiente" (repetir hasta pregunta 5)
8. ✅ Responder pregunta 5: Seleccionar 2-3 checkboxes
9. ✅ Click "Enviar Postulación"
   - Esperado: Modal de éxito
   - Check console: "✅ Postulación con cuestionario enviada exitosamente"
```

### Flujo 2: Error de Validación

```
1. ✅ Navegar a landing page
2. ✅ Dejar campos vacíos
3. ✅ Click "→ Siguiente: Cuestionario"
   - Esperado: Mostrar errores de validación en rojo
   - No abre modal
4. ✅ Llenar un campo incorrecto:
   - Email: "invalido"
   - Teléfono: "12345"
   - DNI: "123"
5. ✅ Click "→ Siguiente: Cuestionario"
   - Esperado: Mostrar error específico del campo
```

### Flujo 3: Abandonar Cuestionario

```
1. ✅ Navegar a landing page
2. ✅ Llenar formulario correctamente
3. ✅ Click "→ Siguiente: Cuestionario"
   - Modal abierto
4. ✅ Responder pregunta 1
5. ✅ Click "Atrás"
   - Esperado: Volver a paso 1 (formulario)
   - Los datos del formulario se mantienen
6. ✅ Editar un campo (ej: email)
7. ✅ Click "→ Siguiente: Cuestionario" de nuevo
   - Esperado: Abre cuestionario desde pregunta 1
```

### Flujo 4: Network Request

```
1. ✅ Abrir DevTools (F12 → Network)
2. ✅ Llenar formulario y cuestionario completo
3. ✅ Click "Enviar Postulación"
4. ✅ Ver request POST en Network:
   - URL: https://n8n.dermicapro.online/webhook-test/...
   - Status: 200 (o error correspondiente)
   - Payload: Contiene FormData con:
     * nombre, apellido, telefono, email, dni
     * ciudad, país
     * curriculum (archivo)
     * puesto
     * respuestas_cuestionario (JSON)
     * timestamp
     * UTM parameters
```

---

## 6️⃣ Pruebas de Accesibilidad

- [ ] Navegar con TAB por todo el formulario
- [ ] Navegar con TAB por todo el modal del cuestionario
- [ ] Enter activa botones
- [ ] Errores son anunciados en rojo claramente
- [ ] Contraste de colores es suficiente (WCAG AA)
- [ ] Tamaño de texto es legible
- [ ] Modal es responsivo en mobile

---

## 7️⃣ Pruebas de Rendimiento

```javascript
// Medir tiempo en cada paso
performance.mark("form-start");
// ... usuario llena formulario
performance.mark("form-end");
performance.measure("form", "form-start", "form-end");

performance.mark("questionnaire-start");
// ... usuario llena cuestionario
performance.mark("questionnaire-end");
performance.measure(
  "questionnaire",
  "questionnaire-start",
  "questionnaire-end",
);

// En consola:
console.log(performance.getEntriesByName("form")[0].duration);
console.log(performance.getEntriesByName("questionnaire")[0].duration);
```

**Métricas esperadas:**

- Tiempo de respuesta del formulario: < 100ms
- Tiempo de renderizado del modal: < 200ms
- Tiempo de envío a webhook: < 5s

---

## 8️⃣ Pruebas de Navegación

### Verificar que NO se puede saltarse el cuestionario

```
1. ✅ Llenar formulario y click "Siguiente"
2. ✅ Modal abierto
3. ✅ Intentar cambiar URL directamente:
   - ❌ NO debe regresar a forma
   - ✅ Modal sigue abierto
4. ✅ Intentar cerrar modal (click fuera):
   - ✅ NO cierra (backdrop no clickeable)
   - ✅ Solo cierra con "Atrás"
```

---

## 9️⃣ Pruebas de Datos en n8n

Verificar que n8n recibe:

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+51987654321",
  "email": "juan@mail.com",
  "dni": "12345678",
  "ciudad": "Lima",
  "país": "Perú",
  "curriculum": "archivo.pdf",
  "puesto": "Editor de Videos",
  "landing_url": "...",
  "timestamp": "2026-05-07T...",
  "respuestas_cuestionario": "{\"experiencia_edicion\":\"2-5 años\",...}",
  "ttclid": "..." (si aplicable)
}
```

**Validación:** Los datos deben aparecer correctamente en n8n sin caracteres especiales o corrupción.

---

## 🔟 Pruebas en Todos los Puestos

Repetir el "Flujo 1: Éxito Completo" para cada landing page:

- [ ] /editor-video-postulacion
- [ ] /especialista-laser-postulacion
- [ ] /practicante-editor-video-postulacion
- [ ] /practicante-filmmaker-postulacion
- [ ] /asesor-comercial-postulacion

Para cada una, verificar:

- [ ] Nombre del puesto correcto en cuestionario
- [ ] Preguntas específicas del puesto
- [ ] Respuestas se envían correctamente

---

## ✅ Checklist Final

- [ ] Todas las pruebas de compilación pasan
- [ ] No hay errores en console
- [ ] Formulario valida correctamente
- [ ] Modal del cuestionario se abre
- [ ] Las 5 preguntas se muestran en orden
- [ ] No se puede enviar sin responder todas
- [ ] Los datos se envían a n8n correctamente
- [ ] Modal de éxito aparece
- [ ] Modal de error aparece si hay problema
- [ ] Botón "Atrás" funciona en cuestionario
- [ ] Botón "Atrás" funciona en primera pregunta
- [ ] El flujo completo tarda < 30 segundos
- [ ] Funciona en Desktop y Mobile
- [ ] Funciona en Chrome, Firefox, Safari

---

## 🚨 Problemas Comunes y Soluciones

### Problema: "QuestionnaireModal is not defined"

**Solución:** Verificar importación en el archivo de la landing page:

```javascript
import QuestionnaireModal from "../components/QuestionnaireModal";
```

### Problema: "Hook useApplicationFlow not found"

**Solución:** Verificar ruta del import:

```javascript
import useApplicationFlow from "../hooks/useApplicationFlow";
```

### Problema: "getQuestionnaire is not a function"

**Solución:** Verificar que está importado como named export:

```javascript
import { getQuestionnaire } from "../data/questionnairesData";
```

### Problema: Modal no se cierra

**Solución:** Verificar que `onClose={backToApplication}` está en el componente

### Problema: Datos no llegan a n8n

**Solución:**

1. Verificar WEBHOOK_URL es correcta
2. Abrir DevTools → Network y buscar POST request
3. Verificar que FormData tiene todos los campos
4. Verificar que `respuestas_cuestionario` es JSON válido

---

**Última actualización:** Mayo 2026  
**Pruebas completadas:** ✅ Listo para QA
