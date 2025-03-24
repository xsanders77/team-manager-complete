import React, { useEffect, useRef } from 'react';
import './Modal.css';

/**
 * Modal-Komponente für Dialoge und Formulare
 * 
 * @param {Object} props - Komponenten-Props
 * @param {boolean} props.isOpen - Steuert, ob der Modal angezeigt wird
 * @param {function} props.onClose - Callback-Funktion, die beim Schließen aufgerufen wird
 * @param {string} props.title - Titel des Modals
 * @param {React.ReactNode} props.children - Inhalt des Modals
 * @param {string} props.size - Größe des Modals ('small', 'medium', 'large')
 * @param {boolean} props.closeOnOutsideClick - Ob der Modal beim Klick außerhalb geschlossen werden soll
 * @returns {React.ReactElement|null}
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  closeOnOutsideClick = true 
}) => {
  const modalRef = useRef(null);

  // Schließen des Modals mit der Escape-Taste
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    // Verhindern des Scrollens im Hintergrund, wenn der Modal geöffnet ist
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Behandlung von Klicks außerhalb des Modals
  const handleOutsideClick = (event) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div 
        className={`modal-container modal-${size}`} 
        ref={modalRef}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button 
            className="modal-close-button" 
            onClick={onClose}
            aria-label="Schließen"
          >
            &times;
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
