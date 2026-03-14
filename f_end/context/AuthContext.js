import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [token,   setToken]   = useState(
    localStorage.getItem('token') || null
  );
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  /* ── CONNEXION ── */
  async function login(email, motDePasse) {
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(email, motDePasse);

      /* Laravel retourne token dans data.token ou data.access_token */
      const token = data.token || data.access_token;
      const user  = data.user  || data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user',  JSON.stringify(user));
      setToken(token);
      setUser(user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message
               || err.response?.data?.error
               || 'Email ou mot de passe incorrect.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }

  /* ── INSCRIPTION ── */
  async function register(formData) {
    setError('');
    setLoading(true);
    try {
      const data = await registerUser(formData);

      const token = data.token || data.access_token;
      const user  = data.user  || data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user',  JSON.stringify(user));
      setToken(token);
      setUser(user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message
               || err.response?.data?.error
               || "Erreur lors de l'inscription.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }

  /* ── DÉCONNEXION ── */
  async function logout() {
    await logoutUser();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading, error,
      login, register, logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}