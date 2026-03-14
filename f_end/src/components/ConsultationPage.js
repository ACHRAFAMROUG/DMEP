import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import './ConsultationPage.css';
import { api } from '../services/api';

const SEAL = "https://ih1.redbubble.net/image.783360443.7932/st,small,507x507-pad,600x600,f8f8f8.u2.jpg";

/* ══════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════ */
export default function ConsultationPage({ user, role }) {
  const [activePage, setActivePage] = useState('consultation');
  const navigate = useNavigate();

  const nomAffiche = [user?.prenom, user?.nom].filter(Boolean).join(' ')
    || user?.email || 'Utilisateur';
  const initiales  = [user?.prenom?.[0], user?.nom?.[0]].filter(Boolean).join('').toUpperCase() || '?';
  const photoUrl   = user?.photo || null;
  const roleAffiche = role || user?.profile || 'utilisateur';

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  const NAV = ['Profile','Home','Consultation','Dashboard','Configuration'];

  return (
    <div className="cp">

      {/* ══ HEADER ══ */}
      <header className="cp__header">
        <div className="cp__header-left">
          <img src={SEAL} alt="Armoiries" className="cp__seal" />
          <span className="cp__appname">e-<strong>Milaf</strong></span>
        </div>

        <div className="cp__header-center">
          Profil connecté :&nbsp;
          <strong className="cp__role-badge">{roleAffiche}</strong>
        </div>

        <div className="cp__header-right">
          <div className="cp__huser">
            <div className="cp__avatar">
              {photoUrl
                ? <img src={photoUrl} alt="profil" className="cp__avatar-img" />
                : <span className="cp__avatar-txt">{initiales}</span>
              }
            </div>
            <div className="cp__huser-info">
              <span className="cp__huser-name">{nomAffiche}</span>
              <span className="cp__huser-role">{roleAffiche}</span>
            </div>
          </div>
          <button className="cp__logout" onClick={handleLogout}>
            ⏻ Se déconnecter
          </button>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div className="cp__body">

        {/* ── SIDEBAR ── */}
        <aside className="cp__sidebar">
          <div className="cp__sidebar-top">
            <div className="cp__sb-avatar">
              {photoUrl
                ? <img src={photoUrl} alt="profil" className="cp__sb-photo" />
                : <span className="cp__sb-initiales">{initiales}</span>
              }
            </div>
            <p className="cp__sb-name">{nomAffiche}</p>
            <span className="cp__sb-badge">{roleAffiche}</span>
          </div>

          <nav className="cp__nav">
            {NAV.map(item => (
              <button key={item}
                className={`cp__nav-btn ${activePage === item.toLowerCase() ? 'cp__nav-btn--on' : ''}`}
                onClick={() => setActivePage(item.toLowerCase())}
              >
                <span className="cp__nav-icon">{navIcon(item)}</span>
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── MAIN ── */}
        <main className="cp__main">
          {activePage === 'consultation' && (
            roleAffiche?.toLowerCase() === 'patient'
              ? <ConsultationPatient user={user} />
              : <ConsultationMedecin user={user} />
          )}
          {activePage === 'profile' && (
            <ProfilePage user={user} role={roleAffiche}
              photoUrl={photoUrl} nomAffiche={nomAffiche} initiales={initiales} />
          )}
          {activePage === 'home' && (
            <div className="cp__welcome">
              <div className="cp__welcome-icon">🏥</div>
              <h2>Bienvenue, {nomAffiche}</h2>
              <p>Plateforme e-Milaf — Ministère de la Santé, Royaume du Maroc.</p>
            </div>
          )}
          {activePage === 'dashboard'     && <Dashboard role={roleAffiche} />}
          {activePage === 'configuration' && (
            <div className="cp__welcome">
              <div className="cp__welcome-icon">⚙️</div>
              <h2>Configuration</h2>
              <p>Paramètres du compte.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function navIcon(item) {
  const icons = { Profile:'👤', Home:'🏠', Consultation:'📋', Dashboard:'📊', Configuration:'⚙️' };
  return icons[item] || '•';
}

/* ══════════════════════════════════════
   PAGE PROFILE
══════════════════════════════════════ */
function ProfilePage({ user, role, photoUrl, nomAffiche, initiales }) {
  return (
    <div className="prof-card">
      <div className="prof-card__hero">
        {photoUrl
          ? <img src={photoUrl} alt="profil" className="prof-card__photo" />
          : <div className="prof-card__initiales">{initiales}</div>
        }
        <h2 className="prof-card__name">{nomAffiche}</h2>
        <span className="prof-card__badge">{role}</span>
      </div>
      <div className="prof-card__fields">
        {[
          { label:'Nom',       value: user?.nom       || '—' },
          { label:'Prénom',    value: user?.prenom    || '—' },
          { label:'Email',     value: user?.email     || '—' },
          { label:'Téléphone', value: user?.telephone || '—' },
          { label:'Profil',    value: role            || '—' },
        ].map(f => (
          <div key={f.label} className="prof-field">
            <span className="prof-field__label">{f.label}</span>
            <span className="prof-field__value">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   CONSULTATION PATIENT
══════════════════════════════════════ */
function ConsultationPatient({ user }) {
  const emptyForm = { date:'', heure:'', type:'', medecin:'', specialite:'' };
  const [form,          setForm]          = useState(emptyForm);
  const [errors,        setErrors]        = useState({});
  const [consultations, setConsultations] = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [view,          setView]          = useState('form');
  const [editId,        setEditId]        = useState(null);
  const [search,        setSearch]        = useState('');
  const [sortField,     setSortField]     = useState('date_consultation');
  const [sortDir,       setSortDir]       = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast,         setToast]         = useState('');

  /* ── Charger depuis API ── */
  useEffect(() => {
    setLoading(true);
    api.getConsultations()
      .then(res => { if (res.success) setConsultations(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function validate() {
    const e = {};
    if (!form.date)       e.date       = 'Date obligatoire';
    if (!form.heure)      e.heure      = 'Heure obligatoire';
    if (!form.type)       e.type       = 'Type obligatoire';
    if (!form.medecin)    e.medecin    = 'Médecin obligatoire';
    if (!form.specialite) e.specialite = 'Spécialité obligatoire';
    if (form.date) {
      const today = new Date(); today.setHours(0,0,0,0);
      if (new Date(form.date) < today) e.date = 'La date ne peut pas être dans le passé';
    }
    return e;
  }

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  }

  async function handleValider(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    const payload = {
      date_consultation : form.date,
      heure             : form.heure,
      type              : form.type,
      medecin           : form.medecin,
      specialite        : form.specialite,
    };

    try {
      if (editId !== null) {
        const res = await api.updateConsultation(editId, payload);
        if (res.success) {
          setConsultations(p => p.map(c => c.id === editId ? res.data : c));
          showToast('✅ Consultation modifiée !');
        }
        setEditId(null);
      } else {
        const res = await api.createConsultation(payload);
        if (res.success) {
          setConsultations(p => [...p, res.data]);
          showToast('✅ Consultation ajoutée !');
        }
      }
      setForm(emptyForm); setErrors({}); setView('list');
    } catch {
      showToast('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function confirmSupprimer() {
    try {
      await api.deleteConsultation(deleteConfirm);
      setConsultations(p => p.filter(c => c.id !== deleteConfirm));
      showToast('🗑️ Consultation supprimée');
    } catch {
      showToast('❌ Erreur suppression');
    }
    setDeleteConfirm(null);
  }

  function handleSort(field) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  const filtered = consultations
    .filter(c =>
      (c.date_consultation||'').includes(search) ||
      (c.type||'').toLowerCase().includes(search.toLowerCase()) ||
      (c.medecin||'').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a,b) => {
      const va = a[sortField]??'', vb = b[sortField]??'';
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  return (
    <div className="cpage">
      {toast && <div className="cp__toast">{toast}</div>}

      <div className="cpage__bar">
        <button className={`cbar-btn ${view==='form'?'cbar-btn--on':''}`}
          onClick={() => { setView('form'); setEditId(null); setForm(emptyForm); }}>
          ＋ Demander
        </button>
        <button className={`cbar-btn ${view==='list'?'cbar-btn--on':''}`}
          onClick={() => setView('list')}>
          📋 Mes consultations
        </button>
        <button className="cbar-btn" onClick={() => window.print()}>🖨 Imprimer</button>
      </div>

      {view === 'form' && (
        <div className="cform">
          <div className="cform__head">
            {editId ? '✏️ Modifier la consultation' : '📝 Nouvelle demande de consultation'}
          </div>
          <form className="cform__body" onSubmit={handleValider}>

            <div className="cform__grid">
              <div className="cform__field">
                <label>Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange}
                  className={errors.date?'err':''} />
                {errors.date && <span className="ferr">{errors.date}</span>}
              </div>
              <div className="cform__field">
                <label>Heure</label>
                <input type="time" name="heure" value={form.heure} onChange={handleChange}
                  className={errors.heure?'err':''} />
                {errors.heure && <span className="ferr">{errors.heure}</span>}
              </div>
              <div className="cform__field">
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange}
                  className={errors.type?'err':''}>
                  <option value="">-- Choisir --</option>
                  {['Urgence','Routine','Suivi','Téléconsultation'].map(t=><option key={t}>{t}</option>)}
                </select>
                {errors.type && <span className="ferr">{errors.type}</span>}
              </div>
              <div className="cform__field">
                <label>Médecin traitant</label>
                <select name="medecin" value={form.medecin} onChange={handleChange}
                  className={errors.medecin?'err':''}>
                  <option value="">-- Choisir --</option>
                  {['Dr. Ahmed Bennani','Dr. Fatima Zohra','Dr. Karim Alaoui','Dr. Sara Tazi'].map(m=><option key={m}>{m}</option>)}
                </select>
                {errors.medecin && <span className="ferr">{errors.medecin}</span>}
              </div>
              <div className="cform__field cform__field--full">
                <label>Spécialité</label>
                <select name="specialite" value={form.specialite} onChange={handleChange}
                  className={errors.specialite?'err':''}>
                  <option value="">-- Choisir --</option>
                  {['Médecine générale','Cardiologie','Neurologie','Pédiatrie','Dermatologie','Chirurgie'].map(s=><option key={s}>{s}</option>)}
                </select>
                {errors.specialite && <span className="ferr">{errors.specialite}</span>}
              </div>
            </div>

            <div className="cform__actions">
              <button type="submit" className="cbtn cbtn--primary" disabled={saving}>
                {saving ? '⏳ Enregistrement...' : '✔ Valider'}
              </button>
              <button type="button" className="cbtn cbtn--ghost"
                onClick={() => { setForm(emptyForm); setErrors({}); }}>
                ✕ Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {view === 'list' && (
        <div className="ctable-wrap">
          <div className="ctable-head">
            <h3>Mes consultations</h3>
            <input type="text" placeholder="🔍 Rechercher..." value={search}
              onChange={e=>setSearch(e.target.value)} className="ctable-search" />
          </div>
          {loading ? (
            <div className="ctable-empty">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="ctable-empty">Aucune consultation trouvée.</div>
          ) : (
            <table className="ctable">
              <thead>
                <tr>
                  {[
                    {key:'date_consultation',label:'Date'},
                    {key:'heure',label:'Heure'},
                    {key:'type',label:'Type'},
                    {key:'medecin',label:'Médecin'},
                    {key:'specialite',label:'Spécialité'},
                    {key:'statut',label:'Statut'},
                  ].map(f=>(
                    <th key={f.key} onClick={()=>handleSort(f.key)} className="sortable">
                      {f.label} {sortField===f.key?(sortDir==='asc'?'▲':'▼'):'⇅'}
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c=>(
                  <tr key={c.id}>
                    <td>{c.date_consultation}</td>
                    <td>{c.heure}</td>
                    <td>{c.type}</td>
                    <td>{c.medecin}</td>
                    <td>{c.specialite}</td>
                    <td><span className={`statut statut--${c.statut}`}>{c.statut}</span></td>
                    <td>
                      <button className="tbl-btn tbl-btn--edit" onClick={()=>{
                        setForm({date:c.date_consultation,heure:c.heure,type:c.type,medecin:c.medecin,specialite:c.specialite});
                        setEditId(c.id); setView('form');
                      }}>✏️</button>
                      <button className="tbl-btn tbl-btn--delete"
                        onClick={()=>setDeleteConfirm(c.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__icon">⚠️</div>
            <h3>Confirmer la suppression</h3>
            <p>Cette action est irréversible.</p>
            <div className="modal__actions">
              <button className="cbtn cbtn--danger" onClick={confirmSupprimer}>Supprimer</button>
              <button className="cbtn cbtn--ghost" onClick={()=>setDeleteConfirm(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   CONSULTATION MEDECIN
══════════════════════════════════════ */
function ConsultationMedecin({ user }) {
  const nomMedecin = [user?.prenom, user?.nom].filter(Boolean).join(' ') || '';
  const emptyInfo  = { date:'', heure:'', type:'', medecin:nomMedecin, specialite:'' };

  const [formInfo,      setFormInfo]      = useState(emptyInfo);
  const [description,   setDescription]   = useState('');
  const [attachements,  setAttachements]  = useState({ medicaments:[], analyses:[], radiologie:[] });
  const [errors,        setErrors]        = useState({});
  const [consultations, setConsultations] = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [view,          setView]          = useState('form');
  const [editId,        setEditId]        = useState(null);
  const [search,        setSearch]        = useState('');
  const [sortField,     setSortField]     = useState('date_consultation');
  const [sortDir,       setSortDir]       = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast,         setToast]         = useState('');

  const TAGS = {
    medicaments: ['Paracétamol','Ibuprofène','Amoxicilline','Metformine','Amlodipine','Oméprazole'],
    analyses   : ['Numération Formule Sanguine','Glycémie','Créatinine','TSH','Bilan hépatique'],
    radiologie : ['Radiographie','Échographie','Scanner','IRM','Mammographie'],
  };

  useEffect(() => {
    setLoading(true);
    api.getConsultations()
      .then(res => { if (res.success) setConsultations(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(''),3000); }

  function toggleTag(cat, val) {
    setAttachements(p => ({
      ...p,
      [cat]: p[cat].includes(val) ? p[cat].filter(x=>x!==val) : [...p[cat], val],
    }));
  }

  function validate() {
    const e = {};
    if (!formInfo.date)      e.date        = 'Date obligatoire';
    if (!formInfo.heure)     e.heure       = 'Heure obligatoire';
    if (!description.trim()) e.description = 'Description obligatoire';
    if (formInfo.date) {
      const today = new Date(); today.setHours(0,0,0,0);
      if (new Date(formInfo.date) < today) e.date = 'La date ne peut pas être dans le passé';
    }
    return e;
  }

  async function handleValider(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    const payload = {
      date_consultation : formInfo.date,
      heure             : formInfo.heure,
      type              : formInfo.type,
      medecin           : formInfo.medecin,
      specialite        : formInfo.specialite,
      description,
      medicaments       : attachements.medicaments,
      analyses          : attachements.analyses,
      radiologie        : attachements.radiologie,
    };

    try {
      if (editId !== null) {
        const res = await api.updateConsultation(editId, payload);
        if (res.success) {
          setConsultations(p => p.map(c => c.id===editId ? res.data : c));
          showToast('✅ Consultation modifiée !');
        }
        setEditId(null);
      } else {
        const res = await api.createConsultation(payload);
        if (res.success) {
          setConsultations(p => [...p, res.data]);
          showToast('✅ Consultation enregistrée !');
        }
      }
      setFormInfo(emptyInfo); setDescription('');
      setAttachements({medicaments:[],analyses:[],radiologie:[]});
      setErrors({}); setView('list');
    } catch {
      showToast('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function confirmSupprimer() {
    try {
      await api.deleteConsultation(deleteConfirm);
      setConsultations(p => p.filter(c => c.id !== deleteConfirm));
      showToast('🗑️ Supprimée');
    } catch { showToast('❌ Erreur'); }
    setDeleteConfirm(null);
  }

  function handleSort(field) {
    if (sortField===field) setSortDir(d=>d==='asc'?'desc':'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  const filtered = consultations
    .filter(c => (c.date_consultation||'').includes(search) || (c.description||'').toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      const va=a[sortField]??'', vb=b[sortField]??'';
      return sortDir==='asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  return (
    <div className="cpage">
      {toast && <div className="cp__toast">{toast}</div>}

      <div className="cpage__bar">
        <button className={`cbar-btn ${view==='form'?'cbar-btn--on':''}`}
          onClick={()=>{ setView('form'); setEditId(null); setFormInfo(emptyInfo); setDescription(''); setAttachements({medicaments:[],analyses:[],radiologie:[]}); }}>
          ＋ Nouvelle consultation
        </button>
        <button className={`cbar-btn ${view==='list'?'cbar-btn--on':''}`}
          onClick={()=>setView('list')}>
          📋 Liste
        </button>
        <button className="cbar-btn" onClick={()=>window.print()}>🖨 Imprimer</button>
      </div>

      {view === 'form' && (
        <form className="cmed-wrap" onSubmit={handleValider}>

          {/* Infos */}
          <div className="cform">
            <div className="cform__head">
              {editId ? '✏️ Modifier consultation' : '📝 Décrire une consultation'}
            </div>
            <div className="cform__body">
              <div className="cform__grid">
                <div className="cform__field">
                  <label>Date</label>
                  <input type="date" value={formInfo.date}
                    onChange={e=>{setFormInfo(p=>({...p,date:e.target.value}));setErrors(p=>({...p,date:''}));}}
                    className={errors.date?'err':''} />
                  {errors.date && <span className="ferr">{errors.date}</span>}
                </div>
                <div className="cform__field">
                  <label>Heure</label>
                  <input type="time" value={formInfo.heure}
                    onChange={e=>{setFormInfo(p=>({...p,heure:e.target.value}));setErrors(p=>({...p,heure:''}));}}
                    className={errors.heure?'err':''} />
                  {errors.heure && <span className="ferr">{errors.heure}</span>}
                </div>
                <div className="cform__field">
                  <label>Type</label>
                  <select value={formInfo.type} onChange={e=>setFormInfo(p=>({...p,type:e.target.value}))}>
                    <option value="">-- automatique --</option>
                    {['Urgence','Routine','Suivi','Téléconsultation'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="cform__field">
                  <label>Médecin</label>
                  <select value={formInfo.medecin} onChange={e=>setFormInfo(p=>({...p,medecin:e.target.value}))}>
                    <option value="">-- automatique --</option>
                    {['Dr. Ahmed Bennani','Dr. Fatima Zohra','Dr. Karim Alaoui'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="cform__field cform__field--full">
                  <label>Spécialité</label>
                  <select value={formInfo.specialite} onChange={e=>setFormInfo(p=>({...p,specialite:e.target.value}))}>
                    <option value="">-- automatique --</option>
                    {['Médecine générale','Cardiologie','Neurologie','Pédiatrie','Chirurgie'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="cform" style={{marginTop:14}}>
            <div className="cform__head">📄 Description</div>
            <div className="cform__body">
              <textarea className={`ctextarea ${errors.description?'err':''}`}
                value={description}
                onChange={e=>{setDescription(e.target.value);setErrors(p=>({...p,description:''}));}}
                placeholder="Décrivez les symptômes, diagnostic, observations..." />
              {errors.description && <span className="ferr">{errors.description}</span>}
            </div>
          </div>

          {/* Attachements */}
          <div className="cform" style={{marginTop:14}}>
            <div className="cform__head">📎 Attachements</div>
            <div className="cform__body">
              {[
                {label:'💊 Médicaments', key:'medicaments'},
                {label:'🔬 Analyses',    key:'analyses'},
                {label:'🩻 Radiologie',  key:'radiologie'},
              ].map(g=>(
                <div className="attach-group" key={g.key}>
                  <div className="attach-group__label">{g.label}</div>
                  <div className="attach-tags">
                    {TAGS[g.key].map(item=>(
                      <span key={item}
                        className={`attach-tag ${attachements[g.key].includes(item)?'attach-tag--on':''}`}
                        onClick={()=>toggleTag(g.key,item)}
                      >{item}</span>
                    ))}
                  </div>
                </div>
              ))}

              <div className="cform__actions" style={{marginTop:20}}>
                <button type="submit" className="cbtn cbtn--primary" disabled={saving}>
                  {saving ? '⏳ Enregistrement...' : '✔ Valider'}
                </button>
                <button type="button" className="cbtn cbtn--ghost"
                  onClick={()=>setAttachements({medicaments:[],analyses:[],radiologie:[]})}>
                  ✕ Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {view === 'list' && (
        <div className="ctable-wrap">
          <div className="ctable-head">
            <h3>Liste des consultations</h3>
            <input type="text" placeholder="🔍 Rechercher..." value={search}
              onChange={e=>setSearch(e.target.value)} className="ctable-search" />
          </div>
          {loading ? (
            <div className="ctable-empty">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="ctable-empty">Aucune consultation trouvée.</div>
          ) : (
            <table className="ctable">
              <thead>
                <tr>
                  {[
                    {key:'date_consultation',label:'Date'},
                    {key:'heure',label:'Heure'},
                    {key:'type',label:'Type'},
                    {key:'description',label:'Description'},
                  ].map(f=>(
                    <th key={f.key} onClick={()=>handleSort(f.key)} className="sortable">
                      {f.label} {sortField===f.key?(sortDir==='asc'?'▲':'▼'):'⇅'}
                    </th>
                  ))}
                  <th>Médicaments</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c=>{
                  const meds = typeof c.medicaments === 'string' ? JSON.parse(c.medicaments||'[]') : (c.medicaments||[]);
                  return (
                    <tr key={c.id}>
                      <td>{c.date_consultation}</td>
                      <td>{c.heure}</td>
                      <td>{c.type}</td>
                      <td className="td-desc">{c.description?.substring(0,50)}...</td>
                      <td>{meds.join(', ')}</td>
                      <td><span className={`statut statut--${c.statut}`}>{c.statut}</span></td>
                      <td>
                        <button className="tbl-btn tbl-btn--edit" onClick={()=>{
                          const med = typeof c.medicaments==='string'?JSON.parse(c.medicaments||'[]'):(c.medicaments||[]);
                          const ana = typeof c.analyses==='string'?JSON.parse(c.analyses||'[]'):(c.analyses||[]);
                          const rad = typeof c.radiologie==='string'?JSON.parse(c.radiologie||'[]'):(c.radiologie||[]);
                          setFormInfo({date:c.date_consultation,heure:c.heure,type:c.type,medecin:c.medecin,specialite:c.specialite});
                          setDescription(c.description||'');
                          setAttachements({medicaments:med,analyses:ana,radiologie:rad});
                          setEditId(c.id); setView('form');
                        }}>✏️</button>
                        <button className="tbl-btn tbl-btn--delete"
                          onClick={()=>setDeleteConfirm(c.id)}>🗑️</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__icon">⚠️</div>
            <h3>Confirmer la suppression</h3>
            <p>Cette action est irréversible.</p>
            <div className="modal__actions">
              <button className="cbtn cbtn--danger" onClick={confirmSupprimer}>Supprimer</button>
              <button className="cbtn cbtn--ghost" onClick={()=>setDeleteConfirm(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}