import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import Header        from './components/Header';
import BuildingImage from './components/BuildingImage';
import AuthForm      from './components/AuthForm';
import CreateAccount from './components/CreateAccount';
import Footer        from './components/Footer';

export default function AuthPage() {
  const [page, setPage] = useState('login');
  const [lang, setLang] = useState('FR');
  const navigate = useNavigate();

  function handleSetLang(l) { setLang(l); }

  function handleLoginSuccess(u) {
  window.location.href = '/consultation';
}

  return (
    <div className="auth-page" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      <Header lang={lang} setLang={handleSetLang} />
      {page === 'login' && (
        <main className="auth-page__main">
          <BuildingImage lang={lang} setLang={handleSetLang} />
          <AuthForm
            lang={lang}
            setLang={handleSetLang}
            onCreateAccount={() => setPage('create')}
            onLoginSuccess={handleLoginSuccess}
          />
        </main>
      )}
      {page === 'create' && (
        <CreateAccount
          lang={lang}
          setLang={handleSetLang}
          onBack={() => setPage('login')}
        />
      )}
      <Footer lang={lang} />
    </div>
  );
}