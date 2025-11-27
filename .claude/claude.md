# CLAUDE.md - Arquitectura del Proyecto DermicaPro

## Información General

**Nombre del Proyecto:** DermicaPro
**Tipo:** Single Page Application (SPA) - Aplicación Web
**Dominio:** dermicapro.com
**Descripción:** Sitio web de clínica de cuidado de la piel con funcionalidades de catálogo de servicios, galería de resultados, testimonios, reserva de citas y consultor de piel impulsado por IA.

---

## Stack Tecnológico

### Frontend Framework
- **React 19.1.1** - Biblioteca principal para construcción de UI (versión más reciente)
- **React Router DOM 7.8.2** - Enrutamiento del lado del cliente
- **React Scripts 5.0.1** - Toolchain de Create React App

### Estilos y UI
- **Tailwind CSS** - Framework CSS utility-first
- **PostCSS** - Procesamiento de CSS con autoprefixer
- **Animaciones CSS personalizadas** - Efectos fade-in

### Testing
- **@testing-library/react 16.3.0** - Testing de componentes React
- **@testing-library/jest-dom 6.7.0** - Matchers de Jest para DOM
- **@testing-library/user-event 13.5.0** - Simulación de interacciones de usuario

### Monitoreo y Performance
- **web-vitals 2.1.4** - Seguimiento de Core Web Vitals

### Herramientas de Build
- **Webpack** (vía react-scripts) - Empaquetador de módulos
- **Babel** (vía react-scripts) - Transpilador de JavaScript
- **npm** - Gestor de paquetes

### APIs Externas
- **Google Gemini AI API** - Chatbot de consulta de piel con IA (Gemini 2.5 Flash)
- **WhatsApp Business API** - Integración de contacto directo
- **n8n Webhooks** - Automatización de procesamiento de formularios
- **TikTok Pixel** - Tracking de conversiones en landing pages

---

## Estructura del Proyecto

```
/Users/alangeronimo/Documents/my-app/
├── public/                    # Assets estáticos (34MB)
│   ├── images/               # Recursos de imágenes del sitio
│   ├── videos/               # Contenido de video
│   ├── index.html            # Plantilla HTML raíz
│   ├── manifest.json         # Manifiesto PWA
│   ├── .htaccess            # Reglas de reescritura Apache para enrutamiento SPA
│   ├── robots.txt           # SEO crawling rules
│   ├── sitemap.xml          # SEO sitemap
│   └── favicon, logos
├── src/                       # Código fuente (180KB)
│   ├── components/           # Componentes React reutilizables
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── GeminiSkinAdvisor.jsx
│   │   ├── FloatingWhatsAppButton.jsx
│   │   └── icons/           # Componentes de iconos personalizados
│   │       ├── SparklesIcon.jsx
│   │       ├── StarIcon.jsx
│   │       ├── PhoneIcon.jsx
│   │       ├── MailIcon.jsx
│   │       └── MapPinIcon.jsx
│   ├── pages/               # Componentes de páginas basados en rutas
│   │   ├── HomePage.jsx
│   │   ├── ServiciosPage.jsx
│   │   ├── ResultadosPage.jsx
│   │   ├── NosotrosPage.jsx
│   │   ├── TestimoniosPage.jsx
│   │   ├── ContactoPage.jsx
│   │   ├── ReservaPage.jsx
│   │   ├── HollywoodPeelPage.jsx
│   │   └── HifuLandingPage.jsx
│   ├── App.jsx              # Componente principal de la aplicación
│   ├── index.js             # Punto de entrada de la aplicación
│   ├── index.css            # Imports de Tailwind CSS
│   ├── App.css              # Estilos adicionales
│   └── reportWebVitals.js   # Performance monitoring
├── scripts/                  # Automatización
│   └── landing-creator.js   # CLI para generar landing pages
├── build/                    # Output del build de producción (36MB)
├── node_modules/            # Dependencias (403MB)
├── .github/workflows/       # Automatización CI/CD
├── package.json             # Configuración del proyecto
├── tailwind.config.js       # Configuración de Tailwind CSS
├── postcss.config.js        # Configuración de PostCSS
└── CNAME                    # Dominio personalizado: dermicapro.com
```

---

## Arquitectura de Componentes

### Jerarquía Completa

