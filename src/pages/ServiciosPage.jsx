
// =================================================================================
// FILE: src/pages/ServiciosPage.jsx
// =================================================================================
import React from 'react';
import { Helmet } from 'react-helmet-async';
import  SparklesIcon  from '../components/icons/SparklesIcon';
import { treatmentsData } from '../data/treatmentsData';

const ServiciosPage = ({ openAdvisor }) => {
  // Helper function para asignar iconos según el tratamiento
  const getIconForTreatment = (name) => {
    if (name.includes('HIFU')) return 'fas fa-user-md';
    if (name.includes('Borrado') && name.includes('Micropigmentación')) return 'fas fa-eraser';
    if (name.includes('Borrado') && name.includes('Tatuajes')) return 'fas fa-eraser';
    if (name.includes('Hollywood Peel')) return 'fas fa-star';
    if (name.includes('Exosomas')) return 'fas fa-dna';
    if (name.includes('Botox')) return 'fas fa-syringe';
    if (name.includes('Enzimas')) return 'fas fa-vial';
    if (name.includes('Papada')) return 'fas fa-compress-arrows-alt';
    if (name.includes('Micropigmentación')) return 'fas fa-paint-brush';
    if (name.includes('Grasa')) return 'fas fa-weight';
    if (name.includes('Dermapen')) return 'fas fa-syringe';
    return 'fas fa-spa'; // Icono por defecto
  };

  // Generar ideal para cada tratamiento basado en beneficios
  const getIdealFor = (name) => {
    if (name.includes('HIFU')) return 'Personas entre 35 y 55 años que notan flacidez facial y buscan lifting sin cirugía.';
    if (name.includes('Hollywood Peel')) return 'Personas entre 30 y 50 años con piel apagada o poros abiertos.';
    if (name.includes('Exosomas')) return 'Personas entre 35 y 60 años con manchas, arrugas y pérdida de firmeza.';
    if (name.includes('Botox')) return 'Personas entre 30 y 60 años con arrugas de expresión.';
    if (name.includes('Dermapen con PRP')) return 'Personas con cicatrices de acné profundas que buscan regeneración natural.';
    if (name.includes('Dermapen con Ácido Hialurónico')) return 'Personas con líneas finas y deshidratación que buscan hidratación profunda.';
    if (name.includes('Dermapen con Vitamina C')) return 'Personas que buscan iluminar y unificar el tono de su piel.';
    if (name.includes('Dermapen')) return 'Personas que buscan mejorar textura, poros abiertos o cicatrices.';
    return 'Personas que buscan mejorar el aspecto de su piel de forma segura y efectiva.';
  };

  // Convertir treatmentsData a formato de servicios
  const services = Object.values(treatmentsData).map(treatment => ({
    title: treatment.name,
    description: treatment.description,
    ideal: getIdealFor(treatment.name),
    icon: getIconForTreatment(treatment.name)
  }));

  return (
    <>
      <Helmet>
        {/* Title optimizado para SEO */}
        <title>Tratamientos Faciales y Corporales | DermicaPro - Clínica de Piel</title>

        {/* Meta Description optimizada */}
        <meta
          name="description"
          content="Descubre nuestros tratamientos especializados: HIFU 12D, Pico Láser, Exosomas con Ácido Tranexámico, Botox, Hollywood Peel, Enzimas y más. Resultados reales sin cirugía."
        />

        {/* Keywords relevantes */}
        <meta
          name="keywords"
          content="HIFU 12D, lifting sin cirugía, pico láser, borrado de manchas, exosomas, ácido tranexámico, botox, toxina botulínica, hollywood peel, enzimas recombinantes, reducción de papada, micropigmentación, tratamientos faciales, dermatología estética, rejuvenecimiento facial"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dermicapro.com/servicios" />
        <meta property="og:title" content="Tratamientos Faciales Profesionales - DermicaPro" />
        <meta property="og:description" content="HIFU 12D, Pico Láser, Hollywood Peel y más tratamientos especializados para el cuidado de tu piel. Resultados visibles sin cirugía." />
        <meta property="og:image" content="https://dermicapro.com/logo512.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://dermicapro.com/servicios" />
        <meta name="twitter:title" content="Tratamientos Faciales Profesionales - DermicaPro" />
        <meta name="twitter:description" content="HIFU 12D, Pico Láser, Hollywood Peel y más tratamientos para el cuidado de tu piel." />
        <meta name="twitter:image" content="https://dermicapro.com/logo512.png" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://dermicapro.com/servicios" />

        {/* Schema.org para Google - Generado dinámicamente desde treatmentsData */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "DermicaPro",
            "url": "https://dermicapro.com/servicios",
            "description": "Clínica especializada en tratamientos faciales y corporales",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Tratamientos de Cuidado de la Piel",
              "itemListElement": Object.values(treatmentsData).map(treatment => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": treatment.name,
                  "description": treatment.description
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="bg-white pt-24 pb-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Tratamientos honestos para resultados reales</h1>
            <p className="mt-4 text-xl text-gray-600">Te explicamos con claridad cada opción para que tomes la mejor decisión, sin presiones.</p>
          </div>
        <div className="bg-gray-50 rounded-lg p-8 mb-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center"><SparklesIcon className="w-6 h-6 mr-2 text-brand-500" />¿No sabes por dónde empezar?</h2>
            <p className="text-gray-600 mt-2 mb-4">Nuestro asesor virtual te dará una orientación honesta y sin compromiso. Es el primer paso.</p>
            <button onClick={openAdvisor} className="inline-block bg-brand-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-brand-600 transition-transform transform hover:scale-105">✨ Probar Asesor Virtual</button>
        </div>
        <div className="space-y-12">
          {services.map((service, index) => (
            <div key={index} className="bgå-gray-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center text-center md:text-left gap-6">
              <div className="bg-brand-500 text-white rounded-full p-5 flex-shrink-0"><i className={`${service.icon} fa-2x w-8 h-8`}></i></div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-700 mb-3">{service.description}</p>
                <p className="text-sm text-gray-500 bg-gray-200 inline-block px-3 py-1 rounded-full"><strong className="text-gray-700">Ideal para ti si:</strong> {service.ideal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default ServiciosPage;
