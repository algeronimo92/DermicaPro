# 🚀 Guía de Deployment a Hostinger - DermicaPro

## ✅ Build Completado

El build de producción con Meta Pixel está listo en la carpeta `build/`

**Tamaño:** ~35 MB comprimido
**Archivos incluidos:**
- ✅ Meta Pixel (ID: 1431286785234837)
- ✅ Todos los componentes React
- ✅ Landing pages con tracking
- ✅ Utilidades helper
- ✅ .htaccess para SPA routing

---

## 📦 Opción 1: Subir Manualmente (File Manager de Hostinger)

### Paso 1: Acceder a Hostinger

1. Ve a https://hpanel.hostinger.com
2. Inicia sesión con tu cuenta
3. Selecciona el hosting de **dermicapro.com**
4. Click en **"File Manager"** (Administrador de Archivos)

### Paso 2: Preparar el Directorio

1. En File Manager, navega a la carpeta raíz de tu sitio (generalmente `public_html/`)
2. **IMPORTANTE:** Haz un backup de los archivos actuales:
   - Selecciona todos los archivos
   - Click derecho → "Compress" (Comprimir)
   - Nombre: `backup-dermicapro-29nov2024.zip`
   - Descarga el backup a tu computadora

3. **Elimina TODOS los archivos antiguos** de `public_html/`
   - Selecciona todos
   - Click en "Delete" (Eliminar)

### Paso 3: Subir Nuevo Build

**Opción A: Subir Archivo Comprimido (Recomendado)**

1. En File Manager, click en **"Upload Files"**
2. Selecciona `dermicapro-build.tar.gz` (ubicado en `/Users/alangeronimo/Documents/my-app/`)
3. Espera a que se suba (puede tardar 2-5 minutos)
4. Una vez subido, click derecho en el archivo → **"Extract"** (Extraer)
5. Elimina el archivo `.tar.gz` después de extraer

**Opción B: Subir Archivos Individuales**

1. En File Manager, click en **"Upload Files"**
2. Navega a `/Users/alangeronimo/Documents/my-app/build/`
3. Selecciona TODOS los archivos y carpetas:
   - `.htaccess`
   - `index.html`
   - `favicon.ico`
   - `logo192.png`
   - `logo512.png`
   - `manifest.json`
   - `robots.txt`
   - `sitemap.xml`
   - Carpeta `static/`
   - Carpeta `images/`
   - Carpeta `videos/`
4. Click "Upload" y espera a que termine

### Paso 4: Verificar Archivos

Asegúrate de que en `public_html/` tengas:

```
public_html/
├── .htaccess
├── index.html
├── favicon.ico
├── logo192.png
├── logo512.png
├── manifest.json
├── robots.txt
├── sitemap.xml
├── static/
│   ├── css/
│   │   └── main.867ba791.css
│   └── js/
│       ├── main.5cc5ec99.js
│       └── 453.96453769.chunk.js
├── images/
└── videos/
```

---

## 📡 Opción 2: Subir por FTP (FileZilla)

### Paso 1: Obtener Credenciales FTP

1. En hPanel de Hostinger
2. Ve a **"FTP Accounts"** (Cuentas FTP)
3. Crea una nueva cuenta o usa las credenciales existentes:
   - **Host:** ftp.dermicapro.com
   - **Username:** tu_usuario_ftp
   - **Password:** tu_contraseña_ftp
   - **Port:** 21

### Paso 2: Conectar con FileZilla

1. Abre FileZilla
2. Ingresa:
   - Host: `ftp.dermicapro.com`
   - Usuario: [tu usuario]
   - Contraseña: [tu contraseña]
   - Puerto: 21
3. Click en "Quickconnect"

### Paso 3: Subir Archivos

1. **Panel izquierdo (Local):** Navega a `/Users/alangeronimo/Documents/my-app/build/`
2. **Panel derecho (Remoto):** Navega a `public_html/`
3. **Backup:** Descarga todos los archivos actuales a tu computadora
4. **Elimina** todos los archivos del servidor
5. **Sube** todo el contenido de la carpeta `build/` al servidor
   - Selecciona todo
   - Arrastra al panel derecho
   - Espera a que termine (puede tardar 5-10 minutos)

---

## 🔍 Verificación Post-Deployment

### 1. Verificar que el Sitio Funciona

```bash
# Opción 1: Desde terminal
curl -s https://dermicapro.com | head -50

# Opción 2: Navegador
# Abre https://dermicapro.com y verifica que carga correctamente
```

### 2. Verificar Meta Pixel

```bash
# Verificar que el Pixel ID está presente
curl -s https://dermicapro.com | grep "1431286785234837"
```

**Resultado esperado:** Deberías ver el código del pixel

### 3. Verificar con Meta Pixel Helper

1. Instala **Meta Pixel Helper** (Chrome Extension)
2. Abre https://dermicapro.com
3. Click en el ícono de Pixel Helper
4. Deberías ver:
   - ✅ Pixel detectado
   - ✅ Pixel ID: 1431286785234837
   - ✅ PageView event

### 4. Verificar Navegación SPA

Prueba que las rutas funcionen:
- https://dermicapro.com/
- https://dermicapro.com/servicios
- https://dermicapro.com/hifu-landing
- https://dermicapro.com/hollywood-peel
- https://dermicapro.com/botox-landing
- https://dermicapro.com/reserva

