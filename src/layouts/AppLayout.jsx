import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AppLayout.css';

/**
 * Hauptlayout für authentifizierte Seiten mit Navigation
 * 
 * @returns {JSX.Element} AppLayout-Komponente
 */
const AppLayout = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  // Während der Authentifizierungsstatus geladen wird
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loader"></div>
        <p>Wird geladen...</p>
      </div>
    );
  }

  // Wenn nicht authentifiziert, zur Login-Seite umleiten
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Navigationsoptionen basierend auf der Benutzerrolle
  const getNavLinks = () => {
    const role = user?.role;
    
    switch (role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard' },
          { to: '/admin/teams', label: 'Teams' },
          { to: '/admin/users', label: 'Benutzer' },
        ];
      case 'trainer':
        return [
          { to: '/trainer', label: 'Dashboard' },
          { to: '/trainer/events', label: 'Termine' },
          { to: '/trainer/events/create', label: 'Termin erstellen' },
        ];
      case 'player':
        return [
          { to: '/player', label: 'Dashboard' },
          { to: '/player/events', label: 'Termine' },
        ];
      case 'parent':
        return [
          { to: '/parent', label: 'Dashboard' },
          { to: '/parent/children', label: 'Kinder' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__logo">Team Manager</div>
        <nav className="app-header__nav">
          <ul>
            {navLinks.map((link, index) => (
              <li key={index}>
                <a href={link.to}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="app-header__user">
          <span>{user?.name}</span>
          <button className="app-header__logout" onClick={logout}>
            Abmelden
          </button>
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Team Manager</p>
      </footer>
    </div>
  );
};

export default AppLayout;
