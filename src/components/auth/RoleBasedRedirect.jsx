import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * RoleBasedRedirect-Komponente für rollenbasierte Umleitung zur entsprechenden Startseite
 * 
 * @param {Object} props - Komponenten-Props
 * @returns {React.ReactElement}
 */
const RoleBasedRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Während der Authentifizierungsstatus geladen wird, zeigen wir nichts an
  if (isLoading) {
    return null;
  }
  
  // Wenn der Benutzer nicht authentifiziert ist, leiten wir zur Login-Seite weiter
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Basierend auf der Rolle des Benutzers leiten wir zur entsprechenden Startseite weiter
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'trainer':
      return <Navigate to="/trainer" replace />;
    case 'player':
      return <Navigate to="/player" replace />;
    case 'parent':
      return <Navigate to="/parent" replace />;
    default:
      // Fallback für unbekannte Rollen
      return <Navigate to="/dashboard" replace />;
  }
};

export default RoleBasedRedirect;
