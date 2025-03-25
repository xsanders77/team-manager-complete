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
  if (isLoading) {
    return (
      <div className="team-detail-page">
        <div className="team-detail-header">
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
          >
            Zurück
          </Button>
          <h1>Team-Details</h1>
        </div>
        <div className="loading">Lade Team-Details...</div>
      </div>
    );
  }

  // Fehlerbehandlung mit detaillierten Fehlermeldungen und Fallback-Option
  if (isError && !useFallbackData) {
    const errorMessage = getErrorMessage(error);
    const isServerError = error?.response?.status >= 500;
    const isNotFoundError = error?.response?.status === 404;
    
    return (
      <div className="team-detail-page">
        <div className="team-detail-header">
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
          >
            Zurück
          </Button>
          <h1>Team-Details</h1>
        </div>
        
        <Card title="Fehler beim Laden der Team-Details">
          <div className="error-container">
            <Alert type="error" message={errorMessage} />
            
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
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Zurück zur vorherigen Seite
                </Button>
                {isServerError && (
                  <Button variant="secondary" onClick={enableFallbackMode}>
                    Offline-Modus aktivieren
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  // Verwende Fallback-Daten, wenn API nicht verfügbar ist und Fallback aktiviert wurde
  const displayTeam = useFallbackData ? fallbackTeam : team;

  // Wenn keine Daten vorhanden sind (weder vom Server noch Fallback)
  if (!displayTeam) {
    return (
      <div className="team-detail-page">
        <div className="team-detail-header">
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
          >
            Zurück
          </Button>
          <h1>Team-Details</h1>
        </div>
        <Alert type="error" message="Team nicht gefunden." />
      </div>
    );
  }

  return (
    <div className="team-detail-page">
      <div className="team-detail-header">
        <Button 
          variant="secondary" 
          onClick={() => navigate(-1)}
        >
          Zurück
        </Button>
        <h1>Team-Details {useFallbackData && "(Offline-Modus)"}</h1>
        {isAdmin && !isEditing && !useFallbackData && (
          <Button 
            onClick={() => setIsEditing(true)}
          >
            Bearbeiten
          </Button>
        )}
      </div>
      
      {notification && (
        <Alert 
          type={notification.type} 
          message={notification.message} 
          dismissible={true}
          onDismiss={dismissNotification}
        />
      )}
      
      <div className="team-detail-content">
        <Card title="Team-Informationen">
          {isEditing && !useFallbackData ? (
            <div className="team-edit-form">
              <Input
                id="name"
                name="name"
                label="Teamname"
                value={editedTeam.name}
                onChange={handleInputChange}
                required
              />
              <Input
                id="ageGroup"
                name="ageGroup"
                label="Altersgruppe"
                value={editedTeam.ageGroup}
                onChange={handleInputChange}
                required
              />
              <div className="tag-management">
                <h3>Tags</h3>
                <div className="tag-input-container">
                  <Input
                    id="newTag"
                    name="newTag"
                    placeholder="Neuen Tag hinzufügen"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <Button 
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    size="small"
                  >
                    Hinzufügen
                  </Button>
                </div>
                <div className="tags-list">
                  {editedTeam.tags.map((tag, index) => (
                    <div key={index} className="tag-item">
                      <span>{tag}</span>
                      <button 
                        className="tag-remove-btn"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {editedTeam.tags.length === 0 && (
                    <p className="no-tags">Keine Tags vorhanden</p>
                  )}
                </div>
              </div>
              <div className="form-actions">
                <Button 
                  onClick={handleSaveTeam}
                  disabled={updateTeamMutation.isPending}
                >
                  {updateTeamMutation.isPending ? 'Wird gespeichert...' : 'Speichern'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTeam({
                      name: displayTeam.name,
                      ageGroup: displayTeam.ageGroup,
                      tags: displayTeam.tags || []
                    });
                  }}
                  disabled={updateTeamMutation.isPending}
                >
                  Abbrechen
                </Button>
              </div>
            </div>
          ) : (
            <div className="team-info">
              <div className="team-info__item">
                <span className="label">Name:</span>
                <span className="value">{displayTeam.name}</span>
              </div>
              <div className="team-info__item">
                <span className="label">Altersgruppe:</span>
                <span className="value">{displayTeam.ageGroup}</span>
              </div>
              <div className="team-info__item">
                <span className="label">Tags:</span>
                <div className="tags-display">
                  {displayTeam.tags && displayTeam.tags.length > 0 ? (
                    displayTeam.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))
                  ) : (
                    <span className="no-tags">Keine Tags vorhanden</span>
                  )}
                </div>
              </div>
            </div>
          )}
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
                <div className="form-row">
                  <label htmlFor="trainerSelect">Trainer auswählen:</label>
                  <select
                    id="trainerSelect"
                    value={selectedTrainerId}
                    onChange={(e) => setSelectedTrainerId(e.target.value)}
                    className="select-input"
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
                <div className="form-row">
                  <label htmlFor="playerSelect">Spieler auswählen:</label>
                  <select
                    id="playerSelect"
                    value={selectedPlayerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    className="select-input"
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
        
        <Card title="Termine">
          <div className="events-section">
            <div className="events-header">
              <h3>Termine des Teams</h3>
              {isTrainer && !useFallbackData && (
                <Button 
                  onClick={() => {
                    // Hier würde die Navigation zur Terminverwaltung erfolgen
                    alert('Funktion zur Terminverwaltung noch nicht implementiert');
                  }}
                  size="small"
                >
                  Termin erstellen
                </Button>
              )}
            </div>
            
            <p className="no-events">Keine Termine vorhanden</p>
            
            {/* Hier würde die Liste der Termine angezeigt werden */}
          </div>
        </Card>
        
        <Card title="Statistiken">
          <div className="statistics-section">
            <div className="statistics-header">
              <h3>Anwesenheitsstatistiken</h3>
            </div>
            
            <p className="no-statistics">Keine Statistiken verfügbar</p>
            
            {/* Hier würden die Statistiken angezeigt werden */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeamDetailPage;
