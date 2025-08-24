// =================================================================================
// FILE: src/pages/ResultadosPage.jsx
// =================================================================================
import React from "react";
const ResultadosPage = () => {
  const results = [
    {
      title: "Recuperando la confianza: Eliminación de Tatuaje",
      before: "https://placehold.co/600x400/d1d5db/374151?text=Antes",
      after: "https://placehold.co/600x400/a3e635/1e293b?text=Después",
    },
    {
      title: "Un rostro más firme y definido con Hifu 12D",
      before: "https://placehold.co/600x400/d1d5db/374151?text=Antes",
      after: "https://placehold.co/600x400/a3e635/1e293b?text=Después",
    },
    {
      title: "Adiós a las manchas que la acomplejaban",
      before: "/images/beforeafter-manchas.jpg",
      after: "https://placehold.co/600x400/a3e635/1e293b?text=Después",
    },
    {
      title: "Una mirada enmarcada y natural: Micropigmentación",
      before: "https://placehold.co/600x400/d1d5db/374151?text=Antes",
      after: "https://placehold.co/600x400/a3e635/1e293b?text=Después",
    },
  ];
  return (
    <div className="bg-gray-50 pt-24 pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            La confianza se construye con hechos
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Aquí te mostramos los resultados de pacientes que, como tú,
            decidieron confiar en nosotros. Cada imagen representa una historia
            de autoestima recuperada. Sin filtros, sin ediciones.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {" "}
              <h3 className="text-lg font-semibold text-gray-900 p-4 text-center">
                {result.title}
              </h3>{" "}
              <div className="grid grid-cols-2">
                {" "}
                <img
                  src={result.before}
                  alt="Antes del tratamiento"
                  className="w-full h-auto object-cover"
                />{" "}
                <img
                  src={result.after}
                  alt="Después del tratamiento"
                  className="w-full h-auto object-cover"
                />{" "}
              </div>{" "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultadosPage;
