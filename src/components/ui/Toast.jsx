import React, { useState, useEffect } from 'react';
import './Toast.css';

/**
 * Toast-Komponente für temporäre Benachrichtigungen
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {string} props.message - Nachrichtentext
 * @param {string} [props.type='info'] - Typ der Benachrichtigung (success, error, warning, info)
 * @param {number} [props.duration=3000] - Anzeigedauer in Millisekunden
 * @param {Function} props.onClose - Callback beim Schließen
 * @returns {JSX.Element|null} Toast-Komponente oder null
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Zeit für die Ausblend-Animation
    }, duration);
    
    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);
  
  const toastClasses = [
    'toast',
    `toast--${type}`,
    visible ? 'toast--visible' : 'toast--hidden'
  ].filter(Boolean).join(' ');
  
  return (
    <div className={toastClasses} role="alert">
      <div className="toast__content">{message}</div>
      <button 
        className="toast__close" 
        onClick={() => setVisible(false)}
        aria-label="Schließen"
      >
        ×
      </button>
    </div>
  );
};

/**
 * ToastContainer-Komponente für die Verwaltung mehrerer Toasts
 * 
 * @returns {JSX.Element} ToastContainer-Komponente
 */
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  
  // Globale Methode zum Hinzufügen von Toasts
  window.showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  };
  
  // Globale Methode zum Entfernen von Toasts
  window.removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  
  const handleClose = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => handleClose(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
