// =================================================================================
// FILE: src/components/Navbar.jsx
// =================================================================================
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ openAdvisor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navLinks = [
    { name: "Inicio", page: "/" },
    { name: "Tratamientos", page: "/servicios" },
    { name: "Casos Reales", page: "/resultados" },
    { name: "Nuestra Filosofía", page: "/nosotros" },
    { name: "Testimonios", page: "/testimonios" },
    { name: "Contacto", page: "/contacto" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            {" "}
            <Link
              to="/"
              className={`font-bold text-2xl ${
                isScrolled ? "text-gray-800" : "md:text-gray-800"
              }`}
            >
              DermicaPro
            </Link>{" "}
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.page}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isScrolled
                      ? "text-gray-700 hover:bg-[#ea899a] hover:text-white"
                      : "text-gray-500 hover:bg-[#ea899a] hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/reserva"
                className="ml-4 px-4 py-2 rounded-full text-sm font-medium text-white bg-[#ea899a] hover:bg-[#d37989] transition-transform transform hover:scale-105"
              >
                Agendar Evaluación
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {" "}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${
                isScrolled ? "text-gray-800" : "text-gray-800"
              }`}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>{" "}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.page}
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:bg-[#ea899a] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                openAdvisor();
                setIsOpen(false);
              }}
              className="w-full text-left text-gray-700 hover:bg-[#ea899a] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              ✨ Asesor Virtual
            </button>
            <Link
              to="/reserva"
              onClick={() => setIsOpen(false)}
              className="mt-2 block w-full text-center px-4 py-2 rounded-full text-sm font-medium text-white bg-[#ea899a] hover:bg-[#d37989]"
            >
              Agendar Evaluación
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
