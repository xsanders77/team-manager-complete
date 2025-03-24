import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { useUsers, useCreateUser, useDeleteUser, useChangeRole } from '../hooks/useUsers';
import './UserManagementPage.css';

/**
 * Seite zur Verwaltung von Benutzern (Admin-Rolle)
 * 
 * @returns {JSX.Element} UserManagementPage-Komponente
 */
const UserManagementPage = () => {
  const { data: users = [], isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();
  const changeRoleMutation = useChangeRole();
  
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'player' });
  const [notification, setNotification] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    // Einfache Validierung
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      setNotification({
        type: 'error',
        message: 'Bitte füllen Sie alle Felder aus.'
      });
      return;
    }
    
    try {
      await createUserMutation.mutateAsync(newUser);
      setNewUser({ name: '', email: '', password: '', role: 'player' });
      setShowNewUserForm(false);
      setNotification({
        type: 'success',
        message: `Benutzer "${newUser.name}" wurde erfolgreich erstellt.`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Erstellen des Benutzers: ${error.message}`
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    // In der realen App würde hier eine Bestätigungsdialog angezeigt werden
    try {
      await deleteUserMutation.mutateAsync(userId);
      setNotification({
        type: 'success',
        message: 'Benutzer wurde erfolgreich gelöscht.'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Löschen des Benutzers: ${error.message}`
      });
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await changeRoleMutation.mutateAsync({ userId, role: newRole });
      setNotification({
        type: 'success',
        message: 'Benutzerrolle wurde erfolgreich geändert.'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Ändern der Benutzerrolle: ${error.message}`
      });
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  if (isLoading) {
    return <div className="loading">Lade Benutzer...</div>;
  }

  if (error) {
    return <Alert type="error" message={`Fehler beim Laden der Benutzer: ${error.message}`} />;
  }

  return (
    <div className="user-management-page">
      <div className="user-management-header">
        <h1>Benutzer-Verwaltung</h1>
        <Button 
          onClick={() => setShowNewUserForm(true)}
          disabled={showNewUserForm || createUserMutation.isPending}
        >
          Neuen Benutzer erstellen
        </Button>
      </div>
      
      {notification && (
        <Alert 
          type={notification.type} 
          message={notification.message} 
          dismissible={true}
          onDismiss={dismissNotification}
        />
      )}
      
      {showNewUserForm && (
        <Card title="Neuen Benutzer erstellen">
          <form onSubmit={handleCreateUser} className="new-user-form">
            <Input
              id="name"
              name="name"
              label="Name"
              value={newUser.name}
              onChange={handleInputChange}
              placeholder="Vor- und Nachname"
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="E-Mail"
              value={newUser.email}
              onChange={handleInputChange}
              placeholder="email@beispiel.de"
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Passwort"
              value={newUser.password}
              onChange={handleInputChange}
              placeholder="Passwort"
              required
            />
            <div className="form-group">
              <label htmlFor="role">Rolle</label>
              <select
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                required
                className="select-input"
              >
                <option value="admin">Administrator</option>
                <option value="trainer">Trainer</option>
                <option value="player">Spieler</option>
                <option value="parent">Elternteil</option>
              </select>
            </div>
            <div className="form-actions">
              <Button 
                type="submit" 
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? 'Wird erstellt...' : 'Benutzer erstellen'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowNewUserForm(false)}
                disabled={createUserMutation.isPending}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <Card title="Benutzer">
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Rolle</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-users">
                    Keine Benutzer vorhanden. Erstellen Sie Ihren ersten Benutzer.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id || user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user._id || user.id, e.target.value)}
                        className="role-select"
                        disabled={changeRoleMutation.isPending}
                      >
                        <option value="admin">Administrator</option>
                        <option value="trainer">Trainer</option>
                        <option value="player">Spieler</option>
                        <option value="parent">Elternteil</option>
                      </select>
                    </td>
                    <td>
                      <div className="user-actions">
                        <Button 
                          variant="secondary" 
                          size="small"
                          onClick={() => window.location.href = `/admin/users/${user._id || user.id}`}
                        >
                          Details
                        </Button>
                        <Button 
                          variant="danger" 
                          size="small"
                          onClick={() => handleDeleteUser(user._id || user.id)}
                          disabled={deleteUserMutation.isPending}
                        >
                          {deleteUserMutation.isPending && deleteUserMutation.variables === user._id ? 
                            'Wird gelöscht...' : 'Löschen'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagementPage;
