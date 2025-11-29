# 🧪 Guía de Testing - Meta Pixel DermicaPro

Esta guía te ayudará a verificar que el Meta Pixel (ID: **1431286785234837**) esté funcionando correctamente en el sitio DermicaPro.

---

## 📋 Checklist de Implementación

### ✅ Archivos Modificados

- [x] `/public/index.html` - Meta Pixel base code instalado
- [x] `/src/components/MetaPixel.jsx` - Componente creado para tracking de rutas
- [x] `/src/App.jsx` - MetaPixel component agregado
- [x] `/src/utils/metaPixelHelper.js` - Utilidades helper creadas
- [x] `/src/pages/HifuLandingPage.jsx` - Eventos ViewContent y Lead
- [x] `/src/pages/ReservaPage.jsx` - Eventos InitiateCheckout y Schedule
- [x] `/src/components/FloatingWhatsAppButton.jsx` - Evento Contact

---

## 🔧 Herramientas de Testing

### 1. Meta Pixel Helper (Chrome Extension)

**Instalación:**
1. Abre Chrome Web Store
2. Busca "Meta Pixel Helper"
3. Haz click en "Agregar a Chrome"
4. Pin la extensión para acceso rápido

**Uso:**
1. Navega a https://dermicapro.com (o http://localhost:3000 en desarrollo)
2. Click en el ícono de Meta Pixel Helper en la toolbar
3. Verifica los eventos que se están disparando

---

## 🧪 Plan de Testing

### Test 1: Verificar Instalación Base del Pixel

**Página:** Cualquier página del sitio
**Acción:** Cargar la página
**Evento Esperado:** `PageView`

**Cómo verificar:**
1. Abre el sitio en Chrome
2. Abre Meta Pixel Helper
3. Deberías ver:
   - ✅ Pixel ID: 1431286785234837
   - ✅ Evento: PageView
   - ✅ Estado: Verde (sin errores)

**Debugging en consola:**
```javascript
// Verifica que fbq esté cargado
console.log(typeof window.fbq); // Debe ser "function"

// Verifica versión del pixel
console.log(window.fbq.version); // Debe ser "2.0"
```

---

### Test 2: Tracking de Navegación (SPA)

**Página:** Home → Servicios → Resultados
**Acción:** Navegar entre páginas usando el menú
**Evento Esperado:** `PageView` en cada cambio de ruta

**Cómo verificar:**
1. Carga la página de inicio
2. Click en "Servicios" en el navbar
3. Click en "Resultados"
4. Meta Pixel Helper debe mostrar múltiples PageView events
5. Revisa la consola del navegador:
   ```
   Meta Pixel - PageView tracked: /
   Meta Pixel - PageView tracked: /servicios
   Meta Pixel - PageView tracked: /resultados
   ```

**⚠️ Importante:** En SPAs como React, el PageView debe dispararse en cada cambio de ruta, no solo en la carga inicial.

---

### Test 3: Landing Page HIFU - ViewContent

**Página:** `/hifu-landing`
**Acción:** Cargar la landing page
**Evento Esperado:** `ViewContent`

**Cómo verificar:**
1. Navega a https://dermicapro.com/hifu-landing
2. Abre Meta Pixel Helper
3. Deberías ver:
   - ✅ Evento: PageView (automático)
   - ✅ Evento: ViewContent
   - ✅ Parámetros:
     - content_name: "HIFU 12D Landing Page"
     - content_type: "landing_page"

**Debugging en consola:**
```javascript
// Deberías ver este log
"Meta Pixel - ViewContent tracked: {content_name: 'HIFU 12D Landing Page', content_type: 'landing_page'}"
```

---

### Test 4: Formulario HIFU - Lead Conversion

**Página:** `/hifu-landing`
**Acción:** Completar y enviar formulario
**Evento Esperado:** `Lead`

**Pasos:**
1. Navega a `/hifu-landing`
2. Scroll al formulario
3. Completa los campos:
   - Nombre: "Juan Pérez Test"
   - WhatsApp: "987654321"
   - Email: "test@test.com"
4. Click en "Reservar mi Evaluación Gratuita"
5. Espera a que aparezca el modal de éxito

**Verificación en Meta Pixel Helper:**
- ✅ Evento: Lead
- ✅ Parámetros:
  - content_name: "HIFU 12D"
  - content_category: "Tratamiento Facial"
  - value: 200
  - currency: "PEN"

**Debugging en consola:**
```javascript
// Deberías ver:
"Meta Pixel - Lead tracked: {content_name: 'HIFU 12D', content_category: 'Tratamiento Facial', value: 200, currency: 'PEN'}"
```

---

### Test 5: Captura de UTM Parameters (Meta Ads)

**Página:** `/hifu-landing?fbclid=ABC123&utm_source=facebook&utm_campaign=hifu_nov`
**Acción:** Cargar landing con parámetros UTM
**Esperado:** Parámetros guardados en sessionStorage

