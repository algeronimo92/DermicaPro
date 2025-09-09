// =================================================================================
// FILE: src/components/Footer.jsx
// =================================================================================
import React, { useEffect } from "react";
import PhoneIcon from "./icons/PhoneIcon";
import MailIcon from "./icons/MailIcon";
import MapPinIcon from "./icons/MapPinIcon";
import { Link } from "react-router-dom";
const Footer = () => {
  const socialLinks = [
    { name: "Facebook", url: "#", icon: "fab fa-facebook-f" },
    { name: "Instagram", url: "#", icon: "fab fa-instagram" },
    { name: "WhatsApp", url: "#", icon: "fab fa-whatsapp" },
  ];
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
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
                <Link
                  to="/"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Inicio
                </Link>
              </li>{" "}
              <li>
                <Link
                  to="/servicios"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Tratamientos
                </Link>
              </li>{" "}
              <li>
                <Link
                  to="/nosotros"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Nuestra Filosofía
                </Link>
              </li>{" "}
              <li>
                <Link
                  to="/contacto"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Contacto
                </Link>
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
                <span>Av. Larco 877, Trujillo, Perú</span>
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
                  href={link.url}
                  className="text-gray-400 hover:text-[#ea899a]"
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
