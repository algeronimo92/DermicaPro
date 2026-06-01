/**
 * Helper centralizado para tracking condicional basado en fuente de tráfico
 */

import { trackViewContent as trackMetaViewContent, saveMetaUTM } from './metaPixelHelper';
import { trackViewContent as trackTikTokViewContent, saveTikTokUTM } from './tiktokPixelHelper';

/**
 * Detecta la fuente de tráfico basándose en parámetros URL
 * @returns {string} 'tiktok', 'meta', o 'organic'
 */
export const detectTrafficSource = () => {
  const urlParams = new URLSearchParams(window.location.search);

  const ttclid = urlParams.get('ttclid');
  const fbclid = urlParams.get('fbclid');
  const utm_source = urlParams.get('utm_source');

  // TikTok: ttclid presente
  if (ttclid) {
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
export const trackPageViewConditional = (contentName, contentType = 'landing_page', value = 0) => {
  const source = detectTrafficSource();

  console.log(`📊 PageView - Fuente detectada: ${source}`);

  if (source === 'tiktok') {
    console.log('🎵 Disparando TikTok PageView');
    trackTikTokViewContent(contentName, contentType, value);
  } else if (source === 'meta') {
    console.log('👤 Disparando Meta PageView');
    trackMetaViewContent(contentName, contentType, value);
  } else {
    console.log('🌐 Tráfico orgánico - Disparando ambos PageViews');
    trackMetaViewContent(contentName, contentType, value);
    trackTikTokViewContent(contentName, contentType, value);
  }
};

/**
 * Lee el valor de una cookie por nombre.
 * @param {string} name - Nombre de la cookie
 * @returns {string|null} Valor de la cookie o null si no existe
 */
const readCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

/**
 * Captura todos los parámetros UTM de TikTok Ads, Meta Ads y UTM estándar.
 * Guarda en sessionStorage y retorna objeto unificado para enviar a n8n.
 * @returns {object} Objeto con todos los parámetros UTM capturados
 */
export const captureAllUTM = () => {
  // Guardar en sessionStorage para uso de los pixels
  saveMetaUTM();
  saveTikTokUTM();

  const urlParams = new URLSearchParams(window.location.search);
  const sanitize = (value) => {
    if (!value) return null;
    return value.replace(/[<>"'`]/g, '').substring(0, 100);
  };

  const fbclidVal = sanitize(urlParams.get('fbclid'));

  return {
    // TikTok Ads
    ttclid: sanitize(urlParams.get('ttclid')),
    // Meta Ads
    fbclid: fbclidVal,
    ad_id: sanitize(urlParams.get('ad_id')),
    adset_id: sanitize(urlParams.get('adset_id')),
    campaign_id: sanitize(urlParams.get('campaign_id')),
    // UTM estándar
    utm_source: sanitize(urlParams.get('utm_source')),
    utm_medium: sanitize(urlParams.get('utm_medium')),
    utm_campaign: sanitize(urlParams.get('utm_campaign')),
    utm_content: sanitize(urlParams.get('utm_content')),
    utm_term: sanitize(urlParams.get('utm_term')),
    // Meta Pixel Browser IDs (v25 CAPI user_data)
    fbp: readCookie('_fbp') || null,
    fbc: (() => {
      const cookie = readCookie('_fbc');
      if (cookie) return cookie;
      return fbclidVal ? `fb.1.${Date.now()}.${fbclidVal}` : null;
    })(),
  };
};

const trackingHelper = {
  detectTrafficSource,
  trackPageViewConditional,
  captureAllUTM
};

export default trackingHelper;
