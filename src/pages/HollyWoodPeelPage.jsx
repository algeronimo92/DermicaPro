// =================================================================================
// FILE: src/pages/ServiciosPage.jsx
// =================================================================================
import React from "react";
import SparklesIcon from "../components/icons/SparklesIcon"; // Ejemplo
import { Link } from "react-router-dom";

const HollywoodPeelPage = () => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const phone = "51974637783";
    const message =
      "Hola, quisiera agendar una evaluación para el tratamiento Hollywood Peel.";
    const appUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
      message
    )}`;
    const webUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.location.href = appUrl;
    setTimeout(() => {
      if (!document.hidden) {
        window.open(webUrl, "_blank");
      }
    }, 2500);
  };

  return (
    <div className="animate-fade-in pt-0">
      {" "}
      {/* Añadido padding-top para el Navbar fijo */}
      <title>
        Hollywood Peel en Trujillo | Piel Radiante y Sin Poros | DermicaPro
      </title>
      <meta
        name="description"
        content="Descubre el Hollywood Peel en Trujillo. El tratamiento ideal para piel opaca, poros abiertos y manchas. Resultados visibles sin dolor ni recuperación."
      />
      <meta
        name="keywords"
        content="hollywood peel trujillo, peeling de carbón, piel luminosa, cerrar poros, tratamiento facial trujillo, dermicapro"
      />
      <section
        className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/2d3748/e2e8f0?text=Fondo+Elegante+Hollywood+Peel')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            ¿Cansada de ver tu piel opaca y con poros abiertos?
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Sabemos que escondes tu rostro con maquillaje. El Hollywood Peel te devuelve
            esa luminosidad natural que creías perdida. Sin dolor, sin tiempo de recuperación.
          </p>
          <button
            onClick={handleWhatsAppClick}
            className="mt-8 inline-block bg-[#ea899a] text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-[#d37989] transition-transform transform hover:scale-105"
          >
            Recibir evaluación honesta (sin compromiso)
          </button>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Te entendemos: ya probaste cremas sin resultado
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Gastas en productos que prometen luminosidad, pero los poros siguen ahí
              y tu piel sigue apagada. Evitas las fotos sin filtros porque no te sientes
              segura con tu piel al natural.
            </p>
            <p className="mt-4 text-lg text-gray-600 font-semibold text-[#ea899a]">
              El Hollywood Peel actúa donde las cremas no pueden: desde las capas
              profundas de tu piel, renovándola y devolviéndole esa luz que perdiste.
            </p>
          </div>
          <div>
            <img
              src="https://placehold.co/600x400/ea899a/ffffff?text=Piel+Luminosa"
              alt="Resultado de Hollywood Peel"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Resultados que verás desde la primera sesión
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No prometemos milagros. Te mostramos cambios reales que sentirás en tu piel
              y verás en el espejo.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-900">
                Luminosidad Inmediata
              </h3>
              <p className="mt-2 text-gray-600">
                Sal de la sesión con una piel visiblemente más radiante y
                saludable.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900">
                Minimiza Poros y Marcas
              </h3>
              <p className="mt-2 text-gray-600">
                Reduce la apariencia de poros abiertos y suaviza las pequeñas
                marcas de acné.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold text-gray-900">
                Piel Suave y Uniforme
              </h3>
              <p className="mt-2 text-gray-600">
                Mejora la textura general de la piel, dejándola increíblemente
                suave al tacto.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            ¿Quieres sentirte segura sin maquillaje?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            El primer paso es una evaluación gratuita y sin compromiso.
            Te explicamos con honestidad si el Hollywood Peel es para ti, sin presiones.
          </p>
          <Link
            to="/reserva"
            className="mt-8 inline-block bg-[#ea899a] text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-[#d37989] transition-transform transform hover:scale-105"
          >
            Agenda tu evaluación gratuita
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HollywoodPeelPage;
