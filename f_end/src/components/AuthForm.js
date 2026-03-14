import React, { useState } from 'react';
import './AuthForm.css';

const T = {
  FR: {
    title:      'Authentification Page',
    emailPH:    'Email Adresse',
    passwordPH: 'Password',
    connect:    'Se Connecter',
    create:     'Créer un compte',
    required:   'Veuillez remplir tous les champs.',
    badCreds:   'Identifiants incorrects. Veuillez réessayer.',
  },
  AR: {
    title:      'صفحة المصادقة',
    emailPH:    'البريد الإلكتروني',
    passwordPH: 'كلمة المرور',
    connect:    'تسجيل الدخول',
    create:     'إنشاء حساب',
    required:   'يرجى ملء جميع الحقول.',
    badCreds:   'بيانات غير صحيحة. يرجى المحاولة مجددًا.',
  },
};

export default function AuthForm({ lang, onCreateAccount, onLoginSuccess }) {
  const t = T[lang] ?? T.FR;

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e) {
  e.preventDefault();
  setError('');
  if (!email || !password) { setError(t.required); return; }

  setLoading(true);
  try {
    const res = await fetch('http://127.0.0.1:8000/api/login', {
      method : 'POST',
      mode   : 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept'      : 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || t.badCreds);

    /* ✅ Sauvegarder dans localStorage */
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));

    /* ✅ Appeler le callback */
    onLoginSuccess(data.user);

  } catch (err) {
    setError(err.message || t.badCreds);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="form-side">
      <div className="form-wrap">
        <div className="form-header">
          <h1>{t.title}</h1>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="form-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="field">
            <div className="field__wrap">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.emailPH}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <div className="field__wrap">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t.passwordPH}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="btn-connect" disabled={loading}>
            {loading && <span className="spinner" />}
            {t.connect}
          </button>

          <button type="button" className="btn-create" onClick={onCreateAccount}>
            {t.create}
          </button>
        </form>
      </div>
    </div>
  );
}