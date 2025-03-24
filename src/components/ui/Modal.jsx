import React, { useEffect } from 'react';
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

  // Verhindern des Scrollens im Hintergrund, wenn das Modal geöffnet ist
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Schließen des Modals beim Klick auf den Hintergrund
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC-Taste zum Schließen des Modals
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const modalClasses = [
    'modal',
    `modal--${size}`
  ].filter(Boolean).join(' ');

  return (
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
};

export default Modal;
