import React, { useState, useEffect, useRef } from 'react';
import { captureAllUTM } from '../utils/trackingHelper';
import { initJobPixel, trackJobPageView, initJobTikTokPixel, trackJobTikTokViewContent } from '../utils/jobPixelHelper';
import SearchableSelect from '../components/SearchableSelect';
import countriesData from '../data/countriesCities.json';
import QuestionnaireModal from '../components/QuestionnaireModal';
import { getQuestionnaire } from '../data/questionnairesData';
import useApplicationFlow from '../hooks/useApplicationFlow';

const NOMBRE_PUESTO  = 'Cosmiatra';
const WEBHOOK_URL    = 'https://n8n.dermicapro.online/webhook/trabajos';
const WHATSAPP_ERROR = '+51974637783';

const css = `
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --black    : #040D08;
    --gold     : #C8A13E;
    --gray     : #7A7A79;
    --rose     : #CF9B9B;
    --rose-deep: #B07070;
    --rose-bg  : #FDF0EF;
    --rose-low : rgba(207,155,155,.12);
    --rose-mid : rgba(207,155,155,.35);
    --gold-low : rgba(200,161,62,.12);
    --gold-mid : rgba(200,161,62,.35);
    --white    : #FFFFFF;
    --cream    : #FFFAF9;
    --hero-bg  : #F9E8E6;
  }

  .dp-hero-title {
    font-size: clamp(3rem, 8vw, 5.8rem);
    font-weight: 900; line-height: .98; letter-spacing: -.03em;
  }
  .dp-hero-sub {
    font-size: clamp(1.9rem, 4.5vw, 3.6rem);
    font-weight: 300; font-style: italic; line-height: 1.05; letter-spacing: .01em;
  }
  .dp-section-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; }

  /* ── buttons ── */
  .dp-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
    font-weight: 700; border-radius: 9999px;
    padding: .9rem 2.2rem; font-size: .95rem;
    transition: transform .2s, box-shadow .2s, background .2s;
    cursor: pointer; text-decoration: none; border: none;
  }
  .dp-btn-gold { background: var(--gold); color: var(--black); }
  .dp-btn-gold:hover { background: #b8922e; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,161,62,.38); }
  .dp-btn-rose-outline { background: transparent; border: 2px solid var(--rose); color: var(--rose-deep); }
  .dp-btn-rose-outline:hover { background: var(--rose-low); }

  /* ── submit ── */
  .dp-submit {
    width: 100%; background: var(--gold); color: var(--black);
    font-size: 1rem; font-weight: 800; padding: 1rem;
    border-radius: 14px; transition: all .2s; border: none; cursor: pointer;
  }
  .dp-submit:hover:not(:disabled) { background: #b8922e; box-shadow: 0 8px 24px rgba(200,161,62,.38); transform: translateY(-1px); }
  .dp-submit:disabled { opacity: .55; cursor: not-allowed; }

  /* ── inputs ── */
  .dp-input {
    width: 100%; padding: .75rem 1rem; border-radius: 10px;
    border: 1.5px solid #E9D8D8; font-size: .9rem; color: #111;
    background: #fff; transition: border-color .18s, box-shadow .18s; outline: none;
  }
  .dp-input:focus { border-color: var(--rose); box-shadow: 0 0 0 3px rgba(207,155,155,.2); }
  .dp-input-ok  { border-color: #4ade80 !important; }
  .dp-input-err { border-color: #f87171 !important; }

  /* ── form card ── */
  .dp-form-card {
    background: var(--white); border-radius: 24px;
    border: 1.5px solid rgba(207,155,155,.45);
    box-shadow: 0 20px 60px rgba(207,155,155,.16), 0 4px 16px rgba(0,0,0,.04);
    padding: 2.2rem;
  }

  /* ── sticky CTA ── */
  .dp-sticky-cta {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
    display: none; padding: .9rem 1.25rem;
    background: #F2C5C0; border-top: 1px solid rgba(160,80,80,.3);
    box-shadow: 0 -4px 20px rgba(160,80,80,.18);
  }
  @media (max-width: 1023px) { .dp-sticky-cta { display: block; } }

  /* ── hero grid ── */
  .dp-hero-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: start; }
  @media (min-width: 1024px) { .dp-hero-grid { grid-template-columns: 55fr 45fr; gap: 4rem; align-items: center; } }

  /* ── dots pattern — rose ── */
  .dp-dots-rose {
    background-image: radial-gradient(circle, rgba(207,155,155,.28) 1.5px, transparent 1.5px);
    background-size: 22px 22px;
  }

  /* ── badges ── */
  .dp-badge {
    display: inline-flex; align-items: center; gap: .4rem;
    font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    padding: .35rem .9rem; border-radius: 9999px;
  }
  .dp-badge-gold { background: var(--gold-low); color: #9A7A2A; border: 1px solid var(--gold-mid); }
  .dp-badge-rose { background: rgba(207,155,155,.18); color: var(--rose-deep); border: 1px solid var(--rose-mid); }

  /* ── checklist ── */
  .dp-check-item { display: flex; gap: .75rem; align-items: flex-start; }
  .dp-check-icon { color: var(--rose); flex-shrink: 0; margin-top: 2px; }

  /* ── drag zone ── */
  .dp-drop { border: 2px dashed #E9D8D8; border-radius: 12px; transition: all .2s; }
  .dp-drop:hover { border-color: var(--rose); background: var(--rose-low); }
  .dp-drop-active { border-color: var(--rose) !important; background: var(--rose-low) !important; }
  .dp-drop-ok  { border-color: #4ade80 !important; background: #f0fdf4 !important; }
  .dp-drop-err { border-color: #f87171 !important; background: #fef2f2 !important; }

  /* ── animations ── */
  @keyframes dpUp { from { opacity:0; transform: translateY(22px); } to { opacity:1; transform: translateY(0); } }
  .dp-anim    { animation: dpUp .65s ease both; }
  .dp-anim-d1 { animation-delay: .1s; }
  .dp-anim-d2 { animation-delay: .22s; }
  .dp-anim-d3 { animation-delay: .36s; }
  .dp-anim-d4 { animation-delay: .5s; }
  @keyframes dpGlow { 0%{box-shadow:0 0 0 0 rgba(207,155,155,.55)} 70%{box-shadow:0 0 0 18px rgba(207,155,155,0)} 100%{box-shadow:0 0 0 0 rgba(207,155,155,0)} }
  .dp-glow { animation: dpGlow 1.6s ease-out; }

  /* ── label / error ── */
  .dp-label { display: block; font-size: .72rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--gray); margin-bottom: .45rem; }
  .dp-error  { font-size: .75rem; color: #f87171; margin-top: .25rem; }

  /* ── req grid ── */
  .req-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  @media (min-width: 768px) { .req-grid { grid-template-columns: 1fr 1fr; } }

  @keyframes spin { to { transform: rotate(360deg); } }
  @media (min-width: 1024px) { .lg-hidden { display: none !important; } }
  html { scroll-behavior: smooth; }
`;

