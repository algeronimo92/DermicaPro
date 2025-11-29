#!/usr/bin/env node
// =================================================================================
// FILE: scripts/test-gemini-api.js
// Script de prueba para verificar que Gemini API funciona correctamente
// =================================================================================

const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCPDDkkJ4V---SESYIXVWa_piSacP_WHRg';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

console.log('\n🧪 Probando Gemini API...\n');
console.log('📍 Endpoint:', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent');
console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...' + API_KEY.slice(-4));
console.log('');

const testPayload = {
  contents: [
    {
      parts: [
        {
          text: "Di OK si estas funcionando correctamente"
        }
      ]
    }
  ]
};

const data = JSON.stringify(testPayload);

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(API_URL, options, (res) => {
  let responseData = '';

  res.on('data', chunk => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('📥 Status Code:', res.statusCode);
    console.log('');

    if (res.statusCode === 200) {
      try {
        const jsonData = JSON.parse(responseData);
        const aiResponse = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiResponse) {
          console.log('✅ SUCCESS! Gemini API está funcionando correctamente');
          console.log('');
          console.log('🤖 Respuesta de IA:', aiResponse);
          console.log('');
          process.exit(0);
        } else {
          console.log('❌ ERROR: Respuesta válida pero sin contenido');
          console.log('');
          console.log('📦 Response completa:', JSON.stringify(jsonData, null, 2));
          console.log('');
          process.exit(1);
        }
      } catch (error) {
        console.log('❌ ERROR: No se pudo parsear JSON');
        console.log('');
        console.log('📦 Raw response:', responseData);
        console.log('');
        process.exit(1);
      }
    } else {
      console.log('❌ ERROR: La API retornó error', res.statusCode);
      console.log('');

      try {
        const errorData = JSON.parse(responseData);
        console.log('📦 Error details:', JSON.stringify(errorData, null, 2));
      } catch {
        console.log('📦 Raw error:', responseData);
      }

      console.log('');
      console.log('💡 Posibles causas:');
      console.log('   • API Key inválida o revocada');
      console.log('   • API Key sin permisos para Gemini API');
      console.log('   • Cuota de API excedida');
      console.log('   • Modelo no disponible');
      console.log('');
      console.log('🔧 Soluciones:');
      console.log('   1. Verifica tu API Key en https://makersuite.google.com/app/apikey');
      console.log('   2. Asegúrate de habilitar Gemini API en Google Cloud Console');
      console.log('   3. Verifica que no excediste la cuota gratuita');
      console.log('');

      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ ERROR DE RED:', error.message);
  console.log('');
  console.log('💡 Verifica tu conexión a internet');
  console.log('');
  process.exit(1);
});

req.write(data);
req.end();
