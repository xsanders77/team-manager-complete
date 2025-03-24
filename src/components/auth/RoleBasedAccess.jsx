import React from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * RoleBasedAccess-Komponente für bedingte Renderung basierend auf Benutzerrolle
 * 
 * @param {Object} props - Komponenten-Props
 * @param {Array} props.roles - Array von erlaubten Rollen für diesen Inhalt
 * @param {React.ReactNode} props.children - Inhalt, der angezeigt werden soll, wenn der Benutzer berechtigt ist
 * @param {React.ReactNode} props.fallback - Optionaler Fallback-Inhalt, der angezeigt wird, wenn der Benutzer nicht berechtigt ist
 * @returns {React.ReactElement|null}
 */
const RoleBasedAccess = ({ 
  roles = [], 
  children, 
  fallback = null 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  // Wenn der Benutzer nicht authentifiziert ist oder keine Rolle hat, zeigen wir den Fallback an
  if (!isAuthenticated || !user || !user.role) {
    return fallback;
  }
  
  // Wenn keine Rollen angegeben sind oder die Rolle des Benutzers in den erlaubten Rollen enthalten ist,
  // zeigen wir den Inhalt an
  if (roles.length === 0 || roles.includes(user.role)) {
    return children;
  }
  
  // Andernfalls zeigen wir den Fallback an
  return fallback;
};

export default RoleBasedAccess;
