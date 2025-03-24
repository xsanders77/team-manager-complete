import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { useTeams, useCreateTeam, useDeleteTeam } from '../hooks/useTeams';
import './TeamManagementPage.css';

/**
 * Seite zur Verwaltung von Teams (Admin-Rolle)
 * 
 * @returns {JSX.Element} TeamManagementPage-Komponente
 */
const TeamManagementPage = () => {
  const { data: teams = [], isLoading, error } = useTeams();
  const createTeamMutation = useCreateTeam();
  const deleteTeamMutation = useDeleteTeam();
  
  const [showNewTeamForm, setShowNewTeamForm] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', ageGroup: '' });
  const [notification, setNotification] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    
    // Einfache Validierung
    if (!newTeam.name || !newTeam.ageGroup) {
      setNotification({
        type: 'error',
        message: 'Bitte füllen Sie alle Felder aus.'
      });
      return;
    }
    
    try {
      await createTeamMutation.mutateAsync(newTeam);
      setNewTeam({ name: '', ageGroup: '' });
      setShowNewTeamForm(false);
      setNotification({
        type: 'success',
        message: `Team "${newTeam.name}" wurde erfolgreich erstellt.`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Erstellen des Teams: ${error.message}`
      });
    }
  };

  const handleDeleteTeam = async (teamId) => {
    // In der realen App würde hier eine Bestätigungsdialog angezeigt werden
    try {
      await deleteTeamMutation.mutateAsync(teamId);
      setNotification({
        type: 'success',
        message: 'Team wurde erfolgreich gelöscht.'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Löschen des Teams: ${error.message}`
      });
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  if (isLoading) {
    return <div className="loading">Lade Teams...</div>;
  }

  if (error) {
    return <Alert type="error" message={`Fehler beim Laden der Teams: ${error.message}`} />;
  }

  return (
    <div className="team-management-page">
      <div className="team-management-header">
        <h1>Team-Verwaltung</h1>
        <Button 
          onClick={() => setShowNewTeamForm(true)}
          disabled={showNewTeamForm || createTeamMutation.isPending}
        >
          Neues Team erstellen
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
      
      {showNewTeamForm && (
        <Card title="Neues Team erstellen">
          <form onSubmit={handleCreateTeam} className="new-team-form">
            <Input
              id="name"
              name="name"
              label="Teamname"
              value={newTeam.name}
              onChange={handleInputChange}
              placeholder="z.B. E-Jugend"
              required
            />
            <Input
              id="ageGroup"
              name="ageGroup"
              label="Altersgruppe"
              value={newTeam.ageGroup}
              onChange={handleInputChange}
              placeholder="z.B. E"
              required
            />
            <div className="form-actions">
              <Button 
                type="submit" 
                disabled={createTeamMutation.isPending}
              >
                {createTeamMutation.isPending ? 'Wird erstellt...' : 'Team erstellen'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowNewTeamForm(false)}
                disabled={createTeamMutation.isPending}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <div className="teams-grid">
        {teams.length === 0 ? (
          <div className="no-teams">
            <p>Keine Teams vorhanden. Erstellen Sie Ihr erstes Team.</p>
          </div>
        ) : (
          teams.map(team => (
            <Card key={team._id || team.id}>
              <div className="team-card">
                <div className="team-card__header">
                  <h2>{team.name}</h2>
                  <span className="team-age-group">{team.ageGroup}</span>
                </div>
                <div className="team-card__content">
                  <div className="team-info">
                    <div className="team-info__item">
                      <span className="label">Trainer:</span>
                      <span className="value">
                        {team.trainers && team.trainers.length > 0 
                          ? team.trainers.map(trainer => trainer.name || trainer).join(', ') 
                          : 'Keine Trainer zugewiesen'}
                      </span>
                    </div>
                    <div className="team-info__item">
                      <span className="label">Spieler:</span>
                      <span className="value">
                        {team.players ? team.players.length : 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="team-card__actions">
                  <Button 
                    variant="secondary" 
                    onClick={() => window.location.href = `/admin/teams/${team._id || team.id}`}
                  >
                    Details
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteTeam(team._id || team.id)}
                    disabled={deleteTeamMutation.isPending}
                  >
                    {deleteTeamMutation.isPending && deleteTeamMutation.variables === team._id ? 
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

export default TeamManagementPage;