**Pasos:**
1. Navega a:
   ```
   http://localhost:3000/hifu-landing?fbclid=TestFBClickID&utm_source=facebook&utm_medium=cpc&utm_campaign=hifu_test
   ```
2. Abre DevTools → Console
3. Ejecuta:
   ```javascript
   JSON.parse(sessionStorage.getItem('meta_utm_data'))
   ```

**Resultado esperado:**
```javascript
{
  fbclid: "TestFBClickID",
  utm_source: "facebook",
  utm_medium: "cpc",
  utm_campaign: "hifu_test",
  utm_content: null,
  utm_term: null,
  captured_at: "2024-11-29T..."
}
```

---

### Test 6: Página de Reserva - InitiateCheckout

**Página:** `/reserva`
**Acción:** Cargar la página de reserva
**Evento Esperado:** `InitiateCheckout`

**Verificación:**
1. Navega a `/reserva`
2. Meta Pixel Helper debe mostrar:
   - ✅ PageView (automático)
   - ✅ InitiateCheckout
   - ✅ Parámetros:
     - content_name: "Reserva Evaluación de Piel"

**Consola:**
```
Meta Pixel - InitiateCheckout tracked: {content_name: 'Reserva Evaluación de Piel', content_category: 'Reserva'}
```

---

### Test 7: Formulario de Reserva - Schedule

**Página:** `/reserva`
**Acción:** Completar formulario de reserva
**Evento Esperado:** `Schedule`

**Pasos:**
1. Navega a `/reserva`
2. Completa:
   - Nombre: "María Test"
   - Teléfono: "987654321"
   - Tratamiento: "HIFU 12D"
3. Click en "Agendar mi Evaluación de Honestidad"

**Verificación en Meta Pixel Helper:**
- ✅ Evento: Schedule
- ✅ Parámetros:
  - content_name: "HIFU 12D"
  - content_category: "Reserva"
  - value: 200
  - currency: "PEN"

**Consola:**
```
Meta Pixel - Schedule tracked: {content_name: 'HIFU 12D', value: 200, currency: 'PEN'}
```

---

### Test 8: Botón Flotante WhatsApp - Contact

**Página:** Cualquier página (excepto landing pages)
**Acción:** Click en botón flotante de WhatsApp
**Evento Esperado:** `Contact`

**Pasos:**
1. Navega a cualquier página (ej: `/servicios`)
2. Verifica que el botón verde de WhatsApp esté visible (esquina inferior derecha)
3. Click en el botón
4. Se abrirá WhatsApp

**Verificación:**
- ✅ Evento: Contact
- ✅ Parámetros:
  - content_name: "Contacto vía whatsapp"
  - contact_method: "whatsapp"
  - source: "floating_button"

**Consola:**
```
Meta Pixel - Contact tracked: {content_name: 'Contacto vía whatsapp', contact_method: 'whatsapp', source: 'floating_button'}
```

---

## 🌐 Testing en Events Manager

Además de Meta Pixel Helper, debes verificar los eventos en el Events Manager de Meta:

### Acceso a Events Manager

1. Ve a https://business.facebook.com
2. Selecciona tu Business Manager
3. Click en "Events Manager" en el menú lateral
4. Selecciona tu pixel (ID: 1431286785234837)
5. Click en "Test Events"

### Verificación en Tiempo Real

1. En "Test Events", ingresa la URL de testing (ej: `dermicapro.com`)
2. Realiza las acciones del sitio (completar formularios, navegar, etc.)
3. Los eventos deben aparecer en tiempo real en Events Manager
4. Verifica:
   - ✅ Nombre del evento correcto
   - ✅ Parámetros completos
   - ✅ Source URL correcta
   - ✅ Timestamp reciente

---

## 🐛 Troubleshooting

### Problema 1: Pixel no se carga

**Síntoma:** Meta Pixel Helper dice "No pixels found"

**Soluciones:**
1. Verifica que el script esté en `public/index.html`
2. Haz hard refresh: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
3. Revisa la consola por errores de CSP (Content Security Policy)
4. Verifica que no haya bloqueadores de anuncios activos

**Debugging:**
```javascript
// En consola del navegador
console.log(typeof window.fbq); // Debe ser "function"
```

---

### Problema 2: PageView no se dispara en navegación

**Síntoma:** Solo se dispara PageView en la carga inicial, no en navegación SPA

**Soluciones:**
1. Verifica que `MetaPixel.jsx` esté importado en `App.jsx`
2. Revisa que el componente esté renderizado: `<MetaPixel />`
3. Verifica que `useLocation()` de react-router esté funcionando

**Debugging:**
```javascript
// Verifica que el componente MetaPixel esté montado
// En React DevTools, busca el componente MetaPixel en el árbol
```

---

### Problema 3: Eventos no aparecen en Events Manager

**Síntoma:** Eventos se disparan en Pixel Helper pero no en Events Manager

**Causas comunes:**
1. Delay de hasta 20 minutos (es normal)
2. Bloqueadores de anuncios
3. Extensiones de privacidad (Privacy Badger, etc.)

