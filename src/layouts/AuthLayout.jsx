import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AuthLayout.css';

/**
 * Layout für nicht-authentifizierte Seiten (Login, Signup, Passwort-Reset)
 * 
 * @returns {JSX.Element} AuthLayout-Komponente
 */
const AuthLayout = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Während der Authentifizierungsstatus geladen wird
  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loader"></div>
        <p>Wird geladen...</p>
      </div>
    );
  }

  // Wenn bereits authentifiziert, zur entsprechenden Startseite umleiten
  if (isAuthenticated && user) {
    const role = user.role;
    let redirectPath = '/';
    
    switch (role) {
      case 'admin':
        redirectPath = '/admin';
        break;
      case 'trainer':
        redirectPath = '/trainer';
        break;
      case 'player':
        redirectPath = '/player';
        break;
      case 'parent':
        redirectPath = '/parent';
        break;
      default:
        redirectPath = '/';
    }
    
    return <Navigate to={redirectPath} />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-logo">
          <h1>Team Manager</h1>
        </div>
        <div className="auth-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
