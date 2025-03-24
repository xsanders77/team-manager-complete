import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Alert from './ui/Alert';
import { useUsers } from '../hooks/useUsers';
import './AddMemberModal.css';

/**
 * Modal-Komponente zum Hinzufügen von Trainern zu einem Team
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {boolean} props.isOpen - Ob das Modal geöffnet ist
 * @param {Function} props.onClose - Callback beim Schließen des Modals
 * @param {Function} props.onAddTrainer - Callback beim Hinzufügen eines Trainers
 * @param {Array} props.currentTrainers - Liste der aktuellen Trainer-IDs im Team
 * @param {boolean} props.isLoading - Ob gerade ein Hinzufügen-Vorgang läuft
 * @returns {JSX.Element} AddTrainerModal-Komponente
 */
const AddTrainerModal = ({ 
  isOpen, 
  onClose, 
  onAddTrainer, 
  currentTrainers = [], 
  isLoading = false 
}) => {
  const { data: users = [], isLoading: isLoadingUsers, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filtere Benutzer mit Trainer-Rolle
  const availableTrainers = users.filter(user => 
    (user.role === 'trainer' || user.role === 'admin') && 
    !currentTrainers.includes(user._id || user.id)
  );

  // Filtere Trainer basierend auf Suchbegriff
  const filteredTrainers = searchTerm 
    ? availableTrainers.filter(trainer => 
        trainer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        trainer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableTrainers;

  // Zurücksetzen des ausgewählten Trainers beim Öffnen des Modals
  useEffect(() => {
    if (isOpen) {
      setSelectedTrainer(null);
      setSearchTerm('');
      setNotification(null);
    }
  }, [isOpen]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectTrainer = (trainer) => {
    setSelectedTrainer(trainer);
  };

  const handleAddTrainer = () => {
    if (!selectedTrainer) {
      setNotification({
        type: 'error',
        message: 'Bitte wählen Sie einen Trainer aus.'
      });
      return;
    }

    onAddTrainer(selectedTrainer._id || selectedTrainer.id);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Trainer hinzufügen"
      size="medium"
    >
      <div className="add-member-modal">
        {notification && (
          <Alert 
            type={notification.type} 
            message={notification.message} 
            dismissible={true}
            onDismiss={dismissNotification}
          />
        )}

        {error && (
          <Alert 
            type="error" 
            message={`Fehler beim Laden der Benutzer: ${error.message}`} 
          />
        )}

        <div className="search-section">
          <Input
            id="trainerSearch"
            name="trainerSearch"
            label="Trainer suchen"
            placeholder="Name oder E-Mail eingeben"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="members-list-container">
          {isLoadingUsers ? (
            <div className="loading-message">Lade Trainer...</div>
          ) : filteredTrainers.length === 0 ? (
            <div className="no-results">
              {searchTerm 
                ? 'Keine Trainer gefunden, die Ihren Suchkriterien entsprechen.' 
                : 'Keine verfügbaren Trainer gefunden.'}
            </div>
          ) : (
            <ul className="members-list">
              {filteredTrainers.map(trainer => (
                <li 
                  key={trainer._id || trainer.id} 
                  className={`member-item ${selectedTrainer && (selectedTrainer._id || selectedTrainer.id) === (trainer._id || trainer.id) ? 'selected' : ''}`}
                  onClick={() => handleSelectTrainer(trainer)}
                >
                  <div className="member-info">
                    <span className="member-name">
                      {trainer.firstName} {trainer.lastName}
                    </span>
                    <span className="member-email">{trainer.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal__actions">
          <Button 
            onClick={handleAddTrainer}
            disabled={!selectedTrainer || isLoading}
          >
            {isLoading ? 'Wird hinzugefügt...' : 'Trainer hinzufügen'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={isLoading}
          >
            Abbrechen
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTrainerModal;
