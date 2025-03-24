import React from 'react';
import './Form.css';

/**
 * Form-Komponente für Formulare mit Validierung
 * 
 * @param {Object} props - Komponenten-Props
 * @param {function} props.onSubmit - Callback-Funktion für das Absenden des Formulars
 * @param {React.ReactNode} props.children - Inhalt des Formulars (Formularfelder)
 * @param {boolean} props.loading - Ob das Formular gerade abgesendet wird
 * @param {string} props.submitText - Text für den Submit-Button
 * @param {string} props.errorMessage - Fehlermeldung, die angezeigt werden soll
 * @param {string} props.successMessage - Erfolgsmeldung, die angezeigt werden soll
 * @returns {React.ReactElement}
 */
const Form = ({ 
  onSubmit, 
  children, 
  loading = false, 
  submitText = 'Speichern', 
  errorMessage = '', 
  successMessage = '' 
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit && !loading) {
      onSubmit(event);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit} noValidate>
      {errorMessage && (
        <div className="form-message error-message">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="form-message success-message">
          {successMessage}
        </div>
      )}
      
      <div className="form-fields">
        {children}
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="form-submit-button" 
          disabled={loading}
        >
          {loading ? (
            <span className="loading-indicator">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </span>
          ) : submitText}
        </button>
      </div>
    </form>
  );
};

export default Form;
