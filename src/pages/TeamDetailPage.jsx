import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { useTeam, useUpdateTeam, useAddTrainerToTeam, useAddPlayerToTeam } from '../hooks/useTeams';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import './TeamDetailPage.css';

/**
 * Detailseite für ein Team mit Verwaltungsfunktionen
 * 
 * @returns {JSX.Element} TeamDetailPage-Komponente
 */
const TeamDetailPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: team, isLoading, error, isError } = useTeam(teamId);
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const updateTeamMutation = useUpdateTeam();
  const addTrainerMutation = useAddTrainerToTeam();
  const addPlayerMutation = useAddPlayerToTeam();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState(null);
  const [notification, setNotification] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [useFallbackData, setUseFallbackData] = useState(false);
  
  // Neue States für Inline-Formulare
  const [showAddTrainerForm, setShowAddTrainerForm] = useState(false);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [trainerSearchTerm, setTrainerSearchTerm] = useState('');
  const [playerSearchTerm, setPlayerSearchTerm] = useState('');
  
  // Fallback-Daten für den Fall, dass die API nicht verfügbar ist
  const fallbackTeam = {
    _id: teamId,
    name: "Team (Offline-Modus)",
    ageGroup: "Nicht verfügbar",
    tags: ["offline"],
    trainers: [],
    players: []
  };

  // Initialisiere editedTeam, wenn Team-Daten geladen sind
  useEffect(() => {
    if (team) {
      setEditedTeam({
        name: team.name,
        ageGroup: team.ageGroup,
        tags: team.tags || []
      });
    } else if (useFallbackData) {
      setEditedTeam({
        name: fallbackTeam.name,
        ageGroup: fallbackTeam.ageGroup,
        tags: fallbackTeam.tags || []
      });
    }
  }, [team, useFallbackData]);

  const isAdmin = user && user.role === 'admin';
  const isTrainer = user && (user.role === 'trainer' || user.role === 'admin');

  // Filtere verfügbare Trainer und Spieler
  const availableTrainers = users.filter(u => 
    (u.role === 'trainer' || u.role === 'admin') && 
    !team?.trainers?.some(t => (t._id || t) === (u._id || u.id))
  );

  const availablePlayers = users.filter(u => 
    u.role === 'player' && 
    !team?.players?.some(p => (p._id || p) === (u._id || u.id))
  );

  // Filtere basierend auf Suchbegriff
  const filteredTrainers = trainerSearchTerm 
    ? availableTrainers.filter(t => 
        t.firstName?.toLowerCase().includes(trainerSearchTerm.toLowerCase()) || 
        t.lastName?.toLowerCase().includes(trainerSearchTerm.toLowerCase()) ||
        t.email?.toLowerCase().includes(trainerSearchTerm.toLowerCase())
      )
    : availableTrainers;

  const filteredPlayers = playerSearchTerm 
    ? availablePlayers.filter(p => 
        p.firstName?.toLowerCase().includes(playerSearchTerm.toLowerCase()) || 
        p.lastName?.toLowerCase().includes(playerSearchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(playerSearchTerm.toLowerCase())
      )
    : availablePlayers;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTeam(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveTeam = async () => {
    try {
      
      await updateTeamMutation.mutateAsync({ teamId, teamData: editedTeam });
      console.log('Übergebene Team-Daten:', editedTeam);
      setIsEditing(false);
      setNotification({
        type: 'success',
        message: 'Team wurde erfolgreich aktualisiert.'
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setNotification({
        type: 'error',
        message: `Fehler beim Aktualisieren des Teams: ${errorMessage}`
      });
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    if (editedTeam.tags.includes(newTag.trim())) {
      setNotification({
        type: 'error',
        message: 'Dieser Tag existiert bereits.'
      });
      return;
    }
    
    setEditedTeam(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditedTeam(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const handleAddTrainer = async () => {
    if (!selectedTrainerId) {
      setNotification({
        type: 'error',
        message: 'Bitte wählen Sie einen Trainer aus.'
      });
      return;
    }

    try {
      // Verwende die ursprüngliche addTrainerToTeam-Funktion
      await addTrainerMutation.mutateAsync({ 
        teamId, 
        trainerId: selectedTrainerId 
      });
      
      setShowAddTrainerForm(false);
      setSelectedTrainerId('');
      setTrainerSearchTerm('');
      
      setNotification({
        type: 'success',
        message: 'Trainer wurde erfolgreich hinzugefügt.'
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setNotification({
        type: 'error',
        message: `Fehler beim Hinzufügen des Trainers: ${errorMessage}`
      });
    }
  };

  const handleAddPlayer = async () => {
    if (!selectedPlayerId) {
      setNotification({
        type: 'error',
        message: 'Bitte wählen Sie einen Spieler aus.'
      });
      return;
    }

    try {
      // Verwende die ursprüngliche addPlayerToTeam-Funktion
      await addPlayerMutation.mutateAsync({ 
        teamId, 
        playerId: selectedPlayerId 
      });
      
      setShowAddPlayerForm(false);
      setSelectedPlayerId('');
      setPlayerSearchTerm('');
      
      setNotification({
        type: 'success',
        message: 'Spieler wurde erfolgreich hinzugefügt.'
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setNotification({
        type: 'error',
        message: `Fehler beim Hinzufügen des Spielers: ${errorMessage}`
      });
    }
  };

  // Hilfsfunktion zur Extraktion spezifischer Fehlermeldungen
  const getErrorMessage = (error) => {
    if (!error) return 'Unbekannter Fehler';
    
    // Netzwerkfehler
    if (!navigator.onLine) {
      return 'Keine Internetverbindung. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.';
    }
    
    // API-Fehler mit Statuscode
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 400:
          return 'Ungültige Anfrage. Bitte überprüfen Sie die eingegebenen Daten.';
        case 401:
          return 'Nicht autorisiert. Bitte melden Sie sich erneut an.';
        case 403:
          return 'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.';
        case 404:
          return 'Team nicht gefunden. Möglicherweise wurde es gelöscht.';
        case 500:
          return 'Serverfehler. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Administrator.';
        default:
          return `Fehler ${status}: ${error.message || 'Unbekannter Fehler'}`;
      }
    }
    
    // Allgemeiner Fehler
    return error.message || 'Unbekannter Fehler';
  };

  // Funktion zum Aktivieren des Offline-Modus
  const enableFallbackMode = () => {
    setUseFallbackData(true);
  };

  // Zeige Ladeanzeige während Daten geladen werden
  if (isLoading && !useFallbackData) {
    return (
      <div className="team-detail-page loading-state">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Team-Daten werden geladen...</p>
        </div>
      </div>
    );
  }

  // Zeige Fehlerseite bei API-Fehlern
  if (isError && !useFallbackData) {
    const isServerError = error?.response?.status === 500;
    const isNotFoundError = error?.response?.status === 404;
    
    return (
      <div className="team-detail-page error-state">
        <div className="error-container">
          <div className="error-header">
            <h2>Fehler beim Laden des Teams</h2>
            <p className="error-message">{getErrorMessage(error)}</p>
          </div>
          
          <div className="error-details">
            {isServerError && (
              <div className="error-help">
                <h3>Mögliche Ursachen:</h3>
                <ul>
                  <li>Der Server ist momentan nicht erreichbar</li>
                  <li>Es gibt ein Problem mit der Datenbankverbindung</li>
                  <li>Die API-Route für Teams hat einen internen Fehler</li>
                </ul>
                
                <h3>Lösungsvorschläge:</h3>
                <ul>
                  <li>Überprüfen Sie, ob der Backend-Server läuft</li>
                  <li>Stellen Sie sicher, dass die Datenbank erreichbar ist</li>
                  <li>Überprüfen Sie die Server-Logs auf spezifische Fehlermeldungen</li>
                </ul>
              </div>
            )}
            
            {isNotFoundError && (
              <div className="error-help">
                <h3>Mögliche Ursachen:</h3>
                <ul>
                  <li>Das Team mit der ID {teamId} existiert nicht</li>
                  <li>Das Team wurde möglicherweise gelöscht</li>
                  <li>Die Team-ID ist ungültig</li>
                </ul>
                
                <h3>Lösungsvorschläge:</h3>
                <ul>
                  <li>Überprüfen Sie, ob die Team-ID korrekt ist</li>
                  <li>Kehren Sie zur Team-Übersicht zurück und wählen Sie ein existierendes Team</li>
                </ul>
              </div>
            )}
            
            <div className="error-actions">
              <Button onClick={() => window.location.reload()}>
                Seite neu laden
              </Button>
              <Button onClick={() => navigate('/teams')}>
                Zurück zur Team-Übersicht
              </Button>
              <Button onClick={enableFallbackMode}>
                Offline-Modus aktivieren
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verwende entweder die geladenen Team-Daten oder die Fallback-Daten
  const displayTeam = useFallbackData ? fallbackTeam : team || fallbackTeam;

  return (
    <div className="team-detail-page">
      {notification && (
        <Alert 
          type={notification.type} 
          message={notification.message} 
          onDismiss={dismissNotification} 
        />
      )}
      
      <div className="page-header">
        <h1>Team-Details</h1>
        <div className="header-actions">
          <Button onClick={() => navigate('/teams')}>
            Zurück zur Übersicht
          </Button>
        </div>
      </div>
      
      <div className="team-details-container">
        <Card title="Allgemeine Informationen">
          <div className="team-info">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-row">
                  <label htmlFor="name">Team-Name:</label>
                  <Input
                    id="name"
                    name="name"
                    value={editedTeam.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-row">
                  <label htmlFor="ageGroup">Altersgruppe:</label>
                  <Input
                    id="ageGroup"
                    name="ageGroup"
                    value={editedTeam.ageGroup || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-actions">
                  <Button onClick={handleSaveTeam} disabled={updateTeamMutation.isPending}>
                    {updateTeamMutation.isPending ? 'Wird gespeichert...' : 'Speichern'}
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="info-display">
                <div className="info-row">
                  <span className="info-label">Team-Name:</span>
                  <span className="info-value">{displayTeam.name}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Altersgruppe:</span>
                  <span className="info-value">{displayTeam.ageGroup || 'Nicht angegeben'}</span>
                </div>
                
                {isAdmin && !useFallbackData && (
                  <div className="info-actions">
                    <Button onClick={() => setIsEditing(true)}>
                      Bearbeiten
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
        
        <Card title="Tags">
          <div className="tags-section">
            <div className="tags-container">
              {displayTeam.tags && displayTeam.tags.length > 0 ? (
                <div className="tags-list">
                  {displayTeam.tags.map((tag, index) => (
                    <div key={index} className="tag-item">
                      <span className="tag-text">{tag}</span>
                      {isEditing && (
                        <button 
                          className="tag-remove" 
                          onClick={() => handleRemoveTag(tag)}
                          aria-label={`Tag ${tag} entfernen`}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-tags">Keine Tags vorhanden</p>
              )}
            </div>
            
            {isEditing && (
              <div className="add-tag-form">
                <div className="form-row">
                  <Input
                    id="newTag"
                    name="newTag"
                    placeholder="Neuen Tag hinzufügen..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button 
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    size="small"
                  >
                    Hinzufügen
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <Card title="Trainer">
          <div className="members-section">
            <div className="members-header">
              <h3>Trainer des Teams</h3>
              {isAdmin && !useFallbackData && (
                <Button 
                  onClick={() => {
                    setShowAddTrainerForm(!showAddTrainerForm);
                    setSelectedTrainerId('');
                    setTrainerSearchTerm('');
                  }}
                  size="small"
                >
                  {showAddTrainerForm ? 'Abbrechen' : 'Trainer hinzufügen'}
                </Button>
              )}
            </div>
            
            {showAddTrainerForm && !useFallbackData && (
              <div className="add-member-form">
                <h4>Trainer zum Team hinzufügen</h4>
                <div className="form-row">
                  <Input
                    id="trainerSearch"
                    name="trainerSearch"
                    placeholder="Trainer suchen..."
                    value={trainerSearchTerm}
                    onChange={(e) => setTrainerSearchTerm(e.target.value)}
                  />
                </div>
                {trainerSearchTerm && filteredTrainers.length > 0 ? (
                  <div className="form-row">
                    <label htmlFor="trainerSelect">Trainer auswählen:</label>
                    <select
                      id="trainerSelect"
                      value={selectedTrainerId}
                      onChange={(e) => setSelectedTrainerId(e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Bitte wählen --</option>
                      {filteredTrainers.map(trainer => (
                        <option key={trainer._id || trainer.id} value={trainer._id || trainer.id}>
                          {trainer.firstName || (trainer.user && trainer.user.firstName)} {trainer.lastName || (trainer.user && trainer.user.lastName)} ({trainer.email || (trainer.user && trainer.user.email)})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-row">
                    <label htmlFor="trainerSelect">Trainer auswählen:</label>
                    <select
                      id="trainerSelect"
                      value={selectedTrainerId}
                      onChange={(e) => setSelectedTrainerId(e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Bitte wählen --</option>
                      {filteredTrainers.length === 0 ? (
                        <option disabled>Keine verfügbaren Trainer gefunden</option>
                      ) : (
                        filteredTrainers.map(trainer => (
                          <option key={trainer._id || trainer.id} value={trainer._id || trainer.id}>
                            {trainer.firstName || (trainer.user && trainer.user.firstName)} {trainer.lastName || (trainer.user && trainer.user.lastName)} ({trainer.email || (trainer.user && trainer.user.email)})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}
                <div className="form-actions">
                  <Button 
                    onClick={handleAddTrainer}
                    disabled={!selectedTrainerId || addTrainerMutation.isPending}
                  >
                    {addTrainerMutation.isPending ? 'Wird hinzugefügt...' : 'Hinzufügen'}
                  </Button>
                </div>
              </div>
            )}
            
            {displayTeam.trainers && displayTeam.trainers.length > 0 ? (
              <ul className="members-list">
                {displayTeam.trainers.map((trainer) => (
                  <li key={trainer._id || trainer.id} className="member-item">
                    <div className="member-info">
                      <span className="member-name">{trainer.user ? (trainer.user.name || trainer.user.firstName + ' ' + trainer.user.lastName) : 'Unbekannter Trainer'}</span>
                      <span className="member-email">{trainer.user ? trainer.user.email : ''}</span>
                    </div>
                    {isAdmin && !useFallbackData && (
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => {
                          // Hier würde die Funktion zum Entfernen des Trainers aufgerufen werden
                          alert('Funktion zum Entfernen des Trainers noch nicht implementiert');
                        }}
                      >
                        Entfernen
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-members">Keine Trainer zugewiesen</p>
            )}
          </div>
        </Card>
        
        <Card title="Spieler">
          <div className="members-section">
            <div className="members-header">
              <h3>Spieler des Teams</h3>
              {isTrainer && !useFallbackData && (
                <Button 
                  onClick={() => {
                    setShowAddPlayerForm(!showAddPlayerForm);
                    setSelectedPlayerId('');
                    setPlayerSearchTerm('');
                  }}
                  size="small"
                >
                  {showAddPlayerForm ? 'Abbrechen' : 'Spieler hinzufügen'}
                </Button>
              )}
            </div>
            
            {showAddPlayerForm && !useFallbackData && (
              <div className="add-member-form">
                <h4>Spieler zum Team hinzufügen</h4>
                <div className="form-row">
                  <Input
                    id="playerSearch"
                    name="playerSearch"
                    placeholder="Spieler suchen..."
                    value={playerSearchTerm}
                    onChange={(e) => setPlayerSearchTerm(e.target.value)}
                  />
                </div>
                {playerSearchTerm && filteredPlayers.length > 0 ? (
                  <div className="form-row">
                    <label htmlFor="playerSelect">Spieler auswählen:</label>
                    <select
                      id="playerSelect"
                      value={selectedPlayerId}
                      onChange={(e) => setSelectedPlayerId(e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Bitte wählen --</option>
                      {filteredPlayers.map(player => (
                        <option key={player._id || player.id} value={player._id || player.id}>
                          {player.firstName || (player.user && player.user.firstName)} {player.lastName || (player.user && player.user.lastName)} ({player.email || (player.user && player.user.email)})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-row">
                    <label htmlFor="playerSelect">Spieler auswählen:</label>
                    <select
                      id="playerSelect"
                      value={selectedPlayerId}
                      onChange={(e) => setSelectedPlayerId(e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Bitte wählen --</option>
                      {filteredPlayers.length === 0 ? (
                        <option disabled>Keine verfügbaren Spieler gefunden</option>
                      ) : (
                        filteredPlayers.map(player => (
                          <option key={player._id || player.id} value={player._id || player.id}>
                            {player.firstName || (player.user && player.user.firstName)} {player.lastName || (player.user && player.user.lastName)} ({player.email || (player.user && player.user.email)})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}
                <div className="form-actions">
                  <Button 
                    onClick={handleAddPlayer}
                    disabled={!selectedPlayerId || addPlayerMutation.isPending}
                  >
                    {addPlayerMutation.isPending ? 'Wird hinzugefügt...' : 'Hinzufügen'}
                  </Button>
                </div>
              </div>
            )}
            
            {displayTeam.players && displayTeam.players.length > 0 ? (
              <ul className="members-list">
                {displayTeam.players.map((player) => (
                  <li key={player._id || player.id} className="member-item">
                    <div className="member-info">
                      <span className="member-name">{player.user ? (player.user.name || player.user.firstName + ' ' + player.user.lastName) : 'Unbekannter Spieler'}</span>
                      {player.user && player.user.email && <span className="member-email">{player.user.email}</span>}
                    </div>
                    {isTrainer && !useFallbackData && (
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => {
                          // Hier würde die Funktion zum Entfernen des Spielers aufgerufen werden
                          alert('Funktion zum Entfernen des Spielers noch nicht implementiert');
                        }}
                      >
                        Entfernen
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-members">Keine Spieler zugewiesen</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeamDetailPage;
