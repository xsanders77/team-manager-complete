import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// Kontext erstellen
export const AuthContext = createContext();

// Anfangszustand
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Reducer zur Verwaltung des Status
function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null };
    case 'AUTH_FAILURE':
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ✅ Benutzerprofil abrufen (z. B. beim Reload)
  const fetchUserProfile = useCallback(async () => {
    dispatch({ type: 'AUTH_START' });

    try {
      const token = localStorage.getItem('auth_token'); // 🛠 hier war der Fehler
      if (!token) {
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }

      const userData = await authService.getProfile();
      dispatch({ type: 'AUTH_SUCCESS', payload: userData });
    } catch (err) {
      console.error('Fehler beim Abrufen des Benutzerprofils:', err);
      dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Profilfehler' });
      localStorage.removeItem('auth_token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
    }
  }, []);

  // ✅ Anmeldung
  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const { token, user } = await authService.login(credentials);
      localStorage.setItem('auth_token', token); // 🛠 wichtig!
      localStorage.setItem('userId', user.id);
      localStorage.setItem('role', user.role);

      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      return user;
    } catch (err) {
      console.error('Anmeldefehler:', err);
      dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Anmeldefehler' });
      throw err;
    }
  };

  // ✅ Registrierung
  const signup = async (userData) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const { token, user } = await authService.signup(userData);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('role', user.role);

      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      return user;
    } catch (err) {
      console.error('Registrierungsfehler:', err);
      dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Registrierungsfehler' });
      throw err;
    }
  };

  // ✅ Abmelden
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // ✅ Passwort zurücksetzen (optional)
  const resetPassword = async (email) => {
    dispatch({ type: 'AUTH_START' });
    try {
      await authService.resetPassword(email);
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (err) {
      console.error('Fehler beim Zurücksetzen des Passworts:', err);
      dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Fehler beim Zurücksetzen des Passworts' });
      throw err;
    }
  };

  // ✅ Profil aktualisieren (optional)
  const updateProfile = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const updatedUser = await authService.updateProfile(userData);
      dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser });
      return updatedUser;
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Profils:', err);
      dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Fehler beim Aktualisieren des Profils' });
      throw err;
    }
  };

  // Wird beim Laden der App einmalig ausgeführt
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const contextValue = {
    ...state,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
