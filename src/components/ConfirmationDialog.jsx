import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

/**
 * Wiederverwendbare Komponente für Bestätigungsdialoge
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {boolean} props.isOpen - Ob der Dialog geöffnet ist
 * @param {Function} props.onClose - Callback beim Schließen des Dialogs
 * @param {Function} props.onConfirm - Callback bei Bestätigung
 * @param {string} props.title - Titel des Dialogs
 * @param {string} props.message - Nachricht des Dialogs
 * @param {string} [props.confirmText='Bestätigen'] - Text des Bestätigungsbuttons
 * @param {string} [props.cancelText='Abbrechen'] - Text des Abbruchbuttons
 * @param {string} [props.confirmVariant='danger'] - Variante des Bestätigungsbuttons
 * @param {boolean} [props.isLoading=false] - Ob der Dialog im Ladezustand ist
 * @returns {JSX.Element} ConfirmationDialog-Komponente
 */
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  confirmVariant = 'danger',
  isLoading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
    >
      <div className="confirmation-dialog">
        <p>{message}</p>
        
        <div className="modal__actions">
          <Button 
            variant={confirmVariant} 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Wird verarbeitet...' : confirmText}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
