import React, { useState, useEffect, useRef } from 'react';
import { captureAllUTM } from '../utils/trackingHelper';
import { initJobPixel, trackJobPageView, initJobTikTokPixel, trackJobTikTokViewContent } from '../utils/jobPixelHelper';
import SearchableSelect from '../components/SearchableSelect';
import countriesData from '../data/countriesCities.json';
import QuestionnaireModal from '../components/QuestionnaireModal';
import { getQuestionnaire } from '../data/questionnairesData';
import useApplicationFlow from '../hooks/useApplicationFlow';

const NOMBRE_PUESTO = 'Practicante - Editor de Videos';
const WEBHOOK_URL   = 'https://n8n.dermicapro.online/webhook/trabajos';
const WHATSAPP_ERROR = '+51974637783';

const css = `
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --black : #040D08; --gold  : #C8A13E; --gray  : #7A7A79;
    --rose  : #CF9B9B; --light : #F2F2F2; --white : #FFFFFF;
    --gold-low : rgba(200,161,62,.12); --gold-mid : rgba(200,161,62,.35);
  }
  .dp-hero-title { font-size: clamp(2.6rem, 7vw, 5rem); font-weight: 900; line-height: 1.05; letter-spacing: -.02em; }
  .dp-section-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; }
  .dp-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; font-weight: 700; border-radius: 9999px; padding: .9rem 2.2rem; font-size: .95rem; transition: transform .2s, box-shadow .2s, background .2s; cursor: pointer; text-decoration: none; border: none; }
  .dp-btn-gold { background: var(--gold); color: var(--black); }
  .dp-btn-gold:hover { background: #b8922e; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(200,161,62,.4); }
  .dp-submit { width: 100%; background: var(--gold); color: var(--black); font-size: 1rem; font-weight: 800; padding: 1rem; border-radius: 14px; transition: all .2s; border: none; cursor: pointer; }
  .dp-submit:hover:not(:disabled) { background: #b8922e; box-shadow: 0 8px 24px rgba(200,161,62,.4); transform: translateY(-1px); }
  .dp-submit:disabled { opacity: .55; cursor: not-allowed; }
  .dp-input { width: 100%; padding: .75rem 1rem; border-radius: 10px; border: 1.5px solid #E5E7EB; font-size: .9rem; color: #111; background: #fff; transition: border-color .18s, box-shadow .18s; outline: none; }
  .dp-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(200,161,62,.18); }
  .dp-input-ok  { border-color: #4ade80 !important; }
  .dp-input-err { border-color: #f87171 !important; }
  .dp-form-card { background: var(--white); border-radius: 20px; border: 1px solid var(--gold-mid); box-shadow: 0 20px 60px rgba(4,13,8,.12); padding: 2.2rem; }
  .dp-sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; z-index: 40; display: none; padding: .9rem 1.25rem; background: var(--black); border-top: 1px solid var(--gold-mid); }
  @media (max-width: 1023px) { .dp-sticky-cta { display: block; } }
  .dp-hero-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: start; }
  @media (min-width: 1024px) { .dp-hero-grid { grid-template-columns: 55fr 45fr; gap: 4rem; align-items: center; } }
  .dp-dots { background-image: radial-gradient(circle, rgba(200,161,62,.22) 1.5px, transparent 1.5px); background-size: 20px 20px; }
  .dp-badge { display: inline-flex; align-items: center; gap: .4rem; font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: .35rem .9rem; border-radius: 9999px; }
  .dp-badge-gold { background: var(--gold-low); color: var(--gold); border: 1px solid var(--gold-mid); }
  .dp-badge-rose { background: rgba(207,155,155,.18); color: var(--rose); border: 1px solid rgba(207,155,155,.4); }
  .dp-check-item { display: flex; gap: .75rem; align-items: flex-start; }
  .dp-check-icon { color: var(--gold); flex-shrink: 0; margin-top: 2px; }
  .dp-drop { border: 2px dashed #E5E7EB; border-radius: 12px; transition: all .2s; }
  .dp-drop:hover { border-color: var(--gold); background: var(--gold-low); }
  .dp-drop-active { border-color: var(--gold) !important; background: var(--gold-low) !important; }
  .dp-drop-ok  { border-color: #4ade80 !important; background: #f0fdf4 !important; }
  .dp-drop-err { border-color: #f87171 !important; background: #fef2f2 !important; }
  @keyframes dpUp { from { opacity:0; transform: translateY(22px); } to { opacity:1; transform: translateY(0); } }
  .dp-anim { animation: dpUp .65s ease both; } .dp-anim-d1 { animation-delay: .1s; } .dp-anim-d2 { animation-delay: .22s; } .dp-anim-d3 { animation-delay: .36s; } .dp-anim-d4 { animation-delay: .5s; }
  @keyframes dpGlow { 0%{box-shadow:0 0 0 0 rgba(200,161,62,.5)} 70%{box-shadow:0 0 0 16px rgba(200,161,62,0)} 100%{box-shadow:0 0 0 0 rgba(200,161,62,0)} }
  .dp-glow { animation: dpGlow 1.6s ease-out; }
  .dp-label { display: block; font-size: .72rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--gray); margin-bottom: .45rem; }
  .dp-error { font-size: .75rem; color: #f87171; margin-top: .25rem; }
`;

