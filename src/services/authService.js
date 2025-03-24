// src/services/authService.js
import api from './api';

// Login
const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { token, userId, role } = response.data;

  return {
    token,
    user: {
      id: userId,
      role: role
    }
  };
};

// Registrierung
const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  const { token, userId, role } = response.data;

  return {
    token,
    user: {
      id: userId,
      role: role
    }
  };
};

// Benutzerprofil abrufen
const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// Passwort zurücksetzen (Dummy/Platzhalter)
const resetPassword = async (email) => {
  // TODO: Wenn Backend-Funktion vorhanden, hier implementieren
  return Promise.resolve();
};

// Profil aktualisieren (nur Beispiel)
const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export default {
  login,
  signup,
  getProfile,
  resetPassword,
  updateProfile
};
