/**
 * Utilidades de Meta Pixel para DermicaPro
 *
 * Funciones helper para tracking de eventos de conversión
 * con validaciones y fallbacks
 */

const SERVICES_PIXEL_ID = '1431286785234837';

/**
 * Verifica si Meta Pixel está listo
 * @returns {boolean}
 */
const isPixelReady = () => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
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
        console.warn('Meta Pixel no se cargó después de 5 segundos');
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Track evento estándar de Meta Pixel
 * @param {string} eventName - Nombre del evento (Lead, Contact, Schedule, etc.)
 * @param {object} params - Parámetros del evento
 */
export const trackMetaEvent = async (eventName, params = {}) => {
  const ready = await waitForPixel();

  if (ready && window.fbq) {
    try {
      window.fbq('trackSingle', SERVICES_PIXEL_ID, eventName, params);
      console.log(`✅ Meta Pixel - ${eventName} tracked:`, params);
    } catch (error) {
      console.error(`❌ Error tracking Meta Pixel event ${eventName}:`, error);
    }
  } else {
    console.warn(`⚠️ Meta Pixel no disponible para trackear: ${eventName}`);
  }
};

/**
 * Track evento personalizado de Meta Pixel
 * @param {string} eventName - Nombre del evento personalizado
 * @param {object} params - Parámetros del evento
 */
export const trackMetaCustomEvent = async (eventName, params = {}) => {
  const ready = await waitForPixel();

  if (ready && window.fbq) {
    try {
      window.fbq('trackSingleCustom', SERVICES_PIXEL_ID, eventName, params);
      console.log(`✅ Meta Pixel - Custom ${eventName} tracked:`, params);
    } catch (error) {
      console.error(`❌ Error tracking custom event ${eventName}:`, error);
    }
  } else {
    console.warn(`⚠️ Meta Pixel no disponible para custom event: ${eventName}`);
  }
};

/**
 * Track conversión de Lead (formulario enviado)
 * @param {object} options - Opciones del lead
 */
export const trackLead = (options = {}) => {
  const {
    contentName = 'Lead Form',
    contentCategory = 'Tratamiento',
    value = 0,
    currency = 'PEN'
  } = options;

  trackMetaEvent('Lead', {
    content_name: contentName,
    content_category: contentCategory,
    value: value,
    currency: currency
  });
};

/**
 * Track contacto (WhatsApp, teléfono, email)
 * @param {string} method - Método de contacto (whatsapp, phone, email)
 * @param {string} source - Fuente del contacto (button, form, etc.)
 */
export const trackContact = (method = 'whatsapp', source = 'button') => {
  trackMetaEvent('Contact', {
    content_name: `Contacto vía ${method}`,
    contact_method: method,
    source: source
  });
};

/**
 * Track agendamiento de cita
 * @param {string} service - Servicio agendado
 * @param {number} value - Valor estimado del servicio
 */
export const trackSchedule = (service = 'Consulta General', value = 0) => {
  trackMetaEvent('Schedule', {
    content_name: service,
    content_category: 'Reserva',
    value: value,
    currency: 'PEN'
  });
};

/**
 * Track visualización de contenido (página de tratamiento)
 * @param {string} contentName - Nombre del contenido
 * @param {string} contentType - Tipo de contenido
 */
export const trackViewContent = (contentName, contentType = 'page', value = 0, currency = 'PEN') => {
  trackMetaEvent('ViewContent', {
    content_name: contentName,
    content_type: contentType,
    value: value,
    currency: currency
  });
};

/**
 * Track inicio de proceso de reserva
 * @param {string} service - Servicio seleccionado
 */
export const trackInitiateCheckout = (service = 'Consulta') => {
  trackMetaEvent('InitiateCheckout', {
    content_name: `Reserva ${service}`,
    content_category: 'Reserva'
  });
};

/**
 * Captura parámetros UTM de Meta Ads (Facebook/Instagram)
 * @returns {object} Objeto con parámetros UTM y fbclid
 */
