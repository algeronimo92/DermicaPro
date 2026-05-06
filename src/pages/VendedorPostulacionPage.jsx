import React, { useState, useEffect } from 'react';
import { captureAllUTM } from '../utils/trackingHelper';

const NOMBRE_PUESTO = 'Asesor Comercial';
const WEBHOOK_URL = 'https://dermica-pro-n8n.rcsgeg.easypanel.host/webhook/postulacion-vendedor';
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
    case 'pretensiones':
      return !value.trim() ? 'Ingresa tus pretensiones salariales' : '';
    default:
      return '';
  }
};

function VendedorPostulacionPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    dni: '',
    curriculum: '',
    pretensiones: '',
  });
  const [clasificacion, setClasificacion] = useState({
    experiencia_ventas: '',
    sector_ventas: [],
    esquema_salarial: '',
    seguimiento_clientes: '',
    estilo_venta: '',
    disponibilidad: '',
    logro_ventas: '',
    manejo_rechazo: '',
    criterio_prioridad: '',
    motivacion_estetica: '',
    ejemplo_persuasion: '',
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
    if (!clasificacion.experiencia_ventas) errs.experiencia_ventas = 'Selecciona una opción';
    if (clasificacion.sector_ventas.length === 0) errs.sector_ventas = 'Selecciona al menos una opción';
    if (!clasificacion.esquema_salarial) errs.esquema_salarial = 'Selecciona una opción';
    if (!clasificacion.seguimiento_clientes) errs.seguimiento_clientes = 'Selecciona una opción';
    if (!clasificacion.estilo_venta) errs.estilo_venta = 'Selecciona una opción';
    if (!clasificacion.disponibilidad) errs.disponibilidad = 'Selecciona una opción';
    if (!clasificacion.logro_ventas || clasificacion.logro_ventas.trim().length < 20) errs.logro_ventas = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.manejo_rechazo || clasificacion.manejo_rechazo.trim().length < 20) errs.manejo_rechazo = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.criterio_prioridad || clasificacion.criterio_prioridad.trim().length < 20) errs.criterio_prioridad = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.motivacion_estetica || clasificacion.motivacion_estetica.trim().length < 20) errs.motivacion_estetica = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.ejemplo_persuasion || clasificacion.ejemplo_persuasion.trim().length < 20) errs.ejemplo_persuasion = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
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
        setFormData({ nombre: '', apellido: '', telefono: '', email: '', dni: '', curriculum: '', pretensiones: '' });
        setClasificacion({ experiencia_ventas: '', sector_ventas: [], esquema_salarial: '', seguimiento_clientes: '', estilo_venta: '', disponibilidad: '', logro_ventas: '', manejo_rechazo: '', criterio_prioridad: '', motivacion_estetica: '', ejemplo_persuasion: '' });
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
            Asesor <span style={{color: 'var(--accent-on-dark)'}}>Comercial</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            ¿Eres una persona con don de gentes y pasión por ayudar? Únete al equipo comercial de DermicaPro y ayuda a transformar la vida de nuestros clientes.
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
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ),
                  title: 'Comisiones atractivas',
                  desc: 'Gana según tu rendimiento. En DermicaPro premiamos el esfuerzo real con esquemas salariales competitivos.',
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  ),
                  title: 'Crecimiento real',
                  desc: 'Los mejores asesores avanzan rápidamente. Tu desempeño habla por ti y abre puertas dentro de la clínica.',
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  ),
                  title: 'Capacitación en tratamientos',
                  desc: 'Te formamos en los tratamientos que vendes para que puedas asesorar con confianza y cerrar mejor.',
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
                'Tenga mínimo 6 meses de experiencia en ventas directas.',
                'Sea una persona con excelente comunicación y don de gentes.',
                'Esté orientado/a a resultados y metas comerciales.',
                'Tenga disponibilidad de lunes a sábado para trabajar con el equipo.',
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
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Rosa" className={inputClass('nombre')} />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium dp-text-secondary mb-1">Apellido *</label>
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Mendoza" className={inputClass('apellido')} />
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

              {/* Pretensiones */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">Pretensiones salariales *</label>
                <input type="text" name="pretensiones" value={formData.pretensiones} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: S/ 1,200 base + comisiones" className={inputClass('pretensiones')} />
                {errors.pretensiones && <p className="text-red-500 text-xs mt-1">{errors.pretensiones}</p>}
              </div>

              <hr className="border-gray-200" />
              <p className="text-sm font-semibold dp-text-main">Preguntas de clasificación</p>

              {/* Experiencia en ventas */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Cuánta experiencia tienes en ventas directas? *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Sin experiencia', '6 meses - 1 año', '1-3 años', 'Más de 3 años'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.experiencia_ventas === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="experiencia_ventas" checked={clasificacion.experiencia_ventas === opt} onChange={() => handleRadio('experiencia_ventas', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.experiencia_ventas && <p className="text-red-500 text-xs mt-1">{errors.experiencia_ventas}</p>}
              </div>

              {/* Sector de ventas */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿En qué sector has vendido? (puedes marcar varios) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Salud y bienestar', 'Estética y belleza', 'Tecnología', 'Educación', 'Seguros', 'Otro'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.sector_ventas.includes(opt) ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="checkbox" checked={clasificacion.sector_ventas.includes(opt)} onChange={() => handleCheckbox('sector_ventas', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.sector_ventas && <p className="text-red-500 text-xs mt-1">{errors.sector_ventas}</p>}
              </div>

              {/* Esquema salarial */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Estás cómodo/a trabajando con comisiones? *</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Sí, prefiero comisiones', 'Sí con sueldo base + comisión', 'Prefiero solo sueldo fijo'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.esquema_salarial === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="esquema_salarial" checked={clasificacion.esquema_salarial === opt} onChange={() => handleRadio('esquema_salarial', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.esquema_salarial && <p className="text-red-500 text-xs mt-1">{errors.esquema_salarial}</p>}
              </div>

              {/* Seguimiento de clientes */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Tienes experiencia haciendo seguimiento de clientes? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Sí, uso CRM', 'Sí, de forma manual', 'No'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.seguimiento_clientes === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="seguimiento_clientes" checked={clasificacion.seguimiento_clientes === opt} onChange={() => handleRadio('seguimiento_clientes', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.seguimiento_clientes && <p className="text-red-500 text-xs mt-1">{errors.seguimiento_clientes}</p>}
              </div>

              {/* Estilo de venta */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Cómo describes tu estilo de venta? *</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Consultivo (escucho primero)', 'Agresivo (cierro rápido)', 'Mixto según cliente'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.estilo_venta === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="estilo_venta" checked={clasificacion.estilo_venta === opt} onChange={() => handleRadio('estilo_venta', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.estilo_venta && <p className="text-red-500 text-xs mt-1">{errors.estilo_venta}</p>}
              </div>

              {/* Disponibilidad */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Disponibilidad? *</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Lunes a sábado completo', 'Solo días de semana', 'Incluye domingos'].map(opt => (
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
                <label className="block text-sm font-medium dp-text-secondary mb-1">1. ¿Cuál ha sido tu mayor logro en ventas o atención al cliente? Descríbelo con números si puedes. *</label>
                <textarea rows={3} value={clasificacion.logro_ventas} onChange={e => handlePregunta('logro_ventas', e.target.value)} placeholder="Ej: En mi trabajo anterior superé la meta del mes un 30% en dos trimestres consecutivos logrando..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.logro_ventas ? 'border-red-500' : clasificacion.logro_ventas ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.logro_ventas && <p className="text-red-500 text-xs mt-1">{errors.logro_ventas}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">2. ¿Cómo reaccionas cuando un cliente te dice "no me interesa" o te cuelga el teléfono? *</label>
                <textarea rows={3} value={clasificacion.manejo_rechazo} onChange={e => handlePregunta('manejo_rechazo', e.target.value)} placeholder="Cuéntanos cómo manejas ese momento y qué haces después..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.manejo_rechazo ? 'border-red-500' : clasificacion.manejo_rechazo ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.manejo_rechazo && <p className="text-red-500 text-xs mt-1">{errors.manejo_rechazo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">3. Si hoy tienes 8 leads para contactar pero solo tiempo para 5, ¿cómo decides a cuáles llamar primero? *</label>
                <textarea rows={3} value={clasificacion.criterio_prioridad} onChange={e => handlePregunta('criterio_prioridad', e.target.value)} placeholder="Explica tu criterio de priorización..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.criterio_prioridad ? 'border-red-500' : clasificacion.criterio_prioridad ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.criterio_prioridad && <p className="text-red-500 text-xs mt-1">{errors.criterio_prioridad}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">4. ¿Qué te motivaría a trabajar específicamente en una clínica de estética y no en otro rubro? *</label>
                <textarea rows={3} value={clasificacion.motivacion_estetica} onChange={e => handlePregunta('motivacion_estetica', e.target.value)} placeholder="Sé específico/a. ¿Qué tiene este sector que otros no tienen para ti?" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.motivacion_estetica ? 'border-red-500' : clasificacion.motivacion_estetica ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.motivacion_estetica && <p className="text-red-500 text-xs mt-1">{errors.motivacion_estetica}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">5. Cuéntanos de una vez que convenciste a alguien de algo difícil. ¿Qué hiciste? *</label>
                <textarea rows={3} value={clasificacion.ejemplo_persuasion} onChange={e => handlePregunta('ejemplo_persuasion', e.target.value)} placeholder="Puede ser en el trabajo, con un cliente, o en cualquier situación de tu vida..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.ejemplo_persuasion ? 'border-red-500' : clasificacion.ejemplo_persuasion ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.ejemplo_persuasion && <p className="text-red-500 text-xs mt-1">{errors.ejemplo_persuasion}</p>}
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

export default VendedorPostulacionPage;
