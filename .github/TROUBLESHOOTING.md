# 🔧 Troubleshooting: Deployment a Hostinger

## Error: "Timeout (control socket)"

Este es el error más común al conectarse a Hostinger desde GitHub Actions.

### ✅ Soluciones (Pruébalas en Orden)

---

## Solución 1: Verificar que FTP_SERVER sea Correcto

### **Problema:**
El hostname o IP del servidor FTP está incorrecto.

### **Solución:**
1. Ve al panel de Hostinger
2. Ve a **Hosting** → **Administrar** → **Acceso FTP**
3. Copia el **Hostname** exacto (puede ser diferente a dermicapro.com)

**Ejemplos de hostnames válidos:**
- `ftp.dermicapro.com`
- `ftp.hostinger.com`
- `156.67.218.xxx` (IP directa)
- `s123.hostinger.com` (hostname del servidor)

### **Actualizar el Secret en GitHub:**
1. GitHub → Settings → Secrets → Actions
2. Edit `FTP_SERVER`
3. Pega el hostname exacto de Hostinger

---

## Solución 2: Probar con SFTP en lugar de FTP

### **Problema:**
El puerto FTP (21) puede estar bloqueado. SFTP (puerto 22) suele ser más confiable.

### **Solución:**
1. **Deshabilita** el workflow FTP:
   - Abre [`.github/workflows/deploy-hostinger.yml`](.github/workflows/deploy-hostinger.yml)
   - Comenta el trigger de push (líneas 10-13):
   ```yaml
   # on:
   #   push:
   #     branches:
   #       - main
   on:
     workflow_dispatch:  # Solo manual
   ```

2. **Usa el workflow SFTP** que ya está creado:
   - El archivo [`.github/workflows/deploy-hostinger-sftp.yml`](.github/workflows/deploy-hostinger-sftp.yml) usa SFTP
   - Se ejecutará automáticamente en el próximo push

3. **Verifica que tienes acceso SSH en Hostinger:**
   - Hostinger → SSH Access
   - Si no está habilitado, actívalo desde el panel

---

## Solución 3: Verificar Credenciales

### **Problema:**
Usuario o contraseña FTP incorrectos.

### **Solución:**
1. **Prueba las credenciales manualmente:**
   - Descarga [FileZilla](https://filezilla-project.org/)
   - Intenta conectarte con:
     - Host: (tu FTP_SERVER)
     - Username: (tu FTP_USERNAME)
     - Password: (tu FTP_PASSWORD)
     - Port: 21 (FTP) o 22 (SFTP)

2. **Si FileZilla no conecta:**
   - Las credenciales están mal
   - Reestablece la contraseña FTP en Hostinger
   - Actualiza los secrets en GitHub

3. **Si FileZilla conecta pero GitHub no:**
   - Puede ser un problema de firewall
   - Contacta a soporte de Hostinger para permitir IPs de GitHub Actions

---

## Solución 4: Verificar FTP_SERVER_DIR

### **Problema:**
La ruta del servidor es incorrecta.

### **Ejemplos de rutas comunes en Hostinger:**
- `/public_html/` (más común)
- `/domains/dermicapro.com/public_html/`
- `/home/u123456789/public_html/`

### **Solución:**
1. Conéctate vía FTP con FileZilla
2. Navega hasta la carpeta donde está tu sitio
3. Copia la **ruta completa** desde la raíz
4. Actualiza `FTP_SERVER_DIR` en GitHub Secrets

**IMPORTANTE:** La ruta debe:
- Empezar con `/`
- Terminar con `/`
- Ejemplo: `/public_html/`

---

## Solución 5: Contactar Soporte de Hostinger

### **Problema:**
Firewall bloqueando conexiones desde GitHub Actions.

### **Solución:**
1. Abre un ticket de soporte en Hostinger
2. Diles: "Necesito permitir conexiones FTP/SFTP desde GitHub Actions"
3. Proporciona las **IPs de GitHub Actions**:
   - Puedes obtenerlas de: https://api.github.com/meta
   - O pide a Hostinger que permita el rango completo

**Mensaje de ejemplo:**
```
Hola, estoy intentando configurar deployment automático desde GitHub Actions
a mi cuenta de Hostinger usando FTP/SFTP, pero obtengo timeout errors.

¿Podrían verificar si el firewall está bloqueando conexiones desde las IPs
de GitHub Actions? Mi dominio es dermicapro.com.

Gracias.
```

---

## Solución 6: Usar Rsync (Avanzado)

Si FTP y SFTP no funcionan, puedes usar rsync sobre SSH.

### **Prerrequisitos:**
- SSH habilitado en Hostinger
- Clave SSH configurada

### **Crear nueva acción:**
```yaml
- name: Deploy via Rsync
  uses: burnett01/rsync-deployments@6.0.0
  with:
    switches: -avzr --delete
    path: build/
    remote_path: ${{ secrets.FTP_SERVER_DIR }}
    remote_host: ${{ secrets.FTP_SERVER }}
    remote_user: ${{ secrets.FTP_USERNAME }}
    remote_key: ${{ secrets.SSH_PRIVATE_KEY }}
```

---

## Verificar el Estado del Workflow

### **Ver Logs Detallados:**
1. Ve a GitHub → Actions
2. Click en el workflow fallido
3. Click en "Deploy to Hostinger via FTP"
4. Busca líneas que digan:
   - "Connecting to..."
   - "Error: ..."

### **Información Útil en los Logs:**
- `ECONNREFUSED` → Servidor rechazó la conexión (firewall)
- `ETIMEDOUT` → Timeout (firewall o hostname incorrecto)
- `Auth failed` → Usuario/contraseña incorrectos
- `No such file` → FTP_SERVER_DIR incorrecto

---

## Alternativa: Usar GitHub Pages

Si Hostinger sigue dando problemas, considera usar GitHub Pages (gratis):

### **Ventajas:**
- ✅ Deployment automático (sin configuración FTP)
- ✅ SSL gratis
- ✅ CDN global
- ✅ 100% confiable

### **Desventajas:**
- ❌ No puedes usar dominio dermicapro.com directo (necesitas CNAME)
- ❌ Solo archivos estáticos (igual que Hostinger)

### **Configuración:**
1. GitHub → Settings → Pages
2. Source: GitHub Actions
3. Crea workflow de build y publish

---

## Checklist de Verificación

Antes de contactar soporte, verifica:

- [ ] FTP_SERVER es el hostname correcto de Hostinger
- [ ] FTP_USERNAME es el usuario FTP correcto
- [ ] FTP_PASSWORD es la contraseña correcta
- [ ] FTP_SERVER_DIR termina con `/`
- [ ] Puedes conectarte manualmente con FileZilla
- [ ] SSH está habilitado en Hostinger (para SFTP)
- [ ] Has probado tanto FTP (puerto 21) como SFTP (puerto 22)

---

## Siguiente Paso Recomendado

**1. Prueba con SFTP primero** (más confiable):
   - Usa el workflow `deploy-hostinger-sftp.yml`
   - Asegúrate que SSH esté habilitado en Hostinger

**2. Si SFTP falla también:**
   - Contacta soporte de Hostinger
   - Considera alternativas (Vercel, GitHub Pages, Netlify)

**3. Mientras tanto:**
   - Puedes deployar manualmente con FileZilla
   - O usar Vercel que funciona out-of-the-box
