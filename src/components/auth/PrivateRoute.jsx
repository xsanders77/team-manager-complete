import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * PrivateRoute-Komponente zum Schutz von Routen vor nicht-authentifizierten Zugriff
 * 
 * @param {Object} props - Komponenten-Props
 * @returns {React.ReactElement}
 */
const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Während der Authentifizierungsstatus geladen wird, zeigen wir nichts an
  if (isLoading) {
    return null;
  }
  
  // Wenn der Benutzer nicht authentifiziert ist, leiten wir zur Login-Seite weiter
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Wenn der Benutzer authentifiziert ist, rendern wir die geschützten Routen
  return <Outlet />;
};

export default PrivateRoute;
