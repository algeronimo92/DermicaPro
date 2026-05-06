import React, { useState, useEffect } from 'react';
import { captureAllUTM } from '../utils/trackingHelper';

const NOMBRE_PUESTO = 'Practicante Filmmaker';
const WEBHOOK_URL = 'https://dermica-pro-n8n.rcsgeg.easypanel.host/webhook/postulacion-filmmaker';
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
  /* Hero: fondo oscuro marron-rosa (#2d1520), blanco = 15:1 ✅ */
  .dp-bg-primary { background-color: var(--hero-bg); }
  .dp-bg-primary-light { background-color: var(--primary-light); }
  /* Botón: rosa fondo + texto OSCURO = 5.97:1 ✅ */
  .dp-bg-cta { background-color: var(--cta-bg); color: var(--cta-btn-text); }
  .dp-bg-cta:hover { background-color: var(--cta-bg-hover); color: var(--cta-btn-text); }
  /* Texto rosa en fondo claro: #9b2c47 = 7.4:1 en blanco ✅ */
  .dp-text-primary { color: var(--accent-on-dark); }
  .dp-text-cta { color: var(--accent-on-light); }
  .dp-text-main { color: var(--text-main); }
  .dp-text-secondary { color: var(--text-secondary); }
  .dp-border-cta { border-color: var(--cta-bg); }
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
      if (!value.trim()) return 'Ingresa el link de tu portafolio / reel';
      try { new URL(value.trim()); return ''; } catch { return 'Ingresa un link válido'; }
    case 'pretensiones':
      return !value.trim() ? 'Ingresa tus pretensiones salariales' : '';
    default:
      return '';
  }
};

