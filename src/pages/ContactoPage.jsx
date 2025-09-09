// =================================================================================
// FILE: src/pages/ContactoPage.jsx
// =================================================================================
import React from "react";
import PhoneIcon from "../components/icons/PhoneIcon";
import MailIcon from "../components/icons/MailIcon";
import MapPinIcon from "../components/icons/MapPinIcon";
const ContactoPage = () => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const phone = '51974637783';
    const message = 'Hola, quisiera agendar una evaluación en DermicaPro.';
    const appUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    const webUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Intenta abrir la app
    window.location.href = appUrl;

    // Si después de un tiempo no se ha cambiado de pestaña, abre la web
    setTimeout(() => {
        window.open(webUrl, '_blank');
    }, 2500);
  };

  return (
    <div className="bg-white pt-24 pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Conversemos sin compromiso
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Estamos aquí para resolver tus dudas y agendar tu primera
            evaluación.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Información de Contacto
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p className="flex items-center">
                <MapPinIcon className="w-6 h-6 mr-3 text-[#ea899a]" />
                Av. Larco 877, San Andres V etapa, Trujillo, Perú
              </p>
              <p className="flex items-center">
                <PhoneIcon className="w-6 h-6 mr-3 text-[#ea899a]" />
                <a href="tel:+51974637783" className="hover:text-[#ea899a]">
                  +51 974 637 783
                </a>
              </p>
              <p className="flex items-center">
                <i className="fab fa-whatsapp w-6 h-6 mr-3 text-[#ea899a] text-xl"></i>
                <a
                  href="#"
                  onClick={handleWhatsAppClick}
                  className="hover:text-[#ea899a]"
                >
                  +51 974 637 783
                </a>
              </p>
              <p className="flex items-center">
                <MailIcon className="w-6 h-6 mr-3 text-[#ea899a]" />
                <a
                  href="mailto:contacto@dermicapro.com"
                  className="hover:text-[#ea899a]"
                >
                  contacto@dermicapro.com
                </a>
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Horarios de Atención
              </h3>
              <p className="text-gray-700">
                Lunes a Viernes: 9:00 AM - 7:00 PM
              </p>
              <p className="text-gray-700">Sábados: 9:00 AM - 2:00 PM</p>
            </div>
          </div>
          <div>
            <div className="w-full h-full rounded-lg shadow-md overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.647028888397!2d-79.05267178762256!3d-8.137369391858808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ad3d311a491201%3A0xa4452c7571338104!2sDermicaPro!5e0!3m2!1sen!2spe!4v1755335019131!5m2!1sen!2spe" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '450px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactoPage;