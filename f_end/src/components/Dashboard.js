import React from 'react';
import './Dashboard.css';

export default function Dashboard({ role }) {
  const isPatient = role?.toLowerCase() === 'patient';

  const kpisMedecin = [
  { label: 'Nombre total rendez-vous',     Icon: IconClock     },
  { label: 'Nombre total consultations',   Icon: IconSend      },
  { label: 'Nombre total patients',        Icon: IconUsers     },
  { label: 'Nombre total coût traitement', Icon: IconCash      },
  { label: 'Nombre total ordonnances',     Icon: IconClipboard },
];

const kpisPatient = [
  { label: 'Nombre total rendez-vous',  Icon: IconClock   },
  { label: 'Nombre total consultations',Icon: IconSend    },
  { label: 'Nombre total analyses',     Icon: IconFlask   },
  { label: 'Nombre total opérations',   Icon: IconScalpel },
];

  const kpis = isPatient ? kpisPatient : kpisMedecin;

  const featuresMedecin = [
    { label: 'Classement par date',       Icon: IconBarChart  },
    { label: 'Classement par spécialité', Icon: IconGrid      },
    { label: 'Classement par cout',       Icon: IconPieChart  },
  ];

  const featuresPatient = [
    { label: 'Classement par date',       Icon: IconBarChart  },
    { label: 'Classement par spécialité', Icon: IconGrid      },
    { label: 'Classement par médecin',    Icon: IconPieChart  },
  ];

  const features = isPatient ? featuresPatient : featuresMedecin;

  return (
    <div className="db">
      <div className="db__title-bar">Dashboard</div>

      <div className="db__kpis">
        {kpis.map((kpi, i) => (
          <div key={i} className="db__kpi">
            <div className="db__kpi-left">
              <span className="db__kpi-label">{kpi.label}</span>
            </div>
            <div className="db__kpi-icon">
              <kpi.Icon />
            </div>
          </div>
        ))}
      </div>

      <div className="db__features-title">Features</div>
      <div className="db__features">
        {features.map((f, i) => (
          <div key={i} className="db__feature">
            <div className="db__feature-icon"><f.Icon /></div>
            <span className="db__feature-label">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ SVG ICONS ══ */
function IconClock() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function IconCash() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
      <line x1="6" y1="15" x2="6.01" y2="15" strokeWidth="2"/>
      <line x1="10" y1="15" x2="14" y2="15"/>
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  );
}

function IconFlask() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v7l4 9H5L9 10V3z"/>
      <line x1="9" y1="3" x2="15" y2="3"/>
    </svg>
  );
}

function IconScalpel() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="11" y2="17"/>
    </svg>
  );
}

function IconBarChart() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="20" x2="22" y2="20"/>
      <rect x="3"  y="14" width="4" height="6" fill="#aaa" stroke="none"/>
      <rect x="10" y="9"  width="4" height="11" fill="#aaa" stroke="none"/>
      <rect x="17" y="4"  width="4" height="16" fill="#aaa" stroke="none"/>
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1"/>
      <line x1="3"  y1="9"  x2="21" y2="9"/>
      <line x1="3"  y1="15" x2="21" y2="15"/>
      <line x1="9"  y1="3"  x2="9"  y2="21"/>
      <line x1="15" y1="3"  x2="15" y2="21"/>
    </svg>
  );
}
function IconPieChart() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
      <path d="M22 12A10 10 0 0 0 12 2v10z"/>
    </svg>
  );
}