```
App.jsx (Root Container)
│
├─ HelmetProvider (SEO Context Provider)
│  │
│  └─ BrowserRouter (Routing Context)
│     │
│     ├─ [Conditional Rendering Layer]
│     │  ├─ Navbar (Layout Component)
│     │  │  ├─ useState: isOpen, isScrolled
│     │  │  ├─ useEffect: scroll listener
│     │  │  └─ Props: openAdvisor callback
│     │  │
│     │  └─ [Route-specific logic for hideLayout]
│     │
│     ├─ Routes (Route Configuration)
│     │  │
│     │  ├─ Route: "/" → HomePage
│     │  │  ├─ useState: currentSlide
│     │  │  ├─ useEffect: carousel timer (5s interval)
│     │  │  ├─ Helmet: SEO meta tags + Schema.org
│     │  │  └─ Props: openAdvisor
│     │  │
│     │  ├─ Route: "/servicios" → ServiciosPage
│     │  │  ├─ Helmet: Page-specific SEO
│     │  │  ├─ Props: openAdvisor
│     │  │  └─ Data: services array (hardcoded)
│     │  │
│     │  ├─ Route: "/resultados" → ResultadosPage
│     │  │  ├─ Helmet: SEO tags
│     │  │  └─ Before/After gallery
│     │  │
│     │  ├─ Route: "/nosotros" → NosotrosPage
│     │  │  └─ Static content
│     │  │
│     │  ├─ Route: "/testimonios" → TestimoniosPage
│     │  │  └─ Testimonials array
│     │  │
│     │  ├─ Route: "/contacto" → ContactoPage
│     │  │  └─ Contact information
│     │  │
│     │  ├─ Route: "/reserva" → ReservaPage
│     │  │  ├─ useState: formState, submitted
│     │  │  ├─ Form validation
│     │  │  └─ WhatsApp integration
│     │  │
│     │  ├─ Route: "/hollywood-peel" → HollywoodPeelPage
│     │  │  └─ [NO LAYOUT] Standalone landing
│     │  │
│     │  └─ Route: "/hifu-landing" → HifuLandingPage
│     │     ├─ [NO LAYOUT] Advanced landing
│     │     ├─ useState: formData, errors, isSubmitting, utmData, modal
│     │     ├─ useEffect: UTM capture
│     │     ├─ useEffect: TikTok Pixel injection
│     │     ├─ useEffect: Smooth scroll setup
│     │     ├─ Form validation logic
│     │     ├─ Webhook integration (n8n)
│     │     └─ Modal success/error states
│     │
│     ├─ [Conditional Rendering Layer]
│     │  └─ Footer (Layout Component)
│     │     ├─ useEffect: FontAwesome CDN injection
│     │     └─ Social links configuration
│     │
│     ├─ GeminiSkinAdvisor (Modal Component)
│     │  ├─ Props: isOpen, onClose
│     │  ├─ useState: concern, recommendation, loading, error
│     │  ├─ useEffect: Modal reset on close
│     │  ├─ useEffect: Outside click detection
│     │  ├─ useRef: modalRef
│     │  └─ API Integration: Google Gemini AI
│     │
│     └─ FloatingWhatsAppButton (Persistent Component)
│        └─ Click handler: App/Web fallback logic
│
└─ App-level State
   └─ isAdvisorOpen (useState)
```

### Componentes de Layout

**Ubicación:** `/src/components/`

- **Navbar.jsx** - Barra de navegación fija con detección de scroll
  - Estado local: `isOpen` (menú móvil), `isScrolled` (estilos dinámicos)
  - Efecto: Event listener para scroll con cleanup
  - Props: `openAdvisor` callback

- **Footer.jsx** - Pie de página del sitio
  - Efecto: Inyección dinámica de FontAwesome CDN
  - Links a redes sociales (Facebook, Instagram, WhatsApp)

- **FloatingWhatsAppButton.jsx** - Botón de contacto WhatsApp flotante
  - Handler: Fallback automático de app a web
  - Posición: Fixed bottom-right

- **GeminiSkinAdvisor.jsx** - Modal de chatbot IA para consulta de piel
  - Estados: concern, recommendation, loading, error
  - Efectos: Reset on close, outside click detection
  - API: Google Gemini 2.5 Flash
  - Validación: Input requerido antes de submit

