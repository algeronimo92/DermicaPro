const fs = require('fs');
const path = require('path');

const PAGES_DIR = __dirname;

const JOB_LANDINGS = [
  'VendedorPostulacionPage.jsx',
  'EditorVideoPostulacionPage.jsx',
  'EspecialistaLaserPostulacionPage.jsx',
  'PracticantesEditorVideoPostulacionPage.jsx',
  'PracticantesFilmmakerPostulacionPage.jsx',
];

const SERVICE_LANDINGS = [
  'HifuLandingPage.jsx',
  'BotoxLandingPage.jsx',
  'HollywoodPeelPage.jsx',
];

const JOB_ENDPOINT = 'https://n8n.dermicapro.online/webhook/trabajos';
const SERVICE_ENDPOINT = 'https://n8n.dermicapro.online/webhook/landing';

// ─── Landings de trabajo ──────────────────────────────────────────────────────

describe('Landings de trabajo', () => {
  test.each(JOB_LANDINGS)(
    'dado %s, cuando se envía el formulario, entonces apunta a /webhook/trabajos',
    (filename) => {
      const content = fs.readFileSync(path.join(PAGES_DIR, filename), 'utf8');
      expect(content).toContain(JOB_ENDPOINT);
    }
  );

  test.each(JOB_LANDINGS)(
    'dado %s, entonces NO apunta al endpoint de servicios',
    (filename) => {
      const content = fs.readFileSync(path.join(PAGES_DIR, filename), 'utf8');
      expect(content).not.toContain(SERVICE_ENDPOINT);
    }
  );
});

// ─── Landings de servicios ────────────────────────────────────────────────────

describe('Landings de servicios', () => {
  test.each(SERVICE_LANDINGS)(
    'dado %s, entonces NO apunta al endpoint de trabajos',
    (filename) => {
      const content = fs.readFileSync(path.join(PAGES_DIR, filename), 'utf8');
      expect(content).not.toContain(JOB_ENDPOINT);
    }
  );

  test.each(SERVICE_LANDINGS)(
    'dado %s, entonces delega el envío a handleFormSubmission (no llama fetch con URL de n8n directamente)',
    (filename) => {
      const content = fs.readFileSync(path.join(PAGES_DIR, filename), 'utf8');
      expect(content).toContain('handleFormSubmission');
      expect(content).not.toMatch(/fetch\s*\(\s*['"]https:\/\/n8n/);
    }
  );
});

// ─── Aislamiento entre ambos grupos ──────────────────────────────────────────

describe('Aislamiento de endpoints entre trabajo y servicios', () => {
  test('el endpoint de trabajos y el de servicios son distintos', () => {
    expect(JOB_ENDPOINT).not.toBe(SERVICE_ENDPOINT);
  });
});
