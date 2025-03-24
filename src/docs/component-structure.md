# Frontend-Architektur: Komponentenstruktur

Die Team-Manager-App wird eine modulare Komponentenstruktur verwenden, um Code-Wiederverwendung zu maximieren und die Wartbarkeit zu verbessern.

## Layout-Komponenten

- **AppLayout**
  - Hauptlayout mit Navigation und Authentifizierungsprüfung
  - Unterschiedliche Navigationsoptionen je nach Benutzerrolle

- **AuthLayout**
  - Layout für nicht-authentifizierte Seiten (Login, Signup, Passwort-Reset)

## UI-Komponenten

- **Button**
  - Wiederverwendbare Button-Komponente mit verschiedenen Stilen
  - Varianten: Primary, Secondary, Danger, Success

- **Card**
  - Container-Komponente für strukturierte Inhalte

- **Modal**
  - Wiederverwendbare Modal-Komponente für Dialoge und Formulare

- **Table**
  - Datenanzeigekomponente mit Sortier- und Filterfunktionen

- **Form**
  - Formularkomponenten mit Validierung
  - Unterkomponenten: Input, Select, Checkbox, DatePicker

- **Alert**
  - Benachrichtigungskomponente für Erfolgs- und Fehlermeldungen

- **Loader**
  - Ladeanimation für asynchrone Operationen

- **Avatar**
  - Benutzerprofilbild mit Fallback für fehlende Bilder

- **Badge**
  - Statusanzeige für Teilnahmestatus (Zugesagt, Abgesagt, Ausstehend)

## Funktionale Komponenten

- **Calendar**
  - Kalenderansicht für Termine
  - Tages-, Wochen- und Monatsansicht

- **EventCard**
  - Kompakte Darstellung eines Termins
  - Anzeige von Datum, Uhrzeit, Ort und Teilnahmestatus

- **PlayerList**
  - Liste von Spielern mit Filterfunktion
  - Anzeige von Spielerinformationen und Teilnahmestatus

- **TeamSelector**
  - Dropdown zur Auswahl eines Teams
  - Filtert Daten basierend auf ausgewähltem Team

- **TagSelector**
  - Mehrfachauswahl von Tags für Filterung
  - Wird für Spieler- und Terminfilterung verwendet

- **AttendanceTracker**
  - Komponente zur Anzeige und Aktualisierung des Teilnahmestatus
  - Unterschiedliches Verhalten je nach Benutzerrolle

- **StatisticsChart**
  - Visualisierung von Anwesenheitsstatistiken
  - Verschiedene Diagrammtypen (Balken, Linien, Kreisdiagramme)

## Auth-Komponenten

- **PrivateRoute**
  - Schützt Routen vor nicht-authentifizierten Zugriff
  - Prüft auch rollenbasierte Berechtigungen

- **RoleBasedAccess**
  - Komponente zur bedingten Renderung basierend auf Benutzerrolle
  - Versteckt UI-Elemente für nicht-berechtigte Benutzer

## Daten-Komponenten

- **QueryProvider**
  - React Query Provider für globales State Management
  - Konfiguration für Caching und Refetching

- **ErrorBoundary**
  - Fängt und behandelt Fehler in der Komponentenhierarchie
  - Verhindert, dass die gesamte App abstürzt