- **icons/** - Componentes de iconos SVG personalizados (5 iconos)

### Componentes de Páginas

**Ubicación:** `/src/pages/`

- **HomePage.jsx** - Página de inicio con carrusel hero
  - Carousel: 6 items (4 imágenes + 1 video), auto-rotate 5s
  - Featured services: 3 tarjetas destacadas
  - Testimonials: 2 testimonios
  - Schema.org: LocalBusiness structured data

- **ServiciosPage.jsx** - Listado de servicios
  - 6 tratamientos con descripción y target audience
  - CTA: "Probar Asesor Virtual"
  - Schema.org: MedicalBusiness + OfferCatalog

- **ResultadosPage.jsx** - Galería de resultados antes/después

- **NosotrosPage.jsx** - Página sobre nosotros

- **TestimoniosPage.jsx** - Testimonios de clientes

- **ContactoPage.jsx** - Información de contacto

- **ReservaPage.jsx** - Reserva de citas
  - Form fields: nombre, phone, service (optional)
  - Success state: Muestra mensaje de confirmación
  - CTA alternativo: WhatsApp directo

- **HollywoodPeelPage.jsx** - Landing page de tratamiento especializado
  - Sin navbar/footer (standalone)

- **HifuLandingPage.jsx** - Landing page de tratamiento HIFU (31KB)
  - Sin navbar/footer (standalone)
  - UTM tracking completo (TikTok Ads)
  - TikTok Pixel integration
  - Form con validación en tiempo real
  - Webhook a n8n para automatización
  - Modal de éxito/error

---

## Configuración de Rutas

**Archivo:** `/src/App.jsx`

```javascript
Rutas Estándar (CON Layout):
  /                  → HomePage
  /servicios         → ServiciosPage
  /resultados        → ResultadosPage
  /nosotros          → NosotrosPage
  /testimonios       → TestimoniosPage
  /contacto          → ContactoPage
  /reserva           → ReservaPage

Landing Pages (SIN Layout):
  /hollywood-peel    → HollywoodPeelPage
  /hifu-landing      → HifuLandingPage
```

### Comportamiento Especial

**Patrón de Exclusión de Layout:**
```javascript
const hideLayout = ["/hollywood-peel", "/hifu-landing"];
const shouldHideNavBar = hideLayout.includes(location.pathname);

{!shouldHideNavBar && <Navbar />}
{!shouldHideNavBar && <Footer />}
{!shouldHideNavBar && <GeminiSkinAdvisor />}
{!shouldHideNavBar && <FloatingWhatsAppButton />}
```

**Propósito:**
- Landing pages aisladas para campañas de marketing
- Tracking independiente por campaña
- Eliminación de distracciones para maximizar conversiones
- A/B testing sin elementos del sitio principal

---

## Gestión de Estado

### Estado Local de Componente
Usando hooks de React (useState, useEffect, useRef)

### Props Drilling
Patrón principal para comunicación de componentes:
```
App.jsx (state: isAdvisorOpen)
  ├→ Navbar (prop: openAdvisor)
  ├→ HomePage (prop: openAdvisor)
  └→ GeminiSkinAdvisor (props: isOpen, onClose)
```

### Sin Gestión de Estado Global
No se usa Redux, Context API, Zustand, o MobX

### Datos Estáticos
Información de servicios, testimonios y tratamientos están hardcoded en los componentes como arrays de JavaScript.

**Ejemplo:**
```javascript
// HomePage.jsx
const featuredServices = [
  { name: "Borrado de Manchas", desc: "...", img: "/images/..." },
  { name: "HIFU 12D", desc: "...", img: "/images/..." }
];
```

---

## Estrategia de Estilos

### 1. Tailwind CSS (Principal)
Utility-first approach con clases como:
- Layout: `max-w-7xl`, `mx-auto`, `flex`, `grid`
- Colors: `bg-[#ea899a]` (rosa marca), `text-gray-700`
- Typography: `text-4xl`, `font-bold`
- Responsive: `sm:`, `md:`, `lg:` breakpoints

### 2. Animaciones Personalizadas
Definidas en App.jsx:
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3. Estilos Inline
Para transiciones dinámicas del carrusel y elementos interactivos.

---

## Archivos de Configuración Clave

### package.json
```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "create:landing": "node scripts/landing-creator.js"
  }
}
```

**Características:**
- Create React App (CRA) - no eyectado
- Script personalizado para crear landing pages
- Servidor de desarrollo en puerto 3000 (default)

### tailwind.config.js
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Características:**
- Escanea todos los archivos JSX/TSX
- Sin extensiones de tema personalizadas
- Usa configuración default de Tailwind

### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  },
}
```

**Procesamiento:**
1. Tailwind genera utility classes
2. Autoprefixer añade vendor prefixes para compatibilidad

### .github/workflows/node.js.yml
```yaml
on: push/pull_request to main
jobs: build on Node.js 18.x, 20.x, 22.x
steps: npm ci → npm run build → npm test
```

**Pipeline CI/CD:**
- Testing en múltiples versiones de Node.js
- Builds automatizados en push a rama main
- Validación de build antes de deployment

### public/.htaccess
```apache
RewriteRule . /index.html [L]
```

**Propósito:**
- Configuración de servidor Apache
- Habilita enrutamiento del lado del cliente
- Redirige todas las peticiones a index.html
- Esencial para SPA routing

### public/manifest.json
```json
{
  "short_name": "Dermica Pro",
  "name": "Dermica Pro - Skin Care Clinic",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

**Capacidades PWA:**
- Instalable como app standalone
- Branding e iconos personalizados (192px, 512px)

---

## Puntos de Entrada de la Aplicación

### Cadena de Inicialización

**1. `/public/index.html`**
- Plantilla HTML raíz
- Contiene `<div id="root"></div>` como punto de montaje
- Meta tags base para SEO
- Título: "Dermica Pro - Skin Care Clinic"

**2. `/src/index.js`**
```javascript
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```
- Crea root de React 18+ con createRoot API
- Envuelve app en StrictMode para warnings de desarrollo
- Implementa BrowserRouter para enrutamiento

**3. `/src/App.jsx`**
- Componente principal de la aplicación
- Configuración de rutas con React Router
- Gestión de layout condicional
- Estado global de modal (asesor IA)

---

## Sistema de Build

### Gestor de Paquetes
- **npm** (Node Package Manager)
- Archivo de lock: `package-lock.json` (664KB)

### Build System (vía Create React App)

**Webpack** - Empaquetador de módulos
- Code splitting habilitado por ruta
- Extracción de CSS a archivo separado
- Source maps generados
- Minificación con Terser

**Babel** - Transpilador
- Transformación JSX
- JavaScript moderno a ES5
- Polyfills automáticos

### Output del Build

**Ubicación:** `/build/`

```
build/
├── static/
│   ├── css/
│   │   └── main.1232dc5a.css       # Estilos compilados (~15KB)
│   └── js/
│       ├── main.b73f114a.js        # Bundle principal (~150KB)
│       └── 453.96453769.chunk.js   # Chunk de code-split (~80KB)
├── images/                          # Imágenes optimizadas
├── videos/                          # Assets de video
└── index.html                       # HTML de producción
```

**Características del Build:**
- Content hashing para cache busting
- Minificado y optimizado
- Bundle total: ~245KB sin comprimir, ~78KB gzipped
- Listo para deployment estático

---

## Base de Datos y Almacenamiento de Datos

### Sin Base de Datos Tradicional
La aplicación es **completamente frontend** sin servidor backend o base de datos.

### Enfoque de Almacenamiento de Datos

**Datos Estáticos:**
- Información de servicios - Hardcoded en arrays JavaScript
- Testimonios - Definidos en componentes
- Detalles de tratamientos - Embebidos en páginas

**Ejemplo:**
```javascript
const featuredServices = [
  { name: "Borrado de Manchas (Pico Láser)", desc: "...", img: "/images/..." },
  { name: "HIFU 12D (Lifting sin Cirugía)", desc: "...", img: "/images/..." }
];
```

**Integración de APIs Externas:**

1. **Google Gemini AI API**
   - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent`
   - Autenticación: API Key
   - Uso: Respuestas personalizadas de IA para consulta de piel

2. **n8n Webhook**
   - Endpoint: `https://dermica-pro-n8n.rcsgeg.easypanel.host/webhook-test/...`
   - Método: POST con JSON payload
   - Uso: Procesamiento de formularios de landing pages
   - Datos enviados: nombre, whatsapp, email, UTM parameters

3. **WhatsApp Business API**
   - URL: `wa.me/51974637783`
   - Parámetro: Mensaje pre-escrito
   - Uso: Contacto directo desde múltiples puntos

**Sin Persistencia Local:**
- No hay cuentas de usuario o sistema de login
- No se usa localStorage o sessionStorage
- Sin cookies propias (solo de third-party para tracking)

---

## Configuración de Deployment

### Dominio y Hosting
- **Dominio Personalizado:** dermicapro.com (vía CNAME)
- **Hosting:** Hosting estático (Apache)
- **HTTPS:** ✅ SSL habilitado

### Características de Performance
- Code splitting (chunk separado para rutas async)
- Optimización de imágenes (logos a 192px y 512px)
- Monitoreo de Web Vitals (LCP, FID, CLS)
- Capacidades PWA para soporte offline

### Internacionalización
- Contenido en español
- Sin librería i18n (strings hardcoded)
- Localización peruana (Av. Larco 877, Trujillo, Perú)

### Soporte de Navegadores
```json
"browserslist": {
  "production": [">0.2%", "not dead", "not op_mini all"],
  "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
}
```
- Solo navegadores modernos
- Sin soporte para Internet Explorer

---

## Características Principales

### Progressive Web App (PWA)
- Manifiesto configurado para instalación
- Iconos optimizados (192px, 512px)
- Modo standalone disponible
- Service worker ready (no implementado aún)

### Chatbot con IA
- Integración con Google Gemini AI (Gemini 2.5 Flash)
- Consultas de piel en tiempo real
- Modal interactivo con validación
- Respuestas personalizadas basadas en servicios disponibles

### Integración WhatsApp
- Botón flotante persistente (bottom-right)
- Enlace directo a contacto con mensaje pre-escrito
- Fallback automático: app → web

### CI/CD Automatizado
- GitHub Actions pipeline
- Testing en múltiples versiones de Node.js (18, 20, 22)
- Build automático en push a main
- Validación pre-deployment

### Optimización SEO
- Apache .htaccess para enrutamiento SPA
- Meta tags dinámicos con React Helmet Async
- Schema.org structured data (LocalBusiness, MedicalBusiness)
- Open Graph y Twitter Cards
- Canonical URLs
- Sitemap.xml y robots.txt

### Landing Pages Avanzadas
- Tracking completo con TikTok Pixel
- Captura de UTM parameters para attribution
- Validación de formularios en tiempo real
- Integración con n8n para automatización
- Modales de éxito/error

---

## Patrones de Diseño y Arquitectura

### 1. Component Composition Pattern
Componentes pequeños y reutilizables que se componen para crear interfaces complejas.

### 2. Props Drilling Pattern
Callbacks pasados desde App.jsx hacia componentes hijos para comunicación ascendente.

### 3. Conditional Rendering Pattern
Renderizado condicional de layout basado en ruta actual.

```javascript
const hideLayout = ["/hollywood-peel", "/hifu-landing"];
const shouldHideNavBar = hideLayout.includes(location.pathname);
```

### 4. Controlled Components Pattern
Formularios completamente controlados con estado en React.

```javascript
const [formData, setFormData] = useState({ nombre: '', whatsapp: '', email: '' });
const handleChange = (e) => {
  setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
};
```

### 5. Custom Hooks Pattern (Implícito)
Uso extensivo de hooks nativos de React: useState, useEffect, useRef, useLocation.

### 6. Early Return Pattern
Retornos tempranos para estados de éxito/error evitan anidamiento complejo.

```javascript
if (submitted) {
  return <SuccessMessage />;
}
return <FormComponent />;
```

### 7. Event Handler Cleanup Pattern
Siempre se implementa cleanup en useEffect para event listeners.

```javascript
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);
```

---

## Patrones de Validación

### Real-time Validation
- **onBlur:** Validación al perder foco
- **onChange:** Limpieza de errores durante edición
- **Pre-submit:** Validación completa antes de envío

### Field-specific Validators
```javascript
const validateField = (name, value) => {
  switch (name) {
    case 'nombre':
      return value.trim().length < 2 ? 'Mínimo 2 caracteres' : '';
    case 'whatsapp':
      return !/^[0-9]{9}$/.test(value) ? '9 dígitos requeridos' : '';
    case 'email':
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email inválido' : '';
  }
};
```

### Input Formatting
- Nombres: Capitalización automática
- WhatsApp: Solo dígitos numéricos
- Email: Validación de formato

---

## Decisiones Arquitectónicas (ADRs)

### ADR-001: Single Page Application con React

**Contexto:** Necesidad de un sitio web moderno para clínica de cuidado de piel.

**Decisión:** Usar React 19 como framework principal y Create React App como toolchain.

**Consecuencias:**
- ✅ Desarrollo rápido con tooling preconfigurado
- ✅ Ecosistema maduro con amplia documentación
- ✅ Soporte para PWA out-of-the-box
- ⚠️ Bundle size más grande que alternativas (Preact, Svelte)
- ⚠️ CRA está en modo mantenimiento (considerar migración a Vite)

---

### ADR-002: Client-Side Routing con React Router DOM 7

**Contexto:** Necesidad de múltiples rutas sin recargas de página.

**Decisión:** Usar React Router DOM v7 con BrowserRouter.

**Consecuencias:**
- ✅ Navegación instantánea sin recargas
- ✅ API moderna con hooks (useNavigate, useLocation)
- ✅ Code splitting por ruta automático
- ⚠️ Requiere configuración Apache (.htaccess) para SPA routing
- ❌ No ideal para SEO (considerar pre-rendering)

---

### ADR-003: No Backend, Aplicación Completamente Frontend

**Contexto:** Presupuesto limitado, necesidad de deployment simple.

**Decisión:** Aplicación 100% frontend sin base de datos ni servidor API propio.

**Consecuencias:**
- ✅ Zero infrastructure costs
- ✅ Hosting estático simple y económico
- ✅ Alta disponibilidad con CDN
- ✅ Desarrollo más rápido
- ❌ Sin persistencia de datos
- ❌ Formularios dependen de servicios externos (n8n, WhatsApp)
- ❌ No hay autenticación de usuarios

**Servicios Externos Utilizados:**
- Google Gemini AI (chatbot)
- n8n webhook (formularios landing)
- WhatsApp API (contacto)

---

### ADR-004: Tailwind CSS para Estilos

**Contexto:** Necesidad de diseño responsive y consistente.

**Decisión:** Usar Tailwind CSS como framework de estilos principal.

**Consecuencias:**
- ✅ Desarrollo UI rápido con utility classes
- ✅ Bundle CSS pequeño (15KB gzipped)
- ✅ Diseño responsive fácil
- ✅ Consistencia visual automática
- ⚠️ HTML verboso con muchas clases
- ⚠️ Curva de aprendizaje para nuevos desarrolladores

---

### ADR-005: Landing Pages Sin Layout

**Contexto:** Campañas de marketing pagado necesitan páginas dedicadas.

**Decisión:** Implementar rutas específicas que excluyen Navbar y Footer.

**Consecuencias:**
- ✅ Tasas de conversión más altas (menos distracciones)
- ✅ Tracking independiente por campaña
- ✅ A/B testing más fácil
- ⚠️ Lógica condicional en App.jsx
- ⚠️ Código duplicado entre landing y páginas normales

---

### ADR-006: Google Gemini AI para Asesor Virtual

**Contexto:** Necesidad de guiar usuarios sin contratar personal 24/7.

**Decisión:** Integrar Google Gemini AI (Gemini 2.5 Flash) como chatbot.

**Consecuencias:**
- ✅ Respuestas personalizadas en tiempo real
- ✅ Costo bajo (Gemini 2.5 Flash es económico)
- ✅ Mejora la experiencia de usuario
- ⚠️ API Key expuesta en frontend (seguridad limitada)
- ❌ Dependencia de servicio externo (Google)
- ❌ Latencia de ~2-3 segundos por respuesta

**Recomendación:** Mover API Key a backend proxy para mayor seguridad.

---

### ADR-007: React Helmet Async para SEO

**Contexto:** SPAs tienen desafíos de SEO; meta tags deben ser dinámicos.

**Decisión:** Usar react-helmet-async para gestionar meta tags dinámicamente.

**Consecuencias:**
- ✅ Meta tags específicos por ruta
- ✅ Open Graph y Twitter Cards configurados
- ✅ Schema.org structured data
- ⚠️ Meta tags se renderizan client-side (no ideal para crawlers)
- ❌ Requiere pre-rendering o SSR para SEO óptimo

**Alternativa Futura:** Considerar pre-rendering con react-snap o migrar a Next.js.

---

### ADR-008: TikTok Pixel en Landing Pages

**Contexto:** Campañas pagadas en TikTok Ads requieren tracking de conversiones.

**Decisión:** Inyectar TikTok Pixel dinámicamente en landing pages con captura de UTM.

**Consecuencias:**
- ✅ Attribution tracking completo
- ✅ Retargeting de usuarios
- ✅ Optimización de campañas con datos
- ⚠️ Script injection en useEffect
- ⚠️ Privacidad: tracking de usuarios

---

### ADR-009: n8n Webhooks para Formularios

**Contexto:** Necesidad de procesar leads sin backend propio.

**Decisión:** Usar n8n (workflow automation) con webhooks.

**Consecuencias:**
- ✅ No-code workflow automation
- ✅ Integraciones fáciles (email, CRM, sheets)
- ✅ Escalable y confiable
- ⚠️ Dependencia de servicio externo
- ⚠️ Webhook URL expuesto en frontend

---

### ADR-010: GitHub Actions para CI/CD

**Contexto:** Necesidad de automatizar testing y deployment.

**Decisión:** Usar GitHub Actions con matrix build en Node 18, 20, 22.

**Consecuencias:**
- ✅ CI/CD gratuito para repositorios públicos
- ✅ Testing automático en múltiples versiones Node
- ✅ Build validation antes de merge
- ✅ Integración nativa con GitHub
- ⚠️ 3-5 minutos por build

---

## Análisis de Seguridad

### Vulnerabilidades Identificadas

#### 🔴 CRÍTICO: API Keys Expuestas en Frontend

**Ubicación:** `src/components/GeminiSkinAdvisor.jsx:41`

**Riesgo:**
- API key visible en bundle JavaScript
- Uso no autorizado de cuenta Google Gemini
- Posible agotamiento de cuota o costos inesperados
- Violación de términos de servicio

**Mitigación Recomendada:**
Crear backend proxy (Vercel Functions, Netlify Functions, o Node.js) para ocultar la API key.

---

#### 🟡 MEDIO: Webhook URL Expuesto

**Ubicación:** `src/pages/HifuLandingPage.jsx:152`

**Riesgo:**
- Spam submissions por bots
- DDoS en el webhook endpoint
- Datos falsos en el sistema

**Mitigación:**
1. Implementar rate limiting en n8n
2. Agregar CAPTCHA (hCaptcha/reCAPTCHA)
3. Validar origin headers en n8n
4. Implementar honeypot field

---

#### 🟡 MEDIO: TikTok Pixel ID Expuesto

**Ubicación:** `src/pages/HifuLandingPage.jsx:47`

**Nota:** Esto es práctica estándar en pixels de tracking, pero considerar:
- Implementar Content Security Policy (CSP)
- Notificar usuarios sobre cookies/tracking
- Política de privacidad actualizada

---

### Recomendaciones de Seguridad

**1. Content Security Policy (CSP)**
Agregar headers en Apache o meta tag en HTML para limitar scripts externos.

**2. HTTPS Enforcement**
```apache
# .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**3. Dependency Auditing**
Ejecutar regularmente:
```bash
npm audit
npm audit fix
```

**4. Environment Variables**
Usar variables de entorno para secretos (cuando se migre a backend).

---

## Escalabilidad y Mantenibilidad

### Límites Actuales de Escala

```
Current Architecture Limits:
├── Static hosting: ✅ Infinitely scalable (CDN)
├── Google Gemini API: ⚠️ Rate limits (15 req/min free tier)
├── n8n Webhook: ⚠️ Depends on hosting plan (~100 req/sec)
└── Client-side bundle: ⚠️ 245KB uncompressed
```

### Plan de Escalabilidad

**Fase 1: Optimización Actual (0-1000 usuarios/día)**
- Implementar lazy loading de imágenes
- Convertir PNG a WebP (70% reducción de tamaño)
- Agregar service worker para caching
- Implementar image CDN (Cloudinary/Imgix)

**Fase 2: Backend Ligero (1000-10000 usuarios/día)**
- Crear Vercel/Netlify Functions para:
  - Proxy de Gemini API
  - Rate limiting de webhooks
  - Analytics server-side
- Migrar formularios a base de datos (Firebase/Supabase)

**Fase 3: Arquitectura Híbrida (10000+ usuarios/día)**
- Migrar a Next.js con ISR (Incremental Static Regeneration)
- Implementar CDN edge caching (Cloudflare)
- Sistema de autenticación (si se requiere CRM)
- Dashboard de admin con analytics

---

### Deuda Técnica Identificada

**1. Props Drilling (3 niveles)**
- Considerar Context API para `openAdvisor`

**2. Código Duplicado en Landing Pages**
- Abstraer componente `<LandingFormSection>`

**3. Hardcoded Data**
- Mover servicios/testimonios a JSON files

**4. No hay Tests**
- Implementar tests unitarios para formularios
- E2E tests con Playwright para flujos críticos

**5. CRA Deprecated**
- Plan de migración a Vite o Next.js

---

## Resumen Ejecutivo

### Patrón Arquitectónico Principal
**JAMstack Puro** - JavaScript (React) + APIs (Gemini, n8n, WhatsApp) + Markup (Static HTML)

### Fortalezas Arquitectónicas
✅ **React 19** - Tecnología de punta
✅ **Arquitectura SPA simple** - Fácil de entender y mantener
✅ **Tailwind CSS** - UI consistente y responsive
✅ **Code splitting** - Bundle optimizado
✅ **SEO configurado** - Meta tags, Schema.org, Open Graph
✅ **CI/CD automatizado** - GitHub Actions
✅ **Landing pages independientes** - Optimizadas para conversión

### Áreas de Mejora Críticas
🔴 **Seguridad:** API keys expuestas en frontend
🟡 **Performance:** Imágenes sin optimizar (34MB)
🟡 **Escalabilidad:** Sin backend para funcionalidades complejas
🟡 **Testing:** Suite de tests vacía
🟡 **Tooling:** CRA deprecated, considerar migración

### Esta Arquitectura es Ideal Para:
- Sitios de marketing con tráfico medio
- Presupuestos limitados
- Equipos pequeños
- Necesidad de deployment rápido
- Landing pages con tracking avanzado

### No es Ideal Para:
- Aplicaciones con autenticación compleja
- Grandes volúmenes de datos dinámicos
- Necesidades de SEO avanzado (considerar SSR)
- Aplicaciones que requieren datos en tiempo real
- Sistemas con múltiples roles de usuario

---

## Scripts de Automatización

### Landing Page Creator

**Ubicación:** `scripts/landing-creator.js`

**Propósito:** CLI interactivo para generar nuevas landing pages automáticamente.

**Features:**
- Prompts interactivos (readline interface)
- Template generation para landing pages
- Auto-updates de App.jsx con nueva ruta
- Creación de componente completo
- Configuración de formularios con tracking
- Setup de Pixel ID y Webhook URL

**Uso:**
```bash
npm run create:landing
```

**Patrón:**
- Code generation para consistencia
- Reduce errores manuales
- Enforza estructura de landing pages
- Acelera creación de nuevas campañas

---

## Convenciones de Código

### Naming Conventions
- **Componentes:** PascalCase (ej: `GeminiSkinAdvisor.jsx`)
- **Archivos:** camelCase para utilities, PascalCase para componentes
- **Variables:** camelCase (ej: `isOpen`, `formData`)
- **Constants:** UPPER_SNAKE_CASE (cuando aplique)
- **CSS Classes:** kebab-case (Tailwind utilities)

### File Organization
- Un componente por archivo
- Archivos de componentes en `/src/components/`
- Páginas en `/src/pages/`
- Iconos en `/src/components/icons/`
- Assets estáticos en `/public/`

### Component Structure
```javascript
// Imports
import React, { useState, useEffect } from 'react';

// Component
const ComponentName = ({ props }) => {
  // State
  const [state, setState] = useState(initialValue);

  // Effects
  useEffect(() => {
    // effect logic
    return () => cleanup();
  }, [dependencies]);

  // Handlers
  const handleEvent = () => { /* ... */ };

  // Render
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Comments
- Comentarios JSDoc para funciones complejas
- Inline comments para lógica no obvia
- File headers con nombre de archivo
- TODO comments para deuda técnica

