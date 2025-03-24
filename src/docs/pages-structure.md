# Frontend-Architektur: Seitenstruktur

Basierend auf der Analyse der Anforderungen und des bestehenden Codes, benötigt die Team-Manager-App folgende Seiten:

## Öffentliche Seiten
- **LoginPage** ✓ (bereits vorhanden)
- **SignupPage** ✓ (bereits vorhanden)
- **PasswordResetPage** (neu)

## Admin-Seiten
- **AdminDashboardPage** (neu)
  - Übersicht über alle Teams
  - Statistiken und Kennzahlen
- **TeamManagementPage** (neu)
  - Erstellung und Verwaltung von Teams
  - Zuweisung von Trainern zu Teams
- **UserManagementPage** (neu)
  - Verwaltung aller Benutzer
  - Rollenzuweisung

## Trainer-Seiten
- **TrainerDashboardPage** (neu)
  - Übersicht über eigene Teams
  - Anstehende Termine
- **PlayerManagementPage** (neu)
  - Verwaltung der Spieler in eigenen Teams
  - Spieler-Statistiken
- **EventCreationPage** (neu)
  - Erstellung von Einzel- und Serienterminen
- **EventManagementPage** (neu)
  - Verwaltung bestehender Termine
  - Teilnehmerverwaltung
- **TagManagementPage** ✓ (bereits vorhanden)
  - Verwaltung von Tags für Spieler und Termine

## Spieler-Seiten
- **PlayerDashboardPage** (neu)
  - Übersicht über anstehende Termine
  - Persönliche Statistiken
- **EventResponsePage** (neu)
  - Zu-/Absagen zu Terminen
  - Detailansicht von Terminen

## Eltern-Seiten
- **ParentDashboardPage** (neu)
  - Übersicht über alle Kinder
  - Anstehende Termine aller Kinder
- **ChildManagementPage** (neu)
  - Verwaltung der eigenen Kinder
  - Hinzufügen neuer Kinder
- **ChildEventResponsePage** (neu)
  - Zu-/Absagen zu Terminen für Kinder
  - Detailansicht von Terminen der Kinder

## Gemeinsame Komponenten
- **ProfilePage** (neu)
  - Bearbeitung des eigenen Profils
  - Passwortänderung
- **NotificationsPage** (neu)
  - Übersicht über Benachrichtigungen
- **CalendarPage** (neu)
  - Kalenderansicht aller relevanten Termine
