# Testing Meta Pixel con ngrok (Dominio Temporal)

## 🚨 Problema
Meta Pixel NO funciona correctamente en `localhost:3000` porque:
- Meta requiere un dominio real (no localhost)
- Los eventos se envían pero Meta los descarta
- Events Manager no reconoce el sitio

---

## ✅ Solución: ngrok (Túnel HTTPS Temporal)

### Paso 1: Instalar ngrok

**macOS (con Homebrew):**
```bash
brew install ngrok
```

**O descarga manual:**
- Visita: https://ngrok.com/download
- Descarga para macOS
- Descomprime y mueve a `/usr/local/bin/`

---

### Paso 2: Crear cuenta en ngrok (Gratis)

1. Ve a: https://dashboard.ngrok.com/signup
2. Crea cuenta gratuita
3. Copia tu authtoken desde: https://dashboard.ngrok.com/get-started/your-authtoken

---

### Paso 3: Configurar ngrok

```bash
ngrok config add-authtoken TU_AUTHTOKEN_AQUI
```

---

### Paso 4: Exponer tu servidor local

**En una terminal separada (mientras npm start corre):**

```bash
ngrok http 3000
```

**Output esperado:**
```
ngrok

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       50ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                             0       0       0.00    0.00    0.00    0.00
```

---

### Paso 5: Usar el dominio ngrok

**Tu sitio ahora está disponible en:**
```
https://abc123.ngrok-free.app
```

Este es un **dominio real con HTTPS** que Meta reconocerá.

---

### Paso 6: Probar Meta Pixel

1. Abre en Chrome: `https://abc123.ngrok-free.app/hifu-landing`
2. Click en **Visit Site** (ngrok muestra un warning, es normal)
3. Abre **Meta Pixel Helper**
4. Abre **Console** (F12)

**Ahora sí deberías ver:**
- ✅ Pixel Helper muestra **verde**
- ✅ Console muestra eventos tracked
- ✅ **Meta Events Manager** reconoce el dominio

---

### Paso 7: Verificar en Meta Events Manager

1. Ve a: https://business.facebook.com/events_manager2
2. Selecciona pixel: **1431286785234837**
3. Click **Test Events** (en el menú izquierdo)
4. Abre tu sitio ngrok en otra pestaña
5. **Los eventos deberían aparecer en tiempo real** ✅

---

## 🎯 Comandos Resumidos

**Terminal 1:**
```bash
npm start
# Espera a que compile...
```

**Terminal 2:**
```bash
ngrok http 3000
# Copia la URL https://xxxxx.ngrok-free.app
```

**Navegador:**
```
https://xxxxx.ngrok-free.app/hifu-landing
```

---

## ⚙️ Alternativa: Configurar Dominio Personalizado en ngrok

Si tienes plan Pro de ngrok, puedes configurar:
```bash
ngrok http 3000 --domain=dermicapro-test.ngrok.io
```

Esto da una URL fija que no cambia.

---

## 🚀 Opción Final: Testear en Producción

Si ngrok no funciona, la mejor opción es:

1. **Build de producción:**
   ```bash
   npm run build
   ```

2. **Deploy a dermicapro.com** (tu dominio real)

3. **Testear en:**
   ```
   https://dermicapro.com/hifu-landing
   ```

---

## 📊 Diferencias: localhost vs ngrok vs producción

| Feature | localhost:3000 | ngrok | dermicapro.com |
|---------|---------------|-------|----------------|
| **Pixel se carga** | ✅ | ✅ | ✅ |
| **Eventos se envían** | ✅ | ✅ | ✅ |
| **Meta los procesa** | ❌ | ✅ | ✅ |
| **Events Manager reconoce** | ❌ | ✅ | ✅ |
| **Test Events funciona** | ❌ | ✅ | ✅ |
| **Dominio verificado** | ❌ | ⚠️ | ✅ |

---

## 🔍 Debugging con ngrok

ngrok incluye un dashboard local:

```
http://127.0.0.1:4040
```

Aquí puedes ver:
- Todas las requests HTTP
- Headers enviados
- Responses
- Muy útil para debug

---

## ⚠️ Limitaciones Plan Gratuito ngrok

- ✅ HTTPS incluido
- ✅ Túneles ilimitados
- ⚠️ URL cambia cada vez que reinicias ngrok
- ⚠️ Banner de warning (visitantes deben dar click)
- ⚠️ Expira después de 2 horas (reiniciar con mismo comando)

Para producción seria, usa tu dominio real: **dermicapro.com**

---

## 📚 Recursos

- [ngrok Docs](https://ngrok.com/docs)
- [Meta Pixel Troubleshooting](https://www.facebook.com/business/help/1728540670806315)
- [Test Events Guide](https://www.facebook.com/business/help/2040882589516719)

---

**Última Actualización:** 29 Nov 2025