---

## Flujos de Usuario Principales

### Flujo 1: Usuario Descubriendo Servicios
```
Landing (/) → Hero Carousel → "Tratamientos" Click →
ServiciosPage → Browse Services → "Probar Asesor Virtual" →
GeminiSkinAdvisor Modal → AI Recommendation →
"Agendar Evaluación" → ReservaPage → Form Submit →
Success → WhatsApp Contact
```

### Flujo 2: Usuario de Paid Ad (TikTok)
```
TikTok Ad Click → /hifu-landing →
Hero Section → Scroll to Benefits → Scroll to Form →
Fill Form (validation en tiempo real) → Submit →
n8n Webhook → TikTok Pixel Event →
Success Modal → Instagram CTA
```

### Flujo 3: Usuario Buscando Contacto Rápido
```
Any Page → FloatingWhatsAppButton (bottom-right) →
Click → Try App (whatsapp://) →
Fallback to Web (wa.me) →
WhatsApp Conversation
```

---

## Integraciones Externas Detalladas

### 1. Google Gemini AI

**Endpoint:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=API_KEY
```

**Payload:**
```json
{
  "contents": [{
    "role": "user",
    "parts": [{
      "text": "Prompt personalizado con lista de servicios"
    }]
  }]
}
```

**Response:**
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "Respuesta de IA con recomendaciones"
      }]
    }
  }]
}
```

