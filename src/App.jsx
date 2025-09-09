
// =================================================================================
// FILE: src/App.jsx
// =================================================================================
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ServiciosPage from './pages/ServiciosPage';
import ResultadosPage from './pages/ResultadosPage';
import NosotrosPage from './pages/NosotrosPage';
import TestimoniosPage from './pages/TestimoniosPage';
import ContactoPage from './pages/ContactoPage';
import ReservaPage from './pages/ReservaPage';
import HollywoodPeelPage from './pages/HollyWoodPeelPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GeminiSkinAdvisor from './components/GeminiSkinAdvisor';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';

export default function App() {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  
  return (
    <BrowserRouter>
        <div className="font-sans bg-white">
          <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`}</style>
          
          
          <main> {/* El padding-top se maneja en cada página para mayor control */}
            <Routes>
                <Route path="/" element={<HomePage openAdvisor={() => setIsAdvisorOpen(true)} />} />
                <Route path="/servicios" element={<ServiciosPage openAdvisor={() => setIsAdvisorOpen(true)} />} />
                <Route path="/resultados" element={<ResultadosPage />} />
                <Route path="/nosotros" element={<NosotrosPage />} />
                <Route path="/testimonios" element={<TestimoniosPage />} />
                <Route path="/contacto" element={<ContactoPage />} />
                <Route path="/reserva" element={<ReservaPage />} />
                <Route path="/hollywood-peel" element={<HollywoodPeelPage />} />
            </Routes>
          </main>

          <Footer />
          <GeminiSkinAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
          <FloatingWhatsAppButton />
        </div>
    </BrowserRouter>
  );
}
