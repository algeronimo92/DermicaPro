// =================================================================================
// FILE: src/components/TreatmentSelectionModal.jsx
// =================================================================================
import React, { useEffect, useRef } from 'react';
import { trackContact } from '../utils/metaPixelHelper';

const TreatmentSelectionModal = ({ isOpen, onClose, treatments, userConcern }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    const handleWhatsAppContact = (treatmentName) => {
        // Track contacto por WhatsApp desde modal de asesor virtual
        trackContact('whatsapp', 'gemini_advisor_modal', treatmentName);

        const message = `Hola! Me interesa el tratamiento de *${treatmentName}*. ${userConcern ? `Mi consulta fue: "${userConcern}"` : ''} ¿Podrían darme más información?`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/51974637783?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 animate-fade-in">
            <div ref={modalRef} className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-[61]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        ✨ Tratamientos Recomendados para Ti
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-3xl font-bold leading-none"
                    >
                        &times;
                    </button>
                </div>

                <p className="text-gray-600 mb-8 text-center">
                    Selecciona el tratamiento que más te interese para contactarnos por WhatsApp
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {treatments.map((treatment, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-pink-50 to-white border-2 border-[#ea899a] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                        >
                            {/* Imagen del tratamiento */}
                            {treatment.image && (
                                <div className="mb-4 rounded-lg overflow-hidden h-48">
                                    <img
                                        src={treatment.image}
                                        alt={treatment.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Nombre del tratamiento */}
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                {treatment.name}
                            </h3>

                            {/* Descripción corta */}
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                {treatment.description}
                            </p>

                            {/* Beneficios clave */}
                            {treatment.benefits && (
                                <div className="mb-4">
                                    <p className="text-xs font-semibold text-[#ea899a] mb-2">
                                        ✓ Beneficios principales:
                                    </p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        {treatment.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="text-[#ea899a] mr-2">•</span>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Botón de WhatsApp - pushed to bottom with mt-auto */}
                            <div className="mt-auto">
                                <button
                                    onClick={() => handleWhatsAppContact(treatment.name)}
                                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                    Consultar por WhatsApp
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botón de cerrar abajo */}
                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 font-semibold underline"
                    >
                        Cerrar y volver a la consulta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TreatmentSelectionModal;
