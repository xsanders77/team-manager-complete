import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import RoleBasedRedirect from './components/auth/RoleBasedRedirect';

// Layouts
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
// Placeholder für PasswordResetPage, wird später implementiert
const PasswordResetPage = () => <div>Password Reset Page (Coming Soon)</div>;

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import TeamManagementPage from './pages/TeamManagementPage';
import UserManagementPage from './pages/UserManagementPage';

// Trainer Pages
import TrainerDashboardPage from './pages/TrainerDashboardPage';
import PlayerManagementPage from './pages/PlayerManagementPage';
import TagManagementPage from './pages/TagManagementPage';
import EventCreationPage from './pages/EventCreationPage';
import EventManagementPage from './pages/EventManagementPage';
const EventDetailPage = () => <div>Event Detail (Coming Soon)</div>;

// Player Pages
import PlayerDashboardPage from './pages/PlayerDashboardPage';
const EventListPage = () => <div>Event List (Coming Soon)</div>;
import EventResponsePage from './pages/EventResponsePage';

// Parent Pages
import ParentDashboardPage from './pages/ParentDashboardPage';
import ChildManagementPage from './pages/ChildManagementPage';
const ChildEventListPage = () => <div>Child Event List (Coming Soon)</div>;
import ChildEventResponsePage from './pages/ChildEventResponsePage';

//Team Pages
import TeamDetailPage from './pages/TeamDetailPage';


// Common Pages - Placeholders, werden später implementiert
const ProfilePage = () => <div>Profile (Coming Soon)</div>;
const NotificationsPage = () => <div>Notifications (Coming Soon)</div>;
const CalendarPage = () => <div>Calendar (Coming Soon)</div>;
const NotFoundPage = () => <div>404 - Page Not Found</div>;

/**
 * App-Komponente mit Routing-Konfiguration
 * 
 * @returns {React.ReactElement}
 */
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Öffentliche Routen */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<PasswordResetPage />} />
          </Route>
          
          {/* Geschützte Routen */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              {/* Admin-Routen */}
              <Route element={<RoleBasedRoute roles={['admin']} redirectTo="/dashboard" />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/teams" element={<TeamManagementPage />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/teams/:teamId" element={<TeamDetailPage />} />
              </Route>
              
              {/* Trainer-Routen */}
              <Route element={<RoleBasedRoute roles={['trainer']} redirectTo="/dashboard" />}>
                <Route path="/trainer" element={<TrainerDashboardPage />} />
                <Route path="/trainer/teams/:teamId/players" element={<PlayerManagementPage />} />
                <Route path="/trainer/teams/:teamId/tags" element={<TagManagementPage />} />
                <Route path="/trainer/events/create" element={<EventCreationPage />} />
                <Route path="/trainer/events" element={<EventManagementPage />} />
                <Route path="/trainer/events/:eventId" element={<EventDetailPage />} />
              </Route>
              
              {/* Spieler-Routen */}
              <Route element={<RoleBasedRoute roles={['player']} redirectTo="/dashboard" />}>
                <Route path="/player" element={<PlayerDashboardPage />} />
                <Route path="/player/events" element={<EventListPage />} />
                <Route path="/player/events/:eventId" element={<EventResponsePage />} />
              </Route>
              
              {/* Eltern-Routen */}
              <Route element={<RoleBasedRoute roles={['parent']} redirectTo="/dashboard" />}>
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
              <Route path="/dashboard" element={<RoleBasedRedirect />} />
            </Route>
          </Route>
          
          {/* Fallback für nicht gefundene Routen */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
