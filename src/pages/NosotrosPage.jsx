// =================================================================================
// FILE: src/pages/NosotrosPage.jsx
// =================================================================================
import React from "react";
const NosotrosPage = () => {
  const values = [
    {
      title: "Honestidad",
      text: "Te daremos siempre una evaluación real. Si un tratamiento no es para ti, seremos los primeros en decírtelo.",
    },
    {
      title: "Empatía",
      text: "Sabemos que vienes con una historia. Te escuchamos con atención y tratamos tu caso con la calidez y el respeto que mereces.",
    },
    {
      title: "Ética Profesional",
      text: "Jamás te ofreceremos algo que no necesites. Tu bienestar y confianza están por encima de cualquier venta.",
    },
    {
      title: "Acompañamiento Real",
      text: "Estamos contigo antes, durante y después del tratamiento. Hacemos un seguimiento cercano para asegurar tus resultados y tranquilidad.",
    },
  ];
  return (
    <div className="bg-white pt-24 pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Más que un centro de estética, un lugar de confianza
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Nacimos para ser la solución honesta que no encontrabas.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <div>
            {" "}
            <img
              src="/images/local-1.jpg"
              alt="Equipo de DermicaPro"
              className="rounded-lg shadow-xl"
            />{" "}
          </div>
          <div className="text-lg text-gray-700 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Nuestra Misión: Devolver la Confianza
            </h2>
            <p>
              Entendemos la frustración de haberlo intentado todo sin éxito. Por
              eso, nuestra misión es ofrecerte tratamientos efectivos con la
              mejor tecnología, pero sobre todo, con una atención humana que te
              haga sentir segura y escuchada. Queremos ser el lugar donde tu
              piel y tu autoestima florecen juntas.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Nuestros Valores son nuestra Promesa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-gray-50 p-6 rounded-lg">
                {" "}
                <h3 className="text-xl font-semibold text-[#ea899a] mb-2">
                  {value.title}
                </h3>{" "}
                <p className="text-gray-600">{value.text}</p>{" "}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NosotrosPage;