**Prompt Engineering:**
- Rol: Asesor de piel empático
- Personalidad: Amable, directa, profesional
- Tono: Cálido, educativo, inspirador
- Límite: Máximo 2 tratamientos recomendados
- Restricción: Solo recomienda servicios de lista oficial

---

### 2. n8n Webhook

**Endpoint:**
```
POST https://dermica-pro-n8n.rcsgeg.easypanel.host/webhook-test/[ID]
```

**Payload:**
```json
{
  "nombre": "Juan Pérez",
  "whatsapp": "+51987654321",
  "email": "juan@mail.com",
  "ttclid": "xxx",
  "tt_campaign_id": "yyy",
  "tt_adgroup_id": "zzz",
  "tt_ad_id": "aaa"
}
```

**Workflow en n8n:**
1. Recibir webhook
2. Guardar lead en base de datos
3. Enviar email de notificación
4. Enviar mensaje WhatsApp al equipo
5. Agregar contacto a CRM
6. Return 200 OK

---

### 3. TikTok Pixel

**Pixel ID:** `D19VBFJC77UDOT6CAUF0`

**Events Tracked:**
- `PageView` - Automático al cargar landing
- `SubmitForm` - Al enviar formulario exitosamente

**UTM Parameters Capturados:**
- `ttclid` - TikTok Click ID
- `tt_medium` - Medium del anuncio
- `tt_campaign_id` - ID de campaña
- `tt_adgroup_id` - ID de grupo de anuncios
- `tt_ad_id` - ID del anuncio específico

