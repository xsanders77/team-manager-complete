# Team-Manager App - Projektdokumentation

## Übersicht

Die Team-Manager App ist eine webbasierte Anwendung zur Verwaltung von Sportteams, Spielern, Trainern und Terminen. Sie ermöglicht die Organisation von Trainings- und Spielterminen, die Verwaltung von Spielern und Teams sowie die Kommunikation zwischen Trainern, Spielern und Eltern.

## Benutzerrollen

Die Anwendung unterstützt vier Hauptbenutzerrollen:

1. **Administratoren**: Können Teams, Trainer und Spieler verwalten, haben vollen Zugriff auf alle Funktionen
2. **Trainer**: Leiten Teams und können Termine erstellen und verwalten
3. **Spieler**: Nehmen an Trainings und Spielen teil, können ihre Termine einsehen und zu-/absagen
4. **Eltern**: Verwalten ihre Kinder (Spieler bis ca. 14 Jahre), können Termine für ihre Kinder einsehen und zu-/absagen

## Hauptfunktionen

### Benutzerverwaltung
- Registrierung und Anmeldung
- Profilbearbeitung
- Rollenzuweisung und -verwaltung

### Teamverwaltung
- Erstellung und Bearbeitung von Teams
- Zuweisung von Spielern zu Teams
- Zuweisung von Trainern zu Teams
- Tag-System für Untermannschaften

### Spielerverwaltung
- Erstellung und Bearbeitung von Spielerprofilen
- Zuweisung zu Teams
- Verwaltung von Spielerstatistiken
- Eltern-Kind-Verknüpfung

### Terminverwaltung
- Erstellung und Bearbeitung von Trainings- und Spielterminen
- Festlegung von Start-/Endzeit, Ort, Teilnehmerlimit
- Zu- und Absagefristen
- Anwesenheitsstatistiken

## Technische Architektur

### Frontend
- React.js mit funktionalen Komponenten und Hooks
- React Router für die Navigation
- React Query für Datenabrufe und -mutationen
- CSS für das Styling
- Jest und React Testing Library für Tests

### Backend
- Node.js mit Express
- MongoDB Atlas als Datenbank
- JWT für die Authentifizierung
- RESTful API

## Komponenten

### UI-Komponenten

#### Basis-UI-Komponenten
- **Button**: Wiederverwendbare Button-Komponente mit verschiedenen Stilen
- **Card**: Komponente für strukturierte Inhalte
- **Input**: Formularfeld-Komponente
- **Alert**: Komponente für Benachrichtigungen und Warnungen
- **Modal**: Komponente für Dialoge und Popups
- **LoadingIndicator**: Komponente für Ladezustände
- **Toast**: Komponente für temporäre Benachrichtigungen

#### Funktionale Komponenten
- **ConfirmationDialog**: Komponente für Bestätigungsdialoge
- **ErrorBoundary**: Komponente zum Abfangen von Fehlern
- **AppWrapper**: Wrapper-Komponente für die gesamte Anwendung

### Seiten-Komponenten
- **LoginPage**: Anmeldeseite
- **SignupPage**: Registrierungsseite
- **DashboardPage**: Übersichtsseite für alle Benutzer
- **AdminDashboardPage**: Übersichtsseite für Administratoren
- **TrainerDashboardPage**: Übersichtsseite für Trainer
- **PlayerDashboardPage**: Übersichtsseite für Spieler
- **ParentDashboardPage**: Übersichtsseite für Eltern
- **UserManagementPage**: Seite zur Verwaltung von Benutzern
- **TeamManagementPage**: Seite zur Verwaltung von Teams
- **PlayerManagementPage**: Seite zur Verwaltung von Spielern
- **ParentChildManagementPage**: Seite zur Verwaltung von Eltern-Kind-Beziehungen
- **EventCreationPage**: Seite zur Erstellung von Terminen
- **EventManagementPage**: Seite zur Verwaltung von Terminen
- **EventResponsePage**: Seite zur Zu-/Absage von Terminen
- **ChildEventResponsePage**: Seite zur Zu-/Absage von Terminen für Kinder

