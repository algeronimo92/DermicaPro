#!/usr/bin/env node

/**
 * DERMICAPRO LANDING CREATOR
 * Script CLI interactivo para generar landing pages de tratamientos
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

// Estado del formulario
const formData = {
  treatmentName: '',
  slug: '',
  pattern: '',
  heroTitle: '',
  heroSubtitle: '',
  problemDescription: '',
  solutionDescription: '',
  benefits: [],
  faqs: [],
  pixelId: '',
  webhookUrl: ''
};

console.log(`\n${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}║   DERMICAPRO LANDING PAGE CREATOR v1.0       ║${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════════╝${colors.reset}\n`);

// Función para hacer preguntas
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${prompt}${colors.reset} `, resolve);
  });
}

// Función para capitalizar
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Función para crear slug
function createSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Función principal del CLI
async function runCLI() {
  try {
    console.log(`${colors.yellow}Responde las siguientes preguntas para generar tu landing page:\n${colors.reset}`);

    // 1. Nombre del tratamiento
    formData.treatmentName = await question('1️⃣  Nombre del tratamiento (ej: HIFU 12D):');

    // 2. Slug sugerido
    const suggestedSlug = createSlug(formData.treatmentName);
    const slugInput = await question(`2️⃣  Slug de URL [${suggestedSlug}]:`);
    formData.slug = slugInput || suggestedSlug;

    // 3. Patrón
    console.log(`\n${colors.bright}Patrones disponibles:${colors.reset}`);
    console.log('  1) Con formulario integrado (como HIFU Landing)');
    console.log('  2) Con WhatsApp directo (como Hollywood Peel)\n');
    const patternChoice = await question('3️⃣  Selecciona patrón [1/2]:');
    formData.pattern = patternChoice === '2' ? 'whatsapp' : 'form';

    // 4. Hero title
    const defaultHeroTitle = `¿Buscas ${formData.treatmentName} en Trujillo?`;
    const heroTitleInput = await question(`4️⃣  Título del hero [${defaultHeroTitle}]:`);
    formData.heroTitle = heroTitleInput || defaultHeroTitle;

    // 5. Hero subtitle
    formData.heroSubtitle = await question('5️⃣  Subtítulo del hero (el problema que resuelve):');

    // 6. Descripción del problema
    formData.problemDescription = await question('6️⃣  Descripción del problema (lo que ya intentaron):');

    // 7. Descripción de la solución
    formData.solutionDescription = await question('7️⃣  ¿Cómo tu tratamiento resuelve el problema?:');

    // 8. Beneficios (3-4)
    console.log(`\n${colors.bright}Beneficios del tratamiento (mínimo 3):${colors.reset}`);
    for (let i = 1; i <= 4; i++) {
      const benefit = await question(`  ${i}) Beneficio ${i}${i > 3 ? ' (opcional)' : ''}:`);
      if (benefit.trim()) {
        const description = await question(`     Descripción breve:`);
        formData.benefits.push({ title: benefit, description });
      } else if (i <= 3) {
        console.log(`${colors.red}  ⚠️  Debes ingresar al menos 3 beneficios${colors.reset}`);
        i--;
      } else {
        break;
      }
    }

    // 9. FAQs (2-3)
    console.log(`\n${colors.bright}Preguntas Frecuentes (mínimo 2):${colors.reset}`);
    for (let i = 1; i <= 3; i++) {
      const faq = await question(`  ${i}) Pregunta ${i}${i > 2 ? ' (opcional)' : ''}:`);
      if (faq.trim()) {
        const answer = await question(`     Respuesta:`);
        formData.faqs.push({ question: faq, answer });
      } else if (i <= 2) {
        console.log(`${colors.red}  ⚠️  Debes ingresar al menos 2 preguntas${colors.reset}`);
        i--;
      } else {
        break;
      }
    }

    // 10. Configuración técnica (solo para patrón con formulario)
    if (formData.pattern === 'form') {
      console.log(`\n${colors.bright}Configuración técnica:${colors.reset}`);
      formData.pixelId = await question('  TikTok Pixel ID (opcional):');
      const defaultWebhook = 'https://dermica-pro-n8n.rcsgeg.easypanel.host/webhook-test/4eb758d3-3c26-4f0c-96a8-7d8b19bf0f0a';
      const webhookInput = await question(`  Webhook URL [${defaultWebhook}]:`);
      formData.webhookUrl = webhookInput || defaultWebhook;
    }

    // Resumen
    console.log(`\n${colors.bright}${colors.green}═══════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Resumen de tu landing page:${colors.reset}`);
    console.log(`  • Tratamiento: ${formData.treatmentName}`);
    console.log(`  • URL: /landing/${formData.slug}`);
    console.log(`  • Patrón: ${formData.pattern === 'form' ? 'Formulario integrado' : 'WhatsApp directo'}`);
    console.log(`  • Beneficios: ${formData.benefits.length}`);
    console.log(`  • FAQs: ${formData.faqs.length}`);
    console.log(`${colors.bright}${colors.green}═══════════════════════════════════════════════${colors.reset}\n`);

    const confirm = await question('¿Generar landing page? [S/n]:');

    if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
      console.log(`${colors.yellow}\n✋ Operación cancelada${colors.reset}\n`);
      rl.close();
      return;
    }

    // Generar archivos
    await generateLandingPage();
    await updateAppRoutes();

    console.log(`\n${colors.bright}${colors.green}✅ ¡Landing page creada exitosamente!${colors.reset}\n`);
    console.log(`${colors.bright}Próximos pasos:${colors.reset}`);
    console.log(`  1. Revisa el archivo: ${colors.cyan}src/pages/${capitalize(formData.slug)}LandingPage.jsx${colors.reset}`);
    console.log(`  2. Agrega imágenes en: ${colors.cyan}public/images/${formData.slug}/${colors.reset}`);
    console.log(`  3. Ejecuta: ${colors.cyan}npm start${colors.reset}`);
    console.log(`  4. Visita: ${colors.cyan}http://localhost:3000/landing/${formData.slug}${colors.reset}\n`);

    rl.close();
  } catch (error) {
    console.error(`\n${colors.red}❌ Error: ${error.message}${colors.reset}\n`);
    rl.close();
    process.exit(1);
  }
}

// Generar el archivo de la landing page
async function generateLandingPage() {
  const template = formData.pattern === 'form'
    ? require('./templates/landing-form-template')
    : require('./templates/landing-whatsapp-template');

  const componentName = capitalize(formData.slug) + 'LandingPage';
  const content = template.generate(formData, componentName);

  const filePath = path.join(__dirname, '..', 'src', 'pages', `${componentName}.jsx`);
  fs.writeFileSync(filePath, content, 'utf8');

  console.log(`${colors.green}✓${colors.reset} Archivo creado: ${filePath}`);
}

// Actualizar App.jsx con la nueva ruta
async function updateAppRoutes() {
  const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
  let appContent = fs.readFileSync(appPath, 'utf8');

  const componentName = capitalize(formData.slug) + 'LandingPage';
  const routePath = `/landing/${formData.slug}`;

  // 1. Agregar import
  const importLine = `import ${componentName} from "./pages/${componentName}";`;
  const lastImportMatch = appContent.match(/import.*from.*['"]\.\/.*/g);
  if (lastImportMatch) {
    const lastImport = lastImportMatch[lastImportMatch.length - 1];
    appContent = appContent.replace(lastImport, `${lastImport}\n${importLine}`);
  }

  // 2. Agregar ruta al hideLayout array
  const hideLayoutRegex = /const hideLayout = \[(.*?)\];/s;
  const hideLayoutMatch = appContent.match(hideLayoutRegex);
  if (hideLayoutMatch) {
    const currentPaths = hideLayoutMatch[1];
    const newPaths = currentPaths.trim() ? `${currentPaths}, "${routePath}"` : `"${routePath}"`;
    appContent = appContent.replace(hideLayoutRegex, `const hideLayout = [${newPaths}];`);
  }

  // 3. Agregar Route
  const routeLine = `            <Route path="${routePath}" element={<${componentName} />} />`;
  const lastRouteRegex = /<Route path="\/hifu-landing".*?\/>/;
  appContent = appContent.replace(lastRouteRegex, (match) => `${match}\n${routeLine}`);

  fs.writeFileSync(appPath, appContent, 'utf8');
  console.log(`${colors.green}✓${colors.reset} App.jsx actualizado con nueva ruta: ${routePath}`);
}

// Ejecutar CLI
runCLI();