const validateField = (name, value) => {
  switch (name) {
    case 'nombre': case 'apellido': return value.trim().length < 2 ? 'Mínimo 2 caracteres' : '';
    case 'telefono': return !/^[0-9]{9}$/.test(value.trim()) ? '9 dígitos requeridos' : '';
    case 'email': return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? 'Email inválido' : '';
    case 'dni': return !/^[0-9]{8}$/.test(value.trim()) ? '8 dígitos requeridos' : '';
    case 'curriculum':
      if (!value) return 'Selecciona un archivo PDF';
      if (!(value instanceof File)) return 'Debes cargar un archivo';
      if (value.type !== 'application/pdf') return 'Solo se permite PDF';
      if (value.size > 5 * 1024 * 1024) return 'Máximo 5 MB';
      return '';
    case 'ciudad': return !value ? 'Selecciona tu ciudad' : '';
    case 'pais':   return !value ? 'Selecciona tu país'  : '';
    default: return '';
  }
};

const Tick = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>;
const ArrowRight = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
const CheckItem = ({ children }) => (
  <li className="dp-check-item">
    <span className="dp-check-icon"><Tick /></span>
    <span style={{ color: '#374151', fontSize: '.92rem', lineHeight: '1.5' }}>{children}</span>
  </li>
);

