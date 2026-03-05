/**
 * Servicio centralizado para envío de webhooks
 * Implementa patrón Service + Factory para estandarizar el comportamiento
 */


/**
 * Configuración del webhook
 */
const WEBHOOK_CONFIG = {
  baseUrl: 'https://dermica-pro-n8n.rcsgeg.easypanel.host',
  endpoint: '/webhook/landing',
  timeout: 10000 // 10 segundos
};


/**
 * Factory: Crea payload estandarizado para webhook
 * @param {Object} formData - Datos del formulario {nombre, whatsapp, email}
 * @param {string} tratamiento - Nombre del tratamiento
 * @param {string} landing - Identificador de la landing page
 * @param {Object} utmData - Datos UTM capturados
 * @returns {Object} Payload estandarizado
 */
export const createWebhookPayload = (formData, tratamiento, landing = null, utmData = {}) => {
  // Filtrar campos UTM vacíos para no enviar nulls a n8n
  const filteredUTM = Object.fromEntries(
    Object.entries(utmData).filter(([, v]) => v !== null && v !== undefined && v !== '')
  );

  const payload = {
    nombre: formData.nombre,
    whatsapp: formData.whatsapp.startsWith('+51')
      ? formData.whatsapp
      : `+51${formData.whatsapp}`,
    email: formData.email,
    tratamiento: tratamiento,
    ...filteredUTM
  };

  if (landing) {
    payload.landing = landing;
  }

  return payload;
};


/**
 * Servicio principal: Envía datos al webhook
 * @param {Object} formData - Datos del formulario
 * @param {string} tratamiento - Nombre del tratamiento
 * @param {string} landing - Identificador de la landing (opcional)
 * @param {Object} utmData - Datos UTM (opcional)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendToWebhook = async (formData, tratamiento, landing = null, utmData = {}) => {
  const webhookUrl = `${WEBHOOK_CONFIG.baseUrl}${WEBHOOK_CONFIG.endpoint}`;
  const payload = createWebhookPayload(formData, tratamiento, landing, utmData);

  console.log(`🔗 Enviando a webhook:`, webhookUrl);
  console.log(`📦 Payload:`, payload);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.timeout);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('✅ Webhook enviado exitosamente');
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error('❌ Error del servidor:', response.status, errorText);
      return {
        success: false,
        error: `Error del servidor: ${response.status}`
      };
    }
  } catch (error) {
    console.error('❌ Error enviando webhook:', error);

    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Tiempo de espera agotado. Por favor, intenta nuevamente.'
      };
    }

    return {
      success: false,
      error: 'Error de conexión. Verifica tu internet e intenta nuevamente.'
    };
  }
};

/**
 * Helper: Maneja el ciclo completo de envío de formulario
 * @param {Object} options - Opciones de configuración
 * @param {Object} options.formData - Datos del formulario
 * @param {string} options.tratamiento - Nombre del tratamiento
 * @param {string} options.landing - Identificador de landing (opcional)
 * @param {Object} options.utmData - Datos UTM (opcional)
 * @param {Function} options.onSuccess - Callback de éxito
 * @param {Function} options.onError - Callback de error
 * @param {Function} options.setIsSubmitting - Setter del estado de loading
 * @returns {Promise<void>}
 */
export const handleFormSubmission = async ({
  formData,
  tratamiento,
  landing = null,
  utmData = {},
  onSuccess,
  onError,
  setIsSubmitting
}) => {
  setIsSubmitting(true);

  try {
    const result = await sendToWebhook(formData, tratamiento, landing, utmData);

    if (result.success) {
      onSuccess();
    } else {
      onError(result.error);
    }
  } catch (error) {
    onError('Error inesperado. Por favor, intenta nuevamente.');
  } finally {
    setIsSubmitting(false);
  }
};

/**
 * Configuración de tratamientos disponibles
 */
export const TRATAMIENTOS = {
  HIFU: 'HIFU 12D',
  BOTOX: 'Botox',
  HOLLYWOOD_PEEL: 'Hollywood Peel',
  CONSULTA: 'Consulta General',
  BORRADO_MANCHAS: 'Borrado de Manchas',
  PICO_LASER: 'Pico Láser',
  HYDRAFACIAL: 'Hydrafacial',
  PEELING: 'Peeling Químico'
};

/**
 * Configuración de landings disponibles
 */
export const LANDINGS = {
  HIFU: 'hifu-landing',
  BOTOX: 'botox-landing',
  HOLLYWOOD_PEEL: 'hollywood-peel-landing'
};

export default {
  sendToWebhook,
  handleFormSubmission,
  createWebhookPayload,
  TRATAMIENTOS,
  LANDINGS
};