export const captureMetaUTM = () => {
  const urlParams = new URLSearchParams(window.location.search);

  return {
    // Facebook Click ID (tracking de Meta Ads)
    fbclid: urlParams.get('fbclid') || null,

    // UTM parameters estándar
    utm_source: urlParams.get('utm_source') || null,
    utm_medium: urlParams.get('utm_medium') || null,
    utm_campaign: urlParams.get('utm_campaign') || null,
    utm_content: urlParams.get('utm_content') || null,
    utm_term: urlParams.get('utm_term') || null,

    // Timestamp de captura
    captured_at: new Date().toISOString()
  };
};

/**
 * Guarda parámetros UTM en sessionStorage
 * @returns {object} Datos UTM capturados
 */
export const saveMetaUTM = () => {
  const utmData = captureMetaUTM();

  // Solo guardar si hay datos relevantes
  if (utmData.fbclid || utmData.utm_source) {
    sessionStorage.setItem('meta_utm_data', JSON.stringify(utmData));
    console.log('Meta UTM data saved:', utmData);
  }

  return utmData;
};

/**
 * Obtiene parámetros UTM guardados
 * @returns {object|null} Datos UTM o null si no existen
 */
export const getMetaUTM = () => {
  const stored = sessionStorage.getItem('meta_utm_data');
  return stored ? JSON.parse(stored) : null;
};

/**
 * Obtiene cookie de Meta Pixel (_fbp)
 * @param {string} name - Nombre de la cookie
 * @returns {string|undefined} Valor de la cookie o undefined
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

/**
 * Valores estimados de leads por tratamiento (en PEN - Soles Peruanos)
 */
export const LEAD_VALUES = {
  'HIFU 12D': 0,
  'Hollywood Peel': 0,
  'Borrado de Manchas': 0,
  'Pico Láser': 0,
  'Hydrafacial': 0,
  'Peeling Químico': 0,
  'Consulta General': 0
};

/**
 * Track evento de lead con valores predefinidos por tratamiento
 * @param {string} treatment - Nombre del tratamiento
 */
export const trackTreatmentLead = (treatment) => {
  const value = LEAD_VALUES[treatment] || 0;

  trackLead({
    contentName: treatment,
    contentCategory: 'Tratamiento Facial',
    value: value,
    currency: 'PEN'
  });
};

/**
 * Eventos personalizados específicos de DermicaPro
 */
export const DermicaProEvents = {
  /**
   * Usuario scrollea a sección de beneficios en landing
   */
  scrollBeneficios: (treatment) => {
    trackMetaCustomEvent('DermicaPro_ScrollBeneficios', {
      treatment: treatment
    });
  },

  /**
   * Usuario reproduce video explicativo
   */
  videoPlay: (videoName) => {
    trackMetaCustomEvent('DermicaPro_VideoPlay', {
      video_name: videoName
    });
  },

  /**
   * Usuario ve galería de antes/después
   */
  viewGallery: (treatment) => {
    trackMetaCustomEvent('DermicaPro_ViewGallery', {
      treatment: treatment
    });
  },

  /**
   * Usuario interactúa con asesor virtual (Gemini AI)
   */
  consultaAsesor: (concern) => {
    trackMetaCustomEvent('DermicaPro_ConsultaAsesor', {
      concern: concern
    });
  },

  /**
   * Usuario recibe recomendación del asesor
   */
  recomendacionAsesor: (recommendation) => {
    trackMetaCustomEvent('DermicaPro_RecomendacionAsesor', {
      recommendation: recommendation
    });
  },

  /**
   * Click en botón de Instagram desde modal de éxito
   */
  clickInstagram: (source) => {
    trackMetaCustomEvent('DermicaPro_ClickInstagram', {
      source: source
    });
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  trackMetaEvent,
  trackMetaCustomEvent,
  trackLead,
  trackContact,
  trackSchedule,
  trackViewContent,
  trackInitiateCheckout,
  captureMetaUTM,
  saveMetaUTM,
  getMetaUTM,
  getCookie,
  LEAD_VALUES,
  trackTreatmentLead,
  DermicaProEvents
};
