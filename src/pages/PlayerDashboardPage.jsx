import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { usePlayerEvents } from '../hooks/usePlayerEvents';
import './PlayerDashboardPage.css';

/**
 * PlayerDashboardPage - Übersichtsseite für Spieler
 * Zeigt anstehende Termine und persönliche Statistiken
 * 
 * @returns {JSX.Element} PlayerDashboardPage-Komponente
 */
const PlayerDashboardPage = () => {
  const { user } = useAuth();
  const { data: events = [], isLoading, error } = usePlayerEvents(user?.id);

  // Berechne Statistiken
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(event => new Date(event.date) > new Date()).length,
    attendanceRate: events.length > 0 
      ? Math.round(events.filter(event => event.participation === 'accepted').length / events.length * 100) 
      : 0
  };

  // Formatieren des Datums für die Anzeige
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Formatieren der Uhrzeit für die Anzeige
  const formatTime = (timeString) => {
    return timeString;
  };

  // Ermitteln des Teilnahmestatus
  const getParticipationStatus = (event) => {
    if (!event.participation) return 'pending';
    return event.participation;
  };

  // Anzeige des Teilnahmestatus
  const renderParticipationStatus = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="participation-status accepted">Zugesagt</span>;
      case 'declined':
        return <span className="participation-status declined">Abgesagt</span>;
      default:
        return <span className="participation-status pending">Ausstehend</span>;
    }
  };

  if (isLoading) {
    return <div className="loading">Lade Dashboard-Daten...</div>;
  }

  if (error) {
    return <Alert type="error" message={`Fehler beim Laden der Dashboard-Daten: ${error.message}`} />;
  }

  // Sortiere anstehende Termine nach Datum (aufsteigend)
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="player-dashboard-page">
      <div className="player-dashboard-header">
        <h1>Spieler Dashboard</h1>
      </div>

      {/* Statistik-Karten */}
      <div className="stats-grid">
        <Card>
          <div className="stat-card">
            <h2>Anstehende Termine</h2>
            <div className="stat-value">{stats.upcomingEvents}</div>
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = '/player/events'}
            >
              Alle Termine anzeigen
            </Button>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <h2>Anwesenheitsrate</h2>
            <div className="stat-value">{stats.attendanceRate}%</div>
            <div className="attendance-bar-container">
              <div 
                className="attendance-bar-fill" 
                style={{ width: `${stats.attendanceRate}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Schnellzugriff */}
      <Card title="Schnellzugriff">
        <div className="quick-actions">
          <Button onClick={() => window.location.href = '/player/events'}>
            Termine anzeigen
          </Button>
          <Button onClick={() => window.location.href = '/calendar'}>
            Kalender anzeigen
          </Button>
          <Button onClick={() => window.location.href = '/profile'}>
            Profil bearbeiten
          </Button>
        </div>
      </Card>

      {/* Anstehende Termine */}
      <Card title="Anstehende Termine">
        <div className="upcoming-events">
          {upcomingEvents.length === 0 ? (
            <p className="no-data-message">Keine anstehenden Termine.</p>
          ) : (
            <div className="events-list">
              {upcomingEvents.map(event => (
                <div key={event._id || event.id} className="event-list-item">
                  <div className="event-date-time">
                    <div className="event-date">{formatDate(event.date)}</div>
                    <div className="event-time">{formatTime(event.startTime)} - {formatTime(event.endTime)}</div>
                  </div>
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-location">{event.location}</div>
                  </div>
                  <div className="event-participation">
                    {renderParticipationStatus(getParticipationStatus(event))}
                  </div>
                  <Button 
                    variant="text" 
                    size="small"
                    onClick={() => window.location.href = `/player/events/${event._id || event.id}`}
                  >
                    Details
                  </Button>
                </div>
              ))}
              {upcomingEvents.length > 5 && (
                <div className="view-all">
                  <Button 
                    variant="text" 
                    onClick={() => window.location.href = '/player/events'}
                  >
                    Alle Termine anzeigen
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Letzte Termine */}
      <Card title="Letzte Termine">
        <div className="past-events">
          {events.filter(event => new Date(event.date) <= new Date()).length === 0 ? (
            <p className="no-data-message">Keine vergangenen Termine.</p>
          ) : (
            <div className="events-list">
              {events
                .filter(event => new Date(event.date) <= new Date())
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Absteigend nach Datum
                .slice(0, 5)
                .map(event => (
                  <div key={event._id || event.id} className="event-list-item past">
                    <div className="event-date-time">
                      <div className="event-date">{formatDate(event.date)}</div>
                      <div className="event-time">{formatTime(event.startTime)} - {formatTime(event.endTime)}</div>
                    </div>
                    <div className="event-details">
                      <div className="event-title">{event.title}</div>
                      <div className="event-location">{event.location}</div>
                    </div>
                    <div className="event-participation">
                      {renderParticipationStatus(getParticipationStatus(event))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PlayerDashboardPage;
