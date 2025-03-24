import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { useEvent, useUpdateChildParticipation } from '../hooks/useEvents';
import { usePlayer } from '../hooks/usePlayers';
import { useParams, useNavigate } from 'react-router-dom';
import './ChildEventResponsePage.css';

/**
 * ChildEventResponsePage - Seite zur Anzeige von Termindetails und Zu-/Absage für Kinder (Eltern-Rolle)
 * 
 * @returns {JSX.Element} ChildEventResponsePage-Komponente
 */
const ChildEventResponsePage = () => {
  const { user } = useAuth();
  const { childId, eventId } = useParams();
  const navigate = useNavigate();
  
  const { data: event, isLoading: eventLoading, error: eventError } = useEvent(eventId);
  const { data: child, isLoading: childLoading, error: childError } = usePlayer(childId);
  const updateChildParticipationMutation = useUpdateChildParticipation();
  
  const [notification, setNotification] = useState(null);

  // Formatieren des Datums für die Anzeige
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Ermitteln des aktuellen Teilnahmestatus
  const getCurrentParticipationStatus = () => {
    if (!event || !event.participants) return 'pending';
    
    const participant = event.participants.find(p => p.playerId === childId);
    return participant ? participant.status : 'pending';
  };

  // Aktualisieren des Teilnahmestatus
  const handleParticipationUpdate = async (status) => {
    try {
      await updateChildParticipationMutation.mutateAsync({
        eventId,
        childId,
        status
      });
      
      setNotification({
        type: 'success',
        message: status === 'accepted' 
          ? `Sie haben ${child?.name} für diesen Termin angemeldet.` 
          : `Sie haben ${child?.name} für diesen Termin abgemeldet.`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Aktualisieren des Teilnahmestatus: ${error.message}`
      });
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const isLoading = eventLoading || childLoading;
  const error = eventError || childError;

  if (isLoading) {
    return <div className="loading">Lade Termindaten...</div>;
  }

  if (error) {
    return <Alert type="error" message={`Fehler beim Laden der Daten: ${error.message}`} />;
  }

  if (!event) {
    return <Alert type="error" message="Termin nicht gefunden." />;
  }

  if (!child) {
    return <Alert type="error" message="Kind nicht gefunden." />;
  }

  // Überprüfen, ob der eingeloggte Elternteil der Elternteil des Kindes ist
  if (child.parent !== user.id) {
    return <Alert type="error" message="Sie haben keine Berechtigung, diesen Termin zu verwalten." />;
  }

  const currentStatus = getCurrentParticipationStatus();

  return (
    <div className="child-event-response-page">
      <div className="child-event-response-header">
        <h1>Termindetails für {child.name}</h1>
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/parent/children/${childId}/events`)}
        >
          Zurück zur Terminübersicht
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
      
      <Card>
        <div className="event-details-container">
          <div className="event-header">
            <div className="event-title-container">
              <h2>{event.title}</h2>
              <span className={`event-type event-type--${event.type}`}>
                {event.type === 'training' ? 'Training' : 'Spiel'}
              </span>
            </div>
            <div className="event-team">{event.team || 'Kein Team angegeben'}</div>
          </div>
          
          <div className="event-info-grid">
            <div className="event-info-item">
              <span className="info-label">Datum:</span>
              <span className="info-value">{formatDate(event.date)}</span>
            </div>
            <div className="event-info-item">
              <span className="info-label">Zeit:</span>
              <span className="info-value">{event.startTime} - {event.endTime} Uhr</span>
            </div>
            <div className="event-info-item">
              <span className="info-label">Ort:</span>
              <span className="info-value">{event.location}</span>
            </div>
            <div className="event-info-item">
              <span className="info-label">Teilnehmer:</span>
              <span className="info-value">
                {event.participants ? 
                  `${event.participants.filter(p => p.status === 'accepted').length}/${event.participants.length} Zusagen` : 
                  '0/0 Zusagen'}
              </span>
            </div>
          </div>
          
          {event.description && (
            <div className="event-description">
              <h3>Beschreibung</h3>
              <p>{event.description}</p>
            </div>
          )}
          
          <div className="participation-status-container">
            <h3>Teilnahmestatus von {child.name}</h3>
            <div className="current-status">
              <span className="status-label">Aktueller Status:</span>
              <span className={`status-badge status-${currentStatus}`}>
                {currentStatus === 'accepted' ? 'Angemeldet' : 
                 currentStatus === 'declined' ? 'Abgemeldet' : 'Ausstehend'}
              </span>
            </div>
            
            <div className="participation-actions">
              <Button 
                className={currentStatus === 'accepted' ? 'active' : ''}
                onClick={() => handleParticipationUpdate('accepted')}
                disabled={updateChildParticipationMutation.isPending}
              >
                Anmelden
              </Button>
              <Button 
                variant="danger"
                className={currentStatus === 'declined' ? 'active' : ''}
                onClick={() => handleParticipationUpdate('declined')}
                disabled={updateChildParticipationMutation.isPending}
              >
                Abmelden
              </Button>
            </div>
          </div>
          
          {event.participants && event.participants.length > 0 && (
            <div className="participants-list">
              <h3>Teilnehmer</h3>
              <div className="participants-grid">
                {event.participants
                  .filter(p => p.status === 'accepted')
                  .map(participant => (
                    <div key={participant.playerId} className="participant-item">
                      <span className="participant-name">{participant.playerName}</span>
                    </div>
                  ))}
                {event.participants.filter(p => p.status === 'accepted').length === 0 && (
                  <p className="no-participants">Noch keine Zusagen.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChildEventResponsePage;