---

## Performance y Optimización

### Bundle Analysis

**Bundle Sizes:**
- main.b73f114a.js: ~150KB (~50KB gzipped)
- 453.96453769.chunk.js: ~80KB (~25KB gzipped)
- main.1232dc5a.css: ~15KB (~3KB gzipped)
- **Total:** ~245KB (~78KB gzipped)

**Breakdown:**
- React 19 + React DOM: ~120KB (75%)
- React Router DOM 7: ~20KB (13%)
- Application Code: ~10KB (7%)
- Other dependencies: ~8KB (5%)

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimizaciones Implementadas
✅ Code splitting por rutas
✅ Content hashing para cache busting
✅ Minificación de JS y CSS
✅ Gzip compression habilitado
✅ Web Vitals monitoring

### Optimizaciones Pendientes
⏳ Lazy loading de imágenes
⏳ Conversión PNG → WebP
⏳ Image CDN (Cloudinary/Imgix)
⏳ Service worker para caching
⏳ Preload critical resources
⏳ Video streaming desde CDN

---

## Contacto y Ubicación

**Dirección:** Av. Larco 877, Trujillo, Perú
**Teléfono:** +51 974 637 783
**Email:** contacto@dermicapro.com
**WhatsApp:** +51 974 637 783

**Redes Sociales:**
- Facebook: facebook.com/profile.php?id=61570893266230
- Instagram: instagram.com/dermicapro/
- WhatsApp: wa.me/51974637783

---

## Glosario de Términos Técnicos

**SPA:** Single Page Application - Aplicación que carga una sola página HTML y actualiza dinámicamente el contenido.

**PWA:** Progressive Web App - Aplicación web que puede instalarse y funcionar offline.

**JAMstack:** JavaScript, APIs, Markup - Arquitectura moderna para sitios web rápidos y seguros.

**Code Splitting:** Técnica para dividir el bundle en chunks más pequeños que se cargan bajo demanda.

**SSR:** Server-Side Rendering - Renderizado en servidor (no usado en este proyecto).

**CSP:** Content Security Policy - Headers de seguridad para prevenir ataques XSS.

**UTM Parameters:** Parámetros de URL para tracking de campañas de marketing.

**Webhook:** Endpoint HTTP que recibe notificaciones de eventos en tiempo real.

**Props Drilling:** Pasar props a través de múltiples niveles de componentes.

**Lazy Loading:** Cargar recursos solo cuando son necesarios.

**Bundle:** Archivo JavaScript que contiene todo el código de la aplicación.

**Gzip:** Algoritmo de compresión para reducir tamaño de archivos transferidos.

**Cache Busting:** Técnica para forzar actualización de archivos cacheados usando hashes.
