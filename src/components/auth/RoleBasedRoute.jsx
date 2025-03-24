import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * RoleBasedRoute-Komponente für rollenbasierte Zugriffskontrolle
 * 
 * @param {Object} props - Komponenten-Props
 * @param {Array} props.roles - Array von erlaubten Rollen für diese Route
 * @param {string} props.redirectTo - Pfad, zu dem umgeleitet werden soll, wenn der Benutzer nicht berechtigt ist
 * @returns {React.ReactElement}
 */
const RoleBasedRoute = ({ roles = [], redirectTo = "/" }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Während der Authentifizierungsstatus geladen wird, zeigen wir nichts an
  if (isLoading) {
    return null;
  }
  
  // Wenn der Benutzer nicht authentifiziert ist, leiten wir zur Login-Seite weiter
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Wenn der Benutzer authentifiziert ist, aber nicht die erforderliche Rolle hat,
  // leiten wir zur angegebenen Seite weiter
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Wenn der Benutzer authentifiziert ist und die erforderliche Rolle hat,
  // rendern wir die geschützten Routen
  return <Outlet />;
};

export default RoleBasedRoute;
