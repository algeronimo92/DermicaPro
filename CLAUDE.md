# CLOUD.md - Arquitectura del Proyecto DermicaPro

## Información General

**Nombre del Proyecto:** DermicaPro
**Tipo:** Single Page Application (SPA) - Aplicación Web
**Dominio:** dermicapro.com
**Descripción:** Sitio web de clínica de cuidado de la piel con funcionalidades de catálogo de servicios, galería de resultados, testimonios, reserva de citas y consultor de piel impulsado por IA.

---

## Stack Tecnológico

### Frontend Framework
- **React 19.1.1** - Biblioteca principal para construcción de UI
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
│   └── favicon, logos
├── src/                       # Código fuente (172KB)
│   ├── components/           # Componentes React reutilizables
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── GeminiSkinAdvisor.jsx
│   │   ├── FloatingWhatsAppButton.jsx
│   │   └── icons/           # Componentes de iconos personalizados
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
│   └── App.css              # Estilos adicionales
├── build/                    # Output del build de producción (36MB)
├── node_modules/            # Dependencias (411MB)
├── .github/workflows/       # Automatización CI/CD
├── package.json             # Configuración del proyecto
├── tailwind.config.js       # Configuración de Tailwind CSS
├── postcss.config.js        # Configuración de PostCSS
└── CNAME                    # Dominio personalizado: dermicapro.com
```

**Conteo de Archivos:** 25 archivos JavaScript/JSX/CSS en src

---

## Arquitectura de Componentes

### Componentes de Layout
**Ubicación:** `/src/components/`

- **Navbar.jsx** - Barra de navegación fija con detección de scroll
- **Footer.jsx** - Pie de página del sitio
- **FloatingWhatsAppButton.jsx** - Botón de contacto WhatsApp flotante
- **GeminiSkinAdvisor.jsx** - Modal de chatbot IA para consulta de piel
- **icons/** - Componentes de iconos SVG personalizados (5 iconos)

### Componentes de Páginas
**Ubicación:** `/src/pages/`

- **HomePage.jsx** - Página de inicio con carrusel hero
- **ServiciosPage.jsx** - Listado de servicios
- **ResultadosPage.jsx** - Galería de resultados antes/después
- **NosotrosPage.jsx** - Página sobre nosotros
- **TestimoniosPage.jsx** - Testimonios de clientes
- **ContactoPage.jsx** - Información de contacto
- **ReservaPage.jsx** - Reserva de citas
- **HollywoodPeelPage.jsx** - Landing page de tratamiento especializado
- **HifuLandingPage.jsx** - Landing page de tratamiento HIFU (31KB - página más grande)

---

## Configuración de Rutas

**Archivo:** `/src/App.jsx`

```
Rutas:
  /                  → HomePage
  /servicios         → ServiciosPage
  /resultados        → ResultadosPage
  /nosotros          → NosotrosPage
  /testimonios       → TestimoniosPage
  /contacto          → ContactoPage
  /reserva           → ReservaPage
  /hollywood-peel    → HollywoodPeelPage (sin navbar/footer)
  /hifu-landing      → HifuLandingPage (sin navbar/footer)
```

**Comportamiento Especial:**
- Las landing pages (`/hollywood-peel`, `/hifu-landing`) ocultan los componentes de layout
- Renderizado condicional de layout basado en la ruta

---

## Gestión de Estado

- **Estado Local de Componente** - Usando hooks de React (useState)
- **Props Drilling** - Pasando funciones como `openAdvisor` desde App → Pages
- **Sin gestión de estado global** - No se usa Redux, Context API, o MobX

---

## Estrategia de Estilos

1. **Clases utility de Tailwind CSS** - Método principal de estilos
2. **Estilos inline** - Transiciones dinámicas del carrusel
3. **Animaciones personalizadas** - Definidas en App.jsx:
   ```css
   @keyframes fade-in {
     from { opacity: 0; transform: translateY(10px); }
     to { opacity: 1; transform: translateY(0); }
   }
   ```

---

## Archivos de Configuración Clave

### package.json
```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",      // Servidor de desarrollo
    "build": "react-scripts build",       // Build de producción
    "test": "react-scripts test",         // Test runner
    "eject": "react-scripts eject"        // Eject de CRA
  }
}
```

**Características:**
- Usando Create React App (CRA) - no eyectado
- Servidor de desarrollo corre en puerto 3000 (default)
- Paquete privado (no publicado en npm)

### tailwind.config.js
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"
]
```

**Características:**
- Escanea todos los archivos JSX/TSX para clases Tailwind
- Sin extensiones de tema personalizadas
- Usa configuración default de Tailwind

### postcss.config.js
```javascript
plugins: {
  tailwindcss: {},
  autoprefixer: {}
}
```

**Características:**
- Procesamiento de Tailwind CSS
- Autoprefixer para compatibilidad con navegadores

### .github/workflows/node.js.yml
```yaml
on: push/pull_request to main
jobs: build on Node.js 18.x, 20.x, 22.x
steps: npm ci → npm run build → npm test
```

**Características:**
- Pipeline CI/CD de GitHub Actions
- Testing en múltiples versiones de Node.js
- Builds automatizados en push a rama main

### public/.htaccess
```apache
RewriteRule . /index.html [L]
```

