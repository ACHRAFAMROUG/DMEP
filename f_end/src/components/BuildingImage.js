import React from 'react';
import './BuildingImage.css';

const BUILDING_URL = "https://www.lavieeco.com/wp-content/uploads/2020/08/ministere-sante.jpg";

const LABELS = {
  FR: { title: "Ministère de la Santé", sub: "Royaume du Maroc" },
  AR: { title: "وزارة الصحة",          sub: "المملكة المغربية" },
};

export default function BuildingImage({ lang, setLang }) {
  const t = LABELS[lang] ?? LABELS.FR;

  return (
    <div className="img-side">
      <img src={BUILDING_URL} alt="Ministère de la Santé — Rabat" />
      <div className="img-side__overlay" />

      {/* Caption */}
      <div className="img-side__caption">
        <h3>{t.title}</h3>
        <p>{t.sub}</p>
      </div>

      {/* ══ BOUTON FR/AR EN BAS DE L'IMAGE ══ */}
      <div className="img-side__lang">
        <button
          className={`img-lang__btn ${lang === 'FR' ? 'img-lang__btn--active' : ''}`}
          onClick={() => setLang('FR')}
        >FR</button>
        <span className="img-lang__sep">|</span>
        <button
          className={`img-lang__btn ${lang === 'AR' ? 'img-lang__btn--active' : ''}`}
          onClick={() => setLang('AR')}
        >AR</button>
      </div>

    </div>
  );
}