### Hooks
- **useAuth**: Hook für die Authentifizierung
- **usePlayers**: Hook für Spielerdaten
- **useTeams**: Hook für Teamdaten
- **useEvents**: Hook für Termindaten
- **useTags**: Hook für Tag-Daten
- **useUsers**: Hook für Benutzerdaten
- **useDashboard**: Hook für Dashboard-Daten
- **useNotifications**: Hook für Benachrichtigungen
- **usePlayerEvents**: Hook für Spieler-Termine

### Services
- **authService**: Service für Authentifizierung
- **playerService**: Service für Spielerdaten
- **teamService**: Service für Teamdaten
- **eventService**: Service für Termindaten
- **tagService**: Service für Tag-Daten
- **userService**: Service für Benutzerdaten
- **notificationService**: Service für Benachrichtigungen
- **dashboardService**: Service für Dashboard-Daten
- **api**: Zentraler Service für API-Aufrufe

## Neue Funktionen und Verbesserungen

### Bestätigungsdialoge
Die Anwendung verwendet jetzt Bestätigungsdialoge vor wichtigen Aktionen wie dem Löschen von Daten. Dies verhindert versehentliche Datenverluste und verbessert die Benutzerfreundlichkeit.

### Verbesserte Fehlerbehandlung
Die ErrorBoundary-Komponente fängt Fehler in der Anwendung ab und zeigt benutzerfreundliche Fehlermeldungen an. Dies verbessert die Robustheit der Anwendung und bietet eine bessere Benutzererfahrung bei Fehlern.

### Ladeanimationen
Die LoadingIndicator-Komponente zeigt Ladezustände an und verbessert das Feedback für Benutzer während Datenoperationen.

### Toast-Benachrichtigungen
Das Toast-System ermöglicht temporäre Benachrichtigungen für Benutzeraktionen und Systemereignisse, was das Feedback für Benutzer verbessert.

### Zentrale App-Wrapper-Komponente
Die AppWrapper-Komponente integriert ErrorBoundary und ToastContainer und verbessert die Robustheit und Benutzerfreundlichkeit der gesamten Anwendung.

## Installation und Ausführung

### Voraussetzungen
- Node.js (v14 oder höher)
- npm (v6 oder höher)
- MongoDB Atlas-Konto (für die Datenbankverbindung)

### Frontend-Installation
1. Navigieren Sie zum Verzeichnis `team-manager-frontend`
2. Führen Sie `npm install` aus, um die Abhängigkeiten zu installieren
3. Erstellen Sie eine `.env`-Datei mit der Umgebungsvariable `VITE_API_URL` für die Backend-URL
4. Führen Sie `npm run dev` aus, um die Entwicklungsumgebung zu starten

### Backend-Installation
1. Navigieren Sie zum Verzeichnis `team-manager-backend`
2. Führen Sie `npm install` aus, um die Abhängigkeiten zu installieren
3. Erstellen Sie eine `.env`-Datei mit den folgenden Umgebungsvariablen:
   - `MONGODB_URI`: MongoDB-Verbindungs-URI
   - `JWT_SECRET`: Geheimer Schlüssel für JWT
   - `PORT`: Port für den Server (Standard: 3000)
4. Führen Sie `npm start` aus, um den Server zu starten

## Tests

### Frontend-Tests
- Führen Sie `npm test` im Verzeichnis `team-manager-frontend` aus, um die Tests auszuführen
- Führen Sie `npm run test:coverage` aus, um die Testabdeckung zu überprüfen

### Backend-Tests
- Führen Sie `npm test` im Verzeichnis `team-manager-backend` aus, um die Tests auszuführen

## Entwicklungsstand

Die Anwendung befindet sich in der Entwicklungsphase und enthält bereits die folgenden funktionierenden Komponenten:

- Authentifizierung (Login, Registrierung)
- Benutzerverwaltung
- Teamverwaltung
- Spielerverwaltung
- Eltern-Kind-Verwaltung
- Terminverwaltung (teilweise)

Die nächsten Entwicklungsschritte umfassen:

- Vollständige Implementierung der Terminverwaltung
- Implementierung von Benachrichtigungen
- Verbesserung der Benutzeroberfläche
- Implementierung von Statistiken und Berichten

## Bekannte Probleme

- Die Anwendung ist noch nicht vollständig responsiv für mobile Geräte
- Einige Funktionen sind noch nicht vollständig implementiert
- Die Testabdeckung ist noch nicht vollständig

## Mitwirkende

- Team-Manager-Entwicklungsteam

## Lizenz

- Proprietär
