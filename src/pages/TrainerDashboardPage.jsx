import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { useTeamEvents } from '../hooks/useEvents';
import { useTeamPlayers } from '../hooks/usePlayers';
import './TrainerDashboardPage.css';

/**
 * TrainerDashboardPage - Übersichtsseite für Trainer
 * Zeigt eine Zusammenfassung der eigenen Teams, anstehenden Termine und Spieler
 * 
 * @returns {JSX.Element} TrainerDashboardPage-Komponente
 */
const TrainerDashboardPage = () => {
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading, error: eventsError } = useTeamEvents(user?.teamId);
  const { data: players = [], isLoading: playersLoading, error: playersError } = useTeamPlayers(user?.teamId);

  // Berechne Statistiken
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(event => new Date(event.date) > new Date()).length,
    totalPlayers: players.length,
    attendanceRate: players.length > 0 
      ? Math.round(players.reduce((sum, player) => sum + (player.attendance || 0), 0) / players.length) 
      : 0
  };

  // Lade-Status
  const isLoading = eventsLoading || playersLoading;
  
  // Fehler-Status
  const hasError = eventsError || playersError;
  const errorMessage = eventsError?.message || playersError?.message;

  // Formatieren des Datums für die Anzeige
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Formatieren der Uhrzeit für die Anzeige
  const formatTime = (timeString) => {
    return timeString;
  };

  if (isLoading) {
    return <div className="loading">Lade Dashboard-Daten...</div>;
  }

  if (hasError) {
    return <Alert type="error" message={`Fehler beim Laden der Dashboard-Daten: ${errorMessage}`} />;
  }

  // Sortiere anstehende Termine nach Datum (aufsteigend)
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="trainer-dashboard-page">
      <div className="trainer-dashboard-header">
        <h1>Trainer Dashboard</h1>
      </div>

      {/* Statistik-Karten */}
      <div className="stats-grid">
        <Card>
          <div className="stat-card">
            <h2>Anstehende Termine</h2>
            <div className="stat-value">{stats.upcomingEvents}</div>
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = '/trainer/events'}
            >
              Termine verwalten
            </Button>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <h2>Spieler</h2>
            <div className="stat-value">{stats.totalPlayers}</div>
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = `/trainer/teams/${user?.teamId}/players`}
            >
              Spieler verwalten
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
          <Button onClick={() => window.location.href = '/trainer/events/create'}>
            Neuen Termin erstellen
          </Button>
          <Button onClick={() => window.location.href = `/trainer/teams/${user?.teamId}/tags`}>
            Tags verwalten
          </Button>
          <Button onClick={() => window.location.href = '/calendar'}>
            Kalender anzeigen
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
              {upcomingEvents.slice(0, 5).map(event => (
                <div key={event._id || event.id} className="event-list-item">
                  <div className="event-date-time">
                    <div className="event-date">{formatDate(event.date)}</div>
                    <div className="event-time">{formatTime(event.startTime)} - {formatTime(event.endTime)}</div>
                  </div>
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-location">{event.location}</div>
                  </div>
                  <div className="event-type-badge">
                    <span className={`event-type event-type--${event.type}`}>
                      {event.type === 'training' ? 'Training' : 'Spiel'}
                    </span>
                  </div>
                  <Button 
                    variant="text" 
                    size="small"
                    onClick={() => window.location.href = `/trainer/events/${event._id || event.id}`}
                  >
                    Details
                  </Button>
                </div>
              ))}
              {upcomingEvents.length > 5 && (
                <div className="view-all">
                  <Button 
                    variant="text" 
                    onClick={() => window.location.href = '/trainer/events'}
                  >
                    Alle Termine anzeigen
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Spieler mit niedriger Anwesenheit */}
      <Card title="Spieler mit niedriger Anwesenheit">
        <div className="low-attendance-players">
          {players.length === 0 ? (
            <p className="no-data-message">Keine Spieler vorhanden.</p>
          ) : (
            <>
              {players
                .filter(player => (player.attendance || 0) < 50)
                .sort((a, b) => (a.attendance || 0) - (b.attendance || 0))
                .slice(0, 5)
                .map(player => (
                  <div key={player._id || player.id} className="player-list-item">
                    <div className="player-name">{player.name}</div>
                    <div className="player-attendance">
                      <div className="attendance-label">{player.attendance || 0}%</div>
                      <div className="attendance-bar-container small">
                        <div 
                          className="attendance-bar-fill" 
                          style={{ width: `${player.attendance || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              {players.filter(player => (player.attendance || 0) < 50).length === 0 && (
                <p className="no-data-message">Keine Spieler mit niedriger Anwesenheit.</p>
              )}
              <div className="view-all">
                <Button 
                  variant="text" 
                  onClick={() => window.location.href = `/trainer/teams/${user?.teamId}/players`}
                >
                  Alle Spieler anzeigen
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TrainerDashboardPage;
