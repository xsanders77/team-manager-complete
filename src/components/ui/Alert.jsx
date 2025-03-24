import React from 'react';
import './Alert.css';

/**
 * Wiederverwendbare Alert-Komponente für Benachrichtigungen
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {string} props.type - Typ der Benachrichtigung (success, error, warning, info)
 * @param {string} props.message - Nachrichtentext
 * @param {boolean} [props.dismissible=false] - Ob die Benachrichtigung schließbar ist
 * @param {Function} [props.onDismiss] - Callback beim Schließen
 * @returns {JSX.Element} Alert-Komponente
 */
const Alert = ({ 
  type = 'info', 
  message, 
  dismissible = false, 
  onDismiss,
  ...rest 
}) => {
  const alertClasses = [
    'alert',
    `alert--${type}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={alertClasses} role="alert" {...rest}>
      <div className="alert__content">{message}</div>
      {dismissible && (
        <button 
          type="button" 
          className="alert__close" 
          onClick={onDismiss}
          aria-label="Schließen"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
