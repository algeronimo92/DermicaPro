import React, { useState, useEffect } from 'react';
import { captureAllUTM } from '../utils/trackingHelper';

const NOMBRE_PUESTO = 'Especialista en Tratamientos Láser';
const WEBHOOK_URL = 'https://dermica-pro-n8n.rcsgeg.easypanel.host/webhook/postulacion-especialista-laser';
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
      // Portafolio es opcional para este puesto
      if (!value.trim()) return '';
      try { new URL(value.trim()); return ''; } catch { return 'Ingresa un link válido'; }
    case 'pretensiones':
      return !value.trim() ? 'Ingresa tus pretensiones salariales' : '';
    default:
      return '';
  }
};

function EspecialistaLaserPostulacionPage() {
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
    certificacion: '',
    equipos_experiencia: [],
    anios_laser: '',
    experiencia_ventas: '',
    experiencia_clinica: '',
    cartera_clientes: '',
    equipos_detalle: '',
    situacion_seguridad: '',
    manejo_paciente_nervioso: '',
    actualizacion_tecnica: '',
    motivacion_estetica_avanzada: '',
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
    if (!clasificacion.certificacion) errs.certificacion = 'Selecciona una opción';
    if (clasificacion.equipos_experiencia.length === 0) errs.equipos_experiencia = 'Selecciona al menos una opción';
    if (!clasificacion.anios_laser) errs.anios_laser = 'Selecciona una opción';
    if (!clasificacion.experiencia_ventas) errs.experiencia_ventas = 'Selecciona una opción';
    if (!clasificacion.experiencia_clinica) errs.experiencia_clinica = 'Selecciona una opción';
    if (!clasificacion.cartera_clientes) errs.cartera_clientes = 'Selecciona una opción';
    if (!clasificacion.equipos_detalle || clasificacion.equipos_detalle.trim().length < 20) errs.equipos_detalle = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.situacion_seguridad || clasificacion.situacion_seguridad.trim().length < 20) errs.situacion_seguridad = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.manejo_paciente_nervioso || clasificacion.manejo_paciente_nervioso.trim().length < 20) errs.manejo_paciente_nervioso = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.actualizacion_tecnica || clasificacion.actualizacion_tecnica.trim().length < 20) errs.actualizacion_tecnica = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    if (!clasificacion.motivacion_estetica_avanzada || clasificacion.motivacion_estetica_avanzada.trim().length < 20) errs.motivacion_estetica_avanzada = 'Por favor desarrolla tu respuesta (mín. 20 caracteres)';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Para este puesto portafolio es opcional: validar solo campos requeridos
    const requiredFields = ['nombre', 'apellido', 'telefono', 'email', 'dni', 'curriculum', 'pretensiones'];
    const fieldErrors = requiredFields.reduce((acc, key) => {
      const err = validateField(key, formData[key]);
      if (err) acc[key] = err;
      return acc;
    }, {});
    // Validar portafolio solo si tiene contenido (opcional)
    if (formData.portafolio.trim()) {
      const portErr = validateField('portafolio', formData.portafolio);
      if (portErr) fieldErrors.portafolio = portErr;
    }
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
        setClasificacion({ certificacion: '', equipos_experiencia: [], anios_laser: '', experiencia_ventas: '', experiencia_clinica: '', cartera_clientes: '', equipos_detalle: '', situacion_seguridad: '', manejo_paciente_nervioso: '', actualizacion_tecnica: '', motivacion_estetica_avanzada: '' });
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
            Especialista en <span style={{color: 'var(--accent-on-dark)'}}>Tratamientos Láser</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Buscamos una Esteticista o Cosmetóloga con experiencia en tratamientos con láser Y habilidades comerciales. El combo perfecto para crecer en DermicaPro.
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
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  ),
                  title: 'Equipos de última generación',
                  desc: 'Trabajarás con tecnología de punta: Pico Láser, HIFU, IPL y más. Tu expertise crece con cada tratamiento.',
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  ),
                  title: 'Crecimiento profesional y económico',
                  desc: 'Tu perfil técnico + comercial es muy valioso. Reconocemos y premiamos a quienes fidelizan pacientes y venden bien.',
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  ),
                  title: 'Capacitación constante',
                  desc: 'Acceso a capacitaciones en nuevos equipos y protocolos de tratamiento para que siempre estés a la vanguardia.',
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
                'Tenga título o certificación en Cosmetología, Estética o carrera afín.',
                'Cuente con experiencia práctica en equipos láser u otros de medicina estética.',
                'Tenga habilidades de venta y fidelización de pacientes.',
                'Brinde un excelente trato humano y empático en cada sesión.',
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
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Valeria" className={inputClass('nombre')} />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium dp-text-secondary mb-1">Apellido *</label>
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Flores" className={inputClass('apellido')} />
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

              {/* Portafolio - Opcional */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">
                  Link de certificaciones o antes/después{' '}
                  <span className="text-xs text-gray-400">(Opcional)</span>
                </label>
                <input type="url" name="portafolio" value={formData.portafolio} onChange={handleChange} onBlur={handleBlur} placeholder="https://drive.google.com/... (opcional)" className={inputClass('portafolio')} />
                {errors.portafolio && <p className="text-red-500 text-xs mt-1">{errors.portafolio}</p>}
              </div>

              {/* Pretensiones */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">Pretensiones salariales *</label>
                <input type="text" name="pretensiones" value={formData.pretensiones} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: S/ 2,000 mensuales" className={inputClass('pretensiones')} />
                {errors.pretensiones && <p className="text-red-500 text-xs mt-1">{errors.pretensiones}</p>}
              </div>

              <hr className="border-gray-200" />
              <p className="text-sm font-semibold dp-text-main">Preguntas de clasificación</p>

              {/* Certificación */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Tienes título o certificación en estética/cosmetología? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Sí, título técnico', 'Sí, certificaciones internacionales', 'En curso', 'No aún'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.certificacion === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="certificacion" checked={clasificacion.certificacion === opt} onChange={() => handleRadio('certificacion', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.certificacion && <p className="text-red-500 text-xs mt-1">{errors.certificacion}</p>}
              </div>

              {/* Equipos con experiencia */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Con qué equipos tienes experiencia? (puedes marcar varios) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Pico Láser', 'IPL / Luz Pulsada', 'Láser CO2', 'HIFU', 'Radiofrecuencia', 'Dermapen', 'Ninguno aún'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.equipos_experiencia.includes(opt) ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="checkbox" checked={clasificacion.equipos_experiencia.includes(opt)} onChange={() => handleCheckbox('equipos_experiencia', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.equipos_experiencia && <p className="text-red-500 text-xs mt-1">{errors.equipos_experiencia}</p>}
              </div>

              {/* Años con láser */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Cuántos años usando equipos láser? *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Sin experiencia', 'Menos de 1 año', '1-3 años', 'Más de 3 años'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.anios_laser === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="anios_laser" checked={clasificacion.anios_laser === opt} onChange={() => handleRadio('anios_laser', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.anios_laser && <p className="text-red-500 text-xs mt-1">{errors.anios_laser}</p>}
              </div>

              {/* Experiencia en ventas */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Tienes experiencia en ventas de tratamientos? *</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Sí, he vendido activamente', 'Sí, de forma casual', 'No, pero me interesa aprender'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.experiencia_ventas === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="experiencia_ventas_cli" checked={clasificacion.experiencia_ventas === opt} onChange={() => handleRadio('experiencia_ventas', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.experiencia_ventas && <p className="text-red-500 text-xs mt-1">{errors.experiencia_ventas}</p>}
              </div>

              {/* Experiencia en clínicas */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Has trabajado en clínicas estéticas? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Sí, más de 2 años', 'Sí, menos de 2 años', 'No, pero en spa o salón', 'No'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.experiencia_clinica === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="experiencia_clinica" checked={clasificacion.experiencia_clinica === opt} onChange={() => handleRadio('experiencia_clinica', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.experiencia_clinica && <p className="text-red-500 text-xs mt-1">{errors.experiencia_clinica}</p>}
              </div>

              {/* Cartera de clientes */}
              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-2">¿Tienes cartera de clientes propios? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Sí, clientela fija', 'Algunos clientes', 'No'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${clasificacion.cartera_clientes === opt ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="cartera_clientes" checked={clasificacion.cartera_clientes === opt} onChange={() => handleRadio('cartera_clientes', opt)} className="accent-yellow-500" />
                      <span className="text-sm dp-text-main">{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.cartera_clientes && <p className="text-red-500 text-xs mt-1">{errors.cartera_clientes}</p>}
              </div>

              <hr className="border-gray-200" />
              <div>
                <p className="text-sm font-semibold dp-text-main">Preguntas de evaluación</p>
                <p className="text-xs dp-text-secondary mt-1">Tómate tu tiempo. Estas respuestas son lo más importante para nosotros.</p>
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">1. ¿Con qué equipos de estética o láser has trabajado y durante cuánto tiempo? *</label>
                <textarea rows={3} value={clasificacion.equipos_detalle} onChange={e => handlePregunta('equipos_detalle', e.target.value)} placeholder="Ej: Usé Pico Láser durante 2 años en Clínica X, realizando tratamientos de manchas y borrado de tatuajes..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.equipos_detalle ? 'border-red-500' : clasificacion.equipos_detalle ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.equipos_detalle && <p className="text-red-500 text-xs mt-1">{errors.equipos_detalle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">2. Describe una situación en que tuviste que detener o posponer un tratamiento por seguridad del paciente. *</label>
                <textarea rows={3} value={clasificacion.situacion_seguridad} onChange={e => handlePregunta('situacion_seguridad', e.target.value)} placeholder="Si no has vivido esta situación, cuéntanos cómo actuarías ante ella..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.situacion_seguridad ? 'border-red-500' : clasificacion.situacion_seguridad ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.situacion_seguridad && <p className="text-red-500 text-xs mt-1">{errors.situacion_seguridad}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">3. ¿Cómo manejas a un paciente que está nervioso o que reacciona de forma inesperada durante una sesión? *</label>
                <textarea rows={3} value={clasificacion.manejo_paciente_nervioso} onChange={e => handlePregunta('manejo_paciente_nervioso', e.target.value)} placeholder="Describe tu enfoque y qué técnicas usas para tranquilizar al paciente..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.manejo_paciente_nervioso ? 'border-red-500' : clasificacion.manejo_paciente_nervioso ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.manejo_paciente_nervioso && <p className="text-red-500 text-xs mt-1">{errors.manejo_paciente_nervioso}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">4. ¿Cómo te mantienes actualizado/a sobre nuevas técnicas y equipos en estética avanzada? *</label>
                <textarea rows={3} value={clasificacion.actualizacion_tecnica} onChange={e => handlePregunta('actualizacion_tecnica', e.target.value)} placeholder="Ej: sigo canales especializados, asisto a congresos, hago cursos cada X meses..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.actualizacion_tecnica ? 'border-red-500' : clasificacion.actualizacion_tecnica ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.actualizacion_tecnica && <p className="text-red-500 text-xs mt-1">{errors.actualizacion_tecnica}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dp-text-secondary mb-1">5. ¿Por qué elegiste la estética avanzada como tu área de especialización? *</label>
                <textarea rows={3} value={clasificacion.motivacion_estetica_avanzada} onChange={e => handlePregunta('motivacion_estetica_avanzada', e.target.value)} placeholder="Cuéntanos qué te atrajo de este campo y qué te apasiona de él..." className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none ${errors.motivacion_estetica_avanzada ? 'border-red-500' : clasificacion.motivacion_estetica_avanzada ? 'border-green-500' : 'border-gray-300'}`} />
                {errors.motivacion_estetica_avanzada && <p className="text-red-500 text-xs mt-1">{errors.motivacion_estetica_avanzada}</p>}
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

export default EspecialistaLaserPostulacionPage;
