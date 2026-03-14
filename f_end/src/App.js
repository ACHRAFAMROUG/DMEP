import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import ConsultationPage from './components/ConsultationPage';

function PrivateRoute({ children }) {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/" replace />;

  const user = JSON.parse(userStr);
  const role = user?.profile || 'patient';  // ← vient de user.profile

  return React.cloneElement(children, { user, role });
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/consultation" element={
        <PrivateRoute>
          <ConsultationPage />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}