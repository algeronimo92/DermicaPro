# 🎯 Meta Pixel en Landing Pages - DermicaPro

## Resumen de Implementación

Meta Pixel (ID: **1431286785234837**) ha sido implementado en **TODAS** las landing pages de DermicaPro para tracking completo de conversiones.

---

## 📋 Landing Pages con Meta Pixel

### 1. `/hifu-landing` - HIFU 12D Landing

**Eventos Implementados:**
- ✅ **ViewContent** - Al cargar la página
  - content_name: "HIFU 12D Landing Page"
  - content_type: "landing_page"

- ✅ **Lead** - Al enviar formulario exitosamente
  - content_name: "HIFU 12D"
  - content_category: "Tratamiento Facial"
  - value: 200 PEN
  - currency: "PEN"

**Archivos Modificados:**
- [src/pages/HifuLandingPage.jsx](src/pages/HifuLandingPage.jsx:2) - Imports agregados
- [src/pages/HifuLandingPage.jsx](src/pages/HifuLandingPage.jsx:43-47) - ViewContent tracking
- [src/pages/HifuLandingPage.jsx](src/pages/HifuLandingPage.jsx:185-191) - Lead tracking

**Flujo de Usuario:**
```
Carga página → ViewContent
   ↓
Completa formulario → Click "Reservar"
   ↓
Formulario enviado → Lead (200 PEN)
   ↓
Modal de éxito
```

---

### 2. `/hollywood-peel` - Hollywood Peel Landing

**Eventos Implementados:**
- ✅ **ViewContent** - Al cargar la página
  - content_name: "Hollywood Peel Landing Page"
  - content_type: "landing_page"

- ✅ **Contact** - Al hacer click en CTA de WhatsApp
  - content_name: "Contacto vía whatsapp"
  - contact_method: "whatsapp"
  - source: "hollywood_peel_cta"

**Archivos Modificados:**
- [src/pages/HollyWoodPeelPage.jsx](src/pages/HollyWoodPeelPage.jsx:4-6) - Imports agregados
- [src/pages/HollyWoodPeelPage.jsx](src/pages/HollyWoodPeelPage.jsx:10-16) - ViewContent tracking
- [src/pages/HollyWoodPeelPage.jsx](src/pages/HollyWoodPeelPage.jsx:21-22) - Contact tracking

**Flujo de Usuario:**
```
Carga página → ViewContent
   ↓
Lee beneficios/resultados
   ↓
Click en botón CTA → Contact (whatsapp)
   ↓
Redirige a WhatsApp
```

**Nota:** Esta landing NO tiene formulario integrado, usa WhatsApp directo como CTA principal.

---

### 3. `/botox-landing` - Botox Landing

**Eventos Implementados:**
- ✅ **ViewContent** - Al cargar la página
  - content_name: "Botox Landing Page"
  - content_type: "landing_page"

- ✅ **Lead** - Al enviar formulario exitosamente
  - content_name: "Botox"
  - content_category: "Tratamiento Facial"
  - value: 180 PEN
  - currency: "PEN"

**Archivos Modificados:**
- [src/pages/BotoxLandingPage.jsx](src/pages/BotoxLandingPage.jsx:2) - Imports agregados
- [src/pages/BotoxLandingPage.jsx](src/pages/BotoxLandingPage.jsx:43-47) - ViewContent tracking
- [src/pages/BotoxLandingPage.jsx](src/pages/BotoxLandingPage.jsx:185-191) - Lead tracking

**Flujo de Usuario:**
```
Carga página → ViewContent
   ↓
Completa formulario → Click "Reservar"
   ↓
Formulario enviado → Lead (180 PEN)
   ↓
Modal de éxito
```

---

## 🔄 Coexistencia con TikTok Pixel

Todas las landing pages tienen **AMBOS pixels funcionando simultáneamente:**

| Landing Page | TikTok Pixel | Meta Pixel | Conflictos |
|--------------|--------------|------------|-----------|
| `/hifu-landing` | ✅ D19VBFJC77UDOT6CAUF0 | ✅ 1431286785234837 | ❌ Ninguno |
| `/hollywood-peel` | ❌ No tiene | ✅ 1431286785234837 | ❌ Ninguno |
| `/botox-landing` | ✅ D19VBFJC77UDOT6CAUF0 | ✅ 1431286785234837 | ❌ Ninguno |

**Eventos disparados en formularios con ambos pixels:**
```javascript
// TikTok Pixel
if (window.ttq) {
    window.ttq.track('SubmitForm');
}

// Meta Pixel
trackLead({
    contentName: 'HIFU 12D',
    value: 200,
    currency: 'PEN'
});
```

---

## 📊 Valores de Conversión por Landing

| Landing Page | Tratamiento | Valor Lead | Moneda |
|--------------|-------------|------------|--------|
| `/hifu-landing` | HIFU 12D | 200 | PEN |
| `/hollywood-peel` | Hollywood Peel | - (sin form) | - |
| `/botox-landing` | Botox | 180 | PEN |

**Nota:** Hollywood Peel no tiene valor de lead porque usa WhatsApp directo (evento Contact en lugar de Lead).

---

## 🧪 Testing Rápido por Landing

### Test HIFU Landing
```bash
# 1. Abrir en navegador
http://localhost:3000/hifu-landing

# 2. Verificar en consola
"Meta Pixel - ViewContent tracked: {content_name: 'HIFU 12D Landing Page'...}"

# 3. Enviar formulario
# Verificar: "Meta Pixel - Lead tracked: {value: 200, currency: 'PEN'}"
```

