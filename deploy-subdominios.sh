#!/bin/bash

# Script de deploy para subdominios de Hostinger
# Uso: ./deploy-subdominios.sh

echo "🚀 Iniciando deploy de subdominios a Hostinger..."

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Build del proyecto
echo -e "${BLUE}📦 Haciendo build del proyecto...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el build${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completado${NC}"

# 2. Crear estructura de directorios para cada subdominio
echo -e "${BLUE}📁 Creando estructura de directorios...${NC}"

SUBDOMINIOS=("hf-reservas" "btx-reservas" "hp-reservas")

for subdominio in "${SUBDOMINIOS[@]}"; do
    mkdir -p "build-$subdominio"
    
    # Copiar build completo
    cp -r build/* "build-$subdominio/"
    
    # Crear .htaccess específico
    cat > "build-$subdominio/.htaccess" << 'HTACCESS'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Forzar HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # SPA Routing - Redirigir todo a index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
</IfModule>
HTACCESS

    echo -e "${GREEN}✅ Directorio build-$subdominio creado${NC}"
done

echo ""
echo -e "${GREEN}🎉 Builds listos para subir a Hostinger!${NC}"
echo ""
echo "📤 Pasos siguientes:"
echo "1. Ve a hpanel.hostinger.com"
echo "2. Abre el File Manager"
echo "3. Sube el contenido de cada carpeta:"
echo ""
echo "   build-hf-reservas/*  → /public_html/hf-reservas/"
echo "   build-btx-reservas/* → /public_html/btx-reservas/"
echo "   build-hp-reservas/*  → /public_html/hp-reservas/"
echo ""
echo "4. Verifica que los subdominios respondan:"
echo "   - https://hf-reservas.dermicapro.com"
echo "   - https://btx-reservas.dermicapro.com"
echo "   - https://hp-reservas.dermicapro.com"
