# 🔧 Configuración de Gemini API - Guía de Solución Error 400

## ✅ PROBLEMA RESUELTO

**Fecha de corrección:** 2025-01-27

### Causa Raíz del Error 400

El error 400 se debía a **dos problemas**:

1. ❌ **Modelo incorrecto:** Se estaba usando `gemini-1.5-flash` que no existe
2. ❌ **Variable de entorno faltante:** `GEMINI_API_KEY` no configurada en Vercel

### Correcciones Aplicadas

✅ **Cambio de modelo a `gemini-2.5-flash`** en:
- [api/gemini-proxy.js](api/gemini-proxy.js#L69) (producción)
- [src/setupProxy.js](src/setupProxy.js#L32) (desarrollo)
- [scripts/test-gemini-api.js](scripts/test-gemini-api.js#L10) (testing)

✅ **Script de prueba creado:** [scripts/test-gemini-api.js](scripts/test-gemini-api.js)
```bash
node scripts/test-gemini-api.js
# ✅ SUCCESS! Gemini API está funcionando correctamente
```

✅ **Desarrollo local funciona correctamente** (probado)

---

## 🚨 Acción Requerida: Configurar en Vercel

**Aunque el error está corregido localmente, aún necesitas configurar la variable de entorno en Vercel para que funcione en producción.**

---

## ✅ Solución: Configurar Variables de Entorno

### 📍 **Paso 1: Configurar en Vercel Dashboard (PRODUCCIÓN)**

Esta es la configuración **más importante** para que funcione en producción:

1. Ve a tu proyecto en Vercel Dashboard:
   ```
   https://vercel.com/alan-geronimo-s-projects/dermicapro/settings/environment-variables
   ```

2. Agrega una nueva variable de entorno:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyCI2ivEXoa5k6dUMnc62CZrify424ERntU`
   - **Environment:**
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. Haz clic en **"Save"**

4. **IMPORTANTE:** Después de guardar, debes hacer **re-deploy** para que tome efecto:
   ```bash
   # Opción 1: Push cualquier cambio a Git (triggerea auto-deploy)
   git commit --allow-empty -m "Trigger redeploy after env vars"
   git push origin main

   # Opción 2: Redeploy manual desde Vercel Dashboard
   # Deployments → Click en el último → "Redeploy"
   ```

---

### 📍 **Paso 2: Configurar Localmente (OPCIONAL - ya funciona con setupProxy.js)**

Para desarrollo local usando `.env.local`:

1. Crea el archivo `.env.local` en la raíz del proyecto:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y agrega:
   ```bash
   GEMINI_API_KEY=AIzaSyCI2ivEXoa5k6dUMnc62CZrify424ERntU
   ```

3. Reinicia el servidor de desarrollo:
   ```bash
   npm start
   ```

**NOTA:** Actualmente el desarrollo local funciona porque `setupProxy.js` tiene la API key hardcoded (línea 31). Puedes dejarlo así o migrar a `.env.local` para mayor seguridad.

---

## 🔍 Verificación de Configuración

### ✅ **Verificar en Vercel**

```bash
# Ver variables de entorno configuradas
vercel env ls

# Debería aparecer:
# GEMINI_API_KEY (Production, Preview, Development)
```

### ✅ **Verificar Localmente**

```bash
# Iniciar servidor de desarrollo
npm start

# Abrir http://localhost:3000
# Hacer clic en "Asesor Virtual"
# Escribir una consulta y enviar
# Debería responder sin error 400
```

---

## 🏗️ Arquitectura Actual

### **Desarrollo Local (funciona ✅)**
```
Frontend → /api/gemini-proxy → setupProxy.js (src/) → Google Gemini API
                                   ↓
                            API Key hardcoded
```

### **Producción Vercel (error 400 ❌)**
```
Frontend → /api/gemini-proxy → gemini-proxy.js (api/) → Google Gemini API
                                   ↓
                          process.env.GEMINI_API_KEY
                                   ↓
                              ❌ NO CONFIGURADO
```

---

## 🛡️ Seguridad: API Keys

### ⚠️ **API Keys Expuestos Actualmente**

**Archivos que contienen la API key visible:**

1. **`src/setupProxy.js:31`** - Para desarrollo local
   ```javascript
   const API_KEY = 'AIzaSyCI2ivEXoa5k6dUMnc62CZrify424ERntU';
   ```

### ✅ **Recomendaciones de Seguridad**

**OPCIÓN A: Mantener Status Quo (más simple)**
- Dejar `setupProxy.js` con API key hardcoded para desarrollo
- Configurar `GEMINI_API_KEY` en Vercel para producción
- Pros: Funciona, fácil de mantener
- Contras: API key visible en código (pero solo en repo privado)

**OPCIÓN B: Migrar a Variables de Entorno (más seguro)**
1. Modificar `setupProxy.js` para usar `process.env.GEMINI_API_KEY`
2. Crear `.env.local` con la API key
3. Pros: API key nunca en código
4. Contras: Configuración adicional para desarrolladores

**OPCIÓN C: Rotar API Key (máxima seguridad)**
1. Crear nueva API key en Google AI Studio
2. Actualizar en Vercel y `.env.local`
3. Revocar la API key actual expuesta
4. Pros: Elimina riesgo de API key comprometida
5. Contras: Requiere actualizar en múltiples lugares

---

## 🚀 Despliegue Post-Configuración

Después de configurar `GEMINI_API_KEY` en Vercel:

```bash
# 1. Verificar configuración
vercel env ls

# 2. Hacer redeploy (cualquiera de estas opciones)

# Opción A: Commit vacío (triggerea auto-deploy)
git commit --allow-empty -m "chore: trigger redeploy after env config"
git push origin main

# Opción B: Deploy directo con Vercel CLI
vercel --prod

# Opción C: Redeploy manual desde Dashboard
# https://vercel.com/alan-geronimo-s-projects/dermicapro/deployments
# Click en último deployment → "Redeploy"
```

---

## 📝 Checklist Final

- [ ] Agregar `GEMINI_API_KEY` en Vercel Dashboard
- [ ] Redeploy en Vercel (push a Git o manual)
- [ ] Esperar ~2 minutos a que complete el deployment
- [ ] Probar en producción: https://dermicapro.com
- [ ] Abrir Asesor Virtual y hacer consulta de prueba
- [ ] Verificar que responde sin error 400

---

## 🆘 Troubleshooting

### **Problema: Sigue dando error 400 después de configurar**

**Soluciones:**

1. **Verificar que el env var se aplicó:**
   ```bash
   vercel env ls
   # Debe aparecer GEMINI_API_KEY
   ```

2. **Verificar que se hizo redeploy:**
   - Los cambios en env vars **NO aplican** a deployments existentes
   - **Debes** hacer un nuevo deployment después de cambiar env vars

3. **Verificar logs de Vercel:**
   ```bash
   vercel logs dermicapro.com --follow
   ```
   Buscar: "GEMINI_API_KEY not configured"

4. **Verificar que la API key es válida:**
   - Ve a https://makersuite.google.com/app/apikey
   - Verifica que la API key no esté revocada
   - Verifica que tiene permisos para Gemini API

5. **Probar endpoint directamente:**
   ```bash
   curl -X POST https://dermicapro.com/api/gemini-proxy \
     -H "Content-Type: application/json" \
     -d '{
       "contents": [{
         "role": "user",
         "parts": [{"text": "Test"}]
       }]
     }'
   ```
   Debería retornar JSON, no error 400

---

## 📞 Contacto de Soporte

Si persiste el error después de seguir estos pasos:

1. Verifica los logs en Vercel Dashboard
2. Revisa los headers de CORS en la respuesta
3. Verifica que el endpoint `/api/gemini-proxy` está desplegado correctamente

---

**Última actualización:** 2025-01-27
**Autor:** Claude (Asistente AI)
