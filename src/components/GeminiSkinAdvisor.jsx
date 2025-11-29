// =================================================================================
// FILE: src/components/GeminiSkinAdvisor.jsx
// =================================================================================
import React, { useState, useEffect, useRef } from 'react';
import  SparklesIcon  from './icons/SparklesIcon';
import TreatmentSelectionModal from './TreatmentSelectionModal';
import { extractTreatmentsFromResponse } from '../data/treatmentsData';

const GeminiSkinAdvisor = ({ isOpen, onClose }) => {
    const [concern, setConcern] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showTreatmentModal, setShowTreatmentModal] = useState(false);
    const [recommendedTreatments, setRecommendedTreatments] = useState([]);
    const modalRef = useRef();
    const recommendationRef = useRef();

    // Función para formatear markdown a HTML
    const formatMarkdownToHTML = (text) => {
        return text
            // Convertir **texto** a <strong>
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
            // Convertir * item a bullets
            .replace(/^\*\s+(.+)$/gm, '<li class="ml-4">$1</li>')
            // Envolver grupos de <li> en <ul>
            .replace(/(<li.*?<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-2 my-3">$&</ul>')
            // Convertir saltos de línea dobles en párrafos
            .split('\n\n')
            .map(para => para.trim() ? `<p class="mb-4">${para}</p>` : '')
            .join('');
    };

    useEffect(() => {
        if (!isOpen) { setConcern(''); setRecommendation(''); setError(''); setLoading(false); }
    }, [isOpen]);

    const handleGetRecommendation = async () => {
        if (!concern.trim()) { setError('Por favor, describe tu preocupación para poder ayudarte.'); return; }
        setLoading(true); setError(''); setRecommendation('');

        const servicesList = [
            "Borrado de Micropigmentación",
            "Borrado de Tatuajes",
            "Reducción de Papada",
            "Hollywood Peel",
            "HIFU 12D (Lifting sin Cirugía)",
            "Enzimas Recombinantes",
            "Micropigmentación de Cejas y Labios",
            "Reducción de Papada con HIFU",
            "Reducción de Papada con Enzimas Recombinantes",
            "Reducción de Grasa Localizada",
            "Exosomas con Ácido Tranexámico",
            "Botox (Toxina Botulínica)",
            "Dermapen (Microagujas)",
            "Dermapen con PRP (Plasma Rico en Plaquetas)",
            "Dermapen con Ácido Hialurónico",
            "Dermapen con Vitamina C"
        ].join(', ');

        // Construir base de conocimiento para el prompt
        // IMPORTANTE: Evitar comillas dobles dentro del texto para no romper JSON
        const knowledgeContext = `
=== BASE DE CONOCIMIENTO DERMATOLÓGICO ===

CONDICIONES Y TRATAMIENTOS ESPECIALIZADOS:

1. MANCHAS (Melasma, Hiperpigmentación, Lentigos solares):
   - Causas: Exposición solar, cambios hormonales, acné, envejecimiento
   - Tratamientos: Hollywood Peel, Exosomas con Ácido Tranexámico
   - Resultados esperados: Reducción visible en 3-6 sesiones

2. FLACIDEZ (Facial, cuello, papada, pérdida de contorno):
   - Causas: Pérdida de colágeno, envejecimiento natural, pérdida de peso
   - Tratamientos: HIFU 12D, Reducción de Papada con HIFU
   - Resultados esperados: Efecto tensor progresivo, óptimo a los 3-6 meses

3. ARRUGAS (Líneas de expresión, patas de gallo, entrecejo, frente):
   - Causas: Expresiones faciales repetitivas, pérdida de colágeno
   - Tratamientos: Botox, Exosomas con Ácido Tranexámico, Dermapen con Ácido Hialurónico
   - Resultados esperados: Suavización en 3-7 días, duración 4-6 meses

4. GRASA LOCALIZADA (Papada, abdomen, brazos, muslos):
   - Causas: Genética, estilo de vida, metabolismo
   - Tratamientos: Enzimas Recombinantes, Reducción de Grasa Localizada
   - Resultados esperados: Reducción gradual, 4-8 semanas

5. ENVEJECIMIENTO GLOBAL (Pérdida de luminosidad, textura irregular):
   - Tratamientos: Exosomas con Ácido Tranexámico, Hollywood Peel, HIFU 12D
   - Enfoque: Combinación de tratamientos para resultados integrales

6. CICATRICES (Acné, quirúrgicas, atróficas, estrías):
   - Causas: Acné severo, cirugías, traumatismos, distensión de piel
   - Tratamientos: Dermapen con PRP, Dermapen con Ácido Hialurónico, Dermapen
   - Resultados esperados: Mejora visible en 4-6 sesiones, óptimo en 6-8 meses
   - Contraindicaciones: Queloides activos, isotretinoína, infección activa

7. TEXTURA IRREGULAR + POROS ABIERTOS:
   - Causas: Producción excesiva de sebo, edad, daño solar
   - Tratamientos: Dermapen, Dermapen con Vitamina C, Hollywood Peel
   - Resultados esperados: Refinamiento en 3-5 sesiones, mantenimiento cada 2-3 meses

PROTOCOLOS DE COMBINACIÓN AVANZADOS:

• Envejecimiento + Manchas + Flacidez → HIFU 12D + Exosomas con Ácido Tranexámico
  Razón: HIFU tensa y estimula colágeno, Exosomas regeneran células y aclaran manchas
  Plan: Alternar cada 3-4 semanas

• Arrugas de expresión + Pérdida de luminosidad → Botox + Hollywood Peel
  Razón: Botox suaviza arrugas dinámicas, Hollywood Peel ilumina y mejora textura
  Plan: Botox cada 4-6 meses, Hollywood Peel mensual

• Papada + Flacidez facial general → Reducción de Papada HIFU + HIFU 12D facial
  Razón: Tratamiento focalizado + integral para armonía del rostro
  Plan: Evaluación para sesión combinada

• Manchas resistentes + Textura → Exosomas + Hollywood Peel
  Razón: Exosomas a nivel celular + Hollywood Peel en superficie
  Plan: Exosomas cada 4 semanas, Hollywood Peel entre sesiones

• Cicatrices de acné profundas → Dermapen con PRP
  Razón: PRP potencia regeneración celular y colágeno para rellenar cicatrices atróficas
  Plan: 4-6 sesiones cada 4 semanas, mantenimiento cada 3-6 meses

• Textura irregular + Poros + Manchas leves → Dermapen con Vitamina C + Hollywood Peel
  Razón: Dermapen con Vit C estimula colágeno y aclara, Hollywood Peel refina poros
  Plan: Alternar cada 3 semanas

• Líneas finas + Deshidratación + Pérdida de volumen → Dermapen con Ácido Hialurónico
  Razón: Microagujas permiten penetración profunda de ácido hialurónico para hidratar y rellenar
  Plan: 3-5 sesiones cada 3-4 semanas

• Rejuvenecimiento facial completo con cicatrices + manchas → Dermapen con PRP + Exosomas
  Razón: PRP repara cicatrices, Exosomas aclaran manchas y rejuvenecen globalmente
  Plan: Protocolo 6 meses alternando cada 3-4 semanas

SEÑALES DE ALERTA (Derivar a consulta médica):
- Cambios recientes en lunares o lesiones
- Infecciones activas de la piel
- Embarazo/lactancia (mayoría de tratamientos)
- Condiciones que requieren diagnóstico (rosácea severa, dermatitis)
`;

        const prompt = `${knowledgeContext}

=== TU ROL COMO EXPERTO EN DERMATOLOGÍA ESTÉTICA ===

Eres el Dr. Virtual de DermicaPro, un experto en dermatología estética con:
- 10+ años de experiencia en tratamientos no invasivos
- Conocimiento profundo de fisiología de la piel
- Expertise en combinación de tecnologías para resultados óptimos
- Enfoque holístico: no solo tratas síntomas, entiendes causas

PERSONALIDAD: Empática, científicamente rigurosa pero accesible, honesta, inspiradora
TONO: Cálido profesional, educativo sin ser condescendiente
MISIÓN: Educar, empoderar y recomendar la mejor solución basada en evidencia

=== PROTOCOLO DE RESPUESTA EXPERTA (CONCISA Y DIRECTA) ===

IMPORTANTE: Mantén la respuesta BREVE y ESCANEABLE. Máximo 200 palabras totales.

1. SALUDO EMPÁTICO (1 línea):
   - Ejemplo: '¡Entiendo tu preocupación! Vamos a encontrar la mejor solución para ti.'

2. CAUSA BREVE (1-2 líneas):
   - Explica QUÉ causa el problema en 1 oración simple
   - Ejemplo: 'La flacidez ocurre por pérdida de colágeno con el tiempo.'

3. TRATAMIENTO RECOMENDADO (Máximo 2 tratamientos):
   - Si es SIMPLE → 1 tratamiento
   - Si es COMPLEJO → Máximo 2 tratamientos
   - Formato: **Nombre del Tratamiento**: Qué hace + Resultado esperado (1-2 líneas por tratamiento)
   - Ejemplo: '**HIFU 12D**: Estimula colágeno profundo para reafirmar y definir el rostro. Resultados visibles en 3-6 meses.'

4. PLAN RÁPIDO (3-4 bullets ultra breves):
   - Sesiones necesarias
   - Tiempo de resultados
   - Ejemplo:
     * 1-2 sesiones
     * Resultados: 3-6 meses
     * Duración: hasta 1 año

5. CIERRE (1 línea):
   - Ejemplo: '¡Agenda tu evaluación y comencemos!'

=== REGLAS ESTRICTAS ===

✅ SIEMPRE:
- Sé BREVE: máximo 200 palabras totales
- Recomienda SOLO 1-2 tratamientos máximo
- Usa bullets (*) para planes de acción
- Formatea nombres con **negrita**
- Sé directa y clara

❌ NUNCA:
- Escribas más de 200 palabras
- Recomiendes más de 2 tratamientos
- Uses párrafos largos (máximo 2 líneas)
- Inventes tratamientos fuera de la lista
- Uses jerga técnica compleja

=== TRATAMIENTOS DISPONIBLES ===
${servicesList}

=== PREOCUPACIÓN DEL CLIENTE ===
${concern.trim()}

=== TU RESPUESTA EXPERTA ===`;



        try {
            // Sanitizar caracteres de control que pueden romper JSON
            // JSON.stringify() manejará automáticamente \n, \t, ", etc.
            // eslint-disable-next-line no-control-regex
            const sanitizedPrompt = prompt.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, ''); // Remover caracteres de control excepto \n, \r, \t

            const payload = { contents: [{ role: "user", parts: [{ text: sanitizedPrompt }] }] };

            // Validar que el payload sea JSON válido antes de enviar
            let payloadString;
            try {
                payloadString = JSON.stringify(payload);
                console.log('✅ Payload is valid JSON');
                console.log('📏 Payload length:', payloadString.length, 'characters');
            } catch (jsonError) {
                console.error('❌ Invalid JSON payload:', jsonError);
                throw new Error('El texto contiene caracteres no válidos. Por favor, reformula tu consulta.');
            }

            // SEGURIDAD: API Key está en backend proxy (Vercel Function)
            // Endpoint: Vercel production API (hosted separately from Hostinger frontend)
            const API_URL = process.env.NODE_ENV === 'development'
                ? '/api/gemini-proxy'  // Local development with Vercel CLI
                : 'https://dermicapro-kf6b9mxf2-alan-geronimos-projects.vercel.app/api/gemini-proxy';  // Production Vercel API

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payloadString
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API error: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const aiResponse = result.candidates[0].content.parts[0].text;
                setRecommendation(aiResponse);

                // Extraer tratamientos de la respuesta de Gemini
                const treatments = extractTreatmentsFromResponse(aiResponse);
                setRecommendedTreatments(treatments);

                // Scroll suave hacia la recomendación después de un pequeño delay
                setTimeout(() => {
                    recommendationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            } else {
                throw new Error("No se recibió una respuesta válida de la IA.");
            }
        } catch (err) {
            console.error(err);
            setError('Hubo un problema al obtener la recomendación. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => { if (modalRef.current && !modalRef.current.contains(event.target)) { onClose(); } };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen && !showTreatmentModal) return null;

    return (
        <>
            {/* Modal del Asesor de Piel */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
                    <div ref={modalRef} className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                        {/* Header fijo */}
                        <div className="flex justify-between items-center p-6 md:p-8 pb-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                    <SparklesIcon className="w-6 h-6 mr-2 text-[#ea899a]" />
                                    Dr. Virtual de DermicaPro
                                </h2>
                                <p className="text-xs text-gray-500 mt-1 ml-8">Experto en Dermatología Estética</p>
                            </div>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none transition-colors">
                                &times;
                            </button>
                        </div>

                        {/* Contenido scrolleable */}
                        <div className="overflow-y-auto p-6 md:p-8 pt-6 flex-1">
                            {/* Mostrar consulta original de forma compacta cuando hay recomendación */}
                            {recommendation ? (
                                <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-500 mb-1">Tu consulta:</p>
                                            <p className="text-sm text-gray-700 leading-relaxed italic">"{concern}"</p>
                                        </div>
                                        <button
                                            onClick={() => { setRecommendation(''); setRecommendedTreatments([]); setError(''); }}
                                            className="flex-shrink-0 text-xs text-[#ea899a] hover:text-[#d37989] font-semibold underline transition-colors"
                                        >
                                            Nueva consulta
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-xl p-5 mb-6 border-l-4 border-[#ea899a]">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                                                <svg className="w-6 h-6 text-[#ea899a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    <span className="font-semibold text-gray-800">¡Bienvenido a tu consulta virtual!</span> Como experto en dermatología estética, voy a analizar tu preocupación y recomendarte los tratamientos más efectivos basados en evidencia científica.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-4 text-sm">
                                        Describe tu preocupación con detalle. Mientras más información compartas, mejor podré ayudarte:
                                    </p>

                                    <textarea
                                        value={concern}
                                        onChange={(e) => setConcern(e.target.value)}
                                        className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea899a] focus:border-[#ea899a] transition resize-none text-sm"
                                        placeholder="Ejemplo: Tengo 35 años y he notado manchas oscuras en mis mejillas que empeoran con el sol. También siento que mi piel ha perdido firmeza y tengo líneas finas alrededor de los ojos. Me gustaría lucir más fresca pero con resultados naturales..."
                                        disabled={loading}
                                    />

                                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

                                    <button
                                        onClick={handleGetRecommendation}
                                        disabled={loading}
                                        className="w-full mt-6 bg-gradient-to-r from-[#ea899a] to-[#d37989] text-white font-bold py-4 px-6 rounded-full text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02]"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analizando desde perspectiva dermatológica...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Recibir Análisis Dermatológico Experto
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {/* Recomendación */}
                            {recommendation && (
                                <div ref={recommendationRef} className="mt-8 animate-fade-in">
                                    <div className="bg-gradient-to-br from-pink-50 via-white to-pink-50 border-2 border-[#ea899a] rounded-2xl p-6 md:p-8 shadow-lg">
                                        <div className="flex items-start gap-3 mb-5">
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#ea899a] to-[#d37989] rounded-full flex items-center justify-center shadow-md">
                                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                                                    Análisis Dermatológico Personalizado
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">Basado en evidencia científica y tu caso específico</p>
                                            </div>
                                        </div>

                                        <div
                                            className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm md:text-base"
                                            dangerouslySetInnerHTML={{ __html: formatMarkdownToHTML(recommendation) }}
                                        />

                                        {/* Badge de confianza */}
                                        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500">
                                            <svg className="w-4 h-4 text-[#ea899a]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Respuesta generada por IA entrenada en dermatología estética. Consulta presencial recomendada para evaluación final.</span>
                                        </div>
                                    </div>

                                    {/* Botón para ver tratamientos visuales */}
                                    {recommendedTreatments.length > 0 && (
                                        <button
                                            onClick={() => setShowTreatmentModal(true)}
                                            className="w-full mt-6 bg-gradient-to-r from-[#ea899a] to-[#d37989] text-white font-bold py-5 px-6 rounded-2xl text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] shadow-xl"
                                        >
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span>Ver Tratamientos Recomendados</span>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de selección de tratamientos - renderizado fuera del modal principal */}
            <TreatmentSelectionModal
                isOpen={showTreatmentModal}
                onClose={() => setShowTreatmentModal(false)}
                treatments={recommendedTreatments}
                userConcern={concern}
            />
        </>
    );
};

export default GeminiSkinAdvisor;