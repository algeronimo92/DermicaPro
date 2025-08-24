// =================================================================================
// FILE: src/pages/ReservaPage.jsx
// =================================================================================
import React, { useState } from "react";
const ReservaPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    service: "",
    schedule: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) =>
    setFormState({ ...formState, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  const services = [
    "HIFU 12D",
    "Pico Láser (Manchas)",
    "Enzimas Recombinantes",
    "Reducción de Papada",
    "Hollywood Peel",
    "Borrado de Tatuajes",
    "No estoy segura/o",
  ];
  if (submitted) {
    return (
      <div
        className="bg-gray-50 pt-24 pb-16 animate-fade-in flex items-center justify-center"
        style={{ minHeight: "80vh" }}
      >
        {" "}
        <div className="text-center bg-white p-10 rounded-lg shadow-xl">
          {" "}
          <h1 className="text-3xl font-bold text-[#ea899a] mb-4">
            ¡Gracias, {formState.name}!
          </h1>{" "}
          <p className="text-lg text-gray-700">Hemos recibido tu solicitud.</p>{" "}
          <p className="text-gray-600 mt-2">
            Nos pondremos en contacto contigo muy pronto para conversar y
            confirmar tu evaluación.
          </p>{" "}
        </div>{" "}
      </div>
    );
  }
  return (
    <div className="bg-gray-50 pt-24 pb-16 animate-fade-in">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            ¿Lista para dar el primer paso?
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Tu primer paso es una conversación. Te escucharemos, evaluaremos tu
            caso con sinceridad y te diremos si realmente podemos ayudarte. Cero
            presión, total transparencia.
          </p>
          <a
            href="https://wa.me/51974637783?text=Hola,%20quisiera%20agendar%20una%20evaluación%20en%20DermicaPro."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center bg-green-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            {" "}
            <i className="fab fa-whatsapp mr-3 fa-lg"></i> Agendar por WhatsApp{" "}
          </a>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Completa tus datos
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              {" "}
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre Completo
              </label>{" "}
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formState.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ea899a] focus:border-[#ea899a]"
              />{" "}
            </div>
            <div>
              {" "}
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Número de Teléfono / WhatsApp
              </label>{" "}
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                value={formState.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ea899a] focus:border-[#ea899a]"
              />{" "}
            </div>
            <div>
              {" "}
              <label
                htmlFor="service"
                className="block text-sm font-medium text-gray-700"
              >
                Tratamiento de Interés (Opcional)
              </label>{" "}
              <select
                id="service"
                name="service"
                value={formState.service}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#ea899a] focus:border-[#ea899a] sm:text-sm rounded-md"
              >
                {" "}
                <option value="">Selecciona un tratamiento</option>{" "}
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>
            <div>
              {" "}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-[#ea899a] hover:bg-[#d37989] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea899a] transition-transform transform hover:scale-105"
              >
                {" "}
                Agendar mi Evaluación de Honestidad{" "}
              </button>{" "}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservaPage;
