import axios from 'axios';

// API-Basis-URL aus der Umgebungsvariable oder Standard-URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Axios-Instanz mit Basis-URL erstellen
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request-Interceptor für das Hinzufügen des Auth-Tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response-Interceptor für die Fehlerbehandlung
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Automatische Abmeldung bei 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
