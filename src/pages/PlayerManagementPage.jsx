import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { usePlayers, useCreatePlayer, useDeletePlayer } from '../hooks/usePlayers';
import { useTeamTags } from '../hooks/useTags';
import { useAuth } from '../hooks/useAuth';
import './PlayerManagementPage.css';

/**
 * Seite zur Verwaltung von Spielern (Trainer-Rolle)
 * 
 * @returns {JSX.Element} PlayerManagementPage-Komponente
 */
const PlayerManagementPage = () => {
  const { user } = useAuth();
  const { data: players = [], isLoading, error } = usePlayers();
  const { data: tags = [] } = useTeamTags(user?.teamId);
  const createPlayerMutation = useCreatePlayer();
  const deletePlayerMutation = useDeletePlayer();
  
  const [filter, setFilter] = useState({
    name: '',
    tag: ''
  });
  
  const [showNewPlayerForm, setShowNewPlayerForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    birthdate: '',
    tags: [],
    parent: ''
  });
  
  const [notification, setNotification] = useState(null);
  
  const [selectedTags, setSelectedTags] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilter = () => {
    setFilter({
      name: '',
      tag: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleCreatePlayer = async (e) => {
    e.preventDefault();
    
    // Einfache Validierung
    if (!newPlayer.name || !newPlayer.birthdate) {
      setNotification({
        type: 'error',
        message: 'Bitte füllen Sie alle Pflichtfelder aus.'
      });
      return;
    }
    
    try {
      const playerData = {
        ...newPlayer,
        tags: selectedTags,
        teamId: user?.teamId
      };
      
      await createPlayerMutation.mutateAsync(playerData);
      setNewPlayer({ name: '', birthdate: '', tags: [], parent: '' });
      setSelectedTags([]);
      setShowNewPlayerForm(false);
      setNotification({
        type: 'success',
        message: `Spieler "${newPlayer.name}" wurde erfolgreich hinzugefügt.`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Hinzufügen des Spielers: ${error.message}`
      });
    }
  };

  const handleDeletePlayer = async (playerId) => {
    // In der realen App würde hier ein Bestätigungsdialog angezeigt werden
    try {
      await deletePlayerMutation.mutateAsync(playerId);
      setNotification({
        type: 'success',
        message: 'Spieler wurde erfolgreich gelöscht.'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Löschen des Spielers: ${error.message}`
      });
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  // Filtern der Spieler basierend auf den Filter-Einstellungen
  const filteredPlayers = players.filter(player => {
    // Name-Filter
    if (filter.name && !player.name.toLowerCase().includes(filter.name.toLowerCase())) {
      return false;
    }
    
    // Tag-Filter
    if (filter.tag && !player.tags.includes(filter.tag)) {
      return false;
    }
    
    return true;
  });

  // Formatieren des Datums für die Anzeige
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Berechnen des Alters
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (isLoading) {
    return <div className="loading">Lade Spieler...</div>;
  }

  if (error) {
    return <Alert type="error" message={`Fehler beim Laden der Spieler: ${error.message}`} />;
  }

  return (
    <div className="player-management-page">
      <div className="player-management-header">
        <h1>Spieler-Verwaltung</h1>
        <Button 
          onClick={() => setShowNewPlayerForm(true)}
          disabled={showNewPlayerForm || createPlayerMutation.isPending}
        >
          Neuen Spieler hinzufügen
        </Button>
      </div>
      
      {notification && (
        <Alert 
          type={notification.type} 
          message={notification.message} 
          dismissible={true}
          onDismiss={dismissNotification}
        />
      )}
      
      {showNewPlayerForm && (
        <Card title="Neuen Spieler hinzufügen">
          <form onSubmit={handleCreatePlayer} className="new-player-form">
            <Input
              id="name"
              name="name"
              label="Name"
              value={newPlayer.name}
              onChange={handleInputChange}
              placeholder="Vollständiger Name"
              required
            />
            <Input
              id="birthdate"
              name="birthdate"
              type="date"
              label="Geburtsdatum"
              value={newPlayer.birthdate}
              onChange={handleInputChange}
              required
            />
            <Input
              id="parent"
              name="parent"
              label="Elternteil"
              value={newPlayer.parent}
              onChange={handleInputChange}
              placeholder="Name des Elternteils"
            />
            
            <div className="form-group">
              <label className="input-label">Tags</label>
              <div className="tag-selector">
                {tags.map(tag => (
                  <div 
                    key={tag.id || tag._id || tag}
                    className={`tag-option ${selectedTags.includes(tag.name || tag) ? 'selected' : ''}`}
                    onClick={() => handleTagSelection(tag.name || tag)}
                  >
                    {tag.name || tag}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-actions">
              <Button 
                type="submit"
                disabled={createPlayerMutation.isPending}
              >
                {createPlayerMutation.isPending ? 'Wird hinzugefügt...' : 'Spieler hinzufügen'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowNewPlayerForm(false)}
                disabled={createPlayerMutation.isPending}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <Card title="Filter">
        <div className="player-filter">
          <div className="filter-row">
            <div className="filter-item">
              <label htmlFor="name">Name</label>
              <Input 
                id="name" 
                name="name" 
                value={filter.name} 
                onChange={handleFilterChange}
                placeholder="Nach Namen suchen"
              />
            </div>
            
            <div className="filter-item">
              <label htmlFor="tag">Tag</label>
              <select 
                id="tag" 
                name="tag" 
                value={filter.tag} 
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">Alle Tags</option>
                {tags.map(tag => (
                  <option key={tag.id || tag._id || tag} value={tag.name || tag}>
                    {tag.name || tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="filter-actions">
            <Button variant="secondary" onClick={resetFilter}>
              Filter zurücksetzen
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="players-list">
        {filteredPlayers.length === 0 ? (
          <div className="no-players">
            <p>Keine Spieler gefunden, die den Filterkriterien entsprechen.</p>
          </div>
        ) : (
          filteredPlayers.map(player => (
            <Card key={player._id || player.id}>
              <div className="player-card">
                <div className="player-card__header">
                  <h2>{player.name}</h2>
                  <div className="player-age">
                    {calculateAge(player.birthdate)} Jahre
                  </div>
                </div>
                
                <div className="player-card__content">
                  <div className="player-info">
                    <div className="player-info__item">
                      <span className="label">Geburtsdatum:</span>
                      <span className="value">{formatDate(player.birthdate)}</span>
                    </div>
                    <div className="player-info__item">
                      <span className="label">Elternteil:</span>
                      <span className="value">{player.parent || 'Nicht angegeben'}</span>
                    </div>
                    <div className="player-info__item">
                      <span className="label">Anwesenheit:</span>
                      <div className="attendance-bar">
                        <div 
                          className="attendance-fill" 
                          style={{ width: `${player.attendance || 0}%` }}
                        >
                          {player.attendance || 0}%
                        </div>
                      </div>
                    </div>
                    <div className="player-info__item">
                      <span className="label">Tags:</span>
                      <div className="player-tags">
                        {player.tags && player.tags.map(tag => (
                          <span key={tag} className="player-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="player-card__actions">
                  <Button 
                    variant="secondary" 
                    onClick={() => window.location.href = `/trainer/players/${player._id || player.id}`}
                  >
                    Details
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeletePlayer(player._id || player.id)}
                    disabled={deletePlayerMutation.isPending}
                  >
                    {deletePlayerMutation.isPending && deletePlayerMutation.variables === player._id ? 
                      'Wird gelöscht...' : 'Löschen'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerManagementPage;
