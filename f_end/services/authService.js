import API from './api';

/* ── INSCRIPTION ── */
export const registerUser = async (formData) => {
  const data = new FormData();
  data.append('nom',           formData.nom);
  data.append('prenom',        formData.prenom);
  data.append('email',         formData.email);
  data.append('telephone',     formData.telephone);
  data.append('mot_de_passe',  formData.motDePasse);
  data.append('profil',        formData.profile);
  data.append('date_naissance', formData.dateNaissance ?? '2000-01-01');
  if (formData.photo) data.append('photo', formData.photo);

  const res = await API.post('/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

/* ── CONNEXION ── */
export const loginUser = async (email, password) => {
  const res = await API.post('/login', { email, password });
  return res.data;
};

/* ── DÉCONNEXION ── */
export const logoutUser = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};