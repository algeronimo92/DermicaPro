
// =================================================================================
// FILE: src/App.jsx
// =================================================================================
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ServiciosPage from './pages/ServiciosPage';
import ResultadosPage from './pages/ResultadosPage';
import NosotrosPage from './pages/NosotrosPage';
import TestimoniosPage from './pages/TestimoniosPage';
import ContactoPage from './pages/ContactoPage';
import ReservaPage from './pages/ReservaPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GeminiSkinAdvisor from './components/GeminiSkinAdvisor';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';

function App() {
  const [page, setPage] = useState('home');
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  // NOTA PARA UN PROYECTO REAL:
  // 1. Instala react-router-dom: `npm install react-router-dom`
  // 2. Borra el `useState` de `page` y la función `renderPage`.
  // 3. Importa los componentes de las páginas y el router (como en los comentarios de arriba).
  // 4. Reemplaza el contenido de `return` con el enrutador.
  
  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage setPage={setPage} openAdvisor={() => setIsAdvisorOpen(true)} />;
      case 'servicios': return <ServiciosPage openAdvisor={() => setIsAdvisorOpen(true)} />;
      case 'resultados': return <ResultadosPage />;
      case 'nosotros': return <NosotrosPage />;
      case 'testimonios': return <TestimoniosPage />;
      case 'contacto': return <ContactoPage />;
      case 'reserva': return <ReservaPage />;
      default: return <HomePage setPage={setPage} openAdvisor={() => setIsAdvisorOpen(true)} />;
    }
  };

  return (
    // EJEMPLO DE CÓMO SE VERÍA CON REACT-ROUTER-DOM:
    //
    // import { BrowserRouter, Routes, Route } from 'react-router-dom';
    //
    // <BrowserRouter>
    //   <Navbar openAdvisor={() => setIsAdvisorOpen(true)} /> {/* En Navbar, usa <Link> en vez de <a> */}
    //   <main>
    //     <Routes>
    //       <Route path="/" element={<HomePage openAdvisor={() => setIsAdvisorOpen(true)} />} />
    //       <Route path="/tratamientos" element={<ServiciosPage openAdvisor={() => setIsAdvisorOpen(true)} />} />
    //       <Route path="/casos-reales" element={<ResultadosPage />} />
    //       <Route path="/nuestra-filosofia" element={<NosotrosPage />} />
    //       <Route path="/testimonios" element={<TestimoniosPage />} />
    //       <Route path="/contacto" element={<ContactoPage />} />
    //       <Route path="/reserva" element={<ReservaPage />} />
    //     </Routes>
    //   </main>
    //   <Footer /> {/* En Footer, usa <Link> en vez de <a> */}
    //   <GeminiSkinAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
    // </BrowserRouter>

    <div className="font-sans bg-white">
      <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`}</style>
      <Navbar setPage={setPage} openAdvisor={() => setIsAdvisorOpen(true)} />
      <main>{renderPage()}</main>
      <Footer setPage={setPage} />
      <GeminiSkinAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default App;
