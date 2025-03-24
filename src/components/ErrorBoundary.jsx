import React, { useState, useEffect } from 'react';
import './ErrorBoundary.css';

/**
 * ErrorBoundary-Komponente zum Abfangen von Fehlern in der Komponenten-Hierarchie
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {React.ReactNode} props.children - Kind-Komponenten
 * @param {string} [props.fallbackMessage='Es ist ein Fehler aufgetreten.'] - Nachricht, die angezeigt wird, wenn ein Fehler auftritt
 * @returns {JSX.Element} ErrorBoundary-Komponente
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Aktualisieren des State, damit beim nächsten Rendern der Fallback-UI angezeigt wird
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Fehlerinformationen erfassen
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Fehler an einen Fehlerprotokollierungsdienst senden
    console.error("ErrorBoundary hat einen Fehler abgefangen:", error, errorInfo);
    
    // Hier könnte ein API-Aufruf erfolgen, um den Fehler an einen Server zu senden
    // logErrorToServer(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback-UI rendern
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h2>Oops, etwas ist schiefgelaufen!</h2>
            <p>{this.props.fallbackMessage || 'Es ist ein Fehler aufgetreten.'}</p>
            
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="error-details">
                <h3>Fehlerdetails:</h3>
                <p>{this.state.error.toString()}</p>
                <div className="error-stack">
                  <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                </div>
              </div>
            )}
            
            <div className="error-boundary__actions">
              <button 
                className="error-boundary__button" 
                onClick={this.handleReset}
              >
                Erneut versuchen
              </button>
              <button 
                className="error-boundary__button" 
                onClick={() => window.location.href = '/'}
              >
                Zur Startseite
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook für die Verwendung von ErrorBoundary in funktionalen Komponenten
 * 
 * @param {Error} error - Fehler, der abgefangen werden soll
 * @param {string} [fallbackMessage='Es ist ein Fehler aufgetreten.'] - Nachricht, die angezeigt wird, wenn ein Fehler auftritt
 * @returns {JSX.Element|null} Fehlerkomponente oder null
 */
export const useErrorHandler = (error, fallbackMessage) => {
  const [caughtError, setCaughtError] = useState(null);
  
  useEffect(() => {
    if (error) {
      setCaughtError(error);
      console.error("useErrorHandler hat einen Fehler abgefangen:", error);
    }
  }, [error]);
  
  if (caughtError) {
    return (
      <div className="error-boundary">
        <div className="error-boundary__content">
          <h2>Oops, etwas ist schiefgelaufen!</h2>
          <p>{fallbackMessage || 'Es ist ein Fehler aufgetreten.'}</p>
          
          {process.env.NODE_ENV !== 'production' && (
            <div className="error-details">
              <h3>Fehlerdetails:</h3>
              <p>{caughtError.toString()}</p>
            </div>
          )}
          
          <div className="error-boundary__actions">
            <button 
              className="error-boundary__button" 
              onClick={() => setCaughtError(null)}
            >
              Erneut versuchen
            </button>
            <button 
              className="error-boundary__button" 
              onClick={() => window.location.href = '/'}
            >
              Zur Startseite
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default ErrorBoundary;
