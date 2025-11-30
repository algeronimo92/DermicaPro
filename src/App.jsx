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
import PoliticaPrivacidadPage from "./pages/PoliticaPrivacidadPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GeminiSkinAdvisor from "./components/GeminiSkinAdvisor";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import MetaPixel from "./components/MetaPixel";

export default function App() {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const location = useLocation();
  const hideLayout = ["/hollywood-peel-landing", "/hifu-landing", "/botox-landing"];
  const shouldHideNavBar = hideLayout.includes(location.pathname);

  return (
    <HelmetProvider>
      <div className="font-sans bg-white">
        <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`}</style>

        {/* Meta Pixel - Track PageView en cada cambio de ruta */}
        <MetaPixel />

        {!shouldHideNavBar && (
          <Navbar openAdvisor={() => setIsAdvisorOpen(true)} />
        )}

        <main>
          <Routes>
            <Route
              path="/"
              element={<HomePage openAdvisor={() => setIsAdvisorOpen(true)} />}
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
