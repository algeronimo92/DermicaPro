import React, { useState, useEffect } from 'react';
import { saveMetaUTM } from '../utils/metaPixelHelper';
import { saveTikTokUTM } from '../utils/tiktokPixelHelper';
import { trackPageViewConditional } from '../utils/trackingHelper';
import { handleFormSubmission, TRATAMIENTOS, LANDINGS } from '../services/webhookService';

// Este es el componente de React que contiene tu landing page.
function HifuLandingPage() {
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
        // Capturar parámetros de Meta Ads (Facebook/Instagram)
        saveMetaUTM();

        // Capturar parámetros de TikTok Ads
        const tiktokUTM = saveTikTokUTM();
        setUtmData(tiktokUTM);

        // Track PageView SOLO en el pixel correspondiente según la fuente
        trackPageViewConditional('HIFU 12D Landing Page', 'landing_page');

        // Scroll automático al formulario en móviles al cargar la página
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            setTimeout(() => {
                const heroFormContainer = document.getElementById('hero-form-container');
                if (heroFormContainer) {
                    heroFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // Focus en el primer input después del scroll
                    setTimeout(() => {
                        const firstInput = heroFormContainer.querySelector('input[name="nombre"]');
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }, 600);
                }
            }, 500); // Pequeño delay para que la página cargue completamente
        }
    }, []);

    // Lógica para el scroll suave - enfocado en formulario en móviles
    useEffect(() => {
        const scrollToFormButtons = document.querySelectorAll('a[href="#hero-form-container"]');
        const heroFormContainer = document.getElementById('hero-form-container');

        const handleScrollToForm = (e) => {
            e.preventDefault();
            if (heroFormContainer) {
                // En móvil (pantallas < 768px), hacer scroll al inicio del formulario
                // En desktop, mantener centrado
                const isMobile = window.innerWidth < 768;
                const scrollBehavior = isMobile ? 'start' : 'center';

                heroFormContainer.scrollIntoView({ behavior: 'smooth', block: scrollBehavior });

                // Animación de highlight
                heroFormContainer.classList.remove('form-highlight');
                void heroFormContainer.offsetWidth;
                heroFormContainer.classList.add('form-highlight');

                // En móvil, hacer focus en el primer input después del scroll
                if (isMobile) {
                    setTimeout(() => {
                        const firstInput = heroFormContainer.querySelector('input[name="nombre"]');
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }, 600); // Esperar a que termine la animación de scroll
                }
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
                tratamiento: TRATAMIENTOS.HIFU,
                landing: LANDINGS.HIFU,
                utmData,
                onSuccess: () => {
                    setModal({
                        show: true,
                        type: 'success',
                        title: '¡Felicidades, tu evaluación está reservada!',
                        message: 'Hemos recibido tus datos correctamente. Una especialista te escribirá pronto al WhatsApp. Mientras tanto, ¡te invitamos a ver más resultados increíbles en nuestro Instagram!'
                    });
                    setFormData({ nombre: '', whatsapp: '', email: '' });
                    setErrors({});
                },
                onError: (errorMessage) => {
                    setModal({
                        show: true,
                        type: 'error',
                        title: '¡Ups! Algo salió mal',
                        message: errorMessage || 'No pudimos enviar tu información en este momento. Por favor, verifica tu conexión a internet e inténtalo de nuevo más tarde.'
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
            --primary: #D9A184; --primary-light: #F5EBE0; --primary-dark: #B07B61;
            --secondary: #A9B4A2; --secondary-dark: #7E8A7A;
            --background-light: #FFFFFF; --background-medium: #FCF8F3;
            --text-main: #4E433F; --text-secondary: #8C7F79;
            --cta-emphasis: #C37D64; --cta-emphasis-hover: #B07B61;
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
        @keyframes form-glow { 0% { box-shadow: 0 0 0 0 rgba(217, 161, 132, 0.7); } 70% { box-shadow: 0 0 0 12px rgba(217, 161, 132, 0); } 100% { box-shadow: 0 0 0 0 rgba(217, 161, 132, 0); } }
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
                <img src="/images/bg.webp" alt="Modelo con piel rejuvenecida gracias a HIFU 12D" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <div className="relative z-10 container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">¿Notas Flacidez pero no Quieres Pasar por <span className="text-primary-light">Cirugía?</span></h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8">Entendemos tu miedo al bisturí. HIFU 12D redefine tu rostro de forma natural, recuperando la firmeza que creías perdida. Sin cirugía, sin agujas, sin tiempo de recuperación.</p>
                    </div>
                    <div id="hero-form-container" className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-main mb-2 text-center">Empieza tu transformación sin compromiso</h2>
                        <p className="text-custom-secondary text-center mb-6">Agenda tu evaluación gratuita. Te explicamos con honestidad si HIFU es para ti.</p>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-custom-secondary mb-1">Nombre completo</label>
                                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Maria Rosales" required minLength="2" className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${errors.nombre ? 'border-red-500' : (formData.nombre ? 'border-green-500' : 'border-gray-300')}`} />
                                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="whatsapp" className="block text-sm font-medium text-custom-secondary mb-1">WhatsApp</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">+51</span>
                                    <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} onBlur={handleBlur} placeholder="987 654 321" required className={`w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${errors.whatsapp ? 'border-red-500' : (formData.whatsapp ? 'border-green-500' : 'border-gray-300')}`} maxLength="9" />
                                </div>
                                {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
                            </div>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-custom-secondary mb-1">Correo Electrónico</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="ejemplo@correo.com" required className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${errors.email ? 'border-red-500' : (formData.email ? 'border-green-500' : 'border-gray-300')}`} />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <button type="submit" id="submit-button" disabled={isSubmitting} className="w-full bg-cta text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 form-submit-button bg-cta-hover">
                                {isSubmitting ? 'Enviando...' : 'Recibir orientación honesta (gratis)'}
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
                        <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">Por qué <span className="text-primary">HIFU 12D</span> funciona cuando otros métodos fallan</h2>
                        <p className="max-w-3xl mx-auto text-custom-secondary text-lg mb-12">Ya probaste cremas antiarrugas sin éxito. Este tratamiento actúa donde las cremas no pueden: en las capas profundas de tu piel, estimulando el colágeno real.</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex justify-center mb-4">
                                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                        <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-main">Lifting Sin Bisturí</h3>
                                <p className="text-custom-secondary">Tensa y levanta la piel de rostro y cuello sin incisiones, agujas ni tiempo de recuperación.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex justify-center mb-4">
                                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.5 9.5c.5-.5 1-1 1.5-1.5M15.5 14.5c-.5.5-1 1-1.5 1.5" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-main">Resultados Naturales</h3>
                                <p className="text-custom-secondary">Estimula la producción de colágeno para un rejuvenecimiento progresivo que respeta tus facciones.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex justify-center mb-4">
                                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-main">Rápido y Cómodo</h3>
                                <p className="text-custom-secondary">Una sesión puede durar entre 30 y 90 minutos. Retoma tu rutina inmediatamente.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex justify-center mb-4">
                                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6" opacity="0.5" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-main">Efecto Duradero</h3>
                                <p className="text-custom-secondary">Disfruta de una apariencia más joven y firme por hasta 1-2 años con una sola sesión.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-main">Resultados que inspiran confianza</h2>
                            <p className="max-w-2xl mx-auto text-custom-secondary text-lg mt-2">Nuestras clientas son nuestro mejor testimonio. Ve el cambio por ti misma.</p>
                        </div>
                        <div className="space-y-16">
                            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <img src="/images/hifu-1-before.png" alt="Rostro de mujer antes del tratamiento HIFU" className="rounded-lg shadow-md w-full h-full object-cover" />
                                        <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">ANTES</span>
                                    </div>
                                    <div className="relative">
                                    <img src="/images/hifu-1-after.png" alt="Rostro de la misma mujer después del tratamiento HIFU, con piel más firme" className="rounded-lg shadow-md w-full h-full object-cover" />
                                    <span className="absolute top-2 left-2 bg-primary bg-opacity-80 text-white text-sm px-2 py-1 rounded">DESPUÉS</span>
                                    </div>
                                </div>
                                <div className="bg-background-medium p-8 rounded-xl shadow-lg">
                                    <svg className="w-12 h-12 text-primary mb-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h1a2 2 0 002-2V4a2 2 0 00-2-2h-1zM3 5a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2H3zM16 5a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2h-1z"></path></svg>
                                    <p className="text-lg text-custom-secondary mb-6">"Tenía miedo de los procedimientos invasivos y ya había gastado en cremas que no funcionaron. Aquí me explicaron todo con paciencia, sin presiones. El HIFU me devolvió la firmeza en la mandíbula que había perdido. Lo mejor: nadie nota que me hice algo, solo que me veo más descansada."</p>
                                    <div>
                                        <p className="font-bold text-main">Laura G.</p>
                                        <p className="text-sm text-custom-secondary">48 años, Abogada</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                                <div className="bg-background-medium p-8 rounded-xl shadow-lg lg:order-first">
                                    <svg className="w-12 h-12 text-primary mb-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h1a2 2 0 002-2V4a2 2 0 00-2-2h-1zM3 5a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2H3zM16 5a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2h-1z"></path></svg>
                                    <p className="text-lg text-custom-secondary mb-6">"Buscaba una alternativa segura a la cirugía después de una mala experiencia en otro lugar. Aquí me dieron la confianza que necesitaba. El HIFU superó mis expectativas: mi piel está más tersa y las líneas se suavizaron. El resultado es natural, respeta mis facciones."</p>
                                    <div>
                                        <p className="font-bold text-main">Ana R.</p>
                                        <p className="text-sm text-custom-secondary">55 años, Diseñadora</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <img src="/images/hifu-2-before.png" alt="Otro rostro de mujer antes del tratamiento HIFU" className="rounded-lg shadow-md w-full h-full object-cover" />
                                        <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">ANTES</span>
                                    </div>
                                    <div className="relative">
                                    <img src="/images/hifu-2-after.png" alt="Otro rostro de la misma mujer después del tratamiento HIFU, con piel más firme" className="rounded-lg shadow-md w-full h-full object-cover" />
                                    <span className="absolute top-2 left-2 bg-primary bg-opacity-80 text-white text-sm px-2 py-1 rounded">DESPUÉS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-16 md:py-24 bg-background-medium">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-main">Tus Dudas, Resueltas</h2>
                            <p className="max-w-2xl mx-auto text-custom-secondary text-lg mt-2">Todo lo que necesitas saber antes de decidirte.</p>
                        </div>
                        <div className="space-y-4">
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿El tratamiento HIFU 12D duele?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">La mayoría de los pacientes describen una sensación de calor y ligeros pinchazos. Es tolerable y no requiere anestesia. Nos aseguramos de que tu experiencia sea lo más cómoda posible.</p>
                            </details>
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿Cuántas sesiones necesito para ver resultados?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">¡Los resultados son visibles desde la primera sesión! El efecto lifting mejora progresivamente durante los siguientes 2-3 meses. Generalmente, se recomienda una sesión al año o cada dos años para mantenimiento.</p>
                            </details>
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿Es seguro? ¿Quién realiza el tratamiento?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">Es un procedimiento extremadamente seguro, aprobado por entidades reguladoras. Todos nuestros tratamientos son realizados por profesionales certificados y con amplia experiencia, utilizando equipos de última generación.</p>
                            </details>
                        </div>
                    </div>
                </section>
                <section id="form-section" className="py-16 md:py-24 bg-primary text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Lista para recuperar la firmeza que perdiste?</h2>
                        <p className="max-w-2xl mx-auto text-primary-light text-lg mb-8">El primer paso es una evaluación honesta y sin compromiso. Te explicamos con claridad si HIFU es para ti, sin presiones de venta.</p>
                        <a href="#hero-form-container" className="inline-block bg-cta font-bold py-4 px-10 rounded-full transition-transform duration-300 transform hover:scale-105 bg-cta-hover">Agenda tu evaluación gratuita</a>
                    </div>
                </section>
            </main>
            
            <footer className="bg-gray-800 text-gray-400 py-8">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2025 Centro de Estética Avanzada. Todos los derechos reservados.</p>
                    <p className="text-sm mt-2">Av Larco 788, Trujillo Perú | +51 974637783</p>
                </div>
            </footer>
        </div>
    );
}

export default HifuLandingPage;
