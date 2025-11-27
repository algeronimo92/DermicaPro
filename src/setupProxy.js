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
    console.log('\n========================================');
    console.log('🔄 NEW REQUEST TO GEMINI API');
    console.log('========================================');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🌐 Origin:', req.headers.origin || 'N/A');
    console.log('🔗 Referer:', req.headers.referer || 'N/A');
    console.log('📦 Content-Type:', req.headers['content-type']);
    console.log('📏 Content-Length:', req.headers['content-length']);
    console.log('');
    console.log('📨 REQUEST BODY:');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('');

    // Debug: Inspeccionar el texto que se enviará
    const textToSend = req.body?.contents?.[0]?.parts?.[0]?.text;
    if (textToSend) {
      console.log('🔍 TEXT FIELD INSPECTION:');
      console.log('📏 Length:', textToSend.length);
      console.log('🔤 First 500 chars:', textToSend.substring(0, 500));
      console.log('🔤 Last 200 chars:', textToSend.substring(textToSend.length - 200));

      // Buscar caracteres problemáticos
      const problematicChars = textToSend.match(/[^\x20-\x7E\n\r\t]/g);
      if (problematicChars) {
        console.log('⚠️  Problematic characters found:', problematicChars.slice(0, 20));
      }

      // Buscar comillas sin escapar
      const unescapedQuotes = (textToSend.match(/(?<!\\)"/g) || []).length;
      console.log('📊 Unescaped double quotes count:', unescapedQuotes);
    }
    console.log('========================================\n');

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
    const API_KEY = 'AIzaSyCPDDkkJ4V---SESYIXVWa_piSacP_WHRg';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const data = JSON.stringify(payload);
    const dataBuffer = Buffer.from(data, 'utf8');

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': dataBuffer.length
      }
    };

    const geminiReq = https.request(url, options, (geminiRes) => {
      geminiRes.setEncoding('utf8');
      let responseData = '';

      geminiRes.on('data', chunk => {
        responseData += chunk;
      });

      geminiRes.on('end', () => {
        console.log('\n========================================');
        console.log('✅ GEMINI API RESPONSE RECEIVED');
        console.log('========================================');
        console.log('📊 Status Code:', geminiRes.statusCode);
        console.log('📏 Response Length:', responseData.length, 'bytes');
        console.log('');

        // Verificar si la respuesta es JSON válida
        try {
          const jsonData = JSON.parse(responseData);
          const aiText = jsonData.candidates?.[0]?.content?.parts?.[0]?.text || 'N/A';

          // Si es error, mostrar detalles completos
          if (geminiRes.statusCode !== 200) {
            console.log('❌ ERROR RESPONSE FROM GEMINI:');
            console.log(JSON.stringify(jsonData, null, 2));
          } else {
            console.log('🤖 AI Response Preview:', aiText.substring(0, 200) + '...');
          }
          console.log('========================================\n');
          res.status(geminiRes.statusCode).json(jsonData);
        } catch (parseError) {
          console.error('❌ Invalid JSON response from Gemini:', responseData.substring(0, 200));
          console.log('========================================\n');
          res.status(502).json({
            error: 'Bad Gateway',
            message: 'Invalid response from Gemini API',
            details: geminiRes.statusCode
          });
        }
      });
    });

    geminiReq.on('error', (error) => {
      console.log('\n========================================');
      console.error('❌ GEMINI API ERROR');
      console.log('========================================');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      console.log('========================================\n');
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    });

    geminiReq.write(dataBuffer);
    geminiReq.end();
  });
};
