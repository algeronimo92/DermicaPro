
// =================================================================================
// FILE: src/pages/ServiciosPage.jsx
// =================================================================================
import React from 'react';
import  SparklesIcon  from '../components/icons/SparklesIcon'; // Ejemplo
const ServiciosPage = ({ openAdvisor }) => {
  const services = [
    { title: "HIFU 12D (Lifting sin Cirugía)", description: "Combate la flacidez y redefine tu rostro sin cirugías. Esta tecnología de ultrasonido recupera la firmeza para un rejuvenecimiento visible y natural.", ideal: "Personas entre 35 y 55 años que notan flacidez facial, caída de párpados o cejas y papada, y buscan un lifting sin pasar por quirófano.", icon: 'fas fa-user-md' },
    { title: "Borrado de Manchas (Pico Láser)", description: "La solución más efectiva para manchas hormonales, solares o post-acné que no se van con cremas. Recupera un tono de piel uniforme y siéntete segura sin maquillaje.", ideal: "Personas entre 28 y 55 años que ya probaron otros métodos sin éxito y buscan resultados visibles y seguros sin dañar su piel.", icon: 'fas fa-laser' },
    { title: "Enzimas Recombinantes", description: "Tratamos de forma específica y segura la grasa localizada (papada), fibrosis o exceso de ácido hialurónico, devolviendo la armonía a tu rostro.", ideal: "Personas entre 30 y 55 años que quieren evitar cirugías y se sienten incómodas con zonas inflamadas, pesadas o con grasa.", icon: 'fas fa-vial' },
    { title: "Reducción de Papada (Enzimas + HIFU)", description: "Combinamos lo mejor de dos tecnologías para eliminar la grasa localizada y tensar la piel de la papada. Define tu perfil y afina tu rostro.", ideal: "Hombres y mujeres entre 28 y 50 años con papada marcada que no mejora con dieta ni ejercicio y buscan una solución sin bisturí.", icon: 'fas fa-compress-arrows-alt' },
    { title: "Hollywood Peel", description: "Devuélvele la vida a tu piel opaca y cierra poros dilatados. Un tratamiento rápido para una luminosidad instantánea que te hará sentir radiante.", ideal: "Personas entre 30 y 50 años con piel apagada, poros abiertos o marquitas de acné que quieren rejuvenecer sin dolor ni tiempo de recuperación.", icon: 'fas fa-star' },
    { title: "Borrado de Tatuajes y Micropigmentación", description: "Eliminamos de forma definitiva y segura esas marcas del pasado, ya sea un tatuaje que no te representa o una micropigmentación fallida.", ideal: "Personas entre 25 y 45 años que desean borrar de su piel marcas con carga emocional o que salieron mal, para empezar de cero.", icon: 'fas fa-eraser' }
  ];

  return (
    <div className="bg-white pt-24 pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Tratamientos honestos para resultados reales</h1>
          <p className="mt-4 text-xl text-gray-600">Te explicamos con claridad cada opción para que tomes la mejor decisión, sin presiones.</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-8 mb-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center"><SparklesIcon className="w-6 h-6 mr-2 text-[#ea899a]" />¿No sabes por dónde empezar?</h2>
            <p className="text-gray-600 mt-2 mb-4">Nuestro asesor virtual te dará una orientación honesta y sin compromiso. Es el primer paso.</p>
            <button onClick={openAdvisor} className="inline-block bg-[#ea899a] text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-[#d37989] transition-transform transform hover:scale-105">✨ Probar Asesor Virtual</button>
        </div>
        <div className="space-y-12">
          {services.map((service, index) => (
            <div key={index} className="bgå-gray-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center text-center md:text-left gap-6">
              <div className="bg-[#ea899a] text-white rounded-full p-5 flex-shrink-0"><i className={`${service.icon} fa-2x w-8 h-8`}></i></div>
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
  );
};

export default ServiciosPage;