**Características:**
- Configuración de servidor Apache
- Habilita enrutamiento del lado del cliente redirigiendo todas las peticiones a index.html
- Esencial para deployment de SPA

### public/manifest.json
```json
{
  "short_name": "Dermica Pro",
  "display": "standalone"
}
```

**Características:**
- Capacidades de Progressive Web App (PWA)
- Puede ser instalada como app standalone
- Branding e iconos personalizados

---

## Puntos de Entrada de la Aplicación

### Cadena de Puntos de Entrada:

1. **`/public/index.html`**
   - Plantilla HTML raíz
   - Contiene `<div id="root"></div>` como punto de montaje
   - Título: "Dermica Pro - Skin Care Clinic"

2. **`/src/index.js`**
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
   - Crea root de React 18+
   - Envuelve app en StrictMode para warnings de desarrollo
   - Implementa BrowserRouter para enrutamiento

3. **`/src/App.jsx`**
   - Componente principal de la aplicación
   - Configuración de rutas
   - Gestión de layout (navbar, footer)

---

## Sistema de Build

### Gestor de Paquetes
- **npm** (Node Package Manager)
- Archivo de lock: `package-lock.json` (664KB)

### Sistema de Build (vía Create React App)

**Webpack** - Empaquetador de módulos
- Code splitting habilitado (453.96453769.chunk.js)
- Extracción de CSS (main.1232dc5a.css)
- Source maps generados

**Babel** - Transpilador de JavaScript
- Transformación JSX
- JavaScript moderno a compatibilidad ES5

### Output del Build
**Ubicación:** `/build/`

```
build/
├── static/
│   ├── css/main.1232dc5a.css       # Estilos empaquetados
│   └── js/
│       ├── main.b73f114a.js        # Bundle principal de aplicación
│       └── 453.96453769.chunk.js   # Chunk de code-split
├── images/                          # Imágenes optimizadas
├── videos/                          # Assets de video
└── index.html                       # HTML de producción
```

**Características del Build:**
- Content hashing para cache busting
- Minificado y optimizado
- Listo para deployment a dermicapro.com

### Herramientas de Desarrollo
- **ESLint** - Linting de código (configuración react-app)
- **Jest** - Framework de testing
- **GitHub Actions** - Automatización CI/CD

---

## Base de Datos y Almacenamiento de Datos

### Sin Base de Datos Tradicional
La aplicación es **completamente frontend** sin servidor backend o base de datos.

### Enfoque de Almacenamiento de Datos

**Datos Estáticos:**
- Información de servicios - Hardcoded en componentes
- Testimonios - Definidos en arrays de JavaScript
- Detalles de tratamientos - Embebidos en componentes de página

**Ejemplo de HomePage.jsx:**
```javascript
const featuredServices = [
  { name: "Borrado de Manchas (Pico Láser)", desc: "...", img: "/images/..." },
  { name: "HIFU 12D (Lifting sin Cirugía)", desc: "...", img: "/images/..." }
];
```

**Integración de API Externa:**
- **Google Gemini AI API** - Respuestas de IA en tiempo real
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent`
  - Autenticación: API Key

**Sin Persistencia:**
- Sin cuentas de usuario o sistema de login
- Sin base de datos para reservas
- Sin backend API
- Sin uso detectado de localStorage o sessionStorage

---

## Configuración de Deployment

### Dominio y Hosting
- **Dominio Personalizado:** dermicapro.com (vía CNAME)
- **Hosting:** Hosting estático (probable GitHub Pages)
- **Servidor:** Apache (basado en .htaccess)

### Características de Performance
- Code splitting (chunk separado para rutas async)
- Optimización de imágenes (logos a 192px y 512px)
- Monitoreo de Web Vitals
- Capacidades PWA para soporte offline

### Internacionalización
- Contenido en español
- Sin librería i18n detectada (strings hardcoded)

### Soporte de Navegadores
```json
"production": [">0.2%", "not dead", "not op_mini all"]
```
- Solo navegadores modernos
- Sin soporte para Internet Explorer

---

## Características Principales

### Progressive Web App (PWA)
- Manifiesto configurado para instalación
- Iconos optimizados (192px, 512px)
- Modo standalone disponible

### Chatbot con IA
- Integración con Google Gemini AI
- Consultas de piel en tiempo real
- Modal interactivo

### Integración WhatsApp
- Botón flotante persistente
- Enlace directo a contacto

### CI/CD Automatizado
- GitHub Actions pipeline
- Testing en múltiples versiones de Node.js
- Build automático en push a main

### Optimización SEO
- Apache .htaccess para enrutamiento SPA
- Meta tags configurados
- URLs amigables

---

## Resumen de Arquitectura

DermicaPro es una **Single Page Application moderna** construida con React 19 y Create React App, utilizando Tailwind CSS para estilos, y con capacidades de chatbot impulsado por IA de Google Gemini.

La arquitectura es simple y apropiada para un sitio web de marketing sin requerimientos de backend. El proyecto está optimizado para performance con code splitting, PWA capabilities, y un pipeline CI/CD completamente automatizado.

El enfoque completamente frontend permite un deployment sencillo en hosting estático, mientras que la integración con APIs externas proporciona funcionalidades avanzadas sin la complejidad de mantener infraestructura backend.
