// =================================================================================
// FILE: src/pages/TrabajaNosotrosPage.jsx
// =================================================================================
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const positions = [
  {
    title: "Asesor Comercial",
    type: "Tiempo completo",
    area: "Ventas",
    description:
      "Nos encanta recibir personas apasionadas por conectar con clientes y ofrecer soluciones reales. Si tienes actitud comercial y quieres crecer en una clínica en expansión, este puesto es para ti.",
    tags: ["Ventas", "Atención al cliente", "Presencial"],
    link: "/postulacion/vendedor",
    color: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    icon: "💼",
  },
  {
    title: "Especialista en Tratamientos Láser",
    type: "Tiempo completo",
    area: "Clínica",
    description:
      "Buscamos un profesional con experiencia en equipos de estética avanzada. Serás parte del equipo clínico que transforma la piel y la autoestima de nuestros pacientes.",
    tags: ["Estética", "Láser", "Salud", "Presencial"],
    link: "/postulacion/especialista-laser",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    icon: "✨",
  },
  {
    title: "Editor de Videos",
    type: "Tiempo completo",
    area: "Marketing",
    description:
      "¿Sabes contar historias con imágenes? Necesitamos un editor creativo que transforme nuestro contenido en piezas que enganchen en redes sociales y potencien nuestra marca.",
    tags: ["Video", "Edición", "Redes sociales", "Remoto / Híbrido"],
    link: "/postulacion/editor-video",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    icon: "🎬",
  },
  {
    title: "Practicante Filmmaker",
    type: "Prácticas",
    area: "Marketing",
    description:
      "Oportunidad para estudiantes de comunicaciones o cinematografía. Aprenderás a filmar contenido clínico y de marca junto a un equipo creativo con proyección real.",
    tags: ["Filmación", "Prácticas", "Comunicaciones", "Presencial"],
    link: "/postulacion/practicantes-filmmaker",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    icon: "🎥",
  },
  {
    title: "Practicante Editor de Videos",
    type: "Prácticas",
    area: "Marketing",
    description:
      "Ideal para estudiantes que quieran ganar experiencia real editando contenido para redes sociales. Aprenderás formatos modernos y trabajarás con retroalimentación constante.",
    tags: ["Edición", "Prácticas", "Social media", "Remoto / Híbrido"],
    link: "/postulacion/practicantes-editor-video",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    icon: "🖥️",
  },
];

const TrabajaNosotrosPage = () => {
  return (
    <>
      <Helmet>
        <title>Trabaja con Nosotros | DermicaPro Trujillo</title>
        <meta
          name="description"
          content="Únete al equipo de DermicaPro. Tenemos oportunidades en clínica, ventas y marketing en Trujillo, Perú."
        />
      </Helmet>

      <div className="pt-20 bg-white min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#2d1520] to-[#4a2030] py-16 px-4 text-center">
          <p className="text-[#ea899a] font-semibold tracking-widest uppercase text-sm mb-3">
            Únete a nuestro equipo
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trabaja con Nosotros
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-base md:text-lg">
            En DermicaPro creemos que un gran equipo es el primer tratamiento.
            Buscamos personas comprometidas, creativas y con ganas de crecer.
          </p>
        </section>

        {/* Posiciones */}
        <section className="max-w-4xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Puestos disponibles
          </h2>
          <p className="text-gray-500 mb-10">
            {positions.length} oportunidades abiertas en este momento
          </p>

          <div className="flex flex-col gap-6">
            {positions.map((pos) => (
              <div
                key={pos.link}
                className={`border rounded-2xl p-6 ${pos.color} transition-shadow hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{pos.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {pos.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pos.badge}`}
                        >
                          {pos.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          · {pos.area}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={pos.link}
                    className="shrink-0 inline-block bg-[#ea899a] hover:bg-[#d37989] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
                  >
                    Postular ahora
                  </Link>
                </div>

                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  {pos.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {pos.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white border border-gray-200 text-gray-500 px-2.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA footer */}
        <section className="bg-[#fde8ed] py-12 px-4 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            ¿No encuentras tu perfil?
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
            Escríbenos de todas formas. Siempre estamos abiertos a conocer
            personas talentosas.
          </p>
          <a
            href="https://wa.me/51974637783?text=Hola%2C%20quiero%20postular%20a%20DermicaPro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#ea899a] hover:bg-[#d37989] text-white font-semibold px-7 py-3 rounded-full transition-colors"
          >
            Escribir por WhatsApp
          </a>
        </section>
      </div>
    </>
  );
};

export default TrabajaNosotrosPage;
