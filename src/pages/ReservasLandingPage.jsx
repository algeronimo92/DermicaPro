import React, { useState, useEffect } from 'react';
import { trackViewContent, trackLead, saveMetaUTM } from '../utils/metaPixelHelper';

// Landing Page NEUTRA para evitar restricciones de Meta
// Sin palabras médicas, sin tratamientos, sin antes/después
function ReservasLandingPage() {
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
        type: '',
        title: '',
        message: '',
    });

    // Captura UTM parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        const sanitizeParam = (value) => {
            if (!value || value === 'N/A') return 'N/A';
            return value
                .replace(/[<>"'`]/g, '')
                .substring(0, 100);
        };

        setUtmData({
            // Meta Ads parameters
            fbclid: sanitizeParam(urlParams.get('fbclid')),
            utm_source: sanitizeParam(urlParams.get('utm_source')),
            utm_medium: sanitizeParam(urlParams.get('utm_medium')),
            utm_campaign: sanitizeParam(urlParams.get('utm_campaign')),
            utm_content: sanitizeParam(urlParams.get('utm_content')),
            utm_term: sanitizeParam(urlParams.get('utm_term')),

            // TikTok parameters
            ttclid: sanitizeParam(urlParams.get('ttclid')),
            tt_campaign_id: sanitizeParam(urlParams.get('tt_campaign_id')),
        });

        saveMetaUTM();
        trackViewContent('Reservas Landing Page', 'landing_page');
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'nombre':
                if (value.trim().length < 2) error = 'Ingresa tu nombre completo';
                break;
            case 'whatsapp':
                if (!/^[0-9]{9}$/.test(value.trim())) error = 'Número de 9 dígitos';
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) error = 'Email válido requerido';
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
                tratamiento: 'Consulta General',
                landing: 'reservas',
                ...utmData
            };

            // Webhook único para todas las landings
            const webhookUrl = 'https://dermica-pro-n8n.rcsgeg.easypanel.host/webhook/landing';

            console.log(`🔗 Enviando a webhook:`, webhookUrl);

            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    // Meta Pixel Lead Event
                    trackLead({
                        contentName: 'Reserva Evaluación',
                        contentCategory: 'Lead Generation',
                        value: 50,
                        currency: 'PEN'
                    });

                    setModal({
                        show: true,
                        type: 'success',
                        title: '¡Reserva Confirmada!',
                        message: 'Te contactaremos pronto al WhatsApp. Revisa tu bandeja de spam si no ves nuestro correo.'
                    });
                    setFormData({ nombre: '', whatsapp: '', email: '' });
                    setErrors({});
                } else {
                    throw new Error('Error en servidor');
                }
            } catch (error) {
                console.error('Error:', error);
                setModal({
                    show: true,
                    type: 'error',
                    title: 'Error al Enviar',
                    message: 'Por favor, intenta nuevamente o contáctanos directamente al WhatsApp.'
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
            --primary: #ea899a; --primary-dark: #d77386;
            --secondary: #ffc1cc;
            --bg-light: #fff5f7; --bg-white: #ffffff;
            --text-main: #1f2937; --text-secondary: #6b7280;
        }
        .bg-primary { background-color: var(--primary); }
        .bg-primary-dark { background-color: var(--primary-dark); }
        .text-primary { color: var(--primary); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        .fade-in-up { opacity: 0; transform: translateY(20px); animation: fadeInUp 0.8s forwards; }
        .gradient-bg { background: linear-gradient(135deg, #ea899a 0%, #d77386 100%); }
    `;

    return (
        <div className="antialiased bg-gray-50">
            <style>{customCss}</style>

            {/* Modal */}
            {modal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={closeModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center" onClick={e => e.stopPropagation()}>
                        {modal.type === 'success' ? (
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full" style={{backgroundColor: '#ffc1cc'}}>
                                <svg className="h-10 w-10 text-[#ea899a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        ) : (
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                                <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-gray-900 mt-5">{modal.title}</h3>
                        <p className="text-gray-600 mt-2 mb-6">{modal.message}</p>
                        <button onClick={closeModal} className="w-full bg-[#ea899a] hover:bg-[#d77386] text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="gradient-bg text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 fade-in-up">
                        Reserva tu Cupón de Evaluación Gratuita
                    </h1>
                    <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto fade-in-up">
                        Agenda tu cita ahora y descubre la mejor versión de ti
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-16">
                <div className="container mx-auto px-6 max-w-6xl">

                    {/* Hero Section con Formulario */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">

                        {/* Left: Beneficios */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                ¿Por qué reservar ahora?
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#ea899a] text-white">
                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold text-gray-900">Evaluación 100% Gratuita</h3>
                                        <p className="mt-2 text-gray-600">
                                            Sin costo. Sin compromiso. Solo profesionalismo y atención personalizada.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#ea899a] text-white">
                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold text-gray-900">Atención Rápida</h3>
                                        <p className="mt-2 text-gray-600">
                                            Te contactamos en menos de 2 horas para coordinar tu cita.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#ea899a] text-white">
                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold text-gray-900">Asesoría Personalizada</h3>
                                        <p className="mt-2 text-gray-600">
                                            Recibe orientación honesta y profesional sobre tu caso específico.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Formulario */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                Completa tus Datos
                            </h2>
                            <p className="text-gray-600 text-center mb-6">
                                Te contactamos en minutos
                            </p>

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-5">
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Ej: María García"
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ea899a] focus:border-transparent transition ${errors.nombre ? 'border-red-500' : (formData.nombre ? 'border-[#ea899a]' : 'border-gray-300')}`}
                                    />
                                    {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                                </div>

                                <div className="mb-5">
                                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                                        WhatsApp
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-600 rounded-l-lg">
                                            +51
                                        </span>
                                        <input
                                            type="tel"
                                            id="whatsapp"
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="987 654 321"
                                            required
                                            maxLength="9"
                                            className={`w-full px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-[#ea899a] focus:border-transparent transition ${errors.whatsapp ? 'border-red-500' : (formData.whatsapp ? 'border-[#ea899a]' : 'border-gray-300')}`}
                                        />
                                    </div>
                                    {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="tu@email.com"
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ea899a] focus:border-transparent transition ${errors.email ? 'border-red-500' : (formData.email ? 'border-[#ea899a]' : 'border-gray-300')}`}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#ea899a] hover:bg-[#d77386] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    {isSubmitting ? 'Enviando...' : 'Reservar mi Cupón Gratis'}
                                </button>

                                <p className="text-xs text-gray-500 mt-4 text-center">
                                    Al enviar, aceptas nuestra <a href="/politica-privacidad" className="underline hover:text-[#ea899a]">Política de Privacidad</a>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                            Atención Profesional Garantizada
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-[#ea899a] mb-2">+500</div>
                                <p className="text-gray-600">Clientes Satisfechos</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-[#ea899a] mb-2">5★</div>
                                <p className="text-gray-600">Calificación Promedio</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-[#ea899a] mb-2">3+</div>
                                <p className="text-gray-600">Años de Experiencia</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
                            Preguntas Frecuentes
                        </h3>
                        <div className="space-y-4">
                            <details className="bg-white p-6 rounded-lg shadow-md group">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-gray-900">
                                    ¿Realmente es gratis?
                                    <svg className="w-5 h-5 text-[#ea899a] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </summary>
                                <p className="text-gray-600 mt-4">
                                    Sí, completamente gratis. Sin letra chica, sin costos ocultos.
                                </p>
                            </details>

                            <details className="bg-white p-6 rounded-lg shadow-md group">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-gray-900">
                                    ¿Cuánto tiempo toma la evaluación?
                                    <svg className="w-5 h-5 text-[#ea899a] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </summary>
                                <p className="text-gray-600 mt-4">
                                    Entre 20 y 30 minutos. Te damos toda la información que necesitas para tomar la mejor decisión.
                                </p>
                            </details>

                            <details className="bg-white p-6 rounded-lg shadow-md group">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer text-gray-900">
                                    ¿Me van a presionar para comprar?
                                    <svg className="w-5 h-5 text-[#ea899a] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </summary>
                                <p className="text-gray-600 mt-4">
                                    No. Nuestra filosofía es brindar información honesta. Tú decides si avanzas o no, sin presión.
                                </p>
                            </details>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-400 py-8">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2025 DermicaPro. Todos los derechos reservados.</p>
                    <p className="text-sm mt-2">Av. Larco 877, Trujillo, Perú | +51 974 637 783</p>
                    <div className="mt-4 space-x-4">
                        <a href="/politica-privacidad" className="hover:text-[#ffc1cc] transition-colors">Política de Privacidad</a>
                        <a href="/terminos" className="hover:text-[#ffc1cc] transition-colors">Términos y Condiciones</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default ReservasLandingPage;