### Test Hollywood Peel Landing
```bash
# 1. Abrir en navegador
http://localhost:3000/hollywood-peel

# 2. Verificar en consola
"Meta Pixel - ViewContent tracked: {content_name: 'Hollywood Peel Landing Page'...}"

# 3. Click en botón CTA
# Verificar: "Meta Pixel - Contact tracked: {contact_method: 'whatsapp'}"
```

### Test Botox Landing
```bash
# 1. Abrir en navegador
http://localhost:3000/botox-landing

# 2. Verificar en consola
"Meta Pixel - ViewContent tracked: {content_name: 'Botox Landing Page'...}"

# 3. Enviar formulario
# Verificar: "Meta Pixel - Lead tracked: {value: 180, currency: 'PEN'}"
```

---

## 🎯 Captura de UTM en Todas las Landings

Todas las landing pages ahora capturan parámetros UTM de Meta Ads automáticamente:

```javascript
// Se ejecuta en useEffect al cargar
saveMetaUTM();
```

**Parámetros capturados:**
- `fbclid` - Facebook Click ID (crítico para attribution)
- `utm_source` - Fuente del tráfico (facebook, instagram)
- `utm_medium` - Medio de campaña (cpc, social)
- `utm_campaign` - Nombre de campaña
- `utm_content` - Variante de anuncio
- `utm_term` - Palabras clave

**Almacenamiento:**
```javascript
sessionStorage.getItem('meta_utm_data')
```

---

## 📈 Custom Audiences Sugeridas

Con estos eventos puedes crear las siguientes audiencias en Meta Ads Manager:

### 1. Visitantes de Landing HIFU (sin conversión)
- Evento: ViewContent
- Parámetro: content_name = "HIFU 12D Landing Page"
- Excluir: Lead event
- Tiempo: Últimos 14 días
- **Uso:** Retargeting

### 2. Leads de HIFU
- Evento: Lead
- Parámetro: content_name = "HIFU 12D"
- Tiempo: Últimos 180 días
- **Uso:** Lookalike audience, exclusión

### 3. Interesados en Hollywood Peel
- Evento: ViewContent
- Parámetro: content_name = "Hollywood Peel Landing Page"
- Tiempo: Últimos 30 días
- **Uso:** Retargeting con ofertas especiales

### 4. Usuarios que Contactaron vía WhatsApp
- Evento: Contact
- Parámetro: contact_method = "whatsapp"
- Tiempo: Últimos 90 días
- **Uso:** Warm audience, lookalike

### 5. Leads de Botox
- Evento: Lead
- Parámetro: content_name = "Botox"
- Tiempo: Últimos 180 días
- **Uso:** Lookalike audience

---

## 🔍 Optimización de Campañas

### Para Campañas de HIFU:
**Objetivo:** Lead
**Evento de optimización:** Lead
**Valor de conversión:** 200 PEN

Meta Ads aprenderá a mostrar anuncios a personas similares a quienes completaron el formulario.

### Para Campañas de Hollywood Peel:
**Objetivo:** Traffic o Engagement
**Evento de optimización:** Contact

Como esta landing usa WhatsApp directo, optimiza por clicks en el botón (evento Contact).

### Para Campañas de Botox:
**Objetivo:** Lead
**Evento de optimización:** Lead
**Valor de conversión:** 180 PEN

---

## ⚠️ Notas Importantes

### 1. Layout Excluido
Las landing pages NO tienen:
- ❌ Navbar
- ❌ Footer
- ❌ Botón flotante de WhatsApp
- ❌ Chatbot Gemini

Esto es **intencional** para maximizar conversiones eliminando distracciones.

### 2. Meta Pixel Sí Funciona
Aunque las landing pages no tienen layout, el **Meta Pixel base está cargado en `public/index.html`**, por lo que funciona en todas las páginas incluyendo landing pages.

### 3. Dos Patrones de Conversión

**Patrón 1: Formulario Integrado** (HIFU, Botox)
- ViewContent → Lead (con valor)
- Webhook a n8n
- Modal de éxito

**Patrón 2: WhatsApp Directo** (Hollywood Peel)
- ViewContent → Contact
- Redirect a WhatsApp
- Sin formulario

---

## 📱 Testing en Producción

Una vez deployado, verifica en Events Manager de Meta:

1. Ve a https://business.facebook.com
2. Events Manager → Pixel 1431286785234837
3. Test Events
4. Ingresa URL: `dermicapro.com/hifu-landing`
5. Realiza acciones en el sitio
6. Verifica eventos en tiempo real

**Match Quality esperado:** 5.0-7.0 (sin CAPI), >7.0 (con CAPI)

---

## 🚀 Próximos Pasos Recomendados

### Inmediato
- [ ] Testing local completo de las 3 landing pages
- [ ] Verificar eventos en Meta Pixel Helper
- [ ] Deploy a producción
- [ ] Testing en producción con Events Manager

### Corto Plazo
- [ ] Crear Custom Audiences basadas en eventos
- [ ] Configurar campañas para optimizar por Lead
- [ ] A/B testing de landing pages

### Mediano Plazo
- [ ] Implementar Conversions API (CAPI) para mejor match quality
- [ ] Agregar más eventos personalizados (scroll, video play, etc.)
- [ ] Crear Lookalike Audiences de mejores leads

---

**Última actualización:** 29 de noviembre de 2024
**Pixel ID:** 1431286785234837
**Landing Pages:** 3 (/hifu-landing, /hollywood-peel, /botox-landing)
**Eventos Totales:** ViewContent (3), Lead (2), Contact (1)
