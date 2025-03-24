import React, { useEffect, useState, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

/**
 * Wiederverwendbare Modal-Komponente für Dialoge und Popups
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {boolean} props.isOpen - Ob das Modal geöffnet ist
 * @param {Function} props.onClose - Callback beim Schließen des Modals
 * @param {string} [props.title] - Titel des Modals
 * @param {React.ReactNode} props.children - Inhalt des Modals
 * @param {string} [props.size='medium'] - Größe des Modals (small, medium, large)
 * @param {boolean} [props.closeOnBackdropClick=true] - Ob das Modal beim Klick auf den Hintergrund geschlossen werden soll
 * @returns {JSX.Element|null} Modal-Komponente oder null wenn geschlossen
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  closeOnBackdropClick = true
}) => {
  // Wenn das Modal nicht geöffnet ist, nichts rendern
  if (!isOpen) return null;
  
  // Erstelle ein div-Element für das Portal
  const [modalRoot] = useState(() => {
    const root = document.createElement('div');
    root.className = 'modal-root';
    return root;
  });
  
  // Füge das Portal-Element zum DOM hinzu und entferne es beim Unmount
  useLayoutEffect(() => {
    document.body.appendChild(modalRoot);
    return () => {
      document.body.removeChild(modalRoot);
    };
  }, [modalRoot]);
  
  // Verhindern des Scrollens im Hintergrund, wenn das Modal geöffnet ist
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    // ESC-Taste zum Schließen des Modals
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Schließen des Modals beim Klick auf den Hintergrund
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalClasses = [
    'modal',
    `modal--${size}`
  ].filter(Boolean).join(' ');

  // Verwende ReactDOM.createPortal, um das Modal außerhalb der normalen DOM-Hierarchie zu rendern
  const modalContent = (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={modalClasses} role="dialog" aria-modal="true">
        {title && (
          <div className="modal__header">
            <h2 className="modal__title">{title}</h2>
            <button 
              type="button" 
              className="modal__close" 
              onClick={onClose}
              aria-label="Schließen"
            >
              ×
            </button>
          </div>
        )}
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default Modal;
