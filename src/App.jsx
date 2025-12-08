// =================================================================================
// FILE: src/App.jsx
// =================================================================================
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import HomePage from "./pages/HomePage";
import ServiciosPage from "./pages/ServiciosPage";
import ResultadosPage from "./pages/ResultadosPage";
import NosotrosPage from "./pages/NosotrosPage";
import TestimoniosPage from "./pages/TestimoniosPage";
import ContactoPage from "./pages/ContactoPage";
import ReservaPage from "./pages/ReservaPage";
import HollywoodPeelPage from "./pages/HollywoodPeelPage";
import HifuLandingPage from "./pages/HifuLandingPage";
import BotoxLandingPage from "./pages/BotoxLandingPage";
import ReservasLandingPage from "./pages/ReservasLandingPage";
import HifuReservasPage from "./pages/HifuReservasPage";
import BotoxReservasPage from "./pages/BotoxReservasPage";
import HollywoodPeelReservasPage from "./pages/HollywoodPeelReservasPage";
import PoliticaPrivacidadPage from "./pages/PoliticaPrivacidadPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GeminiSkinAdvisor from "./components/GeminiSkinAdvisor";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import MetaPixel from "./components/MetaPixel";
import TikTokPixel from "./components/TikTokPixel";

export default function App() {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const location = useLocation();

  // Detectar si estamos en un subdominio de reservas
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isHifuSubdomain = hostname.includes('hf-reservas');
  const isBotoxSubdomain = hostname.includes('btx-reservas');
  const isHollywoodSubdomain = hostname.includes('hp-reservas');
  const isReservasSubdomain = isHifuSubdomain || isBotoxSubdomain || isHollywoodSubdomain;

  const hideLayout = [
    "/hollywood-peel-landing",
    "/hifu-landing",
    "/botox-landing",
    "/reservas-landing",
    "/hf-reservas",
    "/btx-reservas",
    "/hp-reservas"
  ];
  const shouldHideNavBar = hideLayout.includes(location.pathname) || isReservasSubdomain;

  // Determinar qué componente mostrar en la raíz según el subdominio
  let rootElement;
  if (isHifuSubdomain) {
    rootElement = <HifuReservasPage />;
  } else if (isBotoxSubdomain) {
    rootElement = <BotoxReservasPage />;
  } else if (isHollywoodSubdomain) {
    rootElement = <HollywoodPeelReservasPage />;
  } else {
    rootElement = <HomePage openAdvisor={() => setIsAdvisorOpen(true)} />;
  }

  return (
    <HelmetProvider>
      <div className="font-sans bg-white min-h-screen flex flex-col">
        <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`}</style>

        {/* Meta Pixel - Track PageView en cada cambio de ruta */}
        <MetaPixel />

        {/* TikTok Pixel - Track PageView en cada cambio de ruta */}
        <TikTokPixel />

        {!shouldHideNavBar && (
          <Navbar openAdvisor={() => setIsAdvisorOpen(true)} />
        )}

        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={rootElement}
            />
            <Route
              path="/servicios"
              element={
                <ServiciosPage openAdvisor={() => setIsAdvisorOpen(true)} />
              }
            />
            <Route path="/resultados" element={<ResultadosPage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/testimonios" element={<TestimoniosPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/reserva" element={<ReservaPage />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidadPage />} />
            <Route path="/hollywood-peel-landing" element={<HollywoodPeelPage />} />
            <Route path="/hifu-landing" element={<HifuLandingPage />} />
            <Route path="/botox-landing" element={<BotoxLandingPage />} />
            <Route path="/reservas-landing" element={<ReservasLandingPage />} />
            <Route path="/hf-reservas" element={<HifuReservasPage />} />
            <Route path="/btx-reservas" element={<BotoxReservasPage />} />
            <Route path="/hp-reservas" element={<HollywoodPeelReservasPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {!shouldHideNavBar && <Footer />}
        {!shouldHideNavBar && (
          <GeminiSkinAdvisor
            isOpen={isAdvisorOpen}
            onClose={() => setIsAdvisorOpen(false)}
          />
        )}
        {!shouldHideNavBar && <FloatingWhatsAppButton />}
      </div>
    </HelmetProvider>
  );
}
