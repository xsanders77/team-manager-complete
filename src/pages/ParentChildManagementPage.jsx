import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import { useParentChildren } from '../hooks/usePlayers';
import { useCreatePlayer, useDeletePlayer } from '../hooks/usePlayers';
import { useTeams } from '../hooks/useTeams';
import { useAuth } from '../hooks/useAuth';
import './ParentChildManagementPage.css';

/**
 * Seite zur Verwaltung von Kindern durch Eltern
 * 
 * @returns {JSX.Element} ParentChildManagementPage-Komponente
 */
const ParentChildManagementPage = () => {
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
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    childId: null,
    childName: ''
  });

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
    if (!newChild.name || !newChild.birthdate || !newChild.teamId) {
      setNotification({
        type: 'error',
        message: 'Bitte füllen Sie alle Pflichtfelder aus.'
      });
      return;
    }
    
    try {
      // Finde das ausgewählte Team
      const selectedTeam = teams.find(team => team._id === newChild.teamId || team.id === newChild.teamId);
      
      const childData = {
        name: newChild.name,
        birthdate: newChild.birthdate,
        teamId: newChild.teamId,
        parentId: user?._id,
        // Weitere Daten, die vom Backend erwartet werden könnten
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

  const openDeleteConfirmation = (childId, childName) => {
    setDeleteConfirmation({
      isOpen: true,
      childId,
      childName
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      childId: null,
      childName: ''
    });
  };

  const handleDeleteChild = async (childId) => {
    try {
      await deletePlayerMutation.mutateAsync(childId);
      setNotification({
        type: 'success',
        message: 'Kind wurde erfolgreich entfernt.'
      });
      closeDeleteConfirmation();
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
    return <LoadingIndicator text="Lade Kinder..." fullScreen={true} />;
  }

  if (error) {
    return <Alert type="error" message={`Fehler beim Laden der Kinder: ${error.message}`} />;
  }

  return (
    <div className="parent-child-management-page">
      <div className="parent-child-management-header">
        <h1>Meine Kinder</h1>
        <Button 
          onClick={() => setShowNewChildForm(true)}
          disabled={showNewChildForm || createPlayerMutation.isPending}
        >
          Kind hinzufügen
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
        <Card title="Kind hinzufügen">
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
              <label htmlFor="teamId" className="input-label">Team</label>
              <select
                id="teamId"
                name="teamId"
                value={newChild.teamId}
                onChange={handleInputChange}
                className="input-select"
                required
              >
                <option value="">Bitte wählen</option>
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
          <div className="no-children">
            <p>Sie haben noch keine Kinder hinzugefügt.</p>
          </div>
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
                      <span className="value">
                        {child.team ? (typeof child.team === 'object' ? child.team.name : child.team) : 'Nicht zugewiesen'}
                      </span>
                    </div>
                    <div className="child-info__item">
                      <span className="label">Trainer:</span>
                      <span className="value">
                        {child.trainer ? (typeof child.trainer === 'object' ? child.trainer.name : child.trainer) : 'Nicht zugewiesen'}
                      </span>
                    </div>
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
                    onClick={() => openDeleteConfirmation(child._id || child.id, child.name)}
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

      {/* Bestätigungsdialog für das Löschen eines Kindes */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={() => handleDeleteChild(deleteConfirmation.childId)}
        title="Kind entfernen"
        message={`Sind Sie sicher, dass Sie das Kind ${deleteConfirmation.childName} entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`}
        confirmText="Ja, entfernen"
        cancelText="Abbrechen"
        confirmVariant="danger"
        isLoading={deletePlayerMutation.isPending}
      />
    </div>
  );
};

export default ParentChildManagementPage;
