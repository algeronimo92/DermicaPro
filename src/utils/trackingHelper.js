/**
 * Helper centralizado para tracking condicional basado en fuente de tráfico
 */

import { trackViewContent as trackMetaViewContent } from './metaPixelHelper';
import { trackViewContent as trackTikTokViewContent } from './tiktokPixelHelper';

/**
 * Detecta la fuente de tráfico basándose en parámetros URL
 * @returns {string} 'tiktok', 'meta', o 'organic'
 */
export const detectTrafficSource = () => {
  const urlParams = new URLSearchParams(window.location.search);

  const ttclid = urlParams.get('ttclid');
  const tt_campaign_id = urlParams.get('tt_campaign_id');
  const fbclid = urlParams.get('fbclid');
  const utm_source = urlParams.get('utm_source');

  // TikTok: ttclid o tt_campaign_id presentes
  if (ttclid || tt_campaign_id) {
    return 'tiktok';
  }

  // Meta: fbclid presente O utm_source contiene facebook/instagram
  if (fbclid ||
      utm_source?.toLowerCase().includes('facebook') ||
      utm_source?.toLowerCase().includes('instagram') ||
      utm_source?.toLowerCase().includes('fb') ||
      utm_source?.toLowerCase().includes('ig')) {
    return 'meta';
  }

  // Si no se detecta fuente específica, disparar ambos (tráfico orgánico)
  return 'organic';
};

/**
 * Dispara PageView tracking solo al pixel correspondiente según la fuente
 * @param {string} contentName - Nombre del contenido
 * @param {string} contentType - Tipo de contenido
 */
export const trackPageViewConditional = (contentName, contentType = 'landing_page') => {
  const source = detectTrafficSource();

  console.log(`📊 PageView - Fuente detectada: ${source}`);

  if (source === 'tiktok') {
    console.log('🎵 Disparando TikTok PageView');
    trackTikTokViewContent(contentName, contentType);
  } else if (source === 'meta') {
    console.log('👤 Disparando Meta PageView');
    trackMetaViewContent(contentName, contentType);
  } else {
    console.log('🌐 Tráfico orgánico - Disparando ambos PageViews');
    trackMetaViewContent(contentName, contentType);
    trackTikTokViewContent(contentName, contentType);
  }
};

export default {
  detectTrafficSource,
  trackPageViewConditional
};
