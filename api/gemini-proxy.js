// =================================================================================
// FILE: api/gemini-proxy.js
// Backend proxy para ocultar API Key de Google Gemini AI
// =================================================================================

/**
 * Vercel Serverless Function
 *
 * IMPORTANTE: Configurar variable de entorno en Vercel Dashboard:
 * GEMINI_API_KEY=<tu_api_key_aqui>
 *
 * Documentación: https://vercel.com/docs/functions/serverless-functions
 */

module.exports = async function handler(req, res) {
  // CORS headers - permite requests solo desde dermicapro.com
  const allowedOrigins = [
    'https://dermicapro.com',
    'https://www.dermicapro.com',
    'http://localhost:3000', // Para desarrollo local
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are accepted'
    });
  }

  // Validar que existe la API key en variables de entorno
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY not configured in environment variables');
    return res.status(500).json({
      error: 'Server configuration error',
      message: 'API key not configured'
    });
  }

  try {
    // Validar que el request tiene payload
    if (!req.body || !req.body.contents) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Missing required field: contents'
      });
    }

    // Rate limiting simple (opcional - descomentar si necesitas)
    // const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // TODO: Implementar rate limiting con Redis o similar

    // Hacer request a Google Gemini API
    // Modelo: gemini-2.5-flash (versión estable, rápida y eficiente para chatbots)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    // Verificar respuesta de Gemini
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', response.status, errorData);

      return res.status(response.status).json({
        error: 'External API error',
        message: 'Failed to get response from AI service',
        details: process.env.NODE_ENV === 'development' ? errorData : undefined
      });
    }

    // Parsear y devolver respuesta
    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    console.error('Server error in gemini-proxy:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
