/**
 * Meta y TikTok Pixel para landing pages de postulación laboral
 * IDs separados de los de servicios para no contaminar audiencias
 */

const JOB_PIXEL_ID = '1888194015217158';
const JOB_TIKTOK_PIXEL_ID = 'D7UDUORC77U9TECLJIFG';

const waitForMetaPixel = () => {
  return new Promise((resolve) => {
    if (typeof window.fbq === 'function') {
      resolve(true);
      return;
    }
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (typeof window.fbq === 'function') {
        clearInterval(interval);
        resolve(true);
      } else if (attempts >= 50) {
        clearInterval(interval);
        console.warn('Meta Pixel no cargó después de 5 segundos');
        resolve(false);
      }
    }, 100);
  });
};

const waitForTikTokPixel = () => {
  return new Promise((resolve) => {
    if (typeof window.ttq === 'object' && typeof window.ttq.load === 'function') {
      resolve(true);
      return;
    }
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (typeof window.ttq === 'object' && typeof window.ttq.load === 'function') {
        clearInterval(interval);
        resolve(true);
      } else if (attempts >= 50) {
        clearInterval(interval);
        console.warn('TikTok Pixel no cargó después de 5 segundos');
        resolve(false);
      }
    }, 100);
  });
};

// Alias para compatibilidad con código existente
const waitForPixel = waitForMetaPixel;

/**
 * Inicializa el pixel de trabajo. Debe llamarse una vez al montar la página.
 */
export const initJobPixel = async () => {
  const ready = await waitForPixel();
  if (!ready) return;
  window.fbq('init', JOB_PIXEL_ID);
};

/**
 * Dispara ViewContent al pixel de trabajo.
 * @param {string} contentName - Nombre del puesto (ej: 'Asesor Comercial')
 * @param {string} contentType - Tipo de contenido (default: 'landing_page')
 */
export const trackJobPageView = async (contentName = 'Postulación Laboral', contentType = 'landing_page') => {
  const ready = await waitForPixel();
  if (!ready) return;
  window.fbq('trackSingle', JOB_PIXEL_ID, 'ViewContent', {
    content_name: contentName,
    content_type: contentType,
  });
};

/**
 * Dispara evento Lead al pixel de trabajo al enviar formulario exitosamente.
 * @param {object} options - Opciones del lead
 * @param {string} options.contentName - Nombre del puesto (ej: 'Asesor Comercial')
 * @param {string} options.contentCategory - Categoría (default: 'Postulación Laboral')
 * @param {number} options.value - Valor monetario (default: 0)
 * @param {string} options.currency - Moneda (default: 'PEN')
 */
export const trackJobLead = async (options = {}) => {
  const {
    contentName = 'Postulación',
    contentCategory = 'Postulación Laboral',
    value = 0,
    currency = 'PEN'
  } = options;

  const ready = await waitForPixel();
  if (!ready) return;
  window.fbq('trackSingle', JOB_PIXEL_ID, 'Lead', {
    content_name: contentName,
    content_category: contentCategory,
    value: value,
    currency: currency
  });
};

/**
 * Dispara un evento personalizado al pixel de trabajo.
 * @param {string} eventName - Nombre del evento personalizado
 * @param {object} params - Parámetros adicionales del evento
 */
export const trackJobCustomEvent = async (eventName, params = {}) => {
  const ready = await waitForPixel();
  if (!ready) return;
  window.fbq('trackSingleCustom', JOB_PIXEL_ID, eventName, params);
};

// ─── TikTok Pixel de trabajo ───────────────────────────────────────────────

/**
 * Inicializa el TikTok Pixel de trabajo. Debe llamarse una vez al montar la página.
 */
export const initJobTikTokPixel = async () => {
  const ready = await waitForTikTokPixel();
  if (!ready) return;
  window.ttq.load(JOB_TIKTOK_PIXEL_ID);
};

/**
 * Dispara ViewContent al TikTok Pixel de trabajo.
 * @param {string} contentName - Nombre del puesto (ej: 'Asesor Comercial')
 * @param {string} contentType - Tipo de contenido (default: 'landing_page')
 */
export const trackJobTikTokViewContent = async (contentName = 'Postulación Laboral', contentType = 'landing_page') => {
  const ready = await waitForTikTokPixel();
  if (!ready) return;
  window.ttq.instance(JOB_TIKTOK_PIXEL_ID).track('ViewContent', {
    content_name: contentName,
    content_type: contentType,
  });
};

