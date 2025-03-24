import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import './DashboardPage.css';

/**
 * Dashboard-Seite mit rollenspezifischem Inhalt
 * 
 * @returns {JSX.Element} DashboardPage-Komponente
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState({
    show: true,
    message: 'Willkommen zurück! Hier sehen Sie die neuesten Informationen.',
    type: 'info'
  });

  const dismissNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  // Rollenspezifischer Inhalt
  const renderRoleSpecificContent = () => {
    const role = user?.role;

    switch (role) {
      case 'admin':
        return (
          <div className="dashboard-admin">
            <Card title="Vereinsübersicht">
              <div className="dashboard-stats">
                <div className="stat-item">
                  <h3>Teams</h3>
                  <p className="stat-value">15</p>
                </div>
                <div className="stat-item">
                  <h3>Trainer</h3>
                  <p className="stat-value">22</p>
                </div>
                <div className="stat-item">
                  <h3>Spieler</h3>
                  <p className="stat-value">187</p>
                </div>
                <div className="stat-item">
                  <h3>Termine</h3>
                  <p className="stat-value">45</p>
                </div>
              </div>
            </Card>
            <Card title="Letzte Aktivitäten">
              <ul className="activity-list">
                <li className="activity-item">
                  <span className="activity-time">Heute, 10:23</span>
                  <span className="activity-text">Neuer Trainer "Max Mustermann" wurde hinzugefügt</span>
                </li>
                <li className="activity-item">
                  <span className="activity-time">Gestern, 15:45</span>
                  <span className="activity-text">Team "E-Jugend" wurde aktualisiert</span>
                </li>
                <li className="activity-item">
                  <span className="activity-time">12.03.2025, 09:30</span>
                  <span className="activity-text">5 neue Spieler wurden registriert</span>
                </li>
              </ul>
            </Card>
          </div>
        );

      case 'trainer':
        return (
          <div className="dashboard-trainer">
            <Card title="Meine Teams">
              <ul className="team-list">
                <li className="team-item">
                  <h3>E-Jugend</h3>
                  <p>25 Spieler</p>
                  <a href="/trainer/teams/1/players" className="team-link">Verwalten</a>
                </li>
                <li className="team-item">
                  <h3>F-Jugend</h3>
                  <p>18 Spieler</p>
                  <a href="/trainer/teams/2/players" className="team-link">Verwalten</a>
                </li>
              </ul>
            </Card>
            <Card title="Anstehende Termine">
              <ul className="event-list">
                <li className="event-item">
                  <div className="event-date">
                    <span className="event-day">15</span>
                    <span className="event-month">Mär</span>
                  </div>
                  <div className="event-details">
                    <h4>Training E-Jugend</h4>
                    <p>17:00 - 18:30 | Sportplatz Nord</p>
                    <span className="event-status">12/25 Zusagen</span>
                  </div>
                </li>
                <li className="event-item">
                  <div className="event-date">
                    <span className="event-day">18</span>
                    <span className="event-month">Mär</span>
                  </div>
                  <div className="event-details">
                    <h4>Spiel vs. FC Adler</h4>
                    <p>15:00 - 16:30 | Auswärts</p>
                    <span className="event-status">15/18 Zusagen</span>
                  </div>
                </li>
              </ul>
              <a href="/trainer/events" className="view-all">Alle Termine anzeigen</a>
            </Card>
          </div>
        );

      case 'player':
        return (
          <div className="dashboard-player">
            <Card title="Mein Team">
              <div className="player-team">
                <h3>E-Jugend</h3>
                <p>Trainer: Thomas Schmidt</p>
              </div>
            </Card>
            <Card title="Anstehende Termine">
              <ul className="event-list">
                <li className="event-item">
                  <div className="event-date">
                    <span className="event-day">15</span>
                    <span className="event-month">Mär</span>
                  </div>
                  <div className="event-details">
                    <h4>Training</h4>
                    <p>17:00 - 18:30 | Sportplatz Nord</p>
                    <div className="event-actions">
                      <button className="btn-accept">Zusagen</button>
                      <button className="btn-decline">Absagen</button>
                    </div>
                  </div>
                </li>
                <li className="event-item">
                  <div className="event-date">
                    <span className="event-day">18</span>
                    <span className="event-month">Mär</span>
                  </div>
                  <div className="event-details">
                    <h4>Spiel vs. FC Adler</h4>
                    <p>15:00 - 16:30 | Auswärts</p>
                    <div className="event-actions">
                      <button className="btn-accept active">Zugesagt</button>
                    </div>
                  </div>
                </li>
              </ul>
              <a href="/player/events" className="view-all">Alle Termine anzeigen</a>
            </Card>
          </div>
        );

      case 'parent':
        return (
          <div className="dashboard-parent">
            <Card title="Meine Kinder">
              <ul className="children-list">
                <li className="child-item">
                  <h3>Emma Müller</h3>
                  <p>E-Jugend | Trainer: Thomas Schmidt</p>
                  <a href="/parent/children/1/events" className="child-link">Termine verwalten</a>
                </li>
                <li className="child-item">
                  <h3>Lukas Müller</h3>
                  <p>F-Jugend | Trainer: Sarah Weber</p>
                  <a href="/parent/children/2/events" className="child-link">Termine verwalten</a>
                </li>
              </ul>
            </Card>
            <Card title="Anstehende Termine">
              <ul className="event-list">
                <li className="event-item">
                  <div className="event-date">
                    <span className="event-day">15</span>
                    <span className="event-month">Mär</span>
                  </div>
                  <div className="event-details">
                    <h4>Training E-Jugend (Emma)</h4>
                    <p>17:00 - 18:30 | Sportplatz Nord</p>
                    <div className="event-actions">
                      <button className="btn-accept">Zusagen</button>
                      <button className="btn-decline">Absagen</button>
                    </div>
                  </div>
                </li>
                <li className="event-item">
                  <div className="event-date">
                    <span className="event-day">16</span>
                    <span className="event-month">Mär</span>
                  </div>
                  <div className="event-details">
                    <h4>Training F-Jugend (Lukas)</h4>
                    <p>16:00 - 17:15 | Sportplatz Süd</p>
                    <div className="event-actions">
                      <button className="btn-accept active">Zugesagt</button>
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <p>Willkommen bei der Team-Manager-App!</p>
          </Card>
        );
    }
  };

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Dashboard</h1>
      
      {notification.show && (
        <Alert 
          type={notification.type} 
          message={notification.message} 
          dismissible={true}
          onDismiss={dismissNotification}
        />
      )}
      
      {renderRoleSpecificContent()}
    </div>
  );
};

export default DashboardPage;
