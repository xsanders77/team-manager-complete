import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom Hook für den Zugriff auf den AuthContext
 * 
 * @returns {Object} Auth-Kontext mit Benutzerinformationen und Authentifizierungsfunktionen
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  
  return context;
}

export default useAuth;
