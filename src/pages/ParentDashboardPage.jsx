import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { useParentChildren } from '../hooks/usePlayers';
import './ParentDashboardPage.css';

/**
 * ParentDashboardPage - Übersichtsseite für Eltern
 * Zeigt eine Übersicht über alle Kinder und deren anstehende Termine
 * 
 * @returns {JSX.Element} ParentDashboardPage-Komponente
 */
const ParentDashboardPage = () => {
  const { user } = useAuth();
  const { data: children = [], isLoading, error } = useParentChildren(user?.id);

  // Berechne Statistiken
  const stats = {
    totalChildren: children.length,
    upcomingEvents: children.reduce((sum, child) => sum + (child.upcomingEvents?.length || 0), 0)
  };

  if (isLoading) {
    return <div className="loading">Lade Dashboard-Daten...</div>;
  }

  if (error) {
    return <Alert type="error" message={`Fehler beim Laden der Dashboard-Daten: ${error.message}`} />;
  }

  return (
    <div className="parent-dashboard-page">
      <div className="parent-dashboard-header">
        <h1>Eltern Dashboard</h1>
      </div>

      {/* Statistik-Karten */}
      <div className="stats-grid">
        <Card>
          <div className="stat-card">
            <h2>Kinder</h2>
            <div className="stat-value">{stats.totalChildren}</div>
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = '/parent/children'}
            >
              Kinder verwalten
            </Button>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <h2>Anstehende Termine</h2>
            <div className="stat-value">{stats.upcomingEvents}</div>
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = '/calendar'}
            >
              Kalender anzeigen
            </Button>
          </div>
        </Card>
      </div>

      {/* Schnellzugriff */}
      <Card title="Schnellzugriff">
        <div className="quick-actions">
          <Button onClick={() => window.location.href = '/parent/children'}>
            Kinder verwalten
          </Button>
          <Button onClick={() => window.location.href = '/calendar'}>
            Kalender anzeigen
          </Button>
          <Button onClick={() => window.location.href = '/profile'}>
            Profil bearbeiten
          </Button>
        </div>
      </Card>

      {/* Kinder-Übersicht */}
      <Card title="Meine Kinder">
        <div className="children-overview">
          {children.length === 0 ? (
            <p className="no-data-message">Keine Kinder registriert. Bitte fügen Sie Ihre Kinder hinzu.</p>
          ) : (
            <div className="children-list">
              {children.map(child => (
                <div key={child._id || child.id} className="child-card">
                  <div className="child-info">
                    <h3 className="child-name">{child.name}</h3>
                    <div className="child-details">
                      <div className="child-detail-item">
                        <span className="detail-label">Alter:</span>
                        <span className="detail-value">{calculateAge(child.birthdate)} Jahre</span>
                      </div>
                      <div className="child-detail-item">
                        <span className="detail-label">Team:</span>
                        <span className="detail-value">{child.team || 'Kein Team'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="child-events">
                    <h4>Anstehende Termine</h4>
                    {child.upcomingEvents && child.upcomingEvents.length > 0 ? (
                      <div className="upcoming-events-list">
                        {child.upcomingEvents.slice(0, 2).map(event => (
                          <div key={event._id || event.id} className="event-item">
                            <div className="event-date">{formatDate(event.date)}</div>
                            <div className="event-title">{event.title}</div>
                            <div className="event-status">
                              {renderParticipationStatus(event.participation)}
                            </div>
                          </div>
                        ))}
                        {child.upcomingEvents.length > 2 && (
                          <Button 
                            variant="text" 
                            size="small"
                            onClick={() => window.location.href = `/parent/children/${child._id || child.id}/events`}
                          >
                            Alle Termine anzeigen
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="no-events-message">Keine anstehenden Termine.</p>
                    )}
                  </div>
                  <div className="child-actions">
                    <Button 
                      onClick={() => window.location.href = `/parent/children/${child._id || child.id}/events`}
                    >
                      Termine verwalten
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="add-child-action">
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = '/parent/children'}
            >
              {children.length > 0 ? 'Kinder verwalten' : 'Kind hinzufügen'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Hilfsfunktionen
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

const formatDate = (dateString) => {
  const options = { weekday: 'short', day: '2-digit', month: '2-digit' };
  return new Date(dateString).toLocaleDateString('de-DE', options);
};

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

export default ParentDashboardPage;