/* ── validators ── */
const validateField = (name, value) => {
  switch (name) {
    case 'nombre': case 'apellido': return value.trim().length < 2 ? 'Mínimo 2 caracteres' : '';
    case 'telefono': return !/^[0-9]{9}$/.test(value.trim()) ? '9 dígitos requeridos' : '';
    case 'email':   return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? 'Email inválido' : '';
    case 'dni':     return !/^[0-9]{8}$/.test(value.trim()) ? '8 dígitos requeridos' : '';
    case 'curriculum':
      if (!value) return 'Selecciona un archivo PDF';
      if (!(value instanceof File)) return 'Debes cargar un archivo';
      if (value.type !== 'application/pdf') return 'Solo se permite PDF';
      if (value.size > 5 * 1024 * 1024) return 'Máximo 5 MB';
      return '';
    case 'ciudad': return !value ? 'Selecciona tu ciudad' : '';
    case 'pais':   return !value ? 'Selecciona tu país'  : '';
    default:       return '';
  }
};

/* ── SVGs ── */
const Tick = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);
const ArrowRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* Petal mandala — purely decorative */
const PetalDecor = () => (
  <svg viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
    <circle cx="170" cy="170" r="148" stroke="#CF9B9B" strokeWidth="0.7" />
    <circle cx="170" cy="170" r="105" stroke="#CF9B9B" strokeWidth="0.7" />
    <circle cx="170" cy="170" r="62"  stroke="#CF9B9B" strokeWidth="0.8" />
    <ellipse cx="170" cy="52"  rx="18" ry="56" stroke="#CF9B9B" strokeWidth="0.7" />
    <ellipse cx="170" cy="288" rx="18" ry="56" stroke="#CF9B9B" strokeWidth="0.7" />
    <ellipse cx="52"  cy="170" ry="18" rx="56" stroke="#CF9B9B" strokeWidth="0.7" />
    <ellipse cx="288" cy="170" ry="18" rx="56" stroke="#CF9B9B" strokeWidth="0.7" />
    <ellipse cx="95"  cy="95"  rx="18" ry="56" transform="rotate(-45 95 95)"   stroke="#CF9B9B" strokeWidth="0.7" />
    <ellipse cx="245" cy="95"  rx="18" ry="56" transform="rotate(45 245 95)"   stroke="#CF9B9B" strokeWidth="0.7" />
    <ellipse cx="95"  cy="245" rx="18" ry="56" transform="rotate(45 95 245)"   stroke="#CF9B9B" strokeWidth="0.7" />
    <ellipse cx="245" cy="245" rx="18" ry="56" transform="rotate(-45 245 245)" stroke="#CF9B9B" strokeWidth="0.7" />
    <circle cx="170" cy="170" r="20" stroke="#C8A13E" strokeWidth="0.9" />
    <circle cx="170" cy="170" r="7"  fill="#C8A13E" fillOpacity=".35" />
  </svg>
);

