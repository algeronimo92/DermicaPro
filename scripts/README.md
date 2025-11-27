# 🚀 DermicaPro Landing Creator

Script CLI interactivo para generar landing pages de tratamientos automáticamente.

## 📋 Características

- ✅ **Generación automática** de landing pages basadas en templates profesionales
- ✅ **Dos patrones disponibles**: Con formulario integrado o WhatsApp directo
- ✅ **Actualización automática** de rutas en App.jsx
- ✅ **Interfaz CLI interactiva** con preguntas guiadas
- ✅ **Captura de UTM parameters** y TikTok Pixel (patrón con formulario)
- ✅ **Validación de formularios** en tiempo real
- ✅ **Diseño responsive** y optimizado para conversión

## 🎯 Uso

### Ejecutar el CLI

```bash
npm run create:landing
```

### Preguntas que te hará el CLI

El script te guiará a través de las siguientes preguntas:

1. **Nombre del tratamiento** (ej: HIFU 12D, Pico Láser, etc.)
2. **Slug de URL** (se sugiere automáticamente basado en el nombre)
3. **Patrón a usar**:
   - Opción 1: Con formulario integrado (captura leads directamente)
   - Opción 2: Con WhatsApp directo (redirección simple)
4. **Título del hero** (se sugiere automáticamente)
5. **Subtítulo del hero** (el problema que resuelve)
6. **Descripción del problema** (lo que ya intentaron sin éxito)
7. **Descripción de la solución** (cómo tu tratamiento resuelve el problema)
8. **Beneficios** (mínimo 3, máximo 4)
9. **FAQs** (mínimo 2, máximo 3)
10. **Configuración técnica** (solo para patrón con formulario):
    - TikTok Pixel ID (opcional)
    - Webhook URL (usa default si no se especifica)

## 📝 Ejemplo de Uso

```bash
$ npm run create:landing

╔═══════════════════════════════════════════════╗
║   DERMICAPRO LANDING PAGE CREATOR v1.0       ║
╚═══════════════════════════════════════════════╝

Responde las siguientes preguntas para generar tu landing page:

1️⃣  Nombre del tratamiento (ej: HIFU 12D): Hydrafacial
2️⃣  Slug de URL [hydrafacial]:
3️⃣  Selecciona patrón [1/2]: 1
4️⃣  Título del hero [¿Buscas Hydrafacial en Trujillo?]:
5️⃣  Subtítulo del hero (el problema que resuelve): Piel opaca y deshidratada te hace ver cansada
6️⃣  Descripción del problema: Has probado cremas hidratantes sin resultados duraderos
7️⃣  ¿Cómo tu tratamiento resuelve el problema?: Hydrafacial limpia, extrae e hidrata en profundidad

Beneficios del tratamiento (mínimo 3):
  1) Beneficio 1: Hidratación Profunda
     Descripción breve: Penetra hasta las capas más profundas de tu piel
  2) Beneficio 2: Limpieza Facial
     Descripción breve: Extrae impurezas y puntos negros sin dolor
  3) Beneficio 3: Luminosidad Instantánea
     Descripción breve: Sal con una piel radiante desde la primera sesión
  4) Beneficio 4 (opcional):

Preguntas Frecuentes (mínimo 2):
  1) Pregunta 1: ¿Cuánto dura una sesión de Hydrafacial?
     Respuesta: Entre 30 y 60 minutos dependiendo del tratamiento
  2) Pregunta 2: ¿Es doloroso?
     Respuesta: No, es un tratamiento completamente indoloro y relajante
  3) Pregunta 3 (opcional):

Configuración técnica:
  TikTok Pixel ID (opcional): D19VBFJC77UDOT6CAUF0
  Webhook URL [https://dermica-pro-n8n.rcsgeg.easypanel.host/webhook-test/...]:

═══════════════════════════════════════════════
Resumen de tu landing page:
  • Tratamiento: Hydrafacial
  • URL: /landing/hydrafacial
  • Patrón: Formulario integrado
  • Beneficios: 3
  • FAQs: 2
═══════════════════════════════════════════════

¿Generar landing page? [S/n]: s

✓ Archivo creado: /Users/.../src/pages/HydrafacialLandingPage.jsx
✓ App.jsx actualizado con nueva ruta: /landing/hydrafacial

✅ ¡Landing page creada exitosamente!

Próximos pasos:
  1. Revisa el archivo: src/pages/HydrafacialLandingPage.jsx
  2. Agrega imágenes en: public/images/hydrafacial/
  3. Ejecuta: npm start
  4. Visita: http://localhost:3000/landing/hydrafacial
```

