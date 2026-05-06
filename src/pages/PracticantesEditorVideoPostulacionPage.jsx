import React, { useState, useEffect } from 'react';
import { captureAllUTM } from '../utils/trackingHelper';

const NOMBRE_PUESTO = 'Practicante Editor de Videos';
const WEBHOOK_URL = 'https://dermica-pro-n8n.rcsgeg.easypanel.host/webhook/postulacion-editor-practicante';
const WHATSAPP_ERROR = '+51974637783';

const customCss = `
  :root {
    --primary: #ea899a; --primary-light: #fde8ed; --primary-dark: #d37989;
    --hero-bg: #2d1520;
    --accent-on-light: #9b2c47;
    --accent-on-dark:  #ea899a;
    --cta-bg: #ea899a; --cta-bg-hover: #d37989; --cta-btn-text: #1f2937;
    --background-light: #FFFFFF; --background-medium: #fdf4f6;
    --text-main: #374151; --text-secondary: #6B7280;
  }
  .dp-bg-primary { background-color: var(--hero-bg); }
  .dp-bg-primary-light { background-color: var(--primary-light); }
  .dp-bg-cta { background-color: var(--cta-bg); color: var(--cta-btn-text); }
  .dp-bg-cta:hover { background-color: var(--cta-bg-hover); color: var(--cta-btn-text); }
  .dp-text-primary { color: var(--accent-on-dark); }
  .dp-text-cta { color: var(--accent-on-light); }
  .dp-text-main { color: var(--text-main); }
  .dp-text-secondary { color: var(--text-secondary); }
  @keyframes dp-fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .dp-fade-in { animation: dp-fadeInUp 0.7s ease-out forwards; }
  @keyframes dp-form-glow { 0% { box-shadow: 0 0 0 0 rgba(234,137,154,0.6); } 70% { box-shadow: 0 0 0 14px rgba(234,137,154,0); } 100% { box-shadow: 0 0 0 0 rgba(234,137,154,0); } }
  .dp-form-highlight { animation: dp-form-glow 1.5s ease-out; }
`;

const validateField = (name, value) => {
  switch (name) {
    case 'nombre':
    case 'apellido':
      return value.trim().length < 2 ? 'Mínimo 2 caracteres' : '';
    case 'telefono':
      return !/^[0-9]{9}$/.test(value.trim()) ? '9 dígitos requeridos' : '';
    case 'email':
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? 'Email inválido' : '';
    case 'dni':
      return !/^[0-9]{8}$/.test(value.trim()) ? '8 dígitos requeridos' : '';
    case 'curriculum':
      if (!value.trim()) return 'Ingresa el link de tu CV';
      try { new URL(value.trim()); return ''; } catch { return 'Ingresa un link válido (Google Drive, etc.)'; }
    case 'portafolio':
      if (!value.trim()) return 'Ingresa el link de tus trabajos de edición';
      try { new URL(value.trim()); return ''; } catch { return 'Ingresa un link válido'; }
    case 'pretensiones':
      return !value.trim() ? 'Ingresa tus pretensiones salariales' : '';
    default:
      return '';
  }
};

function PracticantesEditorVideoPostulacionPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    dni: '',
    curriculum: '',
    portafolio: '',
    pretensiones: '',
  });
  const [clasificacion, setClasificacion] = useState({
    software_edicion: [],
    ciclo_estudios: '',
    videos_semana: '',
    experiencia_marcas: '',
    disponibilidad: '',
    software_detalle: '',
    video_personal: '',
    horas_disponibles: '',
    expectativa_aprendizaje: '',
    accion_instrucciones_incompletas: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utmData, setUtmData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    setUtmData(captureAllUTM());
  }, []);

  useEffect(() => {
    const scrollToFormButtons = document.querySelectorAll('a[href="#postulacion-form"]');
    const formContainer = document.getElementById('postulacion-form');

    const handleScrollToForm = (e) => {
      e.preventDefault();
      if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        formContainer.classList.remove('dp-form-highlight');
        void formContainer.offsetWidth;
        formContainer.classList.add('dp-form-highlight');
      }
    };

    scrollToFormButtons.forEach(btn => btn.addEventListener('click', handleScrollToForm));
    return () => scrollToFormButtons.forEach(btn => btn.removeEventListener('click', handleScrollToForm));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processed = value;
    if (name === 'nombre' || name === 'apellido') {
      processed = value.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
    } else if (name === 'telefono' || name === 'dni') {
      processed = value.replace(/[^0-9]/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: processed }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, processed) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleRadio = (group, value) => {
    setClasificacion(prev => ({ ...prev, [group]: value }));
    if (errors[group]) setErrors(prev => ({ ...prev, [group]: '' }));
  };

  const handleCheckbox = (group, value) => {
    setClasificacion(prev => {
      const current = prev[group];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [group]: updated };
    });
    if (errors[group]) setErrors(prev => ({ ...prev, [group]: '' }));
  };

  const handlePregunta = (name, value) => {
    setClasificacion(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateClasificacion = () => {
    const errs = {};
    if (clasificacion.software_edicion.length === 0) errs.software_edicion = 'Selecciona al menos una opción';
    if (!clasificacion.ciclo_estudios) errs.ciclo_estudios = 'Selecciona una opción';
    if (!clasificacion.videos_semana) errs.videos_semana = 'Selecciona una opción';
    if (!clasificacion.experiencia_marcas) errs.experiencia_marcas = 'Selecciona una opción';
    if (!clasificacion.disponibilidad) errs.disponibilidad = 'Selecciona una opción';
    if (!clasificacion.software_detalle || clasificacion.software_detalle.trim().length < 20) errs.software_detalle = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.video_personal || clasificacion.video_personal.trim().length < 20) errs.video_personal = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.horas_disponibles || clasificacion.horas_disponibles.trim().length < 10) errs.horas_disponibles = 'Por favor indica tu disponibilidad';
    if (!clasificacion.expectativa_aprendizaje || clasificacion.expectativa_aprendizaje.trim().length < 20) errs.expectativa_aprendizaje = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.accion_instrucciones_incompletas || clasificacion.accion_instrucciones_incompletas.trim().length < 20) errs.accion_instrucciones_incompletas = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldErrors = Object.keys(formData).reduce((acc, key) => {
      const err = validateField(key, formData[key]);
      if (err) acc[key] = err;
      return acc;
    }, {});
    const clasifErrors = validateClasificacion();
    const allErrors = { ...fieldErrors, ...clasifErrors };
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        telefono: `+51${formData.telefono}`,
        ...Object.fromEntries(
          Object.entries(clasificacion).map(([k, v]) => [
            k,
            Array.isArray(v) ? v.join(', ') : v,
          ])
        ),
        puesto: NOMBRE_PUESTO,
        landing_url: window.location.href,
        timestamp: new Date().toISOString(),
        ...Object.fromEntries(Object.entries(utmData).filter(([, v]) => v)),
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        setModalType('success');
        setShowModal(true);
        setFormData({ nombre: '', apellido: '', telefono: '', email: '', dni: '', curriculum: '', portafolio: '', pretensiones: '' });
        setClasificacion({ software_edicion: [], ciclo_estudios: '', videos_semana: '', experiencia_marcas: '', disponibilidad: '', software_detalle: '', video_personal: '', horas_disponibles: '', expectativa_aprendizaje: '', accion_instrucciones_incompletas: '' });
        setErrors({});
      } else {
        setModalType('error');
        setShowModal(true);
      }
    } catch {
      setModalType('error');
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
      errors[field] ? 'border-red-500' : formData[field] ? 'border-green-500' : 'border-gray-300'
    }`;

  return (
    <div className="antialiased font-sans bg-gray-50 min-h-screen">
      <style>{customCss}</style>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center" onClick={e => e.stopPropagation()}>
            {modalType === 'success' ? (
              <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold dp-text-main mb-2">¡Postulación enviada!</h3>
                <p className="dp-text-secondary mb-6">Revisaremos tu perfil y te contactaremos por WhatsApp si avanzas en el proceso. ¡Mucho éxito!</p>
                <button onClick={() => setShowModal(false)} className="w-full dp-bg-cta  font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold dp-text-main mb-2">¡Ups! Algo salió mal</h3>
                <p className="dp-text-secondary mb-6">No pudimos enviar tu postulación. Por favor escríbenos directamente por WhatsApp.</p>
                <a
                  href={`https://wa.me/${WHATSAPP_ERROR.replace(/\D/g, '')}?text=Hola%2C%20quiero%20postular%20a%20${encodeURIComponent(NOMBRE_PUESTO)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 mb-2"
                >
                  Escribir por WhatsApp
                </a>
                <button onClick={() => setShowModal(false)} className="w-full text-gray-500 hover:text-gray-700 font-medium py-2">
                  Intentar de nuevo
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <header className="dp-bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="mb-6">
            <span className="inline-block bg-white bg-opacity-10 text-white text-sm font-semibold px-4 py-1 rounded-full uppercase tracking-wider">DermicaPro - Estamos contratando</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Practicante <span style={{color: 'var(--accent-on-dark)'}}>Editor de Videos</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            ¿Tienes ojo para los cortes, los colores y la música? Únete como practicante y edita contenido que ven miles de personas.
          </p>
          <a href="#postulacion-form" className="inline-block dp-bg-cta  font-bold py-4 px-10 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg">
            Postular Ahora
          </a>
        </div>
      </header>

      <main>
        {/* POR QUÉ DERMICAPRO */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-3xl font-bold dp-text-main text-center mb-12">
              ¿Por qué unirte a <span className="dp-text-cta">DermicaPro</span>?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.069A1 1 0 0121 8.882V15.118a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  ),
                  title: 'Proyectos reales desde el día 1',
                  desc: 'Tus ediciones aparecerán en Instagram, TikTok y YouTube con alcance real, no solo en ejercicios de práctica.',
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  ),
                  title: 'Crecimiento acelerado',
                  desc: 'Aprenderás de proyectos variados: reels, testimonios, antes/después y contenido educativo de salud y estética.',
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  ),
                  title: 'Feedback y capacitación',
                  desc: 'Recibirás feedback concreto en cada entrega y acceso a recursos sobre las tendencias de contenido en redes.',
                },
              ].map((b, i) => (
                <div key={i} className="dp-bg-primary-light rounded-xl p-8 text-center">
                  <div className="flex justify-center mb-4 dp-text-cta">{b.icon}</div>
                  <h3 className="text-xl font-bold dp-text-main mb-2">{b.title}</h3>
                  <p className="dp-text-secondary">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REQUISITOS */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl font-bold dp-text-main text-center mb-10">Buscamos a alguien que...</h2>
            <ul className="space-y-4">
              {[
                'Sea estudiante de Comunicaciones, Diseño o carrera afín.',
                'Tenga conocimiento básico de Premiere Pro, DaVinci Resolve o CapCut.',
                'Sienta interés genuino por las redes sociales y el contenido digital.',
                'Esté disponible para trabajar con el equipo y entregar a tiempo.',
              ].map((req, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                  <span className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 dp-text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span className="dp-text-main">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FORMULARIO */}
        <section id="postulacion-form" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold dp-text-main">Envía tu postulación</h2>
              <p className="dp-text-secondary mt-2">Completa el formulario y nos pondremos en contacto si tu perfil avanza.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-lg p-8 space-y-5 border border-gray-100">
              {/* Nombre y Apellido */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium dp-text-secondary mb-1">Nombre *</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Lucía" className={inputClass('nombre')} />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium dp-text-secondary mb-1">Apellido *</label>
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Torres" className={inputClass('apellido')} />
                  {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
                </div>
              </div>

              {/* Teléfono y DNI */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium dp-text-secondary mb-1">Teléfono (WhatsApp) *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg text-sm">+51</span>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} onBlur={handleBlur} placeholder="987 654 321" maxLength="9" className={`w-full px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${errors.telefono ? 'border-red-500' : formData.telefono ? 'border-green-500' : 'border-gray-300'}`} />
                  </div>
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium dp-text-secondary mb-1">DNI *</label>
                  <input type="text" name="dni" value={formData.dni} onChange={handleChange} onBlur={handleBlur} placeholder="12345678" maxLength="8" className={inputClass('dni')} />
                  {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">Correo electrónico *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="ejemplo@correo.com" className={inputClass('email')} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Curriculum */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">Link de CV (Google Drive, Dropbox, etc.) *</label>
                <input type="url" name="curriculum" value={formData.curriculum} onChange={handleChange} onBlur={handleBlur} placeholder="https://drive.google.com/..." className={inputClass('curriculum')} />
                {errors.curriculum && <p className="text-red-500 text-xs mt-1">{errors.curriculum}</p>}
              </div>

              {/* Portafolio */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">Link a trabajos de edición *</label>
                <input type="url" name="portafolio" value={formData.portafolio} onChange={handleChange} onBlur={handleBlur} placeholder="https://drive.google.com/... o link de YouTube/Vimeo" className={inputClass('portafolio')} />
                {errors.portafolio && <p className="text-red-500 text-xs mt-1">{errors.portafolio}</p>}
              </div>

              {/* Pretensiones */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">Pretensiones salariales *</label>
                <input type="text" name="pretensiones" value={formData.pretensiones} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: S/ 700 mensuales" className={inputClass('pretensiones')} />
                {errors.pretensiones && <p className="text-red-500 text-xs mt-1">{errors.pretensiones}</p>}
              </div>

              <hr className="border-gray-200" />
              <p className="text-sm font-semibold dp-text-main">Preguntas de clasificación</p>

              {/* Software de edición */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Qué software de edición usas? (puedes marcar varios) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Premiere Pro', 'DaVinci Resolve', 'CapCut', 'After Effects', 'Final Cut', 'Otro'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.software_edicion.includes(opt) ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="checkbox" checked={clasificacion.software_edicion.includes(opt)} onChange={() => handleCheckbox('software_edicion', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.software_edicion && <p className="text-red-500 text-xs mt-1">{errors.software_edicion}</p>}
              </div>

              {/* Ciclo de estudios */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿En qué ciclo de estudios estás? *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['1ro-4to ciclo', '5to-8vo ciclo', '9no-10mo ciclo', 'Egresado'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.ciclo_estudios === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="ciclo_estudios" checked={clasificacion.ciclo_estudios === opt} onChange={() => handleRadio('ciclo_estudios', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.ciclo_estudios && <p className="text-red-500 text-xs mt-1">{errors.ciclo_estudios}</p>}
              </div>

              {/* Videos por semana */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Cuántos videos editas por semana aprox.? *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Ninguno aún', '1-3 videos', '4-7 videos', 'Más de 7'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.videos_semana === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="videos_semana" checked={clasificacion.videos_semana === opt} onChange={() => handleRadio('videos_semana', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.videos_semana && <p className="text-red-500 text-xs mt-1">{errors.videos_semana}</p>}
              </div>

              {/* Experiencia para marcas */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Tienes experiencia editando para marcas? *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Sí', 'No'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.experiencia_marcas === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="experiencia_marcas" checked={clasificacion.experiencia_marcas === opt} onChange={() => handleRadio('experiencia_marcas', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.experiencia_marcas && <p className="text-red-500 text-xs mt-1">{errors.experiencia_marcas}</p>}
              </div>

              {/* Disponibilidad */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Disponibilidad horaria? *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Mañanas', 'Tardes', 'Tiempo completo'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.disponibilidad === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="disponibilidad" checked={clasificacion.disponibilidad === opt} onChange={() => handleRadio('disponibilidad', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.disponibilidad && <p className="text-red-500 text-xs mt-1">{errors.disponibilidad}</p>}
              </div>

              <hr className="border-gray-200" />
              <div>
                <p className="text-sm font-semibold dp-text-main">Preguntas de evaluación</p>
                <p className="text-xs dp-text-secondary mt-1">Tómate tu tiempo. Estas respuestas son lo más importante para nosotros.</p>
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">1. ¿Qué software de edición conoces, aunque sea a nivel básico? ¿Con cuál te sientes más cómodo/a? *</label>
                <textarea rows={3} value={clasificacion.software_detalle} onChange={e => handlePregunta('software_detalle', e.target.value)} placeholder="Cuéntanos qué has usado, cuánto tiempo y qué tipo de proyectos has hecho con él..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.software_detalle ? 'border-red-500' : clasificacion.software_detalle ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.software_detalle && <p className="text-red-500 text-xs mt-1">{errors.software_detalle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">2. ¿Has editado algún video, aunque sea para uso personal o académico? Cuéntanos qué hiciste. *</label>
                <textarea rows={3} value={clasificacion.video_personal} onChange={e => handlePregunta('video_personal', e.target.value)} placeholder="No importa si fue pequeño. Describe qué editaste y qué aprendiste en el proceso..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.video_personal ? 'border-red-500' : clasificacion.video_personal ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.video_personal && <p className="text-red-500 text-xs mt-1">{errors.video_personal}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">3. ¿Cuántas horas semanales podrías dedicar a las prácticas y en qué horario? *</label>
                <textarea rows={2} value={clasificacion.horas_disponibles} onChange={e => handlePregunta('horas_disponibles', e.target.value)} placeholder="Ej: Podría dedicar 20 horas semanales, de lunes a viernes de 2pm a 6pm..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.horas_disponibles ? 'border-red-500' : clasificacion.horas_disponibles ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.horas_disponibles && <p className="text-red-500 text-xs mt-1">{errors.horas_disponibles}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">4. ¿Qué esperas aprender específicamente durante estas prácticas? *</label>
                <textarea rows={3} value={clasificacion.expectativa_aprendizaje} onChange={e => handlePregunta('expectativa_aprendizaje', e.target.value)} placeholder="Sé específico/a. ¿Qué habilidades quieres llevarte al terminar?" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.expectativa_aprendizaje ? 'border-red-500' : clasificacion.expectativa_aprendizaje ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.expectativa_aprendizaje && <p className="text-red-500 text-xs mt-1">{errors.expectativa_aprendizaje}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">5. Si te dan un video para editar pero las instrucciones no quedaron claras, ¿qué haces? *</label>
                <textarea rows={3} value={clasificacion.accion_instrucciones_incompletas} onChange={e => handlePregunta('accion_instrucciones_incompletas', e.target.value)} placeholder="Cuéntanos tu reacción y los pasos que seguirías..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.accion_instrucciones_incompletas ? 'border-red-500' : clasificacion.accion_instrucciones_incompletas ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.accion_instrucciones_incompletas && <p className="text-red-500 text-xs mt-1">{errors.accion_instrucciones_incompletas}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full dp-bg-cta  font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2">
                {isSubmitting ? 'Enviando postulación...' : 'Enviar mi postulación'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Al enviar, aceptas nuestra{' '}
                <a href="/politica-privacidad" className="underline hover:text-gray-600">Política de Privacidad</a>.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="dp-bg-primary text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="font-semibold text-white mb-1">DermicaPro</p>
          <p className="text-sm">Av. Larco 877, Trujillo, Perú &nbsp;|&nbsp; +51 974 637 783</p>
          <p className="text-xs mt-3">&copy; {new Date().getFullYear()} DermicaPro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default PracticantesEditorVideoPostulacionPage;
