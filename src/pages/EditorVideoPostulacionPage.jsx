import React, { useState, useEffect } from 'react';
import { captureAllUTM } from '../utils/trackingHelper';

const NOMBRE_PUESTO = 'Editor de Videos';
const WEBHOOK_URL = 'https://dermica-pro-n8n.rcsgeg.easypanel.host/webhook/postulacion-editor-video';
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
      if (!value.trim()) return 'Ingresa el link de tu reel / portafolio';
      try { new URL(value.trim()); return ''; } catch { return 'Ingresa un link válido'; }
    case 'pretensiones':
      return !value.trim() ? 'Ingresa tus pretensiones salariales' : '';
    default:
      return '';
  }
};

function EditorVideoPostulacionPage() {
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
    anios_experiencia: '',
    software_dominado: [],
    sector_belleza: '',
    motion_graphics: '',
    modalidad: '',
    proyectos_activos: '',
    flujo_trabajo: '',
    manejo_feedback_negativo: '',
    experiencia_redes_detalle: '',
    gestion_multiples_proyectos: '',
    contenido_favorito: '',
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
    if (!clasificacion.anios_experiencia) errs.anios_experiencia = 'Selecciona una opción';
    if (clasificacion.software_dominado.length === 0) errs.software_dominado = 'Selecciona al menos una opción';
    if (!clasificacion.sector_belleza) errs.sector_belleza = 'Selecciona una opción';
    if (!clasificacion.motion_graphics) errs.motion_graphics = 'Selecciona una opción';
    if (!clasificacion.modalidad) errs.modalidad = 'Selecciona una opción';
    if (!clasificacion.proyectos_activos) errs.proyectos_activos = 'Selecciona una opción';
    if (!clasificacion.flujo_trabajo || clasificacion.flujo_trabajo.trim().length < 20) errs.flujo_trabajo = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.manejo_feedback_negativo || clasificacion.manejo_feedback_negativo.trim().length < 20) errs.manejo_feedback_negativo = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.experiencia_redes_detalle || clasificacion.experiencia_redes_detalle.trim().length < 20) errs.experiencia_redes_detalle = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.gestion_multiples_proyectos || clasificacion.gestion_multiples_proyectos.trim().length < 20) errs.gestion_multiples_proyectos = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.contenido_favorito || clasificacion.contenido_favorito.trim().length < 20) errs.contenido_favorito = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
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
        setClasificacion({ anios_experiencia: '', software_dominado: [], sector_belleza: '', motion_graphics: '', modalidad: '', proyectos_activos: '', flujo_trabajo: '', manejo_feedback_negativo: '', experiencia_redes_detalle: '', gestion_multiples_proyectos: '', contenido_favorito: '' });
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
            Editor de <span style={{color: 'var(--accent-on-dark)'}}>Videos</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Buscamos un editor de videos con experiencia real para crear contenido de alto impacto para nuestras campañas en redes sociales.
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
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                  ),
                  title: 'Contenido con alcance real',
                  desc: 'Tus ediciones llegarán a miles de seguidores en Instagram, TikTok y YouTube. Trabajo con impacto medible.',
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  ),
                  title: 'Crecimiento y autonomía',
                  desc: 'Tendrás libertad creativa para proponer estilos y formatos, con un equipo que valora tu criterio editorial.',
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  ),
                  title: 'Capacitación en tendencias',
                  desc: 'Acceso a recursos sobre tendencias de video en salud y estética, con feedback constante del equipo de marketing.',
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
                'Tenga mínimo 1 año de experiencia en edición de video profesional.',
                'Domine Premiere Pro y/o DaVinci Resolve con fluidez.',
                'Haya editado contenido para Instagram, TikTok o YouTube con buen rendimiento.',
                'Tenga conocimientos de motion graphics (deseable, no excluyente).',
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
              <p className="dp-text-secondary mt-2">Tu reel es lo más importante. Asegúrate de que el link funcione correctamente.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-lg p-8 space-y-5 border border-gray-100">
              {/* Nombre y Apellido */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium dp-text-secondary mb-1">Nombre *</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Andrés" className={inputClass('nombre')} />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium dp-text-secondary mb-1">Apellido *</label>
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Castillo" className={inputClass('apellido')} />
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

              {/* Portafolio - prominente para editor */}
              <div className="border-2 border-yellow-300 bg-yellow-50 rounded-xl p-4">
                <label className="block text-sm font-semibold dp-text-main mb-1">
                  Reel / Portafolio de edición *
                  <span className="ml-2 text-xs font-normal dp-text-secondary">(Este campo es lo más importante de tu postulación)</span>
                </label>
                <input type="url" name="portafolio" value={formData.portafolio} onChange={handleChange} onBlur={handleBlur} placeholder="https://youtube.com/... o link de Drive / Vimeo" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${errors.portafolio ? 'border-red-500' : formData.portafolio ? 'border-green-500' : 'border-yellow-300'}`} />
                {errors.portafolio && <p className="text-red-500 text-xs mt-1">{errors.portafolio}</p>}
              </div>

              {/* Pretensiones */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">Pretensiones salariales *</label>
                <input type="text" name="pretensiones" value={formData.pretensiones} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: S/ 1,500 mensuales" className={inputClass('pretensiones')} />
                {errors.pretensiones && <p className="text-red-500 text-xs mt-1">{errors.pretensiones}</p>}
              </div>

              <hr className="border-gray-200" />
              <p className="text-sm font-semibold dp-text-main">Preguntas de clasificación</p>

              {/* Años de experiencia */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Cuántos años de experiencia profesional tienes? *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Menos de 1 año', '1-2 años', '3-5 años', 'Más de 5 años'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.anios_experiencia === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="anios_experiencia" checked={clasificacion.anios_experiencia === opt} onChange={() => handleRadio('anios_experiencia', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.anios_experiencia && <p className="text-red-500 text-xs mt-1">{errors.anios_experiencia}</p>}
              </div>

              {/* Software dominado */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Qué software dominas? (puedes marcar varios) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Final Cut', 'CapCut avanzado'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.software_dominado.includes(opt) ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="checkbox" checked={clasificacion.software_dominado.includes(opt)} onChange={() => handleCheckbox('software_dominado', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.software_dominado && <p className="text-red-500 text-xs mt-1">{errors.software_dominado}</p>}
              </div>

              {/* Sector belleza */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Has editado para marcas de salud o estética? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Sí', 'No, pero en otras marcas', 'No'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.sector_belleza === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="sector_belleza" checked={clasificacion.sector_belleza === opt} onChange={() => handleRadio('sector_belleza', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.sector_belleza && <p className="text-red-500 text-xs mt-1">{errors.sector_belleza}</p>}
              </div>

              {/* Motion graphics */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Haces motion graphics o animaciones? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Sí, avanzado', 'Sí, básico', 'No'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.motion_graphics === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="motion_graphics" checked={clasificacion.motion_graphics === opt} onChange={() => handleRadio('motion_graphics', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.motion_graphics && <p className="text-red-500 text-xs mt-1">{errors.motion_graphics}</p>}
              </div>

              {/* Modalidad */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Modalidad de trabajo preferida? *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Remoto', 'Híbrido', 'Presencial'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.modalidad === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="modalidad" checked={clasificacion.modalidad === opt} onChange={() => handleRadio('modalidad', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.modalidad && <p className="text-red-500 text-xs mt-1">{errors.modalidad}</p>}
              </div>

              {/* Proyectos activos */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Cuántos proyectos activos tienes actualmente? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Ninguno (disponibilidad completa)', '1-2 proyectos', '3-5 proyectos', 'Más de 5'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.proyectos_activos === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="proyectos_activos" checked={clasificacion.proyectos_activos === opt} onChange={() => handleRadio('proyectos_activos', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.proyectos_activos && <p className="text-red-500 text-xs mt-1">{errors.proyectos_activos}</p>}
              </div>

              <hr className="border-gray-200" />
              <div>
                <p className="text-sm font-semibold dp-text-main">Preguntas de evaluación</p>
                <p className="text-xs dp-text-secondary mt-1">Tómate tu tiempo. Estas respuestas son lo más importante para nosotros.</p>
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">1. ¿Qué software dominas y cuál es tu flujo de trabajo desde que recibes el material en bruto hasta entregar el video? *</label>
                <textarea rows={3} value={clasificacion.flujo_trabajo} onChange={e => handlePregunta('flujo_trabajo', e.target.value)} placeholder="Describe paso a paso tu proceso de edición habitual..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.flujo_trabajo ? 'border-red-500' : clasificacion.flujo_trabajo ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.flujo_trabajo && <p className="text-red-500 text-xs mt-1">{errors.flujo_trabajo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">2. Cuando el cliente pide cambios en algo que tú considerabas bien hecho, ¿cómo reaccionas? *</label>
                <textarea rows={3} value={clasificacion.manejo_feedback_negativo} onChange={e => handlePregunta('manejo_feedback_negativo', e.target.value)} placeholder="Sé honesto/a. ¿Qué sientes y qué haces en ese momento?" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.manejo_feedback_negativo ? 'border-red-500' : clasificacion.manejo_feedback_negativo ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.manejo_feedback_negativo && <p className="text-red-500 text-xs mt-1">{errors.manejo_feedback_negativo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">3. ¿Has editado contenido para redes sociales? ¿Qué formatos y plataformas manejas mejor? *</label>
                <textarea rows={3} value={clasificacion.experiencia_redes_detalle} onChange={e => handlePregunta('experiencia_redes_detalle', e.target.value)} placeholder="Ej: Reels de Instagram de 15-30s, TikToks educativos, Shorts de YouTube..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.experiencia_redes_detalle ? 'border-red-500' : clasificacion.experiencia_redes_detalle ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.experiencia_redes_detalle && <p className="text-red-500 text-xs mt-1">{errors.experiencia_redes_detalle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">4. ¿Cómo gestionas cuando tienes varios proyectos con fechas de entrega al mismo tiempo? *</label>
                <textarea rows={3} value={clasificacion.gestion_multiples_proyectos} onChange={e => handlePregunta('gestion_multiples_proyectos', e.target.value)} placeholder="Cuéntanos tu método para organizarte y no perder calidad bajo presión..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.gestion_multiples_proyectos ? 'border-red-500' : clasificacion.gestion_multiples_proyectos ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.gestion_multiples_proyectos && <p className="text-red-500 text-xs mt-1">{errors.gestion_multiples_proyectos}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">5. ¿Qué tipo de contenido te genera más energía creativa y por qué? *</label>
                <textarea rows={3} value={clasificacion.contenido_favorito} onChange={e => handlePregunta('contenido_favorito', e.target.value)} placeholder="Ej: testimonios reales, tutoriales, antes/después, contenido emocional..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.contenido_favorito ? 'border-red-500' : clasificacion.contenido_favorito ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.contenido_favorito && <p className="text-red-500 text-xs mt-1">{errors.contenido_favorito}</p>}
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

export default EditorVideoPostulacionPage;
