import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente MetaPixel para DermicaPro
 *
 * Maneja el tracking de PageView en cada cambio de ruta para SPAs
 * El pixel base ya está cargado en public/index.html
 *
 * IMPORTANTE: Este componente debe montarse en App.jsx
 *
 * NOTA: index.html ya trackea el PageView inicial, este componente
 * solo trackea navegaciones subsecuentes para evitar duplicados
 */
const MetaPixel = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  // Track PageView en cada cambio de ruta (importante para SPAs)
  useEffect(() => {
    // Skip el primer render porque index.html ya trackeó PageView inicial
    if (isFirstRender.current) {
      isFirstRender.current = false;
      console.log('ℹ️ Meta Pixel - PageView inicial ya trackeado por index.html');
      return;
    }

    // Función para intentar trackear PageView
    const trackPageView = () => {
      if (typeof window.fbq === 'function') {
        try {
          window.fbq('track', 'PageView');
          console.log('✅ Meta Pixel - PageView tracked:', location.pathname);
          return true;
        } catch (error) {
          console.error('❌ Error tracking PageView:', error);
          return false;
        }
      }
      return false;
    };

    // Intentar trackear inmediatamente
    if (!trackPageView()) {
      // Si no está listo, esperar hasta que se cargue
      let attempts = 0;
      const maxAttempts = 30; // 30 * 100ms = 3 segundos

      const interval = setInterval(() => {
        attempts++;
        if (trackPageView()) {
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.warn('⚠️ Meta Pixel no se cargó después de 3 segundos para:', location.pathname);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [location.pathname]);

  // Este componente no renderiza nada
  return null;
};

export default MetaPixel;
