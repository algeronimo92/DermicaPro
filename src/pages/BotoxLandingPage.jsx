import React, { useState, useEffect } from 'react';
import { trackViewContent, saveMetaUTM } from '../utils/metaPixelHelper';
import { trackViewContent as trackTikTokViewContent, saveTikTokUTM } from '../utils/tiktokPixelHelper';
import { handleFormSubmission, TRATAMIENTOS } from '../services/webhookService';

// Este es el componente de React que contiene tu landing page de Botox.
function BotoxLandingPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        whatsapp: '',
        email: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [utmData, setUtmData] = useState({});
    const [modal, setModal] = useState({
        show: false,
        type: '', // 'success' or 'error'
        title: '',
        message: '',
    });

    // Captura los parámetros de TikTok Ads y Meta Ads para tracking
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        // Función de sanitización para prevenir XSS
        const sanitizeParam = (value) => {
            if (!value || value === 'N/A') return 'N/A';
            // Eliminar caracteres peligrosos y limitar longitud
            return value
                .replace(/[<>"'`]/g, '') // Eliminar chars XSS
                .substring(0, 100); // Limitar longitud máxima
        };

        // Capturar parámetros de TikTok
        setUtmData({
            ttclid: sanitizeParam(urlParams.get('ttclid')),
            tt_medium: sanitizeParam(urlParams.get('tt_medium')),
            tt_campaign_id: sanitizeParam(urlParams.get('tt_campaign_id')),
            tt_adgroup_id: sanitizeParam(urlParams.get('tt_adgroup_id')),
            tt_ad_id: sanitizeParam(urlParams.get('tt_ad_id')),
        });

        // Capturar parámetros de Meta Ads (Facebook/Instagram)
        saveMetaUTM();

        // Capturar parámetros de TikTok Ads
        saveTikTokUTM();

        // Track ViewContent en Meta Pixel al cargar la landing
        trackViewContent('Botox Landing Page', 'landing_page');

        // Track ViewContent en TikTok Pixel al cargar la landing
        trackTikTokViewContent('Botox Landing Page', 'landing_page');
    }, []);

    // Lógica para el scroll suave
    useEffect(() => {
        const scrollToFormButtons = document.querySelectorAll('a[href="#hero-form-container"]');
        const heroFormContainer = document.getElementById('hero-form-container');

        const handleScrollToForm = (e) => {
            e.preventDefault();
            if (heroFormContainer) {
                heroFormContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                heroFormContainer.classList.remove('form-highlight');
                void heroFormContainer.offsetWidth;
                heroFormContainer.classList.add('form-highlight');
            }
        };

        scrollToFormButtons.forEach(button => {
            button.addEventListener('click', handleScrollToForm);
        });

        return () => {
            scrollToFormButtons.forEach(button => {
                button.removeEventListener('click', handleScrollToForm);
            });
        };
    }, []);


    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'nombre':
                if (value.trim().length < 2) error = 'El nombre debe tener al menos 2 caracteres.';
                break;
            case 'whatsapp':
                if (!/^[0-9]{9}$/.test(value.trim())) error = 'Ingresa un número de 9 dígitos.';
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) error = 'Ingresa un correo electrónico válido.';
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'nombre') {
            processedValue = value.toLowerCase().replace(/(^|\s)\S/g, char => char.toUpperCase());
        } else if (name === 'whatsapp') {
            processedValue = value.replace(/[^0-9]/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));

        if (errors[name]) {
           const fieldError = validateField(name, processedValue);
           setErrors(prev => ({ ...prev, [name]: fieldError }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const fieldError = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: fieldError }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = Object.keys(formData).reduce((acc, key) => {
            const error = validateField(key, formData[key]);
            if (error) acc[key] = error;
            return acc;
        }, {});

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            await handleFormSubmission({
                formData,
                tratamiento: TRATAMIENTOS.BOTOX,
                utmData,
                onSuccess: () => {
                    setModal({
                        show: true,
                        type: 'success',
                        title: '¡Listo! Tu espacio está reservado',
                        message: 'Nuestra especialista te escribirá pronto al WhatsApp para coordinar tu evaluación. Mientras tanto, descubre más transformaciones reales en nuestro Instagram. ¡Nos vemos pronto!'
                    });
                    setFormData({ nombre: '', whatsapp: '', email: '' });
                    setErrors({});
                },
                onError: (errorMessage) => {
                    setModal({
                        show: true,
                        type: 'error',
                        title: 'Algo no funcionó como esperábamos',
                        message: errorMessage || 'No pudimos procesar tu solicitud ahora mismo. Por favor, verifica tu conexión a internet e intenta nuevamente.'
                    });
                },
                setIsSubmitting
            });
        }
    };

    const closeModal = () => {
        setModal({ show: false, type: '', title: '', message: '' });
    };

    const customCss = `
        :root {
            --primary: #ea899a; --primary-light: #fde2e4; --primary-dark: #d47286;
            --secondary: #A9B4A2; --secondary-dark: #7E8A7A;
            --background-light: #FFFFFF; --background-medium: #FCF8F3;
            --text-main: #4E433F; --text-secondary: #8C7F79;
            --cta-emphasis: #ea899a; --cta-emphasis-hover: #d47286;
        }
        .bg-primary { background-color: var(--primary); } .bg-secondary { background-color: var(--secondary); }
        .bg-cta { background-color: var(--cta-emphasis); } .bg-cta-hover:hover { background-color: var(--cta-emphasis-hover); }
        .bg-background-medium { background-color: var(--background-medium); }
        .text-primary { color: var(--primary); } .text-primary-light { color: var(--primary-light); }
        .text-secondary { color: var(--secondary); } .text-main { color: var(--text-main); }
        .text-custom-secondary { color: var(--text-secondary); } .text-cta { color: var(--cta-emphasis); }
        .border-primary { border-color: var(--primary); } .border-secondary { border-color: var(--secondary); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        .fade-in-up { opacity: 0; transform: translateY(20px); animation: fadeInUp 0.8s forwards; animation-delay: 0.2s; }
        @keyframes form-glow { 0% { box-shadow: 0 0 0 0 rgba(234, 137, 154, 0.7); } 70% { box-shadow: 0 0 0 12px rgba(234, 137, 154, 0); } 100% { box-shadow: 0 0 0 0 rgba(234, 137, 154, 0); } }
        .form-highlight { animation: form-glow 1.5s ease-out; }
        #submit-button:disabled { background-color: var(--primary-dark); cursor: not-allowed; }
        .modal-enter { opacity: 0; }
        .modal-enter-active { opacity: 1; transition: opacity 300ms; }
        .modal-exit { opacity: 1; }
        .modal-exit-active { opacity: 0; transition: opacity 300ms; }
        .modal-content-enter { transform: scale(0.9) translateY(20px); }
        .modal-content-enter-active { transform: scale(1) translateY(0); transition: transform 300ms; }
    `;

    return (
        <div className="antialiased">
            <style>{customCss}</style>

            {/* Modal de Notificación */}
            {modal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 modal-enter modal-enter-active" onClick={closeModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center modal-content-enter modal-content-enter-active" onClick={e => e.stopPropagation()}>
                        {modal.type === 'success' ? (
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                        ) : (
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                                <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-main mt-5">{modal.title}</h3>
                        <p className="text-custom-secondary mt-2 mb-6">{modal.message}</p>

                        {/* Botones del Modal Condicionales */}
                        {modal.type === 'success' ? (
                            <a
                                href="https://www.instagram.com/dermicapro/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 bg-pink-500 hover:bg-pink-600 flex items-center justify-center gap-2"
                                onClick={closeModal}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.416 2.065c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.825-.058.975-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.825-.045-.975-.207-1.504-.344-1.857-.182-.466-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                                Visitar Instagram
                            </a>
                        ) : (
                            <button onClick={closeModal} className="w-full text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 bg-red-500 hover:bg-red-600">
                                Entendido
                            </button>
                        )}
                    </div>
                </div>
            )}


            <header className="relative min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
                <img src="/images/landing-botox-1.webp" alt="Mujer sonriente con piel radiante después de tratamiento Botox" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="relative z-10 container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">Esas Arrugas No Reflejan <span className="text-primary-light">Cómo Te Sientes por Dentro</span></h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8">Sabemos que es agotador verte "cansada" o "preocupada" cuando por dentro te sientes llena de energía. El Botox suaviza las líneas de expresión de forma natural, sin cirugía y sin congelar tu rostro. Recupera la frescura que mereces, en solo 3 a 7 días.</p>
                    </div>
                    <div id="hero-form-container" className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-main mb-2 text-center">Tu rostro fresco está a un paso</h2>
                        <p className="text-custom-secondary text-center mb-6">Evaluación gratuita y sin presión. Solo te explicamos con honestidad si el Botox es lo que realmente necesitas.</p>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-custom-secondary mb-1">¿Cómo te llamas?</label>
                                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} placeholder="Escribe tu nombre aquí" required minLength="2" className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${errors.nombre ? 'border-red-500' : (formData.nombre ? 'border-green-500' : 'border-gray-300')}`} />
                                {errors.nombre && <p className="text-red-500 text-xs mt-1">Por favor, escribe tu nombre completo (mínimo 2 caracteres)</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="whatsapp" className="block text-sm font-medium text-custom-secondary mb-1">Tu WhatsApp (para confirmarte la cita)</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">+51</span>
                                    <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} onBlur={handleBlur} placeholder="987 654 321" required className={`w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${errors.whatsapp ? 'border-red-500' : (formData.whatsapp ? 'border-green-500' : 'border-gray-300')}`} maxLength="9" />
                                </div>
                                {errors.whatsapp && <p className="text-red-500 text-xs mt-1">Necesitamos un número de 9 dígitos para contactarte</p>}
                            </div>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-custom-secondary mb-1">Tu correo electrónico</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="tu@correo.com" required className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${errors.email ? 'border-red-500' : (formData.email ? 'border-green-500' : 'border-gray-300')}`} />
                                {errors.email && <p className="text-red-500 text-xs mt-1">Por favor, verifica que tu correo sea válido</p>}
                            </div>
                            <button type="submit" id="submit-button" disabled={isSubmitting} className="w-full bg-cta text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 form-submit-button bg-cta-hover">
                                {isSubmitting ? 'Reservando tu espacio...' : 'Sí, quiero mi evaluación gratuita'}
                            </button>
                            <p className="text-xs text-gray-400 mt-4 text-center">
                                Al enviar, aceptas nuestra <a href="/politica-privacidad" className="underline hover:text-primary">Política de Privacidad</a>.
                            </p>
                        </form>
                    </div>
                </div>
            </header>

            <main>
                <section className="py-16 md:py-24 bg-background-medium">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">Por qué confiar en <span className="text-primary">DermicaPro</span> para tu Botox</h2>
                        <p className="max-w-3xl mx-auto text-custom-secondary text-lg mb-12">No vendemos milagros, ofrecemos resultados honestos. Llevamos años ayudando a mujeres como tú a recuperar su expresión más fresca, sin congelar su rostro ni sus emociones.</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="text-4xl mb-4">✨</div>
                                <h3 className="text-xl font-bold mb-2 text-main">Cambios que Notas (y que notan)</h3>
                                <p className="text-custom-secondary">Suavizamos frente, entrecejo y patas de gallo. Verás los primeros cambios en 3 a 7 días. Tu rostro, solo que más descansado.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="text-4xl mb-4">⏱️</div>
                                <h3 className="text-xl font-bold mb-2 text-main">En tu Hora de Almuerzo</h3>
                                <p className="text-custom-secondary">El procedimiento toma solo 15-20 minutos. Sin dolor real, sin reposo. Sales y sigues con tu día como si nada.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="text-4xl mb-4">🎯</div>
                                <h3 className="text-xl font-bold mb-2 text-main">Natural, No Congelado</h3>
                                <p className="text-custom-secondary">Sigues siendo tú: ríes, frunces, te expresas. Simplemente sin las líneas marcadas que no te gustan.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="text-4xl mb-4">🛡️</div>
                                <h3 className="text-xl font-bold mb-2 text-main">Seguridad Comprobada</h3>
                                <p className="text-custom-secondary">Más de 30 años de estudios FDA. Millones de mujeres lo eligen cada año. Nosotros solo usamos productos certificados y originales.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-main">Lo que realmente cambia en tu vida</h2>
                            <p className="max-w-2xl mx-auto text-custom-secondary text-lg mt-2">Sí, eliminas arrugas. Pero lo más importante: recuperas la confianza de verte como te sientes por dentro.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <div className="flex gap-4 items-start bg-background-medium p-6 rounded-xl">
                                <div className="text-3xl text-primary flex-shrink-0">💆‍♀️</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-main">Adiós a las Líneas Marcadas</h3>
                                    <p className="text-custom-secondary">Frente, entrecejo, patas de gallo: suavizamos lo que te molesta. No desaparecen mágicamente, pero sí se ven notablemente más suaves.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start bg-background-medium p-6 rounded-xl">
                                <div className="text-3xl text-primary flex-shrink-0">🌟</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-main">Frenas las Nuevas Arrugas</h3>
                                    <p className="text-custom-secondary">Al relajar los músculos, evitas que se marquen líneas más profundas. Es invertir en tu piel del futuro.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start bg-background-medium p-6 rounded-xl">
                                <div className="text-3xl text-primary flex-shrink-0">😌</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-main">Tu Mirada se Ve Descansada</h3>
                                    <p className="text-custom-secondary">Ya no luces "enojada" o "preocupada" cuando estás relajada. La gente nota que te ves más fresca, sin poder explicar exactamente qué cambió.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start bg-background-medium p-6 rounded-xl">
                                <div className="text-3xl text-primary flex-shrink-0">⏳</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-main">Resultados de 4 a 6 Meses</h3>
                                    <p className="text-custom-secondary">Cada sesión dura entre 4 y 6 meses. Con el tiempo, al reeducar el músculo, los intervalos pueden alargarse.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start bg-background-medium p-6 rounded-xl">
                                <div className="text-3xl text-primary flex-shrink-0">🚫</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-main">Cero Bisturí, Cero Drama</h3>
                                    <p className="text-custom-secondary">Solo microinyecciones de 15 minutos. Nada de cirugía, anestesia general ni semanas de reposo. Llegas, te lo hacemos, te vas.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start bg-background-medium p-6 rounded-xl">
                                <div className="text-3xl text-primary flex-shrink-0">💪</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-main">Tu Confianza se Nota</h3>
                                    <p className="text-custom-secondary">Cuando tu reflejo coincide con cómo te sientes, todo cambia: las fotos, el espejo, incluso cómo te paras frente a los demás.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-main">Cómo es tu visita paso a paso</h2>
                            <p className="max-w-2xl mx-auto text-custom-secondary text-lg mt-2">Un proceso transparente, sin sorpresas. Así es como cuidamos de ti en cada sesión.</p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                                <h3 className="text-lg font-bold mb-2 text-main">Conversamos con Honestidad</h3>
                                <p className="text-custom-secondary">Analizamos tu rostro juntas y te decimos con claridad qué áreas podemos mejorar. Sin compromiso, sin presión para comprar.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                                <h3 className="text-lg font-bold mb-2 text-main">Marcamos con Precisión</h3>
                                <p className="text-custom-secondary">Identificamos los puntos exactos donde aplicaremos. Cada rostro es diferente, tu tratamiento también lo será.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                                <h3 className="text-lg font-bold mb-2 text-main">Aplicamos con Cuidado</h3>
                                <p className="text-custom-secondary">Microinyecciones con agujas ultrafinas. Solo sientes un pequeño pinchazo. Todo el proceso: 15-20 minutos.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                                <h3 className="text-lg font-bold mb-2 text-main">Notas el Cambio Gradual</h3>
                                <p className="text-custom-secondary">Los primeros resultados aparecen en 3 a 7 días. Efecto completo a las 2 semanas. Dura de 4 a 6 meses.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-background-medium">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">Transformaciones Reales de Mujeres como Tú</h2>
                            <p className="max-w-2xl mx-auto text-custom-secondary text-lg">Sin filtros, sin photoshop. Así lucen nuestras pacientes después de su tratamiento Botox.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* Testimonio 1 */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                {/* Imágenes Antes/Después */}
                                <div className="grid grid-cols-2 gap-0">
                                    <div className="relative">
                                        <img
                                            src="/images/landing-botox-before-1.webp"
                                            alt="Mujer antes del tratamiento Botox"
                                            className="w-full h-80 object-cover object-top"
                                        />
                                        <div className="absolute top-3 left-3 bg-gray-800 bg-opacity-90 text-white text-xs font-semibold px-3 py-1 rounded">
                                            ANTES
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <img
                                            src="/images/landing-botox-after-1.webp"
                                            alt="Mujer después del tratamiento Botox"
                                            className="w-full h-80 object-cover object-top"
                                        />
                                        <div className="absolute top-3 right-3 bg-primary bg-opacity-95 text-white text-xs font-semibold px-3 py-1 rounded">
                                            DESPUÉS
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido del testimonio */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <p className="text-main font-bold text-lg mb-1">Carmen, 42 años</p>
                                        <p className="text-sm text-primary font-medium">Tratamiento: Arrugas de frente</p>
                                    </div>
                                    <p className="text-gray-600 text-base leading-relaxed italic">
                                        "Las arrugas de mi frente me hacían ver siempre seria. Ahora sonrío y mi rostro realmente refleja cómo me siento."
                                    </p>
                                </div>
                            </div>

                            {/* Testimonio 2 */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                {/* Imágenes Antes/Después */}
                                <div className="grid grid-cols-2 gap-0">
                                    <div className="relative">
                                        <img
                                            src="/images/landing-botox-before-2.webp"
                                            alt="Paciente antes del tratamiento Botox"
                                            className="w-full h-80 object-cover object-top"
                                        />
                                        <div className="absolute top-3 left-3 bg-gray-800 bg-opacity-90 text-white text-xs font-semibold px-3 py-1 rounded">
                                            ANTES
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <img
                                            src="/images/landing-botox-after-2.webp"
                                            alt="Paciente después del tratamiento Botox"
                                            className="w-full h-80 object-cover object-top"
                                        />
                                        <div className="absolute top-3 right-3 bg-primary bg-opacity-95 text-white text-xs font-semibold px-3 py-1 rounded">
                                            DESPUÉS
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido del testimonio */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <p className="text-main font-bold text-lg mb-1">Lucía, 38 años</p>
                                        <p className="text-sm text-primary font-medium">Tratamiento: Entrecejo y patas de gallo</p>
                                    </div>
                                    <p className="text-gray-600 text-base leading-relaxed italic">
                                        "Tenía miedo de quedar 'congelada', pero puedo gesticular perfectamente. Simplemente sin las líneas que tanto me molestaban."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-white rounded-xl border border-pink-100">
                                    <p className="text-5xl font-extrabold text-primary mb-3">500+</p>
                                    <p className="text-base font-semibold text-gray-700">Pacientes satisfechas</p>
                                </div>

                                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-white rounded-xl border border-pink-100">
                                    <p className="text-5xl font-extrabold text-primary mb-3">98%</p>
                                    <p className="text-base font-semibold text-gray-700">Tasa de satisfacción</p>
                                </div>

                                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-white rounded-xl border border-pink-100">
                                    <p className="text-5xl font-extrabold text-primary mb-3">5+</p>
                                    <p className="text-base font-semibold text-gray-700">Años de experiencia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-background-medium">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-main">Las Dudas que Todas Tenemos</h2>
                            <p className="max-w-2xl mx-auto text-custom-secondary text-lg mt-2">Estas son las preguntas más frecuentes de nuestras pacientes. Aquí las respondemos con total honestidad.</p>
                        </div>
                        <div className="space-y-4">
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿El Botox duele?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">La verdad honesta: casi nada. Usamos agujas ultrafinas y la mayoría de nuestras pacientes solo sienten un pequeño pinchazo rápido. Si eres muy sensible, podemos aplicar crema anestésica antes. Muchas dicen que la depilación de cejas duele más.</p>
                            </details>
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿Voy a quedar con cara congelada o sin expresión?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">Este es el miedo número uno, y te entendemos perfectamente. Pero no: cuando lo aplicamos correctamente, eliminas las arrugas pero sigues siendo tú. Puedes sonreír, enojarte, sorprenderte... solo que sin las líneas marcadas. Si has visto "caras congeladas", fue por exceso de producto o mala técnica. En DermicaPro aplicamos cantidades conservadoras y naturales.</p>
                            </details>
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿Cuánto duran los resultados?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">Entre 4 y 6 meses en promedio. El efecto no desaparece de golpe; se va diluyendo gradualmente. Con sesiones regulares (2 a 3 veces al año), tu músculo se "reeducará" y los intervalos pueden alargarse. Es una inversión de mantenimiento, no un compromiso de por vida.</p>
                            </details>
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿A qué edad puedo empezar con Botox?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">Desde los 25 años puedes usarlo de forma preventiva (evitar que se marquen arrugas profundas). Desde los 30-35 es ideal para tratamiento activo. Pero cada rostro es diferente. En tu evaluación gratuita analizamos si es el momento adecuado para TI, sin importar tu edad.</p>
                            </details>
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿Hay tiempo de recuperación?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">Cero. Puedes regresar al trabajo, a tus actividades, incluso salir a almorzar inmediatamente. Solo te pedimos evitar acostarte o hacer ejercicio intenso las primeras 4 horas para que el producto se asiente correctamente en la zona aplicada. Es literalmente un tratamiento en tu hora de almuerzo.</p>
                            </details>
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿Es seguro el Botox?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">Completamente. Es el tratamiento estético más estudiado del mundo, con más de 30 años de investigación y aprobación FDA. Millones de personas lo usan cada año sin problemas. En DermicaPro solo trabajamos con productos 100% originales y certificados. Tu seguridad es innegociable para nosotros.</p>
                            </details>
                        </div>
                    </div>
                </section>

                <section id="form-section" className="py-16 md:py-24 bg-primary text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tu Rostro Fresco Te Está Esperando</h2>
                        <p className="max-w-2xl mx-auto text-gray-100 text-lg mb-8">Ya sabes que el Botox funciona. Ya viste las transformaciones. Ahora solo falta que tú des el primer paso. Agenda tu evaluación gratuita y descubre exactamente qué podemos hacer por ti.</p>
                        <a href="#hero-form-container" className="inline-block bg-white text-primary font-bold py-4 px-10 rounded-full transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl">Quiero mi evaluación gratuita</a>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 text-gray-400 py-8">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2025 DermicaPro - Centro de Estética Avanzada. Todos los derechos reservados.</p>
                    <p className="text-sm mt-2">Av. Larco 877, Trujillo, Perú | WhatsApp: +51 974 637 783</p>
                    <div className="flex justify-center gap-6 mt-4">
                        <a href="https://www.instagram.com/dermicapro/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
                        <a href="https://www.facebook.com/profile.php?id=61570893266230" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Facebook</a>
                        <a href="https://wa.me/51974637783" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default BotoxLandingPage;
