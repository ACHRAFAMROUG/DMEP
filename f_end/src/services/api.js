const BASE = 'http://127.0.0.1:8000/api';

function headers() {
  const user  = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token') || '';
  return {
    'Content-Type' : 'application/json',
    'Accept'       : 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-User-Id'    : user.id || '',
  };
}

export const api = {
  /* Lister */
  getConsultations: () =>
    fetch(`${BASE}/consultations`, { headers: headers() }).then(r => r.json()),

  /* Créer */
  createConsultation: (data) =>
    fetch(`${BASE}/consultations`, {
      method : 'POST',
      headers: headers(),
      body   : JSON.stringify(data),
    }).then(r => r.json()),

  /* Modifier */
  updateConsultation: (id, data) =>
    fetch(`${BASE}/consultations/${id}`, {
      method : 'PUT',
      headers: headers(),
      body   : JSON.stringify(data),
    }).then(r => r.json()),

  /* Supprimer */
  deleteConsultation: (id) =>
    fetch(`${BASE}/consultations/${id}`, {
      method : 'DELETE',
      headers: headers(),
    }).then(r => r.json()),
};