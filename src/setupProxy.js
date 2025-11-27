// =================================================================================
// FILE: src/setupProxy.js
// Proxy de desarrollo para simular Vercel Functions localmente
// =================================================================================

const https = require('https');
const express = require('express');

module.exports = function(app) {
  // Middleware para parsear JSON
  app.use(express.json());

  // Handler para /api/gemini-proxy en desarrollo
  app.post('/api/gemini-proxy', (req, res) => {
    console.log('🔄 Proxying request to Gemini API...');
    console.log('📦 Request body:', JSON.stringify(req.body).substring(0, 200));

    const payload = req.body;

    // Validar que llegó el payload
    if (!payload || !payload.contents) {
      console.error('❌ Invalid payload received');
      console.error('Payload received:', payload);
      return res.status(400).json({
        error: 'Bad request',
        message: 'Missing required field: contents'
      });
    }

    // API Key solo para desarrollo (en producción está en Vercel env vars)
    const API_KEY = 'AIzaSyCI2ivEXoa5k6dUMnc62CZrify424ERntU';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const data = JSON.stringify(payload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const geminiReq = https.request(url, options, (geminiRes) => {
      let responseData = '';

      geminiRes.on('data', chunk => {
        responseData += chunk;
      });

      geminiRes.on('end', () => {
        console.log('✅ Gemini API response received');

        // Verificar si la respuesta es JSON válida
        try {
          const jsonData = JSON.parse(responseData);
          res.status(geminiRes.statusCode).json(jsonData);
        } catch (parseError) {
          console.error('❌ Invalid JSON response from Gemini:', responseData.substring(0, 200));
          res.status(502).json({
            error: 'Bad Gateway',
            message: 'Invalid response from Gemini API',
            details: geminiRes.statusCode
          });
        }
      });
    });

    geminiReq.on('error', (error) => {
      console.error('❌ Gemini API error:', error.message);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    });

    geminiReq.write(data);
    geminiReq.end();
  });
};
