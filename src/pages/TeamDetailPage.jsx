// TeamDetailPage.jsx - Vollständige Datei
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
    setNotification({
      type: 'warning',
      message: 'Offline-Modus aktiviert. Einige Funktionen sind möglicherweise eingeschränkt.'
    });
  };

  // Anzeige während des Ladens
  if (isLoading && !useFallbackData) {
    return (
      <div className="team-detail-page loading">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Team-Daten werden geladen...</p>
        </div>
      </div>
    );
  }

  // Anzeige bei Fehler
  if (isError && !useFallbackData) {
    return (
      <div className="team-detail-page error">
        <Card title="Fehler beim Laden der Team-Daten">
          <div className="error-message">
            <p>{getErrorMessage(error)}</p>
            <div className="error-actions">
              <Button onClick={() => window.location.reload()}>
                Erneut versuchen
              </Button>
              <Button variant="secondary" onClick={enableFallbackMode}>
                Offline-Modus aktivieren
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Verwende entweder die geladenen Team-Daten oder die Fallback-Daten
  const displayTeam = team || (useFallbackData ? fallbackTeam : null);
  
  if (!displayTeam) {
    return (
      <div className="team-detail-page error">
        <Card title="Team nicht gefunden">
          <div className="error-message">
            <p>Das angeforderte Team konnte nicht gefunden werden.</p>
            <div className="error-actions">
              <Button onClick={() => navigate('/teams')}>
                Zurück zur Team-Übersicht
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="team-detail-page">
      {notification && (
        <Alert 
          type={notification.type} 
          message={notification.message} 
          dismissible={true}
          onDismiss={dismissNotification}
        />
      )}
      
      <div className="team-detail-header">
        <h1>{displayTeam.name}</h1>
        <div className="team-detail-actions">
          {isAdmin && !useFallbackData && (
            <>
              {isEditing ? (
                <>
                  <Button onClick={handleSaveTeam} disabled={updateTeamMutation.isPending}>
                    {updateTeamMutation.isPending ? 'Wird gespeichert...' : 'Speichern'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsEditing(false)}
                    disabled={updateTeamMutation.isPending}
                  >
                    Abbrechen
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Team bearbeiten
                </Button>
              )}
            </>
          )}
          <Button 
            variant="secondary" 
            onClick={() => navigate('/teams')}
          >
            Zurück zur Team-Übersicht
          </Button>
        </div>
      </div>
      
      <div className="team-detail-content">
        <div className="team-detail-main">
          <Card title="Team-Informationen">
            {isEditing ? (
              <div className="team-edit-form">
                <div className="form-group">
                  <Input
                    id="name"
                    name="name"
                    label="Team-Name"
                    value={editedTeam.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <Input
                    id="ageGroup"
                    name="ageGroup"
                    label="Altersgruppe"
                    value={editedTeam.ageGroup}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Tags</label>
                  <div className="tags-input">
                    <div className="tags-list">
                      {editedTeam.tags.map((tag, index) => (
                        <div key={index} className="tag">
                          <span>{tag}</span>
                          <button 
                            type="button" 
                            className="tag-remove" 
                            onClick={() => handleRemoveTag(tag)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="tag-add">
                      <Input
                        id="newTag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Neuen Tag hinzufügen"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button 
                        type="button" 
                        size="small"
                        onClick={handleAddTag}
                      >
                        Hinzufügen
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="team-info">
                <div className="info-group">
                  <h4>Team-Name</h4>
                  <p>{displayTeam.name}</p>
                </div>
                
                <div className="info-group">
                  <h4>Altersgruppe</h4>
                  <p>{displayTeam.ageGroup || 'Keine Angabe'}</p>
                </div>
                
                <div className="info-group">
                  <h4>Tags</h4>
                  <div className="tags-display">
                    {displayTeam.tags && displayTeam.tags.length > 0 ? (
                      displayTeam.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))
                    ) : (
                      <p>Keine Tags vorhanden</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          <Card title="Trainer">
            <div className="team-members">
              {displayTeam.trainers && displayTeam.trainers.length > 0 ? (
                <ul className="members-list">
                  {displayTeam.trainers.map((trainer) => {
                    const trainerId = trainer._id || trainer;
                    const trainerData = typeof trainer === 'object' ? trainer : 
                      users.find(u => (u._id || u.id) === trainerId);
                    
                    return (
                      <li key={trainerId} className="member-item">
                        <div className="member-info">
                          <span className="member-name">
                            {trainerData ? 
                              `${trainerData.firstName || ''} ${trainerData.lastName || ''}`.trim() || trainerData.email : 
                              'Unbekannter Trainer'}
                          </span>
                          <span className="member-email">
                            {trainerData?.email || ''}
                          </span>
                        </div>
                        {isAdmin && !useFallbackData && (
                          <Button 
                            variant="danger" 
                            size="small"
                            onClick={() => {
                              // Hier würde die Entfernen-Funktion aufgerufen werden
                              alert('Funktion zum Entfernen von Trainern noch nicht implementiert');
                            }}
                          >
                            Entfernen
                          </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="no-members">Keine Trainer zugewiesen</p>
              )}
              
              {isAdmin && !useFallbackData && (
                <div className="add-member-section">
                  {showAddTrainerForm ? (
                    <div className="add-member-form">
                      <h4>Trainer hinzufügen</h4>
                      <Input
                        placeholder="Suche nach Trainern..."
                        value={trainerSearchTerm}
                        onChange={(e) => setTrainerSearchTerm(e.target.value)}
                      />
                      
                      <div className="member-select">
                        {filteredTrainers.length > 0 ? (
                          <ul className="member-options">
                            {filteredTrainers.map((trainer) => (
                              <li 
                                key={trainer._id || trainer.id} 
                                className={`member-option ${selectedTrainerId === (trainer._id || trainer.id) ? 'selected' : ''}`}
                                onClick={() => setSelectedTrainerId(trainer._id || trainer.id)}
                              >
                                <span className="member-name">
                                  {`${trainer.firstName || ''} ${trainer.lastName || ''}`.trim() || trainer.email}
                                </span>
                                <span className="member-email">{trainer.email}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-results">Keine passenden Trainer gefunden</p>
                        )}
                      </div>
                      
                      <div className="form-actions">
                        <Button 
                          onClick={handleAddTrainer}
                          disabled={!selectedTrainerId || addTrainerMutation.isPending}
                        >
                          {addTrainerMutation.isPending ? 'Wird hinzugefügt...' : 'Hinzufügen'}
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={() => {
                            setShowAddTrainerForm(false);
                            setSelectedTrainerId('');
                            setTrainerSearchTerm('');
                          }}
                          disabled={addTrainerMutation.isPending}
                        >
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setShowAddTrainerForm(true)}
                      size="small"
                    >
                      Trainer hinzufügen
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
          
          <Card title="Spieler">
            <div className="team-members">
              {displayTeam.players && displayTeam.players.length > 0 ? (
                <ul className="members-list">
                  {displayTeam.players.map((player) => {
                    const playerId = player._id || player;
                    const playerData = typeof player === 'object' ? player : 
                      users.find(u => (u._id || u.id) === playerId);
                    
                    return (
                      <li key={playerId} className="member-item">
                        <div className="member-info">
                          <span className="member-name">
                            {playerData ? 
                              `${playerData.firstName || ''} ${playerData.lastName || ''}`.trim() || playerData.email : 
                              'Unbekannter Spieler'}
                          </span>
                          <span className="member-email">
                            {playerData?.email || ''}
                          </span>
                        </div>
                        {isAdmin && !useFallbackData && (
                          <Button 
                            variant="danger" 
                            size="small"
                            onClick={() => {
                              // Hier würde die Entfernen-Funktion aufgerufen werden
                              alert('Funktion zum Entfernen von Spielern noch nicht implementiert');
                            }}
                          >
                            Entfernen
                          </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="no-members">Keine Spieler zugewiesen</p>
              )}
              
              {isAdmin && !useFallbackData && (
                <div className="add-member-section">
                  {showAddPlayerForm ? (
                    <div className="add-member-form">
                      <h4>Spieler hinzufügen</h4>
                      <Input
                        placeholder="Suche nach Spielern..."
                        value={playerSearchTerm}
                        onChange={(e) => setPlayerSearchTerm(e.target.value)}
                      />
                      
                      <div className="member-select">
                        {filteredPlayers.length > 0 ? (
                          <ul className="member-options">
                            {filteredPlayers.map((player) => (
                              <li 
                                key={player._id || player.id} 
                                className={`member-option ${selectedPlayerId === (player._id || player.id) ? 'selected' : ''}`}
                                onClick={() => setSelectedPlayerId(player._id || player.id)}
                              >
                                <span className="member-name">
                                  {`${player.firstName || ''} ${player.lastName || ''}`.trim() || player.email}
                                </span>
                                <span className="member-email">{player.email}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-results">Keine passenden Spieler gefunden</p>
                        )}
                      </div>
                      
                      <div className="form-actions">
                        <Button 
                          onClick={handleAddPlayer}
                          disabled={!selectedPlayerId || addPlayerMutation.isPending}
                        >
                          {addPlayerMutation.isPending ? 'Wird hinzugefügt...' : 'Hinzufügen'}
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={() => {
                            setShowAddPlayerForm(false);
                            setSelectedPlayerId('');
                            setPlayerSearchTerm('');
                          }}
                          disabled={addPlayerMutation.isPending}
                        >
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setShowAddPlayerForm(true)}
                      size="small"
                    >
                      Spieler hinzufügen
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
          
          <Card title="Termine">
            <div className="events-section">
              <div className="events-header">
                <h3>Termine des Teams</h3>
                {isTrainer && !useFallbackData && (
                  <Button 
                    onClick={() => {
                      // Navigation zur Terminverwaltung
                      navigate(`/trainer/events/create?teamId=${teamId}`);
                    }}
                    size="small"
                  >
                    Termin erstellen
                  </Button>
                )}
              </div>
              
              <p className="no-events">Keine Termine vorhanden</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailPage;
