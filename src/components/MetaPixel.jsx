import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente MetaPixel para DermicaPro
 *
 * Maneja el tracking de PageView en cada cambio de ruta para SPAs
 * El pixel base ya está cargado en public/index.html
 *
 * IMPORTANTE: Este componente debe montarse en App.jsx
 */
const MetaPixel = () => {
  const location = useLocation();

  // Track PageView en cada cambio de ruta (importante para SPAs)
  useEffect(() => {
    if (window.fbq) {
      // Trackear PageView con información de la ruta
      window.fbq('track', 'PageView');

      // Console log para debugging (remover en producción si se desea)
      console.log('Meta Pixel - PageView tracked:', location.pathname);
    } else {
      console.warn('Meta Pixel (fbq) no está disponible. Verifica que el script base esté cargado en index.html');
    }
  }, [location.pathname]);

  // Este componente no renderiza nada
  return null;
};

export default MetaPixel;
