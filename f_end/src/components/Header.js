import React from 'react';
import './Header.css';

const SEAL_URL = "https://ih1.redbubble.net/image.783360443.7932/st,small,507x507-pad,600x600,f8f8f8.u2.jpg";

export default function Header() {
  return (
    <header className="hdr">

      <div className="hdr__left">
        <div className="hdr__seal">
          <img src={SEAL_URL} alt="Armoiries du Royaume du Maroc" />
        </div>
        
      </div>

      <div>
        <div className="hdr__brand">
          <h1>e-<span>Milaf</span></h1>
        </div>
      </div>

      <div className="hdr__right">
        <div className="hdr__min-box">
            <img src="https://www.soussmassa.ma/sites/default/files/partner_visual/logo-ministere-sante.png" />
        </div>
      </div>

    </header>
  );
}