export default function PracticantesEditorVideoPostulacionPage() {
  const [formData, setFormData] = useState({ nombre:'', apellido:'', telefono:'', email:'', dni:'', curriculum:null, ciudad:'', pais:'' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utmData, setUtmData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const formRef = useRef(null);

  const { applicationStep, proceedToQuestionnaire, resetFlow, backToApplication } = useApplicationFlow();
  const questionnaire = getQuestionnaire(NOMBRE_PUESTO);

  useEffect(() => {
    if (formData.pais) { const c = countriesData.countries.find(c => c.name === formData.pais); setAvailableCities(c ? c.cities : []); }
    else setAvailableCities([]);
  }, [formData.pais]);

  useEffect(() => {
    setFormData(prev => {
      if (!prev.ciudad || !prev.pais) return prev;
      const c = countriesData.countries.find(c => c.name === prev.pais);
      const cities = c ? c.cities : [];
      return cities.includes(prev.ciudad) ? prev : { ...prev, ciudad: '' };
    });
    setErrors(prev => ({ ...prev, ciudad: '' }));
  }, [formData.pais]);

  useEffect(() => {
    setUtmData(captureAllUTM());
    const init = async () => { await initJobPixel(); await trackJobPageView(NOMBRE_PUESTO); await initJobTikTokPixel(); await trackJobTikTokViewContent(NOMBRE_PUESTO); };
    init();
  }, []);

  useEffect(() => {
    if (!formRef.current) return;
    const obs = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { threshold: .1 });
    obs.observe(formRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollToForm = (e) => {
    e?.preventDefault();
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { formRef.current?.classList.remove('dp-glow'); void formRef.current?.offsetWidth; formRef.current?.classList.add('dp-glow'); }, 400);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let val = value;
    if (type === 'file') { val = files?.[0] || null; setDragActive(false); }
    else if (name === 'nombre' || name === 'apellido') val = value.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
    else if (name === 'telefono' || name === 'dni') val = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: validateField(name, val) }));
  };

  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) { setFormData(prev => ({ ...prev, curriculum: file })); if (errors.curriculum) setErrors(prev => ({ ...prev, curriculum: validateField('curriculum', file) })); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = Object.keys(formData).reduce((acc, k) => { const err = validateField(k, formData[k]); if (err) acc[k] = err; return acc; }, {});
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;
    const ok = proceedToQuestionnaire({ ...formData, utmData }, NOMBRE_PUESTO);
    if (!ok) { setModalType('error'); setShowModal(true); }
  };

  const handleQuestionnaireSubmit = async (answers) => {
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('nombre', formData.nombre); payload.append('apellido', formData.apellido);
      payload.append('telefono', `+51${formData.telefono}`); payload.append('email', formData.email);
      payload.append('dni', formData.dni); payload.append('ciudad', formData.ciudad); payload.append('pais', formData.pais);
      if (formData.curriculum instanceof File) payload.append('curriculum', formData.curriculum);
      payload.append('puesto', NOMBRE_PUESTO); payload.append('landing_url', window.location.href);
      payload.append('timestamp', new Date().toISOString()); payload.append('respuestas_cuestionario', JSON.stringify(answers));
      ['ttclid','fbclid','fbp','fbc','ad_id','adset_id','campaign_id','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(f => payload.append(f, utmData[f] || ''));
      const ctrl = new AbortController(); const tid = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(WEBHOOK_URL, { method: 'POST', body: payload, signal: ctrl.signal });
      clearTimeout(tid);
      if (res.ok) { setModalType('success'); setShowModal(true); resetFlow(); setFormData({ nombre:'', apellido:'', telefono:'', email:'', dni:'', curriculum:null, ciudad:'', pais:'' }); setErrors({}); }
      else { setModalType('error'); setShowModal(true); setIsSubmitting(false); }
    } catch { setModalType('error'); setShowModal(true); setIsSubmitting(false); }
  };

  const inCls = (f) => `dp-input ${errors[f] ? 'dp-input-err' : formData[f] ? 'dp-input-ok' : ''}`;

  return (
    <div className="antialiased" style={{ fontFamily:'system-ui,-apple-system,sans-serif', background:'var(--light)' }}>
      <style>{css}</style>

      {applicationStep === 2 && questionnaire && (
        <QuestionnaireModal isOpen={true} questionnaire={questionnaire} isSubmitting={isSubmitting} onClose={backToApplication} onSubmit={handleQuestionnaireSubmit} />
      )}

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(4,13,8,.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60, padding:'1rem' }} onClick={() => setShowModal(false)}>
          <div style={{ background:'#fff', borderRadius:'20px', maxWidth:'380px', width:'100%', padding:'2.5rem', textAlign:'center', boxShadow:'0 30px 80px rgba(0,0,0,.3)' }} onClick={e => e.stopPropagation()}>
            {modalType === 'success' ? (
              <>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(200,161,62,.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem', border:'2px solid rgba(200,161,62,.4)' }}><Tick /></div>
                <h3 style={{ fontWeight:800, fontSize:'1.4rem', color:'var(--black)', marginBottom:'.5rem' }}>¡Postulación enviada!</h3>
                <p style={{ color:'var(--gray)', fontSize:'.9rem', lineHeight:1.6, marginBottom:'1.5rem' }}>Revisaremos tu perfil y te contactaremos por WhatsApp si avanzas. ¡Mucho éxito!</p>
                <button onClick={() => setShowModal(false)} className="dp-btn dp-btn-gold" style={{ width:'100%' }}>Cerrar</button>
              </>
            ) : (
              <>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 style={{ fontWeight:800, fontSize:'1.4rem', color:'var(--black)', marginBottom:'.5rem' }}>Ups, algo salió mal</h3>
                <p style={{ color:'var(--gray)', fontSize:'.9rem', lineHeight:1.6, marginBottom:'1.5rem' }}>No pudimos enviar tu postulación. Escríbenos directamente.</p>
                <a href={`https://wa.me/${WHATSAPP_ERROR.replace(/\D/g,'')}?text=Hola%2C%20quiero%20postular%20a%20${encodeURIComponent(NOMBRE_PUESTO)}`} target="_blank" rel="noopener noreferrer" style={{ display:'block', background:'#22c55e', color:'#fff', fontWeight:700, padding:'.85rem', borderRadius:'10px', textDecoration:'none', marginBottom:'.5rem' }}>Escribir por WhatsApp</a>
                <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', color:'var(--gray)', cursor:'pointer', fontSize:'.85rem', padding:'.5rem' }}>Intentar de nuevo</button>
              </>
            )}
          </div>
        </div>
      )}

      {!formVisible && (
        <div className="dp-sticky-cta">
          <button onClick={scrollToForm} className="dp-btn dp-btn-gold" style={{ width:'100%', fontSize:'1rem' }}>Postúlate ahora <ArrowRight /></button>
        </div>
      )}

      <div style={{ background:'var(--black)', borderBottom:'1px solid rgba(200,161,62,.2)', padding:'.75rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ color:'var(--white)', fontWeight:800, fontSize:'1rem' }}>Dérmica<span style={{ color:'var(--gold)' }}>Pro</span></span>
        <button onClick={scrollToForm} className="dp-btn dp-btn-gold" style={{ padding:'.45rem 1.2rem', fontSize:'.8rem', borderRadius:'9999px' }}>Postularme</button>
      </div>

      <section style={{ background:'var(--black)', paddingBottom:'5rem' }}>
        <div className="dp-dots" style={{ position:'absolute', top:60, left:0, width:160, height:160, opacity:.5, pointerEvents:'none' }} />
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'4rem 1.5rem 0' }}>
          <div className="dp-hero-grid">
            <div>
              <div className="dp-anim dp-anim-d1" style={{ marginBottom:'1.25rem', display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
                <span className="dp-badge dp-badge-rose">Estamos contratando</span>
                <span className="dp-badge dp-badge-gold">Trujillo, Perú</span>
              </div>
              <h1 className="dp-hero-title dp-anim dp-anim-d2" style={{ color:'var(--white)', marginBottom:'.1em' }}>Practicante</h1>
              <h1 className="dp-hero-title dp-anim dp-anim-d2" style={{ color:'var(--gold)', marginBottom:'1rem' }}>Editor de Videos</h1>
              <div className="dp-anim dp-anim-d2" style={{ marginBottom:'1.5rem' }}>
                <span style={{ background:'var(--rose)', color:'var(--black)', fontWeight:700, fontSize:'.8rem', letterSpacing:'.12em', textTransform:'uppercase', padding:'.4rem 1rem', borderRadius:'4px', display:'inline-block' }}>
                  Para estudiantes de Comunicaciones o Diseño
                </span>
              </div>
              <p className="dp-anim dp-anim-d3" style={{ color:'rgba(255,255,255,.7)', fontSize:'1.05rem', lineHeight:1.7, marginBottom:'2rem', maxWidth:'480px' }}>
                ¿Tienes ojo para los cortes, los colores y la música? Únete como practicante y edita contenido que llega a miles de personas en redes sociales.
              </p>
              <div className="dp-anim dp-anim-d3" style={{ display:'flex', flexWrap:'wrap', gap:'1rem', marginBottom:'2.5rem' }}>
                {[{ icon:'✂️', label:'Proyectos desde el día 1' },{ icon:'📈', label:'Crecimiento acelerado' },{ icon:'💬', label:'Feedback constante' }].map(b => (
                  <div key={b.label} style={{ display:'flex', alignItems:'center', gap:'.5rem', background:'rgba(255,255,255,.06)', border:'1px solid rgba(200,161,62,.2)', borderRadius:'10px', padding:'.6rem 1rem' }}>
                    <span style={{ fontSize:'1.1rem' }}>{b.icon}</span>
                    <span style={{ color:'rgba(255,255,255,.85)', fontSize:'.82rem', fontWeight:600 }}>{b.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:'2rem', display:'block' }} className="lg-hidden">
                <button onClick={scrollToForm} className="dp-btn dp-btn-gold" style={{ width:'100%', fontSize:'1rem', borderRadius:'12px' }}>Ir al formulario <ArrowRight /></button>
              </div>
            </div>

            <div ref={formRef} id="postulacion-form" className="dp-anim dp-anim-d2">
              <div className="dp-form-card">
                <div style={{ marginBottom:'1.5rem', paddingBottom:'1.25rem', borderBottom:'1px solid var(--light)' }}>
                  <p style={{ color:'var(--gold)', fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'.25rem' }}>Paso 1 de 2 · Datos personales</p>
                  <h2 style={{ color:'var(--black)', fontWeight:800, fontSize:'1.3rem', margin:0 }}>Completa tu postulación</h2>
                  <p style={{ color:'var(--gray)', fontSize:'.83rem', marginTop:'.3rem' }}>Todos los campos son obligatorios.</p>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                      {[['nombre','Nombre','Lucía'],['apellido','Apellido','Torres']].map(([f,l,p]) => (
                        <div key={f}><label className="dp-label">{l} *</label><input type="text" name={f} value={formData[f]} onChange={handleChange} placeholder={p} className={inCls(f)} />{errors[f] && <p className="dp-error">{errors[f]}</p>}</div>
                      ))}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                      <div>
                        <label className="dp-label">Teléfono (WhatsApp) *</label>
                        <div style={{ display:'flex' }}>
                          <span style={{ display:'flex', alignItems:'center', padding:'0 .75rem', border:'1.5px solid #E5E7EB', borderRight:'none', borderRadius:'10px 0 0 10px', background:'var(--light)', color:'var(--gray)', fontSize:'.85rem', whiteSpace:'nowrap' }}>+51</span>
                          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="987 654 321" maxLength="9" className={`dp-input ${errors.telefono ? 'dp-input-err' : formData.telefono ? 'dp-input-ok' : ''}`} style={{ borderTopLeftRadius:0, borderBottomLeftRadius:0 }} />
                        </div>
                        {errors.telefono && <p className="dp-error">{errors.telefono}</p>}
                      </div>
                      <div><label className="dp-label">DNI *</label><input type="text" name="dni" value={formData.dni} onChange={handleChange} placeholder="12345678" maxLength="8" className={inCls('dni')} />{errors.dni && <p className="dp-error">{errors.dni}</p>}</div>
                    </div>
                    <div><label className="dp-label">Correo electrónico *</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@correo.com" className={inCls('email')} />{errors.email && <p className="dp-error">{errors.email}</p>}</div>
                    <div>
                      <label className="dp-label">Curriculum Vitae (PDF) *</label>
                      <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`dp-drop ${dragActive ? 'dp-drop-active' : errors.curriculum ? 'dp-drop-err' : formData.curriculum ? 'dp-drop-ok' : ''}`} style={{ padding:'1.25rem', textAlign:'center', cursor:'pointer' }}>
                        <input type="file" name="curriculum" accept=".pdf" onChange={handleChange} className="hidden" id="cv-input" style={{ display:'none' }} />
                        <label htmlFor="cv-input" style={{ cursor:'pointer', display:'block' }}>
                          {formData.curriculum ? (
                            <div>
                              <div style={{ width:40, height:40, borderRadius:'50%', background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto .5rem' }}><svg width="22" height="22" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>
                              <p style={{ fontWeight:700, fontSize:'.85rem', color:'#166534' }}>{formData.curriculum.name}</p>
                              <p style={{ color:'var(--gray)', fontSize:'.75rem', marginTop:'.2rem' }}>{(formData.curriculum.size/1024).toFixed(1)} KB · Cambiar archivo</p>
                            </div>
                          ) : (
                            <div>
                              <svg width="32" height="32" fill="none" stroke="var(--gray)" strokeWidth="1.8" viewBox="0 0 24 24" style={{ margin:'0 auto .5rem', display:'block' }}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                              <p style={{ fontWeight:600, fontSize:'.85rem', color:'#374151' }}>Arrastra tu CV aquí o <span style={{ color:'var(--gold)', fontWeight:700 }}>selecciona</span></p>
                              <p style={{ color:'var(--gray)', fontSize:'.75rem', marginTop:'.2rem' }}>PDF · Máximo 5 MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                      {errors.curriculum && <p className="dp-error">{errors.curriculum}</p>}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                      <div><SearchableSelect label="País *" options={countriesData.countries.map(c => c.name)} value={formData.pais} onChange={v => setFormData(p => ({ ...p, pais: v }))} placeholder="Busca tu país..." error={errors.pais} /></div>
                      <div style={!formData.pais ? { opacity:.5, pointerEvents:'none' } : {}}><SearchableSelect label="Ciudad *" options={availableCities} value={formData.ciudad} onChange={v => setFormData(p => ({ ...p, ciudad: v }))} placeholder={formData.pais ? 'Busca tu ciudad...' : 'Selecciona país primero'} error={errors.ciudad} /></div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="dp-submit" style={{ marginTop:'.25rem' }}>
                      {isSubmitting ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem' }}><svg style={{ animation:'spin 1s linear infinite', width:18, height:18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Procesando…</span>
                      : <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem' }}>Siguiente: Cuestionario <ArrowRight /></span>}
                    </button>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:.5, marginTop:'-.25rem' }}>
                      <svg width="13" height="13" fill="none" stroke="var(--gray)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      <span style={{ color:'var(--gray)', fontSize:'.75rem' }}>Datos protegidos · <a href="/politica-privacidad" style={{ color:'var(--gray)', textDecoration:'underline' }}>Política de Privacidad</a></span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background:'var(--light)', padding:'5rem 1.5rem' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span className="dp-badge dp-badge-gold" style={{ marginBottom:'.75rem', display:'inline-flex' }}>Más información</span>
            <h2 className="dp-section-title" style={{ color:'var(--black)' }}>¿Qué buscamos y qué ofrecemos?</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'1.5rem' }} className="req-grid">
            <div style={{ background:'var(--white)', borderRadius:16, padding:'2rem', border:'1px solid rgba(0,0,0,.06)', boxShadow:'0 4px 20px rgba(0,0,0,.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.25rem' }}>
                <div style={{ width:42, height:42, borderRadius:'50%', background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="20" height="20" fill="none" stroke="var(--black)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg></div>
                <div><p style={{ color:'var(--gold)', fontSize:'.7rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Lo que pedimos</p><p style={{ fontWeight:800, fontSize:'1.1rem', color:'var(--black)' }}>Requisitos</p></div>
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'.75rem' }}>
                <CheckItem>Estudiante de Comunicaciones, Diseño o carrera afín.</CheckItem>
                <CheckItem>Conocimiento básico de Premiere Pro, DaVinci Resolve o CapCut.</CheckItem>
                <CheckItem>Interés genuino por las redes sociales y el contenido digital.</CheckItem>
                <CheckItem>Disponibilidad para trabajar con el equipo y entregar a tiempo.</CheckItem>
              </ul>
            </div>
            <div style={{ background:'var(--black)', borderRadius:16, padding:'2rem', border:'1px solid rgba(200,161,62,.25)', boxShadow:'0 4px 20px rgba(0,0,0,.12)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.25rem' }}>
                <div style={{ width:42, height:42, borderRadius:'50%', background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="20" height="20" fill="none" stroke="var(--black)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg></div>
                <div><p style={{ color:'var(--gold)', fontSize:'.7rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Lo que recibes</p><p style={{ fontWeight:800, fontSize:'1.1rem', color:'var(--white)' }}>Ofrecemos</p></div>
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'.75rem' }}>
                {['Ediciones reales en Instagram, TikTok y YouTube desde el primer día.','Proyectos variados: reels, testimonios, antes/después, contenido educativo.','Feedback concreto en cada entrega para acelerar tu aprendizaje.','Acceso a recursos sobre tendencias de contenido en redes.','Experiencia que vale más que cualquier ejercicio universitario.'].map(o => (
                  <li key={o} style={{ display:'flex', gap:'.75rem', alignItems:'flex-start' }}>
                    <span style={{ color:'var(--gold)', flexShrink:0, marginTop:2 }}><Tick /></span>
                    <span style={{ color:'rgba(255,255,255,.8)', fontSize:'.92rem', lineHeight:1.5 }}>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <style>{`@media (min-width: 768px) { .req-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
        </div>
      </section>

      <section style={{ background:'var(--black)', padding:'5rem 1.5rem', position:'relative', overflow:'hidden' }}>
        <div className="dp-dots" style={{ position:'absolute', inset:0, opacity:.3, pointerEvents:'none' }} />
        <div style={{ maxWidth:'700px', margin:'0 auto', textAlign:'center', position:'relative' }}>
          <span className="dp-badge dp-badge-rose" style={{ marginBottom:'1.25rem', display:'inline-flex' }}>¿Te interesa?</span>
          <h2 style={{ fontWeight:900, fontSize:'clamp(2rem,5vw,3rem)', color:'var(--white)', lineHeight:1.1, marginBottom:'.75rem' }}>Edita contenido que<br /><span style={{ color:'var(--gold)' }}>el mundo va a ver.</span></h2>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:'.95rem', lineHeight:1.7, marginBottom:'2rem' }}>Postúlate y muéstranos tu potencial. Tu próxima gran experiencia puede estar aquí.</p>
          <button onClick={scrollToForm} className="dp-btn dp-btn-gold" style={{ fontSize:'1rem', padding:'1rem 2.5rem', borderRadius:'9999px' }}>Postúlate ahora <ArrowRight size={20} /></button>
          <p style={{ color:'rgba(255,255,255,.35)', fontSize:'.78rem', marginTop:'1rem' }}>El proceso tarda menos de 5 minutos.</p>
        </div>
      </section>

      <footer style={{ background:'var(--black)', borderTop:'1px solid rgba(200,161,62,.18)', padding:'2rem 1.5rem', textAlign:'center' }}>
        <p style={{ fontWeight:800, color:'var(--white)', marginBottom:'.3rem' }}>Dérmica<span style={{ color:'var(--gold)' }}>Pro</span></p>
        <p style={{ color:'var(--gray)', fontSize:'.82rem' }}>Av. Larco 877, Trujillo, Perú · +51 974 637 783</p>
        <p style={{ color:'rgba(255,255,255,.25)', fontSize:'.72rem', marginTop:'.75rem' }}>© {new Date().getFullYear()} DermicaPro. Todos los derechos reservados.</p>
      </footer>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media (min-width: 1024px) { .lg-hidden { display: none !important; } } html { scroll-behavior: smooth; }`}</style>
    </div>
  );
}
