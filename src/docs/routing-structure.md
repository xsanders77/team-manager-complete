# Frontend-Architektur: Routing-Struktur

Die Team-Manager-App wird React Router für die Navigation verwenden. Hier ist die geplante Routing-Struktur:

## Öffentliche Routen
- `/login` - LoginPage
- `/signup` - SignupPage
- `/reset-password` - PasswordResetPage

## Geschützte Routen
Alle folgenden Routen erfordern Authentifizierung und werden durch die `PrivateRoute`-Komponente geschützt.

### Admin-Routen (erfordern Admin-Rolle)
- `/admin` - AdminDashboardPage
- `/admin/teams` - TeamManagementPage
- `/admin/teams/:teamId` - TeamDetailPage
- `/admin/users` - UserManagementPage

### Trainer-Routen (erfordern Trainer-Rolle)
- `/trainer` - TrainerDashboardPage
- `/trainer/teams/:teamId/players` - PlayerManagementPage
- `/trainer/teams/:teamId/tags` - TagManagementPage
- `/trainer/events/create` - EventCreationPage
- `/trainer/events` - EventManagementPage
- `/trainer/events/:eventId` - EventDetailPage

### Spieler-Routen (erfordern Spieler-Rolle)
- `/player` - PlayerDashboardPage
- `/player/events` - EventListPage
- `/player/events/:eventId` - EventResponsePage

### Eltern-Routen (erfordern Eltern-Rolle)
- `/parent` - ParentDashboardPage
- `/parent/children` - ChildManagementPage
- `/parent/children/:childId/events` - ChildEventListPage
- `/parent/children/:childId/events/:eventId` - ChildEventResponsePage

### Gemeinsame Routen (für alle authentifizierten Benutzer)
- `/profile` - ProfilePage
- `/notifications` - NotificationsPage
- `/calendar` - CalendarPage

## Routing-Logik

```jsx
// Beispiel für die grundlegende Routing-Struktur
<BrowserRouter>
  <Routes>
    {/* Öffentliche Routen */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/reset-password" element={<PasswordResetPage />} />
    
    {/* Geschützte Routen */}
    <Route element={<PrivateRoute />}>
      {/* Admin-Routen */}
      <Route element={<RoleBasedRoute roles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/teams" element={<TeamManagementPage />} />
        <Route path="/admin/teams/:teamId" element={<TeamDetailPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
      </Route>
      
      {/* Trainer-Routen */}
      <Route element={<RoleBasedRoute roles={['trainer']} />}>
        <Route path="/trainer" element={<TrainerDashboardPage />} />
        <Route path="/trainer/teams/:teamId/players" element={<PlayerManagementPage />} />
        <Route path="/trainer/teams/:teamId/tags" element={<TagManagementPage />} />
        <Route path="/trainer/events/create" element={<EventCreationPage />} />
        <Route path="/trainer/events" element={<EventManagementPage />} />
        <Route path="/trainer/events/:eventId" element={<EventDetailPage />} />
      </Route>
      
      {/* Spieler-Routen */}
      <Route element={<RoleBasedRoute roles={['player']} />}>
        <Route path="/player" element={<PlayerDashboardPage />} />
        <Route path="/player/events" element={<EventListPage />} />
        <Route path="/player/events/:eventId" element={<EventResponsePage />} />
      </Route>
      
      {/* Eltern-Routen */}
      <Route element={<RoleBasedRoute roles={['parent']} />}>
        <Route path="/parent" element={<ParentDashboardPage />} />
        <Route path="/parent/children" element={<ChildManagementPage />} />
        <Route path="/parent/children/:childId/events" element={<ChildEventListPage />} />
        <Route path="/parent/children/:childId/events/:eventId" element={<ChildEventResponsePage />} />
      </Route>
      
      {/* Gemeinsame Routen */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      
      {/* Fallback für die Startseite basierend auf der Rolle */}
      <Route path="/" element={<RoleBasedRedirect />} />
    </Route>
    
    {/* Fallback für nicht gefundene Routen */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</BrowserRouter>
```

## Rollenbasierte Umleitung

Die `RoleBasedRedirect`-Komponente leitet Benutzer basierend auf ihrer Rolle zur entsprechenden Startseite weiter:

- Admin → `/admin`
- Trainer → `/trainer`
- Spieler → `/player`
- Eltern → `/parent`

Dies stellt sicher, dass jeder Benutzer nach der Anmeldung die für ihn relevante Ansicht sieht.