function PracticantesFilmmakerPostulacionPage() {
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
    experiencia_ciclo: '',
    camara_manejo: [],
    contenido_previo: '',
    disponibilidad: '',
    motivacion_cine: '',
    proyecto_propio: '',
    conocimiento_equipos: '',
    manejo_revision: '',
    interes_estetica: '',
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
    if (!clasificacion.experiencia_ciclo) errs.experiencia_ciclo = 'Selecciona una opción';
    if (clasificacion.camara_manejo.length === 0) errs.camara_manejo = 'Selecciona al menos una opción';
    if (!clasificacion.contenido_previo) errs.contenido_previo = 'Selecciona una opción';
    if (!clasificacion.disponibilidad) errs.disponibilidad = 'Selecciona una opción';
    if (!clasificacion.motivacion_cine || clasificacion.motivacion_cine.trim().length < 20) errs.motivacion_cine = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.proyecto_propio || clasificacion.proyecto_propio.trim().length < 20) errs.proyecto_propio = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.conocimiento_equipos || clasificacion.conocimiento_equipos.trim().length < 20) errs.conocimiento_equipos = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.manejo_revision || clasificacion.manejo_revision.trim().length < 20) errs.manejo_revision = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.interes_estetica || clasificacion.interes_estetica.trim().length < 20) errs.interes_estetica = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
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
        setClasificacion({ experiencia_ciclo: '', camara_manejo: [], contenido_previo: '', disponibilidad: '', motivacion_cine: '', proyecto_propio: '', conocimiento_equipos: '', manejo_revision: '', interes_estetica: '' });
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
            Practicante <span style={{color: 'var(--accent-on-dark)'}}>Filmmaker</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Buscamos practicantes apasionados por el video y la narrativa visual para crear contenido que inspire en redes sociales.
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
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ),
                  title: 'Ambiente joven y creativo',
                  desc: 'Trabajarás con un equipo dinámico que valora tus ideas y te da espacio para experimentar con el contenido.',
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  ),
                  title: 'Crecimiento real',
                  desc: 'Tus videos llegan a miles de personas. Construirás un portafolio sólido con proyectos de una marca real.',
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  ),
                  title: 'Capacitación continua',
                  desc: 'Aprenderás técnicas de producción para redes sociales, tendencias de contenido y narrativa audiovisual de marca.',
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
            <h2 className="text-3xl font-bold dp-text-main text-center mb-10">
              Buscamos a alguien que...
            </h2>
            <ul className="space-y-4">
              {[
                'Sea estudiante de Comunicaciones, Artes Visuales, Cine o carrera afín.',
                'Tenga manejo básico de cámara (DSLR, mirrorless o incluso smartphone).',
                'Sienta pasión por contar historias a través del video y el contenido digital.',
                'Tenga disponibilidad mínima de 4 horas diarias para trabajar con el equipo.',
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
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Carlos" className={inputClass('nombre')} />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium dp-text-secondary mb-1">Apellido *</label>
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Ramirez" className={inputClass('apellido')} />
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
                <label className="block text-sm font-medium dp-text-secondary mb-1">Link de portafolio / reel *</label>
                <input type="url" name="portafolio" value={formData.portafolio} onChange={handleChange} onBlur={handleBlur} placeholder="https://youtube.com/... o link de trabajos" className={inputClass('portafolio')} />
                {errors.portafolio && <p className="text-red-500 text-xs mt-1">{errors.portafolio}</p>}
              </div>

              {/* Pretensiones */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">Pretensiones salariales *</label>
                <input type="text" name="pretensiones" value={formData.pretensiones} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: S/ 800 mensuales" className={inputClass('pretensiones')} />
                {errors.pretensiones && <p className="text-red-500 text-xs mt-1">{errors.pretensiones}</p>}
              </div>

              <hr className="border-gray-200" />
              <p className="text-sm font-semibold dp-text-main">Preguntas de clasificación</p>

              {/* Ciclo de estudios */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿En qué ciclo de estudios estás? *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['1ro-4to ciclo', '5to-8vo ciclo', '9no-10mo ciclo', 'Egresado'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.experiencia_ciclo === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="experiencia_ciclo" checked={clasificacion.experiencia_ciclo === opt} onChange={() => handleRadio('experiencia_ciclo', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.experiencia_ciclo && <p className="text-red-500 text-xs mt-1">{errors.experiencia_ciclo}</p>}
              </div>

              {/* Cámara */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Qué cámara manejas? (puedes marcar varias) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['DSLR', 'Mirrorless', 'Celular profesional', 'No tengo aún'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.camara_manejo.includes(opt) ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="checkbox" checked={clasificacion.camara_manejo.includes(opt)} onChange={() => handleCheckbox('camara_manejo', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.camara_manejo && <p className="text-red-500 text-xs mt-1">{errors.camara_manejo}</p>}
              </div>

              {/* Contenido previo */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Has producido contenido para redes sociales? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Sí, para marcas', 'Sí, contenido personal', 'No aún'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.contenido_previo === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="contenido_previo" checked={clasificacion.contenido_previo === opt} onChange={() => handleRadio('contenido_previo', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.contenido_previo && <p className="text-red-500 text-xs mt-1">{errors.contenido_previo}</p>}
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
                <label className="block text-sm font-medium dp-text-secondary mb-1">1. ¿Qué te llevó a estudiar comunicaciones o cine? ¿Qué tipo de contenido quieres crear en el futuro? *</label>
                <textarea rows={3} value={clasificacion.motivacion_cine} onChange={e => handlePregunta('motivacion_cine', e.target.value)} placeholder="Cuéntanos tu historia y hacia dónde quieres llevar tu carrera..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.motivacion_cine ? 'border-red-500' : clasificacion.motivacion_cine ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.motivacion_cine && <p className="text-red-500 text-xs mt-1">{errors.motivacion_cine}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">2. ¿Has filmado algún proyecto propio o encargo, aunque sea pequeño? ¿Qué aprendiste de esa experiencia? *</label>
                <textarea rows={3} value={clasificacion.proyecto_propio} onChange={e => handlePregunta('proyecto_propio', e.target.value)} placeholder="No importa el tamaño. Cuéntanos qué filmaste y qué aprendiste..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.proyecto_propio ? 'border-red-500' : clasificacion.proyecto_propio ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.proyecto_propio && <p className="text-red-500 text-xs mt-1">{errors.proyecto_propio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">3. ¿Qué equipos conoces o has usado (cámara, iluminación, audio)? Sé específico/a. *</label>
                <textarea rows={3} value={clasificacion.conocimiento_equipos} onChange={e => handlePregunta('conocimiento_equipos', e.target.value)} placeholder="Ej: Sony ZV-E10, ring light, micrófono de solapa, DJI Osmo..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.conocimiento_equipos ? 'border-red-500' : clasificacion.conocimiento_equipos ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.conocimiento_equipos && <p className="text-red-500 text-xs mt-1">{errors.conocimiento_equipos}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">4. Si el director te dice que la toma no quedó bien y hay que repetirla, ¿cómo reaccionas? *</label>
                <textarea rows={3} value={clasificacion.manejo_revision} onChange={e => handlePregunta('manejo_revision', e.target.value)} placeholder="Sé honesto/a sobre cómo manejas ese momento..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.manejo_revision ? 'border-red-500' : clasificacion.manejo_revision ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.manejo_revision && <p className="text-red-500 text-xs mt-1">{errors.manejo_revision}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">5. ¿Por qué te interesa hacer prácticas en una clínica de estética y no en otro tipo de empresa? *</label>
                <textarea rows={3} value={clasificacion.interes_estetica} onChange={e => handlePregunta('interes_estetica', e.target.value)} placeholder="¿Qué tiene DermicaPro o el sector salud/estética que te atrae?" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.interes_estetica ? 'border-red-500' : clasificacion.interes_estetica ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.interes_estetica && <p className="text-red-500 text-xs mt-1">{errors.interes_estetica}</p>}
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

export default PracticantesFilmmakerPostulacionPage;
