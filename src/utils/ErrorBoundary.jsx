import React from 'react';
import Alert from './Alert';

/**
 * ErrorBoundary-Komponente zum Abfangen von Fehlern in der Komponenten-Hierarchie
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Aktualisiert den State, damit der nächste Render die Fallback-UI anzeigt
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Fehlerinformationen loggen
    console.error('ErrorBoundary hat einen Fehler abgefangen:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Hier könnte ein Fehler-Tracking-Service wie Sentry eingebunden werden
  }

  render() {
    if (this.state.hasError) {
      // Fallback-UI für Fehler
      return (
        <div className="error-boundary">
          <Alert 
            type="error" 
            message={
              <>
                <h3>Etwas ist schiefgelaufen</h3>
                <p>{this.state.error && this.state.error.toString()}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="error-reload-btn"
                >
                  Seite neu laden
                </button>
              </>
            } 
          />
          {this.props.showDetails && this.state.errorInfo && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
              <summary>Stack Trace</summary>
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
