import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Página No Encontrada - Dermica Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Sad Face Icon */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white rounded-full p-8 shadow-lg">
              <svg
                className="w-32 h-32 text-brand-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* 404 Number */}
          <h1 className="text-8xl md:text-9xl font-bold text-brand-500 mb-8">
            404
          </h1>

          {/* Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ¡Oops! Página no encontrada
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Parece que esta página se fue de vacaciones permanentes.
            </p>
            <p className="text-gray-500">
              La URL que buscas no existe o ha sido movida.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/"
              className="bg-brand-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-600 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Volver al Inicio
            </Link>
            <Link
              to="/servicios"
              className="bg-white text-brand-500 px-8 py-3 rounded-full font-semibold border-2 border-brand-500 hover:bg-brand-50 transition-colors duration-300 w-full sm:w-auto"
            >
              Ver Tratamientos
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              ¿Buscabas algo de esto?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/servicios"
                className="text-brand-500 hover:text-brand-600 font-medium transition-colors"
              >
                Servicios
              </Link>
              <Link
                to="/resultados"
                className="text-brand-500 hover:text-brand-600 font-medium transition-colors"
              >
                Resultados
              </Link>
              <Link
                to="/testimonios"
                className="text-brand-500 hover:text-brand-600 font-medium transition-colors"
              >
                Testimonios
              </Link>
              <Link
                to="/contacto"
                className="text-brand-500 hover:text-brand-600 font-medium transition-colors"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-brand-500 to-brand-300 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">
              ¿Necesitas ayuda?
            </h3>
            <p className="mb-4">
              Nuestro equipo está listo para atenderte
            </p>
            <a
              href="https://wa.me/51974637783?text=Hola,%20necesito%20ayuda%20navegando%20el%20sitio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-brand-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
