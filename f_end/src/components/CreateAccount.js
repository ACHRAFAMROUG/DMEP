import React, { useState } from 'react';
import './CreateAccount.css';

const BUILDING_URL = "https://www.lavieeco.com/wp-content/uploads/2020/08/ministere-sante.jpg";

const LABELS = {
  FR: {
    title        : "Création compte",
    nom          : "Nom",
    prenom       : "Prénom",
    dateNaissance: "Date naissance :",
    emailPH      : "Email",
    telephonePH  : "Numéro téléphone patient adulte ou parent de l'enfant",
    photoProfile : "Photo profile :",
    profile      : "Profile :",
    motDePassePH : "••••••••",
    selectDefault: "-- Sélectionner --",
    patient      : "Patient",
    medecin      : "Médecin",
    infirmier    : "Infirmier",
    admin        : "Administrateur",
    valider      : "Valider",
    annuler      : "Annuler",
    deja         : "Déjà un compte",
    obligatoire  : "Champ obligatoire",
    succes       : "Compte créé avec succès !",
  },
  AR: {
    title        : "إنشاء حساب",
    nom          : "الاسم العائلي",
    prenom       : "الاسم الشخصي",
    dateNaissance: "تاريخ الميلاد :",
    emailPH      : "البريد الإلكتروني",
    telephonePH  : "رقم هاتف المريض البالغ أو ولي الطفل",
    photoProfile : "صورة الملف الشخصي :",
    profile      : "الملف الشخصي :",
    motDePassePH : "كلمة المرور",
    selectDefault: "-- اختر --",
    patient      : "مريض",
    medecin      : "طبيب",
    infirmier    : "ممرض",
    admin        : "مدير",
    valider      : "تأكيد",
    annuler      : "إلغاء",
    deja         : "لدي حساب بالفعل",
    obligatoire  : "هذا الحقل إلزامي",
    succes       : "تم إنشاء الحساب بنجاح !",
  },
};

