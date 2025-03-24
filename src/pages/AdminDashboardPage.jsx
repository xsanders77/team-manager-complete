import React from 'react';
import Card from '../components/ui/Card';
import { useTeams } from '../hooks/useTeams';
import { useUsers } from '../hooks/useUsers';
import { useEvents } from '../hooks/useEvents';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import './AdminDashboardPage.css';

/**
 * AdminDashboardPage - Übersichtsseite für Administratoren
 * Zeigt eine Zusammenfassung aller Teams, Benutzer und Termine
 * 
 * @returns {JSX.Element} AdminDashboardPage-Komponente
 */
const AdminDashboardPage = () => {
  const { data: teams = [], isLoading: teamsLoading, error: teamsError } = useTeams();
  const { data: users = [], isLoading: usersLoading, error: usersError } = useUsers();
  const { data: events = [], isLoading: eventsLoading, error: eventsError } = useEvents();

  // Berechne Statistiken
  const stats = {
    totalTeams: teams.length,
    totalUsers: users.length,
    totalEvents: events.length,
    usersByRole: {
      admin: users.filter(user => user.role === 'admin').length,
      trainer: users.filter(user => user.role === 'trainer').length,
      player: users.filter(user => user.role === 'player').length,
      parent: users.filter(user => user.role === 'parent').length
    },
    upcomingEvents: events.filter(event => new Date(event.startTime) > new Date()).length
  };

  // Lade-Status
  const isLoading = teamsLoading || usersLoading || eventsLoading;
  
  // Fehler-Status
  const hasError = teamsError || usersError || eventsError;
  const errorMessage = teamsError?.message || usersError?.message || eventsError?.message;

  if (isLoading) {
    return <div className="loading">Lade Dashboard-Daten...</div>;
  }

  if (hasError) {
    return <Alert type="error" message={`Fehler beim Laden der Dashboard-Daten: ${errorMessage}`} />;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      {/* Statistik-Karten */}
      <div className="stats-grid">
        <Card>
          <div className="stat-card">
            <h2>Teams</h2>
            <div className="stat-value">{stats.totalTeams}</div>
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = '/admin/teams'}
            >
              Teams verwalten
            </Button>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <h2>Benutzer</h2>
            <div className="stat-value">{stats.totalUsers}</div>
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = '/admin/users'}
            >
              Benutzer verwalten
            </Button>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <h2>Termine</h2>
            <div className="stat-value">{stats.totalEvents}</div>
            <div className="stat-detail">
              <span>{stats.upcomingEvents} anstehende Termine</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Benutzerrollen-Übersicht */}
      <Card title="Benutzerrollen-Verteilung">
        <div className="roles-distribution">
          <div className="role-item">
            <span className="role-label">Administratoren:</span>
            <span className="role-value">{stats.usersByRole.admin}</span>
          </div>
          <div className="role-item">
            <span className="role-label">Trainer:</span>
            <span className="role-value">{stats.usersByRole.trainer}</span>
          </div>
          <div className="role-item">
            <span className="role-label">Spieler:</span>
            <span className="role-value">{stats.usersByRole.player}</span>
          </div>
          <div className="role-item">
            <span className="role-label">Eltern:</span>
            <span className="role-value">{stats.usersByRole.parent}</span>
          </div>
        </div>
      </Card>

      {/* Letzte Teams */}
      <Card title="Teams">
        <div className="recent-teams">
          {teams.length === 0 ? (
            <p>Keine Teams vorhanden.</p>
          ) : (
            <div className="teams-list">
              {teams.slice(0, 5).map(team => (
                <div key={team._id || team.id} className="team-list-item">
                  <div className="team-info">
                    <span className="team-name">{team.name}</span>
                    <span className="team-age-group">{team.ageGroup}</span>
                  </div>
                  <div className="team-stats">
                    <span>{team.players ? team.players.length : 0} Spieler</span>
                    <span>{team.trainers ? team.trainers.length : 0} Trainer</span>
                  </div>
                </div>
              ))}
              {teams.length > 5 && (
                <div className="view-all">
                  <Button 
                    variant="text" 
                    onClick={() => window.location.href = '/admin/teams'}
                  >
                    Alle Teams anzeigen
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Letzte Benutzer */}
      <Card title="Kürzlich registrierte Benutzer">
        <div className="recent-users">
          {users.length === 0 ? (
            <p>Keine Benutzer vorhanden.</p>
          ) : (
            <div className="users-list">
              {users.slice(-5).reverse().map(user => (
                <div key={user._id || user.id} className="user-list-item">
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <div className="user-role">
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
              {users.length > 5 && (
                <div className="view-all">
                  <Button 
                    variant="text" 
                    onClick={() => window.location.href = '/admin/users'}
                  >
                    Alle Benutzer anzeigen
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
