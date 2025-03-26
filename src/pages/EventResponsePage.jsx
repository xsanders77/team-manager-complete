import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { useEvent, useUpdateParticipation } from '../hooks/useEvents';
import { useParams, useNavigate } from 'react-router-dom';
import './EventResponsePage.css';

/**
 * EventResponsePage - Seite zur Anzeige von Termindetails und Zu-/Absage (Spieler-Rolle)
 * 
 * @returns {JSX.Element} EventResponsePage-Komponente
 */
const EventResponsePage = () => {
  const { user } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading, error } = useEvent(eventId);
  const updateParticipationMutation = useUpdateParticipation();
  
  const [notification, setNotification] = useState(null);

  // Formatieren des Datums für die Anzeige
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Ermitteln des aktuellen Teilnahmestatus
  const getCurrentParticipationStatus = () => {
    if (!event || !event.participants) return 'pending';
    
    const participant = event.participants.find(p => p.playerId === user.id);
    return participant ? participant.status : 'pending';
  };

  // Aktualisieren des Teilnahmestatus
  const handleParticipationUpdate = async (status) => {
    try {
      await updateParticipationMutation.mutateAsync({
        eventId,
        playerId: user.id,
        status
      });
      
      setNotification({
        type: 'success',
        message: status === 'accepted' 
          ? 'Du hast dem Termin zugesagt.' 
          : 'Du hast dem Termin abgesagt.'
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

  if (isLoading) {
    return <div className="loading">Lade Termindaten...</div>;
  }

  if (error) {
    return <Alert type="error" message={`Fehler beim Laden des Termins: ${error.message}`} />;
  }

  if (!event) {
    return <Alert type="error" message="Termin nicht gefunden." />;
  }

  const currentStatus = getCurrentParticipationStatus();

  return (
    <div className="event-response-page">
      <div className="event-response-header">
        <h1>Termindetails</h1>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/player/events')}
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
            <h3>Dein Teilnahmestatus</h3>
            <div className="current-status">
              <span className="status-label">Aktueller Status:</span>
              <span className={`status-badge status-${currentStatus}`}>
                {currentStatus === 'accepted' ? 'Zugesagt' : 
                 currentStatus === 'declined' ? 'Abgesagt' : 'Ausstehend'}
              </span>
            </div>
            
            <div className="participation-actions">
              <Button 
                className={currentStatus === 'accepted' ? 'active' : ''}
                onClick={() => handleParticipationUpdate('accepted')}
                disabled={updateParticipationMutation.isPending}
              >
                Zusagen
              </Button>
              <Button 
                variant="danger"
                className={currentStatus === 'declined' ? 'active' : ''}
                onClick={() => handleParticipationUpdate('declined')}
                disabled={updateParticipationMutation.isPending}
              >
                Absagen
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

export default EventResponsePage;