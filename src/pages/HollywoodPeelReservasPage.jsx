import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { trackViewContent, saveMetaUTM } from '../utils/metaPixelHelper';
import { trackViewContent as trackTikTokViewContent, saveTikTokUTM } from '../utils/tiktokPixelHelper';
import { handleFormSubmission, TRATAMIENTOS, LANDINGS } from '../services/webhookService';

// Landing Page NEUTRA para Hollywood Peel - hp-reservas.dermicapro.com
function HollywoodPeelReservasPage() {
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

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sanitizeParam = (value) => {
            if (!value || value === 'N/A') return 'N/A';
            return value.replace(/[<>"'`]/g, '').substring(0, 100);
        };

        setUtmData({
            fbclid: sanitizeParam(urlParams.get('fbclid')),
            utm_source: sanitizeParam(urlParams.get('utm_source')),
            utm_medium: sanitizeParam(urlParams.get('utm_medium')),
            utm_campaign: sanitizeParam(urlParams.get('utm_campaign')),
            utm_content: sanitizeParam(urlParams.get('utm_content')),
            utm_term: sanitizeParam(urlParams.get('utm_term')),
            ttclid: sanitizeParam(urlParams.get('ttclid')),
            tt_campaign_id: sanitizeParam(urlParams.get('tt_campaign_id')),
        });

        saveMetaUTM();
        saveTikTokUTM();
        trackViewContent('Hollywood Peel Reservas Landing', 'landing_page');
        trackTikTokViewContent('Hollywood Peel Reservas Landing', 'landing_page');
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
            await handleFormSubmission({
                formData,
                tratamiento: TRATAMIENTOS.HOLLYWOOD_PEEL,
                landing: LANDINGS.HOLLYWOOD_PEEL_RESERVAS,
                utmData,
                onSuccess: () => {
                    setModal({
                        show: true,
                        type: 'success',
                        title: '¡Reserva Confirmada!',
                        message: 'Te contactaremos pronto para coordinar tu evaluación. Revisa tu WhatsApp.'
                    });
                    setFormData({ nombre: '', whatsapp: '', email: '' });
                    setErrors({});
                },
                onError: (errorMessage) => {
                    setModal({
                        show: true,
                        type: 'error',
                        title: 'Error al Enviar',
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

    return (
        <div className="antialiased bg-gray-50 min-h-screen flex flex-col">
            <Helmet>
                <title>Reserva tu Evaluación Gratuita - DermicaPro</title>
                <meta name="description" content="Agenda tu evaluación gratuita. Asesoría personalizada y profesional sin compromiso." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <style>{`
                :root {
                    --primary: #ea899a; --primary-dark: #d77386;
                    --secondary: #ffc1cc;
                }
                .gradient-bg { background: linear-gradient(135deg, #ea899a 0%, #d77386 100%); }
                @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
                .fade-in-up { opacity: 0; transform: translateY(20px); animation: fadeInUp 0.8s forwards; }
            `}</style>

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
            <header className="gradient-bg text-white py-16 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 fade-in-up">
                        Agenda tu Evaluación Gratuita
                    </h1>
                    <p className="text-xl text-pink-100 max-w-2xl mx-auto fade-in-up">
                        Descubre la mejor versión de ti con asesoría profesional
                    </p>
                </div>
            </header>

            {/* Form Section */}
            <main className="py-12 md:py-16">
                <div className="container mx-auto px-6 max-w-lg">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Completa tus Datos
                        </h2>

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
                                {isSubmitting ? 'Enviando...' : 'Reservar mi Evaluación Gratis'}
                            </button>

                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Al enviar, aceptas nuestra <a href="/politica-privacidad" className="underline hover:text-[#ea899a]">Política de Privacidad</a>
                            </p>
                        </form>
                    </div>

                    {/* Trust Section */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm mb-4">✓ 100% Gratuito • ✓ Sin Compromiso • ✓ Atención Profesional</p>
                        <div className="flex justify-center gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-[#ea899a]">+500</div>
                                <p className="text-sm text-gray-600">Clientes</p>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#ea899a]">5★</div>
                                <p className="text-sm text-gray-600">Calificación</p>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#ea899a]">3+</div>
                                <p className="text-sm text-gray-600">Años</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto bg-gray-800 text-gray-400 py-6 text-center text-sm">
                <p>&copy; 2025 DermicaPro. Todos los derechos reservados.</p>
                <p className="mt-2">Av. Larco 877, Trujillo, Perú | +51 974 637 783</p>
            </footer>
        </div>
    );
}

export default HollywoodPeelReservasPage;
