import React from 'react';
import { ToastContainer } from './ui/Toast';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

/**
 * App-Komponente, die als Wrapper für die gesamte Anwendung dient
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {React.ReactNode} props.children - Kind-Komponenten
 * @returns {JSX.Element} App-Komponente
 */
const AppWrapper = ({ children }) => {
  return (
    <ErrorBoundary fallbackMessage="Es ist ein Fehler in der Anwendung aufgetreten. Bitte versuchen Sie es später erneut.">
      <div className="app-wrapper">
        {children}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};

export default AppWrapper;
