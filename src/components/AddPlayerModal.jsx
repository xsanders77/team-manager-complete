import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Alert from './ui/Alert';
import { useUsers } from '../hooks/useUsers';
import './AddMemberModal.css';

/**
 * Modal-Komponente zum Hinzufügen von Spielern zu einem Team
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {boolean} props.isOpen - Ob das Modal geöffnet ist
 * @param {Function} props.onClose - Callback beim Schließen des Modals
 * @param {Function} props.onAddPlayer - Callback beim Hinzufügen eines Spielers
 * @param {Array} props.currentPlayers - Liste der aktuellen Spieler-IDs im Team
 * @param {boolean} props.isLoading - Ob gerade ein Hinzufügen-Vorgang läuft
 * @returns {JSX.Element} AddPlayerModal-Komponente
 */
const AddPlayerModal = ({ 
  isOpen, 
  onClose, 
  onAddPlayer, 
  currentPlayers = [], 
  isLoading = false 
}) => {
  const { data: users = [], isLoading: isLoadingUsers, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filtere Benutzer mit Spieler-Rolle
  const availablePlayers = users.filter(user => 
    user.role === 'player' && 
    !currentPlayers.includes(user._id || user.id)
  );

  // Filtere Spieler basierend auf Suchbegriff
  const filteredPlayers = searchTerm 
    ? availablePlayers.filter(player => 
        player.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        player.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availablePlayers;

  // Zurücksetzen des ausgewählten Spielers beim Öffnen des Modals
  useEffect(() => {
    if (isOpen) {
      setSelectedPlayer(null);
      setSearchTerm('');
      setNotification(null);
    }
  }, [isOpen]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
  };

  const handleAddPlayer = () => {
    if (!selectedPlayer) {
      setNotification({
        type: 'error',
        message: 'Bitte wählen Sie einen Spieler aus.'
      });
      return;
    }

    onAddPlayer(selectedPlayer._id || selectedPlayer.id);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Spieler hinzufügen"
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
            id="playerSearch"
            name="playerSearch"
            label="Spieler suchen"
            placeholder="Name oder E-Mail eingeben"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="members-list-container">
          {isLoadingUsers ? (
            <div className="loading-message">Lade Spieler...</div>
          ) : filteredPlayers.length === 0 ? (
            <div className="no-results">
              {searchTerm 
                ? 'Keine Spieler gefunden, die Ihren Suchkriterien entsprechen.' 
                : 'Keine verfügbaren Spieler gefunden.'}
            </div>
          ) : (
            <ul className="members-list">
              {filteredPlayers.map(player => (
                <li 
                  key={player._id || player.id} 
                  className={`member-item ${selectedPlayer && (selectedPlayer._id || selectedPlayer.id) === (player._id || player.id) ? 'selected' : ''}`}
                  onClick={() => handleSelectPlayer(player)}
                >
                  <div className="member-info">
                    <span className="member-name">
                      {player.firstName} {player.lastName}
                    </span>
                    <span className="member-email">{player.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal__actions">
          <Button 
            onClick={handleAddPlayer}
            disabled={!selectedPlayer || isLoading}
          >
            {isLoading ? 'Wird hinzugefügt...' : 'Spieler hinzufügen'}
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

export default AddPlayerModal;