export default function CreateAccount({ lang, setLang, onBack }) {
  const t     = LABELS[lang] ?? LABELS.FR;
  const isRTL = lang === 'AR';

  const [form, setForm] = useState({
    nom:'', prenom:'', dateNaissance:'',
    email:'', telephone:'', photo:null,
    profile:'', motDePasse:'',
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  }

  function validate() {
    const e = {};
    if (!form.nom)           e.nom           = t.obligatoire;
    if (!form.prenom)        e.prenom        = t.obligatoire;
    if (!form.dateNaissance) e.dateNaissance = t.obligatoire;
    if (!form.email)         e.email         = t.obligatoire;
    if (!form.telephone)     e.telephone     = t.obligatoire;
    if (!form.profile)       e.profile       = t.obligatoire;
    if (!form.motDePasse)    e.motDePasse    = t.obligatoire;
    return e;
  }

async function handleValider(e) {
  e.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length > 0) { setErrors(errs); return; }
  setErrors({});

  try {
    // ── Envoi avec FormData pour inclure la photo ──
    const formData = new FormData();
    formData.append('nom',          form.nom);
    formData.append('prenom',       form.prenom);
    formData.append('email',        form.email);
    formData.append('telephone',    form.telephone);
    formData.append('mot_de_passe', form.motDePasse);
    formData.append('profil',       form.profile);
    formData.append('date_naissance', form.dateNaissance);
    if (form.photo) formData.append('photo', form.photo);

    const res = await fetch('http://127.0.0.1:8000/api/register', {
      method : 'POST',
      mode   : 'cors',
      headers: { 'Accept': 'application/json' },
      // ⚠️ PAS de Content-Type ici — FormData le gère automatiquement
      body   : formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // ✅ Sauvegarder dans localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));

    alert(t.succes);

    // ✅ Rediriger directement vers consultation
    window.location.href = '/consultation';

  } catch (err) {
    alert(err.message);
  }
}

  function handleAnnuler() {
    setForm({ nom:'', prenom:'', dateNaissance:'', email:'',
              telephone:'', photo:null, profile:'', motDePasse:'' });
    setErrors({});
  }

  return (
    <main className="create-main" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ══ FORMULAIRE GAUCHE ══ */}
      <div className="create-left">
        <h2 className="create-title">{t.title}</h2>

        <form className="create-form" onSubmit={handleValider} noValidate>

          {/* Nom */}
          <div className={`cf-field ${errors.nom ? 'cf-field--error' : ''}`}>
            <input type="text" name="nom" value={form.nom}
              onChange={handleChange} placeholder={t.nom}/>
            <span className="cf-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </span>
            {errors.nom && <span className="cf-error-msg">{errors.nom}</span>}
          </div>

          {/* Prénom */}
          <div className={`cf-field ${errors.prenom ? 'cf-field--error' : ''}`}>
            <input type="text" name="prenom" value={form.prenom}
              onChange={handleChange} placeholder={t.prenom}/>
            <span className="cf-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </span>
            {errors.prenom && <span className="cf-error-msg">{errors.prenom}</span>}
          </div>

          {/* Date naissance */}
          <div className={`cf-field cf-field--row ${errors.dateNaissance ? 'cf-field--error' : ''}`}>
            <label className="cf-label">{t.dateNaissance}</label>
            <div className="cf-date-wrap">
              <input type="date" name="dateNaissance"
                value={form.dateNaissance} onChange={handleChange}/>
              <span className="cf-icon cf-icon--inside">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8"  y1="2" x2="8"  y2="6"/>
                  <line x1="3"  y1="10" x2="21" y2="10"/>
                </svg>
              </span>
            </div>
            {errors.dateNaissance && <span className="cf-error-msg">{errors.dateNaissance}</span>}
          </div>

          {/* Email */}
          <div className={`cf-field ${errors.email ? 'cf-field--error' : ''}`}>
            <input type="email" name="email" value={form.email}
              onChange={handleChange} placeholder={t.emailPH}/>
            <span className="cf-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </span>
            {errors.email && <span className="cf-error-msg">{errors.email}</span>}
          </div>

          {/* Téléphone */}
          <div className={`cf-field ${errors.telephone ? 'cf-field--error' : ''}`}>
            <input type="tel" name="telephone" value={form.telephone}
              onChange={handleChange} placeholder={t.telephonePH}/>
            <span className="cf-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.5 1.18 2 2 0 012.5 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l.88-.88a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </span>
            {errors.telephone && <span className="cf-error-msg">{errors.telephone}</span>}
          </div>

          {/* Photo profile */}
          <div className="cf-field cf-field--row">
            <label className="cf-label">{t.photoProfile}</label>
            <div className="cf-file-wrap">
              <input type="file" name="photo" accept="image/*" onChange={handleChange}/>
              <span className="cf-icon cf-icon--inside">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Profile */}
          <div className={`cf-field cf-field--row ${errors.profile ? 'cf-field--error' : ''}`}>
            <label className="cf-label">{t.profile}</label>
            <div className="cf-select-wrap">
              <select name="profile" value={form.profile} onChange={handleChange}>
                <option value="">{t.selectDefault}</option>
                <option value="patient">{t.patient}</option>
                <option value="medecin">{t.medecin}</option>
                <option value="infirmier">{t.infirmier}</option>
                <option value="admin">{t.admin}</option>
              </select>
              <span className="cf-icon cf-icon--inside">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
            </div>
            {errors.profile && <span className="cf-error-msg">{errors.profile}</span>}
          </div>

          {/* Mot de passe */}
          <div className={`cf-field ${errors.motDePasse ? 'cf-field--error' : ''}`}>
            <input type="password" name="motDePasse" value={form.motDePasse}
              onChange={handleChange} placeholder={t.motDePassePH}/>
            <span className="cf-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M7 7V5a5 5 0 0110 0v2"/>
              </svg>
            </span>
            {errors.motDePasse && <span className="cf-error-msg">{errors.motDePasse}</span>}
          </div>

          <button type="submit"  className="cf-btn cf-btn--valider">{t.valider}</button>
          <button type="button"  className="cf-btn cf-btn--annuler" onClick={handleAnnuler}>{t.annuler}</button>
          <button type="button"  className="cf-btn cf-btn--deja"    onClick={onBack}>{t.deja}</button>

        </form>
      </div>

      {/* ══ IMAGE DROITE ══ */}
      <div className="create-right">
        <img src={BUILDING_URL} alt="Ministère de la Santé" />
        <div className="create-right__overlay" />
        <div className="create-right__lang">
          <button
            className={`lang-btn ${lang === 'FR' ? 'lang-btn--active' : ''}`}
            onClick={() => setLang('FR')}
          >FR</button>
          <span className="lang-sep">|</span>
          <button
            className={`lang-btn ${lang === 'AR' ? 'lang-btn--active' : ''}`}
            onClick={() => setLang('AR')}
          >AR</button>
        </div>
      </div>

    </main>
  );
}