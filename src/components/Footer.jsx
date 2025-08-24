// =================================================================================
// FILE: src/components/Footer.jsx
// =================================================================================
import React, { useEffect } from "react";
import PhoneIcon from "./icons/PhoneIcon";
import MailIcon from "./icons/MailIcon";
import MapPinIcon from "./icons/MapPinIcon";
const Footer = ({ setPage }) => {
  const handleWhatsAppClick = (e) => {
    e?.preventDefault?.();
    const phone = "51974637783";
    const message = "Hola, quisiera agendar una evaluación en DermicaPro.";
    const appUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
      message
    )}`;
    const webUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Intenta abrir la app
    window.location.href = appUrl;

    // Si después de un tiempo no se ha cambiado de pestaña, abre la web
    setTimeout(() => {
      window.open(webUrl, "_blank");
    }, 2500);
  };

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/people/DermicaPro/61570893266230/",
      icon: "fab fa-facebook-f",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/dermicapro/",
      icon: "fab fa-instagram",
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/51974637783?text=Hola,%20quisiera%20agendar%20una%20evaluaci%C3%B3n%20en%20DermicaPro.",
      icon: "fab fa-whatsapp",
    },
  ];
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  const handleFooterNavClick = (e, page) => {
    e.preventDefault();
    setPage(page);
  };
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            {" "}
            <h3 className="text-xl font-bold">DermicaPro</h3>{" "}
            <p className="mt-2 text-gray-400 text-sm">
              Recuperando la confianza en tu piel.
            </p>{" "}
          </div>
          <div>
            {" "}
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-400">
              Navegación
            </h3>{" "}
            <ul className="mt-4 space-y-2">
              {" "}
              <li>
                <a
                  href="#"
                  onClick={(e) => handleFooterNavClick(e, "home")}
                  className="text-base text-gray-300 hover:text-white"
                >
                  Inicio
                </a>
              </li>{" "}
              <li>
                <a
                  href="#"
                  onClick={(e) => handleFooterNavClick(e, "servicios")}
                  className="text-base text-gray-300 hover:text-white"
                >
                  Tratamientos
                </a>
              </li>{" "}
              <li>
                <a
                  href="#"
                  onClick={(e) => handleFooterNavClick(e, "nosotros")}
                  className="text-base text-gray-300 hover:text-white"
                >
                  Nuestra Filosofía
                </a>
              </li>{" "}
              <li>
                <a
                  href="#"
                  onClick={(e) => handleFooterNavClick(e, "contacto")}
                  className="text-base text-gray-300 hover:text-white"
                >
                  Contacto
                </a>
              </li>{" "}
            </ul>{" "}
          </div>
          <div>
            {" "}
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-400">
              Contacto
            </h3>{" "}
            <ul className="mt-4 space-y-2 text-gray-300">
              {" "}
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 mr-2 mt-1 text-[#ea899a]" />
                <span>Av. Larco 893, San Andres V etapa, Trujillo, Perú</span>
              </li>{" "}
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-2 text-[#ea899a]" />
                <span>+51 974 637 783</span>
              </li>{" "}
              <li className="flex items-center">
                <MailIcon className="w-5 h-5 mr-2 text-[#ea899a]" />
                <span>contacto@dermicapro.com</span>
              </li>{" "}
            </ul>{" "}
          </div>
          <div>
            {" "}
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-400">
              Síguenos
            </h3>{" "}
            <div className="flex space-x-4 mt-4">
              {" "}
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.name === "WhatsApp" ? "#" : link.url}
                  target="_blank"
                  className="text-gray-400 hover:text-[#ea899a]"
                  onClick={(e) => {
                    if (link.name === "WhatsApp") {
                      handleWhatsAppClick(e)
                    }
                  }}
                >
                  {" "}
                  <span className="sr-only">{link.name}</span>{" "}
                  <i className={`${link.icon} fa-lg`}></i>{" "}
                </a>
              ))}{" "}
            </div>{" "}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          {" "}
          <p>
            &copy; {new Date().getFullYear()} DermicaPro. Todos los derechos
            reservados.
          </p>{" "}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
