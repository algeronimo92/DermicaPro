/**
 * TEMPLATE: Landing Page con WhatsApp Directo
 * Basado en el patrón de HollywoodPeelPage.jsx
 */

function generate(data, componentName) {
  const benefitsGrid = data.benefits.map((b, idx) => `
            <div className="text-center p-6">
              <div className="text-4xl mb-4">${['✨', '🎯', '🌿', '💫'][idx] || '⭐'}</div>
              <h3 className="text-xl font-semibold text-gray-900">${b.title}</h3>
              <p className="mt-2 text-gray-600">${b.description}</p>
            </div>`).join('');

  return `import React from "react";
import { Link } from "react-router-dom";

const ${componentName} = () => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const phone = "51974637783";
    const message = "Hola, quisiera agendar una evaluación para el tratamiento ${data.treatmentName}.";
    const appUrl = \`whatsapp://send?phone=\${phone}&text=\${encodeURIComponent(message)}\`;
    const webUrl = \`https://wa.me/\${phone}?text=\${encodeURIComponent(message)}\`;
    window.location.href = appUrl;
    setTimeout(() => {
      if (!document.hidden) {
        window.open(webUrl, "_blank");
      }
    }, 2500);
  };

  return (
    <div className="animate-fade-in pt-0">
      <title>${data.treatmentName} en Trujillo | DermicaPro</title>
      <meta name="description" content="${data.heroSubtitle}" />
      <meta name="keywords" content="${data.treatmentName.toLowerCase()}, tratamiento facial trujillo, dermicapro" />

      {/* Hero Section */}
      <section
        className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://placehold.co/1920x1080/2d3748/e2e8f0?text=Fondo+${data.treatmentName.replace(/\s/g, '+')}')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            ${data.heroTitle}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            ${data.heroSubtitle}
          </p>
          <button
            onClick={handleWhatsAppClick}
            className="mt-8 inline-block bg-[#ea899a] text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-[#d37989] transition-transform transform hover:scale-105"
          >
            Recibir evaluación honesta (sin compromiso)
          </button>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900">
              ${data.problemDescription}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              ${data.solutionDescription}
            </p>
          </div>
          <div>
            <img
              src="https://placehold.co/600x400/ea899a/ffffff?text=${data.treatmentName.replace(/\s/g, '+')}"
              alt="Resultado de ${data.treatmentName}"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Resultados que verás desde la primera sesión
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No prometemos milagros. Te mostramos cambios reales que sentirás en tu piel y verás en el espejo.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-${data.benefits.length > 2 ? '3' : '2'}">${benefitsGrid}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            ¿Lista para tu transformación?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            El primer paso es una evaluación gratuita y sin compromiso. Te explicamos con honestidad si ${data.treatmentName} es para ti, sin presiones.
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

export default ${componentName};
`;
}

module.exports = { generate };