**Todas deberían cargar sin error 404**

### 5. Verificar .htaccess

Si las rutas dan 404, verifica que `.htaccess` esté en la raíz:

```apache
# Contenido de .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🧪 Testing Completo

Una vez deployado, ejecuta estos tests:

### Test 1: PageView en Home
1. Abre https://dermicapro.com
2. Abre DevTools (F12) → Console
3. Deberías ver: `Meta Pixel - PageView tracked: /`

### Test 2: ViewContent en Landing HIFU
1. Abre https://dermicapro.com/hifu-landing
2. En Console deberías ver:
   ```
   Meta Pixel - PageView tracked: /hifu-landing
   Meta Pixel - ViewContent tracked: {content_name: 'HIFU 12D Landing Page'...}
   ```

### Test 3: Lead en Formulario
1. En https://dermicapro.com/hifu-landing
2. Completa el formulario
3. Envía
4. Deberías ver: `Meta Pixel - Lead tracked: {value: 200...}`

### Test 4: Contact en WhatsApp
1. En cualquier página (excepto landing pages)
2. Click en botón verde flotante
3. Deberías ver: `Meta Pixel - Contact tracked: {...}`

### Test 5: Events Manager

1. Ve a https://business.facebook.com
2. Events Manager → Tu Pixel (1431286785234837)
3. Click en **"Test Events"**
4. Ingresa: `dermicapro.com`
5. Navega por el sitio y verifica que los eventos aparezcan en tiempo real

---

## ⚠️ Troubleshooting

### Problema 1: Sitio muestra página en blanco

**Causa:** Archivos no subidos correctamente o falta `index.html`

**Solución:**
1. Verifica que `index.html` esté en la raíz de `public_html/`
2. Verifica que la carpeta `static/` exista
3. Revisa console del navegador (F12) para ver errores

### Problema 2: Rutas dan 404

**Causa:** `.htaccess` no está presente o no funciona

**Solución:**
1. Verifica que `.htaccess` esté en `public_html/`
2. Si no aparece (archivos ocultos), activa "Show hidden files" en File Manager
3. Verifica que Apache tenga `mod_rewrite` habilitado (contacta soporte de Hostinger si es necesario)

### Problema 3: Meta Pixel no aparece

**Causa:** Cache del navegador o build antiguo

**Solución:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
2. Verifica en modo incógnito
3. Verifica que subiste el build correcto:
   ```bash
   curl -s https://dermicapro.com | grep "1431286785234837"
   ```

### Problema 4: Imágenes no cargan

**Causa:** Carpetas `images/` o `videos/` no subidas

**Solución:**
1. Verifica que ambas carpetas existan en `public_html/`
2. Vuelve a subir las carpetas desde `build/images/` y `build/videos/`

---

## 📊 Checklist Final de Deployment

Antes de considerar el deployment completo:

- [ ] Build de producción completado (`npm run build`)
- [ ] Meta Pixel ID verificado en build (`grep "1431286785234837" build/index.html`)
- [ ] Backup de archivos antiguos descargado
- [ ] Todos los archivos del build subidos a Hostinger
- [ ] `.htaccess` presente en la raíz
- [ ] Sitio carga correctamente en https://dermicapro.com
- [ ] Navegación entre páginas funciona sin 404
- [ ] Meta Pixel Helper detecta el pixel
- [ ] Console logs muestran eventos de tracking
- [ ] Events Manager de Meta muestra eventos en tiempo real
- [ ] Formularios funcionan correctamente
- [ ] Botón de WhatsApp funciona
- [ ] Landing pages cargan sin errores

---

## 🎯 Próximos Pasos Post-Deployment

### 1. Configurar Custom Audiences en Meta Ads

1. Ve a Meta Ads Manager
2. Audiences → Create Audience → Custom Audience
3. Selecciona "Website" como fuente
4. Selecciona tu pixel (1431286785234837)
5. Crea audiencias basadas en:
   - Visitantes de landing HIFU (últimos 30 días)
   - Usuarios que completaron formulario (Lead event)
   - Visitantes sin conversión (para retargeting)

### 2. Crear Campañas Optimizadas por Conversión

1. Nueva campaña → Objetivo: "Leads"
2. Evento de optimización: "Lead"
3. Meta aprenderá a mostrar anuncios a personas similares a quienes convierten

### 3. Monitorear Eventos Durante 7 Días

- Revisa Events Manager diariamente
- Verifica que los eventos se estén registrando
- Asegúrate de que los valores de conversión sean correctos

### 4. Implementar Conversions API (Opcional - Mejor Match Quality)

Para mayor precisión en tracking (evitar ad blockers):
- Consulta: [.claude/agents/dermicapro-meta-pixel.md](.claude/agents/dermicapro-meta-pixel.md)
- Sección: "Conversions API (CAPI)"

---

## 📞 Soporte

Si tienes problemas con:
- **Hostinger:** https://support.hostinger.com
- **Meta Pixel:** https://www.facebook.com/business/help

**Documentación del Proyecto:**
- [META_PIXEL_TESTING_GUIDE.md](META_PIXEL_TESTING_GUIDE.md)
- [LANDING_PAGES_META_PIXEL.md](LANDING_PAGES_META_PIXEL.md)

---

**¡Deployment listo! 🎉**

El sitio está preparado para subirse a Hostinger con Meta Pixel completamente funcional.
