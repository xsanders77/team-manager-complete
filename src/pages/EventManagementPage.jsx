import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { useFilteredEvents, useDeleteEvent } from '../hooks/useEvents';
import './EventManagementPage.css';

/**
 * Seite zur Verwaltung von Terminen (Trainer-Rolle)
 * 
 * @returns {JSX.Element} EventManagementPage-Komponente
 */
const EventManagementPage = () => {
  const { data: events = [], isLoading, error } = useFilteredEvents();
  const deleteEventMutation = useDeleteEvent();
  
  const [filter, setFilter] = useState({
    team: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  });
  
  const [notification, setNotification] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilter = () => {
    setFilter({
      team: '',
      type: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleDeleteEvent = async (eventId) => {
    // In der realen App würde hier eine Bestätigungsdialog angezeigt werden
    try {
      await deleteEventMutation.mutateAsync(eventId);
      setNotification({
        type: 'success',
        message: 'Termin wurde erfolgreich gelöscht.'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Löschen des Termins: ${error.message}`
      });
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  // Filtern der Events basierend auf den Filter-Einstellungen
  const filteredEvents = events.filter(event => {
    // Team-Filter
    if (filter.team && event.team !== filter.team) {
      return false;
    }
    
    // Typ-Filter
    if (filter.type && event.type !== filter.type) {
      return false;
    }
    
    // Datum von-Filter
    if (filter.dateFrom && event.date < filter.dateFrom) {
      return false;
    }
    
    // Datum bis-Filter
    if (filter.dateTo && event.date > filter.dateTo) {
      return false;
    }
    
    return true;
  });

  // Formatieren des Datums für die Anzeige
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  if (isLoading) {
    return <div className="loading">Lade Termine...</div>;
  }

  if (error) {
    return <Alert type="error" message={`Fehler beim Laden der Termine: ${error.message}`} />;
  }

  return (
    <div className="event-management-page">
      <div className="event-management-header">
        <h1>Termin-Verwaltung</h1>
        <Button onClick={() => window.location.href = '/trainer/events/create'}>
          Neuen Termin erstellen
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
      
      <Card title="Filter">
        <div className="event-filter">
          <div className="filter-row">
            <div className="filter-item">
              <label htmlFor="team">Team</label>
              <select 
                id="team" 
                name="team" 
                value={filter.team} 
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">Alle Teams</option>
                {/* Dynamisch aus den verfügbaren Teams in den Terminen generieren */}
                {[...new Set(events.map(event => event.team))].map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-item">
              <label htmlFor="type">Typ</label>
              <select 
                id="type" 
                name="type" 
                value={filter.type} 
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">Alle Typen</option>
                <option value="training">Training</option>
                <option value="match">Spiel</option>
              </select>
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-item">
              <label htmlFor="dateFrom">Datum von</label>
              <Input 
                id="dateFrom" 
                name="dateFrom" 
                type="date" 
                value={filter.dateFrom} 
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-item">
              <label htmlFor="dateTo">Datum bis</label>
              <Input 
                id="dateTo" 
                name="dateTo" 
                type="date" 
                value={filter.dateTo} 
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="filter-actions">
            <Button variant="secondary" onClick={resetFilter}>
              Filter zurücksetzen
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="events-list">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>Keine Termine gefunden, die den Filterkriterien entsprechen.</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <Card key={event._id || event.id}>
              <div className="event-card">
                <div className="event-card__header">
                  <div className="event-title-wrapper">
                    <h2>{event.title}</h2>
                    <span className={`event-type event-type--${event.type}`}>
                      {event.type === 'training' ? 'Training' : 'Spiel'}
                    </span>
                  </div>
                  <span className="event-team">{event.team}</span>
                </div>
                
                <div className="event-card__content">
                  <div className="event-info">
                    <div className="event-info__item">
                      <span className="label">Datum:</span>
                      <span className="value">{formatDate(event.date)}</span>
                    </div>
                    <div className="event-info__item">
                      <span className="label">Zeit:</span>
                      <span className="value">{event.startTime} - {event.endTime} Uhr</span>
                    </div>
                    <div className="event-info__item">
                      <span className="label">Ort:</span>
                      <span className="value">{event.location}</span>
                    </div>
                    <div className="event-info__item">
                      <span className="label">Teilnahme:</span>
                      <span className="value">
                        <span className="attendance-badge">
                          {event.participants ? 
                            `${event.participants.filter(p => p.status === 'accepted').length}/${event.participants.length} Zusagen` : 
                            '0/0 Zusagen'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="event-card__actions">
                  <Button 
                    variant="secondary" 
                    onClick={() => window.location.href = `/trainer/events/${event._id || event.id}`}
                  >
                    Details
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteEvent(event._id || event.id)}
                    disabled={deleteEventMutation.isPending}
                  >
                    {deleteEventMutation.isPending && deleteEventMutation.variables === event._id ? 
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

export default EventManagementPage;