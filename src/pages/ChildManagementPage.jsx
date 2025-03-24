import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { useParentChildren, useCreatePlayer, useDeletePlayer } from '../hooks/usePlayers';
import { useTeams } from '../hooks/useTeams';
import './ChildManagementPage.css';

/**
 * ChildManagementPage - Seite zur Verwaltung der eigenen Kinder (Eltern-Rolle)
 * 
 * @returns {JSX.Element} ChildManagementPage-Komponente
 */
const ChildManagementPage = () => {
  const { user } = useAuth();
  const { data: children = [], isLoading, error } = useParentChildren(user?._id);
  const { data: teams = [] } = useTeams();
  const createPlayerMutation = useCreatePlayer();
  const deletePlayerMutation = useDeletePlayer();
  
  const [showNewChildForm, setShowNewChildForm] = useState(false);
  const [newChild, setNewChild] = useState({
    name: '',
    birthdate: '',
    teamId: ''
  });
  
  const [notification, setNotification] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChild(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateChild = async (e) => {
    e.preventDefault();
    
    // Einfache Validierung
    if (!newChild.name || !newChild.birthdate) {
      setNotification({
        type: 'error',
        message: 'Bitte füllen Sie alle Pflichtfelder aus.'
      });
      return;
    }
    
    try {
      const childData = {
        ...newChild,
        parent: user._id,
        parentName: user.name
      };
      
      await createPlayerMutation.mutateAsync(childData);
      setNewChild({ name: '', birthdate: '', teamId: '' });
      setShowNewChildForm(false);
      setNotification({
        type: 'success',
        message: `Kind "${newChild.name}" wurde erfolgreich hinzugefügt.`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Hinzufügen des Kindes: ${error.message}`
      });
    }
  };

  const handleDeleteChild = async (childId) => {
    // In der realen App würde hier ein Bestätigungsdialog angezeigt werden
    try {
      await deletePlayerMutation.mutateAsync(childId);
      setNotification({
        type: 'success',
        message: 'Kind wurde erfolgreich entfernt.'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Entfernen des Kindes: ${error.message}`
      });
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

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
    return <div className="loading">Lade Kinder-Daten...</div>;
  }

  if (error) {
    return <Alert type="error" message={`Fehler beim Laden der Kinder-Daten: ${error.message}`} />;
  }

  return (
    <div className="child-management-page">
      <div className="child-management-header">
        <h1>Kinder-Verwaltung</h1>
        <Button 
          onClick={() => setShowNewChildForm(true)}
          disabled={showNewChildForm || createPlayerMutation.isPending}
        >
          Neues Kind hinzufügen
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
      
      {showNewChildForm && (
        <Card title="Neues Kind hinzufügen">
          <form onSubmit={handleCreateChild} className="new-child-form">
            <Input
              id="name"
              name="name"
              label="Name"
              value={newChild.name}
              onChange={handleInputChange}
              placeholder="Vollständiger Name"
              required
            />
            <Input
              id="birthdate"
              name="birthdate"
              type="date"
              label="Geburtsdatum"
              value={newChild.birthdate}
              onChange={handleInputChange}
              required
            />
            <div className="form-group">
              <label htmlFor="teamId">Team (optional)</label>
              <select
                id="teamId"
                name="teamId"
                value={newChild.teamId}
                onChange={handleInputChange}
                className="select-input"
              >
                <option value="">Kein Team</option>
                {teams.map(team => (
                  <option key={team._id || team.id} value={team._id || team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-actions">
              <Button 
                type="submit"
                disabled={createPlayerMutation.isPending}
              >
                {createPlayerMutation.isPending ? 'Wird hinzugefügt...' : 'Kind hinzufügen'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowNewChildForm(false)}
                disabled={createPlayerMutation.isPending}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <div className="children-list">
        {children.length === 0 ? (
          <Card>
            <div className="no-children">
              <p>Keine Kinder registriert. Bitte fügen Sie Ihre Kinder hinzu.</p>
            </div>
          </Card>
        ) : (
          children.map(child => (
            <Card key={child._id || child.id}>
              <div className="child-card">
                <div className="child-card__header">
                  <h2>{child.name}</h2>
                  <div className="child-age">
                    {calculateAge(child.birthdate)} Jahre
                  </div>
                </div>
                
                <div className="child-card__content">
                  <div className="child-info">
                    <div className="child-info__item">
                      <span className="label">Geburtsdatum:</span>
                      <span className="value">{formatDate(child.birthdate)}</span>
                    </div>
                    <div className="child-info__item">
                      <span className="label">Team:</span>
                      <span className="value">{child.team || 'Nicht zugewiesen'}</span>
                    </div>
                    {child.attendance !== undefined && (
                      <div className="child-info__item">
                        <span className="label">Anwesenheit:</span>
                        <div className="attendance-bar">
                          <div 
                            className="attendance-fill" 
                            style={{ width: `${child.attendance || 0}%` }}
                          >
                            {child.attendance || 0}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="child-card__actions">
                  <Button 
                    variant="secondary" 
                    onClick={() => window.location.href = `/parent/children/${child._id || child.id}/events`}
                  >
                    Termine verwalten
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteChild(child._id || child.id)}
                    disabled={deletePlayerMutation.isPending}
                  >
                    {deletePlayerMutation.isPending && deletePlayerMutation.variables === child._id ? 
                      'Wird entfernt...' : 'Entfernen'}
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

export default ChildManagementPage;