const CheckItem = ({ children }) => (
  <li className="dp-check-item">
    <span className="dp-check-icon"><Tick /></span>
    <span style={{ color:'#374151', fontSize:'.92rem', lineHeight:'1.6' }}>{children}</span>
  </li>
);

/* ════════════════════════════════════════════ */
export default function CosmiatraPostulacionPage() {
  const [formData, setFormData] = useState({ nombre:'', apellido:'', telefono:'', email:'', dni:'', curriculum:null, ciudad:'', pais:'' });
  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utmData,      setUtmData]      = useState({});
  const [showModal,    setShowModal]    = useState(false);
  const [modalType,    setModalType]    = useState('');
  const [dragActive,   setDragActive]   = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [formVisible,  setFormVisible]  = useState(false);
  const formRef = useRef(null);

  const { applicationStep, proceedToQuestionnaire, resetFlow, backToApplication } = useApplicationFlow();
  const questionnaire = getQuestionnaire(NOMBRE_PUESTO);

  useEffect(() => {
    if (formData.pais) {
      const c = countriesData.countries.find(c => c.name === formData.pais);
      setAvailableCities(c ? c.cities : []);
    } else setAvailableCities([]);
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
    const init = async () => {
      await initJobPixel(); await trackJobPageView(NOMBRE_PUESTO);
      await initJobTikTokPixel(); await trackJobTikTokViewContent(NOMBRE_PUESTO);
    };
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
    formRef.current?.scrollIntoView({ behavior:'smooth', block:'start' });
    setTimeout(() => {
      formRef.current?.classList.remove('dp-glow');
      void formRef.current?.offsetWidth;
      formRef.current?.classList.add('dp-glow');
    }, 400);
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
    if (file) { setFormData(prev => ({ ...prev, curriculum:file })); if (errors.curriculum) setErrors(prev => ({ ...prev, curriculum:validateField('curriculum', file) })); }
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
      ['ttclid','fbclid','ad_id','adset_id','campaign_id','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(f => payload.append(f, utmData[f] || ''));
      const ctrl = new AbortController(); const tid = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(WEBHOOK_URL, { method:'POST', body:payload, signal:ctrl.signal });
      clearTimeout(tid);
      if (res.ok) { setModalType('success'); setShowModal(true); resetFlow(); setFormData({ nombre:'', apellido:'', telefono:'', email:'', dni:'', curriculum:null, ciudad:'', pais:'' }); setErrors({}); }
      else { setModalType('error'); setShowModal(true); setIsSubmitting(false); }
    } catch { setModalType('error'); setShowModal(true); setIsSubmitting(false); }
  };

  const inCls = (f) => `dp-input ${errors[f] ? 'dp-input-err' : formData[f] ? 'dp-input-ok' : ''}`;

  return (
    <div style={{ fontFamily:'system-ui,-apple-system,sans-serif', background:'var(--cream)' }}>
      <style>{css}</style>

      {/* Questionnaire modal */}
      {applicationStep === 2 && questionnaire && (
        <QuestionnaireModal isOpen={true} questionnaire={questionnaire} isSubmitting={isSubmitting} onClose={backToApplication} onSubmit={handleQuestionnaireSubmit} />
      )}

      {/* Success / Error modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(4,13,8,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60, padding:'1rem' }} onClick={() => setShowModal(false)}>
          <div style={{ background:'#fff', borderRadius:'24px', maxWidth:'380px', width:'100%', padding:'2.5rem', textAlign:'center', boxShadow:'0 30px 80px rgba(0,0,0,.25)' }} onClick={e => e.stopPropagation()}>
            {modalType === 'success' ? (
              <>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(207,155,155,.14)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem', border:'2px solid rgba(207,155,155,.4)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 style={{ fontWeight:800, fontSize:'1.4rem', color:'var(--black)', marginBottom:'.5rem' }}>¡Postulación enviada!</h3>
                <p style={{ color:'var(--gray)', fontSize:'.9rem', lineHeight:1.65, marginBottom:'1.5rem' }}>Revisaremos tu perfil y te contactaremos por WhatsApp si avanzas. ¡Mucho éxito!</p>
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

      {/* Sticky mobile CTA */}
      {!formVisible && (
        <div className="dp-sticky-cta">
          <button onClick={scrollToForm} className="dp-btn dp-btn-gold" style={{ width:'100%', fontSize:'1rem' }}>
            Postúlate ahora <ArrowRight />
          </button>
        </div>
      )}

      {/* ══ TOPBAR ══ */}
      <div style={{ background:'#E8BFBC', borderBottom:'1px solid rgba(160,80,80,.25)', padding:'.85rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ color:'var(--black)', fontWeight:800, fontSize:'1rem', letterSpacing:'-.01em' }}>
          Dérmica<span style={{ color:'var(--gold)' }}>Pro</span>
        </span>
        <button onClick={scrollToForm} className="dp-btn dp-btn-gold" style={{ padding:'.45rem 1.2rem', fontSize:'.8rem' }}>
          Postularme
        </button>
      </div>

      {/* ══════════════════════════════════════════
          HERO — fondo rosado principal
      ══════════════════════════════════════════ */}
      <section style={{ background:'#F2C5C0', paddingBottom:0, position:'relative', overflow:'hidden' }}>

        {/* Gradiente para profundidad */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #F2C5C0 0%, #EBB0AA 100%)', pointerEvents:'none' }} />

        {/* Mancha clara top-left para suavizar */}
        <div style={{ position:'absolute', top:'-10%', left:'-5%', width:'50%', paddingBottom:'50%', borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,.25) 0%, transparent 70%)', pointerEvents:'none' }} />

        {/* Mandala decorativo — esquina superior derecha */}
        <div style={{ position:'absolute', top:-30, right:-40, width:340, height:340, opacity:.22, pointerEvents:'none' }}>
          <PetalDecor />
        </div>

        {/* Dot pattern — esquina inferior izquierda */}
        <div className="dp-dots-rose" style={{ position:'absolute', bottom:40, left:0, width:180, height:180, opacity:.35, pointerEvents:'none' }} />

        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'5rem 1.5rem 0', position:'relative' }}>
          <div className="dp-hero-grid">

            {/* ── LEFT: PITCH ── */}
            <div>
              {/* eyebrow badges */}
              <div className="dp-anim dp-anim-d1" style={{ marginBottom:'1.5rem', display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', padding:'.35rem .9rem', borderRadius:'9999px', background:'rgba(255,255,255,.35)', color:'#5A2020', border:'1px solid rgba(255,255,255,.6)' }}>Estamos contratando</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', padding:'.35rem .9rem', borderRadius:'9999px', background:'rgba(200,161,62,.22)', color:'#5A4010', border:'1px solid rgba(200,161,62,.6)' }}>Trujillo, Perú</span>
              </div>

              {/* Título */}
              <div className="dp-anim dp-anim-d2" style={{ marginBottom:'1rem' }}>
                <h1 className="dp-hero-title" style={{ color:'#2A0A0A', margin:0 }}>
                  Cosmiatra
                </h1>
                <h1 className="dp-hero-sub" style={{ color:'#7A2020', margin:'0' }}>
                  &amp; Cosmetóloga
                </h1>
              </div>

              {/* Línea decorativa + tagline */}
              <div className="dp-anim dp-anim-d2" style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.75rem' }}>
                <div style={{ flexShrink:0, width:36, height:2, background:'rgba(90,20,20,.45)', borderRadius:4 }} />
                <span style={{ color:'#5A2020', fontSize:'.78rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', fontStyle:'italic' }}>
                  con pasión por el cuidado de la piel
                </span>
              </div>

              {/* Descripción */}
              <p className="dp-anim dp-anim-d3" style={{ color:'rgba(42,10,10,.75)', fontSize:'1.05rem', lineHeight:1.75, marginBottom:'2rem', maxWidth:'480px' }}>
                Buscamos una cosmiatra con manos expertas y vocación de servicio. Si amas transformar la piel y la autoestima de tus pacientes, este lugar es para ti.
              </p>

              {/* Trust chips */}
              <div className="dp-anim dp-anim-d3" style={{ display:'flex', flexWrap:'wrap', gap:'.85rem', marginBottom:'2.5rem' }}>
                {[
                  { icon:'✨', label:'Tecnología de vanguardia' },
                  { icon:'📈', label:'Crecimiento real' },
                  { icon:'💛', label:'Ambiente que inspira' },
                ].map(b => (
                  <div key={b.label} style={{ display:'flex', alignItems:'center', gap:'.5rem', background:'rgba(255,255,255,.35)', border:'1.5px solid rgba(255,255,255,.6)', borderRadius:'12px', padding:'.6rem 1rem', backdropFilter:'blur(4px)' }}>
                    <span style={{ fontSize:'1rem' }}>{b.icon}</span>
                    <span style={{ color:'#4A1515', fontSize:'.82rem', fontWeight:700 }}>{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Mobile CTA */}
              <div style={{ marginTop:'1.5rem' }} className="lg-hidden">
                <button onClick={scrollToForm} className="dp-btn dp-btn-gold" style={{ width:'100%', fontSize:'1rem', borderRadius:'14px', boxShadow:'0 6px 20px rgba(90,20,20,.3)' }}>
                  Ir al formulario <ArrowRight />
                </button>
              </div>
            </div>

            {/* ── RIGHT: FORM ── */}
            <div ref={formRef} id="postulacion-form" className="dp-anim dp-anim-d2">
              <div className="dp-form-card">
                <div style={{ marginBottom:'1.5rem', paddingBottom:'1.25rem', borderBottom:'1.5px solid rgba(207,155,155,.2)' }}>
                  <p style={{ color:'#9B3030', fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'.25rem' }}>
                    Paso 1 de 2 · Datos personales
                  </p>
                  <h2 style={{ color:'var(--black)', fontWeight:800, fontSize:'1.3rem', margin:0 }}>Completa tu postulación</h2>
                  <p style={{ color:'var(--gray)', fontSize:'.83rem', marginTop:'.3rem' }}>Todos los campos son obligatorios.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                      {[['nombre','Nombre','Valeria'],['apellido','Apellido','Flores']].map(([f,l,p]) => (
                        <div key={f}>
                          <label className="dp-label">{l} *</label>
                          <input type="text" name={f} value={formData[f]} onChange={handleChange} placeholder={p} className={inCls(f)} />
                          {errors[f] && <p className="dp-error">{errors[f]}</p>}
                        </div>
                      ))}
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                      <div>
                        <label className="dp-label">Teléfono (WhatsApp) *</label>
                        <div style={{ display:'flex' }}>
                          <span style={{ display:'flex', alignItems:'center', padding:'0 .75rem', border:'1.5px solid #E9D8D8', borderRight:'none', borderRadius:'10px 0 0 10px', background:'#FDF5F5', color:'var(--gray)', fontSize:'.85rem', whiteSpace:'nowrap' }}>+51</span>
                          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="987 654 321" maxLength="9" className={`dp-input ${errors.telefono ? 'dp-input-err' : formData.telefono ? 'dp-input-ok' : ''}`} style={{ borderTopLeftRadius:0, borderBottomLeftRadius:0 }} />
                        </div>
                        {errors.telefono && <p className="dp-error">{errors.telefono}</p>}
                      </div>
                      <div>
                        <label className="dp-label">DNI *</label>
                        <input type="text" name="dni" value={formData.dni} onChange={handleChange} placeholder="12345678" maxLength="8" className={inCls('dni')} />
                        {errors.dni && <p className="dp-error">{errors.dni}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="dp-label">Correo electrónico *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@correo.com" className={inCls('email')} />
                      {errors.email && <p className="dp-error">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="dp-label">Curriculum Vitae (PDF) *</label>
                      <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        className={`dp-drop ${dragActive ? 'dp-drop-active' : errors.curriculum ? 'dp-drop-err' : formData.curriculum ? 'dp-drop-ok' : ''}`}
                        style={{ padding:'1.25rem', textAlign:'center', cursor:'pointer' }}>
                        <input type="file" name="curriculum" accept=".pdf" onChange={handleChange} id="cv-input" style={{ display:'none' }} />
                        <label htmlFor="cv-input" style={{ cursor:'pointer', display:'block' }}>
                          {formData.curriculum ? (
                            <div>
                              <div style={{ width:40, height:40, borderRadius:'50%', background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto .5rem' }}>
                                <svg width="22" height="22" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                              </div>
                              <p style={{ fontWeight:700, fontSize:'.85rem', color:'#166534' }}>{formData.curriculum.name}</p>
                              <p style={{ color:'var(--gray)', fontSize:'.75rem', marginTop:'.2rem' }}>{(formData.curriculum.size/1024).toFixed(1)} KB · Cambiar archivo</p>
                            </div>
                          ) : (
                            <div>
                              <svg width="30" height="30" fill="none" stroke="var(--rose)" strokeWidth="1.8" viewBox="0 0 24 24" style={{ margin:'0 auto .5rem', display:'block', opacity:.75 }}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                              <p style={{ fontWeight:600, fontSize:'.85rem', color:'#374151' }}>Arrastra tu CV aquí o <span style={{ color:'var(--rose-deep)', fontWeight:700 }}>selecciona</span></p>
                              <p style={{ color:'var(--gray)', fontSize:'.75rem', marginTop:'.2rem' }}>PDF · Máximo 5 MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                      {errors.curriculum && <p className="dp-error">{errors.curriculum}</p>}
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                      <div>
                        <SearchableSelect label="País *" options={countriesData.countries.map(c => c.name)} value={formData.pais} onChange={v => setFormData(p => ({ ...p, pais:v }))} placeholder="Busca tu país..." error={errors.pais} />
                      </div>
                      <div style={!formData.pais ? { opacity:.5, pointerEvents:'none' } : {}}>
                        <SearchableSelect label="Ciudad *" options={availableCities} value={formData.ciudad} onChange={v => setFormData(p => ({ ...p, ciudad:v }))} placeholder={formData.pais ? 'Busca tu ciudad...' : 'Selecciona país primero'} error={errors.ciudad} />
                      </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="dp-submit" style={{ marginTop:'.25rem' }}>
                      {isSubmitting
                        ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem' }}><svg style={{ animation:'spin 1s linear infinite', width:18, height:18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Procesando…</span>
                        : <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem' }}>Siguiente: Cuestionario <ArrowRight /></span>}
                    </button>

                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.35rem', marginTop:'-.25rem' }}>
                      <svg width="12" height="12" fill="none" stroke="var(--rose)" strokeWidth="2" viewBox="0 0 24 24" style={{ opacity:.7 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      <span style={{ color:'var(--gray)', fontSize:'.75rem' }}>Datos protegidos · <a href="/politica-privacidad" style={{ color:'var(--gray)', textDecoration:'underline' }}>Política de Privacidad</a></span>
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider → sección rosada */}
        <div style={{ marginTop:'5rem', lineHeight:0 }}>
          <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', width:'100%' }} preserveAspectRatio="none">
            <path d="M0 45 C240 90 480 0 720 45 C960 90 1200 0 1440 45 L1440 90 L0 90 Z" fill="#FDF0EF" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          REQUISITOS — fondo rosado muy suave
      ══════════════════════════════════════════ */}
      <section style={{ background:'#FDF0EF', padding:'4.5rem 1.5rem 5rem', position:'relative', overflow:'hidden' }}>

        {/* Mandala pequeño decorativo fondo */}
        <div style={{ position:'absolute', bottom:-60, right:-60, width:260, height:260, opacity:.06, pointerEvents:'none' }}>
          <PetalDecor />
        </div>

        <div style={{ maxWidth:'900px', margin:'0 auto', position:'relative' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span className="dp-badge dp-badge-rose" style={{ display:'inline-flex', marginBottom:'.8rem' }}>Más información</span>
            <h2 className="dp-section-title" style={{ color:'var(--black)', margin:'0 0 .5rem' }}>¿Qué buscamos y qué ofrecemos?</h2>
            <p style={{ color:'#7A5050', fontSize:'.9rem' }}>Todo lo que necesitas saber antes de postular.</p>
          </div>

          <div className="req-grid">
            {/* REQUISITOS — blanco con acento rosado */}
            <div style={{ background:'var(--white)', borderRadius:20, padding:'2rem', border:'1.5px solid rgba(207,155,155,.3)', boxShadow:'0 6px 28px rgba(207,155,155,.14)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg, var(--rose), #E8B4B4, transparent)' }} />
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.25rem' }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(207,155,155,.15)', border:'1.5px solid rgba(207,155,155,.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="20" height="20" fill="none" stroke="var(--rose)" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                </div>
                <div>
                  <p style={{ color:'var(--rose-deep)', fontSize:'.7rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Lo que pedimos</p>
                  <p style={{ fontWeight:800, fontSize:'1.1rem', color:'var(--black)', margin:0 }}>Requisitos</p>
                </div>
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'.75rem' }}>
                <CheckItem>Título o certificación en Cosmiatría, Cosmetología o carrera afín.</CheckItem>
                <CheckItem>Experiencia en tratamientos faciales, corporales o de medicina estética.</CheckItem>
                <CheckItem>Trato cálido, empático y profesional en cada sesión.</CheckItem>
                <CheckItem>Disposición para aprender nuevas técnicas y protocolos de tratamiento.</CheckItem>
              </ul>
            </div>

            {/* OFRECEMOS — rosado medio oscuro */}
            <div style={{ background:'linear-gradient(145deg, #2A0D0D 0%, #1A0808 100%)', borderRadius:20, padding:'2rem', border:'1.5px solid rgba(207,155,155,.25)', boxShadow:'0 6px 28px rgba(0,0,0,.18)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg, var(--rose), var(--gold), transparent)' }} />
              {/* small mandala */}
              <div style={{ position:'absolute', bottom:-30, right:-30, width:120, height:120, opacity:.08, pointerEvents:'none' }}>
                <PetalDecor />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.25rem', position:'relative' }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(200,161,62,.15)', border:'1.5px solid rgba(200,161,62,.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="20" height="20" fill="none" stroke="var(--gold)" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                </div>
                <div>
                  <p style={{ color:'var(--rose)', fontSize:'.7rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Lo que recibes</p>
                  <p style={{ fontWeight:800, fontSize:'1.1rem', color:'var(--white)', margin:0 }}>Ofrecemos</p>
                </div>
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'.75rem', position:'relative' }}>
                {['Trabajo con equipos de última generación: HIFU, Pico Láser, radiofrecuencia.','Remuneración competitiva acorde a tu experiencia.','Capacitación constante en nuevas técnicas y protocolos.','Ambiente profesional con un equipo comprometido y empático.','Oportunidades reales de crecimiento dentro de la clínica.'].map(o => (
                  <li key={o} style={{ display:'flex', gap:'.75rem', alignItems:'flex-start' }}>
                    <span style={{ color:'var(--rose)', flexShrink:0, marginTop:2 }}><Tick /></span>
                    <span style={{ color:'rgba(255,255,255,.82)', fontSize:'.92rem', lineHeight:1.55 }}>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA — fondo rosado suave con dots
      ══════════════════════════════════════════ */}
      <section style={{ background:'var(--rose-bg)', borderTop:'1.5px solid rgba(207,155,155,.3)', padding:'5.5rem 1.5rem', position:'relative', overflow:'hidden' }}>

        {/* Círculos decorativos */}
        <div style={{ position:'absolute', top:'50%', left:'-6%', transform:'translateY(-50%)', width:350, height:350, borderRadius:'50%', border:'1.5px solid rgba(207,155,155,.25)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'50%', left:'-6%', transform:'translateY(-50%)', width:220, height:220, borderRadius:'50%', border:'1px solid rgba(207,155,155,.18)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'50%', right:'-6%', transform:'translateY(-50%)', width:300, height:300, borderRadius:'50%', border:'1px solid rgba(200,161,62,.2)', pointerEvents:'none' }} />

        {/* Dots pattern */}
        <div className="dp-dots-rose" style={{ position:'absolute', inset:0, opacity:.3, pointerEvents:'none' }} />

        <div style={{ maxWidth:'640px', margin:'0 auto', textAlign:'center', position:'relative' }}>
          {/* Icono botánico */}
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:60, height:60, borderRadius:'50%', background:'var(--white)', border:'1.5px solid rgba(207,155,155,.4)', marginBottom:'1.25rem', boxShadow:'0 4px 16px rgba(207,155,155,.2)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.6" strokeLinecap="round"><path d="M12 22V12M12 12C12 12 8 10 8 6a4 4 0 018 0c0 4-4 6-4 6zM12 12C12 12 16 10 18 7"/></svg>
          </div>

          <span className="dp-badge dp-badge-rose" style={{ display:'inline-flex', marginBottom:'1rem' }}>¿Te interesa?</span>

          <h2 style={{ fontWeight:900, fontSize:'clamp(2rem,5vw,3rem)', color:'var(--black)', lineHeight:1.08, margin:'0 0 .35rem' }}>
            Transforma pieles y
          </h2>
          <h2 style={{ fontWeight:300, fontStyle:'italic', fontSize:'clamp(1.6rem,4vw,2.4rem)', color:'var(--rose-deep)', lineHeight:1.2, margin:'0 0 1.1rem' }}>
            autoestimas con nosotros.
          </h2>

          <p style={{ color:'#6B4A4A', fontSize:'.95rem', lineHeight:1.75, marginBottom:'2.2rem' }}>
            Postúlate y cuéntanos tu experiencia.<br />Tu próxima gran oportunidad puede estar aquí.
          </p>

          <button onClick={scrollToForm} className="dp-btn dp-btn-gold" style={{ fontSize:'1rem', padding:'1rem 2.8rem', boxShadow:'0 8px 28px rgba(200,161,62,.32)' }}>
            Postúlate ahora <ArrowRight size={20} />
          </button>

          <p style={{ color:'rgba(107,74,74,.5)', fontSize:'.78rem', marginTop:'1.1rem' }}>El proceso tarda menos de 5 minutos.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'var(--black)', borderTop:'1px solid rgba(207,155,155,.15)', padding:'2rem 1.5rem', textAlign:'center' }}>
        <p style={{ fontWeight:800, color:'var(--white)', marginBottom:'.3rem', letterSpacing:'-.01em' }}>
          Dérmica<span style={{ color:'var(--gold)' }}>Pro</span>
        </p>
        <p style={{ color:'var(--gray)', fontSize:'.82rem' }}>Av. Larco 877, Trujillo, Perú · +51 974 637 783</p>
        <p style={{ color:'rgba(255,255,255,.2)', fontSize:'.72rem', marginTop:'.75rem' }}>© {new Date().getFullYear()} DermicaPro. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
