# 🚀 Configuración de Deployment Automático a Hostinger

Este documento explica cómo configurar el deployment automático desde GitHub a Hostinger.

## 📋 Prerequisitos

Necesitas tener acceso a:
- ✅ Cuenta de GitHub con el repositorio
- ✅ Cuenta de Hostinger con acceso FTP
- ✅ Credenciales FTP de Hostinger

---

## 🔧 Paso 1: Obtener Credenciales de Hostinger

### **1.1 Acceder al Panel de Hostinger**
1. Inicia sesión en [Hostinger](https://www.hostinger.com)
2. Ve a **Hosting** → **Administrar** (tu plan)
3. Busca la sección **FTP Accounts** o **Archivos** → **Administrador de archivos**

### **1.2 Credenciales FTP**
Necesitas estos datos:
- **FTP Host**: `ftp.tudominio.com` o la IP del servidor
- **FTP Username**: Tu usuario FTP (ej: `u123456789`)
- **FTP Password**: Tu contraseña FTP
- **FTP Server Directory**: Ruta donde está tu sitio (normalmente `/public_html` o `/domains/dermicapro.com/public_html`)

> **Nota:** Si no tienes credenciales FTP, créalas desde el panel de Hostinger:
> Hosting → FTP Accounts → Create FTP Account

---

## 🔐 Paso 2: Configurar Secrets en GitHub

Los secrets son variables encriptadas que GitHub Actions usa para conectarse a Hostinger de forma segura.

### **2.1 Ir a Settings del Repositorio**
1. Ve a tu repositorio en GitHub: https://github.com/tu-usuario/dermicapro
2. Click en **Settings** (arriba a la derecha)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**

### **2.2 Crear los Siguientes Secrets**

Crea **4 secrets** con estos nombres exactos:

#### **Secret 1: FTP_SERVER**
- **Name:** `FTP_SERVER`
- **Value:** `ftp.dermicapro.com` (o la IP/hostname de tu servidor Hostinger)
- Click **Add secret**

#### **Secret 2: FTP_USERNAME**
- **Name:** `FTP_USERNAME`
- **Value:** `tu_usuario_ftp` (ej: `u123456789`)
- Click **Add secret**

#### **Secret 3: FTP_PASSWORD**
- **Name:** `FTP_PASSWORD`
- **Value:** `tu_contraseña_ftp`
- Click **Add secret**

#### **Secret 4: FTP_SERVER_DIR**
- **Name:** `FTP_SERVER_DIR`
- **Value:** `/public_html/` (o la ruta donde quieres subir los archivos)
- Click **Add secret**

> **⚠️ IMPORTANTE:** Los nombres deben ser EXACTAMENTE como están arriba (mayúsculas)

---

## ✅ Paso 3: Verificar que Todo Está Configurado

### **3.1 Verificar Secrets**
En GitHub → Settings → Secrets and variables → Actions, deberías ver:
```
✅ FTP_SERVER
✅ FTP_USERNAME
✅ FTP_PASSWORD
✅ FTP_SERVER_DIR
```

### **3.2 Verificar Workflow**
El archivo `.github/workflows/deploy-hostinger.yml` ya está creado en tu proyecto.

---

## 🚀 Paso 4: Hacer Deploy

### **Opción A: Automático (Recomendado)**
Cada vez que hagas `git push` a la rama `main`, se desplegará automáticamente:

```bash
git add .
git commit -m "mi cambio"
git push origin main
```

GitHub Actions automáticamente:
1. ✅ Hace checkout del código
2. ✅ Instala dependencias (`npm ci`)
3. ✅ Hace build (`npm run build`)
4. ✅ Sube los archivos a Hostinger vía FTP

### **Opción B: Manual**
También puedes ejecutar el workflow manualmente desde GitHub:
1. Ve a tu repositorio en GitHub
2. Click en **Actions**
3. Selecciona **Deploy to Hostinger**
4. Click en **Run workflow** → **Run workflow**

---

## 📊 Monitorear el Deployment

### **Ver el Progreso**
1. Ve a tu repositorio en GitHub
2. Click en **Actions** (en la barra superior)
3. Verás la lista de workflows ejecutándose/completados
4. Click en el workflow más reciente para ver los detalles

### **Estados del Workflow**
- 🟡 **Amarillo (running)**: Se está ejecutando
- ✅ **Verde (success)**: Completado exitosamente
- ❌ **Rojo (failed)**: Falló (revisa los logs)

---

## 🐛 Troubleshooting

### **Error: "Authentication failed"**
- Verifica que los secrets `FTP_USERNAME` y `FTP_PASSWORD` sean correctos
- Prueba conectarte manualmente vía FTP con FileZilla para confirmar las credenciales

### **Error: "Directory not found"**
- Verifica que `FTP_SERVER_DIR` sea la ruta correcta (ej: `/public_html/`)
- Asegúrate de que la ruta incluya `/` al final

### **Error: "Connection timeout"**
- Verifica que `FTP_SERVER` sea correcto
- Algunos servidores requieren IP en lugar de hostname
- Contacta soporte de Hostinger para confirmar el FTP host

### **Build falla con warnings**
- El workflow tiene `CI: false` para ignorar warnings
- Si quieres que falle con warnings, elimina esa línea del workflow

---

## 📁 Estructura del Deploy

### **Lo que se Sube a Hostinger**
Solo se suben los archivos compilados de `/build`:
```
/public_html/
├── index.html
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── images/
├── videos/
├── manifest.json
├── favicon.ico
└── robots.txt
```

### **Lo que NO se Sube**
- ❌ `/src` (código fuente)
- ❌ `/node_modules`
- ❌ `/.git`
- ❌ Archivos de configuración de desarrollo

---

## 🔄 Workflow Completo

```
Developer hace push a GitHub
         ↓
GitHub Actions detecta el push
         ↓
Ejecuta workflow (build + deploy)
         ↓
1. npm ci (instala dependencias)
2. npm run build (compila React)
3. FTP upload (sube a Hostinger)
         ↓
Sitio actualizado en dermicapro.com
```

---

## ⚠️ Notas Importantes

1. **El Dr. Virtual NO funcionará en Hostinger** porque Hostinger no soporta funciones serverless (solo archivos estáticos)
   - Para el Dr. Virtual, debes usar Vercel
   - O configurar un backend separado (Node.js/PHP)

2. **Los archivos .env NO se suben** (están en .gitignore)
   - Las API Keys deben configurarse en el servidor si usas backend

3. **El deployment toma ~2-5 minutos**
   - Build de React: ~30s
   - FTP Upload: ~1-4min (depende del tamaño)

---

## 🎯 Resumen

✅ **Configurado:** GitHub Actions Workflow
✅ **Trigger:** Push a rama `main`
✅ **Build:** Automático con `npm run build`
✅ **Deploy:** FTP a Hostinger
✅ **Logs:** Visibles en GitHub Actions tab

**Siguiente paso:** Configurar los secrets en GitHub siguiendo el Paso 2 de este documento.
