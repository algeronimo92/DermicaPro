import React, { useState, useEffect } from "react";
import SparklesIcon from "../components/icons/SparklesIcon";
import StarIcon from "../components/icons/StarIcon";
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";

// =================================================================================
// FILE: src/pages/HomePage.jsx
// =================================================================================
const HomePage = ({ setPage, openAdvisor }) => {
  // MODIFICACIÓN: Ahora el array contiene objetos para diferenciar tipo de media
  const carouselItems = [
    { type: "image", src: "/images/hero-1.png" },
    { type: "image", src: "/images/hero-2.png" },
    { type: "image", src: "/images/hero-3.jpg" },
    { type: "video", src: "/videos/herov-1.mp4" },
    { type: "image", src: "/images/hero-4.jpg" },
    { type: "image", src: "/images/hero-2-1.png" },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const featuredServices = [
    {
      name: "Borrado de Manchas (Pico Láser)",
      desc: "Para ti, que ya probaste cremas sin éxito y buscas eliminar de forma segura esas manchas (hormonales, solares) o marcas de acné.",
      img: "/images/beforeafter-manchas.jpg",
    },
    {
      name: "HIFU 12D (Lifting sin Cirugía)",
      desc: "Si notas flacidez, caída de párpados o papada, esta tecnología de ultrasonido redefine tu rostro y recupera la firmeza perdida.",
      img: "/images/beforeafter-hifu.jpg",
    },
    {
      name: "Borrado de Tatuajes y Micropigmentación",
      desc: "Eliminamos de forma segura y definitiva ese tatuaje que ya no te representa o esa micropigmentación fallida que te genera inseguridad.",
      img: "/images/beforeafter-tatuajes.jpg",
    },
  ];
  const testimonials = [
    {
      name: "Ana García",
      quote:
        "Estaba cansada de gastar en cremas que no funcionaban para mis manchas. Aquí me explicaron por qué y cuál era la solución real. Me siento otra persona.",
      rating: 5,
    },
    {
      name: "Carlos Vega",
      quote:
        "Tenía miedo de los tratamientos por una mala experiencia anterior. Aquí me explicaron todo con paciencia y sin presiones. El resultado superó mis expectativas.",
      rating: 5,
    },
  ];

  return (

    <div className="animate-fade-in">

    <Navbar openAdvisor={() => setIsAdvisorOpen(true)} />
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === currentSlide ? 1 : 0 }}
          >
            {item.type === "image" ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${item.src})` }}
              />
            ) : (
              <video
                className="w-full h-full object-cover"
                src={item.src}
                autoPlay
                loop
                muted
                playsInline
              />
            )}
          </div>
        ))}

        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            ¿Cansada de soluciones que no funcionan?
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Recupera la confianza en tu piel con tecnología real y un equipo que
            sí se preocupa por ti. Sin promesas vacías, solo resultados
            visibles.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={openAdvisor}
              className="inline-block bg-[#ea899a] text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-[#d37989] transition-transform transform hover:scale-105 flex items-center"
            >
              {" "}
              <SparklesIcon className="w-5 h-5 mr-2" /> Recibir orientación
              honesta{" "}
            </button>
            <Link
              to="/servicios"
              className="inline-block bg-white text-[#ea899a] font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
            >
              {" "}
              Ver Tratamientos{" "}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Soluciones Reales para Problemas Reales
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No vendemos tratamientos, ofrecemos un camino honesto para
              recuperar tu confianza.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {featuredServices.map((service) => (
              <div
                key={service.name}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
              >
                <img
                  className="h-56 w-full object-cover"
                  src={service.img}
                  alt={service.name}
                />
                <div className="p-6">
                  {" "}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.name}
                  </h3>{" "}
                  <p className="mt-2 text-gray-600">{service.desc}</p>{" "}
                  <Link
                    to="/servicios"
                    className="mt-4 text-[#ea899a] hover:text-[#d37989] font-semibold"
                  >
                    Ver cómo funciona &rarr;
                  </Link>{" "}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Historias Reales de Personas Como Tú
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ellas también se sentían inseguras. Hoy, su piel refleja su
              verdadera luz.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-gray-50 p-8 rounded-lg shadow-sm"
              >
                {" "}
                <div className="flex items-center mb-4">
                  {" "}
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-[#ea899a]" />
                  ))}{" "}
                </div>{" "}
                <blockquote className="text-gray-600 italic">
                  "{testimonial.quote}"
                </blockquote>{" "}
                <p className="mt-4 font-bold text-gray-900">
                  - {testimonial.name}
                </p>{" "}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            {" "}
            <Link
              to="/testimonios"
              className="text-[#ea899a] hover:text-[#d37989] font-semibold"
            >
              Leer más historias de confianza &rarr;
            </Link>{" "}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
