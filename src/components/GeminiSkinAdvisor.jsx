// =================================================================================
// FILE: src/components/GeminiSkinAdvisor.jsx
// =================================================================================
import React, { useState, useEffect, useRef } from 'react';
import  SparklesIcon  from './icons/SparklesIcon'; // Ejemplo de cómo importarías el ícono
const GeminiSkinAdvisor = ({ isOpen, onClose }) => {
    const [concern, setConcern] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const modalRef = useRef();

    useEffect(() => {
        if (!isOpen) { setConcern(''); setRecommendation(''); setError(''); setLoading(false); }
    }, [isOpen]);

    const handleGetRecommendation = async () => {
        if (!concern.trim()) { setError('Por favor, describe tu preocupación para poder ayudarte.'); return; }
        setLoading(true); setError(''); setRecommendation('');

        const servicesList = ["Borrado de Micropigmentación", "Borrado de Tatuajes", "Reduccion de papada", "Hollywood Peel", "Hifu 12D", "Enzimas Recombinantes", "Micropigmentación de Cejas y Labios", "Reducción de Papada con HIFU", "Reducción de Papada con enzimas reconvinantes", "Reducción de Grasa Localizada"].join(', ');

        const prompt = `Tu rol: Eres un asesor de piel para DermicaPro, un centro de estética de alta confianza.
        Tu personalidad: Amable, directa, profesional, sincera, elegante y muy empática.
        Tu tono: Cálido, directo, educativo e inspirador, usando un lenguaje simple.
        Tu misión: Hacer que el cliente se sienta comprendido, seguro y esperanzado.

        Instrucciones:
        1.  Inicia SIEMPRE tu respuesta validando la emoción del cliente con una frase empática. Ej: "Entiendo perfectamente lo frustrante que debe ser lidiar con...", "Es completamente normal sentirse así, pero la buena noticia es que existen soluciones reales."
        2.  Basado en la preocupación del cliente, recomienda un MÁXIMO de 2 tratamientos de la lista.
        3.  Para cada recomendación, explica en un párrafo claro por qué es la mejor opción, enfocándote en el resultado emocional y práctico (ej. "recuperar la seguridad", "sentirte cómoda sin maquillaje", "eliminar esa marca que ya no te representa").
        4.  NO uses jerga técnica complicada. Traduce la tecnología en beneficios claros.
        5.  NO recomiendes NADA que no esté en la lista.
        6.  Formatea la respuesta con títulos en negrita para cada tratamiento.
        
        Lista de tratamientos disponibles: ${servicesList}
        Preocupación del cliente: "${concern}"`;

        try {
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            const apiKey = "AIzaSyDdzwLk6Ejza4NPZgfKCCiir040HAegqeM";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { throw new Error(`API error: ${response.statusText}`); }
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setRecommendation(result.candidates[0].content.parts[0].text);
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div ref={modalRef} className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center"><SparklesIcon className="w-6 h-6 mr-2 text-[#ea899a]" />Asesor de Piel Virtual</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                <p className="text-gray-600 mb-6">Cuéntanos con confianza qué te preocupa de tu piel. Estamos aquí para escucharte y orientarte sin compromiso.</p>
                <textarea value={concern} onChange={(e) => setConcern(e.target.value)} className="w-full h-28 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ea899a] focus:border-transparent transition" placeholder="Ej: Me siento frustrada con las manchas que no se quitan con nada, y la flacidez en mi papada me hace sentir mayor..." disabled={loading} />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button onClick={handleGetRecommendation} disabled={loading} className="w-full mt-4 bg-[#ea899a] text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-[#d37989] transition-all flex items-center justify-center disabled:bg-gray-400">
                    {loading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analizando...</>) : ("Recibir orientación honesta")}
                </button>
                {recommendation && ( <div className="mt-6 pt-6 border-t border-gray-200"> <h3 className="text-xl font-semibold text-gray-800 mb-3">Una primera orientación para ti:</h3> <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">{recommendation}</div> </div> )}
            </div>
        </div>
    );
};

export default GeminiSkinAdvisor;