/**
 * Utilidades de TikTok Pixel para DermicaPro
 *
 * Funciones helper para tracking de eventos de conversión
 * con validaciones y fallbacks
 */

/**
 * Verifica si TikTok Pixel está listo
 * @returns {boolean}
 */
const isPixelReady = () => {
  return typeof window !== 'undefined' && typeof window.ttq === 'object' && typeof window.ttq.track === 'function';
};

/**
 * Espera a que el pixel esté listo (máximo 5 segundos)
 * @returns {Promise<boolean>}
 */
const waitForPixel = () => {
  return new Promise((resolve) => {
    if (isPixelReady()) {
      resolve(true);
      return;
    }

    let attempts = 0;
    const maxAttempts = 50; // 50 * 100ms = 5 segundos

    const interval = setInterval(() => {
      attempts++;
      if (isPixelReady()) {
        clearInterval(interval);
        resolve(true);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn('TikTok Pixel no se cargó después de 5 segundos');
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Track evento estándar de TikTok Pixel
 * @param {string} eventName - Nombre del evento (SubmitForm, CompleteRegistration, etc.)
 * @param {object} params - Parámetros del evento
 */
export const trackTikTokEvent = async (eventName, params = {}) => {
  const ready = await waitForPixel();

  if (ready && window.ttq) {
    try {
      window.ttq.track(eventName, params);
      console.log(`✅ TikTok Pixel - ${eventName} tracked:`, params);
    } catch (error) {
      console.error(`❌ Error tracking TikTok Pixel event ${eventName}:`, error);
    }
  } else {
    console.warn(`⚠️ TikTok Pixel no disponible para trackear: ${eventName}`);
  }
};

/**
 * Track envío de formulario
 * @param {object} options - Opciones del evento
 */
export const trackSubmitForm = (options = {}) => {
  const {
    contentName = 'Lead Form',
    value = 0,
    currency = 'PEN'
  } = options;

  trackTikTokEvent('SubmitForm', {
    content_name: contentName,
    value: value,
    currency: currency
  });
};

/**
 * Track conversión de contacto
 * @param {string} method - Método de contacto (whatsapp, phone, email)
 */
export const trackContact = (method = 'whatsapp') => {
  trackTikTokEvent('Contact', {
    contact_method: method
  });
};

/**
 * Track visualización de contenido
 * @param {string} contentName - Nombre del contenido
 * @param {string} contentType - Tipo de contenido
 */
export const trackViewContent = (contentName, contentType = 'page', value = 0, currency = 'PEN') => {
  trackTikTokEvent('ViewContent', {
    content_name: contentName,
    content_type: contentType,
    value: value,
    currency: currency
  });
};

/**
 * Track inicio de proceso de registro/reserva
 * @param {string} service - Servicio seleccionado
 */
export const trackInitiateCheckout = (service = 'Consulta') => {
  trackTikTokEvent('InitiateCheckout', {
    content_name: `Reserva ${service}`
  });
};

/**
 * Track registro completado
 * @param {object} options - Opciones del registro
 */
export const trackCompleteRegistration = (options = {}) => {
  const {
    contentName = 'Registration',
    value = 0,
    currency = 'PEN'
  } = options;

  trackTikTokEvent('CompleteRegistration', {
    content_name: contentName,
    value: value,
    currency: currency
  });
};

/**
 * Captura parámetros UTM de TikTok Ads
 * @returns {object} Objeto con parámetros UTM y ttclid
 */
export const captureTikTokUTM = () => {
  const urlParams = new URLSearchParams(window.location.search);

  // Función de sanitización para prevenir XSS
  const sanitizeParam = (value) => {
    if (!value || value === 'N/A') return 'N/A';
    // Eliminar caracteres peligrosos y limitar longitud
    return value
      .replace(/[<>"'`]/g, '') // Eliminar chars XSS
      .substring(0, 100); // Limitar longitud máxima
  };

  return {
    // TikTok Click ID (tracking de TikTok Ads)
    ttclid: sanitizeParam(urlParams.get('ttclid')) || null,

    // Parámetros específicos de TikTok Ads
    tt_medium: sanitizeParam(urlParams.get('tt_medium')) || null,
    tt_campaign_id: sanitizeParam(urlParams.get('tt_campaign_id')) || null,
    tt_adgroup_id: sanitizeParam(urlParams.get('tt_adgroup_id')) || null,
    tt_ad_id: sanitizeParam(urlParams.get('tt_ad_id')) || null,

    // UTM parameters estándar
    utm_source: sanitizeParam(urlParams.get('utm_source')) || null,
    utm_medium: sanitizeParam(urlParams.get('utm_medium')) || null,
    utm_campaign: sanitizeParam(urlParams.get('utm_campaign')) || null,
    utm_content: sanitizeParam(urlParams.get('utm_content')) || null,
    utm_term: sanitizeParam(urlParams.get('utm_term')) || null,

    // Timestamp de captura
    captured_at: new Date().toISOString()
  };
};

/**
 * Guarda parámetros UTM en sessionStorage
 * @returns {object} Datos UTM capturados
 */
export const saveTikTokUTM = () => {
  const utmData = captureTikTokUTM();

  // Solo guardar si hay datos relevantes
  if (utmData.ttclid || utmData.utm_source) {
    sessionStorage.setItem('tiktok_utm_data', JSON.stringify(utmData));
    console.log('TikTok UTM data saved:', utmData);
  }

  return utmData;
};

/**
 * Obtiene parámetros UTM guardados
 * @returns {object|null} Datos UTM o null si no existen
 */
export const getTikTokUTM = () => {
  const stored = sessionStorage.getItem('tiktok_utm_data');
  return stored ? JSON.parse(stored) : null;
};

/**
 * Obtiene cookie de TikTok Pixel (_ttp)
 * @param {string} name - Nombre de la cookie
 * @returns {string|undefined} Valor de la cookie o undefined
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

/**
 * Valores estimados de conversiones por tratamiento (en PEN - Soles Peruanos)
 */
export const CONVERSION_VALUES = {
  'HIFU 12D': 400,
  'Hollywood Peel': 180,
  'Borrado de Manchas': 180,
  'Pico Láser': 180,
  'Hydrafacial': 120,
  'Peeling Químico': 100,
  'Botox': 850,
  'Consulta General': 50
};

/**
 * Track formulario enviado con valores predefinidos por tratamiento
 * @param {string} treatment - Nombre del tratamiento
 */
export const trackTreatmentSubmit = (treatment) => {
  const value = CONVERSION_VALUES[treatment] || 50;

  trackSubmitForm({
    contentName: treatment,
    value: value,
    currency: 'PEN'
  });
};

/**
 * Eventos personalizados específicos de DermicaPro para TikTok
 */
export const DermicaProTikTokEvents = {
  /**
   * Usuario scrollea a sección de beneficios en landing
   */
  scrollBeneficios: (treatment) => {
    trackTikTokEvent('ScrollBeneficios', {
      content_name: treatment
    });
  },

  /**
   * Usuario reproduce video explicativo
   */
  videoPlay: (videoName) => {
    trackTikTokEvent('VideoPlay', {
      video_name: videoName
    });
  },

  /**
   * Usuario ve galería de antes/después
   */
  viewGallery: (treatment) => {
    trackTikTokEvent('ViewGallery', {
      content_name: treatment
    });
  },

  /**
   * Click en botón de Instagram desde modal de éxito
   */
  clickInstagram: (source) => {
    trackTikTokEvent('ClickInstagram', {
      source: source
    });
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  trackTikTokEvent,
  trackSubmitForm,
  trackContact,
  trackViewContent,
  trackInitiateCheckout,
  trackCompleteRegistration,
  captureTikTokUTM,
  saveTikTokUTM,
  getTikTokUTM,
  getCookie,
  CONVERSION_VALUES,
  trackTreatmentSubmit,
  DermicaProTikTokEvents
};