**Soluciones:**
1. Espera 20 minutos y refresca Events Manager
2. Prueba en modo incógnito sin extensiones
3. Prueba en otro navegador

---

### Problema 4: Eventos duplicados

**Síntoma:** Múltiples eventos del mismo tipo para una sola acción

**Causas:**
1. Pixel se carga múltiples veces
2. Componente se monta/desmonta repetidamente

**Soluciones:**
1. Verifica que solo hay un `fbq('init', ...)` en el código
2. Verifica que `useEffect` en componentes tenga array de dependencias correcto
3. Usa React StrictMode solo en desarrollo

---

### Problema 5: Parámetros faltantes en eventos

**Síntoma:** Evento se dispara pero faltan parámetros (ej: value, content_name)

**Debugging:**
```javascript
// Verifica el log en consola
// Debe incluir todos los parámetros
console.log('Event parameters:', params);
```

**Solución:**
Revisa que las funciones helper reciban todos los parámetros correctos.

---

## 📊 Eventos Implementados - Resumen

| Página/Componente | Evento | Parámetros | Trigger |
|------------------|--------|------------|---------|
| **Todas las páginas** | PageView | - | Carga de página / Navegación |
| **HifuLandingPage** | ViewContent | content_name, content_type | useEffect (mount) |
| **HifuLandingPage** | Lead | content_name, category, value, currency | Submit formulario exitoso |
| **ReservaPage** | InitiateCheckout | content_name | useEffect (mount) |
| **ReservaPage** | Schedule | content_name, value, currency | Submit formulario |
| **FloatingWhatsAppButton** | Contact | content_name, method, source | Click en botón |

---

## 🎯 Valores de Conversión por Tratamiento

Los siguientes valores están configurados en `metaPixelHelper.js`:

```javascript
const LEAD_VALUES = {
  'HIFU 12D': 200,              // PEN
  'Hollywood Peel': 150,
  'Borrado de Manchas': 180,
  'Pico Láser': 180,
  'Hydrafacial': 120,
  'Peeling Químico': 100,
  'Consulta General': 50
};
```

Estos valores se usan para optimización de campañas en Meta Ads.

---

## 🔐 Consideraciones de Privacidad

### Datos que NO se envían:
- ❌ Nombres completos en texto plano
- ❌ Números de teléfono sin hashear
- ❌ Emails sin hashear
- ❌ Información sensible de salud

### Datos que SÍ se envían:
- ✅ Tipo de tratamiento de interés
- ✅ Valor estimado del lead
- ✅ Parámetros UTM de campaña
- ✅ fbclid (Facebook Click ID)
- ✅ URL de la página

**Nota:** Para enviar datos de usuario (email, teléfono), debes implementar Conversions API (CAPI) con hashing SHA-256 en el servidor.

---

## 📈 Próximos Pasos (Opcional)

### 1. Conversions API (CAPI)
Implementar servidor proxy para enviar eventos con mayor precisión:
- Evita pérdida de eventos por ad blockers
- Mejor match quality (>7.0)
- Datos de usuario hasheados en servidor

**Archivo de referencia:** `.claude/agents/dermicapro-meta-pixel.md` (sección Conversions API)

### 2. Custom Audiences
Crear audiencias en Meta Ads Manager:
- Visitantes de landing HIFU (últimos 30 días)
- Usuarios que completaron formulario
- Visitantes sin conversión (retargeting)

### 3. Lookalike Audiences
Crear audiencias similares a tus mejores leads.

### 4. Eventos Adicionales
Agregar tracking para:
- Scroll a sección de beneficios
- Reproducción de videos
- Click en galería de resultados
- Interacciones con chatbot Gemini

---

## ✅ Checklist Final de Deployment

Antes de hacer push a producción:

- [ ] Testing completo en localhost
- [ ] Pixel Helper muestra todos los eventos sin errores
- [ ] Events Manager recibe eventos en tiempo real
- [ ] No hay errores en consola del navegador
- [ ] Eventos duplicados verificados (debe haber solo uno por acción)
- [ ] Parámetros UTM se capturan correctamente
- [ ] Build de producción exitoso (`npm run build`)
- [ ] Testing en build de producción (servidor local)
- [ ] Verificar CSP headers si aplica
- [ ] Documentación actualizada

---

## 🆘 Soporte y Recursos

### Documentación Oficial
- **Meta Pixel Setup:** https://www.facebook.com/business/help/952192354843755
- **Events Reference:** https://developers.facebook.com/docs/meta-pixel/reference
- **Events Manager:** https://business.facebook.com

### Herramientas
- **Meta Pixel Helper:** Chrome Web Store
- **React DevTools:** Para debugging de componentes
- **Network Tab:** Para ver requests a Facebook

### Archivo de Referencia
- **Agente Meta Pixel:** `.claude/agents/dermicapro-meta-pixel.md`
- **Utilidades:** `src/utils/metaPixelHelper.js`

---

**Última actualización:** 29 de noviembre de 2024
**Pixel ID:** 1431286785234837
**Sitio:** dermicapro.com
