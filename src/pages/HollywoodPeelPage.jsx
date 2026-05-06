import React, { useState, useEffect } from 'react';
import { trackPageViewConditional, captureAllUTM } from '../utils/trackingHelper';
import { handleFormSubmission, TRATAMIENTOS, LANDINGS } from '../services/webhookService';

// Hollywood Peel Landing Page
function HollywoodPeelPage() {
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

    // Captura los parámetros UTM para tracking
    useEffect(() => {
        // Capturar todos los parámetros UTM (TikTok + Meta + estándar)
        setUtmData(captureAllUTM());

        // Track PageView SOLO en el pixel correspondiente según la fuente
        trackPageViewConditional('Hollywood Peel Landing Page', 'landing_page');

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
                tratamiento: TRATAMIENTOS.HOLLYWOOD_PEEL,
                landing: LANDINGS.HOLLYWOOD_PEEL,
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
                        message: errorMessage
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
                                className="block w-full text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2"
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
                <img src="/images/bg.webp" alt="Modelo con piel iluminada gracias a Hollywood Peel" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <div className="relative z-10 container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">¿Tu Piel Luce Apagada y los Poros <span className="text-primary-light">Ya No Se Cierran?</span></h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8">Sabemos lo frustrante que es ver tu rostro sin brillo. Hollywood Peel es el tratamiento láser que ilumina, refina textura y cierra poros visiblemente. Sin dolor, sin tiempo de recuperación, con resultados inmediatos.</p>
                    </div>
                    <div id="hero-form-container" className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-main mb-2 text-center">Empieza tu transformación sin compromiso</h2>
                        <p className="text-custom-secondary text-center mb-6">Agenda tu evaluación gratuita. Te explicamos con honestidad si Hollywood Peel es para ti.</p>
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
                        <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">Por qué <span className="text-primary">Hollywood Peel</span> funciona cuando otros métodos fallan</h2>
                        <p className="max-w-3xl mx-auto text-custom-secondary text-lg mb-12">Ya probaste exfoliantes y sueros sin resultados reales. Este tratamiento láser actúa en las capas profundas para eliminar impurezas, cerrar poros y devolver el brillo natural que creías perdido.</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                {/* Icono: Iluminación/Brillo - Sparkles */}
                                <svg className="w-12 h-12 text-primary mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                </svg>
                                <h3 className="text-xl font-bold mb-2 text-main">Iluminación Instantánea</h3>
                                <p className="text-custom-secondary">Recupera el brillo natural de tu piel desde la primera sesión. Verte radiante sin maquillaje.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                {/* Icono: Poros Cerrados - Target/Focus */}
                                <svg className="w-12 h-12 text-primary mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                <h3 className="text-xl font-bold mb-2 text-main">Poros Visiblemente Cerrados</h3>
                                <p className="text-custom-secondary">Reduce el tamaño de poros dilatados para una textura refinada y uniforme que perdura.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                {/* Icono: Exfoliación - Refresh/Renew */}
                                <svg className="w-12 h-12 text-primary mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                <h3 className="text-xl font-bold mb-2 text-main">Exfoliación Profunda</h3>
                                <p className="text-custom-secondary">Elimina células muertas y puntos negros. Una sesión de 30-40 minutos, retomas tu rutina de inmediato.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                {/* Icono: Textura Suave - Check Shield */}
                                <svg className="w-12 h-12 text-primary mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                                <h3 className="text-xl font-bold mb-2 text-main">Textura Mejorada</h3>
                                <p className="text-custom-secondary">Suaviza líneas finas, cicatrices superficiales y marcas de acné para un rostro terso al tacto.</p>
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
                                        <img src="/images/hifu-1-before.png" alt="Rostro de mujer antes del tratamiento Hollywood Peel" className="rounded-lg shadow-md w-full h-full object-cover" />
                                        <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">ANTES</span>
                                    </div>
                                    <div className="relative">
                                    <img src="/images/hifu-1-after.png" alt="Rostro de la misma mujer después del tratamiento Hollywood Peel, con piel más iluminada y poros cerrados" className="rounded-lg shadow-md w-full h-full object-cover" />
                                    <span className="absolute top-2 left-2 bg-primary bg-opacity-80 text-white text-sm px-2 py-1 rounded">DESPUÉS</span>
                                    </div>
                                </div>
                                <div className="bg-background-medium p-8 rounded-xl shadow-lg">
                                    <svg className="w-12 h-12 text-primary mb-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h1a2 2 0 002-2V4a2 2 0 00-2-2h-1zM3 5a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2H3zM16 5a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2h-1z"></path></svg>
                                    <p className="text-lg text-custom-secondary mb-6">"Mi piel lucía opaca y los poros de mi nariz se notaban mucho, probé mil productos sin resultados. Aquí me explicaron todo con paciencia, sin presiones. Hollywood Peel me devolvió la luminosidad que había perdido y mis poros se cerraron increíblemente. Lo mejor: mi rostro luce natural, solo más radiante."</p>
                                    <div>
                                        <p className="font-bold text-main">Carla M.</p>
                                        <p className="text-sm text-custom-secondary">35 años, Ejecutiva de Marketing</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                                <div className="bg-background-medium p-8 rounded-xl shadow-lg lg:order-first">
                                    <svg className="w-12 h-12 text-primary mb-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h1a2 2 0 002-2V4a2 2 0 00-2-2h-1zM3 5a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2H3zM16 5a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2h-1z"></path></svg>
                                    <p className="text-lg text-custom-secondary mb-6">"Tenía una textura irregular por cicatrices de acné y puntos negros que no se iban con nada. Aquí me dieron la confianza que necesitaba sin venderme tratamientos innecesarios. Hollywood Peel superó mis expectativas: mi piel está tersa al tacto, los poros se cerraron y recuperé ese glow que no tenía hace años."</p>
                                    <div>
                                        <p className="font-bold text-main">Valeria S.</p>
                                        <p className="text-sm text-custom-secondary">42 años, Arquitecta</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <img src="/images/hifu-2-before.png" alt="Otro rostro de mujer antes del tratamiento Hollywood Peel" className="rounded-lg shadow-md w-full h-full object-cover" />
                                        <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">ANTES</span>
                                    </div>
                                    <div className="relative">
                                    <img src="/images/hifu-2-after.png" alt="Otro rostro de la misma mujer después del tratamiento Hollywood Peel, con piel más iluminada y textura mejorada" className="rounded-lg shadow-md w-full h-full object-cover" />
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
                                    ¿El tratamiento Hollywood Peel duele?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">No, es completamente indoloro. Solo sentirás una ligera sensación de calor reconfortante durante el tratamiento láser. No requiere anestesia ni recuperación. Nos aseguramos de que tu experiencia sea relajante y cómoda.</p>
                            </details>
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿Cuántas sesiones necesito para ver resultados?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">¡Notarás tu piel más luminosa desde la primera sesión! Para resultados óptimos de cierre de poros y textura refinada, recomendamos 3-4 sesiones mensuales. Luego, 1 sesión de mantenimiento cada 2-3 meses.</p>
                            </details>
                            <details className="group bg-white p-6 rounded-lg shadow-sm">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-main">
                                    ¿Es seguro? ¿Quién realiza el tratamiento?
                                    <svg className="w-5 h-5 text-primary transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="text-custom-secondary mt-4">Es un procedimiento extremadamente seguro, aprobado dermatológicamente y usado por celebridades. Todos nuestros tratamientos son realizados por profesionales certificados y con amplia experiencia, utilizando equipos láser de última generación.</p>
                            </details>
                        </div>
                    </div>
                </section>
                <section id="form-section" className="py-16 md:py-24 bg-primary text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Lista para recuperar la luminosidad que perdiste?</h2>
                        <p className="max-w-2xl mx-auto text-primary-light text-lg mb-8">El primer paso es una evaluación honesta y sin compromiso. Te explicamos con claridad si Hollywood Peel es para ti, sin presiones de venta.</p>
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

export default HollywoodPeelPage;
