// =================================================================================
// FILE: src/App.jsx
// =================================================================================
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ServiciosPage from "./pages/ServiciosPage";
import ResultadosPage from "./pages/ResultadosPage";
import NosotrosPage from "./pages/NosotrosPage";
import TestimoniosPage from "./pages/TestimoniosPage";
import ContactoPage from "./pages/ContactoPage";
import ReservaPage from "./pages/ReservaPage";
import HollywoodPeelPage from "./pages/HollyWoodPeelPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GeminiSkinAdvisor from "./components/GeminiSkinAdvisor";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";

export default function App() {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const location = useLocation();
  const hideLayout = ["/hollywood-peel"];
  const shouldHideNavBar = hideLayout.includes(location.pathname);

  return (
    <div className="font-sans bg-white">
      <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`}</style>

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
          <Route path="/hollywood-peel" element={<HollywoodPeelPage />} />
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
  );
}
