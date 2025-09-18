import React, { useState, useEffect } from 'react';

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

    // Captura los parámetros UTM y ttclid una sola vez cuando el componente se monta.
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setUtmData({
            utm_source: urlParams.get('utm_source') || 'N/A',
            utm_medium: urlParams.get('utm_medium') || 'N/A',
            utm_id: urlParams.get('utm_id') || 'N/A',
            utm_campaign: urlParams.get('utm_campaign') || 'N/A',
            ttclid: urlParams.get('ttclid') || 'N/A', // Nuevo parámetro añadido
        });
    }, []);

    // Inyecta el Píxel de TikTok una sola vez.
    useEffect(() => {
        const existingScript = document.getElementById('tiktok-pixel-script');
        if (existingScript) {
            return;
        }

        const script = document.createElement('script');
        script.id = 'tiktok-pixel-script';
        script.innerHTML = `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
            var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var s=document.createElement("script")
            ;s.type="text/javascript",s.async=!0,s.src=r+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(s,a)};

              ttq.load('D19VBFJC77UDOT6CAUF0');
              ttq.page();
            }(window, document, 'ttq');
        `;
        document.head.appendChild(script);

        return () => {
            const scriptToRemove = document.getElementById('tiktok-pixel-script');
            if (scriptToRemove) {
                document.head.removeChild(scriptToRemove);
            }
        };
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
            setIsSubmitting(true);
            const payload = {
                nombre: formData.nombre,
                whatsapp: `+51${formData.whatsapp}`,
                email: formData.email,
                ...utmData
            };

            try {
                const response = await fetch('https://hooks.zapier.com/hooks/catch/19613414/umgq635/', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    // TikTok Pixel Event: Registra la conversión
                    if (window.ttq) {
                        window.ttq.track('SubmitForm');
                    }

                    setModal({
                        show: true,
                        type: 'success',
                        title: '¡Felicidades, tu evaluación está reservada!',
                        message: 'Hemos recibido tus datos correctamente. En breve, una de nuestras especialistas se comunicará contigo por WhatsApp para coordinar los detalles.'
                    });
                    setFormData({ nombre: '', whatsapp: '', email: '' });
                    setErrors({});
                } else {
                    throw new Error('Server response was not ok.');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setModal({
                    show: true,
                    type: 'error',
                    title: '¡Ups! Algo salió mal',
                    message: 'No pudimos enviar tu información en este momento. Por favor, verifica tu conexión a internet e inténtalo de nuevo más tarde.'
                });
            } finally {
                setIsSubmitting(false);
            }
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
                        <button onClick={closeModal} className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${modal.type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}


            <header className="relative min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
                <img src="/images/bg.webp" alt="Modelo con piel rejuvenecida gracias a HIFU 12D" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="relative z-10 container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">Rejuvenece tu Piel, Redefine tu Contorno <span className="text-primary-light">Sin Cirugía</span></h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8">Descubre el poder de HIFU 12D: el lifting facial no invasivo que te devuelve la frescura y firmeza, con resultados visibles y naturales desde la primera sesión.</p>
                    </div>
                    <div id="hero-form-container" className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-main mb-2 text-center">¿Lista para el cambio?</h2>
                        <p className="text-custom-secondary text-center mb-6">Completa tus datos y obtén una evaluación GRATIS.</p>
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
                                {isSubmitting ? 'Enviando...' : '¡Quiero mi Evaluación Ahora!'}
                            </button>
                            <p className="text-xs text-gray-400 mt-4 text-center">
                                Al enviar, aceptas nuestra <a href="#" className="underline hover:text-primary">Política de Privacidad</a>.
                            </p>
                        </form>
                    </div>
                </div>
            </header>

            <main>
                <section className="py-16 md:py-24 bg-background-medium">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">¿Por qué elegir <span className="text-primary">HIFU 12D</span>?</h2>
                        <p className="max-w-3xl mx-auto text-custom-secondary text-lg mb-12">No es solo un tratamiento, es la solución segura y eficaz para verte como te sientes: joven, radiante y llena de vida.</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <h3 className="text-xl font-bold mb-2 text-main">Lifting Sin Bisturí</h3>
                                <p className="text-custom-secondary">Tensa y levanta la piel de rostro y cuello sin incisiones, agujas ni tiempo de recuperación.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <h3 className="text-xl font-bold mb-2 text-main">Resultados Naturales</h3>
                                <p className="text-custom-secondary">Estimula la producción de colágeno para un rejuvenecimiento progresivo que respeta tus facciones.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <h3 className="text-xl font-bold mb-2 text-main">Rápido y Cómodo</h3>
                                <p className="text-custom-secondary">Una sesión puede durar entre 30 y 90 minutos. Retoma tu rutina inmediatamente.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
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
                                    <p className="text-lg text-custom-secondary mb-6">"Tenía miedo de los procedimientos invasivos, pero no quería seguir viéndome cansada. El HIFU fue la respuesta perfecta. Me devolvió la firmeza en la mandíbula y me veo mucho más fresca. ¡Y nadie notó que me hice algo, solo que me veo mejor!"</p>
                                    <div>
                                        <p className="font-bold text-main">Laura G.</p>
                                        <p className="text-sm text-custom-secondary">48 años, Abogada</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                                <div className="bg-background-medium p-8 rounded-xl shadow-lg lg:order-first">
                                    <svg className="w-12 h-12 text-primary mb-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h1a2 2 0 002-2V4a2 2 0 00-2-2h-1zM3 5a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2H3zM16 5a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2h-1z"></path></svg>
                                    <p className="text-lg text-custom-secondary mb-6">"Estaba buscando una alternativa a la cirugía y el HIFU superó mis expectativas. Mi piel se siente más tersa y las líneas de expresión se han suavizado muchísimo. El resultado es súper natural, que era lo más importante para mí."</p>
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">No esperes más para ver la mejor versión de ti</h2>
                        <p className="max-w-2xl mx-auto text-primary-light text-lg mb-8">Una evaluación personalizada es el primer paso. Es gratuita, sin compromiso y resolverá todas tus dudas.</p>
                        <a href="#hero-form-container" className="inline-block bg-cta font-bold py-4 px-10 rounded-full transition-transform duration-300 transform hover:scale-105 bg-cta-hover">Solicita tu Evaluación GRATIS</a>
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