## 🎨 Patrones Disponibles

### 1. Patrón con Formulario Integrado

**Basado en:** HifuLandingPage.jsx

**Características:**
- Formulario de captura de leads en el hero
- Validación en tiempo real
- Captura de UTM parameters y ttclid
- Integración con TikTok Pixel
- Modal de confirmación/error
- Webhook n8n para envío de datos
- Secciones: Hero+Form → Benefits → FAQs → CTA

**Ideal para:**
- Campañas de anuncios pagados
- Landing pages de alta conversión
- Tratamientos premium

### 2. Patrón con WhatsApp Directo

**Basado en:** HollywoodPeelPage.jsx

**Características:**
- CTA directo a WhatsApp Business
- Redirección a página de reserva
- Estructura más simple y rápida
- Secciones: Hero → Problem/Solution → Benefits → CTA

**Ideal para:**
- Tráfico orgánico
- Landing pages de prueba
- Tratamientos con menos presupuesto

## 📁 Estructura de Archivos Generados

```
my-app/
├── src/
│   ├── pages/
│   │   └── [Tratamiento]LandingPage.jsx  ← Archivo generado
│   └── App.jsx                           ← Actualizado automáticamente
└── public/
    └── images/
        └── [tratamiento]/                ← Carpeta para tus imágenes
            ├── hero-bg.jpg               (recomendado)
            ├── before-1.jpg              (opcional)
            └── after-1.jpg               (opcional)
```

## 🖼️ Imágenes Recomendadas

Después de generar tu landing page, agrega las siguientes imágenes:

1. **Hero background**: `/images/[tratamiento]/hero-bg.jpg` (1920x1080px)
2. **Antes/Después**: `/images/[tratamiento]/before-[n].jpg` (600x400px)
3. **Resultados**: `/images/[tratamiento]/result-[n].jpg` (600x400px)

## 🔧 Personalización Post-Generación

Una vez generada la landing page, puedes personalizar:

### 1. Imágenes
Reemplaza los placeholders con tus imágenes reales en:
```javascript
// Línea ~267 (patrón formulario) o ~48 (patrón WhatsApp)
<img src="/images/[tratamiento]/hero-bg.jpg" ... />
```

### 2. Colores
Modifica las CSS variables en el `customCss`:
```css
:root {
  --primary: #D9A184;          /* Color primario */
  --cta-emphasis: #C37D64;      /* Color de botones */
  /* ... otros colores ... */
}
```

### 3. Webhook URL
Cambia la URL del webhook (solo patrón formulario):
```javascript
// Línea ~152
const response = await fetch('TU_WEBHOOK_URL', { ... });
```

### 4. TikTok Pixel ID
Actualiza el ID del pixel (solo patrón formulario):
```javascript
// Línea ~47
ttq.load('TU_PIXEL_ID');
```

## 🐛 Troubleshooting

### Error: "Cannot find module './templates/...'"

Asegúrate de que existan los archivos:
- `scripts/templates/landing-form-template.js`
- `scripts/templates/landing-whatsapp-template.js`

### La ruta no aparece en el navegador

1. Verifica que App.jsx se haya actualizado correctamente
2. Reinicia el servidor de desarrollo: `npm start`
3. Limpia caché del navegador

### El formulario no envía datos

1. Verifica que el webhook URL sea correcto
2. Comprueba la consola del navegador para errores
3. Asegúrate de tener conexión a internet

## 📊 Métricas y Tracking

### Para patrón con formulario:

**TikTok Pixel Events:**
- `page()` - Se dispara al cargar la página
- `SubmitForm` - Se dispara al enviar el formulario con éxito

**Parámetros de TikTok Ads capturados:**
- `ttclid` - TikTok Click ID (principal para conversiones)
- `tt_medium` - Medio de TikTok
- `tt_campaign_id` - ID de campaña de TikTok
- `tt_adgroup_id` - ID de grupo de anuncios
- `tt_ad_id` - ID del anuncio específico

## 🚀 Próximas Mejoras

- [ ] Soporte para múltiples idiomas
- [ ] Generación automática de meta tags SEO
- [ ] Integración con Google Analytics
- [ ] Templates adicionales (video hero, testimonios, etc.)
- [ ] Previsualizador de landing page antes de generar
- [ ] Exportar landing page como HTML estático

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, contacta al equipo de desarrollo.

---

**Versión:** 1.0.0
**Última actualización:** 2025-11-27
**Desarrollado para:** DermicaPro
